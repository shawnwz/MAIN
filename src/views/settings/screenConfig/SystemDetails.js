"use strict";
app.screenConfig.settings.SYSTEM_DETAILS = {
	component      : "settingsConfig",
    text           : "systemDetails",
	footerClassList: ["ctaClose"],
	getMenu        : function getMenu() {
		return [
			{
				id  : "settingsMenuSystemDetailsManufacturer",
                text: "settingsMenuSystemManufacturer",
				data: {
					type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
                            text: $service.settings.SystemDetails.getManufacturer()
						};
					},
					events: []
				}
			},
			{
				id  : "settingsMenuSystemDetailsHardwareVersion",
                text: "settingsMenuSystemHardware",
				data: {
					type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
                            text: $service.settings.SystemDetails.getHardwareVersion()
						};
					},
					events: []
				}
			},
			{
				id  : "settingsMenuSystemDetailsSoftwareVersion",
                text: "settingsMenuSystemSoftware",
				data: {
					type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
                            text: $service.settings.SystemDetails.getSoftwareVersion()
						};
					},
					events: []
				}
			},
			{
				id  : "settingsMenuSystemDetailsSerialNumber",
                text: "settingsMenuSystemSerial",
				data: {
					type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
                            text: $service.settings.SystemDetails.getSerialNumber()
						};
					},
					events: []
				}
			},
			{
				id  : "settingsMenuSystemDetailsOperatingSystemVersion",
                text: "settingsMenuOsVer",
				data: {
					type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
							// Temp truncation as the middleware string is very long
                            text: $service.settings.SystemDetails.getOperatingSystemVersion().substring(0, 28)
						};
					},
					events: []
				}
			},
			{
				id  : "settingsMenuSystemDetailsCWEVersion",
                text: "settingsMenuCWE",
				data: {
					type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
                            text: $service.settings.SystemDetails.getCWEVersion()
						};
					},
					events: []
				}
			},
			{
				id  : "settingsMenuSystemDetailsEPGSoftwareVersion",
                text: "settingsMenuEPG",
				data: {
					type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
                            text: $service.settings.SystemDetails.getEPGSoftwareVersion()
						};
					},
					events: []
				}
			}
		];
	}
};

