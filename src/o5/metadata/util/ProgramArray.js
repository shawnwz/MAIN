/**
 * @private Not for public use
 * @author lmayle
 */
o5.metadata.util.ProgramArray = class ProgramArray
{
	constructor ()
	{
		this.length = 0;
		this._start = [];
		this._end = [];
		this._id = Object.create(null);
	}
	
	push (item)
	{
		var start = item.startTime;
		
		if(!this._start[start])
		{
			this[this.length] = item;
			this.length++;
		}

		this._start[item.startTime] = item;
		this._end[item.endTime] = item;
		this._id[item.eventId] = item;
	}
	
	find (callback)
	{
		for(var item of this._start)
		{
			if(callback(item))
			{
				return item;
			}
		}
	}
	
	hasAllItemsForRange (start, end)
	{
		var mark = start;
		var item;
		
		for(var key of Object.keys(this._end))
		{
			if(key <= start)
				continue;
			
			item = this._end[key];
			var items = item.startTime;
			var iteme = item.endTime;
			
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
};