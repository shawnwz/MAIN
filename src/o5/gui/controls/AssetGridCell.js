/**
 * @class o5.gui.controls.AssetGridCell
 * @extends o5.gui.controls.FlexGridCell
 *
 * @author lmayle
 */

o5.gui.controls.AssetGridCell = function AssetGridCell () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.AssetGridCell, o5.gui.controls.FlexGridCell);

// o5.log.setAll(o5.gui.controls.AssetGridCell, true);

//o5.gui.controls.AssetGridCell.prototype.createdCallback = function createdCallback ()
//{
//	this.superCall();
//};

o5.gui.controls.AssetGridCell.prototype.update = function ()
{
	this.textContent = this._data.title;
};

/**
 * The EPG data object for this Event
 * @property data
 * @type {o5.data.EPGService}
 */
Object.defineProperty(o5.gui.controls.AssetGridCell.prototype, 'data', {
	get: function ()
	{
		return this._data;
	},
	set: function (val)
	{
		this._data = val;
		
		this.update();
	},
	enumerable: true,
	configurable: false
});
