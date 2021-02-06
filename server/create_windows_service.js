var Service = require('node-windows').Service;

var svc = new Service({
  name: 'Remote Shutdown',
  description: 'Runs the remote shutdown server',
  script: 'src\\index.js',
});

svc.on('install', () => {
  svc.start();
});

svc.install();
