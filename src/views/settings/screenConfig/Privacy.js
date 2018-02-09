"use strict";
var contentRecommendationsOptions = [
		{
			value: true,
			text : "yes"
		},
		{
			value: false,
			text : "no"
		}
	],
	contentRecommendationsIndex = 0,
	contentRecommendationsValue = true,
	suggestionsOptions = [
		{
			value: true,
			text : "yes"
		},
		{
			value: false,
			text : "no"
		}
	],
	suggestionsIndex = 0,
	suggestionsOptionsValue = true,
	getContentRecommendationsOptions = function() {
		contentRecommendationsOptions.some(function(element, index) {
			if (element.value === $config.getConfigValue("settings.privacy.content.recommendations")) {
				contentRecommendationsIndex = index;
				contentRecommendationsValue = element.value;
				return true;
			}
		});
	},
	getSuggestionsOptions = function() {
		suggestionsOptions.some(function(element, index) {
			if (element.value === $config.getConfigValue("settings.privacy.suggestions")) {
				suggestionsIndex = index;
				suggestionsOptionsValue = element.value;
				return true;
			}
		});
	};

getContentRecommendationsOptions();
getSuggestionsOptions();

app.screenConfig.settings.PRIVACY = {
	text       : "privacy",
	defaultitem: {
		settingsPrivacyRecommendations: false,
		settingsPrivacySuggestions    : true
	},
	saveditem: {
		settingsPrivacyRecommendations: contentRecommendationsValue,
		settingsPrivacySuggestions    : suggestionsOptionsValue
	},
	currentitem: {
		settingsPrivacyRecommendations: contentRecommendationsValue,
		settingsPrivacySuggestions    : suggestionsOptionsValue
	},
	resetDefaults  : "settings:privacy:resetDefaults",
	undoChanges    : "settings:privacy:undoChanges",
	footerClassList: [ "ctaClose", "ctaResetDefaults" ],
	getMenu        : function getMenu() {
		getContentRecommendationsOptions();
		getSuggestionsOptions();
		app.screenConfig.settings.PRIVACY.saveditem.settingsPrivacyRecommendations = contentRecommendationsValue;
		app.screenConfig.settings.PRIVACY.saveditem.settingsPrivacySuggestions = suggestionsOptionsValue;
		return [
			{
				id  : "settingsPrivacyRecommendations",
                text: "settingsMenuPrivacyRecord",
				data: {
					type: "settingsToggle",
					get : function get() {
						return contentRecommendationsOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return contentRecommendationsIndex;
					},
					events: [{
						name: "settings:privacy:contentRecommendations"
					}]
				}
			},
			{
				id  : "settingsPrivacySuggestions",
                text: "settingsMenuPrivacySuggestion",
				data: {
					type: "settingsToggle",
					get : function get() {
						return suggestionsOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return suggestionsIndex;
					},
					events: [{
						name: "settings:privacy:suggestions"
					}]
				}
			}
		];
	}
};
