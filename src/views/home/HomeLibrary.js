app.views.HomeLibrary = function HomeLibrary () {};
o5.gui.controls.Control.registerAppControl(app.views.HomeLibrary, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 */
app.views.HomeLibrary.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

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
app.views.HomeLibrary.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    $util.Events.fire("app:view:attached", "home-library");
    this.logExit();
};

/**
 * @method _onLoad
 */
app.views.HomeLibrary.prototype._onLoad = function _onLoad () {
    this.logEntry();
    this.logExit();
};


/**
 * @method _onShow
 */
app.views.HomeLibrary.prototype._onShow = function _onShow () {
    this.logEntry();
        $util.ControlEvents.fire("app-home", "dialog", "empty");
    this.logExit();
};

/**
 * @method _onHide
 */
app.views.HomeLibrary.prototype._onHide = function _onHide () {
    this.logEntry();
        $util.ControlEvents.fire("app-home", "dialog", "");
    this.logExit();
};

/**
 * @method _onFocus
 */
app.views.HomeLibrary.prototype._onFocus = function _onFocus () {
    this.logEntry();
        $util.ControlEvents.fire("app-home", "focus");
    this.logExit();
};


/**
 * @method _onBlur
 */
app.views.HomeLibrary.prototype._onBlur = function _onBlur () {
    this.logEntry();
    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.views.HomeLibrary.prototype._onKeyDown = function _onKeyDown (e) {
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


