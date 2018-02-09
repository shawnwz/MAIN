/**
 * Mosaic element
 * @class o5.gui.controls.Mosaic
 * @extends o5.gui.controls.Control
 * @private Not for public use yet
 *
 * @author lmayle
 */

o5.gui.controls.Mosaic = function Mosaic () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.Mosaic);

//o5.log.setAll(o5.gui.controls.Mosaic, true);

o5.gui.controls.Mosaic.prototype.createdCallback = function createdCallback ()
{
	this.superCall();

	this._container = this.ownerDocument.createElement("div");
	this._container.style.cssText = 'display: block; ';
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
 * Gets or sets the template used for the items of this Mosaic
 *
 * Can be defined in the markup, example:
 * 
 *     <o5-Mosaic item-template="app-Mosaic-item">
 *     </o5-Mosaic>
 *
 * Or as an inline template:
 * 
 *     <o5-Mosaic>
 *       <template>
 *         <app-Mosaic-item>
 *           <img src='image.png'>
 *           <p>Text</p>
 *         </app-Mosaic-item>
 *       </template>
 *     </o5-Mosaic>
 *
 * @property itemTemplate
 * @type {Object}
 */
o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(o5.gui.controls.Mosaic.prototype, 'itemTemplate',	{
	template: o5.gui.controls.MosaicItem,
	querySelector: ':scope template'
});


/**
 * Gets or sets the element used as focus box
 *
 * Can be defined in the markup, example:
 * 
 *     <o5-Mosaic data-focus-box="app-focus-box">
 *     </o5-Mosaic>
 *
 * @property focusBox
 * @type {o5.gui.controls.FocusBox}
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(o5.gui.controls.Mosaic.prototype, 'focusBox',	{
	get: function get ()
	{
		return this._focusBox;
	},
	set: function set (val)
	{
    	if (typeof val === 'string')
    	{
    		this._focusBox = this.ownerDocument.createElement(val);

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


///**
// * Gets or sets the focus point.
// * Options are:
// * 
// * 	[Default] 'auto', where focus point will move as needed to keep the selected item within the visible area of the o5-Mosaic
// *  Fixed point in pixels, relative to start of main axis
// * 	Percentage of length of main axis, as a number string with % symbol
// *
// * Can be defined in the markup, example:
// * 
// *     <o5-Mosaic data-focus-point=50%>
// *     </o5-Mosaic>
// *
// * @property focusPoint
// * @htmlDataAttribute
// * @type {Number,String}
// */
//o5.gui.controls.Control.definePropertyWithDataAttribute(o5.gui.controls.Mosaic.prototype, 'focusPoint',	{
//	get: function () {
//		
//		if(this._focusPoint > 0 && this._focusPoint < 1)
//			return (this._focusPoint * 100) + '%';
//		else
//			return 'auto';
//	},
//	set: function (val) {
//    	switch(typeof val)
//    	{
//    	case 'string':
//    		
//			if (val.indexOf('%') !== -1)
//			{
//				val = (parseFloat(val) / 100);
//				
//				if(val < 0)
//					val = 0;
//				else if(val > 1)
//					val = 1;
//
//				this._focusPoint = val;
//			}
//			else
//			{
//				val = parseFloat(val) || null;
//				
//				if (val < 0)
//					val = 0;
//				
//				this._focusPoint = val;
//			}
//			
//			break;
//			
//    	case 'number':
//    		
//			if (val < 0)
//				val = 0;
//			
//			this._focusPoint = val;
//			
//			break;
//    	}
//		
//		if(this._container && this._container.childElementCount)
//			this._selectItem(this._selectedItem);
//	}
//});
//
///**
// * Gets or sets the focus point alignment.
// * Options are:
// * 	[Default] 'center', where the focus point alignment will use the center point of the selected item
// *  'start', aligned to the start of the selected item, on the main axis
// * 	'end', aligned to the end of the selected item, on the main axis
// *
// * Can be defined in the markup, example:
// *     <o5-Mosaic data-focus-point-align-item=start>
// *     </o5-Mosaic>
// *
// * @property focusPointAlignItem
// * @type {String}
// */
//o5.gui.controls.Control.definePropertyWithDataAttribute(o5.gui.controls.Mosaic.prototype, 'focusPointAlignItem',	{
//	get: function () {
//		
//		return this._focusPointAlignItem || 'center';
//	},
//	set: function (val) {
//    	switch(val)
//    	{
//    	case 'center':
//    	case 'start':
//    	case 'end':
//    		this._focusPointAlignItem = val;
//    	default:
//    	}
//		
//		if(this._container && this._container.childElementCount)
//			this._selectItem(this._selectedItem);
//	}
//});


/**
 * Represents the currently selected item if any, null otherwise
 * @property selectedItem
 * @type {Object}
 */
Object.defineProperty(o5.gui.controls.Mosaic.prototype, 'selectedItem', {
	get: function get ()
	{
		return this._container.children[this._selectedItem];
	},
	set: function set (val)
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


///**
// * Enables or disables circular navigation of the Mosaic items in an infinite loop.
// * This may trigger multiple layout updates while moving elements between the edges
// *  in order to properly assess the placement of individual Mosaic items without
// *  enforcing restrictions on the layout of each item
// * 
// *     <o5-Mosaic data-cyclic></o5-Mosaic>
// * 
// * @property {Boolean} [cyclic=false]
// */
//o5.gui.controls.Control.defineBooleanPropertyWithDataAttribute(o5.gui.controls.Mosaic.prototype, 'cyclic', {
//	set: function (val) {
//
//		if(val)
//		{
//			this.setAttribute('cyclic', '');
//	    	this.fastMove = true;
//		}
//		else
//		{
//			this.removeAttribute('cyclic');
//	    	this.fastMove = false;
//		}
//		
//		this._cyclic = val;
//	}
//});
//
//
///**
// * Returns the number of pages based on current layout
// * @property pageCount
// * @type {Number}
// * @readonly
// */
//Object.defineProperty(o5.gui.controls.Mosaic.prototype, 'pageCount', {
//	get: function () {
//
//		if (this._container.childElementCount === 0)
//			return 0;
//		
//		if (this._mainLength <= this._viewportLength)
//			return 1;
//		
//		return Math.ceil(this._mainLength / this._viewportLength);
//	},
//	enumerable: true
//});
//
//
///**
// * Returns the current page number
// * @property currentPage
// * @type {Number}
// * @readonly
// */
//Object.defineProperty(o5.gui.controls.Mosaic.prototype, 'currentPage', {
//	get: function () {
//
//		if (this._container.childElementCount === 0)
//			return 1;
//		
//		if (this._mainLength <= this._viewportLength)
//			return 1;
//		
//		if(this._viewportStart <= 0)
//			return 1;
//			
//		return Math.ceil(this._viewportStart / this._viewportLength) + 1;
//	},
//	set: function () {
//	},
//	enumerable: true
//});
//
//
///**
// * Returns the first visible item in the Mosaic if any, undefined otherwise
// * @property firstVisibleItem
// * @type {o5.gui.controls.MosaicItem}
// * @readonly
// */
//Object.defineProperty(o5.gui.controls.Mosaic.prototype, 'firstVisibleItem', {
//	get: function () {
//
//		if (this._container.childElementCount === 0)
//			return undefined;
//		
//		var low = this._viewportStart;
//		
//		var item;
//		
//		if(this.selectedItem && this.selectedItem._mainStart > low)
//		{
//			for (item = this.selectedItem; item.previousElementSibling; item = item.previousElementSibling)
//			{
//				if (item.previousElementSibling._mainStart < low)
//				{
//					break;
//				}
//			}
//		}
//		else
//		{
//			for (item = this._container.firstElementChild; item; item = item.nextElementSibling)
//			{
//				if (item._mainStart >= low)
//				{
//					break;
//				}
//			}
//		}
//		
//		return item;
//	},
//	enumerable: true
//});
//
//
///**
// * Returns the last visible item in the Mosaic if any, undefined otherwise
// * @property lastVisibleItem
// * @type {o5.gui.controls.MosaicItem}
// * @readonly
// */
//Object.defineProperty(o5.gui.controls.Mosaic.prototype, 'lastVisibleItem', {
//	get: function () {
//
//		if (this._container.childElementCount === 0)
//			return undefined;
//		
//		var high = this._viewportLength + this._viewportStart;
//		
//		var item;
//		
//		if(this.selectedItem && this.selectedItem._mainEnd < high)
//		{
//			for (item = this.selectedItem; item.nextElementSibling; item = item.nextElementSibling)
//			{
//				if (item.nextElementSibling._mainEnd > high)
//				{
//					break;
//				}
//			}
//		}
//		else
//		{
//			for (item = this._container.lastElementChild; item; item = item.previousElementSibling)
//			{
//				if (item._mainEnd <= high)
//				{
//					break;
//				}
//			}
//		}
//		
//		return item;
//	},
//	enumerable: true
//});



/**
 * @property fastMove
 * @type {Boolean}
 * @ignore
 */
Object.defineProperty(o5.gui.controls.Mosaic.prototype, 'fastMove', {
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


///**
// * When enabled, the Mosaic items will have an "offset" attribute dynamically updated as the selection changes,
// * starting from 0 for the selected item, which can be used with CSS attribute selectors.
// * Updating attributes dynamically has a performance overhead, so only enable this when needed.
// * @property [offsetAttributes=false]
// * @type {Boolean}
// */
//Object.defineProperty(o5.gui.controls.Mosaic.prototype, 'offsetAttributes', {
//	get: function () {
//
//		return this._offsetAttributes || false;
//		
//	},
//	set: function (val) {
//		
//		this._offsetAttributes = val;
//		
//	},
//	enumerable: true
//});



/*
 * Public methods
 */
/**
 * Inserts a new item in the mosaic created from the configured item template
 * 
 * @method insertItem
 * @return {o5.gui.controls.MosaicItem} The new mosaic item
 */
o5.gui.controls.Mosaic.prototype.insertItem = function insertItem ()
{
	var item = this._itemTemplateResolved.cloneNode(true);

//	if (this._container.childElementCount > 5 && this._container.childElementCount > this._overflowVisibilityCount)
//	{
//		this._manageVisibility = true;
//		
//		var marginEnd = this._orientation === 'v' ?
//				(parseFloat(this._container.style.marginBottom) || 0) :
//				(parseFloat(this._container.style.marginRight) || 0);
//				
//		if (this._overflow || !this.offsetParent)
//		{
//			this._overflow = true;
//			item.style.display = 'none';
//			item._mainLength2 = this._overflowLength;
//			item._mainStart2 = marginEnd;
//			marginEnd += this._overflowLength;
//		}
//		else
//		{
//			if (this._orientation === 'v')
//			{
//		    	if (this.offsetHeight < this._container.offsetHeight)
//		    	{
//					if (this._container.lastElementChild.offsetTop >= this.offsetHeight)
//					{
//						item.style.display = 'none';
//						this._overflow = true;
//						this._overflowLength = this._container.lastElementChild._mainLength;
//						item._mainLength2 = this._overflowLength;
//						item._mainStart2 = marginEnd;
//						marginEnd += this._overflowLength;
//					}
//		    	}
//			}
//			else
//			{
//		    	if (this.offsetWidth < this._container.offsetWidth)
//		    	{
//		    		if (this._container.lastElementChild.offsetLeft >= this.offsetWidth)
//		    		{
//						item.style.display = 'none';
//						this._overflow = true;
//						this._overflowLength = this._container.lastElementChild._mainLength;
//						item._mainLength2 = this._overflowLength;
//						item._mainStart2 = marginEnd;
//						marginEnd += this._overflowLength;
//		    		}
//		    	}
//			}
//		}
//		
//		if(this._overflowLength)
//		{
//			if (this._orientation === 'v')
//				this._container.style.marginBottom = marginEnd + 'px';
//			else
//				this._container.style.marginRight = marginEnd + 'px';
//		}
//	}
//	
//	if(this.cyclic)
//	{
//		var sel = this.selectedItem;
//			
//		item._insertionIndex = this._container.childElementCount;
//		
//		var insertionPoint = this._container.lastElementChild;
//		
//		for (var lastItem = this._container.lastElementChild; lastItem; lastItem = lastItem.previousElementSibling)
//		{
//			if(lastItem._insertionIndex > insertionPoint._insertionIndex)
//				insertionPoint = lastItem;
//		}
//		
//		if(insertionPoint)
//			insertionPoint = insertionPoint.nextElementSibling;
//		
//		this._container.insertBefore(item, insertionPoint);
//		
//		if(sel && insertionPoint)
//		{
//			this._selectedItem = sel.itemIndex;
//			
//			if(!insertionPoint.style.display)
//				item.style.display = '';
//			
//			this._checkCyclic();
//			this._updateMargins();
//			if (this._container.style.transition)
//				this._container.style.transition = '';
//			this._updateViewport(sel, true);
//		}
//	}
//	else
//	{
		this._container.appendChild(item);
//	}
//
//	if(!this.fixedLayout && this._container.childElementCount <= 1)
//	{
//		var cs = window.getComputedStyle(this);
//		
//		if(cs.overflow === 'hidden')
//		{
////			this._manageVisibility = true;
//			
//			var vl = this._viewportLength;
//			var il = item._mainLength;
//			
//			this._overflowLength = il;
//			
//			if(vl === 0 || il === 0)
//			{
//				this._overflowVisibilityCount = 9999; //temp
//			}
//			else
//			{
//				this._overflowVisibilityCount = (vl / il) * (1 + 2 * this._overflowFactor);
//			}
//		}
//	}
	
	return item;
};


/**
 * Deletes all items from the mosaic
 *
 * @method deleteAllItems
 */
o5.gui.controls.Mosaic.prototype.deleteAllItems = function deleteAllItems ()
{
	this._container.innerHTML = '';
	this._selectItem(-1, true);
};


/**
 * Selects the given item in the Mosaic and scrolls the Mosaic if required.
 * @method selectItem
 * @param {o5.gui.controls.MosaicItem} item Item to be selected
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.Mosaic.prototype.selectItem = function selectItem (item, skipAnimation)
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
o5.gui.controls.Mosaic.prototype.clearSelection = function clearSelection (skipAnimation)
{
	if (this._selectedItem != -1)
	{
		this._selectItem(-1, skipAnimation);
		
		return true;
	}

	return false;
};


/**
 * @method selectLeft
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.Mosaic.prototype.selectLeft = function selectLeft (skipAnimation)
{
	var selectedItem = this.selectedItem;
	
	if(!selectedItem)
	{
		if(this._container.childElementCount)
		{
			this._selectItem(0, skipAnimation);
			return true;
		}
		else
		{
			return false;
		}
	}
	
	var mainStart = selectedItem.offsetLeft;
//	var mainEnd = selectedItem.offsetLeft + selectedItem.offsetWidth;
	var crossStart = selectedItem.offsetTop;
	var crossCenter = selectedItem.offsetTop + selectedItem.offsetHeight / 2;
	var crossEnd = selectedItem.offsetTop + selectedItem.offsetHeight;
	
	var nearest = null;
	var nearestCrossDistance = Number.MAX_SAFE_INTEGER;
	
	for (var item = this._container.firstElementChild; item; item = item.nextElementSibling)
	{
		if (item.offsetLeft + item.offsetWidth > mainStart)
			continue;
		
		if (item.offsetTop + item.offsetHeight < crossStart)
			continue;
		
		if (item.offsetTop > crossEnd)
			continue;
		
		if (!nearest)
		{
			nearest = item;
			nearestCrossDistance = Number.MAX_SAFE_INTEGER;
			continue;
		}
		
		if (item.offsetLeft + item.offsetWidth > nearest.offsetLeft + nearest.offsetWidth)
		{
			nearest = item;
			nearestCrossDistance = Number.MAX_SAFE_INTEGER;
			continue;
		}
		
		if (item.offsetLeft + item.offsetWidth == nearest.offsetLeft + nearest.offsetWidth && nearestCrossDistance != 0)
		{
			var d1;
			
			if (nearestCrossDistance === Number.MAX_SAFE_INTEGER)
			{
				if (nearest.offsetTop <= crossCenter && (nearest.offsetTop + nearest.offsetHeight) >= crossCenter)
				{
					nearestCrossDistance = 0;
				}
				else if (nearest.offsetTop >= crossCenter)
				{
					nearestCrossDistance = nearest.offsetTop - crossCenter;
				}
				else
				{
					nearestCrossDistance = crossCenter - (nearest.offsetTop + nearest.offsetHeight);
				}
			}
			
			if (item.offsetTop <= crossCenter && (item.offsetTop + item.offsetHeight) >= crossCenter)
			{
				d1 = 0;
			}
			else if (item.offsetTop >= crossCenter)
			{
				d1 = item.offsetTop - crossCenter;
			}
			else
			{
				d1 = crossCenter - (item.offsetTop + item.offsetHeight);
			}
			
			if (d1 < nearestCrossDistance)
			{
				nearest = item;
				nearestCrossDistance = Number.MAX_SAFE_INTEGER;
				continue;
			}
		}
	}

	if (nearest)
	{
		this._selectItem(nearest, skipAnimation);
		return true;
	}

	return false;
};

/**
 * @method selectRight
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.Mosaic.prototype.selectRight = function selectRight (skipAnimation)
{
	var selectedItem = this.selectedItem;
	
	if(!selectedItem)
	{
		if(this._container.childElementCount)
		{
			this._selectItem(0, skipAnimation);
			return true;
		}
		else
		{
			return false;
		}
	}
	
	var mainEnd = selectedItem.offsetLeft + selectedItem.offsetWidth;
	var crossStart = selectedItem.offsetTop;
	var crossCenter = selectedItem.offsetTop + selectedItem.offsetHeight / 2;
	var crossEnd = selectedItem.offsetTop + selectedItem.offsetHeight;
	
	var nearest = null;
	var nearestCrossDistance = Number.MAX_SAFE_INTEGER;
	
	for (var item = this._container.firstElementChild; item; item = item.nextElementSibling)
	{
		if (item.offsetLeft < mainEnd)
			continue;
		
		if (item.offsetTop + item.offsetHeight < crossStart)
			continue;
		
		if (item.offsetTop > crossEnd)
			continue;
		
		if (!nearest)
		{
			nearest = item;
			nearestCrossDistance = Number.MAX_SAFE_INTEGER;
			continue;
		}
		
		if (item.offsetLeft < nearest.offsetLeft)
		{
			nearest = item;
			nearestCrossDistance = Number.MAX_SAFE_INTEGER;
			continue;
		}
		
		if (item.offsetLeft == nearest.offsetLeft && nearestCrossDistance != 0)
		{
			var d1;
			
			if (nearestCrossDistance === Number.MAX_SAFE_INTEGER)
			{
				if (nearest.offsetTop <= crossCenter && (nearest.offsetTop + nearest.offsetHeight) >= crossCenter)
				{
					nearestCrossDistance = 0;
				}
				else if (nearest.offsetTop >= crossCenter)
				{
					nearestCrossDistance = nearest.offsetTop - crossCenter;
				}
				else
				{
					nearestCrossDistance = crossCenter - (nearest.offsetTop + nearest.offsetHeight);
				}
			}
			
			if (item.offsetTop <= crossCenter && (item.offsetTop + item.offsetHeight) >= crossCenter)
			{
				d1 = 0;
			}
			else if (item.offsetTop >= crossCenter)
			{
				d1 = item.offsetTop - crossCenter;
			}
			else
			{
				d1 = crossCenter - (item.offsetTop + item.offsetHeight);
			}
			
			if (d1 < nearestCrossDistance)
			{
				nearest = item;
				nearestCrossDistance = Number.MAX_SAFE_INTEGER;
				continue;
			}
		}
	}

	if (nearest)
	{
		this._selectItem(nearest, skipAnimation);
		return true;
	}

	return false;
};

/**
 * @method selectUp
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.Mosaic.prototype.selectUp = function selectUp (skipAnimation)
{
	var selectedItem = this.selectedItem;
	
	if(!selectedItem)
	{
		if(this._container.childElementCount)
		{
			this._selectItem(0, skipAnimation);
			return true;
		}
		else
		{
			return false;
		}
	}
	
	var mainStart = selectedItem.offsetTop;
//	var mainEnd = selectedItem.offsetTop + selectedItem.offsetHeight;
	var crossStart = selectedItem.offsetLeft;
	var crossCenter = selectedItem.offsetLeft + selectedItem.offsetWidth / 2;
	var crossEnd = selectedItem.offsetLeft + selectedItem.offsetWidth;
	
	var nearest = null;
	var nearestCrossDistance = Number.MAX_SAFE_INTEGER;
	
	for (var item = this._container.firstElementChild; item; item = item.nextElementSibling)
	{
		if (item.offsetTop + item.offsetHeight > mainStart)
			continue;
		
		if (item.offsetLeft + item.offsetWidth < crossStart)
			continue;
		
		if (item.offsetLeft > crossEnd)
			continue;
		
		if (!nearest)
		{
			nearest = item;
			nearestCrossDistance = Number.MAX_SAFE_INTEGER;
			continue;
		}
		
		if (item.offsetTop + item.offsetHeight > nearest.offsetTop + nearest.offsetHeight)
		{
			nearest = item;
			nearestCrossDistance = Number.MAX_SAFE_INTEGER;
			continue;
		}
		
		if (item.offsetTop + item.offsetHeight == nearest.offsetTop + nearest.offsetHeight && nearestCrossDistance != 0)
		{
			var d1;
			
			if (nearestCrossDistance === Number.MAX_SAFE_INTEGER)
			{
				if (nearest.offsetLeft <= crossCenter && (nearest.offsetLeft + nearest.offsetWidth) >= crossCenter)
				{
					nearestCrossDistance = 0;
				}
				else if (nearest.offsetLeft >= crossCenter)
				{
					nearestCrossDistance = nearest.offsetLeft - crossCenter;
				}
				else
				{
					nearestCrossDistance = crossCenter - (nearest.offsetLeft + nearest.offsetWidth);
				}
			}
			
			if (item.offsetLeft <= crossCenter && (item.offsetLeft + item.offsetWidth) >= crossCenter)
			{
				d1 = 0;
			}
			else if (item.offsetLeft >= crossCenter)
			{
				d1 = item.offsetLeft - crossCenter;
			}
			else
			{
				d1 = crossCenter - (item.offsetLeft + item.offsetWidth);
			}
			
			if (d1 < nearestCrossDistance)
			{
				nearest = item;
				nearestCrossDistance = Number.MAX_SAFE_INTEGER;
				continue;
			}
		}
	}

	if (nearest)
	{
		this._selectItem(nearest, skipAnimation);
		return true;
	}

	return false;
};

/**
 * @method selectDown
 * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
 * @return {Boolean} Returns true if selection changed, false otherwise
 */
o5.gui.controls.Mosaic.prototype.selectDown = function selectDown (skipAnimation)
{
	var selectedItem = this.selectedItem;
	
	if(!selectedItem)
	{
		if(this._container.childElementCount)
		{
			this._selectItem(0, skipAnimation);
			return true;
		}
		else
		{
			return false;
		}
	}
	
	var mainEnd = selectedItem.offsetTop + selectedItem.offsetHeight;
	var crossStart = selectedItem.offsetLeft;
	var crossCenter = selectedItem.offsetLeft + selectedItem.offsetWidth / 2;
	var crossEnd = selectedItem.offsetLeft + selectedItem.offsetWidth;
	
	var nearest = null;
	var nearestCrossDistance = Number.MAX_SAFE_INTEGER;
	
	for (var item = this._container.firstElementChild; item; item = item.nextElementSibling)
	{
		if (item.offsetTop < mainEnd)
			continue;
		
		if (item.offsetLeft + item.offsetWidth < crossStart)
			continue;
		
		if (item.offsetLeft > crossEnd)
			continue;
		
		if (!nearest)
		{
			nearest = item;
			nearestCrossDistance = Number.MAX_SAFE_INTEGER;
			continue;
		}
		
		if (item.offsetTop < nearest.offsetTop)
		{
			nearest = item;
			nearestCrossDistance = Number.MAX_SAFE_INTEGER;
			continue;
		}
		
		if (item.offsetTop == nearest.offsetTop && nearestCrossDistance != 0)
		{
			var d1;
			
			if (nearestCrossDistance === Number.MAX_SAFE_INTEGER)
			{
				if (nearest.offsetLeft <= crossCenter && (nearest.offsetLeft + nearest.offsetWidth) >= crossCenter)
				{
					nearestCrossDistance = 0;
				}
				else if (nearest.offsetLeft >= crossCenter)
				{
					nearestCrossDistance = nearest.offsetLeft - crossCenter;
				}
				else
				{
					nearestCrossDistance = crossCenter - (nearest.offsetLeft + nearest.offsetWidth);
				}
			}
			
			if (item.offsetLeft <= crossCenter && (item.offsetLeft + item.offsetWidth) >= crossCenter)
			{
				d1 = 0;
			}
			else if (item.offsetLeft >= crossCenter)
			{
				d1 = item.offsetLeft - crossCenter;
			}
			else
			{
				d1 = crossCenter - (item.offsetLeft + item.offsetWidth);
			}
			
			if (d1 < nearestCrossDistance)
			{
				nearest = item;
				nearestCrossDistance = Number.MAX_SAFE_INTEGER;
				continue;
			}
		}
	}

	if (nearest)
	{
		this._selectItem(nearest, skipAnimation);
		return true;
	}

	return false;
};

///**
// * For Mosaics with multiple pages, move to the previous page and select the first visible item
// * @method selectPreviousPage
// * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
// * @return {Boolean} Returns true if selection changed, false otherwise
// */
//o5.gui.controls.Mosaic.prototype.selectPreviousPage = function selectPreviousPage (skipAnimation)
//{
//	if (this.pageCount <= 1)
//		return false;
//	
//	var item = this.selectedItem;
//	var item2 = item.previousElementSibling;
//	
//	if(!item2 && !this._cyclic)
//		return false;
//	
//	if (this._focusPoint)
//	{
//		//simple perturbation
//		this._viewportStart = this.selectedItem._mainStart - (this.selectedItem._mainLength / 2);
//	}
//	
//	this._viewportStart -= this._viewportLength;
//	this._checkCyclic();
//	item2 = this.firstVisibleItem;
//	this._viewportStart = item2._mainStart;
//	
//	this._selectItem(item2.itemIndex, skipAnimation);
//
//	return true;
//};
//
///**
// * For Mosaics with multiple pages, move to the next page and select the first visible item
// * @method selectNextPage
// * @param {Boolean} [skipAnimation=false] Option to skip animations, for cases of repeated key presses
// * @return {Boolean} Returns true if selection changed, false otherwise
// */
//o5.gui.controls.Mosaic.prototype.selectNextPage = function selectNextPage (skipAnimation)
//{
//	if (this.pageCount <= 1)
//		return false;
//	
//	var item = this.selectedItem;
//	var item2 = item.nextElementSibling;
//	
//	if(!item2 && !this._cyclic)
//		return false;
//	
//	if (this._focusPoint)
//	{
//		//simple perturbation
//		this._viewportStart = this.selectedItem._mainStart - (this.selectedItem._mainLength / 2);
//	}
//	
//	this._viewportStart += this._viewportLength;
//	item2 = this.firstVisibleItem;
//	this._checkCyclic();
//	
//	if(!item2) // moved it too far
//		item2 = this._container.lastElementChild;
//	else
//	{
//		if(item2._mainStart > this._viewportStart)
//			item2 = item2.previousElementSibling;
//	}
//		
//	this._viewportStart = item2._mainStart;
//	
//	this._selectItem(item2.itemIndex, skipAnimation);
//
//	return true;
//};


/**
 * @ignore overrides base control method
 */
o5.gui.controls.Mosaic.prototype.updateLayout = function updateLayout ()
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

o5.gui.controls.Mosaic.prototype.delayActivation = 500;

o5.gui.controls.Mosaic.prototype.pagingOverflow = 0;

o5.gui.controls.Mosaic.prototype._overflowFactor = 1;



Object.defineProperty(o5.gui.controls.Mosaic.prototype, '_mainStart', {
	get: function get ()
	{
		if (this.offsetParent)
		{
			var cs = window.getComputedStyle(this);
			
			if (this._orientation === 'v')
				this._mainStart2 = this._container.offsetTop;
			else
				this._mainStart2 = parseInt(cs.paddingLeft);
		}
		
		return this._mainStart2;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.controls.Mosaic.prototype, '_mainEnd', {
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

Object.defineProperty(o5.gui.controls.Mosaic.prototype, '_mainLength', {
	get: function get ()
	{
		var start = Number.MAX_SAFE_INTEGER;
		var end = Number.MIN_SAFE_INTEGER;
		
		for (var item = this._container.firstElementChild; item; item = item.nextElementSibling)
		{
			var start2 = item._mainStart;
			var end2 = item._mainEnd;
			
			if (start2 < start)
				start = start2;
			
			if (end2 > end)
				end = end2;
		}
		
		return end - start;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.controls.Mosaic.prototype, '_viewportStart', {
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

Object.defineProperty(o5.gui.controls.Mosaic.prototype, '_viewportEnd', {
	get: function get ()
	{
		if (this._orientation === 'v')
			return this.clientHeight;
		else
			return this.clientWidth;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.controls.Mosaic.prototype, '_viewportLength', {
	get: function get ()
	{
		
		var cs = window.getComputedStyle(this);
		
		if (this.offsetParent)
		{
			if (this._orientation === 'v')
				return this.clientHeight;
			else
				return this.clientWidth - parseInt(cs.paddingLeft) - parseInt(cs.paddingRight);
		}
		else
		{
			var cs = window.getComputedStyle(this);
			
			var ret;

			if (this._orientation === 'v')
			{
				ret = parseFloat(cs.height);
				ret += parseFloat(cs.marginTop);
				ret += parseFloat(cs.marginBottom);
			}
			else if (this._orientation === 'h')
			{
				ret = parseFloat(cs.width);
				ret += parseFloat(cs.marginLeft);
				ret += parseFloat(cs.marginRight);
			}
			
			return ret;
		}
	},
	enumerable: true
});




/*
 * Private methods
 */

o5.gui.controls.Mosaic.prototype._onKeyDown = function _onKeyDown (e)
{
	this.logInfo(e.keyCode + ' ' + e.timeStamp);

	switch (e.key)
	{
	case 'ArrowLeft':
		if (this.selectLeft(e.repeat && this.fastMove))
			e.preventDefault();
		break;
		
	case 'ArrowRight':
		if (this.selectRight(e.repeat && this.fastMove))
			e.preventDefault();
		break;
		
	case 'ArrowUp':
		if (this.selectUp(e.repeat && this.fastMove))
			e.preventDefault();
		break;
		
	case 'ArrowDown':
		if (this.selectDown(e.repeat && this.fastMove))
			e.preventDefault();
		break;
		
//	case 'ChannelUp':
//		if (this._orientation === 'v')
//		{
//			if(this.selectPreviousPage(e.repeat && this.fastMove))
//				e.preventDefault();
//		}
//		break;
//		
//	case 'ChannelDown':
//		if (this._orientation === 'v')
//		{
//			if(this.selectNextPage(e.repeat && this.fastMove))
//				e.preventDefault();
//		}
//		break;
//		
//	case 'TrackPrevious':
//		if (this._orientation === 'h')
//		{
//			if(this.selectPreviousPage(e.repeat && this.fastMove))
//				e.preventDefault();
//		}
//		break;
//		
//	case 'TrackNext':
//		if (this._orientation === 'h')
//		{
//			if(this.selectNextPage(e.repeat && this.fastMove))
//				e.preventDefault();
//		}
//		break;
	}
};



o5.gui.controls.Mosaic.prototype._selectItem = function _selectItem (index, skipAnimation)
{
	this.logEntry();
	
	if (typeof index === 'object')
		index = index.itemIndex;

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

//	if(this._movePending) debugger;

	this._movePending = true;
	this.queueReflowPrep(this._prepMove, { from: previous, to: item,
		skipAnimation: skipAnimation});
};


o5.gui.controls.Mosaic.prototype._prepMove = function _prepMove (tag)
{
	this.logEntry();
	
	if (!this.fixedLayout)
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



o5.gui.controls.Mosaic.prototype._doMove = function _doMove (tag)
{
	this.logEntry();

	var previous = tag.from;
	var item = tag.to;
	
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
			if (this._focusBox.style.display)
				this._focusBox.style.display = '';
			
			var cs = window.getComputedStyle(this);
			
		    this._focusBox.moveTo(
		    		tag.to.offsetLeft - this._viewportStart + this._mainStart,
		    		tag.to.offsetTop + parseInt(cs.paddingTop),
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


o5.gui.controls.Mosaic.prototype._checkMove = function _checkMove (tag)
{
	this.logEntry();
	
	this._updateViewport(this.selectedItem, true);
};


o5.gui.controls.Mosaic.prototype._updateViewport = function _updateViewport (item, force)
{
	this.logEntry();
	
	if (!item)
	{
		this._viewportStart = 0;
		
		return;
	}

	var posA;
	var posB;

//	if (this._focusPoint !== undefined)
//	{
//		if(this._focusPoint >= 0 && this._focusPoint <= 1)
//			this._viewportStart = item._mainStart - (this._viewportLength * this._focusPoint);
//		else
//			this._viewportStart = item._mainStart - this._focusPoint;
//		
//		switch(this.focusPointAlignItem)
//		{
//    	case 'center': 	this._viewportStart += item._mainLength / 2; 	break;
//    	case 'end': 	this._viewportStart += item._mainLength; 		break;
//		};
//	}
//	else
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


o5.gui.controls.Mosaic.prototype._updateTransform = function _updateTransform ()
{
	this.logEntry();
	
	var moveCSS = '';
	
	var cs = window.getComputedStyle(this);
	
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
		if (this._useACLayers/* && this._container.style.webkitTransform*/)
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


o5.gui.controls.Mosaic.prototype._moveTransitionEnd = function _moveTransitionEnd (e)
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


o5.gui.controls.Mosaic.prototype._checkCyclic = function _checkCyclic (tag)
{
	if (this._cyclic && this._container.childElementCount > 1)
	{
		// this code may trigger multiple reflows
		// there is no effective way of rebalancing cyclic Mosaics while still supporting standard CSS rules on the Mosaic items
		
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
						this._selectedItem++;
						if (this._selectedItem >= this._container.childElementCount)
							this._selectedItem = 0;
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
						this._selectedItem--;
						if (this._selectedItem < 0)
							this._selectedItem = this._container.childElementCount - 1;
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
					this._container.lastElementChild._mainStart2 = this._container.lastElementChild._mainLength2 +
																   this._container.lastElementChild.previousElementSibling._mainStart2;
					delta++;
				}
			}
		}
		
		//this._checkMove({ to: this.selectedItem, moveCSS: this._container.style.webkitTransform });
	}
};

o5.gui.controls.Mosaic.prototype._checkOverflow = function _checkOverflow ()
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


o5.gui.controls.Mosaic.prototype._postMove = function _postMove (tag)
{
	this.logEntry();
	
	if (this._cyclic)
	{
		this._checkCyclic();
		this._checkMove();
	}
	
	if (this._manageVisibility)
		this.queueReflowClean(this._checkOverflow);
	
//	this._container.style.transition = "";
	this._movePending = false;
};


o5.gui.controls.Mosaic.prototype._updateMargins = function _updateMargins ()
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




