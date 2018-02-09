/**
 * @class app.gui.controls.DialogPurchaseMainEventOffline
 */

app.gui.controls.DialogPurchaseMainEventOffline = function DialogPurchaseMainEventOffline () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogPurchaseMainEventOffline, app.gui.controls.HtmlDialogContainer);

app.gui.controls.DialogPurchaseMainEventOffline.prototype.createdCallback = function createdCallback () {
//	this.logEntry();
	this.superCall();

//  this._fill = this.querySelector('#volumeBarFill');
	
//	this.logExit();
};

/**
 * @method _store
 */
app.gui.controls.DialogPurchaseMainEventOffline.prototype._store = function _store () {
	this.logEntry();
	console.log("dialog settings not stored");
	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.DialogPurchaseMainEventOffline.prototype._show = function _show () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.DialogPurchaseMainEventOffline.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.DialogPurchaseMainEventOffline.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();

	switch (e.key) {
		default:
			this.superCall(e);
			break;
	}

	this.logExit();
};

