module.exports = {
  apps: [
    {
      name: 'investment_capital_backend',
      script: './backend/src/server.js',
      cwd: '/var/www/investment_capital',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/investment_capital/backend-error.log',
      out_file: '/var/log/investment_capital/backend-out.log',
      log_file: '/var/log/investment_capital/backend-combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'investment_capital_frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/investment_capital/frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/investment_capital/frontend-error.log',
      out_file: '/var/log/investment_capital/frontend-out.log',
      log_file: '/var/log/investment_capital/frontend-combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};

