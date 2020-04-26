var express = require('express');
var os = require('os');
var app = express();

app.listen(3000, () => {
	console.log('Server running on port 3000');
});

app.get('/url', (req, res, next) => {
	res.json(['Tony', 'Lisa', 'Michael', 'Ginger', 'Food']);
});

app.get('/host', (req, res, next) => {
	const hostname = os.hostname();
	const ip = getIp();
	res.json({ hostname, ip });
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
