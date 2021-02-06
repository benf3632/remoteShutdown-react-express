var Service = require('node-windows').Service;

var svc = new Service({
  name: 'Remote Shutdown',
  description: 'Runs the remote shutdown server',
  script: 'C:\\Users\\CookieS\\Documents\\dev\\remoteShutdown-react-express\\server\\src\\index.js',
});

svc.on('install', () => {
  svc.start();
});

svc.install();
