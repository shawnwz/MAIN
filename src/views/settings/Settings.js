/* Implementation of the Main View, which act as the view controller */
/* eslint no-unused-vars: off */
app.views.Settings = function Settings () {};
o5.gui.controls.Control.registerAppControl(app.views.Settings, o5.gui.controls.View, null, true);


/**
 * @method createdCallback
 * @private
 */
app.views.Settings.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this.scrHisoryMgmt = $util.ScreenHistoryManager;
    //var me = this;

    this._title = this.querySelector("#settingsTitle");
    this._page = null;
    this._list = null;
    this._component = null;
    this._isReturnedFromInstaller = false;
    this._title.textContent = "";
    this._currentScrInfo = {};

    $util.ControlEvents.on("app-settings", "fetch", function (data) {
        var me = this,
        footerData = {};
        if (data) {
            this._currentScrInfo =  JSON.parse(JSON.stringify(data));
            if (data.id) {
                this._page = this.querySelector("#" + data.id);
                this._list = this._page.querySelector("#" + data.id + "List") || this._page.querySelector("#" + data.id + "Grid");
                this._component = this._page.firstElementChild;
                if (this._page) {
                    this._page.className = "oxygen-transition-none-prepareDisplay oxygen-transition-none-bringIn";
                }

                if (this._list) {
                    footerData.id = this.id;
                    $util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", footerData);
                    this._list.onControlEvent("back", function() {
                        me._handleBackKey();
                    });
                    this._list.fireControlEvent("show");
                    this._list.fireControlEvent("fetch", data.items);
                    this._list.fireControlEvent("focus");
                    if (data.focusIndex && data.type === "Table" && !(this._isReturnedFromInstaller)) {
                        this._list.fireControlEvent("select", data.focusIndex.row, data.focusIndex.col);
                    } else if (data.focusIndex && data.type === "List") {
                        this._list.fireControlEvent("select", data.focusIndex);
                    }
                    //this._isReturnedFromInstaller = false;
                }
                //$util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", data);
            }
            if (data.title) {
                this._title.innerHTML = $util.Translations.translate(data.title);
                this._title.dataset.i18n = data.title;
            }
        }
    }, this);

    $util.ControlEvents.on(":dialogPinEntryH", "focus", function (data) {
        if (data && data.id === "parentalControl") {
            $util.ControlEvents.on(":dialogPinEntryH-pin", "readyToNavigate", function() {
                $util.ControlEvents.fire("app-settings", "fetch", { "id": "settingsParentalControlsView", "title": "settingsParentalControlsViewTitle" });
                $util.Events.fire("app:navigate:to", "settings");
             });
        }
    }, this);

    $util.Events.on('homeTransponder:checkSignalStatus', function() {
        var isSignalAvaliable = $service.tuner.Signal.getSignalStatus(),
            _dialog = {};
        if (isSignalAvaliable) {
            // navigate to home trasponder
            $util.ControlEvents.fire("app-settings:homeTransponder", "show");
            $util.Events.fire("scr:navigate:to", { "id": "installerHomeTransView", "title": "installerSatelliteHomeTitle" });

        } else {
       _dialog = {
                    title    : $util.Translations.translate("F0100Title"),
                    text     : $util.Translations.translate("F0100Description"),
                    subText  : "",
                    errorCode: "F0100"
                 };
            $util.ControlEvents.fire(":dialogNoSignal", "show", _dialog);
            $util.ControlEvents.fire(":dialogNoSignal", "focus");
        }
    });

    this.onkeydown = this._onKeyDown;
    this.onfocus = this._onFocus;
    this.onblur = this._onBlur;
    this.onload = this._onLoad;
    this.onshow = this._onShow;
    this.onhide = this._onHide;

    this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.Settings.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    $util.Events.fire("app:view:attached", "settings");
    this.logExit();
};

/**
 * @method _screenActivate
 * @private
 */
