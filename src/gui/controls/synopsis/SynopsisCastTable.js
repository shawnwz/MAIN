/**
 * @class app.gui.controls.SynopsisCastTable
 */

app.gui.controls.SynopsisCastTable = function SynopsisCastTable() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisCastTable, app.gui.controls.HtmlTable);

/**
 * @method createdCallback
 */
app.gui.controls.SynopsisCastTable.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this._focusClass = "focused";

	this.logExit();
};

app.gui.controls.SynopsisCastTable.prototype._focus = function _focus() {
	this.logEntry();
	if (this._itemNb > 0) {
		this.superCall();
		$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "select", "app-synopsis:synopsisCast");
	}
	this.logExit();
};

app.gui.controls.SynopsisCastTable.prototype._populate = function _populate(editorial) {
	this.logEntry();
	if (editorial && editorial.actors && editorial.actors.length > 0) {
		var chunk = (editorial.directors && editorial.directors.length > 0) ? 5 : 7,
			items = [];
		editorial.actors.forEach(function(item, i) {
			var r = Math.floor(i % chunk);
			if (!items[r]) {
				items[r] = [];
			}
			items[r].push(item);
		});
		this.superCall(items);
	}
	this.logExit();
};
