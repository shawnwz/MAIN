/**
 * @class app.gui.controls.DialogTcpIpError
 */

app.gui.controls.DialogTcpIpError = function DialogTcpIpError () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogTcpIpError, app.gui.controls.DialogGenericErrorH);


/**
 * @method _populate
 */
app.gui.controls.DialogTcpIpError.prototype._populate = function _populate(dialog, callBack) {
	this.logEntry();
	if (dialog) {
		var txtSelect,
			backAction;
		this._dialog = dialog;
			backAction = this.querySelector('.dialogCta .backAction');
		    txtSelect = this.querySelector(".dialogCta span.txtSelect");
			backAction.style.display = "none";
			txtSelect.textContent = this._dialog.backButtonText;
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
app.gui.controls.DialogTcpIpError.prototype._focus = function _focus() {
	this.logEntry();
	this.focus();
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.DialogTcpIpError.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
    var handled = false;
	switch (e.key) {
        case "Ok"   :
		case "Enter":
			this.fireControlEvent("store");
			this.fireControlEvent("hide");
			handled = true;
			break;
        case "Back":
        	handled = true;
            break;
		default:
			this.superCall(e);
			break;
	}
    if (handled === true) {
        e.stopImmediatePropagation();
    }
	this.logExit();
};

