/**
 * The Scan class provides functionality to perform DVB scanning, upon the various
 * available tuners (hardware dependent).
 *
 * In order to begin the scan process, we must first register the required callbacks
 * using the methods:
 *
 *     o5.platform.system.Scan.setScanCompleteCallback(completeCallback);
 *     o5.platform.system.Scan.setScanFailureCallback(failureCallback);
 *     o5.platform.system.Scan.setScanProgressCallback(progressCallback);
 *
 * The progress callback has a time interval set to 5000 ms (SCAN_INTERVAL_TIME) to control
 * the frequency of the progress update.
 *
 * To start the scan process, we use the `startScan` method, and provide the
 * network type and scan parameters that we wish to scan. For example:
 *
 *     o5.platform.system.Scan.startScan(o5.platform.system.Scan.NetworkType.DVBC, parameters);
 *
 * This will begin a full scan on the DVB-C tuner.
 *
 * The registered progress callback will be notified during the scan process, and if
 * all goes well, the scan complete callback will be invoked at the end of the scan
 * process, and all discovered services will be added to the EPG database (available
 * via the EPG module).
 *
 * Additional scan parameters can be supplied to the startScan method, although this
 * is vendor specific (please consult your middle ware documentation).
 *
 * @class o5.platform.system.Scan
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.system.Scan = new (function Scan () {

    this._isDVBSEnabled = true;
    this._isDVBCEnabled = false;
    this._isDVBTEnabled = false;
    this._isISDBTEnabled = false;

    // constants
    // paths to set scan profiles
    this.DVBS_PROFILE = "/network/siconfig/networkClasses/Satellite/transponders/0/dvbs/";
    this.DVBC_PROFILE = "/network/siconfig/networkClasses/Cable/transponders/0/dvbc/";
    this.DVBT_PROFILE = "/network/siconfig/networkClasses/Terrestrial/transponders/0/dvbt/";
    this.ISDBT_PROFILE = "/network/siconfig/networkClasses/ISDB-T/transponders/0/isdbt/";
    this.SCANS_PATH = "/network/siconfig/scans/";
    this.SCAN_INTERVAL_TIME = 5000;

    // private properties
    this._scanHandle = null;
    this._scanType = null;
    this._scanError = null;
    this._scanProgressTimer = null;

    // scan profiles
    this._dvbsSignalScanProfileName = "satellite_signal_strength";
    this._dvbcSignalScanProfileName = "cable_signal_strength";
    this._dvbsSVLScanProfileName = "satellite_one_shot";
    this._dvbcSVLScanProfileName = "cable_one_shot";
    this._dvbtSVLScanProfileName = "terrestrial_one_shot";
    this._isdbtSVLScanProfileName = "isdbt_one_shot";
    this._dvbsSVLEPGScanProfileName = "satellite_persistent";
    this._dvbcSVLEPGScanProfileName = "cable_persistent";
    this._dvbtSVLEPGScanProfileName = "terrestrial_persistent";
    this._isdbtSVLEPGScanProfileName = "isdbt_continuous";

    // custom profiles
    this._scanProfilePath = this.DVBS_PROFILE;
    this._currentScanType = null;

    // callbacks
    this._scanCompleteCallback = null;
    this._scanProgressCallback = null;
    this._scanFailureCallback = null;
    this._lockConfiguration = null;
    this._isConfigurationLocked = false;
})();

/**
 * @method detectNetworkTypesAvailable
 * @removed
 * */

/**
 * Sets the CCOM scan profile parameters.
 * @method _initialiseScanProperties
 * @private
 * @param {Number} networkType Network type, which is one of the `NetworkType` enumeration.
 * @param {Object} properties Scan parameter object
 */
o5.platform.system.Scan._initialiseScanProperties = function _initialiseScanProperties (networkType, properties) {
    this.logEntry();
    var property,
        res;
    this._scanType = networkType;

    switch (networkType) {
        case o5.platform.system.Scan.NetworkType.DVBC:
            this._scanProfilePath = this.DVBC_PROFILE;
            break;
        case o5.platform.system.Scan.NetworkType.DVBS:
            this._scanProfilePath = this.DVBS_PROFILE;
            break;
        case o5.platform.system.Scan.NetworkType.DVBT:
            this._scanProfilePath = this.DVBT_PROFILE;
            break;
        case o5.platform.system.Scan.NetworkType.ISDBT:
            this._scanProfilePath = this.ISDBT_PROFILE;
            break;
    }
    for (property in properties) {
        if (properties.hasOwnProperty(property)) {
            res = CCOM.ConfigManager.setValue(this._scanProfilePath + property, properties[property]);
        }
    }
    this.logExit();
};

/**
 * Disables scanning for specific network type.
 * @method disableSignalScan
 * @param {Number} networkType Network type, which is one of the `NetworkType` enumeration.
 */
o5.platform.system.Scan.disableSignalScan = function disableSignalScan (networkType) {
    this.logEntry();
    var NETWORK_TYPE_DVBS = "DVBS",
        NETWORK_TYPE_DVBC = "DVBC",
        config = CCOM.ConfigManager;
    switch (networkType) {
        case NETWORK_TYPE_DVBS:
            config.setValue(this.SCANS_PATH + this._dvbsSignalScanProfileName + "/enabled", false);
            break;
        case NETWORK_TYPE_DVBC:
            config.setValue(this.SCANS_PATH + this._dvbcSignalScanProfileName + "/enabled", false);
            break;
    }
    this.logExit();
};

/**
 * Prepares scanning
 * @method _prepareScan
 * @private
 * @async
 * @param {Number} networkType Network type, which is one of the `NetworkType` enumeration.
 * @param {Object} parameters Scan parameter object
 * @param {Number} parameters.frequency Frequency in kHz (i.e. 11222000)
 * @param {Number} parameters.fecInner FEC inner, which is one of the `DVBS_InnerFEC` enumeration.
 * @param {Number} parameters.symbolRate Symbol rate in MHz (i.e. 28888)
 * @param {Number} parameters.networkId Network id (i.e. 0)
 * @param {Number} parameters.zoneId Zone id (i.e. 0)
 * @param {Number} parameters.lnbPolarization LNB polarization, which is one of the `DVBS_Polarization` enumeration.
 * @param {Boolean} parameters.isDVBS2 True if DVBS2, otherwise false for DVBS.
 * @param {Number} parameters.rollOff Roll off, which is one of the `DVBS_RollOff` enumeration.
 * @param {Number} parameters.modulation Modulation, which is one of the `DVBS_ModulationType` enumeration.
 * @param {String} parameters.lnbProfile LNB profile (i.e. Profile1)
 * @param {Number} parameters.lnbNewFreq LNB new frequency (i.e. 11100000)
 * @param {Boolean} parameters.lnbPower LNB power
 * @param {Boolean} isSignalScan True for signal strength, false for one shot.
 * @param {Function} callback Callback function to be invoked when done
 */
