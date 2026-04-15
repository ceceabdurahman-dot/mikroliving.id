import { readFileSync } from "fs";
import cors, { CorsOptionsDelegate } from "cors";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import express, { Request } from "express";
import helmet from "helmet";
import path from "path";
import { errorHandler } from "./middleware/errorHandler";
import { apiNotFoundHandler } from "./middleware/notFound";
import { requestId } from "./middleware/requestId";
import { requestLogger } from "./middleware/requestLogger";
import { createApiRouter } from "./routes/api";
import { isTrustedRequestOrigin } from "./security/requestOrigin";

function isProductionRuntime() {
  if (process.env.NODE_ENV === "production") {
    return true;
  }

  const entryFile = process.argv[1] ?? "";
  return entryFile.includes(`${path.sep}build${path.sep}server.js`) || entryFile.endsWith("build/server.js");
}

export async function createApp() {
  const app = express();
  const productionRuntime = isProductionRuntime();
  const corsOptionsDelegate: CorsOptionsDelegate<Request> = (req, callback) => {
    const origin = req.headers.origin;
    callback(null, {
      credentials: true,
      origin: origin && isTrustedRequestOrigin(origin, req.headers.host) ? origin : false,
    });
  };
  const csrfProtection = csrf({
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: productionRuntime,
    },
    ignoreMethods: ["GET", "HEAD", "OPTIONS"],
  });

  app.disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(cors(corsOptionsDelegate));
  app.use(cookieParser());
  app.use("/api", requestId);
  app.use("/api", express.json({ limit: "10mb" }));
  app.use("/api", csrfProtection);
  app.use("/api", requestLogger, createApiRouter());
  app.use("/api", apiNotFoundHandler);

  if (!productionRuntime) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const indexPath = path.join(distPath, "index.html");
    const indexHtml = readFileSync(indexPath, "utf8");
    app.use(express.static(distPath));

    // Serve the SPA shell for client-side routes like /admin while keeping
    // real asset/file misses available for normal 404 handling.
    app.use((req, res, next) => {
      if (req.method !== "GET") {
        next();
        return;
      }

      if (path.extname(req.path)) {
        next();
        return;
      }

      res.type("html").send(indexHtml);
    });
  }

  app.use(errorHandler);

  return app;
}
