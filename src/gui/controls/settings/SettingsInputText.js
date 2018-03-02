/**
 * @class app.gui.controls.SettingsToggleList
 */

app.gui.controls.SettingsInputText = function SettingsInputText () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsInputText, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 */
app.gui.controls.SettingsInputText.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._visibleClass = "show";
	this._inputText = this.querySelector(".inputText");
	this._isEditable = false;
	this._isInEditMode = false;
	this._data = null;
	this._defaultValue = "0.0.0.0";
	this.logExit();
	};

/**
 * @method _showErrorDialog
 */
app.gui.controls.SettingsInputText.prototype._showErrorDialog = function _showErrorDialog() {
	this.logEntry();
       var me = this,
       		_dialog = {
	            id            : "TcpIpErrorDialog",
	            title         : $util.Translations.translate("F0560Title"),
	            text          : $util.Translations.translate("F0560Description"),
	            backButtonText: $util.Translations.translate("callToActionTryAgain"),
	            subText       : "",
	            errorCode     : "F0560"
	        };
		$util.ControlEvents.fire(":tcpIPConfigDialog", "hide");
		$util.ControlEvents.fire(":DialogTcpIpError", "show", _dialog, function () {
			$util.ControlEvents.fire(":tcpIPConfigDialog", "show");
			setTimeout(function() {
	 			$util.ControlEvents.fire(":tcpIPConfigDialog", "setIndex", me.index);
	 		}, 70);
		});
        $util.ControlEvents.fire(":DialogTcpIpError", "focus");
	this.logExit();
};

/**
 * @method _isDataLimitReached
 */
app.gui.controls.SettingsInputText.prototype._isDataLimitReached = function _isDataLimitReached() {
	this.logEntry();
	var data = this._inputText.textContent.replace(/ +/g, ""),
		dataLength,
		lastItemLength;
	data = data.split(".");
	dataLength = data.length;
	if (dataLength > 4) { // maximum data length is 4
		return true;
	}
	if (dataLength === 4) { // if the data length is four and fourth octet length is already 3, then return true as the IP address limit is reached.
		lastItemLength = data[dataLength - 1].length;
		if (lastItemLength >= 3) {
			return true;
		}
	} else {
		return false;
	}
};

/**
 * @method _isperiodAttachable
 */
app.gui.controls.SettingsInputText.prototype._isperiodAttachable = function _isperiodAttachable() {
	this.logEntry();
	var data = this._inputText.textContent.replace(/ +/g, ""),
		dataLength,
		isAttachable = false,
		lastItem;
	if (data === "") { // If data is empty string, then the period is not attachable.
		return false;
	}
	data = data.split(".");
	dataLength = data.length;
	lastItem = data[dataLength - 1];
	if (dataLength === 4 || lastItem === "") {
		isAttachable = false;
	} else {
		isAttachable = true;
	}
	return isAttachable;
};

/**
* @method _validateData
* @private
*/
app.gui.controls.SettingsInputText.prototype._validateData = function _validateData() {
    this.logEntry();
	var data = this._inputText.textContent.replace(/ +/g, ""), // remove white spaces in the string
		octet = '(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])',
		ip = '(?:' + octet + '\\.){3}' + octet,
		ipRE = new RegExp('^' + ip + '$');
	return ipRE.test(data);
};

/**
 * @method _attachPeriod
 */
app.gui.controls.SettingsInputText.prototype._attachPeriod = function _attachPeriod() {
	this.logEntry();
	if (this._isEditable && this._isperiodAttachable()) {
		var str = ".";
		this._inputText.textContent = this._inputText.textContent + str;
	}
	this.logExit();
};

/**
 * @method _isautoUpdateDot
 */
app.gui.controls.SettingsInputText.prototype._isautoUpdateDot = function _isautoUpdateDot() {
	this.logEntry();
	var data = this._inputText.textContent.replace(/ +/g, ""),
		dataLength,
		isAutoUpdate,
		lastItemLength;
	data = data.split(".");
	dataLength = data.length;
	if (dataLength >= 4) { // If data length is 4, that means there are 3 periods already available in the data. hence no need to attach.
		isAutoUpdate = false;
	} else {
		lastItemLength = data[dataLength - 1].length;
		if (lastItemLength === 3) { // only if user entered
			isAutoUpdate = true;
		} else {
			isAutoUpdate = false;
		}
	}
	return isAutoUpdate;
};

