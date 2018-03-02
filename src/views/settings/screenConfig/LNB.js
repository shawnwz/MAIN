"use strict";
var lnbPowerSupplyOptions = [
		{
			value: true,
			text : "on"
		},
		{
			value: false,
			text : "off"
		}
	],
	lnbPowerSupplyIndex = 0,
	lnbPowerSupplyValue = true,
	frequencyCommandOptions = [
		{
			value: true,
			text : "on"
		},
		{
			value: false,
			text : "off"
		}
	],
	frequencyCommandIndex = 0,
	frequencyCommandValue = true,

	getLNBPowerSupplyOptions = function() {
		lnbPowerSupplyOptions.some(function(element, index) {
			if (element.value === $config.getConfigValue("settings.installer.lnb.power")) {
				lnbPowerSupplyIndex = index;
				lnbPowerSupplyValue = element.value;
				return true;
			}
		});
	},
	getfrequencyCommandOptions = function() {
		frequencyCommandOptions.some(function(element, index) {
			if (element.value === $config.getConfigValue("settings.installer.lnb.frequencyCommand")) {
				frequencyCommandIndex = index;
				frequencyCommandValue = element.value;
				return true;
			}
		});
	},
	highBandLowFrequencyValue = "10.7",
	getHighBandLowFrequencyOptions = function() {
        highBandLowFrequencyValue = $config.getConfigValue("settings.installer.lnb.highBandLowFrequency");
    };

getLNBPowerSupplyOptions();
getfrequencyCommandOptions();
getHighBandLowFrequencyOptions();

app.screenConfig.settings.LNB = {
	text       : "installerSatelliteLNBTitle",
	defaultitem: {
		settingsLNBPowerSupply         : true,
		settingsLNBFrequencyCommand    : false,
		settingsLNBHighBandLowFrequency: "10.7"
	},
	saveditem: {
		settingsLNBPowerSupply         : lnbPowerSupplyValue,
		settingsLNBFrequencyCommand    : frequencyCommandValue,
		settingsLNBHighBandLowFrequency: highBandLowFrequencyValue
	},
	currentitem: {
		settingsLNBPowerSupply         : lnbPowerSupplyValue,
		settingsLNBFrequencyCommand    : frequencyCommandValue,
		settingsLNBHighBandLowFrequency: highBandLowFrequencyValue
	},
	resetDefaults  : "settings:lnb:resetDefaults",
	undoChanges    : "settings:lnb:undoChanges",
	footerClassList: [ "ctaClose", "ctaResetDefaults" ],
	getMenu        : function getMenu() {
		getLNBPowerSupplyOptions();
		getfrequencyCommandOptions();
		getHighBandLowFrequencyOptions();
		app.screenConfig.settings.LNB.saveditem.settingsLNBPowerSupply = lnbPowerSupplyValue;
		app.screenConfig.settings.LNB.saveditem.settingsLNBFrequencyCommand = frequencyCommandValue;
		app.screenConfig.settings.LNB.saveditem.settingsLNBHighBandLowFrequency = highBandLowFrequencyValue;
		return [
			{
				id  : "settingsLNBPowerSupply",
                text: "installerLNBPower",
				data: {
					type: "settingsToggle",
					get : function get() {
						return lnbPowerSupplyOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return lnbPowerSupplyIndex;
					},
					events: [{
						name: "settings:lnb:powerSupply"
					}]
				}
			},
			{
				id  : "settingsLNBFrequencyCommand",
                text: "installerLNBKHz",
				data: {
					type: "settingsToggle",
					get : function get() {
						return frequencyCommandOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return frequencyCommandIndex;
					},
					events: [{
						name: "settings:lnb:frequencyCommand"
					}]
				}
			},
			{
				id  : "settingsLNBHighBandLowFrequency",
                text: "installerLNBLoFreq",
				data: {
					type: "settingsNumericInput",
                    textLength: 5,
                    dotAt: 3,
					isEditable: false,
					get       : function get() {
                        return $config.getConfigValue("settings.installer.lnb.highBandLowFrequency");
                },
                events: [{
                        name: "settings:lnb:highBandLowFrequency"
                    }]
				}
			}
		];
	}
};
