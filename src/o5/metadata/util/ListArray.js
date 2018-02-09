/**
 * @private Not for public use
 * @author lmayle
 */

o5.metadata.util.ListArray = class ListArray
{
	constructor()
	{
		this.length = 0;
		this.byId = Object.create(null);
		this.byName = Object.create(null);
	}
	
	push(item)
	{
		this.byId[item.id] = item;
		this.byName[item.name] = item;
		this[this.length] = item;
		this.length++;
	}
	
	find(callback)
	{
		for(var item of this._start)
		{
			if(callback(item))
			{
				return item;
			}
		}
	}
	
	[Symbol.iterator]()
	{
	    return {
	    	i: 0,
	    	values: Object.values(this.byId),
	    	next()
	    	{
	    		if (this.i < this.values.length)
	    		{
	    			return { value: this.values[this.i++], done: false };
	    		}
	    		return { value: undefined, done: true };
	        }
	    };
	}
};