o5.platform.system.Scan._prepareScan = function _prepareScan (networkType, parameters, isSignalScan, callback) {
    this.logEntry();
    this._lockConfiguration = function (success) {
        this.logInfo("this._lockConfiguration callback, success: " + success);
        if (success) {
            switch (networkType) {
                case o5.platform.system.Scan.NetworkType.DVBC:
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLEPGScanProfileName + "/enabled", false);
                    if (isSignalScan) {
                        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSignalScanProfileName + "/enabled", true);
                    } else {
                        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLScanProfileName + "/enabled", true);
                    }
                    break;
                case o5.platform.system.Scan.NetworkType.DVBS:
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLEPGScanProfileName + "/enabled", false);
                    if (isSignalScan) {
                        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSignalScanProfileName + "/enabled", true);
                    } else {
                        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLScanProfileName + "/enabled", true);
                    }
                    break;
                case o5.platform.system.Scan.NetworkType.DVBT:
                    if (!isSignalScan) {
                        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLScanProfileName + "/enabled", true);
                    }
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLEPGScanProfileName + "/enabled", false);
                    break;
                case o5.platform.system.Scan.NetworkType.ISDBT:
                    if (!isSignalScan) {
                        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLScanProfileName + "/enabled", true);
                    }
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLEPGScanProfileName + "/enabled", false);
                    break;
            }
            if (parameters) {
                this._initialiseScanProperties(networkType, parameters);
            }
            this._lockConfiguration = null;
            this.logInfo("unlocking configuration");
            CCOM.SINetwork.unlockConfiguration();
            callback(true); // eslint-disable-line callback-return
        } else {
            callback(false); // eslint-disable-line callback-return
        }
        this._isConfigurationLocked = false;
    }.bind(this);
    this.logInfo("locking configuration");
    this._isConfigurationLocked = true;
    CCOM.SINetwork.lockConfiguration();
    this.logExit();
};

/**
 * Enables scanning for all configured Network classes during scan() operation
 * @method enableAutomaticScanning
 * @async
 */
o5.platform.system.Scan.enableAutomaticScanning = function enableAutomaticScanning () {
    this.logEntry();
    this._lockConfiguration = function (success) {
        this.logInfo("this._lockConfiguration callback, success: " + success);
        if (success) {
            switch (this._currentScanType) {
                case o5.platform.system.Scan.NetworkType.DVBC:
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLScanProfileName + "/enabled", false);
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLEPGScanProfileName + "/enabled", true);
                    break;
                case o5.platform.system.Scan.NetworkType.DVBS:
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLScanProfileName + "/enabled", false);
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLEPGScanProfileName + "/enabled", true);
                    break;
                case o5.platform.system.Scan.NetworkType.DVBT:
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLScanProfileName + "/enabled", false);
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLEPGScanProfileName + "/enabled", true);
                    break;
                case o5.platform.system.Scan.NetworkType.ISDBT:
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLScanProfileName + "/enabled", false);
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLEPGScanProfileName + "/enabled", true);
                    CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLEPGScanProfileName + "/persistent", true);
                    break;
            }
            this.logInfo("unlocking configuration");
            this._lockConfiguration = null;
            CCOM.SINetwork.unlockConfiguration();
            this._isConfigurationLocked = false;
        }
    }.bind(this);
    this.logInfo("locking configuration");
    this._isConfigurationLocked = true;
    CCOM.SINetwork.lockConfiguration();
    this.logExit();
};

/**
 * Clears the internal scan properties
 * @method _clearScanProperties
 * @private
 */
o5.platform.system.Scan._clearScanProperties = function _clearScanProperties () {
    this._scanHandle = null;
    this._scanError = null;
    this._scanProgressTimer = null;
    this._scanCompleteCallback = null;
    this._scanProgressCallback = null;
    this._scanFailureCallback = null;
};

/**
 * Stops internal interval for scan progress
 * @method _stopScanProgressTimer
 * @private
 */
o5.platform.system.Scan._stopScanProgressTimer = function _stopScanProgressTimer () {
    if (this._scanProgressTimer) {
        clearInterval(this._scanProgressTimer);
        this._scanProgressTimer = null;
    }
};

/**
 * Called in response to a onScanComplete event.
 * This event is fired once, when the scan has finished.
 * The method checks if an error occurred, and calls the corresponding callback if set.
 * @method _scanCompleteListener
 * @private
 * @param {Object} result Scan complete object
 */
o5.platform.system.Scan._scanCompleteListener = function _scanCompleteListener (result) {
    this.logEntry();
    if (this._scanError) {
        if (this._scanFailureCallback) {
            this.logInfo("calling this._scanFailureCallback");
            this._scanFailureCallback(this._scanError);
        } else {
            this.logInfo("this._scanFailureCallback not defined");
        }
    } else {
        // Re-register onServiceUpdate callback that was unregistered in startScan()
        o5.platform.btv.PersistentCache.addEPGServicesUpdatedListener(
            o5.platform.btv.EPG._onServiceUpdateCallback);
        // Refresh service list after scan complete
        o5.platform.btv.EPG.refresh();

        if (this._scanCompleteCallback) {
            this.logInfo("calling this._scanCompleteCallback: " + result);
            this._scanCompleteCallback(result);
        }
    }
    this._stopScanProgressTimer();
    this._clearScanProperties();
    this.logExit();
};

/**
 * Called in response to a onScanError event.
 * This event is fired during a scan error.  The method checks the error code, and
 * sets the scanError to one of the o5.platform.system.Scan.Error types.
 * @method _scanErrorListener
 * @private
 * @param {Object} result Error object
 */
