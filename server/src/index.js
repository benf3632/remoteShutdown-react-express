var express = require('express');
var bodyParser = require('body-parser');
var os = require('os');
var app = express();

var jsonParser = bodyParser.json();

app.listen(3000, () => {
	console.log('Server running on port 3000');
});

app.get('/host', (req, res, next) => {
	const hostname = os.hostname();
	const ip = getIp();
	res.json({ hostname, ip });
});

app.post('/execute', jsonParser, (req, res) => {
	res.send('Worked hell yeash, ' + JSON.stringify(req.body));
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
