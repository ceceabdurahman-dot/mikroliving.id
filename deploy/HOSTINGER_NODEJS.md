# Hostinger Node.js Deployment

Use this guide if you want the full MikroLiving stack to run on Hostinger with:

- public website
- /admin CMS
- Express API
- MySQL database

## Suitable Hostinger plans

- Business web hosting with Node.js app deployment
- Cloud hosting
- VPS

## Build and runtime settings

- Node.js version: 22.x
- Build command: npm run build
- Start command: npm start
- Health check: /api/health

## Required environment variables

Set these in the Hostinger deployment UI or import them from a deployment-safe .env file:

- PORT
- JWT_SECRET
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

Optional:

- LOG_INFO_FILE
- LOG_ERROR_FILE
- LOG_MAX_SIZE_MB
- LOG_MAX_FILES
- LOG_SERVICE_NAME
- RATE_LIMIT_ADMIN_LOGIN_WINDOW_MS
- RATE_LIMIT_ADMIN_LOGIN_MAX
- RATE_LIMIT_ADMIN_WRITE_WINDOW_MS
- RATE_LIMIT_ADMIN_WRITE_MAX
- RATE_LIMIT_ADMIN_UPLOAD_WINDOW_MS
- RATE_LIMIT_ADMIN_UPLOAD_MAX
- RATE_LIMIT_CONTACT_WINDOW_MS
- RATE_LIMIT_CONTACT_MAX

Recommended template for your current domain:

- [deploy/.env.hostinger.mikroliving.id.example](./.env.hostinger.mikroliving.id.example)

Use that file as the starting point, then replace the database and Cloudinary placeholders with the exact values from Hostinger hPanel and Cloudinary.

## ZIP upload checklist

If you deploy using a ZIP file:

1. Include the project source files and package.json
2. Exclude:
   node_modules
   logs
   local .env
   temporary test files
   migration artifacts
3. Upload the ZIP through the Node.js application deployment flow, not the regular PHP/website migrator

## Database

Import the provided SQL dump into a MySQL database first, then configure the matching DB credentials in Hostinger.

## Post-deploy smoke checks

After deployment, confirm:

1. GET /api/health returns ok
2. / loads the public homepage
3. /admin loads the login screen
4. Admin login works
5. GET /api/projects returns project data
