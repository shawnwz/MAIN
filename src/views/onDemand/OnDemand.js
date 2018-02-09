/* Implementation of the OnDemand View, which acts as the view controller */

app.views.OnDemand = function OnDemand() {};
o5.gui.controls.Control.registerAppControl(app.views.OnDemand, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.OnDemand.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.on("app-on-demand", "fetch", function (node) {
		this._node = node;
		$util.ControlEvents.fire("app-on-demand:OnDemandJumpoffList", "clear");
		if (o5.platform.system.Network.isEthernetAvailable() || o5.platform.system.Network.isWifiAvailable()) {
			$util.ControlEvents.fire("app-on-demand:OnDemandJumpoffList", "fetch", node);
			$util.ControlEvents.fire("app-on-demand:OnDemandJumpoffList", "reset");
		} else {
			$util.ControlEvents.fire("app-on-demand:OnDemandCarouselList", "clear");
			$util.ControlEvents.fire("app-on-demand:ctaOnDemand", "clear");
			this._tilePage.className = "oxygen-transition-none-prepareDisplay oxygen-transition-none-bringIn noIP";
		}
	}, this);

	$util.ControlEvents.on("app-on-demand:OnDemandJumpoffList", "change", function (list) {
	  // new jumpoff item selected
		var selectedItem = list ? list.selectedItem : null,
			node = selectedItem ? selectedItem.itemData : null;

		if (node) {
			$util.ControlEvents.fire("app-on-demand:OnDemandCarouselList", "fetch", node);
		}
	}, this);
	$util.ControlEvents.on("app-on-demand:OnDemandJumpoffList", "exit:up", function () {
	  	$util.Events.fire("app:navigate:open", "home-menu");
		$util.ControlEvents.fire("app-on-demand:ctaOnDemand", "clear");
	}, this);
	$util.ControlEvents.on("app-on-demand:OnDemandJumpoffList", "back", function () {
	  	$util.Events.fire("app:navigate:open", "home-menu");
		$util.ControlEvents.fire("app-on-demand:ctaOnDemand", "clear");
	}, this);
	$util.ControlEvents.on("app-on-demand:OnDemandJumpoffList", "exit:down", function () {
	  	$util.ControlEvents.fire("app-on-demand:OnDemandCarouselList", "focus");
	}, this);
	$util.ControlEvents.on("app-on-demand:OnDemandCarouselList", "exit:up", function () {
	  	$util.ControlEvents.fire("app-on-demand:OnDemandJumpoffList", "enter:up");
	}, this);

	$util.ControlEvents.on("app-on-demand:OnDemandCarouselList", "fetch", function () {
		var me = this;
		this._tilePage.className = "oxygen-transition-none-bringOut oxygen-transition-none-hide";
		clearTimeout(this._spinnerTimer);
		this._spinnerTimer = setTimeout(function () {
			me._tilePage.className = "oxygen-transition-none-prepareDisplay oxygen-transition-none-bringIn loading";
			me._spinnerTimer = null;
		}, 500);
	}, this);
	$util.ControlEvents.on("app-on-demand:OnDemandCarouselList", "populated", function (list) {
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
app.views.OnDemand.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	$util.Events.fire("app:view:attached", "onDemand");
	this.logExit();
};

/**
 * @method _onFocus
 */
app.views.OnDemand.prototype._onFocus = function _onFocus() {
	this.logEntry();
	if (o5.platform.system.Network.isEthernetAvailable() || o5.platform.system.Network.isWifiAvailable()) {
		$util.ControlEvents.fire("app-on-demand:OnDemandJumpoffList", "focus");
		$util.ControlEvents.fire("app-on-demand:ctaOnDemand", "fetch", { "component": this._node });
	} else {
		$util.ControlEvents.fire("app-home-menu:portalMenu", "focus");
	}
	this.logExit();
};

/**
 * @method _onShow
 */
app.views.OnDemand.prototype._onShow = function _onShow() {
	this.logEntry();
	this.logExit();
};


/**
 * @method _onHide
 * @private
 */
app.views.OnDemand.prototype._onHide = function _onHide () {
	this.logEntry();
	//this.className = "oxygen-transition-none-bringOut oxygen-transition-none-hide";
	this.logExit();
};


