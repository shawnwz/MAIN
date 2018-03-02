/**
 * @class app.gui.controls.SettingsWifiConnectionList
 */

app.gui.controls.SettingsWifiConnectionList = function SettingsWifiConnectionList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsWifiConnectionList, app.gui.controls.HtmlFlexList);

/**
 * @method createdCallback
 */
app.gui.controls.SettingsWifiConnectionList.prototype.createdCallback = function createdCallback() {
  this.logEntry();
  this.superCall();
  this.orientation = "vertical";
  this._scrollbarType = "item";
  this._timer = null;
  $util.ControlEvents.on(":keyboardBg", "keyboard:done", function (data) {
	if (data.type === "wifiPassword") {
		$util.Events.fire("connectToWifi", this.selectedItem.itemData, data.data);
		$util.ControlEvents.fire("app-settings:settingsWifiConnect", "show", { mode: "normal", status: "connecting" });
	}
    }, this);

   $util.Events.on("wifiConnectSuccess", function(data) {
		$util.ControlEvents.fire("app-settings:settingsWifiConnect", "show", { mode: "normal", status: "connected", name: data.ssid });
		this.fireControlEvent("populate", this.itemData);
   }, this);

   $util.Events.on("wifiConnectFailure", function() {
   		$util.ControlEvents.fire("app-settings:settingsWifiConnect", "show", { mode: "normal", status: "fail" });
    }, this);
    // refresh logic
    //this.onControlEvent("visible", this._startRefreshing);
    //this.onControlEvent("hidden", this.__stopRefreshing);
    
  this.logExit();
};

/**
 * @method _sort
 * sort the list in order of signal strength
 */
app.gui.controls.SettingsWifiConnectionList.prototype._sort = function _sort () {
  this.logEntry();
  var connectedSSID = o5.platform.system.Preferences.get($util.constants.WIFI_CONFIG_PATH.SSID, true);
  this._data.sort(function(a, b) {
    var val = 0; // equal
    if (a.ssid === connectedSSID) {
    	return -1;
    }
    if (b.ssid === connectedSSID) {
    	return 1;
    }
    if (b.quality !== a.quality) {
      val = b.quality - a.quality; // highest quality first
    } else if (b.ssid !== a.ssid) {
      val = (a.ssid < b.ssid) ? -1 : 1; // ssid alphabetically
    }
    return val;
  });

/*
  // for testing only: add a new ssid with random quality every 5 secs
  var me = this;
  setTimeout(function() {
    var q = Math.floor(Math.random() * 100);
    me.fireControlEvent("append", [{ encryptMode: 3, key: "Nagra_Opentv_AP", protocol: 8, quality: q, security: 2, ssid: "a"+Date.now()  }]);
  }, 1000);
*/
  this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.SettingsWifiConnectionList.prototype._onKeyDown = function _onKeyDown(e) {
  this.logEntry();
  var handled = false;
  this._scrollbarType = "item";

  switch (e.key) {
    case "Ok":
    case "Enter":
     if (this.selectedItem.isSecure) {
     	$util.ControlEvents.fire(":keyboardBg", "show");
      	$util.ControlEvents.fire(":keyboardBg", "populate", app.gui.controls.KeyboardConfig.wifiPassword);
      	$util.ControlEvents.fire(":keyboardBg", "focus");
     } else {
     	$util.Events.fire("connectToWifi", this.selectedItem.itemData);
     	$util.ControlEvents.fire("app-settings:settingsWifiConnect", "show", { mode: "normal", status: "connecting" });
     }
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
 * @method _startRefreshing
 */
// app.gui.controls.SettingsWifiConnectionList.prototype._startRefreshing = function _startRefreshing() {
	// if (this._timer === null) {
		// var me = this;
		// this._timer = setInterval(function() {
			// $service.settings.WifiService.getAvalibaleWifiNetork(function(data) {
        	// me.fireControlEvent("populate", data);
     	// });
    	// }, 60000);
	// }
// };

/**
 * @method _stopRefreshing
 */
// app.gui.controls.SettingsWifiConnectionList.prototype._stopRefreshing = function _stopRefreshing() {
	// clearInterval(this._timer);
	// this._timer = null;
// };

/**
 * @method _populate
 */
// app.gui.controls.SettingsWifiConnectionList.prototype._populate = function _populate(data) {
	// this.logEntry();
	// this.superCall(data);
	// this._startRefreshing();
	// this.logExit();
// };

app.gui.controls.SettingsWifiConnectionList.prototype._updateFooter  = function _updateFooter() {
	var data = {};
	data.id = this.id;
	data.wifiItem = this.selectedItem.itemData;
	$util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", data);
};

/**
 * @method _change
 */
app.gui.controls.SettingsWifiConnectionList.prototype._change = function _change() {
    this.logEntry();
    this.superCall();
    if (this.focused) {
    	this._updateFooter();
    }
    this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.SettingsWifiConnectionList.prototype._focus = function _focus() {
  this.logEntry();
  this.superCall();
  this._updateFooter();
  this.logExit();
};


/**
 * @class app.gui.controls.SettingsWifiConnectionListItem
 */
app.gui.controls.SettingsWifiConnectionListItem = function SettingsWifiConnectionListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsWifiConnectionListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
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
 * @method _getWifiStrength
 */
app.gui.controls.SettingsWifiConnectionListItem.prototype._getWifiStrength = function _getWifiStrength() {
  this.logEntry();

  var quality = 0;

  if (this._data) {
    quality = this._data.quality;
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
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SettingsWifiConnectionListItem.prototype, "itemData", {
  get: function get() {
    return this._data;
  },
  set: function set(wifiDetails) {
    var strength,
    connectedSSID = o5.platform.system.Preferences.get($util.constants.WIFI_CONFIG_PATH.SSID, true);
 
    this._data = wifiDetails;
    this._wifiName.innerText = wifiDetails.ssid;

    strength = this._getWifiStrength();

    switch (strength) {
      case $util.constants.SIGNAL_STRENGTH.POOR:
        this.classList.add("strength1");
        this.classList.remove("strength2");
        this.classList.remove("strength3");
        break;
      case $util.constants.SIGNAL_STRENGTH.AVERAGE:
        this.classList.remove("strength1");
        this.classList.add("strength2");
        this.classList.remove("strength3");
        break;
      case $util.constants.SIGNAL_STRENGTH.HIGH:
        this.classList.remove("strength1");
        this.classList.remove("strength2");
        this.classList.add("strength3");
        break;
      default :
        break;
    }

    if (wifiDetails.ssid === connectedSSID) {
      this.classList.add("connected");
    }
  }
});

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SettingsWifiConnectionListItem.prototype, "isSecure", {
  get: function get() {
  	var isPasswordRequired = false;
  	isPasswordRequired = (this._data && this._data.security !==  $util.constants.SECURITY_TYPE.OPEN);
    return isPasswordRequired;
  }
});
