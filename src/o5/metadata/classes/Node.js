/**
 * @private Not for public use
 * @author lmayle
 */

o5.metadata.classes.Node = class Node extends o5.EventTarget
{
	constructor()
	{
		super();
	}
	
	get nodeName()
	{
		return this.__proto__.constructor.name;
	}
};

o5.log.setAll(o5.metadata.classes.Node, true);

