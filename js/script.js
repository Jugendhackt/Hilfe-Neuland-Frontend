const host = 'http://172.22.42.122:3000';

const choices = document.querySelector('.choices');
const nextQuestion = document.querySelector('#nextQuestion');
const issues = document.querySelector('#issues ul');

async function getStarter() {
	try {
		const request = await fetch(`${host}/starters`);
		const data = await request.json();

		choices.innerHTML = '';
		data.forEach(element => {
			const button = document.createElement('button');
			button.setAttribute('data-id', element._id);
			button.addEventListener('click', (e) => {
				ids.push(e.target.getAttribute('data-id'));
				send();
			});
			button.innerHTML = element.text;
			const li = document.createElement('li');
			li.appendChild(button);
			choices.appendChild(li);
		});
	}
	catch (e) {
		console.error('fetch error', e);
	}
}

const ids = [];

function auswerten() {
	ids.push(...[...document.querySelectorAll("input")]
		.filter(element => element.checked)
		.map(element => element.getAttribute('name')));
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

		document.querySelector('#nextQuestion h3').innerHTML = 'Bitte wählen Sie Zutreffendes aus.';
		choices.innerHTML = '';

		if (data.symptoms.length === 0) {
			document.querySelector('#nextQuestion h3').innerHTML = 'Sie finden mögliche Ursachen und deren Lösungen rechts.';
			return;
		}

		data.symptoms.forEach(element => {
			const li = document.createElement('li');

			const label = document.createElement('label');
			label.classList.add('container');

			const input = document.createElement('input');
			input.setAttribute('type', 'checkbox');
			input.setAttribute('name', element._id);

			const span = document.createElement('span');
			span.classList.add('checkmark');

			const text = document.createElement('span');
			text.innerHTML = element.text;
			
			label.appendChild(text);
			label.appendChild(input);
			label.appendChild(span);
			li.appendChild(label);
			choices.appendChild(li);
		});

		const button = document.createElement('button');
		button.addEventListener('click', auswerten);
		button.innerHTML = 'Abschicken';

		const li = document.createElement('li');
		li.appendChild(button);
		choices.appendChild(li);

		issues.innerHTML = '';
		data.bestIssues.forEach((element, i) => {
			const li = document.createElement('li');
			const h3 = document.createElement('h3');
			h3.innerHTML = element.text;

			const p = document.createElement('p');
			p.innerHTML = element.fix;

			li.appendChild(h3);
			li.appendChild(p);

			const hr = document.createElement('hr');

			issues.appendChild(li);
			if (i + 1 !== data.bestIssues.length) {
				issues.appendChild(hr);
			}
		});

	}
	catch (e) {
		console.error('fetch error', e);
	}
}

getStarter();