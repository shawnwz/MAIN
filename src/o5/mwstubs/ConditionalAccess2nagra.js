/**
 * Stub for ConditionalAccess2.nagra: CCOM.ConditionalAccess2.nagra, a singleton added since v5.2.0
 * @ignore
 */ 
CCOM.ConditionalAccess2 = {}; 
CCOM.ConditionalAccess2.nagra = new (function ConditionalAccess2nagra()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.ConditionalAccess2.nagra";
	this._id = CCOM.stubs.uuid();
	
	// events in xml
	this._EVENT_NAGRA_GENERIC_SIGNAL = "nagraGenericSignal";
	this._EVENT_NEW_MAIL             = "newMail";
	this._EVENT_POPUP_NEW            = "popupNew";
	this._EVENT_POPUP_REMOVE         = "popupRemove";
	this._EVENT_SMARTCARD_INSERTED   = "smartcardInserted";
	this._EVENT_SMARTCARD_REMOVED    = "smartcardRemoved";
	this._EVENT_SMARTCARD_UPDATED    = "smartcardUpdated";

	this._supportedEvents = [
		this._EVENT_NAGRA_GENERIC_SIGNAL,
		this._EVENT_NEW_MAIL,
		this._EVENT_POPUP_NEW,
		this._EVENT_POPUP_REMOVE,
		this._EVENT_SMARTCARD_INSERTED,
		this._EVENT_SMARTCARD_REMOVED,
		this._EVENT_SMARTCARD_UPDATED		
	];

	// 5.2.2 changes
	// offeringType
	this.OFFERING_TYPE_FREE 		= 0;
	this.OFFERING_TYPE_SUBSCRIPTION = 1;
	this.OFFERING_TYPE_IMPULSE 		= 2;
	this.OFFERING_TYPE_CREDIT 		= 3;	
	this.OFFERING_TYPE_SMS_PURCHASE = 4;

	// packageType
	this.PACKAGE_TYPE_UNDEFINED 		= 0;
	this.PACKAGE_TYPE_EVENT 			= 1;
	this.PACKAGE_TYPE_CHANNEL  			= 2;
	this.PACKAGE_TYPE_CHANNEL_PACKAGE 	= 3;
	this.PACKAGE_TYPE_EVENT_PACKAGE 	= 4;	
	this.PACKAGE_TYPE_FREE_PREVIEW 		= 5;

	// smartcardState
	this.SMARTCARD_STATE_OK 					= 0;
	this.SMARTCARD_STATE_ERROR 					= 1;
	this.SMARTCARD_STATE_MUTE 					= 2;	
	this.SMARTCARD_STATE_INVALID 				= 3;
	this.SMARTCARD_STATE_BLACKLISTED 			= 4;
	this.SMARTCARD_STATE_SUSPENDED 				= 5;
	this.SMARTCARD_STATE_NEVER_PAIRED 			= 6;
	this.SMARTCARD_STATE_NOT_PAIRED 			= 7;	
	this.SMARTCARD_STATE_EXPIRED 				= 8;	
	this.SMARTCARD_STATE_NAGRA_NOT_CERTIFIED 	= 9;	
	this.SMARTCARD_STATE_NAGRA_INCOMPATIBLE		= 10;	

	// properties
	this.getCredit = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ConditionalAccess2.nagra",
				name : "OperationFailed",
				message : "Not implemented yet"
			}
		};
	};
	
	this.getPackageInfo = function(id)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ConditionalAccess2.nagra",
				name : "OperationFailed",
				message : "Not implemented yet"
			}
		};	
	};

	this.getPurchaseHistory = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ConditionalAccess2.nagra",
				name : "OperationFailed",
				message : "Not implemented yet"
			}
		};
	};
	
	this.purchase = function(id)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ConditionalAccess2.nagra",
				name : "OperationFailed",
				message : "Not implemented yet"
			}
		};
	};

	
	this.addEventListener = function(event, callback)
	{
		if (-1 === this._supportedEvents.indexOf(event))
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.addEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};
	
	this.removeEventListener = function(event, callback)
	{
		if (-1 === this._supportedEvents.indexOf(event))
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.removeEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};
	
	

	Object.defineProperty(this, 'nagraChipsetRevision', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.nagraCA.nagraChipsetRevision : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'nagraChipsetType', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.nagraCA.nagraChipsetType : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'nagraCscMaxIndex', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.nagraCA.nagraCscMaxIndex : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'nagraUid', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.nagraCA.nagraUid : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'providerName', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.nagraCA.providerName : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'smartcard', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.nagraCA.smartcard : { error: 'Not Available' };
		},
		enumerable: true
	});

	Object.defineProperty(this, 'serialNumber', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.nagraCA.serialNumber : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'softwareName', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.nagraCA.softwareName : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'version', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.nagraCA.version : null;
		},
		enumerable: true
	});

})();
