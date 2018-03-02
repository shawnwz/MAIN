"use strict";
app.screenConfig.settings.WIFI_OPTIONS = {
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
			}
		];
	}
};