o5.platform.system.Scan._scanErrorListener = function _scanErrorListener (result) {
    var reason;
    switch (result.condition) {
        case CCOM.SINetwork.UNKNOWN_ERROR:
            reason = "UNKNOWN_ERROR";
            this._scanError = o5.platform.system.Scan.Error.MISC_ERROR;
            break;
        case CCOM.SINetwork.DATABASE_FULL:
            reason = "DATABASE_FULL";
            this._scanError = o5.platform.system.Scan.Error.MISC_ERROR;
            break;
        case CCOM.SINetwork.TIMEOUT_OCCURRED:
            reason = "TIMEOUT_OCCURRED";
            this._scanError = o5.platform.system.Scan.Error.MISC_ERROR;
            break;
        case CCOM.SINetwork.SI_ERROR:
            reason = "SI_ERROR";
            this._scanError = o5.platform.system.Scan.Error.MISC_ERROR;
            break;
        case CCOM.SINetwork.RESOURCE_UNAVAILABLE:
            reason = "RESOURCE_UNAVAILABLE";
            this._scanError = o5.platform.system.Scan.Error.UNAVAILABLE;
            break;
        case CCOM.SINetwork.CONNECTION_ERROR:
            reason = "CONNECTION_ERROR";
            this._scanError = o5.platform.system.Scan.Error.UNAVAILABLE;
            break;
        case CCOM.SINetwork.BUSY:
            reason = "BUSY";
            this._scanError = o5.platform.system.Scan.Error.BUSY;
            break;
        case CCOM.SINetwork.SCAN_CANCELED:
            reason = "SCAN_CANCELED";
            this._scanError = o5.platform.system.Scan.Error.CANCELLED;
            break;
    }
    this.logError("_scanCompleteListener", "Scan error " + result.condition + ", " + reason, "error");
};

/**
 * Called in respone to a onScanProgress event.
 * This event is fired periodically during the scan process, after each transponder.
 * @method _scanProgressListener
 * @private
 * @param {Object} result ProgressInfo object
 */
o5.platform.system.Scan._scanProgressListener = function _scanProgressListener (result) {
    this.logEntry();
    var info = result.progressInfo,
        percentComplete = info.scannedPercent || 0,
        hdServicesFound = 0,
        sdServicesFound = info.tvServicesFoundCount || 0,
        radioServicesFound = info.radioServicesFoundCount || 0,
        totalServicesFound = info.totalServicesFoundCount || 0,
        signalStrengthFound = info.signalStrength || 0,
        signalQualityFound = info.SNR || 0,
        otherServicesFound = 0,
        scanInfo;

    if (this._scanProgressCallback) {
        scanInfo = {
            type: this._scanType,
            percentComplete: percentComplete,
            hdServices: hdServicesFound,
            sdServices: sdServicesFound,
            radioServices: radioServicesFound,
            signalStrength: signalStrengthFound,
            signalQuality: signalQualityFound,
            otherServices: otherServicesFound,
            totalServices: totalServicesFound
        };
        this._scanProgressCallback(scanInfo);
    }
    this.logExit();
};

/**
 * Called in response to a getScanProgressFailed event.
 * @method _getScanProgressFailedListener
 * @private
 * @param {Object} result Error object
 */
o5.platform.system.Scan._getScanProgressFailedListener = function _getScanProgressFailedListener (result) {
    this.logError(result.error.message);
};

/**
 * Prepares DVBS scan configuration
 * @method _createDVBSScans
 * @private
 */
o5.platform.system.Scan._createDVBSScans = function _createDVBSScans () {
    var tree = CCOM.ConfigManager.getSubtree(this.SCANS_PATH + this._dvbsSignalScanProfileName);
    if (tree.error) {
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSignalScanProfileName + "/networkClass", "Satellite");
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSignalScanProfileName + "/enabled", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSignalScanProfileName + "/persistent", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSignalScanProfileName + "/scanType", 0);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSignalScanProfileName + "/useConnectedTuners", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSignalScanProfileName + "/automatic", false);
    }
    tree = CCOM.ConfigManager.getSubtree(this.SCANS_PATH + this._dvbsSVLScanProfileName);
    if (tree.error) {
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLScanProfileName + "/networkClass", "Satellite");
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLScanProfileName + "/enabled", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLScanProfileName + "/persistent", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLScanProfileName + "/scanType", 1);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLScanProfileName + "/useConnectedTuners", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLScanProfileName + "/automatic", false);
    }
    tree = CCOM.ConfigManager.getSubtree(this.SCANS_PATH + this._dvbsSVLEPGScanProfileName);
    if (tree.error) {
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLEPGScanProfileName + "/networkClass", "Satellite");
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLEPGScanProfileName + "/enabled", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLEPGScanProfileName + "/persistent", true);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLEPGScanProfileName + "/scanType", 2);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLEPGScanProfileName + "/useConnectedTuners", true);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbsSVLEPGScanProfileName + "/automatic", true);
    }
};

/**
 * Deletes DVBS scan configuration
 * @method _deleteDVBSScan
 * @private
 */
o5.platform.system.Scan._deleteDVBSScan = function _deleteDVBSScan () {
    o5.platform.system.Preferences.deletePreferenceSubtree(this.SCANS_PATH + this._dvbsSignalScanProfileName, true);
    o5.platform.system.Preferences.deletePreferenceSubtree(this.SCANS_PATH + this._dvbsSVLScanProfileName, true);
    o5.platform.system.Preferences.deletePreferenceSubtree(this.SCANS_PATH + this._dvbsSVLEPGScanProfileName, true);
};

/**
 * Prepares DVBC scan configuration
 * @method _createDVBCScans
 * @private
 */
