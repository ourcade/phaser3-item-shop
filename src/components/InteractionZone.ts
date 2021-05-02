import { IComponent } from '../services/ComponentService'

export default class InteractionZone implements IComponent
{
	private readonly target: Phaser.GameObjects.Image
	private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys
	private readonly events = new Phaser.Events.EventEmitter()

	private gameObject!: Phaser.GameObjects.Sprite

	constructor(target: Phaser.GameObjects.Image, cursors: Phaser.Types.Input.Keyboard.CursorKeys)
	{
		this.target = target
		this.cursors = cursors
	}

	init(go: Phaser.GameObjects.GameObject)
	{
		this.gameObject = go as Phaser.GameObjects.Sprite
	}

	update(dt: number)
	{
		const distance = Phaser.Math.Distance.Between(
			this.gameObject.x, this.gameObject.y,
			this.target.x, this.target.y
		)

		if (distance > 32)
		{
			return
		}

		if (!Phaser.Input.Keyboard.JustUp(this.cursors.space))
		{
			return
		}

		this.events.emit('interaction')
	}

	onInteraction(callback: () => void, context?: any)
	{
		this.events.on('interaction', callback, context)

		return () => {
			this.events.off('interaction', callback, context)
		}
	}
}
