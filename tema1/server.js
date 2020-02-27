const express = require('express');
const fetch = require('node-fetch');
const env = require('dotenv').config();
const fs = require('fs');
const app = express();
const cors = require('cors');
let port = 3000;
let logTxt = ' ';
app.use(cors());
app.get('/', (req, res) => {
	let log = {
		date: new Date().toISOString(),
		ip: '',
		randomOrg: {
			status: '',
			statusText: ''
		},
		uinames: {
			status: '',
			statusText: ''
		},
		unisplash: {
			status: '',
			statusText: ''
		},
		latency: ''
	};
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	log.ip = ip;
	let t0 = process.hrtime();
	let t1 = '';
	data = {
		jsonrpc: '2.0',
		method: 'generateIntegers',
		params: {
			apiKey: process.env.RANDOM_ORG_KEY,
			n: 1,
			min: 1,
			max: 15,
			replacement: true
		},
		id: 42
	};
	let word = '';
	let count = '';
	fetch('https://csrng.net/csrng/csrng.php?min=1&max=15')
		.then((resp) => {
			log.randomOrg.status = resp.status;
			log.randomOrg.statusText = resp.statusText;
			if (resp.status !== 200) {
				logTxt += `Request recieved from ${log.ip} at ${log.date}.RandomOrg status:${log.randomOrg
					.status} statusText:${log.randomOrg.statusText}.Latency${process.hrtime(t0)[1] / 1000000} \n`;
				fs.appendFile('log.txt', logTxt, (err) => {
					if (err == null) {
						res.status(500).end();
					} else console.log(err);
				});
				//res.status(500).end();
			} else return resp.json();
		})
		.then((respJson) => {
			count = respJson[0].random;
			fetch(`https://uinames.com/api/?amount=1`)
				.then((resp) => {
					log.uinames.status = resp.status;
					log.uinames.statusText = resp.statusText;
					if (resp.status !== 200) {
						logTxt += `Request recieved from ${log.ip} at ${log.date}.RandomOrg status:${log.randomOrg
							.status} statusText:${log.randomOrg.statusText}.Uinames status:${log.uinames
							.status} statusText:${log.uinames.statusText}.Latency${process.hrtime(t0)[1] / 1000000} \n`;
						// fs.appendFile('log.txt', logTxt, (err) => {
						// 	if (err == null) {
						// 		res.status(500).end();
						// 	} else console.log(err);
						// });
						res.status(500).end();
					} else return resp.json();
				})
				.then((respJson) => {
					word = respJson.region;

					fetch(`https://api.unsplash.com/photos/random?query=${word}&count=${count}`, {
						headers: {
							Authorization: `Client-ID ${process.env.UNISPLASH_KEY}`
						}
					})
						.then((resp) => {
							log.unisplash.status = resp.status;
							log.unisplash.statusText = resp.statusText;
							if (resp.status !== 200) {
								logTxt += `Request recieved from ${log.ip} at ${log.date}.RandomOrg status:${log
									.randomOrg.status} statusText:${log.randomOrg.statusText}.Uinames status:${log
									.uinames.status} statusText:${log.uinames.statusText}.Unisplash status:${log
									.unisplash.status} statusText:${log.unisplash.statusText}.Latency${process.hrtime(
									t0
								)[1] / 1000000} \n`;
								// fs.appendFile('log.txt', logTxt, (err) => {
								// 	if (err == null) {
								// 		res.status(500).end();
								// 	} else console.log(err);
								// });
								res.status(500).end();
							} else return resp.json();
						})
						.then((respJson) => {
							let data = {
								location: word,
								count: count,
								photos: []
							};
							respJson.forEach((element) => {
								data.photos.push(element.urls.small);
							});
							t1 = process.hrtime(t0);
							log.latency = t1[1] / 1000000;
							//console.log(log);
							logTxt += `Request recieved from ${log.ip} at ${log.date}.RandomOrg status:${log.randomOrg
								.status} statusText:${log.randomOrg.statusText}.Uinames status:${log.uinames
								.status} statusText:${log.uinames.statusText}.Unisplash status:${log.unisplash
								.status} statusText:${log.unisplash.statusText}.Latency:${log.latency} \n`;
							// fs.writeFile('log.txt', logTxt, { flag: 'a+' }, (err) => {
							// 	if (err == null) {
							// 		console.log('wait');
							// 		res.status(200).send(data);
							// 	} else console.log(err);
							// });
							res.status(200).send(data);
							//console.log(logTxt);

							//res.end();
						});
				});
		});
});
app.get('/save', (req, res) => {
	fs.writeFileSync('log.txt', logTxt, { flag: 'a+' });
	logTxt = ' ';
	res.end();
});
app.get('/metrics', (req, res) => {
	let resp = fs.readFileSync('./log.txt');
	res.send(resp);
});
app.listen(port, () => {});