o5.platform.system.Scan._createDVBCScans = function _createDVBCScans () {
    var tree = CCOM.ConfigManager.getSubtree(this.SCANS_PATH + this._dvbcSignalScanProfileName);
    if (tree.error) {
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSignalScanProfileName + "/networkClass", "Cable");
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSignalScanProfileName + "/enabled", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSignalScanProfileName + "/persistent", true);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSignalScanProfileName + "/scanType", 0);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSignalScanProfileName + "/useConnectedTuners", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSignalScanProfileName + "/automatic", false);
    }
    tree = CCOM.ConfigManager.getSubtree(this.SCANS_PATH + this._dvbcSVLScanProfileName);
    if (tree.error) {
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLScanProfileName + "/networkClass", "Cable");
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLScanProfileName + "/enabled", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLScanProfileName + "/persistent", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLScanProfileName + "/scanType", 1);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLScanProfileName + "/useConnectedTuners", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLScanProfileName + "/automatic", false);
    }
    tree = CCOM.ConfigManager.getSubtree(this.SCANS_PATH + this._dvbcSVLEPGScanProfileName);
    if (tree.error) {
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLEPGScanProfileName + "/networkClass", "Cable");
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLEPGScanProfileName + "/enabled", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLEPGScanProfileName + "/persistent", true);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLEPGScanProfileName + "/scanType", 2);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLEPGScanProfileName + "/useConnectedTuners", true);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbcSVLEPGScanProfileName + "/automatic", true);
    }
};

/**
 * Deletes DVBC scan configuration
 * @method _deleteDVBCScan
 * @private
 */
o5.platform.system.Scan._deleteDVBCScan = function _deleteDVBCScan () {
    o5.platform.system.Preferences.deletePreferenceSubtree(this.SCANS_PATH + this._dvbcSignalScanProfileName, true);
    o5.platform.system.Preferences.deletePreferenceSubtree(this.SCANS_PATH + this._dvbcSVLScanProfileName, true);
    o5.platform.system.Preferences.deletePreferenceSubtree(this.SCANS_PATH + this._dvbcSVLEPGScanProfileName, true);
};

/**
 * Prepares DVBT scan configuration
 * @method _createDVBTScans
 * @private
 */
o5.platform.system.Scan._createDVBTScans = function _createDVBTScans () {
    var tree = CCOM.ConfigManager.getSubtree(this.SCANS_PATH + this._dvbtSVLScanProfileName);
    if (tree.error) {
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLScanProfileName + "/networkClass", "Terrestrial");
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLScanProfileName + "/enabled", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLScanProfileName + "/persistent", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLScanProfileName + "/scanType", 1);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLScanProfileName + "/useConnectedTuners", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLScanProfileName + "/automatic", false);
    }
    tree = CCOM.ConfigManager.getSubtree(this.SCANS_PATH + this._dvbtSVLEPGScanProfileName);
    if (tree.error) {
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLEPGScanProfileName + "/networkClass", "Terrestrial");
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLEPGScanProfileName + "/enabled", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLEPGScanProfileName + "/persistent", true);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLEPGScanProfileName + "/scanType", 2);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLEPGScanProfileName + "/useConnectedTuners", true);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._dvbtSVLEPGScanProfileName + "/automatic", true);
    }
};

/**
 * Deletes DVBT scan configuration
 * @method _deleteDVBTScan
 * @private
 */
o5.platform.system.Scan._deleteDVBTScan = function _deleteDVBTScan () {
    o5.platform.system.Preferences.deletePreferenceSubtree(this.SCANS_PATH + this._dvbtSVLScanProfileName, true);
    o5.platform.system.Preferences.deletePreferenceSubtree(this.SCANS_PATH + this._dvbtSVLEPGScanProfileName, true);
};

/**
 * Prepares ISDBT scan configuration
 * @method _createISDBTScans
 * @private
 */
o5.platform.system.Scan._createISDBTScans = function _createISDBTScans () {
    var tree = CCOM.ConfigManager.getSubtree(this.SCANS_PATH + this._isdbtSVLScanProfileName);
    if (tree.error) {
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLScanProfileName + "/networkClass", "ISDB-T");
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLScanProfileName + "/enabled", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLScanProfileName + "/persistent", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLScanProfileName + "/scanType", 1);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLScanProfileName + "/useConnectedTuners", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLScanProfileName + "/automatic", false);
    }
    tree = CCOM.ConfigManager.getSubtree(this.SCANS_PATH + this._isdbtSVLEPGScanProfileName);
    if (tree.error) {
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLEPGScanProfileName + "/networkClass", "ISDB-T");
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLEPGScanProfileName + "/enabled", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLEPGScanProfileName + "/persistent", false);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLEPGScanProfileName + "/scanType", 2);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLEPGScanProfileName + "/useConnectedTuners", true);
        CCOM.ConfigManager.setValue(this.SCANS_PATH + this._isdbtSVLEPGScanProfileName + "/automatic", true);
    }
};

/**
 * Deletes ISDBT scan configuration
 * @method _deleteISDBTScan
 * @private
 */
o5.platform.system.Scan._deleteISDBTScan = function _deleteISDBTScan () {
    o5.platform.system.Preferences.deletePreferenceSubtree(this.SCANS_PATH + this._isdbtSVLScanProfileName, true);
    o5.platform.system.Preferences.deletePreferenceSubtree(this.SCANS_PATH + this._isdbtSVLEPGScanProfileName, true);
};

/**
 * Check if scan configuration is present or missing
 * @method _checkScanConfigurationHelper
 * @private
 * @param {String} subPath Sub path to scan configuration
 * @return {Boolean} Returns true if configuration is missing and false if present.
 */
o5.platform.system.Scan._checkScanConfigurationHelper = function _checkScanConfigurationHelper (subPath) {

    if (o5.platform.system.Preferences.get(subPath + "/networkClass", true) === undefined) {
        return true;
    }
    if (o5.platform.system.Preferences.get(subPath + "/enabled", true) === undefined) {
        return true;
    }
    if (o5.platform.system.Preferences.get(subPath + "/persistent", true) === undefined) {
        return true;
    }
    if (o5.platform.system.Preferences.get(subPath + "/scanType", true) === undefined) {
        return true;
    }
    if (o5.platform.system.Preferences.get(subPath + "/useConnectedTuners", true) === undefined) {
        return true;
    }
    if (o5.platform.system.Preferences.get(subPath + "/automatic", true) === undefined) {
        return true;
    }

    return false;
};

/**
 * Check if DVB-S scan configuration is present or missing
 * @method _checkDVBSScanConfiguration
 * @private
 * @return {Boolean} Returns true if configuration is missing and false if present.
 */
