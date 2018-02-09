/**
 * @private Not for public use
 * @author lmayle
 */

o5.metadata.util.ChannelArray = class ChannelArray
{
	constructor()
	{
		this.length = 0;
		this.byId = Object.create(null);
		this.byNumber = Object.create(null);
		this.byName = Object.create(null);
	}
	
	push(item)
	{
		this.byId[item.id] = item;
		this.byNumber[item.number] = item;
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
	
	hasAllItemsForRange(start, end)
	{
		var mark = start;
		var item;
		
		for(var key of Object.keys(this._end))
		{
			if(key <= start)
				continue;
			
			item = this._end[key];
			var items = item.startTime.getTime();
			var iteme = item.endTime.getTime()
			
			if(items > mark)
			{
				return false;
			}
			
			mark = iteme;
			
			if(mark >= end)
				return true;
		}
		
		return false;
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