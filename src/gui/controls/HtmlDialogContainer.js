/**
 * @class app.gui.controls.HtmlDialogContainer
 */
app.gui.controls.HtmlDialogContainer = function HtmlDialogContainer () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlDialogContainer, app.gui.controls.HtmlFocusItem);

app.gui.controls.HtmlDialogContainer.prototype.createdCallback = function createdCallback () {
//	this.logEntry();
	this.superCall();

	// the generic stuff for all dialogs
	this._dialog = {
		title    : "",
		text     : "",
		subText  : "",
		errorCode: ""
	};

  this._title = this.querySelector('.dialogBody .title');
  this._text = this.querySelector('.dialogBody .text');
  this._subText = this.querySelector('.dialogBody .subText');
	this._errorCode = this.querySelector('.dialogCta .errorCode');

//	this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlDialogContainer.prototype.attachedCallback = function attachedCallback () {
//	this.logEntry();
	this.superCall();
	if (this.id) {
		this.onControlEvent("store", this._store);
	}
//	this.logExit();
};

/**
 * @method _store
 */
app.gui.controls.HtmlDialogContainer.prototype._store = function _store () {
	this.logEntry();
	console.log("dialog settings not stored");
	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.HtmlDialogContainer.prototype._populate = function _populate (data) {
//	this.logEntry();
	var actualData = data;
	if (!actualData) {
		actualData = this._dialog;
	}

	if (actualData.title) {
	  this._title.textContent = actualData.title;
	}
	if (actualData.text) {
	  this._text.textContent = actualData.text;
	}
	if (actualData.subText) {
	  this._subText.textContent = actualData.subText;
	}
	if (actualData.errorCode) {
	  this._errorCode.textContent = actualData.errorCode;
	}

//	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.HtmlDialogContainer.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	//@hdk move back enter etc here??
	//@hdk check cta to see which keys do what?
	this.superCall(e);
	this.logExit();
};



