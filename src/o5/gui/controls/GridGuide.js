/**
 * The O5Js GridGuide control uses {@link o5.gui.controls.ChannelList}, {@link o5.gui.controls.TimeList} and {@link o5.gui.controls.GridGuideProgramGrid}
 * 
 * Example markup for GridGuide is:
 * 
 * 	<o5-grid-guide></o5-grid-guide>
 * 
 * {@img gridguide.png}
 * 
 * See [Getting Started Guide](#!/jsduck/examples) to check GridGuide example.
 * 
 * @class o5.gui.controls.GridGuide
 * @extends o5.gui.controls.Control
 *
 * @author lmayle
 */

o5.gui.controls.GridGuide = function GridGuide () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.GridGuide);

//o5.log.setAll(o5.gui.controls.GridGuide, true);

o5.gui.controls.GridGuide.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
	
	this.channelList	 			= this.appendChild(this.ownerDocument.createElement('o5-channel-list'));
	this.channelList.orientation 	= 'vertical';
	if(this._channelItemTemplate)
	{
		this.channelList._itemTemplateResolved = this._channelItemTemplateResolved;
	}
	
	this.timeline 					= this.appendChild(this.ownerDocument.createElement('o5-time-list'));
	this.timeline.name 				= 'timeline';
	
	this.eventsGrid 				= this.appendChild(this.ownerDocument.createElement('o5-grid-guide-program-grid'));
	if(this._programCellTemplate)
	{
		this.eventsGrid._cellTemplateResolved = this._programCellTemplateResolved;
	}
	else
	{
		this.eventsGrid.cellTemplate 	= 'o5-grid-guide-program-cell';
	}
	this.eventsGrid.rowTemplate 	= 'o5-grid-guide-program-row';
	this.eventsGrid.fixedLayout 	= true;
	
//	this.eventsGrid._doMove = this._doMoveE;
	this.channelList._doMove = this._doMoveC.bind(this);
	this.channelList._checkCyclic = this._checkCyclic.bind(this);
	this.channelList._updateTransform = this._updateTransform.bind(this);
	this.channelList._overflowFactor = 99999;
	
//	this.anchorTime = new Date('20 Dec 2016 12:00:00 GMT');
	
	this.timeGridSpan = 30;
	this.lineVerticalSpacing = 52;
	this.maxServices = 0;
	
	this.anchorTime = new Date(Math.floor((new Date()).getTime() / (this.timeGridSpan * 60 * 1000)) * this.timeGridSpan * 60 * 1000);
	
//	this.anchorTime = new Date(Math.floor((new Date('23 Sep 2017 00:00:00 GMT')).getTime() / (this.timeGridSpan * 60 * 1000)) * this.timeGridSpan * 60 * 1000);
	
	this.tabIndex = 0;
	
	if (this.attributes["autofocus"])
	{
		this.focus();
	}
	this.addEventListener("keydown", this._onKeyDown);
	
	this.log(this.anchorTime.addMinutes(this.timeGridSpan) - new Date());
	
	this.ownerDocument.defaultView.setTimeout(this._updateData.bind(this), this.anchorTime.addMinutes(this.timeGridSpan) - new Date());
	
	this.ownerDocument.defaultView.setInterval(this._updateTimeIndicator.bind(this), 60 * 1000);
};




/*
 * Events
 */
/**
 * @event ondatechange
 * Fired when the date of the grid visible time range changes, that is, when grid moves left or right.
 * @param {Date} currentDate The current date.
 */




/*
 * Public properties
 */
//o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(o5.gui.controls.GridGuide.prototype, 'channelItemTemplate',	{
//	template: o5.gui.controls.ChannelListItem,
//	querySelector: ':scope template'
//});

/**
 * Gets or sets the template for the channels
 * @property channelItemTemplate
 * @htmlDataAttribute
 * @type {Object}
 */
o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(o5.gui.controls.GridGuide.prototype, 'channelItemTemplate',	{
	template: o5.gui.controls.ChannelListItem,
	querySelector: ':scope template[type=channel-item]'
});

//o5.gui.controls.Control.definePropertyWithDataAttribute(o5.gui.controls.GridGuide.prototype, 'programCellTemplate',	{
//	template: o5.gui.controls.GridGuideProgramCell,
//	querySelector: ':scope template'
//});

