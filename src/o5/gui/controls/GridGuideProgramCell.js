/**
 * The GridGuideProgramCell control is subclass of {@link o5.gui.controls.FlexGridCell} control 
 * and is used by {@link o5.gui.controls.GridGuideProgramGrid} control.
 * 
 * @class o5.gui.controls.GridGuideProgramCell
 * @extends o5.gui.controls.FlexGridCell
 *
 * @author lmayle
 */

o5.gui.controls.GridGuideProgramCell = function GridGuideProgramCell () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.GridGuideProgramCell, o5.gui.controls.FlexGridCell);

// o5.log.setAll(o5.gui.controls.GridGuideProgramCell, true);

//o5.gui.controls.GridGuideProgramCell.prototype.createdCallback = function createdCallback ()
//{
//	this.superCall();
//};

o5.gui.controls.GridGuideProgramCell.prototype.update = function ()
{
	this.textContent = this._data.title;
};

/**
 * The EPG data object for this Event
 * @property data
 * @type {o5.data.EPGService}
 */
Object.defineProperty(o5.gui.controls.GridGuideProgramCell.prototype, 'data', {
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
