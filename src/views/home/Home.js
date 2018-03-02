app.views.Home = function Home () {};
o5.gui.controls.Control.registerAppControl(app.views.Home, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 */
app.views.Home.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this._themeName = $config.getConfigValue("settings.view.theme");
    this._BgSolid = this.querySelector('#BgSolid');
    this._muteState = "";
    // app-home
    $util.ControlEvents.on("app-home", "fetch", function () {

        this._BgSolid.hidden = $config.getConfigValue("settings.tv.guide.background.vision");

        this._themeName = $config.getConfigValue("settings.view.theme");

        if (this._themeName === "Rel8") {
            this._homeMenu = this.querySelector('#portalMenu');
            this._tileView = this.querySelector('#carouselView');

            $util.ControlEvents.fire("app-home:homeNavMenu", "disable");
            $util.ControlEvents.fire("app-home:portalMenu", "enable");
            $util.ControlEvents.fire("app-home:portalMenu", "fetch");
        } else {
            this._homeMenu = this.querySelector('#homeNavMenu');
            this._tileView = this.querySelector('#tileView');

            $util.ControlEvents.fire("app-home:portalMenu", "disable");
            $util.ControlEvents.fire("app-home:homeNavMenu", "enable");
            $util.ControlEvents.fire("app-home:homeNavMenu", "fetch");
        }

        this._focusedElem = null;
        this._muteState = o5.platform.system.Device.getMuteState();
    }, this);
    $util.ControlEvents.on("app-home", "focus", function () {
        this.focus();
    }, this);
    $util.ControlEvents.on("app-home", "dialog", function (c) {
        if (c) {
            this._tilePage.className = "oxygen-transition-none-prepareDisplay oxygen-transition-none-bringIn " + c;
        } else {
            this._tilePage.className = "oxygen-transition-none-bringOut oxygen-transition-none-hide";
        }
    }, this);

    // portalMenu, homeNavMenu
    $util.ControlEvents.on([ "app-home:homeNavMenu", "app-home:portalMenu" ], "focus", function () {
        $util.ControlEvents.fire("app-home:ctaHomeMenu", "clear");
    }, this);
    $util.ControlEvents.on([ "app-home:homeNavMenu", "app-home:portalMenu" ], "focussed", function () {
        this.classList.remove("upMenu");
    }, this);
    $util.ControlEvents.on([ "app-home:homeNavMenu", "app-home:portalMenu" ], "blurred", function () {
        this.classList.add("upMenu");
    }, this);
    $util.ControlEvents.on([ "app-home:portalMenu", "app-home:homeNavMenu" ], "populated", function (list) {
        list.fireControlEvent("focus");
    }, this);
    $util.ControlEvents.on([ "app-home:portalMenu", "app-home:homeNavMenu" ], "change", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            node = selectedItem ? selectedItem.itemData : null,
            name = node ? node.displayName.toLowerCase() : null;
        if (name) {
            $util.ControlEvents.fire("app-home:homeMenuTabs", "select", name);
            this.dataset.tab = name;
        }
        if (node) {
            $util.ControlEvents.fire("app-home:homeSubNavMenu", "populate", node); // tell submenu to update
        } else {
            $util.ControlEvents.fire("app-home", "dialog", "empty");
        }
    }, this);
    $util.ControlEvents.on([ "app-home:portalMenu", "app-home:homeNavMenu" ], "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            node = selectedItem ? selectedItem.itemData : null;
        if (node) {
            this._BgSolid.hidden = $config.getConfigValue("settings.tv.guide.background.vision");
            $util.ControlEvents.fire("app-home:ctaHomeMenu", "fetch", node);
        }
        $util.ControlEvents.fire("app-home:homeMenuTabs", "focus");
    }, this);

    this._tilePage = this.querySelector('#tilePage');

    this._focusedElem = null; // focused element
    this._spinnerTimer = null;

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
app.views.Home.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    $util.Events.fire("app:view:attached", "home");
    this.logExit();
};

/**
 * @method _onLoad
 */
app.views.Home.prototype._onLoad = function _onLoad () {
    this.logEntry();
    this.logExit();
};

/**
 * @method _onShow
 */
app.views.Home.prototype._onShow = function _onShow () {
    this.logEntry();
    $util.Events.fire("clock:hide");
    if ($config.getConfigValue("settings.tv.guide.background.audio") === "backgroundVision") {
        if (!$config.getConfigValue("settings.tv.guide.background.vision")) {
            o5.platform.system.Device.setMuteAudio();
        }
    } else if ($config.getConfigValue("settings.tv.guide.background.audio") === "off") {
        o5.platform.system.Device.setMuteAudio();
    }
    if (!this._muteState && $config.getConfigValue("settings.tv.guide.background.audio") === "backgroundVision" && $config.getConfigValue("settings.tv.guide.background.vision")) {
        o5.platform.system.Device.setUnmuteAudio();
    }
    this.logExit();
};

/**
 * @method _onHide
 */
app.views.Home.prototype._onHide = function _onHide () {
    this.logEntry();
    if (!this._muteState) {
        o5.platform.system.Device.setUnmuteAudio();
    }
    this.logExit();
};

/**
 * @method _onFocus
 */
app.views.Home.prototype._onFocus = function _onFocus () {
    this.logEntry();
    if (this._focusedElem) {
      this._focusedElem.focus();
    } else {
      $util.ControlEvents.fire("app-home:" + this._homeMenu.id, "focus");
    }
    this._BgSolid.hidden = $config.getConfigValue("settings.tv.guide.background.vision");

    this.logExit();
};

/**
 * @method _onBlur
 */
app.views.Home.prototype._onBlur = function _onBlur () {
    this.logEntry();
        //this._focusedElem = document.activeElement;
    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.views.Home.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false;

    switch (e.key) {
        case "Back":
        case "backspace":
            $util.Events.fire("app:navigate:to:default");
            handled = true;
            break;
        default:
                break;
    }

    if (handled === true) {
        e.stopImmediatePropagation();
        e.preventDefault();
    } else {
        $util.ControlEvents.fire("app-home:ctaHomeMenu", "key:down", e);
    }
    this.logExit();
};


