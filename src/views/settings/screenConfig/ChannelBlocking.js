"use strict";
app.screenConfig.settings.BLOCKING = {
	component: "settingsChannelMenu",
	text     : "channelBlocking",
	getMenu  : function getMenu() {
		return [
			{
				id  : "Categories",
				data: {
					get: function () { // get choices
						return $util.constants.CHANNEL_CATEGORIES;
					},
					getSelectedIndex: function () {
						return 0;
					}
				}
			},
			{
				id  : "Channels",
				data: {
					get: function () {
						return $service.EPG.Channel.get();
					},
					getSelectedIndex: function () {
						return 0;
					}
				}
			}
		];
	}
};

