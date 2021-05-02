import type { IComponent } from '../services/ComponentService'

export class KeyboardMovement implements IComponent
{
	private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys
	private speed: number

	private gameObject!: Phaser.Physics.Arcade.Sprite

	constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys, speed = 100)
	{
		this.cursors = cursors
		this.speed = speed
	}

	init(go: Phaser.GameObjects.GameObject)
	{
		this.gameObject = go as Phaser.Physics.Arcade.Sprite
	}

	update(dt: number)
	{
		if (this.cursors.left.isDown)
		{
			this.gameObject.setVelocityX(-this.speed)
			this.gameObject.setVelocityY(0)
		}
		else if (this.cursors.right.isDown)
		{
			this.gameObject.setVelocityX(this.speed)
			this.gameObject.setVelocityY(0)
		}
		else if (this.cursors.up.isDown)
		{
			this.gameObject.setVelocityX(0)
			this.gameObject.setVelocityY(-this.speed)
		}
		else if (this.cursors.down.isDown)
		{
			this.gameObject.setVelocityX(0)
			this.gameObject.setVelocityY(this.speed)
		}
		else
		{
			this.gameObject.setVelocity(0, 0)
		}
	}
}