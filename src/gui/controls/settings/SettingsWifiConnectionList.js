/**
 * @class app.gui.controls.SettingsChannelList
 * @extends o5.gui.controls.List
 */

app.gui.controls.SettingsWifiConnectionList = function SettingsWifiConnectionList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsWifiConnectionList, app.gui.controls.HtmlScrollList);

/**
 * @method createdCallback
 * @private
 */

app.gui.controls.SettingsWifiConnectionList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
    this.orientation = "vertical";
	this._selectedChannel = null;
	this.onControlEvent("focussed", this._focussed);
	this.onControlEvent("defocus", this._defocus);
	this.logExit();
};


/**
 * @method _categorychoose
 * @private
*/
app.gui.controls.SettingsWifiConnectionList.prototype._focussed = function _focussed() {
	this.logEntry();
    if (this._selectedItem) {
    	this._isFooterUpdateRequired = true;
        this._selectedItem._onSelect();
     }
	this.logExit();
};

/**
 * @method _categorychoose
 * @private
*/
app.gui.controls.SettingsWifiConnectionList.prototype._defocus = function _defocus() {
	this.logEntry();
    if (this._selectedItem) {
        this._selectedItem._onDefocus();
        //this._isFooterUpdateRequired = false;
     }
	this.logExit();
};


app.gui.controls.SettingsWifiConnectionList.prototype._populate = function _populate(data) {
	this.logEntry();
	this._scrollbarType = "item";
  	this.superCall(data);
  	this.fireControlEvent("defocus");
    this.logExit();
};



app.gui.controls.SettingsWifiConnectionList.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	var handled = false;
	this._scrollbarType = "item";
	switch (e.key) {
		case "Ok":
		case "Enter":
			$util.ControlEvents.fire(":keyboardBg", "show");
			$util.ControlEvents.fire(":keyboardBg", "populate", app.gui.controls.KeyboardConfig.wifiPassword);
			$util.ControlEvents.fire(":keyboardBg", "focus");
			handled = true;
			break;
		case "ChannelDown":
			this._scrollbarType = "page";
			this.fireControlEvent("next");
			handled = true;
			break;
		case "ChannelUp":
			this._scrollbarType = "page";
			this.fireControlEvent("previous");
			handled = true;
			break;
		default:
			break;
	}
	if (handled === true) {
		e.stopImmediatePropagation();
	} else {
		this.superCall(e);
	}

	this.logExit();
};



/**
 * @class app.gui.controls.SettingsChannelMenuCategory
 * @extends o5.gui.controls.ListItem
 */

app.gui.controls.SettingsWifiConnectionListItem = function SettingsWifiConnectionListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsWifiConnectionListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsWifiConnectionListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._wifiName = this.querySelector('.wifiName');
	this._focusClass = "listView-focused";
	this._type = "";
	this.logExit();
};


/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsWifiConnectionListItem.prototype._getWifiSterngth = function _getWifiSterngth() {
	this.logEntry();
	var quality = 0;
	if (this._wifiDetails) {
		quality = this._wifiDetails.quality;
		if (quality > 0 && quality < 34) {
			return $util.constants.SIGNAL_STRENGTH.POOR;
		}
		if (quality >= 34 && quality < 67) {
			return $util.constants.SIGNAL_STRENGTH.AVERAGE;
		}
		if (quality >= 67 && quality <= 100) {
			return $util.constants.SIGNAL_STRENGTH.HIGH;
		}
	}
	this.logExit();
};

/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.SettingsWifiConnectionListItem.prototype, "itemData", {
	get: function get() {
		return this._channel;
	},
	set: function set(wifiDetails) {
		var strength;
		this._wifiDetails = wifiDetails;
		this._wifiName.innerText = wifiDetails.ssid;
		strength = this._getWifiSterngth();
		switch (strength) {
			case $util.constants.SIGNAL_STRENGTH.POOR:
				this.classList.add("strength1");
				break;
			case $util.constants.SIGNAL_STRENGTH.AVERAGE:
				this.classList.add("strength2");
				break;
			case $util.constants.SIGNAL_STRENGTH.HIGH:
				this.classList.add("strength3");
				break;
			default :
			break;
		}
		if (wifiDetails.status) {
			this.classList.add("connected");
		}
	}
});

/**
 * @method _onDefocus
 */
app.gui.controls.SettingsWifiConnectionListItem.prototype._onDefocus = function _onDefocus () {
    this.logEntry();
    if (this._focusClass) {
        this.classList.remove(this._focusClass);
    }
    this.logExit();
};


