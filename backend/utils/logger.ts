import {
  createWriteStream,
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
  unlinkSync,
  WriteStream,
} from "fs";
import path from "path";

const REDACTED = "[REDACTED]";
const SENSITIVE_KEY_PATTERN = /(pass(word)?|token|secret|authorization|cookie|api[-_]?key|jwt|session|credential)/i;
const MAX_STRING_LENGTH = 300;
const MAX_DEPTH = 4;
const INFO_LOG_FILE = process.env.LOG_INFO_FILE?.trim();
const ERROR_LOG_FILE = process.env.LOG_ERROR_FILE?.trim();
const LOG_MAX_SIZE_MB = Number(process.env.LOG_MAX_SIZE_MB || "10");
const LOG_MAX_FILES = Number(process.env.LOG_MAX_FILES || "5");
const LOG_MAX_SIZE_BYTES = Number.isFinite(LOG_MAX_SIZE_MB) && LOG_MAX_SIZE_MB > 0 ? LOG_MAX_SIZE_MB * 1024 * 1024 : 10 * 1024 * 1024;
const LOG_FILE_COUNT = Number.isFinite(LOG_MAX_FILES) && LOG_MAX_FILES > 0 ? Math.floor(LOG_MAX_FILES) : 5;
const SERVICE_NAME = process.env.LOG_SERVICE_NAME?.trim() || "mikro-living";
const SERVICE_ENVIRONMENT = (() => {
  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }

  const entryFile = process.argv[1] ?? "";
  if (entryFile.includes(`${path.sep}build${path.sep}server.js`) || entryFile.endsWith("build/server.js")) {
    return "production";
  }

  return "development";
})();
const EVENT_DATASET = `${SERVICE_NAME}.app`;

export type LogLevel = "info" | "warn" | "error";

type LogTransport = {
  filePath?: string;
  stream: WriteStream | null;
};

function createLogStream(filePath?: string): WriteStream | null {
  if (!filePath) {
    return null;
  }

  mkdirSync(path.dirname(filePath), { recursive: true });
  return createWriteStream(filePath, { flags: "a" });
}

function rotateLogFiles(filePath: string) {
  for (let index = LOG_FILE_COUNT - 1; index >= 1; index -= 1) {
    const source = `${filePath}.${index}`;
    const target = `${filePath}.${index + 1}`;

    if (!existsSync(source)) {
      continue;
    }

    if (index === LOG_FILE_COUNT - 1 && existsSync(target)) {
      unlinkSync(target);
    }

    renameSync(source, target);
  }

  const firstRotated = `${filePath}.1`;
  if (existsSync(firstRotated)) {
    unlinkSync(firstRotated);
  }

  if (existsSync(filePath)) {
    renameSync(filePath, firstRotated);
  }
}

function maybeRotateTransport(transport: LogTransport) {
  if (!transport.filePath || !existsSync(transport.filePath)) {
    return;
  }

  const stats = statSync(transport.filePath);
  if (stats.size < LOG_MAX_SIZE_BYTES) {
    return;
  }

  transport.stream?.end();
  rotateLogFiles(transport.filePath);
  transport.stream = createLogStream(transport.filePath);
}

const infoTransport: LogTransport = {
  filePath: INFO_LOG_FILE,
  stream: createLogStream(INFO_LOG_FILE),
};

const errorTransport: LogTransport = {
  filePath: ERROR_LOG_FILE,
  stream: createLogStream(ERROR_LOG_FILE),
};

function truncateString(value: string) {
  return value.length > MAX_STRING_LENGTH ? `${value.slice(0, MAX_STRING_LENGTH)}...[truncated]` : value;
}

function sanitizeValue(value: unknown, depth = 0): unknown {
  if (depth > MAX_DEPTH) {
    return "[TruncatedDepth]";
  }

  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    return truncateString(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack ? truncateString(value.stack) : undefined,
    };
  }

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => sanitizeValue(item, depth + 1));
  }

  if (typeof value === "object") {
    const sanitizedEntries = Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        return [key, REDACTED];
      }

      return [key, sanitizeValue(entryValue, depth + 1)];
    });

    return Object.fromEntries(sanitizedEntries);
  }

  return String(value);
}

function writeToTransport(level: LogLevel, serialized: string) {
  const transport = level === "info" ? infoTransport : errorTransport;

  if (transport.stream && transport.filePath) {
    maybeRotateTransport(transport);
    transport.stream?.write(`${serialized}\n`);
    return;
  }

  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
}

function writeLog(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const sanitizedMeta = meta ? (sanitizeValue(meta) as Record<string, unknown>) : undefined;
  const entry = {
    "@timestamp": new Date().toISOString(),
    message,
    "log.level": level,
    "service.name": SERVICE_NAME,
    "service.environment": SERVICE_ENVIRONMENT,
    "event.dataset": EVENT_DATASET,
    labels: {
      service: SERVICE_NAME,
      environment: SERVICE_ENVIRONMENT,
      level,
    },
    ...(sanitizedMeta ? { meta: sanitizedMeta } : {}),
  };

  writeToTransport(level, JSON.stringify(entry));
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    writeLog("info", message, meta);
  },
  warn(message: string, meta?: Record<string, unknown>) {
    writeLog("warn", message, meta);
  },
  error(message: string, meta?: Record<string, unknown>) {
    writeLog("error", message, meta);
  },
  sanitize(meta: Record<string, unknown>) {
    return sanitizeValue(meta);
  },
};
