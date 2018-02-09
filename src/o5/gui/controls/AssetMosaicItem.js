/**
 * Item used by o5.gui.controls.AssetMosaic
 * Can be used directly as a generic list item or as a base class for customized list items
 *
 * @class o5.gui.controls.AssetMosaicItem
 * @extends o5.gui.controls.MosaicItem
 *
 * @author lmayle
 */

o5.gui.controls.AssetMosaicItem = function AssetMosaicItem () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.AssetMosaicItem, o5.gui.controls.MosaicItem);

//o5.gui.controls.AssetMosaicItem.prototype.createdCallback = function createdCallback()
//{
//	this.superCall();
//};

/*
 * Public properties
 */
/**
 * @property data
 * @type {Object}
 */
Object.defineProperty(o5.gui.controls.AssetMosaicItem.prototype, 'data', {
	get: function get ()
	{
		return this._data;
	},
	set: function set (val)
	{
		this._data = val;
		
		this.update();
	},
	enumerable: true,
	configurable: false
});

/*
 * Public methods
 */
/**
 * @method update
 */
o5.gui.controls.AssetMosaicItem.prototype.update = function update ()
{
	this.logEntry();
};




/*
 * Private properties
 */


/*
 * Private methods
 */