/**
 * Gets or sets the template for the programs on each channel
 * @property programCellTemplate
 * @htmlDataAttribute
 * @type {Object}
 */
o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(o5.gui.controls.GridGuide.prototype, 'programCellTemplate',	{
	template: o5.gui.controls.GridGuideProgramCell,
	querySelector: ':scope template[type=program-cell]'
});

//o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(o5.gui.controls.GridGuide.prototype, 'timelineItemTemplate',	{
//	template: o5.gui.controls.ListItem,
//	querySelector: ':scope template'
//});



/**
 * Optional Element used to visually display the current time in the grid 
 * @property currentTimeIndicator
 * @htmlDataAttribute
 * @type {HTMLElement,String}
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(o5.gui.controls.GridGuide.prototype, 'currentTimeIndicator',	{
	get: function get ()
	{
		return this._currentTimeIndicator;
	},
	set: function set (val)
	{
    	if (typeof val === 'string')
    	{
    		this._currentTimeIndicator = this.ownerDocument.createElement(val);
    		
    		this._currentTimeIndicator.style.position = 'absolute';

    		this.appendChild(this._currentTimeIndicator);
    	}
	},
	toAttribute: function toAttribute (val)
	{
    	return val ? val.localName : '';
    },
	fromAttribute: function fromAttribute (val)
	{
    	return val;
    }
});


/**
 * Represents the currently selected channel if any, null otherwise
 * @property selectedChannel
 * @type {o5.gui.controls.ChannelListItem}
 */
Object.defineProperty(o5.gui.controls.GridGuide.prototype, 'selectedChannel', {
	get: function get ()
	{
		return this.channelList.selectedItem;
	},
	set: function set (val)
	{
		this.channelList.selectedItem = val;
		
		this.eventsGrid.selectedRow = this.channelList.selectedItem ? this.channelList.selectedItem.eventsRow.itemIndex : null;
	},
	enumerable: true
});


/**
 * Returns the first visible channel in the grid if any, undefined otherwise
 * @property firstVisibleChannel
 * @type {o5.gui.controls.ChannelListItem}
 * @readonly
 */
Object.defineProperty(o5.gui.controls.List.prototype, 'firstVisibleChannel', {
	get: function get ()
	{
		return this.channelList.firstVisibleItem;
	},
	enumerable: true
});


/**
 * Returns the last visible channel in the grid if any, undefined otherwise
 * @property lastVisibleChannel
 * @type {o5.gui.controls.ChannelListItem}
 * @readonly
 */
Object.defineProperty(o5.gui.controls.List.prototype, 'lastVisibleChannel', {
	get: function get ()
	{
		return this.channelList.lastVisibleItem;
	},
	enumerable: true
});


/**
 * When set to true, in case of gaps in the program list for any given channel, o5js will create "empty" program items to fill such gaps 
 * @property [fillProgramGaps="false"]
 * @type {Boolean}
 */
Object.defineProperty(o5.gui.controls.List.prototype, 'fillProgramGaps', {
	get: function get ()
	{
		return this._fillProgramGaps || false;
	},
	set: function set (val)
	{
		this._fillProgramGaps = val;
	},
	enumerable: true
});


/**
 * Limits how far in the future the grid may go, in days, regardless of having event information or not.
 * 
 * If set to null, there is no limit.
 * @property [maxDaysFuture="null"]
 * @type {Integer}
 */
Object.defineProperty(o5.gui.controls.List.prototype, 'maxDaysFuture', {
	get: function get ()
	{
		return this._maxDaysFuture || null;
	},
	set: function set (val)
	{
		this._maxDaysFuture = val;
	},
	enumerable: true
});


/**
 * The time range of the grid, in minutes.
 * 
 * This value should be a multiple of the effective width of the program grid to avoid rounding errors in the alignment of the program cells.
 * 
 * @property [gridTimeRange=150]
 * @type {Integer}
 */
Object.defineProperty(o5.gui.controls.GridGuide.prototype, 'gridTimeRange', {
	get: function () {

		return this._gridTimeRange || 150;
	},
	set: function (val) {

		this._gridTimeRange = val;
	},
	enumerable: true
});


