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
app.gui.controls.HomeCallToActionList.prototype._fetch = function _fetch(data) {
	this.logEntry();
	var layout = null,
		items = [];

	if (data) {
		layout = data.component && data.component.nodeLayoutInfo ? data.component.nodeLayoutInfo.toUpperCase() : null;
	}
	if (layout) {
		//@hdk make this more dynamic per selected item!
		//@hdk should we change the screen too? ctaHomepage, ctaSettings, ctaGuide. The position is slighlty different
		if (layout === "MENU_NODE") {
			items = ["ctaInfo"];
			if (data.carousel && data.content) {
				switch (data.carousel.title) {
					case "Continue Watching":
						if (data.content.source !== "MDS" && data.content.source !== "DISCO") {
							items.push("ctaRemove");
						}
						break;
					case "Live TV - On Now":
					case "Coming Up on Live TV":
					case "Movies on Tonight":
					case "Sports this Week":
						items.push("ctaSetReminder");
						break;
					case "Top Picks for you":
					case "Last Chance":
					case "Last Coming Soon to Foxtel":
						break;
					default:
						break;
				}
			}
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
		} else if (layout === "MENU_SEARCH") {
			items = [ "ctaFullSearch", "ctaClearRecent" ];
		} else if (layout === "MENU_SETTINGS") {
			// nothing?
		}
	}

	this.fireControlEvent("populate", items);
	this.fireControlEvent("show");

	this.logExit();
};

