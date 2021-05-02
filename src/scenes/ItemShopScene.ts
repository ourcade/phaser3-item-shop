import Phaser from 'phaser'
import SelectionCursor from '../components/SelectionCursor'
import AnimationOnInput from '../components/AnimationOnInput'
import { KeyboardMovement } from '../components/KeyboardMovement'
import ComponentService from '../services/ComponentService'
import Item from '../components/Item'
// import DialogBox from '../components/DialogBox'
// import InteractionZone from '../components/InteractionZone'

const itemsData = [
	{
		name: 'potion',
		price: 100,
		x: 140,
		y: 120
	},
	{
		name: 'meat',
		price: 500,
		x: 200,
		y: 120
	},
	{
		name: 'torch',
		price: 1000,
		x: 260,
		y: 120
	}
]

export default class ItemShopScene extends Phaser.Scene
{
	private player!: Phaser.Physics.Arcade.Sprite
	private components!: ComponentService
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

	constructor()
	{
		super('item-shop')
	}

	init()
	{
		this.components = new ComponentService()
		this.cursors = this.input.keyboard.createCursorKeys()

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			this.components.destroy()
		})
	}

    create()
    {
		const { width, height } = this.scale

		const items = this.physics.add.staticGroup()

		this.player = this.physics.add.sprite(width * 0.5, height * 0.75, 'faune')
		this.player.setBodySize(this.player.width * 0.5, this.player.height * 0.7)
		this.player.setOffset(8, 8)
		this.createPlayerAnimations()

		this.components.addComponent(this.player, new KeyboardMovement(this.cursors))
		this.components.addComponent(this.player, new AnimationOnInput(this.cursors, {
			left: { key: 'run-side', flip: true },
			right: { key: 'run-side' },
			up: { key: 'run-up' },
			down: { key: 'run-down' },
			none: { key: 'idle' }
		}))
		const playerSelectionCursor = new SelectionCursor(this.cursors, items)
		this.components.addComponent(this.player, playerSelectionCursor)

		itemsData.forEach(item => {
			const { x, y, name, price } = item
			const go = items.create(x, y, name)
			// const zone = new InteractionZone(this.player, this.cursors)
			// this.components.addComponent(go, zone)
			this.components.addComponent(go, new Item(playerSelectionCursor, name, price))
		})

		// const dialogBox = this.add.container(0, height * 0.7)
		// this.components.addComponent(dialogBox, new DialogBox(playerSelectionCursor))

		this.physics.add.collider(this.player, items)
    }

	update(t: number, dt: number)
	{
		this.components.update(dt)
	}

	private createPlayerAnimations()
	{
		this.player.anims.create({
			key: 'run-side',
			frames: this.player.anims.generateFrameNames('faune', {
				start: 1,
				end: 8,
				prefix: 'run-side-',
				suffix: '.png'
			}),
			frameRate: 10
		})
		this.player.anims.create({
			key: 'run-up',
			frames: this.player.anims.generateFrameNames('faune', {
				start: 1,
				end: 8,
				prefix: 'run-up-',
				suffix: '.png'
			}),
			frameRate: 10
		})
		this.player.anims.create({
			key: 'run-down',
			frames: this.player.anims.generateFrameNames('faune', {
				start: 1,
				end: 8,
				prefix: 'run-down-',
				suffix: '.png'
			}),
			frameRate: 10
		})
		this.player.anims.create({
			key: 'idle-up',
			frames: [{
				key: 'faune',
				frame: 'run-up-3.png'
			}]
		})
		this.player.anims.create({
			key: 'idle-down',
			frames: [{
				key: 'faune',
				frame: 'run-down-3.png'
			}]
		})
		this.player.anims.create({
			key: 'idle-side',
			frames: [{
				key: 'faune',
				frame: 'run-side-3.png'
			}]
		})
	}
}