/**
 * Enables or disables circular navigation of the list items in an infinite loop.
 * This may trigger multiple layout updates while moving elements between the edges
 *  in order to properly assess the placement of individual list items without
 *  enforcing restrictions on the layout of each item
 * 
 *     <o5-list data-cyclic></o5-list>
 * 
 * @property {Boolean} [cyclic=false]
 */
o5.gui.controls.Control.defineBooleanPropertyWithDataAttribute(o5.gui.controls.GridGuide.prototype, 'cyclic', {
	set: function (val) {

		if(val)
		{
	    	this.fastMove = true;
		}
		else
		{
	    	this.fastMove = false;
		}
		
		this.channelList.cyclic = val;
		
		this._cyclic = val;
	}
});



/*
 * Public methods
 */
/**
 * @ignore overrides base control method
 */
o5.gui.controls.GridGuide.prototype.updateLayout = function updateLayout ()
{
	var viewportLength = this.timeline._viewportLength2 || this.timeline._viewportLength;
	
	this.timeRatio = viewportLength / this.gridTimeRange;
	
	if(!Number.isInteger(viewportLength / this.gridTimeRange))
	{
		this.logWarning('The width of the program grid is not a multiple of the time range, this may lead to rounding issues in the placement of the programs');
	}
	
	this.timeSpam = viewportLength / this.timeRatio;
	
	this.timeline.init(this.anchorTime, new Date(this.anchorTime.getTime() + this.gridTimeRange * 60000), this.timeGridSpan * 60000, 60000 / this.timeRatio);
	
	this._startTime = this.anchorTime;
	this._endTime = this.anchorTime.addMinutes(this.timeSpam);

	this._updateTimeIndicator();
	
	if(!this._previousAnchorTime)
	{
		this._previousAnchorTime = this.anchorTime;
	}
	else if(this.anchorTime.valueOf() != this._previousAnchorTime.valueOf())
	{
		var evt = new Event("datechange", { bubbles: false, cancelable: true });
		evt.currentDate = this.anchorTime;
		this.dispatchEvent(evt);
		this._previousAnchorTime = this.anchorTime;
	}
	
	if(this.cyclic)
	{
		this._checkCyclic();
		this.channelList._checkMove();
	}
};


/**
 * Load the grid guide with all channels available in the service list, optionally filtering and sorting
 * @method loadAllChannels
 * @param {Function} [filter] Optional filter function, similar to the argument of Array.filter
 * @param {Function} [sort] Optional sort function, similar to the argument of Array.sort
 */
o5.gui.controls.GridGuide.prototype.loadAllChannels = function loadAllChannels (filter, sort)
{
	this.logEntry();
	
	this.eventsGrid.deleteAllRows();
	
	this.updateLayout();
	
	this.channelList.loadChannels(filter, sort);
	
	for (var channel = this.channelList._container.firstElementChild; channel; channel = channel.nextElementSibling)
	{
		channel.eventsRow = this.eventsGrid.insertRow();
		channel.eventsRow.fixedLayout = true;
		channel.eventsRow.style.position = 'absolute';
		channel.eventsRow.style.top = channel.offsetTop + 'px';
	}
	
	if(this.cyclic)
	{
		this._checkCyclic();
		this.channelList._checkMove();
	}
	
	this._loadOrUpdateEventsWithinViewport();
	
	this._updateTimeIndicator();
};



/**
 * Selects the given channel in the grid guide and scrolls it as needed.
 * @method selectChannel
 * @param {gui.controls.ChannelListItem} item Channel to be selected
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.GridGuide.prototype.selectChannel = function selectChannel (item, skipAnimation)
{
	var ret = this.channelList.selectItem(item, skipAnimation);
	
	if(ret)
		this.eventsGrid.selectRow(this.channelList.selectedItem ? this.channelList.selectedItem.eventsRow.itemIndex : null, skipAnimation);

	return ret;
};


/**
 * Selects the nearest program in the selected row by the given time
 * @method selectProgramByTime
 * @param {Date} time The given time
 * @param {Boolean} [skipAnimation=false] Option to skip animations
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.GridGuide.prototype.selectProgramByTime = function selectProgramByTime (time, skipAnimation)
{
	if(!this.eventsGrid.selectedRow)
		return false;
	
	var program = this.eventsGrid._findClosestProgram(time);
	
	if(!program)
		return false;

	return this.eventsGrid.selectedRow.selectCell(program.itemIndex, skipAnimation);
};


/**
 * Inserts a virtual channel in the grid
 * @method loadAllChannels
 * @param {Object} data The data object to be used with this new channel
 * @param {Function} fetchPrograms Function provided by the application to fetch programs for this channel
 */
