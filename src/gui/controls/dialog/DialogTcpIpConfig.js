/**
 * @class app.gui.controls.DialogTcpIpConfig
 */

app.gui.controls.DialogTcpIpConfig = function DialogTcpIpConfig () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogTcpIpConfig, app.gui.controls.HtmlDialogContainer);

/**
 * @method createdCallback
 */
app.gui.controls.DialogTcpIpConfig.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._tcpIPList = this.querySelector('#tcpIPConfigList');
	$util.Translations.update(this);
	$util.ControlEvents.on(":tcpIPConfigDialog", "setIndex", this._setIndex, this);
	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.DialogTcpIpConfig.prototype._populate = function _populate () {
    this.logEntry();
    var me = this;
    this.superCall();
    this._tcpIPList.fireControlEvent("populate");
    setTimeout(function() {
	 			me._tcpIPList.fireControlEvent("focus");
	 		}, 1);
    this.logExit();
};

/**
 * @method _setIndex
 */
app.gui.controls.DialogTcpIpConfig.prototype._setIndex = function _setIndex (index) {
    this.logEntry();
   	this._tcpIPList.fireControlEvent("select", index);
	this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.DialogTcpIpConfig.prototype._focus = function _focus () {
    this.logEntry();
    this._tcpIPList.fireControlEvent("focus");
    this.focus();
    this.logExit();
};

/**
 * @class app.gui.controls.dialogTcpIpList
 */

app.gui.controls.DialogTcpIpList = function DialogTcpIpList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogTcpIpList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 */
app.gui.controls.DialogTcpIpList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this.orientation = "vertical";
    this._config = this.dataset.config || null;
    this._configObj = null;
    this.logExit();
};

/**
 * @method createdCallback
 */
app.gui.controls.DialogTcpIpList.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();
	this.superCall();
    this.updateOnNetworkStateChange = function () {
    	this._updateManualConfigDataonNetworkUpdate();
    };
	o5.platform.system.Network.registerOnStatusChangedListener(this.updateOnNetworkStateChange);
	this.logExit();
};

/**
 * @method createdCallback
 */
app.gui.controls.DialogTcpIpList.prototype._focus = function _focus () {
	this.logEntry();
	this.focus();
	this.logExit();
};


/**
 * @method _populate
 * simply populate the DOM with all items
 */
app.gui.controls.DialogTcpIpList.prototype._populate = function _populate () {
	this.logEntry();
     var objs = this._config ? this._config.split('.') : [],
      configObj = null,
      arr;

    this.fireControlEvent("clear");

    objs.forEach(function(obj) {
        if (configObj) { // concat with previous
            if (configObj[obj]) {
                configObj = configObj[obj];
            }
        } else if (window[obj]) { // first one
            configObj = window[obj];
        }
    });
    if (configObj && configObj.getMenu) {
        arr = configObj.getMenu();
        this._configObj = configObj;
    }
    this.superCall(arr);
    this.fireControlEvent("select", 0);

	this.logExit();
};

/**
 * @method _isDataReadyForManualIpRenewal
 */
app.gui.controls.DialogTcpIpList.prototype._isDataReadyForManualIpRenewal = function _isDataReadyForManualIpRenewal() {
	this.logEntry();
	var isDataReady = false,
	ipAddress = $config.getConfigValue("settings.tcpIp.IpAddress"),
	subnetMask = $config.getConfigValue("settings.tcpIp.subnetMask"),
	defaultGateway = $config.getConfigValue("settings.tcpIp.defaultGateway"),
	primaryDns = $config.getConfigValue("settings.tcpIp.primaryDns"),
	secondaryDns = $config.getConfigValue("settings.tcpIp.secondaryDns");
	if (ipAddress === "0.0.0.0" || subnetMask === "0.0.0.0" || defaultGateway === "0.0.0.0" || primaryDns === "0.0.0.0" || secondaryDns === "0.0.0.0") {
		isDataReady  = false;
	} else {
		isDataReady  = true;
	}
	return isDataReady;
};

