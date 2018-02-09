"use strict";
var backgroundVisionOptions = $service.settings.TvGuide.getOnOffOptions(),
        backgroundVisionIndex = 0,
        backgroundVisionValue = true,

        pipAudioOptions = $service.settings.TvGuide.getOnOffOptions(),
        pipAudioIndex = 0,
        pipAudioValue = true,

        backgroundAudioOptions = $service.settings.TvGuide.getOnOffOptions(),
        backgroundAudioIndex = 0,
        backgroundAudioValue = true,

        pipSurfAndScanOptions = $service.settings.TvGuide.getOnOffOptions(),
        pipSurfAndScanIndex = 0,
        pipSurfAndScanValue = true,

        channelNameDisplayOptions = $service.settings.TvGuide.getChannelNameDisplayOptions(),
        channelNameDisplayIndex = 0,
        channelNameDisplayValue = "logo",

        nowAndNextOptions = $service.settings.TvGuide.getOnOffOptions(),
        nowAndNextIndex = 0,
        nowAndNextValue = true,

        outOfStandbyOptions = $service.settings.TvGuide.getOutOfStandbyOptions(),
        outOfStandbyIndex = 0,
        outOfStandbyValue = "lastViewedChannel",

        instantRewindOptions = $service.settings.TvGuide.getOnOffOptions(),
        instantRewindIndex = 0,
        instantRewindValue = true,

        energySavingModeOptions  = $service.settings.TvGuide.getEnergySavingLevelOptions(),
        energySavingModeIndex = 0,
        energySavingModeValue = "high",


    getbackgroundVisionOptions = function() {
        backgroundVisionOptions.some(function (element, index) {
            if (element.value === $config.getConfigValue("settings.tv.guide.background.vision")) {
                backgroundVisionIndex = index;
                backgroundVisionValue = element.value;
                return true;
            }
        });
    },
    getpipAudioOptions = function() {
        pipAudioOptions.some(function (element, index) {
            if (element.value === $config.getConfigValue("settings.tv.guide.pip.audio")) {
                pipAudioIndex = index;
                pipAudioValue = element.value;
                return true;
            }
        });
    },
    getbackgroundAudioOptions = function() {
        backgroundAudioOptions.some(function (element, index) {
            if (element.value === $config.getConfigValue("settings.tv.guide.background.audio")) {
                backgroundAudioIndex = index;
                backgroundAudioValue = element.value;
                return true;
            }
        });
    },
    getpipSurfAndScanOptions = function() {
        pipSurfAndScanOptions.some(function (element, index) {
            if (element.value === $config.getConfigValue("settings.tv.guide.pip.scan")) {
                pipSurfAndScanIndex = index;
                pipSurfAndScanValue = element.value;
                return true;
            }
        });
    },
    getchannelNameDisplayOptions = function() {
        channelNameDisplayOptions.some(function (element, index) {
            if (element.value === $config.getConfigValue("settings.tv.guide.channel.name.display")) {
                channelNameDisplayIndex = index;
                channelNameDisplayValue = element.value;
                return true;
            }
        });
    },
    getnowAndNextOptions = function() {
        nowAndNextOptions.some(function (element, index) {
            if (element.value === $config.getConfigValue("settings.tv.guide.now.and.next")) {
                nowAndNextIndex = index;
                nowAndNextValue = element.value;
                return true;
            }
        });
    },
    getoutOfStandbyOptions = function() {
        outOfStandbyOptions.some(function (element, index) {
            if (element.value === $config.getConfigValue("settings.tv.guide.out.of.standby")) {
                outOfStandbyIndex = index;
                outOfStandbyValue = element.value;
                return true;
            }
        });
    },
    getinstantRewindOptions = function() {
        instantRewindOptions.some(function (element, index) {
            if (element.value === $config.getConfigValue("settings.tv.guide.instant.rewind")) {
                instantRewindIndex = index;
                instantRewindValue = element.value;
                return true;
            }
        });
    },
    getenergySavingModeOptions = function() {
        energySavingModeOptions.some(function (element, index) {
            if (element.value === $config.getConfigValue("settings.tv.guide.engery.saving.mode")) {
                energySavingModeIndex = index;
                energySavingModeValue = element.value;
                return true;
            }
        });
    };
getbackgroundVisionOptions();
getpipAudioOptions();
getbackgroundAudioOptions();
getpipSurfAndScanOptions();
getchannelNameDisplayOptions();
getnowAndNextOptions();
getoutOfStandbyOptions();
getinstantRewindOptions();
getenergySavingModeOptions();


