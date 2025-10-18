module.exports = {
  apps: [
    {
      name: 'investment_capital_frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/investment_capital',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/investment_capital/frontend-error.log',
      out_file: '/var/log/investment_capital/frontend-out.log',
      log_file: '/var/log/investment_capital/frontend-combined.log',
      time: true
    },
    {
      name: 'investment_capital_backend',
      script: 'server.js',
      cwd: '/var/www/investment_capital/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/investment_capital/backend-error.log',
      out_file: '/var/log/investment_capital/backend-out.log',
      log_file: '/var/log/investment_capital/backend-combined.log',
      time: true
    }
  ]
};
