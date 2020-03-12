const http = require('http');
const env = require('dotenv').config();
const url = require('url');
const db = require('./mongoose.js')();
const server = http.createServer((req, res) => {
	let data = '';
	req.on('data', (chunk) => {
		data += chunk;
	});
	req.on('end', () => {
		handleData(req, res, data);
	});
});

server.listen(process.env.PORT, () => {});

async function handleData(req, res, data) {
	let urls = req.url.split('/');

	if (urls[1] != 'trip' || urls.length > 3) {
		res.writeHead(404);
		res.end('invalid route');
	}

	switch (req.method) {
		case 'GET':
			{
				if (urls.length == 2) {
					let response = await db.getAll();
					res.writeHead(response.status, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(response.data));
				} else {
					let response = await db.getOne(urls[2]);
					res.writeHead(response.status, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(response.data));
				}
			}

			break;
		case 'POST':
			{
				let response = await db.postTrip(JSON.parse(data));
				res.writeHead(response.status, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(response.data));
			}

			break;
		case 'PUT':
			{
				if (urls.length == 2) {
					if (req.headers.badidea != undefined) {
						let response = await db.modifyMany(JSON.parse(data));
						res.writeHead(response.status, { 'Content-Type': 'application/json' });
						res.end(JSON.stringify(response.data));
					} else {
						res.writeHead(405, { 'Content-Type': 'application/json' });
						res.end();
					}
				} else {
					let response = await db.ModifyOne(JSON.parse(data), urls[2]);
					res.writeHead(response.status, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(response.data));
				}
			}

			break;
		case 'DELETE':
			{
				if (urls.length == 2) {
					if (req.headers.badidea != undefined) {
						let response = await db.deleteMany();

						res.writeHead(response.status, { 'Content-Type': 'application/json' });
						res.end(JSON.stringify(response.data));
					} else {
						res.writeHead(405);
						res.end();
					}
				} else {
					let response = await db.deleteOne(urls[2]);
					console.log(response);
					res.writeHead(response.status, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(response.data));
				}
			}

			break;

		default:
			break;
	}
}
