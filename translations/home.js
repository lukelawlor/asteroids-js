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
	},
}

document.addEventListener('DOMContentLoaded', function () {
	changeLanguage('en')
})

function changeLanguage(lang) {
	for (const key in langDict[lang]) {
		const element = document.getElementById(key)
		if (element) {
			element.innerHTML = langDict[lang][key]
		}
	}
}
