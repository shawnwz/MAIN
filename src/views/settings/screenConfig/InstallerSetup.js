"use strict";
app.screenConfig.settings.INSTALLER_SETUP = {
	text           : "installerSatelliteTitle",
	footerClassList: ["ctaClose"],
	getMenu        : function getMenu() {
		return [
			{
				id    : "lnbSetup",
				text  : "installerSatelliteLNBTitle",
				data  : {},
				events: []
			},
			{
				id    : "homeTransponder",
				text  : "installerSatelliteHomeTitle",
				data  : {},
				events: []
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
