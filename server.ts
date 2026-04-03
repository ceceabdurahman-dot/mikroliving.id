import { createApp } from "./backend/app";
import { PORT } from "./backend/config/env";

async function startServer() {
  const app = await createApp();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