o5.platform.system.Scan._checkDVBSScanConfiguration = function _checkDVBSScanConfiguration () {
    var subPath;

    subPath = this.SCANS_PATH + this._dvbsSignalScanProfileName;
    if (this._checkScanConfigurationHelper(subPath)) {
        return true;
    }

    subPath = this.SCANS_PATH + this._dvbsSVLScanProfileName;
    if (this._checkScanConfigurationHelper(subPath)) {
        return true;
    }

    subPath = this.SCANS_PATH + this._dvbsSVLEPGScanProfileName;
    if (this._checkScanConfigurationHelper(subPath)) {
        return true;
    }

    return false;
};

/**
 * Check if DVB-C scan configuration is present or missing
 * @method _checkDVBCScanConfiguration
 * @private
 * @return {Boolean} Returns true if configuration is missing and false if present.
 */
o5.platform.system.Scan._checkDVBCScanConfiguration = function _checkDVBCScanConfiguration () {
    var subPath;

    subPath = this.SCANS_PATH + this._dvbcSignalScanProfileName;
    if (this._checkScanConfigurationHelper(subPath)) {
        return true;
    }

    subPath = this.SCANS_PATH + this._dvbcSVLScanProfileName;
    if (this._checkScanConfigurationHelper(subPath)) {
        return true;
    }

    subPath = this.SCANS_PATH + this._dvbcSVLEPGScanProfileName;
    if (this._checkScanConfigurationHelper(subPath)) {
        return true;
    }

    return false;
};

/**
 * Check if DVB-T scan configuration is present or missing
 * @method _checkDVBTScanConfiguration
 * @private
 * @return {Boolean} Returns true if configuration is missing and false if present.
 */
o5.platform.system.Scan._checkDVBTScanConfiguration = function _checkDVBTScanConfiguration () {
    var subPath;

    subPath = this.SCANS_PATH + this._dvbtSVLScanProfileName;
    if (this._checkScanConfigurationHelper(subPath)) {
        return true;
    }

    subPath = this.SCANS_PATH + this._dvbtSVLEPGScanProfileName;
    if (this._checkScanConfigurationHelper(subPath)) {
        return true;
    }

    return false;
};

/**
 * Check if ISDB-T scan configuration is present or missing
 * @method _checkISDBTScanConfiguration
 * @private
 * @return {Boolean} Returns true if configuration is missing and false if present.
 */
o5.platform.system.Scan._checkISDBTScanConfiguration = function _checkISDBTScanConfiguration () {
    var subPath;

    subPath = this.SCANS_PATH + this._isdbtSVLScanProfileName;
    if (this._checkScanConfigurationHelper(subPath)) {
        return true;
    }

    subPath = this.SCANS_PATH + this._isdbtSVLEPGScanProfileName;
    if (this._checkScanConfigurationHelper(subPath)) {
        return true;
    }

    return false;
};

/**
 * Creates scan configuration for each enabled network type
 * @method _createScans
 * @private
 */
o5.platform.system.Scan._createScans = function _createScans () {
    var configMissing = true;

    this.logEntry();
    this._lockConfiguration = function (success) {
        this.logInfo("this._lockConfiguration callback, success: " + success);
        if (this._isDVBSEnabled) {
            this._createDVBSScans();
        }
        if (this._isDVBCEnabled) {
            this._createDVBCScans();
        }
        if (this._isDVBTEnabled) {
            this._createDVBTScans();
        }
        if (this._isISDBTEnabled) {
            this._createISDBTScans();
        }
        this._lockConfiguration = null;
        this.logInfo("unlocking configuration");
        CCOM.SINetwork.unlockConfiguration();
        this._isConfigurationLocked = false;
    }.bind(this);

    if (this._isDVBSEnabled) {
        configMissing = this._checkDVBSScanConfiguration();
    }

    if (this._isDVBCEnabled) {
        configMissing = this._checkDVBCScanConfiguration();
    }

    if (this._isDVBTEnabled) {
        configMissing = this._checkDVBTScanConfiguration();
    }

    if (this._isISDBTEnabled) {
        configMissing = this._checkISDBTScanConfiguration();
    }

    // Lock and write to configuration if they are missing
    if (configMissing) {
        this.logInfo("Lock and write scan configuration.");
        this._isConfigurationLocked = true;
        CCOM.SINetwork.lockConfiguration();
    }
    this.logExit();
};

/**
 * Initializes the Scan singleton.
 * @method init
 * @param {Object} [configuration] Network type configuration
 * @param {Boolean} [configuration.isDVBSEnable=true] True if DVBS is enabled
 * @param {Boolean} [configuration.isDVBCEnabled=false] True if DVBC is enabled
 * @param {Boolean} [configuration.isDVBTEnabled=false] True if DVBT is enabled
 * @param {Boolean} [configuration.isISDBTEnabled=false] True if ISDBT is enabled
 */
o5.platform.system.Scan.init = function init (configuration) {
    this.logEntry();

    if (!configuration) {
        configuration = {};
        configuration.isDVBSEnabled = true;
        configuration.isDVBCEnabled = false;
        configuration.isDVBTEnabled = false;
        configuration.isISDBTEnabled = false;
        this.logInfo("using default configuration");
    }
    this._isDVBSEnabled = configuration.isDVBSEnabled;
    this._isDVBCEnabled = configuration.isDVBCEnabled;
    this._isDVBTEnabled = configuration.isDVBTEnabled;
    this._isISDBTEnabled = configuration.isISDBTEnabled;

    this.logInfo("initialise with configuration:");
    this.logInfo("            this._isDVBSEnabled=" + this._isDVBSEnabled);
    this.logInfo("            this._isDVBCEnabled=" + this._isDVBCEnabled);
    this.logInfo("            this._isDVBTEnabled=" + this._isDVBTEnabled);
    this.logInfo("            this._isISDBTEnabled=" + this._isISDBTEnabled);

    // add event listeners
    CCOM.SINetwork.addEventListener("onScanComplete", this._scanCompleteListener.bind(this));
    CCOM.SINetwork.addEventListener("onScanError", this._scanErrorListener.bind(this));
    CCOM.SINetwork.addEventListener("onScanProgress", this._scanProgressListener.bind(this));
    CCOM.SINetwork.addEventListener("getScanProgressOK", this._scanProgressListener.bind(this));
    CCOM.SINetwork.addEventListener("getScanProgressFailed", this._getScanProgressFailedListener.bind(this));
    CCOM.SINetwork.addEventListener("lockConfigurationOK", function () {
        if (this._lockConfiguration) {
            this._lockConfiguration(true);
        }
    }.bind(this));
    CCOM.SINetwork.addEventListener("lockConfigurationFailed", function () {
        if (this._lockConfiguration) {
            this._lockConfiguration(false);
        }
    }.bind(this));

    this._createScans();
    this.logExit();
};

