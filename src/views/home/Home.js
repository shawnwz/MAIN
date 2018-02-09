/* Implementation of the Home View, which acts as the view controller */

app.views.Home = function Home() {};
o5.gui.controls.Control.registerAppControl(app.views.Home, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.Home.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.on("app-home", "fetch", function (node) {
		this._node = node;
		$util.ControlEvents.fire("app-home:homeJumpoffList", "clear");
		if (o5.platform.system.Network.isEthernetAvailable() || o5.platform.system.Network.isWifiAvailable()) {
			$util.ControlEvents.fire("app-home:homeJumpoffList", "fetch", node);
			$util.ControlEvents.fire("app-home:homeJumpoffList", "reset");
		} else {
			$util.ControlEvents.fire("app-home:homeCarouselList", "clear");
			$util.ControlEvents.fire("app-home:ctaHome", "clear");
			this._tilePage.className = "oxygen-transition-none-prepareDisplay oxygen-transition-none-bringIn noIP";
		}

	}, this);

	$util.ControlEvents.on("app-home:homeJumpoffList", "change", function (list) {
	  // new jumpoff item selected
		var selectedItem = list ? list.selectedItem : null,
			node = selectedItem ? selectedItem.itemData : null;

		if (node) {
			$util.ControlEvents.fire("app-home:homeCarouselList", "fetch", node);
		}
	}, this);

	$util.ControlEvents.on("app-home:homeJumpoffList", "exit:up", function () {
	  	$util.Events.fire("app:navigate:open", "home-menu");
	  	$util.ControlEvents.fire("app-home:ctaHome", "clear");
	}, this);
	$util.ControlEvents.on("app-home:homeJumpoffList", "exit:down", function () {
	  	$util.ControlEvents.fire("app-home:homeCarouselList", "focus");
	}, this);
	$util.ControlEvents.on("app-home:homeJumpoffList", "populated", function () {
	}, this);

	$util.ControlEvents.on("app-home:homeCarouselList", "exit:up", function () {
	  	$util.ControlEvents.fire("app-home:homeJumpoffList", "enter:up");
	}, this);
	$util.ControlEvents.on("app-home:homeCarouselList", "fetch", function () {
		var me = this;
		this._tilePage.className = "oxygen-transition-none-bringOut oxygen-transition-none-hide";
		clearTimeout(this._spinnerTimer);
		this._spinnerTimer = setTimeout(function () {
			me._tilePage.className = "oxygen-transition-none-prepareDisplay oxygen-transition-none-bringIn loading";
			me._spinnerTimer = null;
		}, 500);
	}, this);
	$util.ControlEvents.on("app-home:homeCarouselList", "populated", function (list) {
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

	$util.Translations.update(this);
	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.Home.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	$util.Events.fire("app:view:attached", "home");
	this.logExit();
};

/**
 * @method _onFocus
 */
app.views.Home.prototype._onFocus = function _onFocus() {
	this.logEntry();
	if (o5.platform.system.Network.isEthernetAvailable() || o5.platform.system.Network.isWifiAvailable()) {
		$util.ControlEvents.fire("app-home:homeJumpoffList", "focus");
	} else {
		$util.ControlEvents.fire("app-home-menu:portalMenu", "focus");
	}

	this.logExit();
};

/**
 * @method _onShow
 */
app.views.Home.prototype._onShow = function _onShow() {
	this.logEntry();
	this.logExit();
};

/**
 * @method _onHide
 * @private
 */
app.views.Home.prototype._onHide = function _onHide () {
	this.logEntry();
	$util.ControlEvents.fire("app-home:ctaHome", "clear");
	this.logExit();
};

