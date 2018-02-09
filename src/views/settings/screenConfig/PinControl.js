"use strict";
var options = [
		{
			value: false,
			text : "N"
		},
		{
			value: true,
			text : "Y"
		}
	],
	purchaseOptions = options,
	keptProgrammesOptions = options,
	ipVideoOptions = options,
	purchaseIndex = 0,
	keptProgrammesIndex = 0,
	ipVideoIndex = 0,
	purchaseValue = true,
	keptProgrammeValue = true,
	ipVideoValue = true,
	getPurchaseOptions = function() {
		purchaseOptions.some(function (element, index) {
			if (element.value === $config.getConfigValue("settings.pinControl.purchase")) {
				purchaseIndex = index;
				purchaseValue = element.value;
				return true;
			}
		});
	},
	getProgrammesOptions = function() {
		keptProgrammesOptions.some(function (element, index) {
			if (element.value === $config.getConfigValue("settings.pinControl.keptProgrammes")) {
				keptProgrammesIndex = index;
				keptProgrammeValue = element.value;
				return true;
			}
		});
	},
	getIpVideoOptions = function() {
		ipVideoOptions.some(function (element, index) {
			if (element.value === $config.getConfigValue("settings.pinControl.ipVideo")) {
				ipVideoIndex = index;
				ipVideoValue = element.value;
				return true;
			}
		});
	};
	


getPurchaseOptions();
getProgrammesOptions();
getIpVideoOptions();

app.screenConfig.settings.PIN_CONTROL = {
		text       : "pin control",
		defaultitem: {
			settingsPinToPurchase      : false,
			settingsPinProtectProgrames: false,
			settingsPinForIPVideo      : false
		},
		saveditem: {
			settingsPinToPurchase      : purchaseValue,
			settingsPinProtectProgrames: keptProgrammeValue,
			settingsPinForIPVideo      : ipVideoValue
		},
		currentitem: {
			settingsPinToPurchase      : purchaseValue,
			settingsPinProtectProgrames: keptProgrammeValue,
			settingsPinForIPVideo      : ipVideoValue
		},
		resetDefaults   : "settings:pinControl:resetDefaults",
		undoChanges    : "settings:pinControl:undoChanges",
		footerClassList: [ "ctaClose", "ctaResetDefaults" ],
		getMenu        : function getMenu() {
			getPurchaseOptions();
			getProgrammesOptions();
			getIpVideoOptions();
			app.screenConfig.settings.PIN_CONTROL.saveditem.settingsPinToPurchase = purchaseValue;
			app.screenConfig.settings.PIN_CONTROL.saveditem.settingsPinProtectProgrames = keptProgrammeValue;
			app.screenConfig.settings.PIN_CONTROL.saveditem.settingsPinForIPVideo = ipVideoValue;
			return [
				{
					id  : "settingsPinToPurchase",
					text: "settingsMenuPinControlToPurchase",
					data: {
						type: "settingsToggle",
						get : function get() {
							return purchaseOptions;
						},
						getSelectedIndex: function getSelectedIndex() {
							return purchaseIndex;
						},
						events: [{
							name: "settings:pinControl:purchase"
						}]
					}
				},
				{
					id  : "settingsPinProtectProgrames",
					text: "settingsMenuPinControlKeptProgrammes",
					data: {
						type: "settingsToggle",
						get : function get() {
							return keptProgrammesOptions;
						},
						getSelectedIndex: function getSelectedIndex() {
							return keptProgrammesIndex;
						},
						events: [{
							name: "settings:pinControl:keptProgrammes"
						}]
					}
				},
				{
					id  : "settingsPinForIPVideo",
					text: "settingsMenuPinControlIpVideos",
					data: {
						type: "settingsToggle",
						get : function get() {
							return ipVideoOptions;
						},
						getSelectedIndex: function getSelectedIndex() {
							return ipVideoIndex;
						},
						events: [{
							name: "settings:pinControl:ipVideo"
						}]
					}
				}
			];
		}
	};

