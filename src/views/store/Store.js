/* Implementation of the Store View, which acts as the view controller */

app.views.Store = function Store() {};
o5.gui.controls.Control.registerAppControl(app.views.Store, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.Store.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.on("app-store", "fetch", function (node) {
		this._node = node;
		$util.ControlEvents.fire("app-store:storeJumpoffList", "clear");
		$util.ControlEvents.fire("app-store:storeJumpoffList", "fetch", node);
		$util.ControlEvents.fire("app-store:storeJumpoffList", "reset");
	}, this);

	$util.ControlEvents.on("app-store:storeJumpoffList", "change", function (list) {
	  // new jumpoff item selected
		var selectedItem = list ? list.selectedItem : null,
			node = selectedItem ? selectedItem.itemData : null;

		if (node) {
			$util.ControlEvents.fire("app-store:storeCarouselList", "fetch", node);
		}
	}, this);

	$util.ControlEvents.on("app-store:storeJumpoffList", "exit:up", function () {
	  	$util.Events.fire("app:navigate:open", "home-menu");
		$util.ControlEvents.fire("app-store:ctaStore", "clear");
	}, this);
	$util.ControlEvents.on("app-store:storeJumpoffList", "back", function () {
	  	$util.Events.fire("app:navigate:open", "home-menu");
		$util.ControlEvents.fire("app-store:ctaStore", "clear");
	}, this);
	$util.ControlEvents.on("app-store:storeJumpoffList", "exit:down", function () {
	  	$util.ControlEvents.fire("app-store:storeCarouselList", "focus");
	}, this);
	$util.ControlEvents.on("app-store:storeCarouselList", "exit:up", function () {
	  	$util.ControlEvents.fire("app-store:storeJumpoffList", "enter:up");
	}, this);
	$util.ControlEvents.on("app-store:storeCarouselList", "fetch", function () {
		var me = this;
		this._tilePage.className = "oxygen-transition-none-bringOut oxygen-transition-none-hide";
		clearTimeout(this._spinnerTimer);
		this._spinnerTimer = setTimeout(function () {
			me._tilePage.className = "oxygen-transition-none-prepareDisplay oxygen-transition-none-bringIn loading";
			me._spinnerTimer = null;
		}, 500);
	}, this);
	$util.ControlEvents.on("app-store:storeCarouselList", "populated", function (list) {
		clearTimeout(this._spinnerTimer); /* we had a response */
		if (list.itemNb > 0) {
			this._tilePage.className = "oxygen-transition-none-bringOut oxygen-transition-none-hide";
		} else {
			this._tilePage.className = "oxygen-transition-none-prepareDisplay oxygen-transition-none-bringIn empty";
		}
	}, this);

	this._tilePage = this.querySelector('#tilePage');
	this._spinnerTimer = null;
	this.onshow = this._onShow;
	this.onfocus = this._onFocus;

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.Store.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	$util.Events.fire("app:view:attached", "store");
	this.logExit();
};

/**
 * @method _onFocus
 */
app.views.Store.prototype._onFocus = function _onFocus() {
	this.logEntry();
	$util.ControlEvents.fire("app-store:storeJumpoffList", "focus");
	$util.ControlEvents.fire("app-store:ctaStore", "fetch", { "component": this._node });
	this.logExit();
};

/**
 * @method _onShow
 */
app.views.Store.prototype._onShow = function _onShow() {
	this.logEntry();
	this.logExit();
};

/**
 * @method _onHide
 * @private
 */
app.views.Store.prototype._onHide = function _onHide () {
	this.logEntry();
	this.className = "oxygen-transition-none-bringOut oxygen-transition-none-hide";
	this.logExit();
};