app.views.Settings.prototype._screenActivate = function _screenActivate (data) {
    this.logEntry();
    $util.ControlEvents.fire("app-settings", "fetch", data);
    this.logExit();
};

/**
 * @method _screenPassivate
 * @private
 */
app.views.Settings.prototype._screenPassivate = function _screenPassivate (data) {
    this.logEntry();
    if (this._page) {
            this._page.className = "oxygen-transition-none-hide";
            if (this._page.id === "settingsInstallerSettingsMenu") {
                this._isReturnedFromInstaller = true;
            } else {
                this._isReturnedFromInstaller = false;
            }
        }
        if (this._list) {
			this._list.fireControlEvent("hide");
            this._list.removeControlEvent("back");
        }
        $util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", null);
        this._page = null;
        this._list = null;
        this._currentScrInfo = {};
        this._title.textContent = "";
        this.logExit();
};

/**
 * @method getCurrentScreenInfo
 * @private
 */
app.views.Settings.prototype.getCurrentScreenInfo = function getCurrentScreenInfo () {
    this.logEntry();
    var index;
    if (this._list && this._list.type === "Table") {
        index = (this._list.selectedItem) ? { "row": this._list.selectedItem.itemRowIndex, "col": this._list.selectedItem.itemColIndex } : 0;
    } else if (this._list && this._list.type === "List") {
        index = (this._list.selectedItem) ? this._list.selectedItem.itemIndex : 0;
    }
    this._currentScrInfo.focusIndex = index;
    this._currentScrInfo.type = this._list.type;
    this.logExit();
    return this._currentScrInfo;
};

/**
 * @method _onShow
 * @private
 */
app.views.Settings.prototype._onShow = function _onShow () {
    this.logEntry();
    this.className = "oxygen-transition-none-prepareDisplay oxygen-transition-none-bringIn";
    this.scrHisoryMgmt.activate(this);
    $util.Events.on("scr:passivate", this._screenPassivate, this);
    $util.Events.on("scr:activate", this._screenActivate, this);
    if ($config.getConfigValue("settings.tv.guide.background.audio") === "backgroundVision") {
        if (!$config.getConfigValue("settings.tv.guide.background.vision")) {
            o5.platform.system.Device.setMuteAudio();
        }
    } else if ($config.getConfigValue("settings.tv.guide.background.audio") === "off") {
        o5.platform.system.Device.setMuteAudio();
    }
    this.logExit();
};

/**
 * @method _onHide
 * @private
 */
app.views.Settings.prototype._onHide = function _onHide () {
    this.logEntry();
    this.className = "oxygen-transition-none-bringOut oxygen-transition-none-hide";
    this._screenPassivate();
    this.scrHisoryMgmt.passivate();
    $util.Events.remove("scr:passivate", this._screenPassivate);
    $util.Events.remove("scr:activate", this._screenActivate);
    this.logExit();
};

/**
 * @method _onLoad
 * @private
 */
app.views.Settings.prototype._onLoad = function _onLoad () {
    this.logEntry();
    this.logExit();
};

/**
 * @method _onFocus
 * @private
 * @param {Object} e
 */
app.views.Settings.prototype._onFocus = function _onFocus () {
    this.logEntry();
    if (this._list) {
        this._list.fireControlEvent("focus");
    }
    this.logExit();
};

/**
 * @method _onBlur
 * @private
 * @param {Object} e
 */
app.views.Settings.prototype._onBlur = function _onBlur () {
    this.logEntry();
    this.logExit();
};

/**
 * @method _handleBackKey
 * @private
 */
app.views.Settings.prototype._handleBackKey = function _handleBackKey () {
    this.logEntry();
    if (this.scrHisoryMgmt.isScrHistoryAvaliable()) {
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

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.views.Settings.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    switch (e.key) {
        case "Back":
            this._handleBackKey();
            break;
        default:
         // $util.ControlEvents.fire("app-settings:ctaSettingsMenu", "key:down", e);
            break;
    }
    this.logExit();
};

