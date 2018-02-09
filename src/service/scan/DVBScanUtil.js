/**
 * @class DVBScanUtil
 * @service/scan
 */

$service.scan.DVBScanUtil = (function DVBScanUtil() {
	var log = function () {},
		isDVBSEnabled = false,
		isDVBCEnabled = false,
		isISDBTEnabled = false,
		isDVBTEnabled = false,
		jsfwPrefsPrefix = "/applications/shared/",
		DEFAULT_PROFILE_STORED_PATH = 'scan/profiles',
		DVBS_SUB_FOLDER_PATH = 'dvbs',
		DVBC_SUB_FOLDER_PATH = 'dvbc',
		ISDBT_SUB_FOLDER_PATH = 'isdbt',
		DVBT_SUB_FOLDER_PATH = 'dvbt',
		NETWORK_TYPE_DVBS = "DVBS",
		NETWORK_TYPE_DVBC = "DVBC",
		NETWORK_TYPE_ISDBT = "ISDBT",
		NETWORK_TYPE_DVBT = "DVBT",
		DVBS_PROFILE_PATH =  '/network/siconfig/networkClasses/Satellite/transponders/0/dvbs',
		dvbsParameters = {
			'frequency': 11953000,
			'symbolRate': 27500,
			'fecInner': o5.platform.system.Scan.DVBS_InnerFEC._3_4,
			'rollOff': o5.platform.system.Scan.DVBS_RollOff._0_20,
			'modulation': o5.platform.system.Scan.DVBS_ModulationType.QPSK,
			'lnbPolarization': o5.platform.system.Scan.DVBS_Polarization.LINEAR_HORIZONTAL,
			'isDVBS2': o5.platform.system.Scan.DVBS_Mode.DVBS,
			'networkId': 1
		},
		NetworkType = {},
		zoneIdPath = '/network/siconfig/zoneId',
		defaultZoneId = 0,
		dvbsLnbProfilePath = '/system/devices/tnrmgr',
		dvbsLnbParameters = {
			"lnbFreqLoKhz": 10700000,
			"lnbFreqHiKhz": 10700000,
			"lnbFreqSwKhz": 10700000,
			"lnbPower": false
		},
		DVBC_PROFILE_PATH =  '/network/siconfig/networkClasses/Cable/transponders/0/dvbc',
		dvbcParameters = {
			'frequency': 243000,
			'fecInner': o5.platform.system.Scan.DVBS_InnerFEC._3_4,
			'fecOuter': o5.platform.system.Scan.DVBC_OuterFEC.AUTO,
			'modulation': o5.platform.system.Scan.DVBS_ModulationType.QPSK,
			'isDvbC2': false,
			'symbolRate': 27500,
			'networkId': 1
		},
		ISDBT_PROFILE_PATH = '/network/siconfig/networkClasses/ISDB-T/transponders/0/isdbt',
		isdbtParameters = {
			'frequency': 497143,
			'endFrequency': 797143,
			'guardInterval': o5.platform.system.Scan.ISDBT_GuardInterval._1_16,
			'mode': o5.platform.system.Scan.ISDBT_Mode.mode3,
			'areaCode': 2621
		},
		DVBT_PROFILE_PATH = '/network/siconfig/networkClasses/Terrestrial/transponders/0/dvbt',
		dvbtParameters = {
			'frequency': 498000,
			'endFrequency': 600000,
			'guardInterval': o5.platform.system.Scan.ISDBT_GuardInterval._1_4,
			'tunerBandwidth': o5.platform.system.Scan.DVBT_tunerBandwidth._0_8,
			'hierarchyPriority': o5.platform.system.Scan.DVBT_HierarchInfo._a0_0,
			'hierarchy': 0,
			'constellation': o5.platform.system.Scan.DVBT_Constellation.QAM64,
			'HPCodeRate': o5.platform.system.Scan.DVBT_HPCodeRate._0_2,
			'LPCodeRate': o5.platform.system.Scan.DVBT_LPCodeRate._0_3,
			'transmissionMode': o5.platform.system.Scan.DVBT_TransmissionMode._0_8k,
			'otherFrequenciesInUse': false
		},
        lnbProfileValuesForDVBS = [],
        lnbProfilesOptions = $config.getConfigValue("dvb.scan.parameters"),
		getDefaultScanningParams;

	/**
	 * Sets the value in to the configman
	 * jsfw preferences class omits false and zero values - so using custom method here
	 */
	function setValueToConfig(pref, value) {
		var returnValue = null;
		if (value !== undefined) {
			returnValue = CCOM.ConfigManager.setValue(pref, value);
		}
		return (returnValue && !returnValue.error);
	}
	function getValueFromConfig(pref) {
		var returnValue = CCOM.ConfigManager.getValue(pref);
		if (returnValue !== undefined && !returnValue.error) {
			return returnValue.keyValue;
		} else {
			return '';
		}
	}
	function getNetworktypeCode(networktype) {
		switch (networktype) {
		case NETWORK_TYPE_DVBS:
			return NetworkType.DVBS;
		case NETWORK_TYPE_DVBC:
			return NetworkType.DVBC;
		case NETWORK_TYPE_ISDBT:
			return NetworkType.ISDBT;
		case NETWORK_TYPE_DVBT:
			return NetworkType.DVBT;
		}
	}

	/**
	 * Updates the LNB default values in configman
	 * @private
	 * @method updateLnbConfigmanDefaultValues
	 * @param {string} configmanKey
	 * @param {number|boolean} updatedValue
	 */
	function updateLnbConfigmanDefaultValue(configmanKey, updatedValue) {
		setValueToConfig(dvbsLnbProfilePath + '/' + configmanKey, updatedValue);
	}

	/* Public API */
	return {
		/**
		 * initialise the DVBScanUtil
		 * @method initialise
		 */
		initialise: function () {
			log("initialise", "Enter");
			var storedAutoProfile = getValueFromConfig(jsfwPrefsPrefix + DEFAULT_PROFILE_STORED_PATH + '/' + DVBS_SUB_FOLDER_PATH + '/frequency'),
				currentParameterKey,
				defaultConfigValue,
				configuredTunerType = $config.getConfigValue("stb.tuner.type"),
				key;
			if (configuredTunerType === "ALL") {
				isDVBSEnabled = true;
				isDVBCEnabled = true;
				isISDBTEnabled = true;
				isDVBTEnabled = true;
			} else {
				if (configuredTunerType.indexOf("DVBS") > -1) {
					isDVBSEnabled = true;
				}
				if (configuredTunerType.indexOf("DVBC") > -1) {
					isDVBCEnabled = true;
				}
				if (configuredTunerType.indexOf("ISDBT") > -1) {
					isISDBTEnabled = true;
				}
				if (configuredTunerType.indexOf("DVBT") > -1) {
					isDVBTEnabled = true;
				}
			}
			if (isDVBSEnabled) {
				for (key in lnbProfilesOptions) {
				    if (lnbProfilesOptions.hasOwnProperty(key)) {
				        lnbProfileValuesForDVBS.push({
	                        option: key,
	                        value: key
	                    });
	                }
	            }
			}
			NetworkType = o5.platform.system.Scan.NetworkType;
			if (!storedAutoProfile || storedAutoProfile.error) {
				if (isDVBSEnabled) {
					//storing dvbs values
					for (key in dvbsParameters) {
						if (dvbsParameters.hasOwnProperty(key)) {
							currentParameterKey = key;
							defaultConfigValue = getValueFromConfig(DVBS_PROFILE_PATH + '/' + currentParameterKey);
							if (defaultConfigValue === undefined || defaultConfigValue === '') {
								//if not there use hardcoded value
								defaultConfigValue = dvbsParameters[key];
							}
							setValueToConfig(jsfwPrefsPrefix + DEFAULT_PROFILE_STORED_PATH + '/' + DVBS_SUB_FOLDER_PATH + '/' + currentParameterKey, defaultConfigValue);
						}
					}
					//storing dvbs lnb values
					for (key in dvbsLnbParameters) {
						if (dvbsLnbParameters.hasOwnProperty(key)) {
							currentParameterKey = key;
							defaultConfigValue = getValueFromConfig(dvbsLnbProfilePath + '/' + currentParameterKey);
							if (defaultConfigValue === undefined || defaultConfigValue === '') {
								defaultConfigValue = dvbsLnbParameters[key];
							}
							setValueToConfig(jsfwPrefsPrefix + DEFAULT_PROFILE_STORED_PATH + '/' + DVBS_SUB_FOLDER_PATH + '/' + currentParameterKey, defaultConfigValue);
						}
					}
				}
				if (isDVBTEnabled) {
					for (key in dvbtParameters) {
						if (dvbtParameters.hasOwnProperty(key)) {
							currentParameterKey = key;
							defaultConfigValue = getValueFromConfig(DVBT_PROFILE_PATH + '/' + currentParameterKey);
							if (defaultConfigValue === undefined || defaultConfigValue === '') {
								defaultConfigValue = dvbtParameters[key];
							}
							setValueToConfig(jsfwPrefsPrefix + DEFAULT_PROFILE_STORED_PATH + '/' + DVBT_SUB_FOLDER_PATH + '/' + currentParameterKey, defaultConfigValue);
						}
					}
				}
				//storing zonId - common path for all
				defaultConfigValue = getValueFromConfig(zoneIdPath);
				if (defaultConfigValue === undefined || defaultConfigValue === '') {
					defaultConfigValue = defaultZoneId;
				}
				setValueToConfig(jsfwPrefsPrefix + DEFAULT_PROFILE_STORED_PATH + '/' + DVBS_SUB_FOLDER_PATH + '/zoneId', defaultConfigValue);
				setValueToConfig(jsfwPrefsPrefix + DEFAULT_PROFILE_STORED_PATH + '/' + DVBC_SUB_FOLDER_PATH + '/zoneId', defaultConfigValue);
			}
			log("initialise", "Exit");
		},
		/**
		 * Returns the default scanning parameters
		 * @method getDefaultScanningParams
		 * @param {String} networkType
		 * @return {Object} the scanning parameters
		 */
		getDefaultScanningParams: function (networkType) {
			var defaultScanParameters = {},
			    lnbProfile,
				defaultConfigValue,
				currentParameterKey,
				key,
				folderPath,
				scanningParameters;
			if (networkType === NETWORK_TYPE_DVBS) {
				scanningParameters = dvbsParameters;
				folderPath = DVBS_SUB_FOLDER_PATH;
				//fetching dvbs lnb values
                for (key in dvbsLnbParameters) {
                    if (dvbsLnbParameters.hasOwnProperty(key)) {
                        currentParameterKey = key;
                        defaultConfigValue = getValueFromConfig(jsfwPrefsPrefix + DEFAULT_PROFILE_STORED_PATH + '/' + DVBS_SUB_FOLDER_PATH + '/' + currentParameterKey);
                        if (defaultConfigValue === undefined || defaultConfigValue === '') {
                            defaultConfigValue = dvbsLnbParameters[key];
                        }
                        defaultScanParameters[key] = defaultConfigValue;
                    }
                }
                defaultScanParameters.lnbProfile = $config.getConfigValue("dvb.scan.LNB_PROFILE_VALUE");
			} else if (networkType === NETWORK_TYPE_ISDBT) {
				scanningParameters = isdbtParameters;
				folderPath = ISDBT_SUB_FOLDER_PATH;
			} else if (networkType === NETWORK_TYPE_DVBC) {
				scanningParameters = dvbcParameters;
				folderPath = DVBC_SUB_FOLDER_PATH;
			} else if (networkType === NETWORK_TYPE_DVBT) {
				scanningParameters = dvbtParameters;
				folderPath = DVBT_SUB_FOLDER_PATH;
			}
			for (key in scanningParameters) {
				if (scanningParameters.hasOwnProperty(key)) {
					currentParameterKey = key;
					defaultConfigValue = getValueFromConfig(jsfwPrefsPrefix + DEFAULT_PROFILE_STORED_PATH + '/' + folderPath + '/' + currentParameterKey);
					if (defaultConfigValue === undefined) {
						defaultConfigValue = scanningParameters[key];
					}
					defaultScanParameters[key] = defaultConfigValue;
				}
			}
			//getting zoneId - not applicable for ISDB-T
			if (networkType !== NETWORK_TYPE_ISDBT && networkType !== NETWORK_TYPE_DVBT) {
				defaultConfigValue = getValueFromConfig(jsfwPrefsPrefix + DEFAULT_PROFILE_STORED_PATH + '/' + folderPath + '/zoneId');
				if (defaultConfigValue === undefined || defaultConfigValue === '') {
					defaultConfigValue = defaultZoneId;
				}
				defaultScanParameters.zoneId = defaultConfigValue;
			}
			return defaultScanParameters;
		},

		

		/**
		 * Performs a satellite scan with the parameters supplied. If no
		 * parameters are present or if those given do not match the required
		 * values then defaults are used.
		 * @method performScan
		 * @param {String} networkType DVBS/DVBS or the networkType to scan
		 * @param {string} polarisation Must match a value in the
		 * o5.platform.system.Scan.DVBS_Polarization enum
		 * @param {string} fecInner inner Forward Error Correction method:
		 * must match a value in the o5.platform.system.Scan.DVBS_InnerFEC enum
		 * must match a value in the o5.platform.system.Scan.DVBC_OuterFEC enum
		 * @param {number} symbolRate Decimal value indicating symbol rate in Msymbols/s.
		 * @param {number} frequency frequency value
		 * must match a value in the o5.platform.system.Scan.DVBC_Modulation enum
		 * @param {number} lnbLowFrequency LNB Low Frequency value
		 * @param {number} lnbHighFrequency LNB High Frequency value
		 * @param {number} lnbSwitchingFrequency LNB Switching Frequency value
		 * @param {boolean} lnbPower true for On and false for Off
		 * @param {boolean} dvbs2-mode true for dvbs2 and false for dvbs
		 * @param {number} dvbs modulation value
		 * @param {number} endFrequency End Frequency value for isdb-t
		 * @param {number} networkId Network Id value
		 * @param {number} zoneId Zone Id value
		 * @param {number} guardInterval Guard Interval value
		 * @param {number} mode ISDB-T Mode value
		 * @param {number} areaCode Area code value
		 * @param {number} scanProgressInterval The time interval between scan
		 * progress callbacks in milli seconds.
		 * @param {function} scanProgressCallback
		 * @param {function} scanFailureCallback
		 * @param {function} scanCompleteCallback
		 */
		performScan: function (networkType,
								lnbPolarization,
								fecInner,
								symbolRate,
								frequency,
								lnbProfile,
								lnbNewFreq,
								lnbPower,
								isDVBS2,
								rollOff,
								modulation,
								endFrequency,
								networkId,
								zoneId,
								guardInterval,
								mode,
								areaCode,
								constellation,
								hierarchyPriority,
								hierarchy,
								LPCodeRate,
								HPCodeRate,
								transmissionMode,
								tunerBandwidth,
								guardInterval,
								scanProgressInterval,
								scanProgressCallback,
								scanFailureCallback,
								scanCompleteCallback,
								isSignalScan
								) {
			var preferences = {},
				scanResult,
				networkTypeCode,
				defaultPreferences = this.getDefaultScanningParams(networkType);
			o5.platform.system.Preferences.set(o5.platform.system.Preferences.get($config.getConfigValue("dvb.scan.LNB_PROFILE")), lnbProfileValue);

			o5.platform.system.Scan.setScanCompleteCallback(scanCompleteCallback);
			o5.platform.system.Scan.setScanProgressCallback(scanProgressCallback, scanProgressInterval);
			o5.platform.system.Scan.setScanFailureCallback(scanFailureCallback);

			//Set the default values
			preferences = {};
			//common
			preferences.frequency = frequency ? parseInt(frequency, 10) : defaultPreferences.frequency;
			//common for DVBC and DVBS - not for ISDB-T
			if (networkType !== NETWORK_TYPE_ISDBT && networkType !== NETWORK_TYPE_DVBT) {
				preferences.fecInner = fecInner || defaultPreferences.fecInner;
				preferences.symbolRate = symbolRate ? parseInt(symbolRate, 10) : defaultPreferences.symbolRate;
				preferences.networkId = networkId ? parseInt(networkId, 10) : defaultPreferences.networkId;
				preferences.zoneId = zoneId ? parseInt(zoneId, 10) : defaultZoneId;
				setValueToConfig(zoneIdPath, preferences.zoneId);
			}
			if (networkType === NETWORK_TYPE_DVBS) {
				preferences.lnbPolarization = lnbPolarization || defaultPreferences.lnbPolarization;
				preferences.isDVBS2 = (isDVBS2 !== undefined) ? isDVBS2 : defaultPreferences.isDVBS2;
				preferences.rollOff = rollOff || defaultPreferences.rollOff;
				preferences.modulation = modulation || defaultPreferences.modulation;
				preferences.lnbProfile = lnbProfile || "Profile1";
				//JSFW will not set the LNB values, so taking care in this class
				preferences.lnbNewFreq = lnbNewFreq ? parseInt(lnbNewFreq, 10) : defaultPreferences.lnbFreqLoKhz;
				updateLnbConfigmanDefaultValue("lnbFreqLoKhz", preferences.lnbNewFreq);
				updateLnbConfigmanDefaultValue("lnbFreqHiKhz", preferences.lnbNewFreq);
				updateLnbConfigmanDefaultValue("lnbFreqSwKhz", preferences.lnbNewFreq);
				preferences.lnbPower = (lnbPower !== undefined) ? lnbPower : defaultPreferences.lnbPower;
				updateLnbConfigmanDefaultValue("lnbPower", lnbPower);
			} else if (networkType === NETWORK_TYPE_DVBT) {
				preferences.endFrequency = parseInt(endFrequency, 10);
				preferences.guardInterval = guardInterval;
				preferences.constellation = constellation;
				preferences.hierarchyPriority = hierarchyPriority;
				preferences.hierarchy = hierarchy;
				preferences.LPCodeRate = LPCodeRate;
				preferences.HPCodeRate = HPCodeRate;
				preferences.transmissionMode = transmissionMode;
				preferences.tunerBandwidth = tunerBandwidth;
			}

			console.log(preferences);

			networkTypeCode = getNetworktypeCode(networkType);
			scanResult = o5.platform.system.Scan.startScan(networkTypeCode, preferences, isSignalScan);
		},

		/**
		 * Cancel a satellite scan
		 * @method cancelScan
		 */
		cancelScan: function () {
			o5.platform.system.Scan.cancelScan();
		}
	};
}());