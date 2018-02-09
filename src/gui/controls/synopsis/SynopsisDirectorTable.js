/**
 * @class app.gui.controls.SynopsisDirectorTable
 */

app.gui.controls.SynopsisDirectorTable = function SynopsisDirectorTable() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisDirectorTable, app.gui.controls.HtmlTable);

/**
 * @method createdCallback
 */
app.gui.controls.SynopsisDirectorTable.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this._focusClass = "focused";

	this.logExit();
};

app.gui.controls.SynopsisDirectorTable.prototype._focus = function _focus() {
	this.logEntry();
	if (this._itemNb > 0) {
		this.superCall();
		$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "select", "app-synopsis:synopsisCast");
	}
	this.logExit();
};

app.gui.controls.SynopsisDirectorTable.prototype._populate = function _populate(editorial) {
	this.logEntry();
	if (editorial && editorial.directors && editorial.directors.length > 0) {
		var items = this._split(editorial.directors, 4);
		this.superCall(items);
	}
	this.logExit();
};
