async function getStarter() {
	try {
		const request = await fetch(`http://172.22.42.122:3000/starters`);
		const data = await request.json();

		// Fragen
		document.querySelector("#nextQuestion").innerHTML = '<h2>Fragen</h2><h3>Beschreibe dein Problem</h3><ul class="choices"></ul>';
		data.forEach(element => {
			document.querySelector(".choices").innerHTML += '<li><button onClick="ids.push(\'' + element._id + '\');send()" >' + element.text + '</button></li>';
		});
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
			"Access-Control-Allow-Origin": "*",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},

			body: JSON.stringify({
				symptoms: ids
			}),
		});
		const data = await request.json();
		console.log(data);

		// Fragen
		document.querySelector("#nextQuestion").innerHTML = '<h2>Fragen</h2><h3>Wähle zutreffendes aus</h3><ul class="choices"></ul>';
		data.symptoms.forEach(element => {
			document.querySelector(".choices").innerHTML += '<li><label class="container">' + element.text + '<input type="checkbox" name="' + element._id + '" /><span class="checkmark"></span></label></li>';
		});
		document.querySelector(".choices").innerHTML += '<li><button onClick="auswerten();">Abschicken</button></li>';

		// Problemlösungen
		document.querySelector("#issues").innerHTML = '<h2>Mögliche Lösungen</h2><ul id="issues-ul"></ul>';
		data.bestIssues.forEach(element => {
			document.querySelector("#issues-ul").innerHTML += '<li><h3>' + element.text + '</h3><p>' + element.fix + '</p></li> <hr /> ';
		});

	} catch (e) {
		console.error('fetch error', e);
	}
}

getStarter();