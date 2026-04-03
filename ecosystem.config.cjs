module.exports = {
  apps: [
    {
      name: "mikro-living",
      script: "build/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        LOG_INFO_FILE: "./logs/app-info.log",
        LOG_ERROR_FILE: "./logs/app-error.log",
      },
    },
  ],
};
