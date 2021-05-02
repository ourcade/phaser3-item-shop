import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import ItemShopScene from './scenes/ItemShopScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 400,
	height: 300,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		}
	},
	scale: {
		zoom: 2
	},
	scene: [Preloader, ItemShopScene]
}

export default new Phaser.Game(config)
