async function getStarter() {
	try {
		const request = await fetch(`http://172.22.42.122:3000/starters`);
		const data = await request.json();

		document.querySelector("#nextQuestion").innerHTML = '<h2>Fragen</h2><h3>Markiere deine Probleme</h3><ul class="choices"></ul>';
		data.forEach(element => {
			document.querySelector(".choices").innerHTML += '<li><label class="container">' + element.text + '<input type="checkbox" name="' + element._id + '" /><span class="checkmark"></span></label></li>';
		});
		document.querySelector(".choices").innerHTML += '<li><button onClick="auswerten();">Abschicken</button></li>';
	} catch (e) {
		console.error('fetch error', e);
	}
}

var ids = []

function auswerten() {
	console.log("auswerten");
	ids.push(...[...document.querySelectorAll("input")]
		.filter(element => element.checked)
		.map(element => element.getAttribute('name')));
	console.log(ids)
	send();
}

async function send() {
	try {
		const request = await fetch(`http://172.22.42.122:3000/symptoms`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				symptoms: ids
			}),
		});
		const data = await request.json();
		console.log(data);

		document.querySelector("#nextQuestion").innerHTML = '<h2>Fragen</h2><h3>Markiere deine Probleme</h3><ul class="choices"></ul>';
		data.symptoms.forEach(element => {
			document.querySelector(".choices").innerHTML += '<li><label class="container">' + element.text + '<input type="checkbox" name="' + element._id + '" /><span class="checkmark"></span></label></li>';
		});
		document.querySelector(".choices").innerHTML += '<li><button onClick="auswerten();">Abschicken</button></li>';
	} catch (e) {
		console.error('fetch error', e);
	}
}

getStarter();