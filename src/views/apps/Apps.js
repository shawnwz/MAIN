/* Implementation of the Apps View, which acts as the view controller */

app.views.Apps = function Apps() {};
o5.gui.controls.Control.registerAppControl(app.views.Apps, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.Apps.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.on("app-apps", "fetch", function (node) {
		this._node = node;
		$util.ControlEvents.fire("app-apps:appsJumpoffList", "clear");
		$util.ControlEvents.fire("app-apps:appsJumpoffList", "fetch", node);
		$util.ControlEvents.fire("app-apps:appsJumpoffList", "reset");
	}, this);

	$util.ControlEvents.on("app-apps:appsJumpoffList", "change", function (list) {
	  // new jumpoff item selected
		var selectedItem = list ? list.selectedItem : null,
			node = selectedItem ? selectedItem.itemData : null;

		if (node) {
			$util.ControlEvents.fire("app-apps:appsCarouselList", "fetch", node);
		}
	}, this);

	$util.ControlEvents.on("app-apps:appsJumpoffList", "exit:up", function () {
	  	$util.Events.fire("app:navigate:open", "home-menu");
		$util.ControlEvents.fire("app-apps:ctaApp", "clear");
	}, this);
	$util.ControlEvents.on("app-apps:appsJumpoffList", "exit:down", function () {
	  	$util.ControlEvents.fire("app-apps:appsCarouselList", "focus");
	}, this);
	$util.ControlEvents.on("app-apps:appsCarouselList", "exit:up", function () {
	  	$util.ControlEvents.fire("app-apps:appsJumpoffList", "enter:up");
	}, this);
	this.onshow = this._onShow;
	this.onfocus = this._onFocus;

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.Apps.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	$util.Events.fire("app:view:attached", "apps");
	this.logExit();
};

/**

 * @method _onFocus
 */
app.views.Apps.prototype._onFocus = function _onFocus() {
	this.logEntry();
	$util.ControlEvents.fire("app-apps:appsCarouselList", "focus");
	$util.ControlEvents.fire("app-apps:ctaApp", "fetch", { "component": this._node });
	this.logExit();
};

/**
 * @method _onShow
 */
app.views.Apps.prototype._onShow = function _onShow() {
	this.logEntry();
	this.logExit();
};
