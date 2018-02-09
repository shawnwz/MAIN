"use strict";
app.screenConfig.settings.BLUETOOTH = {
    component      : "settingsConfig",
    text           : "bluetoothRemoteSettings",
    footerClassList: ["ctaClose"],
    getMenu        : function getMenu() {
        // needs to be reowrked on customer confirmation for capsense option. FAPUI-328
        /*var capsenseOptions = $service.settings.Bluetooth.getOnOffOptions(),
            capSenseModeIndex = 0;
        capsenseOptions.some(function (element, index) {
            if (element.value === $config.getConfigValue("settings.bluetooth.capsense")) {
                capSenseModeIndex = index;
                return true;
            }
        });*/
        return [
            {
                id  : "settingsMenuBluetoothBatteryPercent",
                text: "settingsMenuBluetoothBattery",
                data: {
                    type      : "settingsText",
                    isEditable: false,
                    get       : function get() {
                        var batteryLevel = $service.settings.Bluetooth.getBluetoothRemoteBatteryLevel();
                        return {
                            text: (batteryLevel.quality) ? "settingsMenuBluetoothGood" : "settingsMenuBluetoothBad"
                        };
                    },
                    events: []
                }
            },
            //needs to be reowrked on customer confirmation for capsense option.FAPUI-328
            // {
                // id  : "settingsMenuBluetoothCapSense",
                // text: "Capsense",
                // data: {
                    // type      : "settingsToggle",
                    // isEditable: false,
                    // get       : function get() {
                            // return capsenseOptions;
                    // },
                    // getSelectedIndex: function getSelectedIndex() {
                                // return capSenseModeIndex;
                    // },
                    // events: []
                // }
            // },
            {
                id  : "settingsMenuBluetoothMacAddress",
                text: "settingsMenuBluetoothMacAddress",
                data: {
                    type      : "settingsText",
                    isEditable: false,
                    get       : function get() {
                        return {
                            text: $service.settings.Bluetooth.getBluetoothRemoteMacAddress()
                        };
                    },
                    events: []
                }
            }
        ];
    }
};
