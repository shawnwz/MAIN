/**
 * The GridGuideProgramGrid control is subclass of {@link o5.gui.controls.FlexGrid} control and is used by {@link o5.gui.controls.GridGuide} control
 * 
 * Example markup for GridGuideProgramGrid is:
 * 
 * 	<o5-grid-guide-program-grid></o5-grid-guide-program-grid>
 * 
 * @class o5.gui.controls.GridGuideProgramGrid
 * @extends o5.gui.controls.FlexGrid
 *
 * @author lmayle
 */

o5.gui.controls.GridGuideProgramGrid = function GridGuideProgramGrid () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.GridGuideProgramGrid, o5.gui.controls.FlexGrid);

// o5.log.setAll(o5.gui.controls.GridGuideProgramGrid, true);

//o5.gui.controls.GridGuideProgramGrid.prototype.createdCallback = function createdCallback ()
//{
//	this.superCall();
//};



/*
 * Public properties
 */
/*
 * Public methods
 */
/**
 * Selects the left item in the list scrolls the list if required.
 * @method selectLeft
 * @return {Boolean} True if movement to the next list item has been made,
 * false if movement to the next list item was not made.
 */
o5.gui.controls.GridGuideProgramGrid.prototype.selectLeft = function selectLeft (skipAnimation)
{
	if (this.selectedRow)
	{
		if (!this.selectedRow.selectPrevious(skipAnimation))
		{
			this._previousHorizontalSelectionPoint = this.offsetWidth;

			var newTime = this.parentElement.anchorTime.addMinutes(-this.parentElement.timeSpam);
			
			var lowerDate = new Date();

			lowerDate.setMinutes(0, 0, 0);
			
			if (newTime >= lowerDate)
			{
				this.parentElement.anchorTime = newTime;
				
				this.deleteAllCells();
				
				this.parentElement.updateLayout();
				
				this._fromRight = true;
			
				this.queueReflowSet(function(){
					this.loadEventsForRange(this.parentElement.channelList.firstVisibleItem, this.parentElement.channelList.lastVisibleItem,
						this.parentElement.anchorTime, this.parentElement.anchorTime.addMinutes(this.parentElement.timeSpam));
				});
				
				return true;
			}
		}
		else
		{
			if(this.selectedRow.selectedCell.offsetLeft > 0)
			{
				this._previousHorizontalSelectionPoint = this.selectedRow.selectedCell.offsetLeft + this.selectedRow.selectedCell.offsetWidth / 2;
			}
			else
			{
				this._previousHorizontalSelectionPoint = 0;
			}
		}
	}

	return false;
};

/**
 * Selects the right item in the list and scrolls the list if required.
 * @method selectRight
 * @return {Boolean} True if movement to the next list item has been made,
 * false if movement to the next list item was not made.
 */
o5.gui.controls.GridGuideProgramGrid.prototype.selectRight = function selectRight (skipAnimation)
{
	if (this.selectedRow)
	{
		if (!this.selectedRow.selectNext(skipAnimation))
		{
			var newTime = this.parentElement.anchorTime.addMinutes(this.parentElement.timeSpam);
			
			if (this.parentElement.maxDaysFuture)
			{
				var higherDate = new Date();

				higherDate.setMinutes(0, 0, 0);
				higherDate.setTime(higherDate.getTime() +  (this.parentElement.maxDaysFuture * 24 * 60 * 60 * 1000));
				
				if (newTime > higherDate)
				{
					return false;
				}
			}
			
			this._previousHorizontalSelectionPoint = 0;
			
			this.parentElement.anchorTime = newTime;
			
			this.deleteAllCells();
			
			this.parentElement.updateLayout();
			
			this._fromLeft = true;
			
			this.queueReflowSet(function(){
				this.loadEventsForRange(this.parentElement.channelList.firstVisibleItem, this.parentElement.channelList.lastVisibleItem,
					this.parentElement.anchorTime, this.parentElement.anchorTime.addMinutes(this.parentElement.timeSpam));
			});
			
			return true;
		}
		else
		{
			this._previousHorizontalSelectionPoint = this.selectedRow.selectedCell.offsetLeft + this.selectedRow.selectedCell.offsetWidth / 2;
		}
	}

	return false;
};



