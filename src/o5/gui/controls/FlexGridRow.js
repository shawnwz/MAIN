/**
 * Flexible List element, works like a simple HTML Table with a single row or column
 *
 * Example markup for a central focus horizontal list:
 *
 *     <o5-list data-orientation='horizontal' data-focus-point='50%'>
 *       <template>
 *         <o5-list-item>
 *           <img src='image.png'>
 *           <p>Text</p>
 *         </o5-list-item>
 *       </template>
 *     </o5-list>
 *
 * If no template element is provided, the generic o5-list-item will be used
 *
 * @class o5.gui.controls.FlexGridRow
 * @extends o5.gui.controls.Control
 *
 * @author lmayle
 */

o5.gui.controls.FlexGridRow = function FlexGridRow () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.FlexGridRow);

//o5.log.setAll(o5.gui.controls.FlexGridRow, true);

o5.gui.controls.FlexGridRow.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
	this.logEntry();

	if (!this._orientation)
		this._orientation = 'h';

	this._container = this.ownerDocument.createElement("div");
	this._container.style.cssText = 'display: -webkit-inline-flex; height: 100%; ';
	this.appendChild(this._container);

	this._selectedCell = -1;

	/*this.tabIndex = -1;

	if (this.attributes.autofocus)
	{
		this.focus();
	}*/

	this.addEventListener("keydown", this._onKeyDown);
};




/*
 * Public properties
 */

/**
 * Gets or sets the template used for the items of this list
 *
 * Can be defined in the markup, example:
 * 
 *     <o5-list item-template="app-list-item">
 *     </o5-list>
 *
 * Or as an inline template:
 * 
 *     <o5-list>
 *       <template>
 *         <app-list-item>
 *           <img src='image.png'>
 *           <p>Text</p>
 *         </app-list-item>
 *       </template>
 *     </o5-list>
 *
 * @property itemTemplate
 * @type {Object}
 */
o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(o5.gui.controls.FlexGridRow.prototype, 'cellTemplate',	{
	template: o5.gui.controls.FlexGridCell,
	querySelector: ':scope template'
});


/**
 * Gets or sets the element used as focus box
 *
 * Can be defined in the markup, example:
 * 
 *     <o5-list data-focus-box="app-focus-box">
 *     </o5-list>
 *
 * @property focusBox
 * @type {o5.gui.controls.FocusBox}
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(o5.gui.controls.FlexGridRow.prototype, 'focusBox',	{
	get: function get ()
	{
		return this._focusBox;
	},
	set: function set (val)
	{
    	if (typeof val === 'string')
    	{
    		this._focusBox = this.ownerDocument.createElement(val);
    		
    		this._focusBox.style.display = 'none';

    		this.appendChild(this._focusBox);
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
 * Gets or sets the focus point.
 * Options are:
 * 
 * 	[Default] 'auto', where focus point will move as needed to keep the selected item within the visible area of the o5-list
 *  Fixed point in pixels, relative to start of main axis
 * 	Percentage of length of main axis, as a number string with % symbol
 *
 * Can be defined in the markup, example:
 * 
 *     <o5-list data-focus-point=50%>
 *     </o5-list>
 *
 * @property focusPoint
 * @type {Number,String}
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(o5.gui.controls.FlexGridRow.prototype, 'focusPoint',	{
	get: function get ()
	{
		if (this._focusPoint > 0 && this._focusPoint < 1)
			return (this._focusPoint * 100) + '%';
		return 'auto';
	},
	set: function set (val)
	{
    	switch (typeof val)
    	{
    	case 'string':
    		
			if (val.indexOf('%') !== -1)
			{
				val = (parseFloat(val) / 100);
				
				if (val < 0)
					val = 0;
				else if (val > 1)
					val = 1;

				this._focusPoint = val;
			}
			else
			{
				val = parseFloat(val) || null;
				
				if (val < 0)
					val = 0;
				
				this._focusPoint = val;
			}
			
			break;
			
    	case 'number':
    		
			if (val < 0)
				val = 0;
			
			this._focusPoint = val;
			
			break;
		default:
    	}
		
		if (this._container && this._container.childElementCount)
			this._selectItem(this._selectedCell);
	}
});


/**
 * Gets or sets the orientation of the list.
 * Options are:
 * 
 * 	[Default] 'horizontal'
 *  'vertical'
 *
 * @property orientation
 * @type {String}
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(o5.gui.controls.FlexGridRow.prototype, 'orientation',	{
	get: function get ()
	{
		if (this._orientation === 'v')
			return 'vertical';
		return 'horizontal';
	},
	set: function set (val)
	{
    	if (typeof val === 'string')
    	{
    		this._orientation = val === 'vertical' ? 'v' : 'h';

    		if (this._orientation === 'v')
    		{
    			this._container.style.display = '-webkit-flex';
    			this._container.style.webkitFlexDirection = 'column';
    			this._container.style.width = '100%';
    			this._container.style.height = '';
    		}
    		else
    		{
    			this._container.style.display = '-webkit-inline-flex';
    			this._container.style.webkitFlexDirection = '';
    			this._container.style.width = '';
    			this._container.style.height = '100%';
    		}
    	}
	},
	toAttribute: function toAttribute (val)
	{
		if (val === 'v')
			return 'vertical';
		return 'horizontal';
	},
	fromAttribute: function fromAttribute (val)
	{
		if (val === 'vertical')
			return 'v';
		return 'h';
	}
});


/**
 * Represents the currently selected item if any, null otherwise
 * @property selectedCell
 * @type {Object}
 */
Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, 'selectedCell', {
	get: function get ()
	{
		return this._container.children[this._selectedCell];
	},
	set: function set (val)
	{
		if (typeof val === 'number')
		{
			if (val >= 0 && val < this._container.children.length && val !== this._selectedCell)
			{
				this._selectItem(val);
			}
			else if (val === -1)
			{
				this._selectItem(-1);
			}
		}
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
o5.gui.controls.Control.defineBooleanPropertyWithDataAttribute(o5.gui.controls.FlexGridRow.prototype, 'cyclic', {
	set: function set (val)
	{
		if (val)
		{
	    	this.fastMove = true;
		}
		else
		{
	    	this.fastMove = false;
		}
		
		this._cyclic = val;
	}
});


/**
 * Returns the number of pages based on current layout
 * @property pageCount
 * @type {Number}
 * @readonly
 */
Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, 'pageCount', {
	get: function get ()
	{
		if (this._container.childElementCount === 0)
			return 0;
		
		if (this._mainLength <= this._viewportLength)
			return 1;
		
		return Math.ceil(this._mainLength / this._viewportLength);
	},
	enumerable: true
});


/**
 * Returns the current page number
 * @property currentPage
 * @type {Number}
 * @readonly
 */
Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, 'currentPage', {
	get: function get ()
	{
		if (this._container.childElementCount === 0)
			return 1;
		
		if (this._mainLength <= this._viewportLength)
			return 1;
		
		if (this._viewportStart <= 0)
			return 1;
			
		return Math.ceil(this._viewportStart / this._viewportLength) + 1;
	},
	set: function set ()
	{
	},
	enumerable: true
});


