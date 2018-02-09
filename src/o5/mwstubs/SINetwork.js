/**
 * Stub for SINetwork : CCOM.SINetwork,  DVB Network a singleton added since v5.0.0
 * @ignore
 */
CCOM.SINetwork = new (function SINetwork ()
{
	"use strict";

	this._id = CCOM.stubs.uuid();
	this._ns = "CCOM.SINetwork";
	// supported events
	this._EVENT_ON_SCAN_PROGRESS = "onScanProgress";
	this._EVENT_ON_SCAN_COMPLETE = "onScanComplete";
	this._EVENT_ON_SCAN_ERROR = "onScanError";
	this._EVENT_LOCK_CONFIGURATION_OK = "lockConfigurationOK";
	this._EVENT_LOCK_CONFIGURATION_FAILED = "lockConfigurationFailed";
	this._EVENT_GET_CONNECTION_INFO_OK = "getConnectionInfoOK";  //otv:deprecated="5.1.3"
	this._EVENT_GET_CONNECTION_INFO_FAILED = "getConnectionInfoFailed"; //otv:deprecated="5.1.3"
	this._EVENT_GET_SCAN_PROGRESS_OK = "getScanProgressOK";
	this._EVENT_GET_SCAN_PROGRESS_FAILED = "getScanProgressFailed";
	this._supportedEvents =
	[
		this._EVENT_ON_SCAN_PROGRESS,
		this._EVENT_ON_SCAN_COMPLETE,
		this._EVENT_ON_SCAN_ERROR,
		this._EVENT_LOCK_CONFIGURATION_OK,
		this._EVENT_LOCK_CONFIGURATION_FAILED,
		this._EVENT_GET_CONNECTION_INFO_OK,  //otv:deprecated="5.1.3"
		this._EVENT_GET_CONNECTION_INFO_FAILED, //otv:deprecated="5.1.3"
		this._EVENT_GET_SCAN_PROGRESS_OK,
		this._EVENT_GET_SCAN_PROGRESS_FAILED
	];

	//ScanErrorCondition
	this.UNKNOWN_ERROR            = -1;
	this.RESOURCE_UNAVAILABLE     = -2;
	this.BUSY                     = -3;
	this.CONNECTION_ERROR         = -4;
	this.SI_ERROR                 = -5;
	this.DATABASE_FULL            = -6;
	this.TIMEOUT_OCCURRED         = -7;
	this.SCAN_CANCELED            = -8;
	this.CONFIGURATION_LOCKED     = -9;
	//nsEnums:
	//TunerType
    var TunerType = {
       SATELLITE: 0,
	   CABLE: 1,
	   TERRESTRIAL: 2,
	   AISC: 3,
	   IP: 4,
	   ISDBT: 5
    };
	
    var LinkageDescriptorMode = {
       APPEND: 0,
       REPLACE: 1,
       CROSS_REFERENCED_SI: 2
    };
	//LinkageDescriptorMode.APPEND= 0;
	//this.LinkageDescriptorMode.REPLACE= 1;
	//FEC_Inner
    var FEC_Inner = {
       _1_2: 0,
	   _2_3: 1,
	   _3_4: 2,
	   _5_6: 3,
	   _7_8: 4,
	   _8_9: 5,
       _3_5: 6,
	   _4_5: 7,
	   _9_10: 8,
	   NONE: 9,
           AUTO: 10
    };
    
	
	//DVBS2_Rolloff
     var DVBS2_Rolloff = {
       _0_35: 0,
	   _0_25: 1,
       _0_20:2
    };
	
	//DVBS_Modulation
    var DVBS_Modulation = {
       AUTO: 0,
	   QPSK: 1,
       _8PSK: 2,
       _16QAM: 3 
    };
	
	//DVBS_LNB_Polarization
    var DVBS_LNB_Polarization = {
       H: 0,
	   V: 1,
       LCIRC: 2,
       RCIRC: 3 
    };
	

	//FEC_Outer
	//this.FEC_Outer.NONE: 0;
    var FEC_Outer = {
       RS_204_188: 0
    }
	//this.FEC_Outer.RS_204_188= 1;
	//DVBC_Modulation
    var DVBC_Modulation = {
       _32QAM: 1,
	   _64QAM: 2,
       _128QAM: 3,
       _256QAM: 4 
    };
	
	//DVBT_Bandwidth
    var DVBT_Bandwidth = {
       _8Mhz: 0,
	   _7Mhz: 1,
       _6Mhz: 2,
       _5Mhz: 3 
    };
	
	//DVBT_Hierarchy
    var DVBT_Hierarchy = {
       _0_NATIVE: 0,
	   _1_NATIVE: 1,
	   _2_NATIVE: 2,
	   _4_NATIVE: 3,
	   _0_IN_DEPTH: 4,
	   _1_IN_DEPTH: 5,
       _2_IN_DEPTH: 6,
	   _4_IN_DEPTH: 7
    };
    
	
    //TerrestrialGuardInterval
    var TerrestrialGuardInterval = {
       _1_32: 0,
	   _1_16: 1,
       _1_8: 2,
       _1_4: 3 
    };
       
    //DVBT_TransmissionMode
    var DVBT_TransmissionMode = {
       _2K: 0,
	   _8K: 1,
       _4K: 2 
    };
       
    //ISDBT_Mode
    var ISDBT_Mode = {
       _1: 0,
	   _2: 1,
       _3: 2 
    };
       
        //ScanType
    var ScanType = {
       NO_SI: 0,
	   SVL_ONLY: 1,
       SVL_AND_EITPFS: 2 ,
       SVL_AND_EITPF: 3
    };
     
	Object.defineProperty(this, 'connectionInfo', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.siNetwork) ? CCOM.stubs.stbData.siNetwork.connectionInfo : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'progressInfo', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.siNetwork) ? CCOM.stubs.stbData.siNetwork.progressInfo : null;
		},
		enumerable: true
	});
	

	this.addEventListener = function (event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.addEventListener(this._id, this._ns, event, callback);
	};

	this.removeEventListener = function (event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.removeEventListener(this._id, this._ns, event, callback);
	};

	this.lockConfiguration = function ()
	{
		var _handle = CCOM.stubs.getHandle(),
		evt = {
			target: this,
			handle: _handle
		};

		CCOM.stubs.raiseEvent(this._id, this._ns, this._EVENT_LOCK_CONFIGURATION_OK, evt, 0);
		return evt.handle;
	};

	this.unlockConfiguration = function ()
	{
		return {};  // success
	};

	this.scan = function (svlScanProfileName)
	{
		var _handle = CCOM.stubs.getHandle(),
		evt = [
			{ // onScanProgress
				target: this,
				progressInfo: {
					BER: this.progressInfo[0].BER,
 					SNR: this.progressInfo[0].SNR,
 					onid: this.progressInfo[0].onid,
 					radioServicesFoundCount: this.progressInfo[0].radioServicesFoundCount,
 					scanHandle: 1,
 					scannedPercent: this.progressInfo[0].scannedPercent,
 					scannedTSCount: this.progressInfo[0].scannedTSCount,
 					signalStrength: this.progressInfo[0].signalStrength,
 					totalServicesFoundCount: this.progressInfo[0].totalServicesFoundCount,
 					tsid: this.progressInfo[0].tsid,
 					tvServicesFoundCount: this.progressInfo[0].tvServicesFoundCount
				}
			},
			{ // onScanComplete
				target: this,
				scanHandle: _handle
			}
		];

		CCOM.stubs.raiseEvent(this._id, this._ns, this._EVENT_ON_SCAN_PROGRESS, evt[0], 0);
		CCOM.stubs.raiseEvent(this._id, this._ns, this._EVENT_ON_SCAN_COMPLETE, evt[1], 2000);
		// return scanHandle
		return evt[1].scanHandle;
	};

	this.cancelScan = function (scanHandle)
	{
		return;
	};

	//otv:deprecated="5.1.3"
	this.getConnectionInfo = function (sourceUri)
	{
		var _handle = CCOM.stubs.getHandle(),
		evt = {
			target: this,
			handle: _handle,
			connectionInfo: {
				signalStrength: this.connectionInfo[0].signalStrength,
 				SNR: this.connectionInfo[0].SNR,
 				BER: this.connectionInfo[0].BER,
 				onid: this.connectionInfo[0].onid,
 				tsid: this.connectionInfo[0].tsid,
 				svcid: this.connectionInfo[0].svcid,
 				tunerType: this.connectionInfo[0].tunerType,
 				frequency: this.connectionInfo[0].frequency,
 				symbolRate: this.connectionInfo[0].symbolRate,
 				fec: this.connectionInfo[0].fec,
 				lnbPolarization: this.connectionInfo[0].lnbPolarization
			}
		};

		CCOM.stubs.raiseEvent(this._id, this._ns, this._EVENT_GET_CONNECTION_INFO_OK, evt, 0);
		return evt.handle;
	};

	this.getScanProgress = function (scanHandle)
	{
		var _handle = CCOM.stubs.getHandle(),
		evt = {
			target: this,
			handle: _handle,
			progressInfo: {
				scanHandle: scanHandle,
				scannedPercent: this.progressInfo[1].scannedPercent,
 				scannedTSCount: this.progressInfo[1].scannedTSCount,
 				totalServicesFoundCount: this.progressInfo[1].totalServicesFoundCount,
 				tvServicesFoundCount: this.progressInfo[1].tvServicesFoundCount,
 				radioServicesFoundCount: this.progressInfo[1].radioServicesFoundCount,
 				onid: this.progressInfo[1].onid,
 				tsid: this.progressInfo[1].tsid,
 				signalStrength: this.progressInfo[1].signalStrength,
 				SNR: this.progressInfo[1].SNR,
 				BER: this.progressInfo[1].BER
 			}
		};

		CCOM.stubs.raiseEvent(this._id, this._ns, this._EVENT_ON_SCAN_PROGRESS, evt, 0);
		return evt.handle;
	};
})();
