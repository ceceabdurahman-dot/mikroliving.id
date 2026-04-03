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
