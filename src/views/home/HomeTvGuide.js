app.views.HomeTvGuide = function HomeTvGuide () {};
o5.gui.controls.Control.registerAppControl(app.views.HomeTvGuide, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 */
app.views.HomeTvGuide.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    $util.ControlEvents.on("app-home-tv-guide:epgGridMenu", [ "exit:up", "back" ], function (/* list */) {
        $util.ControlEvents.fire("app-home", "focus");
        $util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "reset");
    }, this);
    $util.ControlEvents.on("app-home-tv-guide:epgGridMenu", "fetch", function (/* list */) {
        var me = this;
        $util.ControlEvents.fire("app-home", "dialog", "");
        clearTimeout(this._spinnerTimer);
        this._spinnerTimer = setTimeout(function () {
        $util.ControlEvents.fire("app-home", "dialog", "loading");
            me._spinnerTimer = null;
        }, 500);
    }, this);
    $util.ControlEvents.on("app-home-tv-guide:epgGridMenu", "populated", function (list) {
        clearTimeout(this._spinnerTimer); /* we had a response */
        $util.ControlEvents.fire("app-home", "dialog", list.itemNb > 0 ? "" : "empty");
    }, this);

    $util.ControlEvents.on("app-home-tv-guide:ctaHomeMenu", "ctaSortListings", function () {
        $util.ControlEvents.fire("app-guide", "sortListings");
        $util.Events.fire("app:navigate:to", "guide");
        $util.ControlEvents.fire("app-guide:epgListingsProgList-List", "fetch", "init");
        $util.ControlEvents.fire("app-guide:epgListingsSortListDateList", "populate", 1);
    }, this);

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
app.views.HomeTvGuide.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    $util.Events.fire("app:view:attached", "home-tv-guide");
    this.logExit();
};

/**
 * @method _onLoad
 */
app.views.HomeTvGuide.prototype._onLoad = function _onLoad () {
    this.logEntry();
    this.logExit();
};


/**
 * @method _onShow
 */
app.views.HomeTvGuide.prototype._onShow = function _onShow () {
    this.logEntry();
    $util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "enable");
    $util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "clear");
    $util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "fetch");
    $util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "reset");
    this.logExit();
};

/**
 * @method _onHide
 */
app.views.HomeTvGuide.prototype._onHide = function _onHide () {
    this.logEntry();
    $util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "clear");
    $util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "disable");
    $util.ControlEvents.fire("app-home", "dialog", "");
    this.logExit();
};

/**
 * @method _onFocus
 */
app.views.HomeTvGuide.prototype._onFocus = function _onFocus () {
    this.logEntry();
    $util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "focus");
    //this._BgSolid.hidden = $config.getConfigValue("settings.tv.guide.background.vision");
    this.logExit();
};


/**
 * @method _onBlur
 */
app.views.HomeTvGuide.prototype._onBlur = function _onBlur () {
    this.logEntry();
    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.views.HomeTvGuide.prototype._onKeyDown = function _onKeyDown (e) {
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