/**
 * @method _updateManualConfigDataonNetworkUpdate
 */
app.gui.controls.DialogTcpIpList.prototype._updateManualConfigDataonNetworkUpdate = function _updateManualConfigDataonNetworkUpdate() {
	this.logEntry();
	if (o5.platform.system.Network.isDhcpEnabled === false) {
		var connectionStatus = $service.settings.IpNetwork.getNetworkConnectionStatus(),
			ipInterface = o5.platform.system.Network.getInterfaceByType(connectionStatus.interfaceType),
			ipAddress = o5.platform.system.Network.getIpAddress(ipInterface),
			subnetMask = o5.platform.system.Network.getSubnetMask(ipInterface),
			gateway = o5.platform.system.Network.getGateway(ipInterface),
			dnsServers = o5.platform.system.Network.getDnsServers(ipInterface);
		$config.saveConfigValue("settings.tcpIp.IpAddress", ipAddress);
		$config.saveConfigValue("settings.tcpIp.subnetMask", subnetMask);
		$config.saveConfigValue("settings.tcpIp.defaultGateway", gateway);
		$config.saveConfigValue("settings.tcpIp.primaryDns", dnsServers[0]);
		$config.saveConfigValue("settings.tcpIp.secondaryDns", dnsServers[1]);
	}
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.DialogTcpIpList.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false,
        child;
    switch (e.key) {
        case "ArrowRight":
          if (this.selectedItem && this.selectedItem.type === "settingsInputText") {
                child = this.selectedItem.querySelector("app-settings-input-text");
    		if (child) { // pass on the key
                    child.onkeydown(e);
                }
           } else if (this.selectedItem && this.selectedItem.type === "settingsToggle") {
                child = this.selectedItem.querySelector("app-settings-toggle-list");
                if (child) { // pass on the key
                    child.onkeydown(e);
                    if (this._configObj) {
                        this._configObj.currentitem[child.id.toString().slice(0, -("Action".length))] = child.selectedItem._data.value;
                    }
                }
            }
            handled = true;
            break;

        case "ArrowLeft":
            if (this.selectedItem && this.selectedItem.type === "settingsToggle") {
                child = this.selectedItem.querySelector("app-settings-toggle-list");
                if (child) { // pass on the key
                    child.onkeydown(e);
                    if (this._configObj) {
                        this._configObj.currentitem[child.id.toString().slice(0, -("Action".length))] = child.selectedItem._data.value;
                    }
                }
            }
            handled = true;
            break;

		case "ArrowDown":
		case "ArrowUp":
          if (this.selectedItem && this.selectedItem.type === "settingsInputText") {
                child = this.selectedItem.querySelector("app-settings-input-text");
    		if (child) { // pass on the key
                    child.onkeydown(e);
                }
           }
           handled = this.superCall(e);
			break;
        case "Enter":
        case "Ok":
          if (this.selectedItem && this.selectedItem.type === "settingsInputText") {
                child = this.selectedItem.querySelector("app-settings-input-text");
    		if (child) { // pass on the key
                    child.onkeydown(e);
                }
			if (this._isDataReadyForManualIpRenewal()) {
				$util.Events.fire("setDhcpStatus", false);
				$util.ControlEvents.fire(":tcpIPConfigDialog", "hide");
				$util.ControlEvents.fire("app-settings:settingsDHCPRenewal", "show", $util.constants.INTERNET_STATUS_OVERLAY_DISPLAY_MODE.TCP_IP);
				}
            }
            handled = true;
            break;
        case "Back":
          if (this.selectedItem && this.selectedItem.type === "settingsInputText") {
                child = this.selectedItem.querySelector("app-settings-input-text");
    		if (child) { // pass on the key
                    handled = child.onkeydown(e);
                }
			}
			if (handled === true || (this.selectedItem && this.selectedItem.type === "settingsToggle")) {
				$util.ControlEvents.fire(":tcpIPConfigDialog", "hide");
				$util.ControlEvents.fire("app-settings:settingsNetworkDetailsViewList", "focus");
			}
 	         handled = true;
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
          if (this.selectedItem && this.selectedItem.type === "settingsInputText") {
                child = this.selectedItem.querySelector("app-settings-input-text");
	    		if (child) { // pass on the key
	                    child.onkeydown(e, this.selectedItem.itemData.data.get());
	                }
            	handled = true;
            }
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



/**
 * @class app.gui.controls.dialogTcpIpListItem
 */
app.gui.controls.DialogTcpIpListItem = function DialogTcpIpListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogTcpIpListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.DialogTcpIpListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "focused";
    this._type = "";
    this._label = this.querySelector('.tcpIpListItemLabel');
    this._value = this.querySelector('.tcpIpListItemValue');
    this.logExit();
};

Object.defineProperty(app.gui.controls.DialogTcpIpListItem.prototype, "type", {
    get: function get () {
        return this._type;
    },
    set: function set (type) {
        this._type = type;
      }
   });

/**
 * @property selectable
 */
Object.defineProperty(app.gui.controls.DialogTcpIpListItem.prototype, "selectable", {
    get: function get () {
        if (this.classList.length === 0) {
            return true;
        } else if (this._hiddenClass && this.classList.contains(this._hiddenClass)) {
            return false;
        } else if (this._emptyClass && this.classList.contains(this._emptyClass)) {
            return false;
        }
        if (this.classList.contains("unselectable")) {
            return false;
        }
        return true;
    }
});


/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.DialogTcpIpListItem.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        this._data = data;
        var tmpl, item = null;

        if (data) {
            this._label.innerHTML = data.text;
            this.type = data.data.type;
            tmpl = document.getElementById(data.data.type + "Template");
            if (tmpl) {
                this._value.appendChild(tmpl.content.cloneNode(true));
            }
			if (data.data.type !== "settingsToggle") {
                this.classList.add("noArrows");// only toggle has arrows
            }
             if (data.data.type === "settingsToggle") {
                item = this.querySelector("app-settings-toggle-list");
            } else if (data.data.type === "settingsInputText") {
            	item = this.querySelector("app-settings-input-text");
            	
            }
            if (data.data.isSelectable === false) {
                this.classList.add("unselectable");
            }
            if (item) {
                item.id = data.id + "Action";
                item.name = data.id;
                item.index = this.itemIndex;

                setTimeout(function() { // give it some time to attach
                    if (item.fireControlEvent) {
                        item.fireControlEvent("show");
                       // item.fireControlEvent("populate", data.data.get(), data.data.getSelectedIndex());
                        if (data.data.type === "settingsInputText") {
                        	 item.fireControlEvent("populate", data);
    	
                        } else if (data.data.type === "settingsToggle") {
                        	 item.fireControlEvent("populate", data.data.get(), data.data.getSelectedIndex());
                        }
                        if (data.data.events) { // register for change after populate so we only get notified when it actually changes
                            item.onControlEvent("change", function(list) {
                                var selectedItem = list ? list.selectedItem : null,
                                    itemData = selectedItem ? selectedItem.itemData : null;
                                    this.ownerDocument.activeElement._configObj.currentitem[data.id] = itemData.value;
									o5.platform.system.Preferences.set("settings.tcpIp.IpConfig", itemData.value);
                                    if (itemData.value === true) { // If the Selected option is DHCP, then diirectly fire an event to renew the ip through o5
										//$util.ControlEvents.fire(":setDhcpStatus");
                                    }
    								$util.ControlEvents.fire(":tcpIpContainer", "populate");
                            });
                        }
                    }
                }, 100);
            }
            this.dataset.id = data.id;
 
        } else {
            this.textContent = "";
            this.classList.add("dialogTcpIpList-empty");
        }
    }
});
