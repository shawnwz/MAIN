"use strict";
var spdifOutputOptions = $service.settings.AV.getSpdifOutputOptions(),
            spdifOutputIndex = 0,
            spdifOutputValue = 0,
            spdifDelayOptions = $service.settings.AV.getSpdifDigitalAudioDelayOptions(),
            spdifDelayIndex = 0,
            spdifDelayValue = 0,
            spdifAttenuationOptions = $service.settings.AV.getSpdifAttenuationOptions(),
            spdifAttenuationIndex = 0,
            spdifAttenuationValue = 0,
            hdmiOutputOptions = $service.settings.AV.getHdmiOutputOptions(),
            hdmiOutputIndex = 0,
            hdmiOutputValue = 0,
            preferredLanguageOptions = $service.settings.AV.getPreferredLanguageOptions(),
            preferredLanguageIndex = 0,
            preferredLanguageValue = "eng",
            // eslint-disable-next-line new-cap
            audioType = o5.platform.output.AV.AudioType(),
            getspdifOutputIndex = function () {
                    spdifOutputOptions.some(function (element, index) {
                        if (element.value === o5.platform.system.Preferences.get("/system/devices/audmgr/spdifFormat", true)) {
                            spdifOutputIndex = index;
                            spdifOutputValue = element.value;
                            return true;
                        }
                    });
            },
            getspdifDelayIndex = function () {
                    spdifDelayOptions.some(function (element, index) {
                        if (element.value === $service.settings.AV.getSpdifDigitalAudioDelay()) {
                            spdifDelayIndex = index;
                            spdifDelayValue = element.value;
                            return true;
                        }
                    });
            },
            getspdifAttenuationIndex = function () {
                    spdifAttenuationOptions.some(function (element, index) {
                        if (element.value === o5.platform.system.Preferences.get("/system/devices/audmgr/pcmAttenuation", true)) {
                            spdifAttenuationIndex = index;
                            spdifAttenuationValue = element.value;
                            return true;
                        }
                    });
            },
            gethdmiOutputIndex = function () {
                    hdmiOutputOptions.some(function (element, index) {
                        // TODO: CCOM API called in o5.platform.output.AV.getAudioType() is deprecated and
                        //       not returning correct value; hence getting audio format from configman directly.
                        if (element.value === o5.platform.system.Preferences.get("/system/devices/audmgr/hdmiFormat", true)) {
                            hdmiOutputIndex = index;
                            hdmiOutputValue = element.value;
                            return true;
                        }
                    });
            },
            getpreferredLanguageIndex = function () {
                    preferredLanguageOptions.some(function (element, index) {
                        if (element.value === o5.platform.system.Device.getPreferredLanguages()) {
                            preferredLanguageIndex = index;
                            preferredLanguageValue = element.value;
                            return true;
                        }
                    });
            };
getspdifOutputIndex();
getspdifDelayIndex();
getspdifAttenuationIndex();
gethdmiOutputIndex();
getpreferredLanguageIndex();

app.screenConfig.settings.AUDIO_LANGUAGE = {
    component  : "settingsConfig",
    text       : "audioAndLanguageSettings",
    defaultitem: {
        settingsMenuAudioLanguageSpdifOutput      : audioType.AC3,
        settingsMenuAudioLanguageSpdifDelay       : 0,
        settingsMenuAudioLanguageSpdifAttenuation : 0,
        settingsMenuAudioLanguageHdmiOutput       : audioType.PCM,
        settingsMenuAudioLanguagePreferredLanguage: "eng"
    },
    saveditem: {
        settingsMenuAudioLanguageSpdifOutput      : spdifOutputValue,
        settingsMenuAudioLanguageSpdifDelay       : spdifDelayValue,
        settingsMenuAudioLanguageSpdifAttenuation : spdifAttenuationValue,
        settingsMenuAudioLanguageHdmiOutput       : hdmiOutputValue,
        settingsMenuAudioLanguagePreferredLanguage: preferredLanguageValue
    },
    currentitem: {
        settingsMenuAudioLanguageSpdifOutput      : spdifOutputValue,
        settingsMenuAudioLanguageSpdifDelay       : spdifDelayValue,
        settingsMenuAudioLanguageSpdifAttenuation : spdifAttenuationValue,
        settingsMenuAudioLanguageHdmiOutput       : hdmiOutputValue,
        settingsMenuAudioLanguagePreferredLanguage: preferredLanguageValue
    },
    resetDefaults  : "settings:audio:resetDefaults",
    undoChanges    : "settings:audio:undoChanges",
    footerClassList: [ "ctaClose", "ctaResetDefaults" ],
    getMenu        : function getMenu() {

        getpreferredLanguageIndex();
        gethdmiOutputIndex();
        getspdifAttenuationIndex();
        getspdifDelayIndex();
        getspdifOutputIndex();
        app.screenConfig.settings.AUDIO_LANGUAGE.saveditem.settingsMenuAudioLanguageSpdifOutput = spdifOutputValue;
        app.screenConfig.settings.AUDIO_LANGUAGE.saveditem.settingsMenuAudioLanguageSpdifDelay = spdifDelayValue;
        app.screenConfig.settings.AUDIO_LANGUAGE.saveditem.settingsMenuAudioLanguageSpdifAttenuation = spdifAttenuationValue;
        app.screenConfig.settings.AUDIO_LANGUAGE.saveditem.settingsMenuAudioLanguageHdmiOutput = hdmiOutputValue;
        app.screenConfig.settings.AUDIO_LANGUAGE.saveditem.settingsMenuAudioLanguagePreferredLanguage = preferredLanguageValue;


        return [
            {
                id  : "settingsMenuAudioLanguageSpdifOutput",
                text: "settingsMenuAudoLangSPDIFdaOutput",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return spdifOutputOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return spdifOutputIndex;
                    },
                    events: [
                        {
                            name: "settings:av:spdifOutput"
                        }
                    ]
                }
            },
            {
                id  : "settingsMenuAudioLanguageSpdifDelay",
                text: "settingsMenuAudoLangSPDIFdaDelay",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return spdifDelayOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return spdifDelayIndex;
                    },
                    events: [
                        {
                            name: "settings:av:spdifDelay"
                        }
                    ]
                }
            },
            {
                id  : "settingsMenuAudioLanguageSpdifAttenuation",
                text: "settingsMenuAudoLangSPDIFdaAtten",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return spdifAttenuationOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return spdifAttenuationIndex;
                    },
                    events: [
                        {
                            name: "settings:av:spdifAttenuation"
                        }
                    ]
                }
            },
            {
                id  : "settingsMenuAudioLanguageHdmiOutput",
                text: "settingsMenuAudoLangHDMIDigOut",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return hdmiOutputOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return hdmiOutputIndex;
                    },
                    events: [
                        {
                            name: "settings:av:hdmiOutput"
                        }
                    ]
                }
            },
            {
                id  : "settingsMenuAudioLanguagePreferredLanguage",
                text: "settingsMenuAudoLangPrefLanguage",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return preferredLanguageOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return preferredLanguageIndex;
                    },
                    events: [
                        {
                            name: "settings:av:preferredLanguage"
                        }
                    ]
                }
            }
        ];
    }
};
