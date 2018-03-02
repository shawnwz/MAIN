/**
 * Example markup:
 *
 *     <app-settings-ethernet-menu-list id="settingsEthernetMenuList"></app-settings-ethernet-menu-list>
 *
 * @class app.gui.controls.SettingsEthernetMenuList
 * @extends o5.gui.controls.Control
 */

app.gui.controls.SettingsEthernetMenuList = function SettingsEthernetMenuList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsEthernetMenuList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 */
app.gui.controls.SettingsEthernetMenuList.prototype.createdCallback = function createdCallback() {
	var i;
	
	this.logEntry();

	this.superCall();

	$util.Translations.update(this);

	// This list is hardcoded in the HTML, there will be no call to populate the list, so
	// we "populate" the items from the html.
 	this._elems = this.querySelectorAll("app-settings-ethernet-menu-list-item");
	this._itemNb = this._elems.length;

	for (i = 0; i < this._itemNb; i++) {
		this._data[i] = this._elems[i].i18n;
	}

// During box boot-up, if the ethernet connection is unavailable, the screen should be updated with ethernet disconneted status
// because, There will be no tification about the disconnection after the UI loads.
	if (o5.platform.system.Network.isEthernetAvailable() === false) {
		this.classList.add("ethernetDisconnected");
	}

    this.onControlEvent("visible", function () {
 		o5.platform.system.Network.registerOnStatusChangedListener(this._onStatusChangedCallBack.bind(this));
    });
   this.onControlEvent("hidden", function () {
 		o5.platform.system.Network.unregisterOnStatusChangedListener(this._onStatusChangedCallBack.bind(this));
    });

	this.logExit();
};


/**
 * @method _onStatusChangedCallBack
 */
app.gui.controls.SettingsEthernetMenuList.prototype._onStatusChangedCallBack = function _onStatusChangedCallBack(e) {
	this.logEntry();
    if (e.eventType === CCOM.IpNetwork.LINK_DOWN ||
        e.eventType === CCOM.IpNetwork.SIGNAL_LOST) {
        if (e.interface.name === o5.platform.system.Network.NetworkType.ETHERNET) {
			this.classList.add("ethernetDisconnected");// auto-update the screen with ethernet disconneted status
        }
    }

    if (e.eventType === CCOM.IpNetwork.LINK_UP ||
        e.eventType === CCOM.IpNetwork.SIGNAL_OK) {
        if (e.interface.name === o5.platform.system.Network.NetworkType.ETHERNET) {
			this.classList.remove("ethernetDisconnected");// auto-update the screen with ethernet connected status
        }
    }
	this.logExit();
};

/**
 * @method _onFocus
 */
app.gui.controls.SettingsEthernetMenuList.prototype._onFocus = function _onFocus () {
	this.logEntry();
	this.selectedItem = 0;
    this._updateFooter();
	this.superCall();
	this.logExit();
};

/**
 * @method _updateFooter
 * show/hide footer button(select network details) based on ethernet menu selection
 */
app.gui.controls.SettingsEthernetMenuList.prototype._updateFooter = function _updateFooter() {
	$util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", this.selectedItem);
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsEthernetMenuList.prototype._onKeyDown = function _onKeyDown(e) {
	var handled = false,
		selectedItem, id;
		
	this.logEntry();

	switch (e.key) {
		 case "Ok":
			selectedItem = this ? this.selectedItem : null;
			id = selectedItem ? selectedItem.id : null;

			if (id) {
				if (id === "EthernetConnection") {
					$util.Events.fire("scr:navigate:to", { "id": "settingsNetworkDetailsView", "title": "Ethernet Connection" });
				} else if (id === "networkConnectionTest") {
					// $util.Events.fire("scr:navigate:to", { "id": "settingsNetworkTestView", "title": "Ethernet Connection Test" } );
				}
			}
			handled = true;
			break;
		 case "Back":
		 	this._reset(); // to force focus back to first item
			handled = this.superCall(e);
			break;
		case "ArrowDown":
		case "ArrowUp":
			handled = this.superCall(e);
			this._updateFooter();
			break;
		default:
			handled = this.superCall(e);
			break;
	}

	if (handled === true) {
		e.stopImmediatePropagation();
	}

	this.logExit();
};


/**
 * @class app.gui.controls.SettingsEthernetMenuListItem
 */
app.gui.controls.SettingsEthernetMenuListItem = function SettingsEthernetMenuListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsEthernetMenuListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsEthernetMenuListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._focusClass = "settingsEthernetMenuFocus";
	this.logExit();
};
