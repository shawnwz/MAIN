/**
 * @class app.gui.controls.SettingsChannelMenu
 * @extends o5.gui.controls.Control
 */

app.gui.controls.SettingsWifi = function SettingsWifi() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsWifi, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsWifi.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
    this._wifiMenu = this.querySelector("app-settings-wifi-menu-list");
    this._wifiSelectionList = this.querySelector("app-settings-wifi-connection-list");
    this._networkInfo = this.querySelector("#settingsNetworkIdText");
    this._wpsInfo = this.querySelector("#settingsWPSText");
    this._config = this.dataset.config || null;
    this.onkeydown = this._onKeyDown;
    this.onfocus = this._onFocus;
    this.onblur = this._onBlur;
    this._wifiSelectionData = null;
    this._networkInfo.innerHTML = $util.Translations.translate("settingsWifiJoinOtherNetwork");
    // this code need to change when implement WPS
    this._wpsInfo.children[0].innerHTML = $util.Translations.translate("settingsWifiMenuConnectWPSTitle");
    this._wpsInfo.children[1].children[0].innerHTML = $util.Translations.translate("settingsWifiMenuConnectWPSHelp1");
    this._wpsInfo.children[1].children[1].innerHTML = $util.Translations.translate("settingsWifiMenuConnectWPSHelp2");
    this.logExit();
};

app.gui.controls.SettingsWifi.prototype.attachedCallback = function attachedCallback() {
    this.logEntry();
    this.superCall();
    $util.ControlEvents.on("app-settings:" + this._wifiSelectionList.id, "exit:left", function () {
        this._wifiSelectionList.fireControlEvent("defocus");
        this._wifiMenu.fireControlEvent("focus");
      
    }, this);
    $util.ControlEvents.on("app-settings:" + this._wifiMenu.id, "exit:right", function () {
        if (this._wifiMenu.selectedItem.itemData.id === "wifiNetwork") {
            this._wifiMenu.fireControlEvent("defocus");
            this._wifiSelectionList.fireControlEvent("focus");
        }
    }, this);

     $util.ControlEvents.on([ "app-settings:" + this._wifiMenu.id, "app-settings:" + this._wifiSelectionList.id ], "back", function () {
        this._handleBackKey();
    }, this);
    this.onControlEvent("wifiMenuOptionChange", this._changeMenuOptionHandler);
    this.logExit();
};

app.gui.controls.SettingsWifi.prototype._changeMenuOptionHandler  = function _changeMenuOptionHandler(id) {
    this.logEntry();
    switch (id) {
        case "wifiNetwork":
            this._wifiSelectionList.fireControlEvent("show");
            this._networkInfo.style.display = "none";
            this._wpsInfo.style.display = "none";
            break;
        case "networkId":
            this._wifiSelectionList.fireControlEvent("hide");
            this._networkInfo.style.display = "block";
            this._wpsInfo.style.display = "none";
            break;
        case "wps":
            this._wifiSelectionList.fireControlEvent("hide");
            this._networkInfo.style.display = "none";
            this._wpsInfo.style.display = "block";
            break;
        default:
            break;
    }
    this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SettingsWifi.prototype._fetch = function _fetch() {
    this.logEntry();
    var objs = this._config ? this._config.split('.') : [],
      configObj = null,
      arr;
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
        this.setData(arr);
    }
    this.logExit();
};


/**
 * @method _clear
 * @private
 */
app.gui.controls.SettingsWifi.prototype._clear = function _clear () {
    this.logEntry();
    if (this._wifiSelectionList.focused) {
        this._wifiSelectionList.fireControlEvent("defocus");
    }
    this.logExit();
};

/**
 * @method _handleBackKey
 * @private
 */
app.gui.controls.SettingsWifi.prototype._handleBackKey = function _handleBackKey () {
    this.logEntry();
    this.fireControlEvent("clear");

    if ($util.ScreenHistoryManager.isScrHistoryAvaliable()) {
        $util.Events.fire("scr:back");
    } else {
        $util.Events.fire("app:navigate:back");
        if ($config.getConfigValue("settings.view.theme") === "Rel6") {
            $util.ControlEvents.fire("app-home:homeNavMenu", "enter", document.activeElement);
        } else {
            $util.ControlEvents.fire("app-home:portalMenu", "enter", document.activeElement);
        }
    }
    this.logExit();
};

app.gui.controls.SettingsWifi.prototype._onKeyDown = function _onKeyDown(e) {
    this.logEntry();
    var handled = false;
    switch (e.key) {
        case "Red":
        if (this.id === "favScreen") {
            $service.settings.FavouriteService.removeAllFavouriteChannel();
        } else if (this.id === "blockScreen") {
            $service.settings.ChannelBlocking.unblockAllChannel();
        }
        $util.ControlEvents.fire("app-settings:" + this._channelList.id, "populate", this._channelData);
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

app.gui.controls.SettingsWifi.prototype.setData = function setData(menuData) {
    var wifiOptionMenu = menuData[0].data.get(),
        me = this;
    $util.ControlEvents.fire("app-settings:" + this._wifiMenu.id, "populate", wifiOptionMenu);
    $service.settings.WifiService.getAvalibaleWifiNetork(function(data) {
        $util.ControlEvents.fire("app-settings:" + me._wifiSelectionList.id, "populate", data);
    });
    setTimeout(function() {
                me._wifiMenu.fireControlEvent("focus");
                me._wifiMenu.fireControlEvent("select", 0);
            }, 1);
};
