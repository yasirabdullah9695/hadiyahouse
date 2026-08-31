module.exports = {
  apps: [
    {
      name: "hadiya-backend",
      script: "./server.js",
      instances: "max", // Runs on all available CPU cores for max concurrency
      exec_mode: "cluster", // Enables Cluster mode for high traffic scalability
      watch: false,
      max_memory_restart: "500M", // Auto-restarts if memory exceeds 500MB
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
