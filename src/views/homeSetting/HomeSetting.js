/* Implementation of the HomeSearch View, which acts as the view controller */

app.views.HomeSetting = function HomeSetting() {};
o5.gui.controls.Control.registerAppControl(app.views.HomeSetting, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.HomeSetting.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.on("app-home-setting", "fetch", function () {
		$util.ControlEvents.fire("app-home-setting:settingsGridMenu", "fetch");
	}, this);
	
	$util.ControlEvents.on("app-home-setting:settingsGridMenu", "exit:up", function () {
		$util.Events.fire("app:navigate:open", "home-menu");
	}, this);

	$util.ControlEvents.on("app-home-setting:settingsGridMenu", "back", function () {
		$util.Events.fire("app:navigate:open", "home-menu");
	}, this);
	this.onshow = this._onShow;
	this.onfocus = this._onFocus;

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.HomeSetting.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	$util.Events.fire("app:view:attached", "HomeSetting");
	this.logExit();
};

/**
 * @method _onFocus
 */
app.views.HomeSetting.prototype._onFocus = function _onFocus() {
	this.logEntry();
	$util.ControlEvents.fire("app-home-setting:settingsGridMenu", "focus");
	this.logExit();
};

/**
 * @method _onShow
 */
app.views.HomeSetting.prototype._onShow = function _onShow() {
	this.logEntry();
	$util.ControlEvents.fire("app-home-setting:settingsGridMenu", "show");
	this.logExit();
};

/**
 * @method _onHide
 * @private
 */
app.views.HomeSetting.prototype._onHide = function _onHide () {
	this.logEntry();
	//this.className = "oxygen-transition-none-bringOut oxygen-transition-none-hide";
	this.logExit();
};