/**
 * Returns the first visible item in the list if any, undefined otherwise
 * @property firstVisibleItem
 * @type {o5.gui.controls.FlexGridRowItem}
 * @readonly
 */
Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, 'firstVisibleItem', {
	get: function get ()
	{
		if (this._container.childElementCount === 0)
			return undefined;
		
		var low = this._viewportStart;
		
		var item;
		
		if (this.selectedCell && this.selectedCell._mainStart > low)
		{
			for (item = this.selectedCell; item.previousElementSibling; item = item.previousElementSibling)
			{
				if (item.previousElementSibling._mainStart < low)
				{
					break;
				}
			}
		}
		else
		{
			for (item = this._container.firstElementChild; item; item = item.nextElementSibling)
			{
				if (item._mainStart >= low)
				{
					break;
				}
			}
		}
		
		return item;
	},
	enumerable: true
});


/**
 * Returns the last visible item in the list if any, undefined otherwise
 * @property lastVisibleItem
 * @type {o5.gui.controls.FlexGridRowItem}
 * @readonly
 */
Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, 'lastVisibleItem', {
	get: function get ()
	{
		if (this._container.childElementCount === 0)
			return undefined;
		
		var high = this._viewportLength + this._viewportStart;
		
		var item;
		
		if (this.selectedCell && this.selectedCell._mainEnd < high)
		{
			for (item = this.selectedCell; item.nextElementSibling; item = item.nextElementSibling)
			{
				if (item.nextElementSibling._mainEnd > high)
				{
					break;
				}
			}
		}
		else
		{
			for (item = this._container.lastElementChild; item; item = item.previousElementSibling)
			{
				if (item._mainEnd <= high)
				{
					break;
				}
			}
		}
		
		return item;
	},
	enumerable: true
});



/**
 * @property fastMove
 * @type {Boolean}
 * @ignore
 */
Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, 'fastMove', {
	get: function get ()
	{
		return this._fastMove || true;
	},
	set: function set (val)
	{
		this._fastMove = val;
	},
	enumerable: true
});


/**
 * When set to true, the layout of the list items will be fixed, 
 * 	the position of the items will not be updated by the list itself as the selection changes.
 * This is intended to be used with o5.gui.controls.FlexGridRow.offsetAttributes so that the application has total control of the layout of the list items.
 * @property [fixedLayout=false]
 * @type {Boolean}
 */
Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, 'fixedLayout', {
	get: function get ()
	{
		return this._fixedLayout || false;
		
	},
	set: function set (val)
	{
		this._fixedLayout = val;
		
		if (this._fixedLayout)
		{
			this._container.style.cssText = '';
		}
		
	},
	enumerable: true
});



/**
 * When enabled, the list items will have an "offset" attribute dynamically updated as the selection changes,
 * starting from 0 for the selected item, which can be used with CSS attribute selectors.
 * Updating attributes dynamically has a performance overhead, so only enable this when needed.
 * @property [offsetAttributes=false]
 * @type {Boolean}
 */
Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, 'offsetAttributes', {
	get: function get ()
	{
		return this._offsetAttributes || false;
	},
	set: function set (val)
	{
		this._offsetAttributes = val;
		
	},
	enumerable: true
});



/*
 * Public methods
 */
/**
 * Inserts a new item in the list created from the configured item template
 * 
 * @method insertItem
 * @return {o5.gui.controls.FlexGridRowItem} The new list item
 */
