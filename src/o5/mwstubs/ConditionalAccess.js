/**
* Stub for ConditionalAccess: CCOM.ConditionalAccess, an singleton added in v5.0.0
 * @ignore
*/
CCOM.ConditionalAccess = new (function ConditionalAccess ()
{
	//"use strict";
	
	//_ver = CCOM.stubs.getCurrentMWVersion();
	this._id = CCOM.stubs.uuid();
	this._ns = "CCOM.ConditionalAccess";
	// events in v5.0.0 and v5.1.1
	this._EVENT_ON_IRD_MAIL_NEW = "onIrdMailNew";
	this._EVENT_ON_IRD_POPUP_NEW = "onIrdPopupNew";
	this._EVENT_ON_IRD_POPUP_REMOVE = "onIrdPopupRemove";
	this._EVENT_ON_SMARTCARD_INSERTED = "onSmartcardInsered";
	this._EVENT_ON_SMARTCARD_REMOVED = "onSmartcardRemoved";
	this._EVENT_ON_SMARTCARD_UPDATED = "onSmartcardUpdated";
	this._EVENT_ON_IRD_SOFTWARE_DOWNLOAD = "onIrdSoftwareDownload";  // this one is removed from v5.1.2
	this._EVENT_SMART_CARD_INSERTED = "smartcardInserted";
	this._EVENT_SMART_CARD_REMOVED = "smartcardRemoved";
	this._EVENT_POPUP_NEW = "popupNew";
	this._EVENT_POPUP_REMOVE = "popupRemove";
	this._EVENT_NEW_MAIL = "newMail";
	this._EVENT_NAGRA_GENERIC_SIGNAL = "nagraGenericSignal";
	// events added in v5.1.2
	this._EVENT_ON_IRD_CMD = "onIrdCmd";
	// events from methods
	this._EVENT_GET_CREDIT_OK = "getCreditOK";
	this._EVENT_GET_CREDIT_FAILED = "getCreditFailed";
	this._EVENT_GET_PURCHASE_HISTORY_LIST_OK = "getPurchaseHistoryListOK";
	this._EVENT_GET_PURCHASE_HISTORY_LIST_FAILED = "getPurchaseHistoryListFailed";
	this._EVENT_GET_PACKAGE_INFO_OK = "getPackageInfoOK";
	this._EVENT_GET_PACKAGE_INFO_FAILED = "getPackageInfoFailed";
	this._EVENT_PURCHASE_OK = "purchaseOK";
	this._EVENT_PURCHASE_FAILED = "purchaseFailed";
	
	this._supportedEvents = [
		this._EVENT_ON_IRD_MAIL_NEW,
		this._EVENT_ON_IRD_POPUP_NEW,
		this._EVENT_ON_IRD_POPUP_REMOVE,
		this._EVENT_ON_SMARTCARD_INSERTED,
		this._EVENT_ON_SMARTCARD_REMOVED,
		this._EVENT_ON_SMARTCARD_UPDATED,
		this._EVENT_ON_IRD_SOFTWARE_DOWNLOAD,
		this._EVENT_SMART_CARD_INSERTED,
		this._EVENT_SMART_CARD_REMOVED,
		this._EVENT_POPUP_NEW,
		this._EVENT_POPUP_REMOVE,
		this._EVENT_NEW_MAIL,
		this._EVENT_NAGRA_GENERIC_SIGNAL,
		this._EVENT_ON_IRD_MAIL_NEW,
		this._EVENT_ON_IRD_POPUP_NEW,
		this._EVENT_ON_IRD_POPUP_REMOVE,
		this._EVENT_ON_SMARTCARD_UPDATED,
		this._EVENT_ON_IRD_SOFTWARE_DOWNLOAD,
		this._EVENT_ON_IRD_CMD,
		this._EVENT_GET_CREDIT_OK,
		this._EVENT_GET_CREDIT_FAILED,
		this._EVENT_GET_PURCHASE_HISTORY_LIST_OK,
		this._EVENT_GET_PURCHASE_HISTORY_LIST_FAILED,
		this._EVENT_GET_PACKAGE_INFO_OK,
		this._EVENT_GET_PACKAGE_INFO_FAILED,
		this._EVENT_PURCHASE_OK,
		this._EVENT_PURCHASE_FAILED
	];

	// smartcardState
	this.OK  =   0;
	this.ERROR  =   1;
	this.MUTE  =   2;
	this.INVALID  =   3;
	this.BLACKLISTED  =   4;
	this.SUSPENDED  =   5;
	this.NEVER_PAIRED  =   6;
	this.NOT_PAIRED  =   7;
	this.EXPIRED  =   8;
	this.NOT_CERTIFIED  =   9;
	this.INCOMPATIBLE  =   10;
	// smartcardFlags
	this.CLEAN  =   1;
	this.VIRGIN  =   2;
	this.DLST_OBSERVED  =   4;
	this.PROCESSED_EMM_UN  =   8;
	// systemFlags
	this.SOFTWARE_UPGRADE_RECOMMENDED  =   1;
	this.SOFTWARE_UPGRADE_REQUIRED  =   2;
	// mailPriority
	this.normal  =   0;
	this.high  =   1;
	this.emergency  =   2;
	// popupPersistence
	// normal                         =   0;  // the same value as for mailPriority
	this.timeout  =   1;
	this.userAck  =   2;
	// caAccess
	this.CLEAR  =   0;
	this.GRANTED  =   1;
	this.FREE  =   2;
	this.DENIED  =   100;
	this.NO_VALID_SECURE_DEVICE  =   101;
	this.BLACKED_OUT  =   104;
	this.DENIED_NO_VALID_CREDIT  =   105;
	this.DENIED_COPY_PROTECTED  =   106;
	this.DENIED_PARENTAL_CONTROL  =   107;
	this.DENIED_DIALOG_REQUIRED  =   108;
	this.DENIED_PAIRING_REQUIRED  =   109;
	this.DENIED_CHIPSET_PAIRING_REQUIRED  =   110;
	this.EMI_UNSUPPORTED  =   111;
	
	// productType
	this.UNDEFINED  =   0;
	this.EVENT  =   1;
	this.SERVICE  =   2;
	this.SERVICE_PACKAGE  =   3;
	this.EVENT_PACKAGE  =   4;
	this.N_OF_M_SHOWINGS  =   5;
	this.N_OF_M_EVENTS  =   6;
	this.N_OF_M_CHANNELS  =   7;
	this.PAY_PER_TIME  =   8;
	this.PPT_BY_POINTS  =   11;
	this.FREE_PREVIEW  =   16;
	this.VOD_RENTAL  =   17;
	this.VOD_PACKAGE  =   18;
	this.VOD_SUBSCRIPTION  =   19;
	this.RENTAL_SUBSCRIPTION  =   20;
	
	// productFlags
	this.PURCHASABLE  =   1;
	this.PURCHASED  =   2;
	this.NOT_LOADED  =   4;
	this.IMPULSIVE  =   8;
	this.OFFLINE_PURCHASE  =   8;
	this.ONLINE_PURCHASE  =   16;
	this.SMS_PURCHASE  =   32;
	this.MULTIPLE_PURCHASE  =   64;
	this.OFFLINE_CONSUMPTION  =   128;
	//packageType
	//UNDEFINED  =   0;
	//EVENT  =   1;
	this.CHANNEL  =   2;
	this.CHANNEL_PACKAGE  =   3;
	//EVENT_PACKAGE  =   4;
	//FREE_PREVIEW  =   5;
	//offeringType
	//FREE  =   0;
	this.SUBSCRIPTION  =   1;
	this.IMPULSE  =   2;
	this.CREDIT  =   3;
	//SMS_PURCHASE  =   4;
	// properties  =   none for v5.0.0
	// methods  =   10 methods for v5.0.0

	Object.defineProperty(this, 'smartcardInfo', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.CA) ? CCOM.stubs.stbData.CA.smartcardInfo : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'systemInfo', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.CA) ? CCOM.stubs.stbData.CA.systemInfo : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'packageInfo', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.CA) ? CCOM.stubs.stbData.CA.packageInfo : null ;
		},
		enumerable: true
	});

	this.getEventInfo = function(eventId)
	{
		return {
			caAccess : this.CLEAR,
			previewTime : 0,
			products : {}
		};
	};

	this.getIrdAllMail = function()
	{
		return {
			mailInfo : []
		};
	};

	this.getIrdMail = function(mailId)
	{
		return {
			message : ""
		};
	};

	this.getIrdPopupMessage = function()
	{
		return {
			popupInfo : {}
		};
	};

	this.getServiceAccess = function(serviceId)
	{
		return {
			//FREE
			caAccess : this.FREE
		};
	};

	this.getSmartcardInfo = function()
	{
		return {
			smartcardInfo : {
				serialNumber : this.smartcardInfo.serialNumber ,
				version : this.smartcardInfo.version,
				setId : this.smartcardInfo.setId
			}
		// cardinfo: {
		//     smartcardSlotId: 0,
		//     smartcardStatus: "SC_OK",
		//     smartcardNum: "00142773428"
		// }
		};
	};

	this.getSystemInfo = function()
	{
		return {
			systemInfo : {
				chipsetPairingSaId : this.systemInfo.chipsetPairingSaId,
				chipsetRevision : this.systemInfo.chipsetRevision,
				chipsetType : this.systemInfo.chipsetType,
				cscMaxIndex : this.systemInfo.cscMaxIndex,
				flags : this.systemInfo.flags,
				flagsMask : this.systemInfo.flagsMask,
				nuid : this.systemInfo.nuid,
				projectInformation : this.systemInfo.projectInformation,
				serialNumber : this.systemInfo.serialNumber,
				version : this.systemInfo.version
			}
		// systeminfo: {
		//       caSystemId: 0,
		//       name: "Conax",
		//       softwareVersion: "1.0",
		//       interfaceVersion: "1.1",
		//       chipsetId: 123,
		//       deviceId: 987
		// }
		};
	};

	this.removeIrdMail = function(mailId)
	{
		this.logWarning("The operation has failed because the mail ID does not exist.");
		return {
			error : {
				domain : "com.opentv.ConditionalAccess",
				name : "OperationFailed",
				message : "The operation has failed because the mail ID does not exist."
			}
		};
	};

	//5.0 and 5.1.1 doc do not include this function, but if it is not defined, gravity can not be run.
	this.getPinCodeList = function()
	{
		this.logWarning("The operation has failed");
		return {
			error : {
				domain : "com.opentv.ConditionalAccess",
				name : "OperationFailed",
				message : "The operation has failed"
			}
		};
	};

	//5.0 and 5.1.1 doc do not include this function, but if it is not defined, gravity can not be run.
	this.getPurchaseHistoryList = function()
	{
		this.logWarning("The operation has failed");
		return {
			error : {
				domain : "com.opentv.ConditionalAccess",
				name : "OperationFailed",
				message : "The operation has failed"
			}
		};
	};

	this.getCreditInfo = function()
	{
		return {
			creditInfo : {
				amount : " 100",
				currency : " Rupees"
			}
		};
	};

	this.getPackageInfo = function(id)
	{
		return {
			packageInfo : {
				id : this.packageInfo.id,
				name : this.packageInfo.name,
				description : this.packageInfo.description,
				providerId : this.packageInfo.providerId,
				offeringStartTime : this.packageInfo.offeringStartTime,
				offeringEndTime : this.packageInfo.offeringEndTime,
				availabilityDate : this.packageInfo.availabilityDate,
				expirationDate : this.packageInfo.expirationDate,
				cost : this.packageInfo.cost,
				currency : this.packageInfo.currency
			}
		};
	};

	this.purchase = function(id)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ConditionalAccess",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.addEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.addEventListener(this._id, this._ns, event, callback);
	};

	this.removeEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.removeEventListener(this._id, this._ns, event, callback);
	};

	this.BLOCKED = 2;
	this.UNLIMITED = 4;
	// stringEncodingFormat
	this.NUMERIC = 0;
	this.BCD = 1;
	this.ASCII = 2;
	// rechargeReason
	this.USER_REQUEST = 0;
	this.PROMOTION = 1;
	this.REFUND = 2;
	// purchaseFlags
	this.WATCHED = 1;
	this.REFUNDED = 2;
	// PENDED                       : 4,  creditFlags:SUSPENDED
	// note: there is no item for values for 8 and 32!
	this.USED_CARD_CREDIT = 16;
	this.CONDITIONAL = 64;
	this.COLLECTED = 128;
	this.WATCHED_TO_REPORT = 256;
	// purchaseMode
	this.OFFLINE = 0;
	this.ONLINE = 1;
	this.SMS = 2;
	this.UNKNOWN = 3;
	this.FREE_PRELOADED = 4;
	// consumptionMode
	this.CONTINUOUS = 0;
	this.ONE_SHOT = 1;

	/*
	 * events: obsoleted and newly added
	 */
	this._obsoletedEvents = [ this._EVENT_ON_IRD_SOFTWARE_DOWNLOAD ];
	this._supportedEvents = this._supportedEvents.filter(function(x)
	{
		return (-1 === this._obsoletedEvents.indexOf(x));
	}, this);
	this._newEvents = [ this._EVENT_ON_IRD_CMD ];
	this._supportedEvents = this._supportedEvents.concat(this._newEvents);

	/*
	 * methods
	 */
	this.changePinCode = function(pinCodeId, newPinCodeData, currentPinCodeData, encodingFormat)
	{
		//An empty return object indicates success
		return {};
	};
	this.getCreditList = function()
	{
		return [];
	};
	this.validatePinCode = function(pinCodeId, currentPinCodeData, encodingFormat)
	{
		//An empty return object indicates success
		return {};
	};
	this.enableConsumption = function(consumptionRequestInfo)
	{
		//An empty return object indicates success
		return {};
	};
	this.getRechargeHistoryList = function()
	{
		return [];
	};
	this.purchaseProduct = function(purchaseRequestInfo)
	{
		//An empty return object indicates success
		return {};
	};

})();
