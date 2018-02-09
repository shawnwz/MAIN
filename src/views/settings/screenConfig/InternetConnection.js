"use strict";
app.screenConfig.settings.INTERNET_CONNECTION = {
    footerClassList: ["ctaClose"],
    getMenu        : function getMenu() {
        return [
            {
                id    : "ethernet",
                text  : "settingsMenuTitleEthernet",
                events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsEthernetMenu", "title": "settingsMenuTitleEthernet" }
                    }
                ]
            },
            {
				id    : "wifi",
				text  : "Wifi",
					events: [
					{
				  		"name": "scr:navigate:to",
				 		"data": { "id": "settingsWifiView", "title": "settingsMenuTitleWifi", "footerClassList": ["ctaClose"] }
					},
					{
                      "control": "app-settings:wifiScreen",
                      "event"  : "fetch"
                    }
				]
			},
            {
                id    : "downloadControl",
                text  : "settingsMenuDownloadControlTitle",
                events: [
                    {
				  		"name": "scr:navigate:to",
				 		"data": { "id": "settingsDownloadControlView", "title": "settingsMenuDownloadControlTitle" }
					}
                ]
            },
            {
                id    : "networkTest",
                text  : "settingsMenuTitleNetworkTest",
                events: []
            },
            {
                id    : "internetSpeedTest",
                text  : "settingsMenuTitleInternetSpeedTest",
                events: []
            },
            {
                id    : "networkSettings",
                text  : "settingsMenuTitleNetworkSettings",
                events: [
                    {
                        name: "settings:loadScreen",
                        data: {
                            screen: "NETWORKSETTINGS"
                        }
                    }
                ]
            },
            {
                id    : "networkDetails",
                text  : "settingsMenuTitleNetworkDetails",
                events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsNetworkDetailsView", "title": "settingsMenuTitleNetworkDetails" }
                    }
                ]
            }
        ];
    }
};
