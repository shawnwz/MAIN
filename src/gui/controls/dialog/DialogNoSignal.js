/**
 * @class app.gui.controls.DialogNoSignal
 */

app.gui.controls.DialogNoSignal = function DialogNoSignal () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogNoSignal, app.gui.controls.DialogGenericErrorH);


app.gui.controls.DialogNoSignal.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this.logExit();
};


/**
 * @method _populate
 */
app.gui.controls.DialogGenericErrorH.prototype._populate = function _populate(dialog) {
	this.logEntry();
	if (dialog) {
		this._dialog = dialog;
		var textBack = this.querySelector(".dialogCta span.txtBack");
		textBack.innerHTML = $util.Translations.translate("callToActionExit");
		textBack.dataset.i18n = "callToActionExit";
	}
	this.superCall();
	this.logExit();
};
