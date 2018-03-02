/**
 * @class $service.settings.InstallerService
 */
"use strict";

$service.settings.InstallerService = (function InstallerService() {

    var dvbsScanningParams = {
            'frequency': 12.438,
            'symbolRate': 27800,
            'fecInner': "3/4",
            'FreqList': "0",
            'lnbPolarization': "Horizontal"
        };
    function saveFrequency(saveItem) {
        dvbsScanningParams.frequency = saveItem;
    }

    function saveSymbolRate(saveItem) {
        dvbsScanningParams.symbolRate = saveItem;
    }

    function saveFecInner(saveItem) {
        dvbsScanningParams.fecInner = saveItem;
    }

    function saveFreqList(saveItem) {
        dvbsScanningParams.FreqList = saveItem;
    }

    function saveLnbPolarization(saveItem) {
        dvbsScanningParams.lnbPolarization = saveItem;
    }

    function saveScanningParams(dvbs) {
        //return $service.scan.DVBScanUtil.getDefaultScanningParams(networkType);//
        //return dvbsScanningParams;
        dvbsScanningParams.frequency = dvbs.settingsInstallerSatelliteHomeFreq;
        dvbsScanningParams.symbolRate = dvbs.settingsInstallerHomeSymbol;
        dvbsScanningParams.fecInner = dvbs.settingsInstallerSatelliteHomeFEC;
        dvbsScanningParams.FreqList = dvbs.settingsInstallerSatelliteHomeFLP;
        dvbsScanningParams.lnbPolarization = dvbs.settingsInstallerSatelliteHomePol;
    }
    function registerEvents() {
        $util.Events.on("settings:hometrans:frequency", saveFrequency);
        $util.Events.on("settings:hometrans:symbolRate", saveSymbolRate);
        $util.Events.on("settings:hometrans:fecInner", saveFecInner);
        $util.Events.on("settings:hometrans:FreqList", saveFreqList);
        $util.Events.on("settings:hometrans:lnbPolarization", saveLnbPolarization);
        $util.Events.on("settings:hometrans:undoChanges", saveScanningParams);
        $util.Events.on("settings:hometrans:resetDefaults", saveScanningParams);
    }
    function getDefaultScanningParams() {
        //return $service.scan.DVBScanUtil.getDefaultScanningParams(networkType);
        return dvbsScanningParams;
    }


    function getSatelliteHomePolOptions() {
            return [
                {
                    value: "Horizontal",
                    text : "Horizontal"
                },
                {
                    value: "Vertical",
                    text : "Vertical"
                }
            ];
    }
    function getsatelliteHomeFECOptions() {
            return [
                {
                    value: "1/2",
                    text : "1/2"
                },
                {
                    value: "2/3",
                    text : "2/3"
                },
                {
                    value: "3/4",
                    text : "3/4"
                },
                {
                    value: "5/6",
                    text : "5/6"
                },
                {
                    value: "7/8",
                    text : "7/8"
                }

            ];
    }

    /*function getsatelliteHomeFLPOptions() {
            var i, FLPoptions = [], obj;
            for (i = 0; i <= 32; i++) {
                obj = {};
                obj.value = i.toString();
                obj.text = i.toString();
                FLPoptions.push(obj);
            }
            return FLPoptions;
    }*/
    return {
        getDefaultScanningParams: getDefaultScanningParams,
        getSatelliteHomePolOptions: getSatelliteHomePolOptions,
        getsatelliteHomeFECOptions: getsatelliteHomeFECOptions,
       // getsatelliteHomeFLPOptions: getsatelliteHomeFLPOptions,
        registerEvents:registerEvents

    };

}());
