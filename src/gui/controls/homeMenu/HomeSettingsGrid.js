/**
 * @class app.gui.controls.HomeSettingsGrid
 */

app.gui.controls.HomeSettingsGrid = function HomeSettingsGrid () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HomeSettingsGrid, app.gui.controls.HtmlTable);

/**
 * @method createdCallback
 */
app.gui.controls.HomeSettingsGrid.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

app.gui.controls.HomeSettingsGrid.prototype._populate = function _populate (items) {
	this.logEntry();
	if (items && items.length > 0) {
		var item = this._split(items, 2);

		this.superCall(item);
	}
	this.logExit();
};