o5.gui.controls.GridGuide.prototype.insertVirtualChannel = function insertVirtualChannel (data, fetchPrograms)
{
	var channel = this.channelList.insertItem();
	
	channel.eventsRow = this.eventsGrid.insertRow();
	channel.eventsRow.fixedLayout = true;
	channel.eventsRow.style.position = 'absolute';
	
	if(this.cyclic)
	{
		this._checkCyclic(null, true);
		this.channelList._checkMove();
	}
	
	channel.eventsRow.style.top = channel.offsetTop + 'px';
	
	channel.data = data;
	channel._fetchPrograms = fetchPrograms;

	return channel;
};



/**
 * Deletes all programs currently loaded in the grid and loads new data
 * @method reloadPrograms
 */
o5.gui.controls.GridGuide.prototype.reloadPrograms = function reloadPrograms ()
{
	this.eventsGrid.deleteAllCells();
	
	this.anchorTime = new Date(Math.floor((new Date()).getTime() / (this.timeGridSpan * 60 * 1000)) * this.timeGridSpan * 60 * 1000);
	
	this.updateLayout();
	
	this._loadOrUpdateEventsWithinViewport();
};




/*
 * Private properties
 */

/*
 * Private methods
 */
//o5.gui.controls.GridGuide.prototype.attachedCallback = function attachedCallback ()
//{
//};


o5.gui.controls.GridGuide.prototype._updateData = function _updateData ()
{
	this.logEntry(this.anchorTime);
	
	this.eventsGrid.deleteAllCells();
	
	this.anchorTime = new Date(Math.floor((new Date()).getTime() / (this.timeGridSpan * 60 * 1000)) * this.timeGridSpan * 60 * 1000);
	
	this.updateLayout();
	
	this._loadOrUpdateEventsWithinViewport();
	
	this.log(this.anchorTime.addMinutes(this.timeGridSpan) - new Date());
	
	this.ownerDocument.defaultView.setTimeout(this._updateData.bind(this), this.anchorTime.addMinutes(this.timeGridSpan) - new Date());
	
	this._updateTimeIndicator();
};

o5.gui.controls.GridGuide.prototype._updateTimeIndicator = function _updateTimeIndicator ()
{
	this.logEntry(this.anchorTime, this._currentTimeIndicatorPos);
	
	if (!this._currentTimeIndicator)
	{
		return;
	}
	
	if(this.eventsGrid.offsetParent)
	{
		this._currentTimeIndicatorPos = this.eventsGrid.offsetLeft;
	}
	
	var diff = (new Date ()) - this.anchorTime;
	
	var x = this._currentTimeIndicatorPos + diff / (60000 / this.timeRatio);
	
	if(x >= this.eventsGrid.offsetLeft && x <= this.eventsGrid.offsetLeft + this.eventsGrid.offsetWidth)
	{
		this._currentTimeIndicator.style.left = x + 'px';
		this._currentTimeIndicator.style.display = '';
	}
	else
	{
		this._currentTimeIndicator.style.display = 'none';
	}
};


