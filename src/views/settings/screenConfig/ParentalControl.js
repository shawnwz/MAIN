"use strict";
app.screenConfig.settings.PARENTAL_CONTROL = {
	text           : "settingsParentalControlsViewTitle",
	footerClassList: ["ctaClose"],
	getMenu        : function getMenu() {
		return [
			{
				id    : "channelBlocking",
				text  : "settingsMenuTitleChannelBlocking",
				data  : {},
				events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsBlockedChannelsView", "title": "settingsBlockedChannelsViewTitle" }
                    },
                    {
                      "control": "app-settings:blockScreen",
                      "event"  : "fetch"
                    }
				]
			},

/*
			{
				id: "channelBlocking",
				events: []
			},
*/
			{
				id    : "viewingRestrictions",
				text  : "settingsMenuTitleViewingRestictions",
				data  : {},
				events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsViewingRestrictionsView", "title": "settingsMenuTitleViewingRestictions" }
                    }
				]
			},
			{
				id    : "pinControl",
				text  : "settingsMenuTitlePinControl",
				data  : {},
				events: [
	                    {
	                        "name": "scr:navigate:to",
	                        "data": { "id": "settingsPinControlView", "title": "PIN Control" }
	                    }
				]
			},
			{
				id    : "changePin",
				text  : "settingsMenuTitleChangePin",
				data  : {},
				events: []
			},
			{
				id    : "iq3name",
				text  : "settingsMenuTitleSTBName",
				data  : {},
				events: []
			}
		];
	}
};
