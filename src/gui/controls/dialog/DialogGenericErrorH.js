/**
 * @class app.gui.controls.DialogGenericErrorH
 */

app.gui.controls.DialogGenericErrorH = function DialogGenericErrorH () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogGenericErrorH, app.gui.controls.HtmlDialogContainer);

app.gui.controls.DialogGenericErrorH.prototype.createdCallback = function createdCallback () {
//	this.logEntry();
	this.superCall();

	this._title.textContent = "";
	this._text.textContent = "";
	this._subText.textContent = "";
	this._errorCode.textContent = "";

	this.selectCallBack = function () {};

//  this._fill = this.querySelector('#volumeBarFill');

//	this.logExit();
};

/**
 * @method _store
 */
app.gui.controls.DialogGenericErrorH.prototype._store = function _store () {
	this.logEntry();
	if (this.selectCallBack) {
		this.selectCallBack();
	}
	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.DialogGenericErrorH.prototype._populate = function _populate(dialog, callBack) {
	this.logEntry();
	if (dialog) {
		this._dialog = dialog;
		if (this._dialog.title === $util.Translations.translate("F0124Title")) {
			var okAction = this.querySelector('.dialogCta .okAction'),
			    textBack = this.querySelector(".dialogCta span.txtBack");
			okAction.style.display = "none";
			textBack.innerHTML = $util.Translations.translate("callToActionExit");
		    textBack.dataset.i18n = "callToActionExit";
		}
	}
	if (callBack) {
		this.selectCallBack = callBack;
	}
	this.superCall();
	this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.DialogGenericErrorH.prototype._focus = function _focus() {
	this.logEntry();
	$util.ControlEvents.fire(":dialogGenericErrorH", "focus");
	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.DialogGenericErrorH.prototype._show = function _show () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.DialogGenericErrorH.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.DialogGenericErrorH.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();

	switch (e.key) {
		default:
			this.superCall(e);
			break;
	}
	this.logExit();
};
