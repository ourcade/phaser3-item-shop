import { IComponent } from '../services/ComponentService'

type AnimationData = {
	left: { key: string, flip?: boolean }
	right: { key: string, flip?: boolean }
	up: { key: string, flip?: boolean }
	down: { key: string, flip?: boolean }
	none: { key: string, flip?: boolean }
}

export default class AnimationOnInput implements IComponent
{
	private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys
	private readonly data: AnimationData

	private gameObject!: Phaser.GameObjects.Sprite

	constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys, data: AnimationData)
	{
		this.cursors = cursors
		this.data = data
	}

	init(go: Phaser.GameObjects.GameObject)
	{
		this.gameObject = go as Phaser.GameObjects.Sprite
	}

	update(dt: number)
	{
		if (this.cursors.left.isDown)
		{
			this.gameObject.play(this.data.left.key, true)
			this.gameObject.setFlipX(!!this.data.left.flip)
		}
		else if (this.cursors.right.isDown)
		{
			this.gameObject.play(this.data.right.key, true)
			this.gameObject.setFlipX(!!this.data.right.flip)
		}
		else if (this.cursors.up.isDown)
		{
			this.gameObject.play(this.data.up.key, true)
			this.gameObject.setFlipX(!!this.data.up.flip)
		}
		else if (this.cursors.down.isDown)
		{
			this.gameObject.play(this.data.down.key, true)
			this.gameObject.setFlipX(!!this.data.down.flip)
		}
		else
		{
			const dir = this.gameObject.anims.currentAnim?.key.split('-')[1] ?? 'up'
			this.gameObject.play(`${this.data.none.key}-${dir}`, true)
		}
	}
}