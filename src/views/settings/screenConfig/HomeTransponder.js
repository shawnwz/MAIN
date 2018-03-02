"use strict";
var satelliteParams = $service.settings.InstallerService.getDefaultScanningParams("DVBS"),
            satelliteHomeFreqOptions = satelliteParams.frequency,
            satelliteHomeFreqIndex = 0,
            satelliteHomeFreqValue = satelliteParams.frequency,
            satelliteHomePolOptions = $service.settings.InstallerService.getSatelliteHomePolOptions(),
            satelliteHomePolIndex = 0,
            satelliteHomePolValue = 0,
            homeSymbolOptions = satelliteParams.symbolRate,
            homeSymbolIndex = 0,
            homeSymbolValue = satelliteParams.symbolRate,
            satelliteHomeFECOptions = $service.settings.InstallerService.getsatelliteHomeFECOptions(),
            satelliteHomeFECIndex = 0,
            satelliteHomeFECValue = 0,
            satelliteHomeFLPOptions = "0",
            satelliteHomeFLPIndex = 0,
            satelliteHomeFLPValue = "eng",
            // eslint-disable-next-line new-cap
            getsatelliteHomeFreqIndex = function () {
                    satelliteHomeFreqOptions = satelliteParams.frequency;
                    satelliteHomeFreqIndex = 0;
                    satelliteHomeFreqValue = satelliteParams.frequency;
            },
            getsatelliteHomePolIndex = function () {
                    satelliteHomePolOptions.some(function (element, index) {
                        if (element.value === satelliteParams.lnbPolarization) {
                            satelliteHomePolIndex = index;
                            satelliteHomePolValue = element.value;
                            return true;
                        }
                    });
            },
            gethomeSymbolIndex = function () {
                    homeSymbolOptions = satelliteParams.symbolRate;
                    homeSymbolIndex = 0;
                    homeSymbolValue = satelliteParams.symbolRate;
            },
            getsatelliteHomeFECIndex = function () {
                    satelliteHomeFECOptions.some(function (element, index) {
                        // TODO: CCOM API called in o5.platform.output.AV.getAudioType() is deprecated and
                        //       not returning correct value; hence getting audio format from configman directly.
                        if (element.value === satelliteParams.fecInner) {
                            satelliteHomeFECIndex = index;
                            satelliteHomeFECValue = element.value;
                            return true;
                        }
                    });
            },
            getsatelliteHomeFLPIndex = function () {
                 satelliteHomeFLPOptions = satelliteParams.FreqList;
                 satelliteHomeFLPIndex = 0;
                 satelliteHomeFLPValue = satelliteParams.FreqList;
            };
$service.settings.InstallerService.registerEvents();
getsatelliteHomeFreqIndex();
getsatelliteHomePolIndex();
gethomeSymbolIndex();
getsatelliteHomeFECIndex();
getsatelliteHomeFLPIndex();

app.screenConfig.settings.HOME_TRANS = {
    component  : "settingsConfig",
    text       : "audioAndLanguageSettings",
    defaultitem: {
        settingsInstallerSatelliteHomeFreq      : "12.438",
        settingsInstallerSatelliteHomePol       : "Horizontal",
        settingsInstallerHomeSymbol : "27800",
        settingsInstallerSatelliteHomeFEC       : "3/4",
        settingsInstallerSatelliteHomeFLP: "0"
    },
    saveditem: {
        settingsInstallerSatelliteHomeFreq      : satelliteHomeFreqValue,
        settingsInstallerSatelliteHomePol       : satelliteHomePolValue,
        settingsInstallerHomeSymbol : homeSymbolValue,
        settingsInstallerSatelliteHomeFEC       : satelliteHomeFECValue,
        settingsInstallerSatelliteHomeFLP: satelliteHomeFLPValue
    },
    currentitem: {
        settingsInstallerSatelliteHomeFreq      : satelliteHomeFreqValue,
        settingsInstallerSatelliteHomePol       : satelliteHomePolValue,
        settingsInstallerHomeSymbol : homeSymbolValue,
        settingsInstallerSatelliteHomeFEC       : satelliteHomeFECValue,
        settingsInstallerSatelliteHomeFLP: satelliteHomeFLPValue
    },
    resetDefaults  : "settings:hometrans:resetDefaults",
    undoChanges    : "settings:hometrans:undoChanges",
    footerClassList: [ "ctaClose", "ctaResetDefaults" ],
    getMenu        : function getMenu() {

        satelliteParams = $service.settings.InstallerService.getDefaultScanningParams("DVBS");
        getsatelliteHomeFLPIndex();
        getsatelliteHomeFECIndex();
        gethomeSymbolIndex();
        getsatelliteHomePolIndex();
        getsatelliteHomeFreqIndex();
        app.screenConfig.settings.HOME_TRANS.saveditem.settingsInstallerSatelliteHomeFreq = satelliteHomeFreqValue;
        app.screenConfig.settings.HOME_TRANS.saveditem.settingsInstallerSatelliteHomePol = satelliteHomePolValue;
        app.screenConfig.settings.HOME_TRANS.saveditem.settingsInstallerHomeSymbol = homeSymbolValue;
        app.screenConfig.settings.HOME_TRANS.saveditem.settingsInstallerSatelliteHomeFEC = satelliteHomeFECValue;
        app.screenConfig.settings.HOME_TRANS.saveditem.settingsInstallerSatelliteHomeFLP = satelliteHomeFLPValue;


        return [
            {
                id  : "settingsInstallerSatelliteHomeFreq",
                text: "installerSatelliteHomeFreq",
                data: {
                    type: "settingsNumericInput",
                    textLength: 6,
                    dotAt: 3,
                    get : function get() {
                        return satelliteHomeFreqOptions;/*{
                            text : ,
                            value: satelliteHomeFreqOptions
                        };;*/
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return satelliteHomeFreqIndex;
                    },
                    events: [
                        {
                            name: "settings:hometrans:frequency"
                        }
                    ]
                }
            },
            {
                id  : "settingsInstallerSatelliteHomePol",
                text: "installerSatelliteHomePol",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return satelliteHomePolOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return satelliteHomePolIndex;
                    },
                    events: [
                        {
                            name: "settings:hometrans:lnbPolarization"
                        }
                    ]
                }
            },
            {
                id  : "settingsInstallerHomeSymbol",
                text: "installerHomeSymbol",
                data: {
                    type: "settingsNumericInput",
                    textLength: 5,
                    get : function get() {
                        return homeSymbolOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return homeSymbolIndex;
                    },
                    events: [
                        {
                            name: "settings:hometrans:symbolRate"
                        }
                    ]
                }
            },
            {
                id  : "settingsInstallerSatelliteHomeFEC",
                text: "installerSatelliteHomeFEC",
                data: {
                    type: "settingsToggle",
                    get : function get() {
                        return satelliteHomeFECOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return satelliteHomeFECIndex;
                    },
                    events: [
                        {
                            name: "settings:hometrans:fecInner"
                        }
                    ]
                }
            },
            {
                id  : "settingsInstallerSatelliteHomeFLP",
                text: "installerSatelliteHomeFLP",
                data: {
                    type: "settingsNumericInput",
                    textLength: 2,
                    get : function get() {
                        return satelliteHomeFLPOptions;
                    },
                    getSelectedIndex: function getSelectedIndex() {
                        return satelliteHomeFLPIndex;
                    },
                    events: [
                        {
                            name: "settings:hometrans:FreqList"
                        }
                    ]
                }
            }
        ];
    }
};
