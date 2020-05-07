var express = require('express');
require('dotenv').config();
var bodyParser = require('body-parser');
const execSync = require('child_process').execSync;
var os = require('os');

var app = express();

const password = process.env.PASSWORD;

var jsonParser = bodyParser.json();

var timer;

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

app.get('/host', (req, res, next) => {
  const hostname = os.hostname();
  const ip = getIp();
  res.json({ hostname, ip });
});

app.post('/execute', jsonParser, (req, res) => {
  const { time, mode } = req.body;
  console.log(timer);
  if (timer) res.status(501).end();
  let action = null;
  if (mode == 0) {
    action = shutdown;
  } else if (mode == 1) {
    action = restart;
  } else if (mode == 2) {
    action = sleep;
  }
  timer = setTimeout(action, time);
  console.log('timer started');
  res.status(200).end();
});

app.get('/cancel', (req, res, next) => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
    console.log('timer canceld');
    res.status(200).end();
  } else {
    res.status(501).end();
  }
});

const getIp = () => {
  const ifaces = os.networkInterfaces();
  let ip = '';
  let stop = false;
  Object.keys(ifaces).forEach(ifname => {
    if (stop) return;
    ifaces[ifname].forEach(iface => {
      if ('IPv4' !== iface.family || iface.internal !== false) return;
      if (iface.address.includes('192.168.1.')) {
        ip = iface.address;
        stop = true;
        return;
      }
    });
  });
  return ip;
};

const shutdown = () => {
  if (process.platform === 'win32') {
    execSync('shutdown /s');
  } else {
    execSync(`echo "${password}" | sudo -S shutdown -h now`);
  }
};

const restart = () => {
  if (process.platform === 'win32') {
    execSync('shutdown /r');
  } else {
    execSync(`echo "${password}" | sudo -S shutdown -r now`);
  }
};

const sleep = () => {
  if (process.platform === 'win32') {
    execSync('rundll32.exe powrprof.dll,SetSuspendState 0,1,0');
  } else {
    execSync(`echo "${password}" | sudo -S shutdown -s now`);
  }
};
