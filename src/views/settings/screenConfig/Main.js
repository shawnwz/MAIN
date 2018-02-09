"use strict";
app.screenConfig.settings.MAIN = {
	component: "settingsGrid",
	text     : "applicationName",
	getMenu  : function getMenu() {
		return [
			{
				id    : "parentalControl",
				events: [
					{
						name: "settings:loadScreen",
						data: {
							screen: "PARENTAL_CONTROL" // TODO: FP1-141 Parental Control - this needs an intermediary PIN entry step
						}
					}
				]
			},
			{
				id    : "favouriteChannels",
				events: []
			},
			{
				id    : "internetConnection",
				events: [
					{
						name: "settings:loadScreen",
						data: {
							screen: "INTERNET_CONNECTION"
						}
					}
				]
			},
			{
				id    : "advancedSettings",
				events: [
					{
						name: "settings:loadScreen",
						data: {
							screen: "ADVANCED"
						}
					}
				]
			},
			{
				id    : "notifications",
				events: [
					{
						name: "settings:loadScreen",
						data: {
							screen: "NOTIFICATIONS"
						}
					}
				]
			},
			{
				id    : "tvGuideSettings",
				events: [
					{
						name: "settings:loadScreen",
						data: {
							screen: "TV_GUIDE"
						}
					}
				]
			},
			{
				id    : "channelScan",
				events: [
					{
						name: "settings:loadScreen",
						data: {
							screen: "CHANNEL_SCAN"
						}
					}
				]
			},
			{
				id    : "privacy",
				events: [
					{
						name: "settings:loadScreen",
						data: {
							screen: "PRIVACY"
						}
					}
				]
			},
			{
				id    : "help",
				events: []
			}
		];
	}
};
