export interface IWithInteractionCallback
{
	onInteraction(callback: (...args: any[]) => void, context?: any)
}