o5.gui.controls.FlexGridRow.prototype.insertCell = function insertCell ()
{
	var item = this.parentControl._cellTemplateResolved.cloneNode(true);//this._cellTemplateResolved.cloneNode(true);

	if (this._container.childElementCount > 5 && this._container.childElementCount > this._overflowVisibilityCount)
	{
		this._manageVisibility = true;
		
		var marginEnd = this._orientation === 'v' ?
				(parseFloat(this._container.style.marginBottom) || 0) :
				(parseFloat(this._container.style.marginRight) || 0);
				
		if (this._overflow || !this.offsetParent)
		{
			if(!marginEnd)
				marginEnd = this._container.lastElementChild._mainStart + this._container.lastElementChild._mainLength;
			this._overflow = true;
			item.style.display = 'none';
			item._mainLength2 = this._overflowLength;
			item._mainStart2 = marginEnd;
			marginEnd += this._overflowLength;
		}
		else
		{
			if (this._orientation === 'v')
			{
		    	if (this.offsetHeight < this._container.offsetHeight)
		    	{
					if (this._container.lastElementChild.offsetTop >= this.offsetHeight)
					{
						item.style.display = 'none';
						this._overflow = true;
						this._overflowLength = this._container.lastElementChild._mainLength;
						item._mainLength2 = this._overflowLength;
						item._mainStart2 = marginEnd;
						marginEnd += this._overflowLength;
					}
		    	}
			}
			else
			{
		    	if (this.offsetWidth < this._container.offsetWidth)
		    	{
		    		if (this._container.lastElementChild.offsetLeft >= this.offsetWidth)
		    		{
						item.style.display = 'none';
						this._overflow = true;
						this._overflowLength = this._container.lastElementChild._mainLength;
						item._mainLength2 = this._overflowLength;
						item._mainStart2 = marginEnd;
						marginEnd += this._overflowLength;
		    		}
		    	}
			}
		}
		
		if (this._overflowLength)
		{
			if (this._orientation === 'v')
				this._container.style.marginBottom = marginEnd + 'px';
			else
				this._container.style.marginRight = marginEnd + 'px';
		}
	}
	
	
	this._container.appendChild(item);

	if(!this.fixedLayout && this._container.childElementCount <= 1)
	{
		var cs = window.getComputedStyle(this);
		
		if (cs.overflow === 'hidden')
		{
//			this._manageVisibility = true;
			
			var vl = this._viewportLength;
			var il = item._mainLength;
			
			this._overflowLength = il;
			
			if (vl === 0 || il === 0)
			{
				this._overflowVisibilityCount = 9999; //temp
			}
			else
			{
				this._overflowVisibilityCount = (vl / il) * (1 + 2 * this._overflowFactor);
			}
		}
	}

	return item;
};


/**
 * Deletes all items from the list
 *
 * @method deleteAllItems
 */
o5.gui.controls.FlexGridRow.prototype.deleteAllItems = function deleteAllItems ()
{
	this.logEntry();
	
//	this._container.innerHTML = '';
	while (this._container.firstChild)
	{
		this._container.removeChild(this._container.firstChild);
	}
	
	this._selectItem(-1, true);
};


