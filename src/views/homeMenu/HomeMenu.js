
app.views.HomeMenu = function HomeMenu () {};
o5.gui.controls.Control.registerAppControl(app.views.HomeMenu, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.HomeMenu.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.on("app-home-menu", "fetch", function () {
		this._homeMenu = this.querySelector('#portalMenu');
		$util.ControlEvents.fire("app-home-menu:homeNavMenu", "disable");
		$util.ControlEvents.fire("app-home-menu:portalMenu", "enable");
		if (o5.gui.viewManager.activeView.localName !== "app-home-menu") {
			$util.ControlEvents.fire("app-home-menu:portalMenu", "fetch");
		} else {
			$util.ControlEvents.fire("app-home-menu:portalMenu", "populated");
		}
		this._pages = {
			"home"     :  { view: "home",     viewId: "app-home" },
			"tv guide" :  { view: "homeTvGuide",   viewId: "app-home-tv-guide" },
			"library"  :  { view: "library",   viewId: "app-library" },
			"on demand":  { view: "onDemand",      viewId: "app-on-demand" },
			"store"    :  { view: "store",      viewId: "app-store" },
			"apps"     :  { view: "apps",     viewId: "app-apps" },
			"search"   :  { view: "homeSearch",    viewId: "app-home-search" },
			"settings" :  { view: "homeSetting", viewId: "app-home-setting" }
		};
		this._focusedElem = null;
		this._node = null;
		this._homeBgSolid = this.querySelector('#homeBgSolid');
		if ($config.getConfigValue("settings.tv.guide.background.vision")) {
			this._homeBgSolid.hidden = true;
		} else {
			this._homeBgSolid.hidden = false;
		}
	}, this);

	// portalMenu events
	$util.ControlEvents.on("app-home-menu:portalMenu", "populated", function () {
		$util.ControlEvents.fire("app-home-menu:portalMenu", "focus");
	}, this);

	$util.ControlEvents.on("app-home-menu:portalMenu", "change", function (list) {
		var selectedItem = list ? list.selectedItem : null,
			node = selectedItem ? selectedItem.itemData : null,
			name = node ? node.displayName.toLowerCase() : null;

		if (name) {
			if (!this._node || this._node.id !== node.id) { // different than last one
				$util.ControlEvents.fire(this._pages[name].viewId, "fetch", node);
			}
			$util.Events.fire("app:navigate:preview", this._pages[name].view);
		}
		this._node = node;
	}, this);

	$util.ControlEvents.on("app-home-menu:portalMenu", "enter", function (list) {
		var selectedItem = list ? list.selectedItem : null,
			node = selectedItem ? selectedItem.itemData : null,
			name = (node && node.displayName) ? node.displayName.toLowerCase() : null;

		if (name) {
			$util.Events.fire("app:navigate:open", this._pages[name].view);
		}
	}, this);

	this._node = null; // current node displayed
	this._focusedElem = null; // focused element
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
 * @private
 */
app.views.HomeMenu.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();
	$util.Events.fire("app:view:attached", "home-menu");
	this.logExit();
};

/**
 * @method _onLoad
 * @private
 */
app.views.HomeMenu.prototype._onLoad = function _onLoad () {
	this.logEntry();
	this.logExit();
};


/**
 * @method _onShow
 * @private
 */
app.views.HomeMenu.prototype._onShow = function _onShow () {
	this.logEntry();
	$util.Events.fire("clock:hide");
	this.logExit();
};

/**
 * @method _onHide
 * @private
 */
app.views.HomeMenu.prototype._onHide = function _onHide () {
	this.logEntry();
	this.logExit();
};

/**
 * @method _onFocus
 * @private
 * @param {Object} e
 */
app.views.HomeMenu.prototype._onFocus = function _onFocus () {
	this.logEntry();
	if (this._focusedElem) {
		this._focusedElem.focus();
	} else {
		$util.ControlEvents.fire("app-home-menu:" + this._homeMenu.id, "focus");
	}
	this._homeBgSolid = this.querySelector('#homeBgSolid');
	if ($config.getConfigValue("settings.tv.guide.background.vision")) {
		this._homeBgSolid.hidden = true;
	} else {
		this._homeBgSolid.hidden = false;
	}
	this.logExit();
};


/**
 * @method _onBlur
 * @private
 * @param {Object} e
 */
app.views.HomeMenu.prototype._onBlur = function _onBlur () {
	this.logEntry();
	this.logExit();
};

/**
 * @method _populated
 * @private
 * @param {Object} e
 */
app.views.HomeMenu.prototype._populated = function _populated () {
	this.logEntry();
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.views.HomeMenu.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	var handled = false;
	if (this._node && this._node.displayName === "TV GUIDE") {
		if (e.key === "Record") { //7268 has no "Star" key, use the "Record" instead now
			e.key = "Favorites";
		}
		if ((e.key >= "0" && e.key <= "9") || e.key === "Favorites") {
			$util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "numberEnterTvGuide", e);
			handled = true;
		}
	}
	switch (e.key) {
        case "Back":
        case "backspace":
        	// go to Live TV
        	// Live TV is the last view in Back Hierarchy
        	$util.Events.fire("app:navigate:to:default");
        	handled = true;
        	break;
	default:
		break;
	}
	if (handled === true) {
		e.stopImmediatePropagation();
		e.preventDefault();
	}

	this.logExit();
};