/**
 * Selects the left item in the list scrolls the list if required.
 * @method selectLeft
 * @return {Boolean} True if movement to the next list item has been made,
 * false if movement to the next list item was not made.
 */
o5.gui.controls.GridGuideProgramGrid.prototype.selectPageLeft = function selectLeft (skipAnimation)
{
	if (this.selectedRow)
	{
		this._previousHorizontalSelectionPoint = this.offsetWidth;

		var newTime = this.parentElement.anchorTime.addMinutes(-this.parentElement.timeSpam);
		
		var lowerDate = new Date();
		lowerDate.setMinutes(0, 0, 0);
		
		if(newTime >= lowerDate)
		{
			this.parentElement.anchorTime = newTime;
			
			this.deleteAllCells();
			
			this.parentElement.updateLayout();
			
			this._fromRight = true;
		
			this.queueReflowSet(function(){
				this.loadEventsForRange(this.parentElement.channelList.firstVisibleItem, this.parentElement.channelList.lastVisibleItem,
					this.parentElement.anchorTime, this.parentElement.anchorTime.addMinutes(this.parentElement.timeSpam));
			});
			
			return true;
		}
	}

	return false;
};

/**
 * Selects the right item in the list and scrolls the list if required.
 * @method selectRight
 * @return {Boolean} True if movement to the next list item has been made,
 * false if movement to the next list item was not made.
 */
o5.gui.controls.GridGuideProgramGrid.prototype.selectPageRight = function selectRight (skipAnimation)
{
	if (this.selectedRow)
	{
		var newTime = this.parentElement.anchorTime.addMinutes(this.parentElement.timeSpam);
		
		if(this.parentElement.maxDaysFuture)
		{
			var higherDate = new Date();
			higherDate.setMinutes(0, 0, 0);
			higherDate.setTime(higherDate.getTime() +  (this.parentElement.maxDaysFuture * 24 * 60 * 60 * 1000));
			
			if(newTime > higherDate)
			{
				return false;
			}
		}
		
		this._previousHorizontalSelectionPoint = 0;
		
		this.parentElement.anchorTime = newTime;
		
		this.deleteAllCells();
		
		this.parentElement.updateLayout();
		
		this._fromLeft = true;
		
		this.queueReflowSet(function(){
			this.loadEventsForRange(this.parentElement.channelList.firstVisibleItem, this.parentElement.channelList.lastVisibleItem,
				this.parentElement.anchorTime, this.parentElement.anchorTime.addMinutes(this.parentElement.timeSpam));
		});
		
		return true;
	}

	return false;
};




/*
 * Private properties
 */

/*
 * Private methods
 */


o5.gui.controls.GridGuideProgramGrid.prototype.loadEventsForRange = function loadOrUpdateEventsInBulks (firstService, lastService, startTime, endTime)
{
	if (firstService && lastService)
		this.loadEvents(firstService, lastService, startTime, endTime);
};

o5.gui.controls.GridGuideProgramGrid.prototype.loadEvents = function loadEvents (firstService, lastService, startTime, endTime)
{
	var services = [];
	
	if (!firstService.eventsRow._container.childElementCount)
		services.push(firstService.data.id);
	
	for (; firstService != lastService;)
	{
		firstService = firstService.nextElementSibling;
		
		if (!firstService.eventsRow._container.childElementCount)
			services.push(firstService.data.id);
	}
	
//	if(firstService && firstService.nextElementSibling)
//	{
//		firstService = firstService.nextElementSibling;
//		
//		if(!firstService.eventsRow._container.childElementCount)
//			services.push(firstService.data.id);
//	}
	
	o5.metadata.readAheadPrograms(services,
								startTime.getTime(),
								endTime.getTime(),
								this.updateEvents.bind(this));
};

