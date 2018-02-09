/**
 * @class app.gui.controls.HomeEpgGrid
 */

app.gui.controls.HomeEpgGrid = function HomeEpgGrid () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HomeEpgGrid, app.gui.controls.HtmlTable);

/**
 * @method createdCallback
 */
app.gui.controls.HomeEpgGrid.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

