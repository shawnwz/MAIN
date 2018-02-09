"use strict";
var reminderAdvancedTimeOptions = $service.settings.Notifications.getReminderAdvancedTimeOptions(),
	reminderAdvancedTimeIndex = 0,
	reminderAdvancedTimeValue = 30,
	deleteConfirmationOptions = $service.settings.Notifications.getDeleteConfirmationOptions(),
	deleteConfirmationIndex = 0,
	deleteConfirmationValue = "unviewed",
	ipVideoUsageWarningOptions = $service.settings.Notifications.getIpVideoUsageWarningOptions(),
	ipVideoUsageWarningIndex = 0,
	ipVideoUsageWarningValue = true,
	bannerTimeoutOptions = $service.settings.Notifications.getBannerTimeoutOptions(),
	bannerTimeoutIndex = 0,
	bannerTimeoutValue = 10,
	hdcpWarningSettingsOptions = $service.settings.Notifications.getHdcpWarningSettingsOptions(),
	hdcpWarningSettingsIndex = 0,
	hdcpWarningSettingsValue = "allWarnings",

	getReminderAdvancedTimeOptions = function() {
			reminderAdvancedTimeOptions.some(function (element, index) {
				//Below was the implementation before. Retaining the code under commented section to help if any bugs arise in future for present approach
				//if (element.value === o5.platform.system.Preferences.get("/system/opentv/scheduler/JobTaskManager/viewerPeriod", true)) {
				if (element.value === $config.getConfigValue("settings.notifications.reminder.advanced.time")) {
					reminderAdvancedTimeIndex = index;
					reminderAdvancedTimeValue = element.value;
					return true;
				}
			});
	},

	getDeleteConfirmationOptions = function() {
			deleteConfirmationOptions.some(function (element, index) {
				if (element.value === $config.getConfigValue("settings.notifications.delete.confirmation")) {
					deleteConfirmationIndex = index;
					deleteConfirmationValue = element.value;
					return true;
				}
			});
	},
	
	getIpVideoUsageWarningOptions = function() {
			ipVideoUsageWarningOptions.some(function (element, index) {
				if (element.value === $config.getConfigValue("settings.notifications.ip.video.usage.warning.enable")) {
					ipVideoUsageWarningIndex = index;
					ipVideoUsageWarningValue = element.value;
					return true;
				}
			});
	},

	getBannerTimeoutOptions = function() {
		bannerTimeoutOptions.some(function (element, index) {
			if (element.value === $config.getConfigValue("settings.notifications.banner.timeout")) {
				bannerTimeoutIndex = index;
				bannerTimeoutValue = element.value;
				return true;
			}
		});
	},

	getHdcpWarningSettingsOptions = function() {
		hdcpWarningSettingsOptions.some(function (element, index) {
			if (element.value === $config.getConfigValue("settings.notifications.hdcp.warning.settings")) {
				hdcpWarningSettingsIndex = index;
				hdcpWarningSettingsValue = element.value;
				return true;
			}
		});
	};

getReminderAdvancedTimeOptions();
getDeleteConfirmationOptions();
getIpVideoUsageWarningOptions();
getBannerTimeoutOptions();
getHdcpWarningSettingsOptions();

app.screenConfig.settings.NOTIFICATIONS = {

	text   : "notifications",
	defaultitem: {
		settingsNoticationsReminder: 30,
		settingsNoticationsDelete  : "unviewed",
		settingsNoticationsIpVideo : true,
		settingsNoticationsBannner : 10,
		settingsNoticationsHDCP    : "allWarnings"
	},
	saveditem: {
		settingsNoticationsReminder: reminderAdvancedTimeValue,
		settingsNoticationsDelete  : deleteConfirmationValue,
		settingsNoticationsIpVideo : ipVideoUsageWarningValue,
		settingsNoticationsBannner : bannerTimeoutValue,
		settingsNoticationsHDCP    : hdcpWarningSettingsValue
	},
	currentitem: {
		settingsNoticationsReminder: reminderAdvancedTimeValue,
		settingsNoticationsDelete  : deleteConfirmationValue,
		settingsNoticationsIpVideo : ipVideoUsageWarningValue,
		settingsNoticationsBannner : bannerTimeoutValue,
		settingsNoticationsHDCP    : hdcpWarningSettingsValue
	},
	resetDefaults  : "settings:notifications:resetDefaults",
	undoChanges    : "settings:notifications:undoChanges",
	footerClassList: [ "ctaClose", "ctaResetDefaults" ],
	getMenu: function getMenu() {
		getReminderAdvancedTimeOptions();
		getDeleteConfirmationOptions();
		getIpVideoUsageWarningOptions();
		getBannerTimeoutOptions();
		getHdcpWarningSettingsOptions();
		app.screenConfig.settings.NOTIFICATIONS.saveditem.settingsNoticationsReminder = reminderAdvancedTimeValue;
		app.screenConfig.settings.NOTIFICATIONS.saveditem.settingsNoticationsDelete = deleteConfirmationValue;
		app.screenConfig.settings.NOTIFICATIONS.saveditem.settingsNoticationsIpVideo = ipVideoUsageWarningValue;
		app.screenConfig.settings.NOTIFICATIONS.saveditem.settingsNoticationsBannner = bannerTimeoutValue;
		app.screenConfig.settings.NOTIFICATIONS.saveditem.settingsNoticationsHDCP = hdcpWarningSettingsValue;
		return [
			{
				id  : "settingsNoticationsReminder",
				text: "Reminder Advanced Time",
				data: {
					type: "settingsToggle",
					get : function get() {
						return reminderAdvancedTimeOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return reminderAdvancedTimeIndex;
					},
					events: [
						{
							name: "settings:notifications:setReminderAdvancedTime"
						}
					]
				}
			},
			{
				id  : "settingsNoticationsDelete",
				text: "Delete Confirmation",
				data: {
					type: "settingsToggle",
					get : function get() {
						return deleteConfirmationOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return deleteConfirmationIndex;
					},
					events: [
						{
							name: "settings:notifications:setDeleteConfirmationOptions"
						}
					]
				}
			},
			{
				id  : "settingsNoticationsIpVideo",
				text: "IP Video Usage Warning",
				data: {
					type: "settingsToggle",
					get : function get() {
						return ipVideoUsageWarningOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return ipVideoUsageWarningIndex;
					},
					events: [
						{
							name: "settings:notifications:setIpVideoUsageWarning"
						}
					]
				}
			},
			{
				id  : "settingsNoticationsBannner",
				text: "Banner Timeout",
				data: {
					type: "settingsToggle",
					get : function get() {
						return bannerTimeoutOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return bannerTimeoutIndex;
					},
					events: [
						{
							name: "settings:notifications:setBannerTimeout"
						}
					]
				}
			},
			{
				id  : "settingsNoticationsHDCP",
				text: "HDCP Warning Settings",
				data: {
					type: "settingsToggle",
					get : function get() {
						return hdcpWarningSettingsOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return hdcpWarningSettingsIndex;
					},
					events: [
						{
							name: "settings:notifications:setHdcpWarningSettings"
						}
					]

				}
			}
		];
	}
};