/**
 * Initializes the Scan singleton.
 * @method initialise
 * @deprecated use init()
 * @param {Object} [configuration] Network type configuration
 * @param {Boolean} [configuration.isDVBSEnable=true] True if DVBS is enabled
 * @param {Boolean} [configuration.isDVBCEnabled=false] True if DVBC is enabled
 * @param {Boolean} [configuration.isDVBTEnabled=false] True if DVBT is enabled
 * @param {Boolean} [configuration.isISDBTEnabled=false] True if ISDBT is enabled
 */
o5.platform.system.Scan.initialise = function initialise (configuration) {
    this.init(configuration);
};

/**
 * Set the callback function to be invoked upon scan completion.
 * @method setScanCompleteCallback
 * @param {Function} callback Callback function to set
 */
o5.platform.system.Scan.setScanCompleteCallback = function setScanCompleteCallback (callback) {
    this.logInfo("Setting scan complete callback.");
    this._scanCompleteCallback = callback;
};

/**
 * Set the callback function to be invoked during scan progress. The callback will be updated
 * at the duration set by the interval parameter.
 * @method setScanProgressCallback
 * @param {Function} callback Callback function to set
 */
o5.platform.system.Scan.setScanProgressCallback = function setScanProgressCallback (callback) {
    this.logInfo("Setting scan progress callback.");
    this._scanProgressCallback = callback;
};

/**
 * Set the callback function to be invoked upon scan failure.
 * @method setScanFailureCallback
 * @param {Function} callback Callback function to set
 */
o5.platform.system.Scan.setScanFailureCallback = function setScanFailureCallback (callback) {
    this.logInfo("Setting scan failure callback.");
    this._scanFailureCallback = callback;
};

/**
 * Starts the scan of the specified network type.  A full scan is performed unless specified
 * in the optional parameters parameter.
 * @method startScan
 * @async
 * @param {Number} networkType Network type, which is one of the `NetworkType` enumeration.
 * @param {Object} parameters Scan parameter object
 * @param {Number} parameters.frequency Frequency in kHz (i.e. 11222000)
 * @param {Number} parameters.fecInner FEC inner, which is one of the `DVBS_InnerFEC` enumeration.
 * @param {Number} parameters.symbolRate Symbol rate (i.e. 28888)
 * @param {Number} parameters.networkId Network id (i.e. 0)
 * @param {Number} parameters.zoneId Zone id (i.e. 0)
 * @param {Number} parameters.lnbPolarization LNB polarization, which is one of the `DVBS_Polarization` enumeration.
 * @param {Boolean} parameters.isDVBS2 True if DVBS2, otherwise false for DVBS
 * @param {Number} parameters.rollOff Roll off, which is one of the `DVBS_RollOff` enumeration.
 * @param {Number} parameters.modulation Modulation, which is one of the `DVBS_ModulationType` enumeration.
 * @param {String} parameters.lnbProfile LNB profile (i.e. Profile1)
 * @param {Number} parameters.lnbNewFreq LNB new frequency (i.e. 11100000)
 * @param {Boolean} parameters.lnbPower LNB power
 * @param {Boolean} [isSignalScan=false] True for signal strength, false for one shot.
 * @return {Boolean} Returns true if scan started or false if a scan is already in progress.
 */
o5.platform.system.Scan.startScan = function startScan (networkType, parameters, isSignalScan) {
    this.logEntry();
    var result;

    if (this._scanHandle) {
        this.logWarning("Scan already in progress!");
        return false;
    }
    // Unregister onServiceUpdate callback before start scan
    o5.platform.btv.PersistentCache.removeEPGServicesUpdatedListener(
        o5.platform.btv.EPG._onServiceUpdateCallback);

    this._currentScanType = networkType;
    this._prepareScan(networkType, parameters, isSignalScan, function (success) {
        if (success) {
            this.logInfo("Starting scan...");
            switch (networkType) {
                case o5.platform.system.Scan.NetworkType.DVBC:
                    if (isSignalScan) {
                        result = CCOM.SINetwork.scan(this._dvbcSignalScanProfileName);
                    } else {
                        result = CCOM.SINetwork.scan(this._dvbcSVLScanProfileName);
                    }
                    break;
                case o5.platform.system.Scan.NetworkType.DVBS:
                    if (isSignalScan) {
                        result = CCOM.SINetwork.scan(this._dvbsSignalScanProfileName);
                    } else {
                        result = CCOM.SINetwork.scan(this._dvbsSVLScanProfileName);
                    }
                    break;
                case o5.platform.system.Scan.NetworkType.DVBT:
                    result = CCOM.SINetwork.scan(this._dvbtSVLScanProfileName);
                    break;
                case o5.platform.system.Scan.NetworkType.ISDBT:
                    result = CCOM.SINetwork.scan(this._isdbtSVLScanProfileName);
                    break;
            }
            if (result.error) {
                this.logError("Scan error code: " + result.error);
                if (this._scanFailureCallback) {
                    this.logInfo("calling this._scanFailureCallback");
                    this._scanFailureCallback(o5.platform.system.Scan.Error.MISC_ERROR);
                }
            } else {
                this.logInfo("Scan started, scan handle " + result.scanHandle);
                this._scanHandle = result.scanHandle;
                this._scanProgressTimer = setInterval(function () {
                    CCOM.SINetwork.getScanProgress(this._scanHandle);
                }.bind(this), this.SCAN_INTERVAL_TIME);
            }
        } else if (this._scanFailureCallback) {
            this.logInfo("calling this._scanFailureCallback");
            this._scanFailureCallback(o5.platform.system.Scan.Error.MISC_ERROR);
        }
    }.bind(this));
    this.logExit("startScan");
    return true;
};

/**
 * Cancels the currently running scan.
 * @method cancelScan
 */
o5.platform.system.Scan.cancelScan = function cancelScan () {
    if (this._scanHandle) {
        this.logInfo("Cancelling scan.");
        CCOM.SINetwork.cancelScan(this._scanHandle);
        this._stopScanProgressTimer();
        this._clearScanProperties();
    } else {
        this.logWarning("No current scan in progress.");
    }
};

