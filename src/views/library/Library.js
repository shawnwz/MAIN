/* Implementation of the Home View, which acts as the view controller */

app.views.Library = function Library() {};
o5.gui.controls.Control.registerAppControl(app.views.Library, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.Library.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.on("app-library", "fetch", function () {
		
	}, this);
	this.onshow = this._onShow;
	this.onfocus = this._onFocus;

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.Library.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	$util.Events.fire("app:view:attached", "Library");
	this.logExit();
};

/**
 * @method _onFocus
 */
app.views.Library.prototype._onFocus = function _onFocus() {
	this.logEntry();
	$util.Events.fire("app:navigate:open", "home-menu");
	this.logExit();
};

/**
 * @method _onShow
 */
app.views.Library.prototype._onShow = function _onShow() {
	this.logEntry();
	this._tilePage = this.querySelector('#tilePage');
	this._tilePage.className = "oxygen-transition-none-prepareDisplay oxygen-transition-none-bringIn empty";
	this.logExit();
};


/**
 * @method _onHide
 * @private
 */
app.views.Library.prototype._onHide = function _onHide () {
	this.logEntry();
	this.className = "oxygen-transition-none-bringOut oxygen-transition-none-hide";
	this.logExit();
};