o5.gui.controls.GridGuideProgramGrid.prototype.updateEvents = function updateEvents (serviceEvents)
{
	this.logEntry();
	
	for (var i = 0; i < serviceEvents.length; i++)
	{
		var service = this.parentElement.channelList.getChannelItemByServiceId(serviceEvents[i].id);
		
		var events = service.data.programs;
		
//		var service = this.parentElement.channelList.getChannelItemByServiceId(serviceEvents.id);
//			
//		var events = o5.platform.btv.EPG.getEventsByWindow([ service.data.serviceId ], startTime.getTime(), endTime.getTime());
//		
//		if(this.parentElement.fillProgramGaps)
//		{
//			if(events.length === 0)
//			{
//				var evt = {};
//				
//				evt.eventId = null;
//				evt.serviceId = service.serviceId;
//				evt.startTime = startTime;
//				evt.endTime = endTime;
//				
//				events.push(evt);
//			}
//			else
//			{
//				var lastTime = startTime.getTime();
//				
//				for(var j = 0; j < events.length; j++)
//				{
//					var event = events[j];
//	
//					if(lastTime < event.startTime)
//					{
//						var evt = {};
//						
//						evt.eventId = null;
//						evt.serviceId = service.serviceId;
//						evt.startTime = lastTime;
//						evt.endTime = event.startTime;
//						
//						events.splice(j, 0, evt);
//					}
//					
//					lastTime = event.endTime;
//				}
//				
//				if(lastTime < endTime.getTime())
//				{
//					var evt = {};
//					
//					evt.eventId = null;
//					evt.serviceId = service.serviceId;
//					evt.startTime = lastTime;
//					evt.endTime = endTime.getTime();
//					
//					events.splice(j, 0, evt);
//				}
//			}
//		}
			
		this.addEventsToService(service, events);
		
//		service = service.nextElementSibling;
	}
};

o5.gui.controls.GridGuideProgramGrid.prototype.addEventsToService = function addEventsToService (service, events)
{
	this.logEntry();
	
	var viewportLength = this.parentElement.timeline._viewportLength2 || this.parentElement.timeline._viewportLength;
	
	for (var i = 0; i < events.length; i++)
	{
		var event = events[i];

		if (event.eventId != null && this.getEventItemByEventId(event.eventId, service))
			continue;
		
		var startTime = event.startTime;
		var endTime = event.endTime;
		
		var left = (startTime - this.parentElement.anchorTime) / 60000 * this.parentElement.timeRatio;
		var right = (endTime - this.parentElement.anchorTime) / 60000 * this.parentElement.timeRatio;
		
		if (left < 0)
			left = 0;
		
		if(right > viewportLength)
			right = viewportLength;
		
		if (right <= 0)
			continue;
		
		if(left >= viewportLength)
			continue;

		var item = service.eventsRow.insertCell();

		item.data = event;
		item.style.position = 'absolute';
		item.style.left = (left) + "px";
		item.style.width = (right - left) + "px";
	}
	
	if (this.selectedRow == service.eventsRow)
	{
		if (this._fromRight)
		{
			delete this._fromRight;
			service.eventsRow.selectCell(service.eventsRow._container.lastElementChild.itemIndex, true);
		}
		else if(this._fromLeft)
		{
			delete this._fromLeft;
			service.eventsRow.selectCell(0, true);
		}
		else
		{
			var pos = this._previousHorizontalSelectionPoint;
			
			var diff = Number.MAX_SAFE_INTEGER;
			
			var item = this.selectedRow;
			
			var nearest = item._container.firstElementChild;
			
			for (var i2 = item._container.firstElementChild; i2; i2 = i2.nextElementSibling)
			{
				var posA = i2._mainStart;
				var posB = i2._mainStart + i2._mainLength;
				var d2 = Number.MAX_SAFE_INTEGER;
				
				if(posA <= pos && posB >= pos)
				{
					nearest = i2;
					break;
				}
				else if(posB <= pos)
				{
					if(d2 < diff)
					{
						d2 = Math.abs(posB - pos);
					}
					
					nearest = i2;
				}
				else if(posA >= pos)
				{
					if(d2 < diff)
					{
						d2 = Math.abs(posA - pos);
					}
					
					nearest = i2;
				}
			}
			
			item.selectCell(nearest ? nearest.itemIndex : 0, true);
		}
	}
};

o5.gui.controls.GridGuideProgramGrid.prototype.getEventItemByEventId = function getEventItemByEventId (eventId, service)
{
	for (var event = service.eventsRow._container.firstElementChild; event; event = event.nextElementSibling)
	{
		if (event.data.eventId === eventId)
			return event;
	}
	
	return null;
};



