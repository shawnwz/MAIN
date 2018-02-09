/**
 * Item used by o5.gui.controls.Mosaic
 * Can be used directly as a generic list item or as a base class for customized list items
 *
 * @class o5.gui.controls.MosaicItem
 * @extends o5.gui.controls.Control
 * @private Not for public use yet
 *
 * @author lmayle
 */

o5.gui.controls.MosaicItem = function MosaicItem () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.MosaicItem);

//o5.gui.controls.MosaicItem = class ListItem extends HTMLElement {
//	
//	constructor ()
//	{
//		debugger;
//	}
//};

//o5.gui.controls.MosaicItem.prototype.createdCallback = function createdCallback()
//{
//	this.superCall();
//};

//o5.gui.controls.MosaicItem.prototype.onselect = null;

//o5.gui.controls.MosaicItem.prototype.ondeselect = null;

//o5.gui.controls.MosaicItem.prototype.onactivate = null;

//o5.gui.controls.MosaicItem.prototype.ondeactivate = null;


/*
 * Public properties
 */
/**
 * Is a number representing the item position in the items collection of the list it belongs to.
 * If the item doesn't belong to a list, it returns -1.
 * The index may change with cyclic lists as the list moves.
 * @property itemIndex
 * @private
 * @type {Number}
 */
Object.defineProperty(o5.gui.controls.MosaicItem.prototype, 'itemIndex', {
	get: function ()
	{
		return Array.prototype.indexOf.call(this.parentElement.children, this);
	},
	enumerable: true
});


/*
 * Private properties
 */
Object.defineProperty(o5.gui.controls.MosaicItem.prototype, '_mainStart', {
	get: function ()
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

Object.defineProperty(o5.gui.controls.MosaicItem.prototype, '_mainEnd', {
	get: function ()
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

Object.defineProperty(o5.gui.controls.MosaicItem.prototype, '_mainLength', {
	get: function ()
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
o5.gui.controls.MosaicItem.prototype._onSelect = function _onSelect () { };

o5.gui.controls.MosaicItem.prototype._onDeselect = function _onDeselect () { };

o5.gui.controls.MosaicItem.prototype._onActivate = function _onActivate () { };

o5.gui.controls.MosaicItem.prototype._onDeactivate = function _onDeactivate () { };



