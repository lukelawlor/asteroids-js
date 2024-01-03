const langDict = {
	en: {
		gameTitle: 'Bad Asteroid Game',
		turnLeft: "Left ('Q' or &#8592;) and Right ('D' or &#8594;) to Turn",
		moveUp: "Up ('Z' or &#8593;) to Move",
		brakeDown: "Down ('S' or &#8595;) to Brake",
		spaceShoot: 'Space to Shoot',
		pressEnter: 'Press Enter to Start',
		pressEscape: 'Press Escape to stop',
		toggleSound: "Press 'M' to toggle sound effects",
		learnHow: 'Learn how this works!',
		load: 'the game finished loading. yay.',
		title: 'Bad Asteroid Game',
		author: 'by Luke Lawlor',
		pressEnter: 'Press Enter to Play',
		highScore: 'High Score: ',
		pressEnterToReplay: 'Press Enter to Replay',
	},
	fr: {
		gameTitle: "Mauvais jeu d'astéroïdes",
		turnLeft: "Gauche ('Q' ou &#8592;) et Droite ('D' ou &#8594;) pour Tourner",
		moveUp: "Haut ('Z' ou &#8593;) pour Avancer",
		brakeDown: "Bas ('S' ou &#8595;) pour Freiner",
		spaceShoot: 'Espace pour Tirer',
		pressEnter: 'Appuyez sur Entrée pour Commencer',
		pressEscape: 'Appuyez sur Échap pour arrêter',
		toggleSound: "Appuyez sur 'M' pour activer/désactiver les effets sonores",
		learnHow: 'Apprenez comment cela fonctionne !',
		load: 'le jeu a fini de charger. Hourra.',
		title: "Mauvais jeu d'astéroïdes",
		author: 'par Luke Lawlor',
		pressEnter: 'Appuyez sur Entrée pour Jouer',
		highScore: 'Meilleur Score : ',
		pressEnterToReplay: 'Appuyez sur Entrée pour Recommencer',
	},
}

const GAME_TXT = {
	load: '',
	title: '',
	author: '',
	pressEnter: '',
	highScore: '',
	pressEnterToReplay: '',
}

document.addEventListener('DOMContentLoaded', function () {
	const frButton = document.querySelector('button[aria-label="Change to French"]')
	const enButton = document.querySelector('button[aria-label="Change to English"]')

	frButton.addEventListener('click', () => changeLanguage('fr'))
	enButton.addEventListener('click', () => changeLanguage('en'))

	changeLanguage('en')
})

function changeLanguage(lang) {
	GAME_TXT.load = langDict[lang].load
	GAME_TXT.title = langDict[lang].title
	GAME_TXT.author = langDict[lang].author
	GAME_TXT.pressEnter = langDict[lang].pressEnter
	GAME_TXT.highScore = langDict[lang].highScore
	GAME_TXT.pressEnterToReplay = langDict[lang].pressEnterToReplay

	for (const key in langDict[lang]) {
		const element = document.getElementById(key)
		if (element) {
			element.innerHTML = langDict[lang][key]
		}
	}
}

export { GAME_TXT, changeLanguage }
