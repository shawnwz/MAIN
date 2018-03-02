/**
 * @class app.gui.controls.SettingsInternetStatusOverlay
 */

app.gui.controls.SettingsInternetStatusOverlay = function SettingsInternetStatusOverlay () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsInternetStatusOverlay, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 */
app.gui.controls.SettingsInternetStatusOverlay.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._renewMode = null;
	this._RENEWING_TIMEOUT = 10000;
    this._renewTimeout = null;
    this._updateTimeout = null;
	this._overlayClasses = {
        RENEWING    : 'renewing',
        FAIL        : 'fail',
        RENEWED     : 'renewed',
        UPDATING    : 'updating',
        UPDATINGFAIL: 'updateFail'
    };
	$util.Translations.update(this);
	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.SettingsInternetStatusOverlay.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();
	this.superCall();
	this._registerCallBacks();
	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.SettingsInternetStatusOverlay.prototype._show = function _show(mode) {
	this.logEntry();
	this.superCall();
	this._renewMode = mode;
	this._handleDisplayMode();
	this.focus();
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.SettingsInternetStatusOverlay.prototype._hide = function _hide() {
	this.logEntry();
	this.superCall();
	this._clearTimeOut();
	this._clearClassList();
	$util.ControlEvents.fire("app-settings:settingsNetworkDetailsViewList", "focus");
	this.logExit();
};

/**
 * @method _clearTimeOut
 */
app.gui.controls.SettingsInternetStatusOverlay.prototype._clearTimeOut = function _clearTimeOut() {
	this.logEntry();
	if (this._renewTimeout) {
		clearTimeout(this._renewTimeout);
		this._renewTimeout = null;
	}
	if (this._updateTimeout) {
		clearTimeout(this._updateTimeout);
		this._updateTimeout = null;
	}
	this.logExit();
};

 /**
  * @method _showDialogBasedOnId
  * @private
  */
app.gui.controls.SettingsInternetStatusOverlay.prototype._showDialogBasedOnId = function _showDialogBasedOnId (id) {
	this.logEntry();
	if (id) {
		this._clearClassList();
		switch (id) {
			case this._overlayClasses.RENEWING: this.classList.add(this._overlayClasses.RENEWING);
				break;
			case this._overlayClasses.FAIL: this.classList.add(this._overlayClasses.FAIL);
				break;
			case this._overlayClasses.RENEWED: this.classList.add(this._overlayClasses.RENEWED);
				break;
			case this._overlayClasses.UPDATING: this.classList.add(this._overlayClasses.UPDATING);
				break;
			case this._overlayClasses.UPDATINGFAIL: this.classList.add(this._overlayClasses.UPDATINGFAIL);
				break;
			default: this._clearClassList();
				break;
		}
	}
	this.logExit();
 };

 /**
  * @method _handleDisplayMode
  * renew modes - DHCP, TCP-IP
  * @private
  */
app.gui.controls.SettingsInternetStatusOverlay.prototype._handleDisplayMode = function _handleDisplayMode () {
	var me = this;
	this._clearTimeOut();
	if (this._renewMode === $util.constants.INTERNET_STATUS_OVERLAY_DISPLAY_MODE.DHCP) {
		this._showDialogBasedOnId(this._overlayClasses.RENEWING);
    		this._renewTimeout = setTimeout(function () {
 				me._showDialogBasedOnId(me._overlayClasses.FAIL);
    		}, this._RENEWING_TIMEOUT);
	} else if (this._renewMode === $util.constants.INTERNET_STATUS_OVERLAY_DISPLAY_MODE.TCP_IP) {
		this._showDialogBasedOnId(this._overlayClasses.UPDATING);
		this._updateTimeout = setTimeout(function () {
			me._showDialogBasedOnId(me._overlayClasses.UPDATINGFAIL);
		}, this._RENEWING_TIMEOUT);
	}
 };


  /**
   * clears all the classlist
   * @method _clearClassList
   * @private
   */
app.gui.controls.SettingsInternetStatusOverlay.prototype._clearClassList = function _clearClassList () {
	var classList = this.classList;
	while (classList.length > 0) {
	   classList.remove(classList.item(0));
	}
 };


  /**
   * register Ip received callback
   * @method _registerCallBacks
   * @private
   */
app.gui.controls.SettingsInternetStatusOverlay.prototype._registerCallBacks = function _registerCallBacks () {
	this.logEntry();
	var me = this;
	o5.platform.system.Network.StateChange.setIpReceivedCallBack(function () {
			me._clearTimeOut();
			if (me._renewMode === $util.constants.INTERNET_STATUS_OVERLAY_DISPLAY_MODE.DHCP) {
				me._showDialogBasedOnId(me._overlayClasses.RENEWED);
			} else if (me._renewMode === $util.constants.INTERNET_STATUS_OVERLAY_DISPLAY_MODE.TCP_IP) {
				me._hide();
			}
		});

	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.SettingsInternetStatusOverlay.prototype._onKeyDown = function _onKeyDown (e) {
	var handled = false;
	this.logEntry();
	switch (e.key) {
		case "Back":
 			this._hide();
 			handled = true;
			break;
		default:
			handled = this.superCall(e);
			break;
	}
	if (handled === true) {
		e.stopImmediatePropagation();
	}
	this.logExit();
};