/**
 * Deletes configuration values for all Network Class types
 * @method deleteScan
 */
o5.platform.system.Scan.deleteScan = function deleteScan () {
    this._deleteDVBSScan();
    this._deleteDVBCScan();
    this._deleteDVBTScan();
    this._deleteISDBTScan();
};

/**
 * Checks whether CCOM.SINetwork Configuration is currently locked.
 * Configuration can appear locked when Scan object is in the process
 * of configuring Scan parameters for next Scan.
 * @method isScanConfigurationLocked
 * @return {Boolean} Returns true if scan configuration is locked
 */
o5.platform.system.Scan.isScanConfigurationLocked = function isScanConfigurationLocked () {
    /*UNOTVG-1806:[Channel Scan]The ISDB-T should be "Not Available" when do channel scan after remove ISDB-T signal.*/
    /* MW expects only one lock configuration at a time. In case of Auto scan of DVB-S and ISDB-T, after DVB-S scan completed,
     * auto scan is started for collecting the EPG for DVB by locking this._dvbsSVLEPGScanProfileName. But MW will take time before
     * sending the lockConfigurationOK. In the mean time Scan for ISDB-T will be started and Lock configuration will be called again.
     * This results in conflict in MW, where multiple lock configurations have been called.
     * To make this sequential below flag is used */
    return this._isConfigurationLocked;
};

/**
 * Enumeration of Scan Network types.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} NetworkType
 * @property {Number} NetworkType.DVBS 0
 * @property {Number} NetworkType.DVBC 1
 * @property {Number} NetworkType.DVBT 2
 * @property {Number} NetworkType.DVBT_ATSC 3
 * @property {Number} NetworkType.IP 4
 * @property {Number} NetworkType.ISDBT 5
 */
o5.platform.system.Scan.NetworkType = {
    DVBS: 0,
    DVBC: 1,
    DVBT: 2,
    DVBT_ATSC: 3,
    IP: 4,
    ISDBT: 5
};

/**
 * Enumeration of scan errors.
 * @readonly
 * @property {Number} Error
 * @property {Number} Error.MISC_ERROR 1
 * @property {Number} Error.BUSY 2
 * @property {Number} Error.INVALID_PARAMS 3
 * @property {Number} Error.UNAVAILABLE 4
 * @property {Number} Error.CANCELLED 5
 */
o5.platform.system.Scan.Error = {
    MISC_ERROR: 1,
    BUSY: 2,
    INVALID_PARAMS: 3,
    UNAVAILABLE: 4,
    CANCELLED: 5
};

/**
 * Enumeration of DVBC Modulation types.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} DVBC_Modulation
 * @property {Number} DVBC_Modulation.QAM16 1
 * @property {Number} DVBC_Modulation.QAM32 2
 * @property {Number} DVBC_Modulation.QAM64 3
 * @property {Number} DVBC_Modulation.QAM128 4
 * @property {Number} DVBC_Modulation.QAM256 5
 */
o5.platform.system.Scan.DVBC_Modulation = {
    QAM16: 1,
    QAM32: 2,
    QAM64: 3,
    QAM128: 4,
    QAM256: 5
};

/**
 * Enumeration of ISDBT guard intervals.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} ISDBT_GuardInterval
 * @property {Number} ISDBT_GuardInterval._1_4 3
 * @property {Number} ISDBT_GuardInterval._1_8 2
 * @property {Number} ISDBT_GuardInterval._1_16 1
 * @property {Number} ISDBT_GuardInterval._1_32 0
 */
o5.platform.system.Scan.ISDBT_GuardInterval = {
    _1_4: 3,
    _1_8: 2,
    _1_16: 1,
    _1_32: 0
};

/**
 * Enumeration of ISDBT transmission mode.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} ISDBT_Mode
 * @property {Number} ISDBT_Mode.mode1 0
 * @property {Number} ISDBT_Mode.mode2 1
 * @property {Number} ISDBT_Mode.mode3 2
 */
o5.platform.system.Scan.ISDBT_Mode = {
    mode1: 0,
    mode2: 1,
    mode3: 2
};

/**
 * Enumeration of DVBC Outer FEC types.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} DVBC_OuterFEC
 * @property {Number} DVBC_OuterFEC.AUTO 0
 * @property {Number} DVBC_OuterFEC.REED 1
 */
o5.platform.system.Scan.DVBC_OuterFEC = {
    AUTO: 0,
    REED: 1
};

/**
 * Enumeration of DVBS Inner FEC types.
 * @readonly
 * @property {Number} DVBS_InnerFEC
 * @property {Number} DVBS_InnerFEC._1_2 1
 * @property {Number} DVBS_InnerFEC._2_3 2
 * @property {Number} DVBS_InnerFEC._3_4 3
 * @property {Number} DVBS_InnerFEC._5_6 4
 * @property {Number} DVBS_InnerFEC._7_8 5
 * @property {Number} DVBS_InnerFEC._8_9 6
 * @property {Number} DVBS_InnerFEC._3_5 7
 * @property {Number} DVBS_InnerFEC._4_5 8
 * @property {Number} DVBS_InnerFEC._9_10 9
 * @property {Number} DVBS_InnerFEC.NONE 15
 */
o5.platform.system.Scan.DVBS_InnerFEC = {
    _1_2: 1,
    _2_3: 2,
    _3_4: 3,
    _5_6: 4,
    _7_8: 5,
    _8_9: 6,
    _3_5: 7,
    _4_5: 8,
    _9_10: 9,
    NONE: 15
};

/**
 * @readonly
 * @property {Number} DVBS_Orbit
 * @property {Number} DVBS_Orbit.WEST 0
 * @property {Number} DVBS_Orbit.EAST 1
 * @removed
 */
//o5.platform.system.Scan.DVBS_Orbit = { };

/**
 * Enumeration of DVBS/DVBS2 mode.
 * @readonly
 * @property {Boolean} DVBS_Mode
 * @property {Boolean} DVBS_Mode.DVBS false
 * @property {Boolean} DVBS_Mode.DVBS2 true
 */
o5.platform.system.Scan.DVBS_Mode = {
    DVBS: false,
    DVBS2: true
};

