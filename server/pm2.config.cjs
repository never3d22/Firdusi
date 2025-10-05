module.exports = {
  apps: [
    {
      name: 'codex-api',
      script: './dist/index.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