app.screenConfig.settings.TV_GUIDE = {

    text           : "settingsMenuTitleTVGuideSettings",
    defaultitem: {
        settingsMenuTvGuideBackgroundVision  : true,
        settingsMenuTvGuidePipAudio          : true,
        settingsMenuTvGuideBackgroundAudio   : true,
        settingsMenuTvGuidePipSurfAndScan    : true,
        settingsMenuTvGuideChannelNameDisplay: "logo",
        settingsMenuTvGuideNowAndNext        : true,
        settingsMenuTvGuideOutOfStandby      : "lastViewedChannel",
        settingsMenuTvGuideInstantRewind     : true,
        settingsMenuTvGuideEnergySavingMode  : "high"
    },
    saveditem: {
        settingsMenuTvGuideBackgroundVision  : backgroundVisionValue,
        settingsMenuTvGuidePipAudio          : pipAudioValue,
        settingsMenuTvGuideBackgroundAudio   : backgroundAudioValue,
        settingsMenuTvGuidePipSurfAndScan    : pipSurfAndScanValue,
        settingsMenuTvGuideChannelNameDisplay: channelNameDisplayValue,
        settingsMenuTvGuideNowAndNext        : nowAndNextValue,
        settingsMenuTvGuideOutOfStandby      : outOfStandbyValue,
        settingsMenuTvGuideInstantRewind     : instantRewindValue,
        settingsMenuTvGuideEnergySavingMode  : energySavingModeValue
    },
    currentitem: {
        settingsMenuTvGuideBackgroundVision  : backgroundVisionValue,
        settingsMenuTvGuidePipAudio          : pipAudioValue,
        settingsMenuTvGuideBackgroundAudio   : backgroundAudioValue,
        settingsMenuTvGuidePipSurfAndScan    : pipSurfAndScanValue,
        settingsMenuTvGuideChannelNameDisplay: channelNameDisplayValue,
        settingsMenuTvGuideNowAndNext        : nowAndNextValue,
        settingsMenuTvGuideOutOfStandby      : outOfStandbyValue,
        settingsMenuTvGuideInstantRewind     : instantRewindValue,
        settingsMenuTvGuideEnergySavingMode  : energySavingModeValue
    },
    resetDefaults  : "settings:tv:resetDefaults",
    undoChanges    : "settings:tv:undoChanges",
    footerClassList: [ "ctaClose", "ctaResetDefaults" ],
    getMenu        : function getMenu() {
        getbackgroundVisionOptions();
        getpipAudioOptions();
        getbackgroundAudioOptions();
        getpipSurfAndScanOptions();
        getchannelNameDisplayOptions();
        getnowAndNextOptions();
        getoutOfStandbyOptions();
        getinstantRewindOptions();
        getenergySavingModeOptions();

        app.screenConfig.settings.TV_GUIDE.saveditem.settingsMenuTvGuideBackgroundVision   = backgroundVisionValue;
        app.screenConfig.settings.TV_GUIDE.saveditem.settingsMenuTvGuidePipAudio           = pipAudioValue;
        app.screenConfig.settings.TV_GUIDE.saveditem.settingsMenuTvGuideBackgroundAudio    = backgroundAudioValue;
        app.screenConfig.settings.TV_GUIDE.saveditem.settingsMenuTvGuidePipSurfAndScan     = pipSurfAndScanValue;
        app.screenConfig.settings.TV_GUIDE.saveditem.settingsMenuTvGuideChannelNameDisplay = channelNameDisplayValue;
        app.screenConfig.settings.TV_GUIDE.saveditem.settingsMenuTvGuideNowAndNext         = nowAndNextValue;
        app.screenConfig.settings.TV_GUIDE.saveditem.settingsMenuTvGuideOutOfStandby       = outOfStandbyValue;
        app.screenConfig.settings.TV_GUIDE.saveditem.settingsMenuTvGuideInstantRewind      = instantRewindValue;
        app.screenConfig.settings.TV_GUIDE.saveditem.settingsMenuTvGuideEnergySavingMode   = energySavingModeValue;

        return [
            {
                id  : "settingsMenuTvGuideBackgroundVision",
                text: "settingsMenuBackgroundVision",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return backgroundVisionOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return backgroundVisionIndex;
                    },
                    events: [
                        {
                            name: "settings:tv:backgroundVision"
                        }
                    ]
                }
            },
            {
                id  : "settingsMenuTvGuidePipAudio",
                text: "settingsMenuPIPAudio",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return pipAudioOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return pipAudioIndex;
                    },
                    events: [
                        {
                            name: "settings:tv:pipAudio"
                        }
                    ]
                }
            },
            {
                id  : "settingsMenuTvGuideBackgroundAudio",
                text: "settingsMenuBackgroundAudio",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return backgroundAudioOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return backgroundAudioIndex;
                    },
                    events: [
                        {
                            name: "settings:tv:backgroundAudio"
                        }
                    ]
                }
            },
            {
                id  : "settingsMenuTvGuidePipSurfAndScan",
                text: "settingsMenuSurfAndScan",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return pipSurfAndScanOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return pipSurfAndScanIndex;
                    },
                    events: [
                        {
                            name: "settings:tv:pipSurfAndScan"
                        }
                    ]
                }
            },
            {
                id  : "settingsMenuTvGuideChannelNameDisplay",
                text: "settingsMenuChannelNameDisplay",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return channelNameDisplayOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return channelNameDisplayIndex;
                    },
                    events: [
                        {
                            name: "settings:tv:channelNameDisplay"
                        }
                    ]
                }
            },
            {
                id  : "settingsMenuTvGuideNowAndNext",
                text: "settingsMenuTVGuideNowAndNext",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return nowAndNextOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return nowAndNextIndex;
                    },
                    events: [
                        {
                            name: "settings:tv:nowAndNext"
                        }
                    ]
                }
            },
            {
                id  : "settingsMenuTvGuideOutOfStandby",
                text: "settingsMenuComingOutOfStandby",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return outOfStandbyOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return outOfStandbyIndex;
                    },
                    events: [
                        {
                            name: "settings:tv:outOfStandby"
                        }
                    ]
                }
            },
            {
                id  : "settingsMenuTvGuideInstantRewind",
                text: "settingsMenuInstantRewind",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return instantRewindOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return instantRewindIndex;
                    },
                    events: [
                        {
                            name: "settings:tv:instantRewind"
                        }
                    ]
                }
            },
            {
                id  : "settingsMenuTvGuideEnergySavingMode",
                text: "settingsMenuEnergySavingLevel",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return energySavingModeOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return energySavingModeIndex;
                    },
                    events: [
                        {
                            name: "settings:tv:energySavingMode"
                        }
                    ]
                }
            }
        ];
    }
};