/**
 * Enumeration of DVBS LNB Polarization.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} DVBS_Polarization
 * @property {Number} DVBS_Polarization.LINEAR_HORIZONTAL 0
 * @property {Number} DVBS_Polarization.LINEAR_VERTICAL 1
 * @property {Number} DVBS_Polarization.CIRCULAR_LEFT 2
 * @property {Number} DVBS_Polarization.CIRCULAR_RIGHT 3
 */
o5.platform.system.Scan.DVBS_Polarization = {
    LINEAR_HORIZONTAL: 0,
    LINEAR_VERTICAL: 1,
    CIRCULAR_LEFT: 2,
    CIRCULAR_RIGHT: 3
};

/**
 * Enumeration of DVB-S2 Roll-off.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} DVBS_RollOff
 * @property {Number} DVBS_RollOff._0_35 0
 * @property {Number} DVBS_RollOff._0_25 1
 * @property {Number} DVBS_RollOff._0_20 2
 */
o5.platform.system.Scan.DVBS_RollOff = {
    _0_35: 0,
    _0_25: 1,
    _0_20: 2
};

/**
 * @property {Number} DVBS_ModulationSystem
 * @removed
 */

/**
 * Enumeration of Satellite Modulation scheme.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} DVBS_ModulationType
 * @property {Number} DVBS_ModulationType.AUTO 0
 * @property {Number} DVBS_ModulationType.QPSK 1
 * @property {Number} DVBS_ModulationType._8PSK 2
 * @property {Number} DVBS_ModulationType._16PSK 3
 */
o5.platform.system.Scan.DVBS_ModulationType = {
    AUTO: 0,
    QPSK: 1,
    _8PSK: 2,
    _16PSK: 3
};

/**
 * Enumeration of DVBT Bandwidth types.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} DVBT_tunerBandwidth
 * @property {Number} DVBT_tunerBandwidth._0_8 0
 * @property {Number} DVBT_tunerBandwidth._0_7 1
 * @property {Number} DVBT_tunerBandwidth._0_6 2
 * @property {Number} DVBT_tunerBandwidth._0_5 3
 */
o5.platform.system.Scan.DVBT_tunerBandwidth = {
    _0_8: 0,
    _0_7: 1,
    _0_6: 2,
    _0_5: 3
};

/**
 * @property {Number} DVBT_Priority
 * @removed
 */

/**
 * Enumeration of DVBT Constellation types.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} DVBT_Constellation
 * @property {Number} DVBT_Constellation.QPSK 0
 * @property {Number} DVBT_Constellation.QAM16 1
 * @property {Number} DVBT_Constellation.QAM64 2
 */
o5.platform.system.Scan.DVBT_Constellation = {
    QPSK: 0,
    QAM16: 1,
    QAM64: 2
};

/**
 * Enumeration of Terrestrial hierarchy information.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} DVBT_HierarchInfo
 * @property {Number} DVBT_HierarchInfo._a0_0 0
 * @property {Number} DVBT_HierarchInfo._a1_1 1
 * @property {Number} DVBT_HierarchInfo._a2_2 2
 * @property {Number} DVBT_HierarchInfo._a4_3 3
 * @property {Number} DVBT_HierarchInfo._a0_4 4
 * @property {Number} DVBT_HierarchInfo._a1_5 5
 * @property {Number} DVBT_HierarchInfo._a2_6 5
 * @property {Number} DVBT_HierarchInfo._a4_7 5
 */
o5.platform.system.Scan.DVBT_HierarchInfo = {
    _a0_0: 0,
    _a1_1: 1,
    _a2_2: 2,
    _a4_3: 3,
    _a0_4: 4,
    _a1_5: 5,
    _a2_6: 5,
    _a4_7: 5
};

/**
 * Enumeration of terrestrial high priority stream code rate.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} DVBT_HPCodeRate
 * @property {Number} DVBT_HPCodeRate._0_0 0
 * @property {Number} DVBT_HPCodeRate._0_1 1
 * @property {Number} DVBT_HPCodeRate._0_2 2
 * @property {Number} DVBT_HPCodeRate._0_3 3
 * @property {Number} DVBT_HPCodeRate._0_4 4
 */
o5.platform.system.Scan.DVBT_HPCodeRate = {
    _0_0: 0,
    _0_1: 1,
    _0_2: 2,
    _0_3: 3,
    _0_4: 4
};

/**
 * Enumeration of terrestrial low priority stream code rate.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} DVBT_LPCodeRate
 * @property {Number} DVBT_LPCodeRate._0_0 0
 * @property {Number} DVBT_LPCodeRate._0_1 1
 * @property {Number} DVBT_LPCodeRate._0_2 2
 * @property {Number} DVBT_LPCodeRate._0_3 3
 * @property {Number} DVBT_LPCodeRate._0_4 4
 */
o5.platform.system.Scan.DVBT_LPCodeRate = {
    _0_0: 0,
    _0_1: 1,
    _0_2: 2,
    _0_3: 3,
    _0_4: 4
};

/**
 * Enumeration of DVBT guard intervals.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} DVBT_GuardInterval
 * @property {Number} DVBT_GuardInterval._1_4 3
 * @property {Number} DVBT_GuardInterval._1_8 2
 * @property {Number} DVBT_GuardInterval._1_16 1
 * @property {Number} DVBT_GuardInterval._1_32 0
 */
o5.platform.system.Scan.DVBT_GuardInterval = {
    _1_4: 3,
    _1_8: 2,
    _1_16: 1,
    _1_32: 0
};

/**
 * Enumeration of DVB-T transmission mode.
 * The actual values used match the values in "Appendix A: SI Collection Configuration Scheme" section
 * of the OpenTV5 Configuration Guide.
 * @readonly
 * @property {Number} DVBT_TransmissionMode
 * @property {Number} DVBT_TransmissionMode._0_2k 0
 * @property {Number} DVBT_TransmissionMode._0_8k 1
 * @property {Number} DVBT_TransmissionMode._0_4k 2
 */
o5.platform.system.Scan.DVBT_TransmissionMode = {
    _0_2k: 0,
    _0_8k: 1,
    _0_4k: 2
};

/**
 * @property {Number} DVBT_Bandwidth
 * @readonly
 * @removed
 */

// uncomment to turn debugging on for Scan object
// o5.log.setAll(o5.platform.system.Scan, true);
