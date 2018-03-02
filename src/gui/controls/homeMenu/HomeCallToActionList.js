/**
 * @class app.gui.controls.HomeCallToActionList
 */

app.gui.controls.HomeCallToActionList = function HomeCallToActionList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HomeCallToActionList, app.gui.controls.CallToActionList);

/**
 * @method createdCallback
 */
app.gui.controls.HomeCallToActionList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.HomeCallToActionList.prototype._fetch = function _fetch(node) {
	this.logEntry();
	var layout = node && node.nodeLayoutInfo ? node.nodeLayoutInfo.toUpperCase() : null,
		control = node && node.localName ? node.localName : null,
		items = [],
		data = null;

	if (layout) {
		//@hdk make this more dynamic per selected item!
		//@hdk should we change the screen too? ctaHomepage, ctaSettings, ctaGuide. The position is slighlty different
		if (layout === "MENU_NODE") {
			//items = ["ctaInfo"];
		} else if (layout === "MENU_LIBRARY_RENTED") {
			items = [ "ctaDel", "ctaKeep" ];
		} else if (layout === "MENU_LIBRARY_SCHEDULED") {
			items = [ "ctaDel", "ctaKeep" ];
		} else if (layout === "MENU_LIBRARY_RECORDED") {
			items = [ "ctaDel", "ctaKeep" ];
		} else if (layout === "MENU_GUIDE") {
			items = ["ctaSortListings"];
		} else if (layout === "MENU_APPS") {
			items = ["ctaLaunchApp"];
		} else if (layout === "MENU_SEARCH") { // HomeSearch footer should reviewed by Jason
			items = ["ctaClearRecent"];
		} else if (layout === "MENU_SETTINGS") {
			// nothing?
		}
	}

	if (control === "app-carousel-row-list-item") {
		// used by carousel views
		data = node.itemData;
		items = ["ctaInfo"];
		if (data && data.startTime && data.startTime > Date.now()) {
			items.push("ctaSetReminder");
		}
		if (data && data.source === "REMINDER_NOT_SURE") { // Need to confirm the source later
			items.push("ctaRemove");
		}
	}

	this.fireControlEvent("populate", items);
	this.fireControlEvent("show");

	this.logExit();
};

