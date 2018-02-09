/**
 * @class app.gui.controls.DialogDisambiguationKeep
 */

app.gui.controls.DialogDisambiguationKeep = function DialogDisambiguationKeep () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogDisambiguationKeep, app.gui.controls.HtmlDialogContainer);

app.gui.controls.DialogDisambiguationKeep.prototype.createdCallback = function createdCallback () {
//	this.logEntry();
	this.superCall();

	this._title = this.querySelector('.dialogTitle');
	this._title.textContent = "DialogDisambiguationKeep";
	
//	this.logExit();
};

/**
 * @method _store
 */
app.gui.controls.DialogDisambiguationKeep.prototype._store = function _store () {
	this.logEntry();
	console.log("dialog settings not stored");
	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.DialogDisambiguationKeep.prototype._show = function _show () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.DialogDisambiguationKeep.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.DialogDisambiguationKeep.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();

	switch (e.key) {
		default:
			this.superCall(e);
			break;
	}

	this.logExit();
};

