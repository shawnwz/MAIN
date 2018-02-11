"use strict";
app.screenConfig.settings.HARDWARE_DETAILS = {
    component      : "settingsConfig",
    text           : "settingsMenuTitleHardwareDetails",
    footerClassList: ["ctaClose"],
    getMenu        : function getMenu() {
        return [
            {
                id  : "settingsMenuHardwareDetailsSTUStatistics",
                text: "settingsMenuHardwareSubTitleA",
                data: {
                    type      : "settingsText",
                    isEditable: false,
                    isTitle   : true,
                    get         : function get() {
				                    return {
										text: " "
									};
                    },
                    events: []
                }
            },
            {
                id  : "settingsMenuHardwareDetailsPowerOnHours",
                text: "settingsMenuHardwarePower",
                data: {
                    type      : "settingsText",
                    isEditable: false,
                    get       : function get() {
                        return $service.settings.HardwareDetails.getBrowserUptime();
                    },
                    events: []
                }
            },
            {
                id  : "settingsMenuHardwareDetailsReboots",
                text: "settingsMenuHardwareReboots",
                data: {
                    type      : "settingsText",
                    isEditable: false,
                    get       : function get() {
                        return {
                            text: $config.getConfigValue("settings.browser.reboot.times")
                        };
                    },
                    events: []
                }
            },

            /*{
                id  : "settingsMenuHardwareDetailsLNBShortCircuit",
                text: "settingsMenuHardwareLNB",
                data: {
                    type      : "settingsText",
                    isEditable: false,
                    get       : function get() {
                        return {
                            text: $config.getConfigValue("settings.browser.reboot.times")
                        };
                    },
                    events: []
                }
            },*/
            {
                id  : "settingsMenuHardwareDetailsHDMI",
                text: "settingsMenuHardwareSubTitleB",
                data: {
                    type      : "settingsText",
                    isEditable: false,
                    isTitle   : true,
                    get         : function get() {
				                    return {
										text: " "
									};
                    },
                    events: []
                }
            },
            {
                id  : "settingsMenuHardwareDetailsHDMIConnectivity",
                text: "settingsMenuHardwareHDMI",
                data: {
                    type      : "settingsText",
                    isEditable: false,
                    get       : function get() {
                        return $service.settings.HardwareDetails.getHdmiConnectivity();
                    },
                    events: []
                }
            },
            {
                id  : "settingsMenuHardwareDetailsHDCPStatus",
                text: "settingsMenuHardwareHDCP",
                data: {
                    type      : "settingsText",
                    isEditable: false,
                    get       : function get() {
                        return $service.settings.HardwareDetails.getHdcpStatus();
                    },
                    events: []
                }
            },
            {
                id  : "settingsMenuHardwareDetailsNativeResolution",
                text: "settingsMenuHardwareNative",
                data: {
                    type      : "settingsText",
                    isEditable: false,
                    get       : function get() {
                        return $service.settings.HardwareDetails.getNativeResolution();
                    },
                    events: []
                }
            }
        ];
    }
};