/**
 * @method _editText
 */
app.gui.controls.SettingsInputText.prototype._editText = function _editText(str) {
	this.logEntry();
	if (this._isDataLimitReached()) { // if data limit is reached, then clear the text so that user can enter the data again.
		this._clearText();
	}
	if (this._isEditable) {
   		if (this._isautoUpdateDot()) {
			this._attachPeriod();
		}
		this._inputText.textContent = this._inputText.textContent + str;
	}
	this.logExit();
};


/**
 * @method _backspaceText
 */
app.gui.controls.SettingsInputText.prototype._backspaceText = function _backspaceText() {
	this.logEntry();
	if (this._isEditable && this._inputText.textContent.length > 0) {
		this._inputText.textContent = this._inputText.textContent.substr(0, this._inputText.textContent.length - 1);
	}
	this.logExit();
};



/**
 * @method createdCallback
 */
app.gui.controls.SettingsInputText.prototype._clearText = function _clearText() {
	this.logEntry();
	this._inputText.textContent = "";
	this.logExit();
};

/**
 * @method createdCallback
 */
app.gui.controls.SettingsInputText.prototype._resetToDefault = function _resetToDefault() {
	this.logEntry();
	this._inputText.textContent = this._defaultValue;
	this.logExit();
};

/**
 * @method _SaveToConfig
 */
app.gui.controls.SettingsInputText.prototype._SaveToConfig = function _SaveToConfig(isValidData) {
	this.logEntry();
	var value = "0.0.0.0";
	if (isValidData) {
		value = this.innerText;
	}
	switch (this.name) {
		case "ipAddress"     :
			$config.saveConfigValue("settings.tcpIp.IpAddress", value);
			break;
       	case "subnetMask"    :
 			$config.saveConfigValue("settings.tcpIp.subnetMask", value);
			break;
        case "defaultGateway":
			$config.saveConfigValue("settings.tcpIp.defaultGateway", value);
			break;
		case "primaryDns"    :
			$config.saveConfigValue("settings.tcpIp.primaryDns", value);
			break;
       	case "secondaryDns"  :
			$config.saveConfigValue("settings.tcpIp.secondaryDns", value);
            break;
		default:
			break;
	}
	this.logExit();
};

/**
 * @method createdCallback
 */
app.gui.controls.SettingsInputText.prototype._populate = function _populate(data) {
	this.logEntry();
	this.itemData = data;
	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SettingsInputText.prototype, "isEditable", {
	get: function get () {
		return this._isEditable;
	},
	set: function set (isEdit) {
		this._isEditable = isEdit;
	}
});

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SettingsInputText.prototype, "itemData", {
	get: function get() {
        return this._data;
    },
    set: function set(data) {
        this._data = data;
        this._inputText.textContent = data.data.get();
	}
});

/**
 * @method createdCallback
 */
app.gui.controls.SettingsInputText.prototype._setData = function _setData(data) {
	this.logEntry();
	this._data = data;
	this.logExit();
};


/**
 * @method _onKeyDown
 */
app.gui.controls.SettingsInputText.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	var isValidData = this._validateData(),
		isHandle = false;
	this._isInEditMode = this._defaultValue.localeCompare(this._inputText.textContent); // to indentify whether the particular item is in edit mode or not
	switch (e.key) {
		case "Back":
			if (isValidData === false) { // display the error message if the data is invalid on press of back button
				this._showErrorDialog();
				this._clearText();
				this._resetToDefault();
			}
			isHandle = isValidData;
			break;
		case "ArrowLeft":
			this._isEditable = true;
			this._backspaceText();
			break;
		case "ArrowRight":
			this._attachPeriod();
			break;
		case "Ok":
		case "Enter":
			if (isValidData) {
				this._SaveToConfig(true);
			} else {
				this._showErrorDialog();
				this._clearText();
				this._resetToDefault();
			}
			break;
		case "ArrowDown":
		case "ArrowUp":
			if (isValidData) {
				this._SaveToConfig(true);
			} else {
				this._showErrorDialog();
				this._clearText();
				this._resetToDefault();
			}
			break;
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
		case "0":
			this._isEditable = true;
			if (this._isInEditMode === 0) {
				this._clearText();
			}
			this._editText(e.key);
			break;
		default:
			break;
	}
	return isHandle;
};