o5.gui.controls.GridGuide.prototype._onKeyDown = function _onKeyDown (e)
{
	this.logInfo(e.keyCode + ' ' + e.timeStamp);

	switch (e.key)
	{
	case 'ArrowLeft':
		if(this.eventsGrid.selectLeft(e.repeat))
		{
			e.preventDefault();
		}
		else
		{
			
		}
		break;
		
	case 'ArrowRight':
		if(this.eventsGrid.selectRight(e.repeat))
		{
			e.preventDefault();
		}
		else
		{
		}
		break;
		
	case 'ArrowUp':
		this.channelList.selectPrevious(e.repeat);
		this.eventsGrid.selectRow(this.channelList.selectedItem.eventsRow.itemIndex, e.repeat);
		e.stopImmediatePropagation();
		break;
		
	case 'ArrowDown':
		this.channelList.selectNext(e.repeat);
		this.eventsGrid.selectRow(this.channelList.selectedItem.eventsRow.itemIndex, e.repeat);
		e.stopImmediatePropagation();
		break;
		
	case 'ChannelUp':
		if(this.channelList.selectPreviousPage(e.repeat))
		{
			this.eventsGrid.selectRow(this.channelList.selectedItem.eventsRow.itemIndex, e.repeat);
			e.stopImmediatePropagation();
		}
		break;
		
	case 'ChannelDown':
		if(this.channelList.selectNextPage(e.repeat))
		{
			this.eventsGrid.selectRow(this.channelList.selectedItem.eventsRow.itemIndex, e.repeat);
			e.stopImmediatePropagation();
		}
		break;
	case 'TrackPrevious':
	case 'Rewind':
		if(this.eventsGrid.selectPageLeft(e.repeat))
		{
			e.stopImmediatePropagation();
		}
		break;
		
	case 'TrackNext':
	case 'FastForward':
		if(this.eventsGrid.selectPageRight(e.repeat))
		{
			e.stopImmediatePropagation();
		}
		break;
	}
};




o5.gui.controls.GridGuide.prototype._loadOrUpdateEventsWithinViewport = function _loadOrUpdateEventsWithinViewport ()
{
	this.eventsGrid.loadEventsForRange(this.channelList.firstVisibleItem, this.channelList.lastVisibleItem,
									   this.anchorTime, this.anchorTime.addMinutes(this.timeSpam));
};












o5.gui.controls.GridGuide.prototype._doMoveC = function _doMove (tag)
{
	if(this.eventsGrid._container.style.transition != this.channelList._container.style.transition)
		this.eventsGrid._container.style.transition = this.channelList._container.style.transition;
	
	o5.gui.controls.ChannelList.prototype._doMove.call(this.channelList, tag);
	
	if(this.eventsGrid._container.style.transition != this.channelList._container.style.transition)
		this.eventsGrid._container.style.transition = this.channelList._container.style.transition;
	
	var e = new Event('eventselectionchange', {
		bubbles: false,
		cancelable: false
	});

	e.from = tag.from ? tag.from.eventsRow.selectedCell : null;
	e.to = tag.to ? tag.to.eventsRow.selectedCell : null;
	e.repeat = tag.skipAnimation;

	this.dispatchEvent(e);

//	this.loadOrUpdateEventsWithinViewport();
	this.eventsGrid.loadEventsForRange(this.channelList.firstVisibleItem, this.channelList.lastVisibleItem, this.anchorTime, this.anchorTime.addMinutes(this.timeSpam));
};

o5.gui.controls.GridGuide.prototype._updateTransform = function _updateTransform ()
{
	var ret = o5.gui.controls.ChannelList.prototype._updateTransform.call(this.channelList);
	
	if(this.eventsGrid._container.style.webkitTransform != this.channelList._container.style.webkitTransform)
		this.eventsGrid._container.style.webkitTransform = this.channelList._container.style.webkitTransform;
	
	return ret;
};

o5.gui.controls.GridGuide.prototype._checkCyclic = function _checkCyclic (tag, force)
{
	var before = this.channelList._container.firstElementChild;
	
	o5.gui.controls.ChannelList.prototype._checkCyclic.call(this.channelList, tag);
	
	if (!(this._cyclic && this._container.childElementCount > 1))
	{
		return;
	}
		
	if(force || this.channelList._container.firstElementChild != before)
	{
//		var ref = this.channelList._container.lastElementChild.eventsRow;
		
		for (var channel = this.channelList._container.firstElementChild; channel/* && channel != ref*/; channel = channel.nextElementSibling)
		{
			if(channel.eventsRow)
			{
//			this.eventsGrid._container.insertBefore(channel.eventsRow, ref);
//				channel.eventsRow.style.top = channel.offsetTop + 'px';
			}
		}
	}
	this.eventsGrid._container.style.transition = this.channelList._container.style.transition;
//	this.eventsGrid._container.style.webkitTransform = 'translate3d(0px, ' + (-this.channelList._viewportStart) + 'px, 0px)';
	this.eventsGrid._container.style.webkitTransform = this.channelList._container.style.webkitTransform;
};




