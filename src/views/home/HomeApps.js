app.views.HomeApps = function HomeApps () {};
o5.gui.controls.Control.registerAppControl(app.views.HomeApps, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 */
app.views.HomeApps.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    // carouselView
    $util.ControlEvents.on("app-home-apps:carouselView", [ "exit:up", "back" ], function (/* list */) {
        $util.ControlEvents.fire("app-home", "focus");
    }, this);

    $util.ControlEvents.on("app-home-apps:storeMosaicTiles", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            data = selectedItem ? selectedItem.itemData : null;

        if (data) {
            if (data.isCollection === true) {
                this._focusedElem = document.activeElement;
                $util.ControlEvents.fire("app-search-collection", "fetch", data);
                $util.Events.fire("app:navigate:to", "searchCollection");
            } else if (data.isApplication === true) { //@hdk let view deal with this for now
                $util.Events.fire("app:launch", data);
            } else {
                this._focusedElem = document.activeElement;
                $util.ControlEvents.fire("app-synopsis", "fetch", data);
                $util.Events.fire("app:navigate:to", "synopsis");
            }
        }
    }, this);

    $util.Translations.update(this);

    this._themeName = $config.getConfigValue("settings.view.theme");

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
app.views.HomeApps.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();

    if (this._themeName === "Rel8") {
        this._homeMenu = document.querySelector('#portalMenu');
        //this._tileView = this.querySelector('#carouselView');
    } else {
        this._homeMenu = document.querySelector('#homeNavMenu');
        //this._tileView = this.querySelector('#tileView');
    }

    $util.Events.fire("app:view:attached", "home-apps");

    this.logExit();
};

/**
 * @method _onLoad
 */
app.views.HomeApps.prototype._onLoad = function _onLoad () {
    this.logEntry();
    this.logExit();
};


/**
 * @method _onShow
 */
app.views.HomeApps.prototype._onShow = function _onShow () {
    this.logEntry();
    var haveInternet = o5.platform.system.Network.isEthernetAvailable() || o5.platform.system.Network.isWifiAvailable(),
      list = this._homeMenu,
      selectedItem = list ? list.selectedItem : null,
      node = selectedItem ? selectedItem.itemData : null;

//  $util.ControlEvents.fire("app-home-apps:carouselView", "enable");
    $util.ControlEvents.fire("app-home-apps:carouselView", "clear");

    if (haveInternet) {
        if (node) {
            $util.ControlEvents.fire("app-home-apps:carouselView", "fetch", node);
        } else {
            $util.ControlEvents.fire("app-home", "dialog", "empty");
        }
    } else {
        $util.ControlEvents.fire("app-home", "dialog", "noIP");
    }

    this.logExit();
};

/**
 * @method _onHide
 */
app.views.HomeApps.prototype._onHide = function _onHide () {
    this.logEntry();
    $util.ControlEvents.fire("app-home-apps:carouselView", "clear");
    $util.ControlEvents.fire("app-home", "dialog", "");
    this.logExit();
};

/**
 * @method _onFocus
 */
app.views.HomeApps.prototype._onFocus = function _onFocus () {
    this.logEntry();
    if (o5.platform.system.Network.isEthernetAvailable() || o5.platform.system.Network.isWifiAvailable()) {
        $util.ControlEvents.fire("app-home-apps:carouselView", "focus");
    } else {
        $util.ControlEvents.fire("app-home", "focus");
    }
    this.logExit();
};


/**
 * @method _onBlur
 */
app.views.HomeApps.prototype._onBlur = function _onBlur () {
    this.logEntry();
    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.views.HomeApps.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false;

    if (handled === true) {
            e.stopImmediatePropagation();
            e.preventDefault();
    } else {
            $util.ControlEvents.fire("app-home-apps:ctaHomeMenu", "key:down", e);
    }
    this.logExit();
};

