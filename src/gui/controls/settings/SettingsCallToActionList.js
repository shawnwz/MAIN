/**
 * @class app.gui.controls.SettingsCallToActionList
 */

app.gui.controls.SettingsCallToActionList = function SettingsCallToActionList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsCallToActionList, app.gui.controls.CallToActionList);

/**
 * @method createdCallback
 */
app.gui.controls.SettingsCallToActionList.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
    this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SettingsCallToActionList.prototype._fetch = function _fetch(node) {
    this.logEntry();
    //var layout = node ? node.nodeLayoutInfo.toUpperCase() : null,
    var    items = [];

    if (node) {
        //@hdk make this more dynamic per selected item!
        //@hdk should we change the screen too? ctaHomepage, ctaSettings, ctaGuide. The position is slighlty different
        if (node.id === "settingsFavChannelsList") {
        	 items = [ "ctaClose", "ctaPageUpDown" ];
        	if ($service.settings.FavouriteService.isChannleFavourite(node.channel)) {
        		items.push("ctaUnFavourite");
        	} else {
        		items.push("ctaFavourite");
        	}
        	if ($service.settings.FavouriteService.isAnyFavouriteAvaliable()) {
        		items.push("ctaUnFavouriteAll");
        	}
        } else if (node.id === "settingsFavChannelCategoryList") {
        	items = ["ctaClose"];
        	if ($service.settings.FavouriteService.isAnyFavouriteAvaliable()) {
        		items.push("ctaUnFavouriteAll");
        	}
         } else if (node.id === "settingsBlockedChannelsList") {
             items = [ "ctaClose", "ctaPageUpDown" ];
            if ($service.settings.ChannelBlocking.isChannelLocked(node.channel)) {
                items.push("ctaUnBlock");
            } else {
                items.push("ctaBlock");
            }
            if ($service.settings.ChannelBlocking.isAnyBlockedChannelsAvaliable()) {
                items.push("ctaUnBlockAll");
            }
        } else if (node.id === "settingsBlockedChannelCategoryList") {
            items = ["ctaClose"];
            if ($service.settings.ChannelBlocking.isAnyBlockedChannelsAvaliable()) {
                items.push("ctaUnBlockAll");
            }
        } else if (node.id === "settingsWifiMenuList") {
        	items = ["ctaClose"];
        } else if (node.id === "settingswifiConnectionList") {
        	if (node.wifiItem.ssid === o5.platform.system.Preferences.get($util.constants.WIFI_CONFIG_PATH.SSID, true)) {
        		items = [ "ctaClose", "ctaNetworkDetails", "ctaTCPIPSettings" ];
        	} else {
        		items = [ "ctaClose", "ctaConnect" ];
        	}
        } else if (node.id === "networkConnectionTest") {
            items = ["ctaClose"];
        } else if (node.id === "EthernetConnection") {
            items = [ "ctaClose", "ctaNetworkDetails" ];
      } else if (node.id === "settingsNetworkDetailsViewList") {
            items = ["ctaClose"];
			if (o5.platform.system.Network.isEthernetAvailable()) {
			items.push("ctaTCPIPSettings");
			items.push("ctaRenewDHCP");
			}
        } else if (node.id === "settingsScan") {
            if (node.screen === "startScan") {
                items = ["ctaCancel"];
            } else {
                items = ["ctaClose"];
            }
        } else if (node.id === "settingsTVGuideViewList" ||
                    node.id === "settingsPictureViewList" ||
                    node.id === "settingsAudioLanguageViewList" ||
                    node.id === "settingsPrivacyViewList" ||
                    node.id === "settingsPinControlViewList" ||
                  //node.id === "settingsBluetoothViewList" ||
                    node.id === "settingsNotificationsList" ||
                    node.id === "settingsViewingRestrictionsViewList" ||
                  //node.id === "settingsSystemDetailsViewList" ||
                  //node.id === "settingsHardwareDetailsViewList" ||
                    node.id === "installerLNBViewList" ||
                    node.id === "installerHomeTransViewList" ||
                    node.id === "settingsDownloadControlViewList") {
            items = [ "ctaClose", "ctaResetDefaults" ];
        } else {
            items = ["ctaClose"];
        }
    }

    this.fireControlEvent("populate", items);
    this.fireControlEvent("show");

    this.logExit();
};

