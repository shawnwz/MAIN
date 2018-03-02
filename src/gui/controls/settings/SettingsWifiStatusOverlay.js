/**
 * @class app.gui.controls.SettingsWifiStatusOverlay
 */

app.gui.controls.SettingsWifiStatusOverlay = function SettingsWifiStatusOverlay () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsWifiStatusOverlay, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 */
app.gui.controls.SettingsWifiStatusOverlay.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._wifiStatus = {
        CONNECTING: 'connecting',
        FAIL      :  'fail',
        CONNECTED : 'connected'
        };
    this._ssidWifiPlaceHolder = this.querySelector("#settingsWifiConnectedName");
	$util.Translations.update(this);
	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.SettingsWifiStatusOverlay.prototype._show = function _show(data) {
	this.logEntry();
	this.superCall();
	this._showOverlay(data);
	this._focus();
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.SettingsWifiStatusOverlay.prototype._hide = function _hide() {
	this.logEntry();
	this.superCall();
	if (this._lastElem) {
        this._lastElem.fireControlEvent("focus");
    }
	this.logExit();
};

 /**
  * @method _showOverlay
  * @private
  */
app.gui.controls.SettingsWifiStatusOverlay.prototype._showOverlay = function _showOverlay (data) {
	this.logEntry();
	if (data.mode === "normal") {
		this._clearClassList();
		switch (data.status) {
			case this._wifiStatus.CONNECTING:
				this.classList.add(this._wifiStatus.CONNECTING);
				break;
			case this._wifiStatus.FAIL:
				this.classList.add(this._wifiStatus.FAIL);
				break;
			case this._wifiStatus.CONNECTED:
				this.classList.add(this._wifiStatus.CONNECTED);
				this._ssidWifiPlaceHolder.textContent = data.name;
				break;
			default:
				break;
			}
	} else if (data.mode === "WBS") {
	  // TODO
	}
	$util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", this);
	this.logExit();
 };

  /**
   * clears all the classlist
   * @method _clearClassList
   * @private
   */
app.gui.controls.SettingsWifiStatusOverlay.prototype._clearClassList = function _clearClassList () {
	var classList = this.classList;
	while (classList.length > 0) {
	   classList.remove(classList.item(0));
	}
 };


/**
 * @method _onKeyDown
 */
app.gui.controls.SettingsWifiStatusOverlay.prototype._onKeyDown = function _onKeyDown (e) {
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
