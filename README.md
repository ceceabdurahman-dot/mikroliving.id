# Mikro Living

A full-stack portfolio and admin CMS app built with React, Vite, Express, and MySQL.

## Local Development

1. Install dependencies:
   `npm install`
2. Copy environment template:
   `copy .env.example .env`
3. Fill the required values in `.env`.
4. Run the development server:
   `npm run dev`

## Production Build

Build both the frontend bundle and the Node server bundle:

`npm run build`

Start the production server:

`npm start`

Health check endpoint:

`GET /api/health`

## Hostinger Deployment

This project supports two different Hostinger deployment targets:

### 1. Full stack Node.js deployment

Use this option if you want the public site, API, and `/admin` CMS to work.

- Recommended Hostinger plan type: Business web hosting, Cloud hosting, or VPS with Node.js support
- Upload method: GitHub deployment or ZIP file upload
- Build command: `npm run build`
- Start command: `npm start`
- Node.js version: `22.x`

Before deploying:

1. Upload the full project source, not the static-only package
2. Exclude `node_modules`, `logs`, local `.env`, and temporary artifacts
3. Add environment variables in Hostinger:
   `PORT`
   `JWT_SECRET`
   `DB_HOST`
   `DB_USER`
   `DB_PASSWORD`
   `DB_NAME`
   `CLOUDINARY_CLOUD_NAME`
   `CLOUDINARY_API_KEY`
   `CLOUDINARY_API_SECRET`
4. Import the MySQL database dump before first login
5. After deployment, test:
   `/`
   `/admin`
   `/api/health`

Generate a fresh upload package locally with:

`npm run package:upload`

That command creates a Node.js-ready ZIP plus SQL files in `migration_artifacts`.
You can also override the artifact name and target deployment credentials through environment variables such as `APP_NAME`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

### 2. Static public-only deployment

Use this only if your Hostinger plan supports static/PHP hosting but not Node.js apps.

- Upload the generated static package from `migration_artifacts`
- This will only run the public frontend
- `/admin` and the CMS API will not work in this mode

## Required Environment Variables

Use [`.env.example`](./.env.example) as the reference. The most important values are:

- `PORT`
- `JWT_SECRET`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Logging

Optional file-based logging config:

- `LOG_INFO_FILE`
- `LOG_ERROR_FILE`
- `LOG_MAX_SIZE_MB`
- `LOG_MAX_FILES`
- `LOG_SERVICE_NAME`

If log files are configured, the app will rotate them by size and keep numbered backups like:

- `app-info.log`
- `app-info.log.1`
- `app-info.log.2`

The JSON output is ready for shippers and includes fields such as:

- `@timestamp`
- `message`
- `log.level`
- `service.name`
- `service.environment`
- `event.dataset`
- `labels`
- `meta.request_id`

Example shipper configs:

- [promtail-config.yml](./deploy/observability/promtail-config.yml)
- [filebeat.yml](./deploy/observability/filebeat.yml)

## Ubuntu Filebeat Target

For your current VPS target, the Filebeat config is already aligned to:

- app path: `/var/www/mikro_living`
- Elasticsearch endpoint: `http://127.0.0.1:9200`

The Filebeat input paths currently expect:

- `/var/www/mikro_living/logs/app-info.log*`
- `/var/www/mikro_living/logs/app-error.log*`

Typical Ubuntu rollout:

1. Deploy the app to `/var/www/mikro_living`
2. Ensure the app writes logs into `/var/www/mikro_living/logs`
3. Copy [filebeat.yml](./deploy/observability/filebeat.yml) to your Filebeat config directory
4. Enable and restart Filebeat
5. Verify indices arriving in Elasticsearch

## PM2 Deployment

1. Install dependencies and build:
   `npm ci`
   `npm run build`
2. Start with PM2:
   `pm2 start ecosystem.config.cjs`
3. Save PM2 state:
   `pm2 save`

## Docker Deployment

Build the image:

`docker build -t mikro-living .`

Run the container:

`docker run --env-file .env -p 3000:3000 mikro-living`

## Notes

- Production serves the built React app from `dist` and the bundled Node server from `build/server.js`.
- The app expects a reachable MySQL database and valid Cloudinary credentials for image upload.
- Rate-limit settings can be tuned from `.env` without changing code.
- `info` logs and `warn/error` logs can be separated into different files for easier monitoring.
- Promtail and Filebeat can ingest the emitted JSON lines without additional app-side formatting changes.
