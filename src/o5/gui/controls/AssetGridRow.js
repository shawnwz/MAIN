/**
 * @class o5.gui.controls.AssetGridRowRow
 * @extends o5.gui.controls.FlexGridRow
 *
 * @author lmayle
 */

o5.gui.controls.AssetGridRow = function AssetGridRow () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.AssetGridRow, o5.gui.controls.FlexGridRow);

// o5.log.setAll(o5.gui.controls.AssetGridRowRow, true);

//o5.gui.controls.AssetGridRow.prototype.createdCallback = function createdCallback ()
//{
//	this.superCall();
//};

Object.defineProperty(o5.gui.controls.AssetGridRow.prototype, "data", {
	get: function get ()
	{
		return this._data ? this._data : '';
	},
	set: function set (val)
	{
		this.logEntry();
		
		this._data = val;
		
		this.update();
	}
});

o5.gui.controls.AssetGridRow.prototype.update = function update ()
{
	this.logEntry();
	
	if(this._data)
	{
		for (let child of Object.values(this._data.children))
		{
			var cell = this.insertCell();
			
			cell.data = child;
		}
	}
};
