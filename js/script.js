let questionaire = {};

const listener = () => {
	[...document.querySelectorAll('ul.choices li')].forEach((el) => el.addEventListener('click', async (e) => {
		const id = e.target.getAttribute('data-id');
		const text = e.target.innerHTML;

		if (!questionaire.text) {
			try {
				const request = await fetch(`http://localhost:3000/questionaire?set=${id}`);
				const data = await request.json();
				questionaire = data;
			}
			catch (e) {
				console.error('fetch error', e);
			}
		}
		
		if (questionaire.then) {
			document.querySelector('ul.choices').innerHTML = questionaire.then;
		}
		else {
			document.querySelector('ul.choices').innerHTML = '';
			document.querySelector('h2.question').innerHTML = questionaire.text;
			questionaire.options.forEach((option) => {
				const el = document.createElement('li');
				el.innerHTML = option.text;
				document.querySelector('ul.choices').appendChild(el);
			});
			questionaire = questionaire.options.find((option) => option.text === text) || questionaire;
			listener();
		}
	}));
};

document.addEventListener('DOMContentLoaded', listener);