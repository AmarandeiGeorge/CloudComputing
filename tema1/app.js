// data = {
// 	jsonrpc: '2.0',
// 	method: 'generateIntegers',
// 	params: { apiKey: '444c094c-c60d-44ec-b511-3355a7139607', n: 1, min: 1, max: 15, replacement: true },
// 	id: 42
// };
// //console.log(JSON.stringify(data));
// let word = '';
// let count = '';
// fetch('https://api.random.org/json-rpc/2/invoke', {
// 	method: 'POST',
// 	headers: {
// 		'Content-Type': 'application/json'
// 	},
// 	body: JSON.stringify(data)
// })
// 	.then((resp) => resp.json())
// 	.then((respJson) => {
// 		count = respJson.result.random.data[0];
// 		fetch(`https://uinames.com/api/?amount=1`).then((resp) => resp.json()).then((respJson) => {
// 			word = respJson.region;
// 			//console.log(respJson);
// 			//console.log(count);
// 			let div = document.createElement('div');
// 			div.innerHTML = `<p>Location: ${word}</p> <p>Number of photos: ${count}</p>`;
// 			document.querySelector('body').appendChild(div);
// 			fetch(`https://api.unsplash.com/photos/random?query=${word}&count=${count}`, {
// 				headers: {
// 					Authorization: 'Client-ID 4dOjcVBji3bpdi9SRmBvo5Z-NT6V1Ym2Qz6oN6FkKCY'
// 				}
// 			})
// 				.then((resp) => resp.json())
// 				.then((respJson) => {
// 					respJson.forEach((element) => {
// 						let img = document.createElement('img');
// 						//console.log(element.urls.small);
// 						img.src = element.urls.small;
// 						document.querySelector('body').appendChild(img);
// 					});
// 				});
// 		});
// 	});

document.querySelector('#click').addEventListener('click', (e) => {
	e.preventDefault();
	console.log('click');
	fetch('http://localhost:3000/').then((resp) => resp.json()).then((respJson) => {
		let main = document.querySelector('#main');
		main.innerHTML = '';
		let div = document.createElement('div');
		div.id = 'main';
		div.innerHTML = `<p>Location: ${respJson.location}</p> <p>Number of photos: ${respJson.count}</p>`;
		console.log(respJson.photos);
		respJson.photos.forEach((element) => {
			let img = document.createElement('img');
			//console.log(element.urls.small);
			img.src = element;
			div.appendChild(img);
		});
		main.appendChild(div);
	});
});
document.querySelector('#download').addEventListener('click', (e) => {
	console.log('downloading');
	let main = document.querySelector('#main');
	main.innerHTML = '';
	fetch('http://localhost:3000/metrics').then((res) => res.text()).then((resText) => {
		let textarea = document.createElement('textarea');
		textarea.readOnly = true;
		textarea.innerText = resText;
		main.appendChild(textarea);
	});
});
document.querySelector('#save').addEventListener('click', (e) => {
	console.log('saved');
	fetch('http://localhost:3000/save');
});
