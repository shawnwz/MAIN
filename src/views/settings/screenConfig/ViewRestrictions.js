"use strict";
var pinEntryForClassifiedProgramOptions = $service.settings.ViewRestrictions.getRatingOptions(),
	pinEntryForClassifiedProgramIndex = 0,
	pinEntryForClassifiedProgramValue = "ratingR",
	hideInfoPostersForClassifiedProgramOptions = $service.settings.ViewRestrictions.getRatingOptions(),
	hideInfoPostersForClassifiedProgramIndex = 0,
	hideInfoPostersForClassifiedProgramValue = "ratingR",
	pinEntryForNonClassifiedProgramOptions = $service.settings.ViewRestrictions.getYesNoOptions(),
	pinEntryForNonClassifiedProgramIndex = 0,
	pinEntryForNonClassifiedProgramValue = false,
	getPinEntryForClassifiedProgramOptions = function() {
		pinEntryForClassifiedProgramOptions.some(function(element, index) {
			if (element.value === $config.getConfigValue("settings.viewrestrictions.pin.entry.for.classified.program")) {
				pinEntryForClassifiedProgramIndex = index;
				pinEntryForClassifiedProgramValue = element.value;
				return true;
			}
		});
	},
	getHideInfoPostersForClassifiedProgramOptions = function() {
		hideInfoPostersForClassifiedProgramOptions.some(function(element, index) {
			if (element.value === $config.getConfigValue("settings.viewrestrictions.hide.info.posters.for.classified.program")) {
				hideInfoPostersForClassifiedProgramIndex = index;
				hideInfoPostersForClassifiedProgramValue = element.value;
				return true;
			}
		});
	},
	getPinEntryForNonClassifiedProgramOptions = function() {
		pinEntryForNonClassifiedProgramOptions.some(function(element, index) {
			if (element.value === $config.getConfigValue("settings.viewrestrictions.pin.entry.for.non.classified.program")) {
				pinEntryForNonClassifiedProgramIndex = index;
				pinEntryForNonClassifiedProgramValue = element.value;
				return true;
			}
		});
	};

getPinEntryForClassifiedProgramOptions();
getHideInfoPostersForClassifiedProgramOptions();
getPinEntryForNonClassifiedProgramOptions();

app.screenConfig.settings.VIEW_RESTRICTIONS = {
	text       : "settingsMenuTitleViewingRestictions",
	defaultitem: {
		settingsPinEntryForClassifiedProgram       : "ratingR",
		settingsHideInfoPostersForClassifiedProgram: "none",
		settingsPinEntryForNonClassifiedProgram    : false
	},
	saveditem: {
		settingsPinEntryForClassifiedProgram       : pinEntryForClassifiedProgramValue,
		settingsHideInfoPostersForClassifiedProgram: hideInfoPostersForClassifiedProgramValue,
		settingsPinEntryForNonClassifiedProgram    : pinEntryForNonClassifiedProgramValue
	},
	currentitem: {
		settingsPinEntryForClassifiedProgram       : pinEntryForClassifiedProgramValue,
		settingsHideInfoPostersForClassifiedProgram: hideInfoPostersForClassifiedProgramValue,
		settingsPinEntryForNonClassifiedProgram    : pinEntryForNonClassifiedProgramValue
	},
	resetDefaults  : "settings:viewrestrictions:resetDefaults",
	undoChanges    : "settings:viewrestrictions:undoChanges",
	footerClassList: [ "ctaClose", "ctaResetDefaults" ],
	getMenu        : function getMenu() {
		getPinEntryForClassifiedProgramOptions();
		getHideInfoPostersForClassifiedProgramOptions();
		getPinEntryForNonClassifiedProgramOptions();
		app.screenConfig.settings.VIEW_RESTRICTIONS.saveditem.settingsPinEntryForClassifiedProgram = pinEntryForClassifiedProgramValue;
		app.screenConfig.settings.VIEW_RESTRICTIONS.saveditem.settingsHideInfoPostersForClassifiedProgram = hideInfoPostersForClassifiedProgramValue;
		app.screenConfig.settings.VIEW_RESTRICTIONS.saveditem.settingsPinEntryForNonClassifiedProgram = pinEntryForNonClassifiedProgramValue;
		return [
			{
				id  : "settingsPinEntryForClassifiedProgram",
                text: "settingsRestrictionsClassifiedPinEntry",
				data: {
					type: "settingsToggle",
					get : function get() {
						return pinEntryForClassifiedProgramOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return pinEntryForClassifiedProgramIndex;
					},
					events: [{
						name: "settings:viewrestrictions:pinentryclassifiedprogram"
					}]
				}
			},
			{
				id  : "settingsHideInfoPostersForClassifiedProgram",
                text: "settingsRestrictionsClassifiedHideInfoPosters",
				data: {
					type: "settingsToggle",
					get : function get() {
						return hideInfoPostersForClassifiedProgramOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return hideInfoPostersForClassifiedProgramIndex;
					},
					events: [{
						name: "settings:viewrestrictions:hideinfopostersclassifiedprogram"
					}]
				}
			},
			{
                id  : "settingsMenuRestrictionsSubTitleB1",
                text: "",
                data: {
                    type        : "settingsText",
                    isEditable  : false,
                    isSelectable: false,
                    isTitle     : true,
                    get         : function get() {
				                    return {
										text: " "
									};
                    }
                }
            },
			{
                id  : "settingsMenuRestrictionsSubTitleB",
                text: "settingsRestrictionsNonClassifiedSubTitle",
                data: {
                    type        : "settingsText",
                    isEditable  : false,
                    isSelectable: false,
                    isTitle     : true,
                    get         : function get() {
				                    return {
										text: " "
									};
                    }
                }
            },
			{
				id  : "settingsPinEntryForNonClassifiedProgram",
                text: "settingsRestrictionsNonClassified",
				data: {
					type: "settingsToggle",
					get : function get() {
						return pinEntryForNonClassifiedProgramOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return pinEntryForNonClassifiedProgramIndex;
					},
					events: [{
						name: "settings:viewrestrictions:pinentrynonclassifiedprogram"
					}]
				}
			},
			{
                id  : "settingsMenuRestrictionsFooter",
                text: "settingsRestrictionsNonClassifiedFooter",
                data: {
                    type        : "settingsText",
                    isEditable  : false,
                    isSelectable: false,
                    isFooter    : true,
                    get         : function get() {
				                    return {
										text: " "
									};
                    }
                }
            }
		];
	}
};