/**
 * Selects the given cell in the row and scrolls the list if required.
 * @method selectCell
 * @param {o5.gui.controls.FlexGridRowItem} item Item to be selected
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.FlexGridRow.prototype.selectCell = function selectCell (item, skipAnimation)
{
	if (typeof item === 'number')
	{
		if (item >= 0 && item < this._container.children.length && item !== this._selectedCell)
		{
			this._selectItem(item, skipAnimation);
			
			return true;
		}
	}

	return false;
};


/**
 * Clears the current item selection.
 * @method clearSelection
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.FlexGridRow.prototype.clearSelection = function clearSelection (skipAnimation)
{
	if (this._selectedCell != -1)
	{
		this._selectItem(-1, skipAnimation);
		
		return true;
	}

	return false;
};


/**
 * Selects the previous item in the list and scrolls the list if required.
 * @method selectPrevious
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.FlexGridRow.prototype.selectPrevious = function selectPrevious (skipAnimation)
{
	if (this._selectedCell <= 0)
	{
		if (this._cyclic && this._container.childElementCount > 1)
		{
			// forcefully move one element from the other end
			this._container.insertBefore(this._container.lastElementChild, this._container.firstElementChild);
			
			if (this._container.firstElementChild.style.display)
				this._container.firstElementChild.style.display = '';
			
			this._selectedCell++;
			
			this._viewportStart += this._container.firstElementChild._mainLength;
			this._updateTransform();
		}
		else
			return false;
	}

	this._selectItem(this._selectedCell - 1, skipAnimation);

	return true;
};

/**
 * Selects the next item in the list and scrolls the list if required.
 * @method selectNext
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.FlexGridRow.prototype.selectNext = function selectNext (skipAnimation)
{
	if (this._selectedCell >= this._container.childElementCount - 1)
	{
		if (this._cyclic && this._container.childElementCount > 1)
		{
			// forcefully move one element from the other end
			this._container.appendChild(this._container.firstElementChild);
			
			if (this._container.lastElementChild.style.display)
				this._container.lastElementChild.style.display = '';
			
			this._updateMargins();
			
			this._selectedCell--;
			
//			this._container.lastElementChild._mainStart2 = this._container.lastElementChild._mainLength2 + this._container.lastElementChild.previousElementSibling._mainStart2;
			
			this._viewportStart -= this._container.firstElementChild._mainLength;
			this._updateTransform();
		}
		else
			return false;
	}

	this._selectItem(this._selectedCell + 1, skipAnimation);

	return true;
};

/**
 * For lists with multiple pages, move to the previous page and select the first visible item
 * @method selectPreviousPage
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.FlexGridRow.prototype.selectPreviousPage = function selectPreviousPage (skipAnimation)
{
	if (this.pageCount <= 1)
		return false;
	
	var item = this.selectedCell;
	var item2 = item.previousElementSibling;
	
	if (!item2 && !this._cyclic)
		return false;
	
	if (this._focusPoint)
	{
		//simple perturbation
		this._viewportStart = this.selectedCell._mainStart - (this.selectedCell._mainLength / 2);
	}
	
	this._viewportStart -= this._viewportLength;
	this._checkCyclic();
	item2 = this.firstVisibleItem;
	this._viewportStart = item2._mainStart;
	
	this._selectItem(item2.itemIndex, skipAnimation);

	return true;
};

/**
 * For lists with multiple pages, move to the next page and select the first visible item
 * @method selectNextPage
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.FlexGridRow.prototype.selectNextPage = function selectNextPage (skipAnimation)
{
	if (this.pageCount <= 1)
		return false;
	
	var item = this.selectedCell;
	var item2 = item.nextElementSibling;
	
	if (!item2 && !this._cyclic)
		return false;
	
	if (this._focusPoint)
	{
		//simple perturbation
		this._viewportStart = this.selectedCell._mainStart - (this.selectedCell._mainLength / 2);
	}
	
	this._viewportStart += this._viewportLength;
	item2 = this.firstVisibleItem;
	this._checkCyclic();
	
	if (!item2) // moved it too far
		item2 = this._container.lastElementChild;
	else
	{
		if (item2._mainStart > this._viewportStart)
			item2 = item2.previousElementSibling;
	}
		
	this._viewportStart = item2._mainStart;
	
	this._selectItem(item2.itemIndex, skipAnimation);

	return true;
};


/**
 * @ignore overrides base control method
 */
o5.gui.controls.Control.prototype.updateLayout = function ()
{
	if(!this.fixedLayout)
	{
		this._updateViewport(this.selectedCell, true);
		this._postMove();
	}
};




/*
 * Private properties
 */

o5.gui.controls.FlexGridRow.prototype.delayActivation = 500;

o5.gui.controls.FlexGridRow.prototype.pagingOverflow = 0;

o5.gui.controls.FlexGridRow.prototype._overflowFactor = 1;



//Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, '_mainStart', {
//	get: function () {
//
//		if(this.offsetParent)
//		{
//			if(this._orientation === 'v')
//				this._mainStart2 = this._container.offsetTop;
//			else
//				this._mainStart2 = this._container.offsetLeft;
//		}
//		
//		return this._mainStart2;
//	},
//	enumerable: true
//});

//Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, '_mainEnd', {
//	get: function () {
//
//		if(this.offsetParent)
//		{
//			if(this._orientation === 'v')
//				this._mainEnd2 = this._container.offsetTop + this._mainLength;
//			else
//				this._mainEnd2 = this._container.offsetLeft + this._mainLength;
//		}
//		
//		return this._mainEnd2;
//	},
//	enumerable: true
//});

Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, '_mainContentLength', {
	get: function get ()
	{
		var ret;
		
		var cs = window.getComputedStyle(this._container);

		if (this._orientation === 'v')
		{
			ret = parseFloat(this._container.offsetHeight);
			ret += parseFloat(cs.marginTop);
			ret += parseFloat(cs.marginBottom);
		}
		else
		{
			ret = parseFloat(this._container.offsetWidth);
			ret += parseFloat(cs.marginLeft);
			ret += parseFloat(cs.marginRight);
		}
		
		return ret;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, '_viewportStart', {
	get: function get ()
	{
		return this._viewportStart2 || 0;
	},
	set: function set (val)
	{
		if (val >= this._mainContentLength)
			val = this._mainContentLength;
		
		if (!this._focusPoint && val < 0)
			val = 0;
		
		this._viewportStart2 = val;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, '_viewportEnd', {
	get: function get ()
	{
		if (this._orientation === 'v')
			return this.clientHeight;
		return this.clientWidth;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, '_viewportLength', {
	get: function get ()
	{
		var ret;

		if (this.offsetParent)
		{
			if (this._orientation === 'v')
				return this.clientHeight;
			return this.clientWidth;
		}
		else
		{
			var cs = window.getComputedStyle(this);
			
			if (this._orientation === 'v')
			{
				ret = parseFloat(cs.height);
				ret += parseFloat(cs.marginTop);
				ret += parseFloat(cs.marginBottom);
			}
			
			return ret;
		}
	},
	enumerable: true
});




/*
 * Private methods
 */

o5.gui.controls.FlexGridRow.prototype._onKeyDown = function _onKeyDown (e)
{
	this.logInfo(e.keyCode + ' ' + e.timeStamp);

	switch (e.key)
	{
	case 'ArrowLeft':
		if (this._orientation === 'h')
		{
			if (this.selectPrevious(e.repeat && this.fastMove))
				e.preventDefault();
		}
		break;
		
	case 'ArrowRight':
		if (this._orientation === 'h')
		{
			if (this.selectNext(e.repeat && this.fastMove))
				e.preventDefault();
		}
		break;
		
	case 'ArrowUp':
		if (this._orientation === 'v')
		{
			if (this.selectPrevious(e.repeat && this.fastMove))
				e.preventDefault();
		}
		break;
		
	case 'ArrowDown':
		if (this._orientation === 'v')
		{
			if (this.selectNext(e.repeat && this.fastMove))
				e.preventDefault();
		}
		break;
		
	case 'ChannelUp':
		if (this._orientation === 'v')
		{
			if (this.selectPreviousPage(e.repeat && this.fastMove))
				e.preventDefault();
		}
		break;
		
	case 'ChannelDown':
		if (this._orientation === 'v')
		{
			if (this.selectNextPage(e.repeat && this.fastMove))
				e.preventDefault();
		}
		break;
		
	case 'TrackPrevious':
		if (this._orientation === 'h')
		{
			if (this.selectPreviousPage(e.repeat && this.fastMove))
				e.preventDefault();
		}
		break;
		
	case 'TrackNext':
		if (this._orientation === 'h')
		{
			if (this.selectNextPage(e.repeat && this.fastMove))
				e.preventDefault();
		}
		break;
	default:
	}
};



o5.gui.controls.FlexGridRow.prototype._selectItem = function _selectItem (index, skipAnimation)
{
	this.logEntry();

	if (this._selectedCell === index)
		return;
	
	if (!this._container.childElementCount)
	{
		this._viewportStart = 0;
		this._container.style.webkitTransform = '';
		this._container.style.margin = '';
		this._selectedCell = -1;
		
		return;
	}
	
	if (this.fastMove)
	{
		var now = performance.now();
	
		if ((now - this._lastSelectionChangeTimestamp) <= this._animationDurationMS * 1.1)
			skipAnimation = true;
	
		this._lastSelectionChangeTimestamp = now;
	}

	var previous = this._container.children[this._selectedCell];

	var item = this._container.children[index];
	
	this._selectedCell = index;

//	if(this._movePending) debugger;

	this._movePending = true;
	this._selectionChangeTag = { from: previous, to: item, skipAnimation: skipAnimation};
	this.queueReflowPrep(this._prepMove, this._selectionChangeTag);
};

o5.gui.controls.FlexGridRow.prototype._updateOffsetAttribute = function _updateOffsetAttribute ()
{
	if (this.selectedCell)
	{
		this.selectedCell.setAttribute('offset', 0);
		
		for (var item = this.selectedCell.nextElementSibling, offset = 1; item; item = item.nextElementSibling, offset++)
		{
			item.setAttribute('offset', offset);
		}
		for (var item = this.selectedCell.previousElementSibling, offset = -1; item; item = item.previousElementSibling, offset--)
		{
			item.setAttribute('offset', offset);
		}
	}
	else
	{
		for (var item = this._container.firstElementChild; item; item = item.nextElementSibling)
		{
			item.setAttribute('offset', '');
		}
	}
};


o5.gui.controls.FlexGridRow.prototype._prepMove = function _prepMove (tag)
{
	this.logEntry();
	
	if(!this.fixedLayout && this._selectionChangeTag === tag)
	{
		if (tag.to && tag.to.parentElement !== this._container)
			return;
		
		this._updateViewport(tag.to);
	
		if (tag.to && !tag.to.offsetParent)
		{
			if (this._manageVisibility)
				this._checkOverflow();
			
			if (this._cyclic)
			{
				this._checkCyclic();
				this._checkMove();
			}
	
		}
	}

	this.queueReflowSet(this._doMove, tag);
};



o5.gui.controls.FlexGridRow.prototype._doMove = function _doMove (tag)
{
	this.logEntry();

	var previous = tag.from;
	var item = tag.to;
	
	if (this.offsetAttributes)
		this._updateOffsetAttribute();
	
	if (previous)
	{
		previous.removeAttribute('selected');

		if (previous.ondeselect)
		{
			previous.ondeselect();
		}
		
		previous._onDeselect();
	}

	if (item)
	{
		item.setAttribute('selected', '');
		if (item.onselect)
		{
			item.onselect();
		}
		
		item._onSelect();
	}

	var e = new Event('selectionchange', {
		bubbles: false,
		cancelable: false
	});

	e.from = previous;
	e.to = item;
	e.animated = tag.skipAnimation;

	this.dispatchEvent(e);

	if ((previous && (previous.ondeactivate || previous._onDeactivate)) || (item && (item.onactivate || item._onActivate)))
	{
		if (this._activationTimeout)
		{
			clearTimeout(this._activationTimeout);
		}
		else
			this._activationTimeoutPrevious = previous;
		
		this._activationTimeout = setTimeout((function ()
		{
			this._activationTimeout = null;

			if (this._activationTimeoutPrevious && this._activationTimeoutPrevious.ondeactivate)
			{
				this._activationTimeoutPrevious.ondeactivate();
			}
			if (this._activationTimeoutPrevious && this._activationTimeoutPrevious._onDeactivate)
			{
				this._activationTimeoutPrevious._onDeactivate();
			}

			this._activationTimeoutPrevious = null;

			if (item && item.onactivate)
			{
				item.onactivate();
			}
			if (item && item._onActivate)
			{
				item._onActivate();
			}

		}).bind(this), this.delayActivation);
	}

	if (this.fixedLayout)
		return;
	
	if (this._container.style.transition)
	{
//		if(tag.skipAnimation)
		if(this.fastMove)
			this._container.style.transition = '';
		
		this._postMove();
	}
	
	
	if (this._updateTransform())
	{
		if (this._animate && this._animationDurationMS && !tag.skipAnimation)
		{
			this._container.style.transition = "-webkit-transform " + this._animationDurationMS + "ms linear";
	
			this.addEventListener("webkitTransitionEnd", this._moveTransitionEnd);
			this._moveTransitionTag = tag;
	
//			this._container.style.webkitTransform = moveCSS;
			this.queueReflowPost(this._checkMove, tag);
		}
		else
		{
//			this._checkMove(tag);
			this._postMove(tag);
			if (this._container.style.transition)
				this._container.style.transition = '';
//			this._container.style.webkitTransform = moveCSS;
			
//			this.queueReflowPost(this._checkMove, tag);
//			this.queueReflowPost(this._postMove, tag);
		}
	}
	else
	{
		if (this._container.style.transition && tag.skipAnimation)
			this._container.style.transition = '';
//		
////		this.queueReflowPost(this._postMove, tag);
		this._checkMove(tag);
//		this._postMove(tag);
	}
	
//	this.queueReflowPost(this._checkMove, tag);

	if (this._focusBox)
	{
//		this.queueReflowPost(function(){
		
		if (tag.to)
		{
//			if(this._focusBox.style.display)
//				this._focusBox.style.display = '';
			
		    this._focusBox.moveTo(
		    		this._orientation !== 'v' ? tag.to.offsetLeft - this._viewportStart : tag.to.offsetLeft,
		    		this._orientation === 'v' ? tag.to.offsetTop - this._viewportStart : tag.to.offsetTop,
		    		tag.to.offsetWidth,
		    		tag.to.offsetHeight,
		    		tag.to,
		    		tag.skipAnimation);
		}
		else
		{
		    this._focusBox.style.display = 'none';
		}
//		});
	}
};


o5.gui.controls.FlexGridRow.prototype._checkMove = function _checkMove (tag)
{
	this.logEntry();
	
	this._updateViewport(this.selectedCell, true);
};


o5.gui.controls.FlexGridRow.prototype._updateViewport = function _updateViewport (item, force)
{
	this.logEntry();
	
	if (!item)
	{
		this._viewportStart = 0;
		
		return;
	}

	var posA;
	var posB;

	if (this._focusPoint !== undefined)
	{
		if (this._focusPoint >= 0 && this._focusPoint <= 1)
			this._viewportStart = item._mainStart - (this._viewportLength * this._focusPoint) + (item._mainLength / 2);
		else
			this._viewportStart = item._mainStart - this._focusPoint + (item._mainLength / 2);
	}
	else
	{
    	if (this._viewportLength < this._mainContentLength)
    	{
	    	posA = item._mainStart;
	    	posB = posA + item._mainLength;

	    	if (posB > (this._viewportLength + this._viewportStart))
	    	{
	    		this._viewportStart = posB - this._viewportLength;
	    	}
	    	else
	    	{
	    		if (posA < this._viewportStart)
	    		{
	    			this._viewportStart = posA;
	    		}
	    	}
    	}
    	else
    	{
    		this._viewportStart = 0;
    	}
	}
	
	if (force)
		this._updateTransform();
};


o5.gui.controls.FlexGridRow.prototype._updateTransform = function _updateTransform ()
{
	this.logEntry();
	
	var moveCSS = '';
	
	if (this._viewportStart)
	{
		if (this._useACLayers)
		{
			if (this._orientation === 'v')
				moveCSS = 'translate3d(0px, ' + (-this._viewportStart) + 'px, 0px)';
			else
				moveCSS = 'translate3d(' + (-this._viewportStart) + 'px, 0px, 0px)';
		}
		else
		{
			if (this._orientation === 'v')
				moveCSS = 'translate(0px, ' + (-this._viewportStart) + 'px)';
			else
				moveCSS = 'translate(' + (-this._viewportStart) + 'px, 0px)';
		}
	}
	else
	{
		if (this._useACLayers && this._container.style.webkitTransform)
		{
			moveCSS = 'translateZ(0px)';
		}
	}
	
	if (moveCSS !== this._container.style.webkitTransform)
	{
		this._container.style.webkitTransform = moveCSS;
		
		return true;
	}
	
	return false;
};


o5.gui.controls.FlexGridRow.prototype._moveTransitionEnd = function _moveTransitionEnd (e)
{
	this.logEntry();
	
	if (e.target !== this._container)
		return;

	this.removeEventListener("webkitTransitionEnd", this._moveTransitionEnd);
	
	if(this._moveTransitionTag && this._moveTransitionTag.to !== this.selectedCell)
		return;
	
	this._container.style.transition = '';
	
	this._postMove(this._moveTransitionTag);
	
	if (this._container.style.marginTop || this._container.style.marginLeft)
	{
		this._updateMargins();
		this._checkMove();
	}
};


o5.gui.controls.FlexGridRow.prototype._checkCyclic = function _checkCyclic (tag)
{
	if (this._cyclic && this._container.childElementCount > 1)
	{
		// this code may trigger multiple reflows
		// there is no effective way of rebalancing cyclic lists while still supporting standard CSS rules on the list items
		
		// if there is some overflow
		if (this._viewportLength < this._mainContentLength)
		{
			// if there is no overflow to the left/top
			if (this._viewportStart <= 0)
			{
				// while there is no overflow to the left/top
				while (this._viewportStart <= 0)
				{
					// if the last item is overflowing
					if (this._container.lastElementChild._mainStart + this._container.lastElementChild._mainLength - this._viewportStart >= this._viewportLength)
					{
						// move to the other end
						this._container.insertBefore(this._container.lastElementChild, this._container.firstElementChild);
						this._container.firstElementChild.style.display = '';
						this._selectedCell++;
						this._viewportStart += this._container.firstElementChild._mainLength;
					}
					else // abort if there is nothing that can be moved
						break;
				}
			}
			//if there is overflow to the left/top
			else if (this._viewportStart > 0/* && this._viewportLength < this._mainContentLength*/)
			{
				//while there is overflow to the left/top
				while (this._viewportStart > 0)
				{
					if (this._container.lastElementChild._mainStart + this._container.lastElementChild._mainLength - this._viewportStart <= this._viewportLength)
					{
						// move to the other end
						this._container.appendChild(this._container.firstElementChild);
						this._container.lastElementChild.style.display = '';
						this._updateMargins();
						this._selectedCell--;
						this._container.lastElementChild._mainStart2 = this._container.lastElementChild._mainLength2 +
																	   this._container.lastElementChild.previousElementSibling._mainStart2;
						this._viewportStart -= this._container.firstElementChild._mainLength;
					}
					else // abort if there is nothing that can be moved
						break;
				}
			}
		}
		else // otherwise, rebalance it blindly
		{
			var item = this.selectedCell;
			var itemIndex = item.itemIndex;
			var siblings = this._container.childElementCount;
			var delta = Math.trunc(siblings / 2) - itemIndex;
			
			if (this._focusPoint != undefined)
				delta += Math.round(siblings * (this._focusPoint - 0.5));
			
			if (delta > 0)
			{
				while (delta > 0)
				{
					this._container.insertBefore(this._container.lastElementChild, this._container.firstElementChild);
					this._container.firstElementChild.style.display = '';
					this._selectedCell++;
					this._viewportStart += this._container.firstElementChild._mainLength;
					delta--;
				}
			}
			else if (delta < 0)
			{
				while (delta < 0)
				{
					this._container.appendChild(this._container.firstElementChild);
					this._container.lastElementChild.style.display = '';
					this._updateMargins();
					this._selectedCell--;
					this._container.lastElementChild._mainStart2 = this._container.lastElementChild._mainLength2 +
																   this._container.lastElementChild.previousElementSibling._mainStart2;
					this._viewportStart -= this._container.firstElementChild._mainLength;
					delta++;
				}
			}
		}
		
		//this._checkMove({ to: this.selectedCell, moveCSS: this._container.style.webkitTransform });
	}
};

o5.gui.controls.FlexGridRow.prototype._checkOverflow = function _checkOverflow ()
{
	var item = this.selectedCell || this._container.children[0];
	
	if (!item)
		return;

	var toHide = [];
	var toShow = [];
	
	if (!item.offsetParent)
		toShow.push(item);
	
	var low  = this._viewportStart - ((this._overflowFactor) * this._viewportLength);
	var high = this._viewportStart + ((this._overflowFactor + 1) * this._viewportLength);

	var item2 = item.nextElementSibling;
	var offset = item._mainStart + item._mainLength;
	
	for (; item2; item2 = item2.nextElementSibling)
	{
		if (offset <= high && !item2.offsetParent)
			toShow.push(item2);
		
		if (offset > high && item2.offsetParent)
			toHide.push(item2);
		
		if(!item2.offsetParent)
			item2._mainStart2 = offset;
		
		offset += item2._mainLength;
	}
	
	var item2 = item.previousElementSibling;
	var offset = item._mainStart;
	
	for (; item2; item2 = item2.previousElementSibling)
	{
		if (offset >= low && !item2.offsetParent)
			toShow.push(item2);
		
		if (offset < low && item2.offsetParent)
			toHide.push(item2);
		
		if(!item2.offsetParent)
			item2._mainStart2 = offset;
		
		offset -= item2._mainLength;
	}

	toHide.forEach(function (el)
	{
		el.style.display = 'none';
	});

	toShow.forEach(function (el)
	{
		el.style.display = '';
	});
	
	this._updateMargins();
	this._updateViewport(item);
};


o5.gui.controls.FlexGridRow.prototype._postMove = function _postMove (tag)
{
	this.logEntry();
	
	if (this._cyclic)
	{
		this._checkCyclic();
		this._checkMove();
	}
	
	if (this._manageVisibility)
		this._checkOverflow();
	
//	this._container.style.transition = "";
	this._movePending = false;
	
	var e = new Event('selectionchangecompleted', {
		bubbles: false,
		cancelable: false
	});

//	e.from = previous;
//	e.to = item;
//	e.repeat = tag.skipAnimation;

	this.dispatchEvent(e);
};


o5.gui.controls.FlexGridRow.prototype._updateMargins = function _updateMargins ()
{
	var marginStart = 0;
	for (var me = this._container.firstElementChild; me && !me.offsetParent; me = me.nextElementSibling)
	{
		marginStart += me._mainLength;
	}

	var marginEnd = 0;
	for (me = this._container.lastElementChild; me && !me.offsetParent; me = me.previousElementSibling)
	{
		marginEnd += me._mainLength;
	}
	
	if (marginStart)
	{
		marginStart = Math.round(marginStart) + 'px';
		
		if (this._orientation === 'v')
		{
			if (this._container.style.marginTop !== marginStart)
				this._container.style.marginTop = marginStart;
		}
		else
		{
			if (this._container.style.marginLeft !== marginStart)
				this._container.style.marginLeft = marginStart;
		}
	}
	else
	{
		this._container.style.marginTop = '';
		this._container.style.marginLeft = '';
	}
	
	if (marginEnd)
	{
		marginEnd = Math.round(marginEnd) + 'px';
		
		if (this._orientation === 'v')
		{
			if (this._container.style.marginBottom !== marginEnd)
				this._container.style.marginBottom = marginEnd;
		}
		else
		{
			if (this._container.style.marginRight !== marginEnd)
				this._container.style.marginRight = marginEnd;
		}
	}
	else
	{
		this._container.style.marginBottom = '';
		this._container.style.marginRight = '';
	}
};




/**
 * Is a number representing the item position in the items collection of the list it belongs to.
 * If the item doesn't belong to a list, it returns -1.
 * The index may change with cyclic lists as the list moves.
 * @property itemIndex
 * @type {Number}
 */
Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, 'itemIndex', {
	get: function get ()
	{
		return Array.prototype.indexOf.call(this.parentElement.children, this);
	},
	enumerable: true
});


/*
 * Private properties
 */
Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, '_mainStart', {
	get: function get ()
	{
		if (this.offsetParent)
		{
			var cs = window.getComputedStyle(this);
			
			if (this.parentControl._orientation === 'v')
			{
				this._mainStart2 = this.offsetTop;
				this._mainStart2 -= parseFloat(cs.marginTop);
			}
			else
			{
				this._mainStart2 = this.offsetLeft;
				this._mainStart2 -= parseFloat(cs.marginLeft);
			}
		}
		else if (this._mainStart2 === undefined)
		{
			if (this.previousElementSibling)
			{
				this._mainStart2 = this.previousElementSibling._mainStart + this.previousElementSibling._mainLength;
			}
			else
				this._mainStart2 = 0;
		}
		
		return this._mainStart2;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, '_mainEnd', {
	get: function get ()
	{
		if (this.offsetParent)
		{
			if (this.parentControl._orientation === 'v')
				this._mainEnd2 = this.offsetTop + this.offsetHeight;
			else
				this._mainEnd2 = this.offsetLeft + this.offsetWidth;
		}
		
		return this._mainEnd2;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.controls.FlexGridRow.prototype, '_mainLength', {
	get: function get ()
	{
		if (this.offsetParent)
		{
			var cs = window.getComputedStyle(this);
			
			if (this.parentControl._orientation === 'v')
			{
				this._mainLength2 = parseFloat(cs.height);
				this._mainLength2 += parseFloat(cs.marginTop);
				this._mainLength2 += parseFloat(cs.marginBottom);
			}
			else
			{
				this._mainLength2 = parseFloat(cs.width);
				this._mainLength2 += parseFloat(cs.marginLeft);
				this._mainLength2 += parseFloat(cs.marginRight);
			}
		}
		else if (!this._mainLength2)
		{
			// look around for the nearest element with known length
			for (var a = this.previousElementSibling, b = this.nextElementSibling; a || b;)
			{
				if (a)
				{
					if (a._mainLength2)
					{
						this._mainLength2 = a._mainLength2;
						break;
					}
					else
						a = a.previousElementSibling;
				}
				
				if (b)
				{
					if (b._mainLength2)
					{
						this._mainLength2 = b._mainLength2;
						break;
					}
					else
						b = b.nextElementSibling;
				}
			}
			
			if (!this.offsetParent)
			{
				var cs = window.getComputedStyle(this);
				
				if (this.parentControl._orientation === 'v')
				{
					this._mainLength2 = parseFloat(cs.height);
					this._mainLength2 += parseFloat(cs.marginTop);
					this._mainLength2 += parseFloat(cs.marginBottom);
				}
				else
				{
					this._mainLength2 = parseFloat(cs.width);
					this._mainLength2 += parseFloat(cs.marginLeft);
					this._mainLength2 += parseFloat(cs.marginRight);
				}
			}
		}
		
		return this._mainLength2;
	},
	enumerable: true
});



/*
 * Private methods
 */
o5.gui.controls.FlexGridRow.prototype._onSelect = function _onSelect () { };

o5.gui.controls.FlexGridRow.prototype._onDeselect = function _onDeselect () { };

o5.gui.controls.FlexGridRow.prototype._onActivate = function _onActivate () { };

o5.gui.controls.FlexGridRow.prototype._onDeactivate = function _onDeactivate () { };




