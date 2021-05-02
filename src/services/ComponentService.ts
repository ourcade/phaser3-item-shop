import Phaser from 'phaser'
import short from 'short-uuid'

export type Constructor<T extends {} = {}> = new (...args: any[]) => T

export interface IComponent
{
	// NOTE: components were added later
	init(go: Phaser.GameObjects.GameObject, components: ComponentService)

	awake?: () => void
	start?: () => void
	update?: (dt: number) => void

	destroy?: () => void
}

// NOTE: this interface were added later
export interface IComponentsService
{
	addComponent(go: Phaser.GameObjects.GameObject, component: IComponent)
	findComponent<ComponentType>(go: Phaser.GameObjects.GameObject, componentType: Constructor<ComponentType>)
	destroy()
	update(dt: number)
}

export default class ComponentService implements IComponentsService
{
	private componentsByGameObject = new Map<string, IComponent[]>()

	private queuedForStart: IComponent[] = []

	addComponent(go: Phaser.GameObjects.GameObject, component: IComponent)
	{
		if (!go.name)
		{
			// give it an id if not exist
			go.name = short.generate()
		}
		
		if (!this.componentsByGameObject.has(go.name))
		{
			this.componentsByGameObject.set(go.name, [])
		}
		
		const list = this.componentsByGameObject.get(go.name)
		list!.push(component)

		component.init(go, this)
		if (component.awake)
		{
			component.awake()
		}

		if (component.start)
		{
			this.queuedForStart.push(component)
		}
	}

	findComponent<ComponentType>(go: Phaser.GameObjects.GameObject, componentType: Constructor<ComponentType>)
	{
		const components = this.componentsByGameObject.get(go.name) ?? []
		return components.find(component => component instanceof componentType) as ComponentType | undefined
	}

	destroy()
	{
		this.componentsByGameObject.forEach(components => {
			components.forEach(component => {
				if (component.destroy)
				{
					component.destroy()
				}
			})
		})
	}

	update(dt: number)
	{
		while (this.queuedForStart.length > 0)
		{
			const component = this.queuedForStart.shift()
			if (component && component.start)
			{
				component.start()
			}
		}

		this.componentsByGameObject.forEach(components => {
			components.forEach(component => {
				if (component.update)
				{
					component.update(dt)
				}
			})
		})
	}
}