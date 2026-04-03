export class HttpError extends Error {
  statusCode: number;
  expose: boolean;

  constructor(statusCode: number, message: string, options?: { expose?: boolean }) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.expose = options?.expose ?? statusCode < 500;
  }
}
