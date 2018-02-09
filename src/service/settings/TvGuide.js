/**
 * @class $service.settings.TvGuide
 */
"use strict";

$service.settings.TvGuide = (function TvGuide() {

    return {

        /**
         * @method getOnOffOptions
         * @public
         * @return {Object}
         */
        getOnOffOptions: function getOnOffOptions() {
            return [
                {
                    value: true,
                    text : "on"
                },
                {
                    value: false,
                    text : "off"
                }
            ];
        },

        /**
         * @method getBackgroundAudioOptions
         * @public
         * @return {Object}
         */
        getBackgroundAudioOptions: function getBackgroundAudioOptions() {
            return [
                {
                    value: "backgroundVision",
                    text : "settingsMenuBackgroundVision"
                },
                {
                    value: "off",
                    text : "off"
                }
            ];
        },

        /**
         * @method getChannelNameDisplayOptions
         * @public
         * @return {Object}
         */
        getChannelNameDisplayOptions: function getChannelNameDisplayOptions() {
            return [
                {
                    value: "logo",
                    text : "settingsTVGuideLogo"
                },
                {
                    value: "text",
                    text : "settingsTVGuideText"
                }
            ];
        },

        /**
         * @method getOutOfStandbyOptions
         * @public
         * @return {Object}
         */
        getOutOfStandbyOptions: function getOutOfStandbyOptions() {
            return [
                {
                    value: "lastViewedChannel",
                    text : "settingsTVGuideLastViewedChannel"
                },
                {
                    value: "homepage",
                    text : "settingsTVGuideHomepage"
                }
            ];
        },

        /**
         * @method getEnergySavingLevelOptions
         * @public
         * @return {Object}
         */
        getEnergySavingLevelOptions: function getEnergySavingLevelOptions() {
            return [
                {
                    value: "high",
                    text : "settingsTVGuideHigh"
                },
                {
                    value: "medium",
                    text : "settingsTVGuideMedium"
                },
                {
                    value: "low",
                    text : "settingsTVGuideLow"
                }
            ];
        }


    };

}());
