app.views.HomeSettings = function HomeSettings () {};
o5.gui.controls.Control.registerAppControl(app.views.HomeSettings, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 */
app.views.HomeSettings.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    $util.ControlEvents.on("app-home-settings:settingsGridMenu", [ "exit:up", "back" ], function (/* list */) {
        $util.ControlEvents.fire("app-home", "focus");
        $util.ControlEvents.fire("app-home-settings:settingsGridMenu", "reset");
    }, this);
    $util.ControlEvents.on("app-home-settings:settingsGridMenu", "fetch", function (/* list */) {
        var me = this;
        $util.ControlEvents.fire("app-home", "dialog", "");
        clearTimeout(this._spinnerTimer);
        this._spinnerTimer = setTimeout(function () {
        $util.ControlEvents.fire("app-home", "dialog", "loading");
            me._spinnerTimer = null;
        }, 500);
    }, this);
    $util.ControlEvents.on("app-home-settings:settingsGridMenu", "populated", function (list) {
        clearTimeout(this._spinnerTimer); /* we had a response */
        $util.ControlEvents.fire("app-home", "dialog", list.itemNb > 0 ? "" : "empty");
    }, this);

    this.onload = this._onLoad;
    this.onshow = this._onShow;
    this.onhide = this._onHide;
    this.onfocus = this._onFocus;
    this.onblur = this._onBlur;
    this.onkeydown = this._onKeyDown;

    this.logExit();
};

/**
 * @method attachedCallback
 */
app.views.HomeSettings.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    $util.Events.fire("app:view:attached", "home-settings");
    this.logExit();
};

/**
 * @method _onLoad
 */
app.views.HomeSettings.prototype._onLoad = function _onLoad () {
    this.logEntry();
    this.logExit();
};


/**
 * @method _onShow
 */
app.views.HomeSettings.prototype._onShow = function _onShow () {
    this.logEntry();
    $util.ControlEvents.fire("app-home-settings:settingsGridMenu", "enable");
    $util.ControlEvents.fire("app-home-settings:settingsGridMenu", "clear");
    $util.ControlEvents.fire("app-home-settings:settingsGridMenu", "fetch");
    $util.ControlEvents.fire("app-home-settings:settingsGridMenu", "reset");
    this.logExit();
};

/**
 * @method _onHide
 */
app.views.HomeSettings.prototype._onHide = function _onHide () {
    this.logEntry();
    $util.ControlEvents.fire("app-home-settings:settingsGridMenu", "clear");
    $util.ControlEvents.fire("app-home-settings:settingsGridMenu", "disable");
    $util.ControlEvents.fire("app-home", "dialog", "");
    this.logExit();
};

/**
 * @method _onFocus
 */
app.views.HomeSettings.prototype._onFocus = function _onFocus () {
    this.logEntry();
    $util.ControlEvents.fire("app-home-settings:settingsGridMenu", "focus");
    //this._BgSolid.hidden = $config.getConfigValue("settings.tv.guide.background.vision");
    this.logExit();
};

/**
 * @method _onBlur
 */
app.views.HomeSettings.prototype._onBlur = function _onBlur () {
    this.logEntry();
    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.views.HomeSettings.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false;

    if (handled === true) {
        e.stopImmediatePropagation();
        e.preventDefault();
    } else {
        $util.ControlEvents.fire("app-home:ctaHomeMenu", "key:down", e);
    }
    this.logExit();
};


