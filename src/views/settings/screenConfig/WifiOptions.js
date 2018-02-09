"use strict";
app.screenConfig.settings.WIFI_OPTIONS = {
	footerClassList: ["ctaClose"],
	getMenu        : function getMenu() {
		return [
			{
				id  : "wifiMenu",
				data: {
					get: function () { // get choices
						return [ {
									id    : "wifiNetwork",
									text  : "settingsWifiMenuChooseService",
									events: []
								},
								{
									id    : "networkId",
									text  : "settingsWifiMenuEnterSSID",
									events: []
								},
								{
									id    : "wps",
									text  : "settingsWifiMenuConnectWPS",
									events: []
								} ];
					},
					getSelectedIndex: function () {
						return 0;
					}
				}
			},
			{
				id  : "wifiConnectionAvaliable",
				data: {
					get: function () {
					return [   {
									encryptMode: "ENCRYPT_AES",
									key        : " ",
									protocol   : "this.N",
									quality    : 70,
									security   : "WPA2",
									ssid       : "WLAN_01",
									status     : 1
								},
								{
									encryptMode: "ENCRYPT_AES",
									key        : " ",
									protocol   : "this.N",
									quality    : 100,
									security   : "WPA2",
									ssid       : "WLAN_02"
								},
								{
									encryptMode: "ENCRYPT_AES",
									key        : " ",
									protocol   : "this.N",
									quality    : 40,
									security   : "WPA2",
									ssid       : "WLAN_03"
								},
								{
									encryptMode: "ENCRYPT_AES",
									key        : " ",
									protocol   : "this.N",
									quality    : 25,
									security   : "WPA2",
									ssid       : "Nagra_Corporate"
								}
							];
					},
					getSelectedIndex: function () {
						return 0;
					}
				}
			}
		];
	}
};