o5.gui.controls.GridGuideProgramGrid.prototype._findClosestProgram = function _findClosestProgram (time)
{
	this.logEntry();
	
	var pos = (time - this.parentElement.anchorTime) / 60000 * this.parentElement.timeRatio;
	
	if(pos < 0)
		pos = 0;
	
	if(pos > this.clientWidth)
		pos = this.clientWidth;
		
	var diff = Number.MAX_SAFE_INTEGER;
	
	var row = this.selectedRow;
	
	if(!row)
		return;
	
	var nearest = row._container.firstElementChild;
	
	if(!nearest && this._previousHorizontalSelectionPoint === undefined)
	{
		this._previousHorizontalSelectionPoint = pos;
	}
	
	for (var i2 = row._container.firstElementChild; i2; i2 = i2.nextElementSibling)
	{
		var posA = i2._mainStart;
		var posB = i2._mainStart + i2._mainLength;
		var d2 = Number.MAX_SAFE_INTEGER;
		
		if(posA <= pos && posB >= pos)
		{
			nearest = i2;
			break;
		}
		else if(posB <= pos)
		{
			if(d2 < diff)
			{
				d2 = Math.abs(posB - pos);
			}
			
			nearest = i2;
		}
		else if(posA >= pos)
		{
			if(d2 < diff)
			{
				d2 = Math.abs(posA - pos);
			}
			
			nearest = i2;
		}
	}
	
	return nearest;
};


o5.gui.controls.GridGuideProgramGrid.prototype._selectItem = function _selectItem (index, skipAnimation)
{
	this.logEntry();

	if(this._selectedItem === index)
		return;
	
	if(!this._container.childElementCount)
	{
		this._viewportStart = 0;
		this._container.style.webkitTransform = '';
		this._container.style.margin = '';
		this._selectedItem = -1;
		
		return;
	}
	
	if(this.fastMove)
	{
		var now = performance.now();
	
		if ((now - this._lastSelectionChangeTimestamp) <= this._animationDurationMS * 1.1)
			skipAnimation = true;
	
		this._lastSelectionChangeTimestamp = now;
	}

	var previous = this._container.children[this._selectedItem];

	var item = this._container.children[index];
	
	this._selectedItem = index;
	
	if(previous && previous.selectedCell && item)
	{
		var pos = this._previousHorizontalSelectionPoint;
		
		if(pos === undefined && previous.selectedCell._mainStart <= 0)
			pos = 0;
		
		if(pos === undefined && previous.selectedCell._mainEnd >= this.clientWidth)
			pos = this.clientWidth;
			
		if(pos === undefined)
			pos = previous.selectedCell._mainStart + previous.selectedCell._mainLength / 2;

		var diff = Number.MAX_SAFE_INTEGER;
		
		var nearest = item._container.firstElementChild;
		
		if(!nearest && this._previousHorizontalSelectionPoint === undefined)
		{
			this._previousHorizontalSelectionPoint = pos;
		}
		
		for (var i2 = item._container.firstElementChild; i2; i2 = i2.nextElementSibling)
		{
			var posA = i2._mainStart;
			var posB = i2._mainStart + i2._mainLength;
			var d2 = Number.MAX_SAFE_INTEGER;
			
			if(posA <= pos && posB >= pos)
			{
				nearest = i2;
				break;
			}
			else if(posB <= pos)
			{
				if(d2 < diff)
				{
					d2 = Math.abs(posB - pos);
				}
				
				nearest = i2;
			}
			else if(posA >= pos)
			{
				if(d2 < diff)
				{
					d2 = Math.abs(posA - pos);
				}
				
				nearest = i2;
			}
		}
		
		previous.clearSelection();

		item.selectCell(nearest ? nearest.itemIndex : 0, skipAnimation);
	}
	else if(item)
	{
		var now = new Date();
		
		var cellToSelect = 0;
		
		if(this.parentElement._startTime <= now && this.parentElement._endTime > now)
		{
			now = now.getTime();
			
			for (var i3 = item._container.firstElementChild; i3; i3 = i3.nextElementSibling)
			{
				if(i3.data.startTime <= now && i3.data.endTime > now)
				{
					cellToSelect = i3.itemIndex;
				}
			}
		}
		
		item.selectCell(cellToSelect, skipAnimation);
		
//		cellToSelect = item.selectedItem;
		
		
	}

	this._movePending = true;
	this.queueReflowPrep(this._prepMove, { from: previous, to: item,
		skipAnimation: skipAnimation});
};
