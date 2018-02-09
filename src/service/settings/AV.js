/**
 * @class $service.settings.AV
 */
"use strict";

$service.settings.AV = (function AV () {

    return {

        /**
         * @method getResolutionOptions
         * @public
         * @return {Object}
         */
        getResolutionOptions: function getResolutionOptions () {
            var obj, key, resolutions = o5.platform.output.AV.VideoResolution(), // eslint-disable-line new-cap
            videoCapabilities = CCOM.System.hdmiVideoFormat,
            arrOptions = [{ id: "resAuto", value: "auto", text: "preferred" }];
            if (videoCapabilities) {
                for (key in resolutions) {
                    if (resolutions.hasOwnProperty(key)) {
                            if (resolutions[key] & videoCapabilities) { /*eslint no-bitwise: off*/
                        obj = {};
                        obj.id = "res" + key.slice(18, key.length).toLowerCase();
                        obj.value = resolutions[key];
                        obj.text = key.slice(18, key.length).toLowerCase();
                        console.log(key);
                        arrOptions.push(obj);
                        console.log(arrOptions);
                    }
                }
            }
            return arrOptions;
            }
                return [
                {
                    id   : "resAuto",
                    value: "auto",
                    text : "preferred"
                },
                {
                    id   : "res1080i",
                    value: resolutions.HDMI_VIDEO_FORMAT_1080I,
                    text : "1080i-50Hz"
                },
                {
                    id   : "res1080p",
                    value: resolutions.HDMI_VIDEO_FORMAT_1080P,
                    text : "1080p-50Hz"
                },
                {
                    id   : "res720p",
                    value: resolutions.HDMI_VIDEO_FORMAT_720P,
                    text : "720p-50Hz"
                },
                {
                    id   : "res576p",
                    value: resolutions.HDMI_VIDEO_FORMAT_576P,
                    text : "576p"
                }
            ];

        },

        /**
         * @method getResolutionOptions
         * @public
         * @return {Object}
         */
        getAspectModesOptions: function getAspectModesOptions () {
            var aspectModes = o5.platform.output.AV.VideoAspectMode(); // eslint-disable-line new-cap

            return [
                {
                    id   : "aspectModeStretch",
                    value: aspectModes.HDMI_STRETCH,
                    text : "stretch"
                },
                {
                    id   : "aspectModePillarBox",
                    value: aspectModes.HDMI_PILLAR_BOX,
                    text : "pillarbox"
                }
            ];
        },

        /**
         * @method isHdcpStatusAuthenticated
         * @public
         * @return {Boolean}
         */
        isHdcpStatusAuthenticated: function isHdcpStatusAuthenticated () {
            return (CCOM.System.hdcpState === CCOM.System.HDCP_STATE_AUTHENTICATED);
        },

        /**
         * @method getSpdifOutputOptions
         * @public
         * @return {Object}
         */
        getSpdifOutputOptions: function getSpdifOutputOptions () {
            var audioType = o5.platform.output.AV.AudioType(); // eslint-disable-line new-cap

            return [
                {
                    id   : "spdifAudioMPEG",
                    value: audioType.PCM,
                    text : "MPEG"
                },
                {
                    id   : "spdifAudioAC3",
                    value: audioType.AC3,
                    text : "AC3"
                }
            ];
        },

        /**
         * @method getSpdifDigitalAudioDelayOptions
         * @public
         * @return {Boolean}
         */
        getSpdifDigitalAudioDelayOptions: function getSpdifDigitalAudioDelayOptions () {
            var delayOptions = $config.getConfigValue("settings.av.spdif.delay.options"),
                delayArray = $util.Functional.range(delayOptions.count).map(function (value) {
                    return value * delayOptions.step;
                });

            return delayArray.map(function (value) {
                return {
                    value: value,
                    text : " " + value + "  ms"
                };
            });
        },

        /**
         * @method getSpdifDigitalAudioDelay
         * @public
         * @return {Boolean}
         */
        getSpdifDigitalAudioDelay: function getSpdifDigitalAudioDelay () {
            var delayOptions = $config.getConfigValue("settings.av.spdif.delay.options"),
                delayInMs = o5.platform.output.AV.getAudioDelay(),
                roundedUp = delayInMs - (delayInMs % 10);

            if (roundedUp < delayOptions[0]) {
                roundedUp = delayOptions[0];
            }
            if (roundedUp > delayOptions[delayOptions.length - 1]) {
                roundedUp = delayOptions[delayOptions.length - 1];
            }
            return roundedUp;
        },

        /**
         * @method getSpdifAttenuationOptions
         * @public
         * @return {Object}
         */
        getSpdifAttenuationOptions: function getSpdifAttenuationOptions () {
            return [
                {
                    id   : "spdifAttenuationOff",
                    value: 0,
                    text : "off"
                },
                {
                    id   : "spdifAttenuation-3db",
                    value: 1,
                    text : "-3" + $util.Translations.translate("settingsSignalQualityUnits")
                },
                {
                    id   : "spdifAttenuation-6db",
                    value: 2,
                    text : "-6" + $util.Translations.translate("settingsSignalQualityUnits")
                },
                {
                    id   : "spdifAttenuation-9db",
                    value: 3,
                    text : "-9" + $util.Translations.translate("settingsSignalQualityUnits")
                },
                {
                    id   : "spdifAttenuation-11db",
                    value: 4,
                    text : "-11" + $util.Translations.translate("settingsSignalQualityUnits")
                }
            ];
        },

        /**
         * @method getHdmiOutputOptions
         * @public
         * @return {Object}
         */
        getHdmiOutputOptions: function getHdmiOutputOptions () {
            var audioType = o5.platform.output.AV.AudioType(); // eslint-disable-line new-cap

            return [
                {
                    id   : "hdmiAudioMPEG",
                    value: audioType.PCM,
                    text : "MPEG"
                },
                {
                    id   : "hdmiAudioAC3",
                    value: audioType.AC3,
                    text : "AC3"
                }
            ];
        },

        /**
         * @method getThemeOptions
         * @public
         * @return {Object}
         */
       /* getThemeOptions: function getThemeOptions () {
            return [
                {
                    id: "themeRel6",
                    value: "Rel6",
                    text: this.getString("themeRel6")
                },
                {
                    id: "themeRel8",
                    value: "Rel8",
                    text: this.getString("themeRel8")
                }
            ];
        },*/

        /**
         * @method getPreferredLanguageOptions
         * @public
         * @return {Object}
         */
        getPreferredLanguageOptions: function getPreferredLanguageOptions () {
            var langList = [ "eng", "ara", "yue", "cze", "est",
                            "fij", "fre", "ger", "gre", "heb", "hun",
                            "hin", "ind", "ita", "jpn", "kor",
                            "mal", "cmn", "pol", "por", "rus",
                            "slo", "spa", "tai", "tha", "tur", "vie" ];

            return langList.map(function (lang) {
                return {
                    value: lang,
                    text : $util.Translations.translate(lang)
                };
            });
        }
    };

}());

