import { IWithInteractionCallback } from '../types/types'
import type { IComponent, IComponentsService } from '../services/ComponentService'
import Item from './Item'

export default class SelectionCursor implements IComponent, IWithInteractionCallback
{
	private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys
	private readonly items: Phaser.Physics.Arcade.StaticGroup
	private readonly events = new Phaser.Events.EventEmitter()

	private gameObject!: Phaser.GameObjects.Image
	private components!: IComponentsService
	private selector?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody

	private selectedItem?: Item

	constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys, items: Phaser.Physics.Arcade.StaticGroup)
	{
		this.cursors = cursors
		this.items = items
	}

	init(go: Phaser.GameObjects.GameObject, components: IComponentsService)
	{
		this.gameObject = go as Phaser.GameObjects.Image
		this.components = components
	}

	awake()
	{
		const { scene } = this.gameObject

		const box = scene.add.rectangle(100, 100, 16, 16, 0xffffff, 0)
		box.setStrokeStyle(1, 0xffffff, 0.5)
		this.selector = scene.physics.add.existing(box) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody
		scene.physics.add.overlap(this.selector, this.items, this.handleOverlapItem, undefined, this)
	}

	start()
	{
		const { x, y } = this.gameObject
		this.selector?.setPosition(x, y - 24)
	}

	update(dt: number)
	{
		const { x, y } = this.gameObject
		const distance = 24

		if (this.cursors.left.isDown)
		{
			// move cursor to left
			this.selector?.setPosition(x - distance, y)
			this.clearSelectedItem()
		}
		else if (this.cursors.right.isDown)
		{
			// move cursor to right
			this.selector?.setPosition(x + distance, y)
			this.clearSelectedItem()
		}
		else if (this.cursors.up.isDown)
		{
			// move cursor to up
			this.selector?.setPosition(x, y - distance)
			this.clearSelectedItem()
		}
		else if (this.cursors.down.isDown)
		{
			// move cursor to down
			this.selector?.setPosition(x, y + distance)
			this.clearSelectedItem()
		}
		else if (this.selectedItem && Phaser.Input.Keyboard.JustUp(this.cursors.space))
		{
			// space pressed with selected item
			this.events.emit('interaction', this.selectedItem)

			// TODO: show a dialog asking if you want to buy item for price
			// with ok and cancel buttons
		}
	}

	onInteraction(callback: () => void, context?: any)
	{
		this.events.on('interaction', callback, context)

		return () => {
			this.events.off('interaction', callback, context)
		}
	}

	private handleOverlapItem(obj1: Phaser.GameObjects.GameObject, item: Phaser.GameObjects.GameObject)
	{
		if (this.selectedItem?.gameObject === item)
		{
			return
		}

		const itemComponent = this.components.findComponent(item, Item)
		this.selectedItem = itemComponent
	}

	private clearSelectedItem()
	{
		this.selectedItem = undefined
	}
}