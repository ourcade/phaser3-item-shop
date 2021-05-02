import { IWithInteractionCallback } from '../types/types'
import type { IComponent } from '../services/ComponentService'

export default class Item implements IComponent
{
	readonly name: string
	readonly price: number

	private _gameObject!: Phaser.GameObjects.GameObject

	private interactionSubscription?: () => void

	get gameObject()
	{
		return this._gameObject
	}

	constructor(trigger: IWithInteractionCallback, name: string, price: number)
	{
		this.name = name
		this.price = price

		this.interactionSubscription = trigger.onInteraction(this.handleInteraction, this)
	}

	init(go: Phaser.GameObjects.GameObject)
	{
		this._gameObject = go
	}

	destroy()
	{
		if (this.interactionSubscription)
		{
			this.interactionSubscription()
		}
	}

	private handleInteraction(component: IComponent)
	{
		if (component !== this)
		{
			return
		}
		
		console.log(this.name)
	}
}
