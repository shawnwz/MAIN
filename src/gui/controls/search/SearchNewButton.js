/**
 * @class app.gui.controls.SearchNewButton
 */

app.gui.controls.SearchNewButton = function SearchNewButton() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchNewButton, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchNewButton.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._focusClass = "control-focused";
	this.logExit();
};

