"use strict";
app.screenConfig.settings.INSTALLER_SETUP = {
	text           : "installerSatelliteTitle",
	footerClassList: ["ctaClose"],
	getMenu        : function getMenu() {
		return [
			{
				id    : "lnbSetup",
				text  : "installerSatelliteLNBTitle",
				events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "installerLNBView", "title": "installerSatelliteLNBTitle" }
                    }
                ]
			},
			{
				id    : "homeTransponder",
				text  : "installerSatelliteHomeTitle",
				data  : {},
				events: [{
                        "name": "homeTransponder:checkSignalStatus"
                    }]
			},
			{
				id    : "fullSystemReset",
				text  : "installerResetTitle",
				data  : {},
				events: []
			},
			{
				id    : "entitlementStatus",
				text  : "installerEntitlementTitle",
				data  : {},
				events: []
			},
			{
				id    : "frontPanel",
				text  : "installerFrontPanelTitle",
				data  : {},
				events: []
			},
			{
				id    : "statusScreen",
				text  : "settingsInstallerIrdetoTitle",
				data  : {},
				events: []
			}
		];
	}
};
