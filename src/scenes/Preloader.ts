import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene
{
	constructor()
	{
		super('preloader')
	}

	preload()
	{
		this.load.atlas('faune', 'assets/faune.png', 'assets/faune.json')

		// https://stealthix.itch.io/pixel-item-pack
		this.load.image('potion', 'assets/items/Item1.png')
		this.load.image('meat', 'assets/items/Item13.png')
		this.load.image('torch', 'assets/items/Item15.png')
	}

	create()
	{
		this.scene.start('item-shop')
	}
}