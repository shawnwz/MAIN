/**
 * @class app.gui.controls.DialogAcquiring
 */

app.gui.controls.DialogAcquiring = function DialogAcquiring () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogAcquiring, app.gui.controls.HtmlDialogContainer);

app.gui.controls.DialogAcquiring.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._title.textContent = "";
	this._text.textContent = "";
	this._errorCode.textContent = "";
	this.logExit();
};

/**
 * @method _store
 */
app.gui.controls.DialogAcquiring.prototype._store = function _store () {
	this.logEntry();
	console.log("dialog settings not stored");
	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.DialogAcquiring.prototype._show = function _show () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.DialogAcquiring.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
	this.logExit();
};



/**
 * @method _onKeyDown
 */
app.gui.controls.DialogAcquiring.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();

	switch (e.key) {
		default:
			this.superCall(e);
			break;
	}

	this.logExit();
};
