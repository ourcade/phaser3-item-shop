import { IWithInteractionCallback } from '~/types/types'
import { IComponent } from '../services/ComponentService'
import Item from './Item'

export default class DialogBox implements IComponent
{
	private gameObject!: Phaser.GameObjects.Container

	private text!: Phaser.GameObjects.Text
	private selectedItem?: Item

	private timerEvent?: Phaser.Time.TimerEvent
	private textToShow = ''

	constructor(trigger: IWithInteractionCallback)
	{
		trigger.onInteraction(this.handleInteraction, this)
	}

	init(go: Phaser.GameObjects.GameObject)
	{
		this.gameObject = go as Phaser.GameObjects.Container
	}

	start()
	{
		const { scene } = this.gameObject

		const bg = scene.add.rectangle(0, 0, scene.scale.width, 150, 0x89520b)
			.setOrigin(0)

		this.gameObject.add(bg)

		this.gameObject.add(
			scene.add.rectangle(bg.width, 0, 60, bg.height, 0x493112)
				.setOrigin(1, 0)
		)

		this.text = scene.add.text(10, 10, '')
			.setWordWrapWidth(scene.scale.width * 0.8)

		this.gameObject.add(this.text)

		const okButton = scene.add.text(bg.width - 10, 10, 'Yes!')
			.setOrigin(1, 0)

		const cancelButton = scene.add.text(bg.width - 10, okButton.y + okButton.height + 10, 'No.')
			.setOrigin(1, 0)

		this.gameObject.add(okButton)
		this.gameObject.add(cancelButton)

		scene.input.keyboard.on('keyup-Y', () => {
			if (!this.selectedItem)
			{
				return
			}

			console.log(`buy ${this.selectedItem.name}!`)
			this.close()
		})

		scene.input.keyboard.on('keyup-N', () => {
			this.close()
		})

		this.close(0)
	}

	private open(duration = 300)
	{
		const { scene } = this.gameObject

		scene.add.tween({
			targets: this.gameObject,
			y: scene.scale.height * 0.8,
			duration,
			ease: Phaser.Math.Easing.Sine.InOut
		})
	}

	private close(duration = 300)
	{
		const { scene } = this.gameObject

		scene.add.tween({
			targets: this.gameObject,
			y: scene.scale.height,
			duration,
			ease: Phaser.Math.Easing.Sine.InOut
		})

		this.selectedItem = undefined
	}

	private handleInteraction(item: Item)
	{
		if (!this.text)
		{
			return
		}

		if (item === this.selectedItem)
		{
			this.timerEvent?.destroy()
			this.text.text = this.textToShow
			return
		}

		this.selectedItem = item

		this.typewriteText(`Would you like to buy a ${item.name} for ${item.price} coins?`)

		this.open()
	}

	typewriteText(text)
	{
		if (this.timerEvent)
		{
			this.timerEvent.destroy()
			this.timerEvent = undefined
		}

		if (!this.text)
		{
			return
		}

		this.textToShow = text
		this.text.text = ''

		const { scene } = this.gameObject

		const length = text.length
		let i = 0
		this.timerEvent = scene.time.addEvent({
			callback: () => {
				if (!this.text)
				{
					return
				}

				this.text.text += text[i]
				++i
			},
			repeat: length - 1,
			delay: 200
		})
	}
}
