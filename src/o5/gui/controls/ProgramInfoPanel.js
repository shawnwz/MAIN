/**
 * @class o5.gui.controls.ProgramInfoPanel
 * @extends o5.gui.controls.Panel
 * 
 * @author lmayle
 * @ignore Not for public use yet
 */

o5.gui.controls.ProgramInfoPanel = function ProgramInfoPanel () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.ProgramInfoPanel, o5.gui.controls.Panel, null, true);

o5.gui.controls.ProgramInfoPanel.prototype.createdCallback = function createdCallback ()
{
	this.superCall();

	this._dataItems = this.querySelectorAll(':scope [data-bind]');
};


Object.defineProperty(o5.gui.controls.ProgramInfoPanel.prototype, 'data', {
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


o5.gui.controls.ProgramInfoPanel.prototype.update = function update ()
{
	for (var i = 0; i < this._dataItems.length; i++)
	{
		var item = this._dataItems[i];
		
		item.textContent = eval('this.' + item.dataset.bind);
	}
};

