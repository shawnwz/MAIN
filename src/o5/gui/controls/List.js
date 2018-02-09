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
 * If no template element is provided, the generic o5-list-item will be used.
 * 
 * {@img list.png}
 * 
 * @class o5.gui.controls.List
 * @extends o5.gui.controls.Control
 *
 * @author lmayle
 */

o5.gui.controls.List = function List () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.List);

//o5.log.setAll(o5.gui.controls.List, true);

o5.gui.controls.List.prototype.createdCallback = function createdCallback ()
{
	this.superCall();

	if (!this._orientation)
		this._orientation = 'h';

	this._container = this.ownerDocument.createElement("div");
	this._container.style.cssText = 'display: -webkit-inline-flex; height: 100%; ';
	this.appendChild(this._container);

	this._selectedItem = -1;

	this.tabIndex = -1;

	if (this.attributes.autofocus)
	{
		this.focus();
	}

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
 *     <o5-list data-item-template="app-list-item">
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
 * @htmlDataAttribute
 * @type {Object}
 */
o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(o5.gui.controls.List.prototype, 'itemTemplate',	{
	template: o5.gui.controls.ListItem,
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
 * @htmlDataAttribute
 * @type {o5.gui.controls.FocusBox}
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(o5.gui.controls.List.prototype, 'focusBox',	{
	get: function ()
	{
		return this._focusBox;
	},
	set: function (val)
	{
    	if (typeof val === 'string')
    	{
    		this._focusBox = this.ownerDocument.createElement(val);
    		
    		this._focusBox.style.display = 'none';

    		this.appendChild(this._focusBox);
    	}
	},
	toAttribute: function (val)
	{
    	return val ? val.localName : '';
    },
	fromAttribute: function (val)
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
 * @htmlDataAttribute
 * @type {Number,String}
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(o5.gui.controls.List.prototype, 'focusPoint',	{
	get: function ()
	{
		if (this._focusPoint > 0 && this._focusPoint < 1)
			return (this._focusPoint * 100) + '%';
		return 'auto';
	},
	set: function (val)
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
				val = parseFloat(val);
				
				if(isNaN(val))
				{
					this._focusPoint = null;
				}
				else
				{
					if (val < 0)
						val = 0;
					
					this._focusPoint = val;
				}
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
			this._selectItem(this._selectedItem);
	}
});

/**
 * Gets or sets the focus point alignment.
 * Options are:
 * 
 * 	[Default] 'center', where the focus point alignment will use the center point of the selected item
 *  'start', aligned to the start of the selected item, on the main axis
 * 	'end', aligned to the end of the selected item, on the main axis
 *
 * Can be defined in the markup, example:
 * 
 *     <o5-list data-focus-point-align-item=start>
 *     </o5-list>
 *
 * @property focusPointAlignItem
 * @htmlDataAttribute
 * @type {String}
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(o5.gui.controls.List.prototype, 'focusPointAlignItem',	{
	get: function ()
	{
		return this._focusPointAlignItem || 'center';
	},
	set: function (val)
	{
    	switch (val)
    	{
    	case 'center':
    	case 'start':
    	case 'end':
			this._focusPointAlignItem = val;
			break;
    	default:
    	}
		
		if (this._container && this._container.childElementCount)
			this._selectItem(this._selectedItem);
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
 * @htmlDataAttribute
 * @type {String}
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(o5.gui.controls.List.prototype, 'orientation',	{
	get: function ()
	{
		if (this._orientation === 'v')
			return 'vertical';
		return 'horizontal';
	},
	set: function (val)
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
	toAttribute: function (val)
	{
		if (val === 'v')
			return 'vertical';
		return 'horizontal';
	},
	fromAttribute: function (val)
	{
		if (val === 'vertical')
			return 'v';
		return 'h';
	}
});


/**
 * Represents the currently selected item if any, null otherwise
 * @property selectedItem
 * @type {Object}
 */
Object.defineProperty(o5.gui.controls.List.prototype, 'selectedItem', {
	get: function ()
	{
		return this._container.children[this._selectedItem];
	},
	set: function (val)
	{
		if (typeof val === 'number')
		{
			if (val >= 0 && val < this._container.children.length && val !== this._selectedItem)
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
 * @htmlDataAttribute
 */
o5.gui.controls.Control.defineBooleanPropertyWithDataAttribute(o5.gui.controls.List.prototype, 'cyclic', {
	set: function (val)
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
Object.defineProperty(o5.gui.controls.List.prototype, 'pageCount', {
	get: function ()
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
Object.defineProperty(o5.gui.controls.List.prototype, 'currentPage', {
	get: function ()
	{
		if (this._container.childElementCount === 0)
			return 1;
		
		if (this._mainLength <= this._viewportLength)
			return 1;
		
		if (this._viewportStart <= 0)
			return 1;
			
		return Math.ceil(this._viewportStart / this._viewportLength) + 1;
	},
	set: function ()
	{
	},
	enumerable: true
});


/**
 * Returns the first visible item in the list if any, undefined otherwise
 * @property firstVisibleItem
 * @type {o5.gui.controls.ListItem}
 * @readonly
 */
Object.defineProperty(o5.gui.controls.List.prototype, 'firstVisibleItem', {
	get: function ()
	{
		if (this._container.childElementCount === 0)
			return undefined;
		
		var low = this._viewportStart;
		
		var item;
		
		if (this.selectedItem && this.selectedItem._mainStart > low)
		{
			for (item = this.selectedItem; item.previousElementSibling; item = item.previousElementSibling)
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
 * @type {o5.gui.controls.ListItem}
 * @readonly
 */
Object.defineProperty(o5.gui.controls.List.prototype, 'lastVisibleItem', {
	get: function ()
	{
		if (this._container.childElementCount === 0)
			return undefined;
		
		var high = this._viewportLength + this._viewportStart;
		
		var item;
		
		if (this.selectedItem && this.selectedItem._mainEnd < high)
		{
			for (item = this.selectedItem; item.nextElementSibling; item = item.nextElementSibling)
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
Object.defineProperty(o5.gui.controls.List.prototype, 'fastMove', {
	get: function ()
	{
		return this._fastMove || true;
	},
	set: function (val)
	{
		this._fastMove = val;
	},
	enumerable: true
});


/**
 * When set to true, the layout of the list items will be fixed, that is,
 * the position of the items will not be updated by the list itself as the selection changes.
 * This is intended to be used with o5.gui.controls.List.offsetAttributes so that the application
 * has direct control of the layout of the list items for cases where CSS flexible layout doesn't work well.
 * @property [fixedLayout=false]
 * @type {Boolean}
 */
Object.defineProperty(o5.gui.controls.List.prototype, 'fixedLayout', {
	get: function ()
	{
		return this._fixedLayout || false;
		
	},
	set: function (val)
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
Object.defineProperty(o5.gui.controls.List.prototype, 'offsetAttributes', {
	get: function ()
	{
		return this._offsetAttributes || false;
		
	},
	set: function (val)
	{
		this._offsetAttributes = val;
		
	},
	enumerable: true
});

/**
 * When using o5.gui.controls.List.offsetAttributes, this will limit the range of the offset attributes
 * @property [offsetAttributesMin=null]
 * @type {Number}
 */
Object.defineProperty(o5.gui.controls.List.prototype, 'offsetAttributesMin', {
	get: function () {

		return this._offsetAttributesMin;
		
	},
	set: function (val) {
		
		this._offsetAttributesMin = val;
		
	},
	enumerable: true
});

/**
 * When using o5.gui.controls.List.offsetAttributes, this will limit the range of the offset attributes
 * @property [offsetAttributesMax=null]
 * @type {Number}
 */
Object.defineProperty(o5.gui.controls.List.prototype, 'offsetAttributesMax', {
	get: function () {

		return this._offsetAttributesMax;
		
	},
	set: function (val) {
		
		this._offsetAttributesMax = val;
		
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
 * @return {o5.gui.controls.ListItem} The new list item
 */
o5.gui.controls.List.prototype.insertItem = function insertItem ()
{
	var item = this._itemTemplateResolved.cloneNode(true);

	if (this._container.childElementCount > 5 && this._container.childElementCount > this._overflowVisibilityCount)
	{
		this._manageVisibility = true;
		
		var marginEnd = this._orientation === 'v' ?
				(parseFloat(this._container.style.marginBottom) || 0) :
				(parseFloat(this._container.style.marginRight) || 0);
				
		if (this._overflow || !this.offsetParent)
		{
			if (!marginEnd)
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
	
	if (this.cyclic)
	{
		var sel = this.selectedItem;
			
		item._insertionIndex = this._container.childElementCount;
		
		var insertionPoint = this._container.lastElementChild;
		
		for (var lastItem = this._container.lastElementChild; lastItem; lastItem = lastItem.previousElementSibling)
		{
			if (lastItem._insertionIndex > insertionPoint._insertionIndex)
				insertionPoint = lastItem;
		}
		
		if (insertionPoint)
			insertionPoint = insertionPoint.nextElementSibling;
		
		this._container.insertBefore(item, insertionPoint);
		
		if (sel && insertionPoint)
		{
			this._selectedItem = sel.itemIndex;
			
			if (!insertionPoint.style.display)
				item.style.display = '';
			
			this._checkCyclic();
			this._updateMargins();
			if (this._container.style.transition)
				this._container.style.transition = '';
			this._updateViewport(sel, true);
		}
	}
	else
	{
		this._container.appendChild(item);
	}

	if (!this.fixedLayout && this._container.childElementCount <= 1)
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
o5.gui.controls.List.prototype.deleteAllItems = function deleteAllItems ()
{
//	this._container.innerHTML = '';
	while (this._container.firstChild)
	{
		this._container.removeChild(this._container.firstChild);
	}
	
	this._selectItem(-1, true);
};


/**
 * Selects the given item in the list and scrolls the list if required.
 * @method selectItem
 * @param {o5.gui.controls.ListItem} item Item to be selected
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.List.prototype.selectItem = function selectItem (item, skipAnimation)
{
	if (typeof item === 'number')
	{
		if (item >= 0 && item < this._container.children.length && item !== this._selectedItem)
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
o5.gui.controls.List.prototype.clearSelection = function clearSelection (skipAnimation)
{
	if (this._selectedItem != -1)
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
o5.gui.controls.List.prototype.selectPrevious = function selectPrevious (skipAnimation)
{
	if (this._selectedItem <= 0)
	{
		if (this._cyclic && this._container.childElementCount > 1)
		{
			// forcefully move one element from the other end
			this._container.insertBefore(this._container.lastElementChild, this._container.firstElementChild);
			
			if (this._container.firstElementChild.style.display)
				this._container.firstElementChild.style.display = '';
			
			this._selectedItem++;
			
			this._viewportStart += this._container.firstElementChild._mainLength;
			this._updateTransform();
		}
		else
			return false;
	}

	this._selectItem(this._selectedItem - 1, skipAnimation);

	return true;
};

/**
 * Selects the next item in the list and scrolls the list if required.
 * @method selectNext
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.List.prototype.selectNext = function selectNext (skipAnimation)
{
	if (this._selectedItem >= this._container.childElementCount - 1)
	{
		if (this._cyclic && this._container.childElementCount > 1)
		{
			// forcefully move one element from the other end
			this._container.appendChild(this._container.firstElementChild);
			
			if (this._container.lastElementChild.style.display)
				this._container.lastElementChild.style.display = '';
			
			this._updateMargins();
			
			this._selectedItem--;
			
//			this._container.lastElementChild._mainStart2 = this._container.lastElementChild._mainLength2 + this._container.lastElementChild.previousElementSibling._mainStart2;
			
			this._viewportStart -= this._container.firstElementChild._mainLength;
			this._updateTransform();
		}
		else
			return false;
	}

	this._selectItem(this._selectedItem + 1, skipAnimation);

	return true;
};

/**
 * For lists with multiple pages, move to the previous page and select the first visible item
 * @method selectPreviousPage
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.List.prototype.selectPreviousPage = function selectPreviousPage (skipAnimation)
{
	if (this.pageCount <= 1)
		return false;
	
	var item = this.selectedItem;
	var item2 = item.previousElementSibling;
	
	if (!item2 && !this._cyclic)
		return false;
	
	if (this._focusPoint)
	{
		//simple perturbation
		this._viewportStart = this.selectedItem._mainStart - (this.selectedItem._mainLength / 2);
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
o5.gui.controls.List.prototype.selectNextPage = function selectNextPage (skipAnimation)
{
	if (this.pageCount <= 1)
		return false;
	
	var item = this.selectedItem;
	var item2 = item.nextElementSibling;
	
	if (!item2 && !this._cyclic)
		return false;
	
	if (this._focusPoint)
	{
		//simple perturbation
		this._viewportStart = this.selectedItem._mainStart - (this.selectedItem._mainLength / 2);
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
o5.gui.controls.List.prototype.updateLayout = function ()
{
	if (!this.fixedLayout)
	{
		this._updateViewport(this.selectedItem, true);
		this._postMove();
	}
};




/*
 * Private properties
 */

o5.gui.controls.List.prototype.delayActivation = 500;

o5.gui.controls.List.prototype.pagingOverflow = 0;

o5.gui.controls.List.prototype._overflowFactor = 1;



Object.defineProperty(o5.gui.controls.List.prototype, '_mainStart', {
	get: function get ()
	{
		if (this.offsetParent)
		{
			if (this._orientation === 'v')
				this._mainStart2 = this._container.offsetTop;
			else
				this._mainStart2 = this._container.offsetLeft;
		}
		
		return this._mainStart2;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.controls.List.prototype, '_mainEnd', {
	get: function get ()
	{
		if (this.offsetParent)
		{
			if (this._orientation === 'v')
				this._mainEnd2 = this._container.offsetTop + this._mainLength;
			else
				this._mainEnd2 = this._container.offsetLeft + this._mainLength;
		}
		
		return this._mainEnd2;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.controls.List.prototype, '_mainLength', {
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

Object.defineProperty(o5.gui.controls.List.prototype, '_viewportStart', {
	get: function get ()
	{
		return this._viewportStart2 || 0;
	},
	set: function set (val)
	{
		if (val >= this._mainLength)
			val = this._mainLength;
		
		if (!this._focusPoint && val < 0)
			val = 0;
		
		this._viewportStart2 = val;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.controls.List.prototype, '_viewportEnd', {
	get: function get ()
	{
		if (this._orientation === 'v')
			return this.clientHeight;
		return this.clientWidth;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.controls.List.prototype, '_viewportLength', {
	get: function get ()
	{
		if (this.offsetParent)
		{
			var cs = window.getComputedStyle(this);
			
			if(this._orientation === 'v')
			{
				this._viewportLength2  = parseFloat(cs.height);
				this._viewportLength2 -= parseFloat(cs.paddingTop);
				this._viewportLength2 -= parseFloat(cs.paddingBottom);
			}
			else
			{
				this._viewportLength2  = parseFloat(cs.width);
				this._viewportLength2 -= parseFloat(cs.paddingLeft);
				this._viewportLength2 -= parseFloat(cs.paddingRight);
			}
		}
		else
		{
//			var cs = window.getComputedStyle(this);
			
//			if(this._orientation === 'v')
//			{
//				this._viewportLength2 = parseFloat(cs.height);
//				this._viewportLength2 += parseFloat(cs.marginTop);
//				this._viewportLength2 += parseFloat(cs.marginBottom);
//			}
//			else if(this._orientation === 'h')
//			{
//				this._viewportLength2 = parseFloat(cs.width);
//				this._viewportLength2 += parseFloat(cs.marginLeft);
//				this._viewportLength2 += parseFloat(cs.marginRight);
//			}
		}
		
		return this._viewportLength2;
	},
	enumerable: true
});




/*
 * Private methods
 */

o5.gui.controls.List.prototype._onKeyDown = function _onKeyDown (e)
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
	}
};



o5.gui.controls.List.prototype._selectItem = function _selectItem (index, skipAnimation)
{
	this.logEntry();

	if (this._selectedItem === index)
		return;
	
	if (!this._container.childElementCount)
	{
		this._viewportStart = 0;
		this._container.style.webkitTransform = '';
		this._container.style.margin = '';
		this._selectedItem = -1;
		
		return;
	}
	
	if (this.fastMove)
	{
		var now = performance.now();
	
		if ((now - this._lastSelectionChangeTimestamp) <= this._animationDurationMS * 1.1)
			skipAnimation = true;
	
		this._lastSelectionChangeTimestamp = now;
	}

	var previous = this._container.children[this._selectedItem];

	var item = this._container.children[index];
	
	this._selectedItem = index;
	
	if(this.fixedLayout)
	{
		this._checkCyclic();
	}

//	if(this._movePending) debugger;

	this._movePending = true;
	this._selectionChangeTag = { from: previous, to: item, skipAnimation: skipAnimation };
	this.queueReflowPrep(this._prepMove, this._selectionChangeTag);
};

o5.gui.controls.List.prototype._updateOffsetAttribute = function _updateOffsetAttribute ()
{
	if (this.selectedItem)
	{
		this.selectedItem.setAttribute('offset', 0);
		
		for (var item = this.selectedItem.nextElementSibling, offset = 1; item; item = item.nextElementSibling, offset++)
		{
			if(this._offsetAttributesMax === undefined || this._offsetAttributesMax >= offset)
				item.setAttribute('offset', offset);
			else
				item.removeAttribute('offset');
		}
		
		for (var item = this.selectedItem.previousElementSibling, offset = -1; item; item = item.previousElementSibling, offset--)
		{
			if(this._offsetAttributesMin === undefined || this._offsetAttributesMin <= offset)
				item.setAttribute('offset', offset);
			else
				item.removeAttribute('offset');
		}
	}
	else
	{
		for (var item = this._container.firstElementChild; item; item = item.nextElementSibling)
		{
			item.removeAttribute('offset');
		}
	}
};


o5.gui.controls.List.prototype._prepMove = function _prepMove (tag)
{
	this.logEntry();
	
	if (!this.fixedLayout && this._selectionChangeTag === tag)
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



o5.gui.controls.List.prototype._doMove = function _doMove (tag)
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
		if (this.fastMove)
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


o5.gui.controls.List.prototype._checkMove = function _checkMove (tag)
{
	this.logEntry();
	
	this._updateViewport(this.selectedItem, true);
};


o5.gui.controls.List.prototype._updateViewport = function _updateViewport (item, force)
{
	this.logEntry();
	
	if (!item)
	{
		if(this._cyclic)
		{
			for (item = this._container.firstElementChild; item; item = item.nextElementSibling)
			{
				if(item._insertionIndex === 0)
					break;
			}
			
			if(!item)
				return;
		}
		else
		{
			this._viewportStart = 0;
			
			return;
		}
	}

	var posA;
	var posB;

	if (this._focusPoint !== undefined)
	{
		if (this._focusPoint >= 0 && this._focusPoint <= 1)
			this._viewportStart = item._mainStart - (this._viewportLength * this._focusPoint);
		else
			this._viewportStart = item._mainStart - this._focusPoint;
		
		switch (this.focusPointAlignItem)
		{
    	case 'center': 	this._viewportStart += item._mainLength / 2; 	break;
		case 'end': 	this._viewportStart += item._mainLength; 		break;
		default:
		}
	}
	else
	{
    	if (this._viewportLength < this._mainLength)
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


o5.gui.controls.List.prototype._updateTransform = function _updateTransform ()
{
	this.logEntry();
	
	var moveCSS = '';
	
	if (this._viewportStart)
	{
		if (this._useACLayers)
		{
//todo: need to take parent's padding into consideration
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


o5.gui.controls.List.prototype._moveTransitionEnd = function _moveTransitionEnd (e)
{
	this.logEntry();
	
	if (e.target !== this._container)
		return;

	this.removeEventListener("webkitTransitionEnd", this._moveTransitionEnd);
	
	if (this._moveTransitionTag && this._moveTransitionTag.to !== this.selectedItem)
		return;
	
	this._container.style.transition = '';
	
	this._postMove(this._moveTransitionTag);
	
	if (this._container.style.marginTop || this._container.style.marginLeft)
	{
		this._updateMargins();
		this._checkMove();
	}
};


o5.gui.controls.List.prototype._checkCyclic = function _checkCyclic (tag)
{
	if (this._cyclic && this._container.childElementCount > 1)
	{
		// this code may trigger multiple reflows
		// there is no effective way of rebalancing cyclic lists while still supporting standard CSS rules on the list items
		
		if(this.offsetAttributes)
		{
			var item = this.selectedItem;
			var itemIndex = item.itemIndex;
			var siblings = this._container.childElementCount;
			var delta = Math.trunc(siblings / 2) - itemIndex;
			
			if(delta > 0)
			{
				while(delta > 0)
				{
					var e = this._container.lastElementChild;
					if(this._container.firstElementChild.attributes.offset)
						e.setAttribute('offset', parseInt(this._container.firstElementChild.attributes.offset.value) - 1);
					this._container.insertBefore(e, this._container.firstElementChild);
					e.offsetLeft;
					if(this._selectedItem != -1)
					{
						this._selectedItem++;
						if(this._selectedItem >= this._container.childElementCount)
							this._selectedItem = 0;
					}
					delta--;
				}
			}
			else if (delta < 0)
			{
				while(delta < 0)
				{
					var e = this._container.firstElementChild;
					if(this._container.lastElementChild.attributes.offset)
						e.setAttribute('offset', parseInt(this._container.lastElementChild.attributes.offset.value) + 1);
					this._container.appendChild(e);
					e.offsetLeft;
					if(this._selectedItem != -1)
					{
						this._selectedItem--;
						if(this._selectedItem < 0)
							this._selectedItem = this._container.childElementCount - 1;
					}
					delta++;
				}
			}
		}
		else
		{
			// if there is some overflow
			if (this._viewportLength < this._mainLength)
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
							if(this._selectedItem != -1)
							{
								this._selectedItem++;
								if(this._selectedItem >= this._container.childElementCount)
									this._selectedItem = 0;
							}
							this._viewportStart += this._container.firstElementChild._mainLength;
						}
						else // abort if there is nothing that can be moved
							break;
					}
				}
				//if there is overflow to the left/top
				else if (this._viewportStart > 0/* && this._viewportLength < this._mainLength*/)
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
							if(this._selectedItem != -1)
							{
								this._selectedItem--;
								if(this._selectedItem < 0)
									this._selectedItem = this._container.childElementCount - 1;
							}
							this._container.lastElementChild._mainStart2 = this._container.lastElementChild._mainLength2 + this._container.lastElementChild.previousElementSibling._mainStart2;
							this._viewportStart -= this._container.firstElementChild._mainLength;
						}
						else // abort if there is nothing that can be moved
							break;
					}
				}
			}
			else if (this.selectedItem) // otherwise, rebalance it blindly
			{
				var item = this.selectedItem;
				var itemIndex = item.itemIndex;
				var siblings = this._container.childElementCount;
				var delta = Math.trunc((siblings - 1) / 2) - itemIndex;
				
				if (this._focusPoint != undefined)
					delta += Math.round(siblings * (this._focusPoint - 0.5));
				
				if (delta > 0)
				{
					while (delta > 0 && this._selectedItem < siblings - 1)
					{
						this._container.insertBefore(this._container.lastElementChild, this._container.firstElementChild);
						this._container.firstElementChild.style.display = '';
						this._selectedItem++;
						this._viewportStart += this._container.firstElementChild._mainLength;
						delta--;
					}
				}
				else if (delta < 0)
				{
					while (delta < 0 && this._selectedItem > 0)
					{
						this._viewportStart -= this._container.firstElementChild._mainLength;
						this._container.appendChild(this._container.firstElementChild);
						this._container.lastElementChild.style.display = '';
						this._updateMargins();
						this._selectedItem--;
						this._container.lastElementChild._mainStart2 = this._container.lastElementChild._mainLength2 + this._container.lastElementChild.previousElementSibling._mainStart2;
						delta++;
					}
				}
			}
		}
		
		//this._checkMove({ to: this.selectedItem, moveCSS: this._container.style.webkitTransform });
	}
};

o5.gui.controls.List.prototype._checkOverflow = function _checkOverflow ()
{
	var item = this.selectedItem || this._container.children[0];
	
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
		
		if (!item2.offsetParent)
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
		
		if (!item2.offsetParent)
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


o5.gui.controls.List.prototype._postMove = function _postMove (tag)
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
};


o5.gui.controls.List.prototype._updateMargins = function _updateMargins ()
{
	if(!this._manageVisibility)
	{
		if (this._container.style.marginTop)
			this._container.style.marginTop = 0;
		if (this._container.style.marginLeft)
			this._container.style.marginLeft = 0;
		if (this._container.style.marginBottom)
			this._container.style.marginBottom = 0;
		if (this._container.style.marginRight)
			this._container.style.marginRight = 0;
		
		return;
	}
	
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




