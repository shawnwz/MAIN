/**
 * Stub for ControlCenter: CCOM.ControlCenter
 * @ignore
 */
CCOM.ControlCenter = new (function ControlCenter()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.ControlCenter";
	this._id = CCOM.stubs.uuid();
	// events in xml
	this._EVENT_ON_USER_NOTIFICATION     = "onUserNotification";//otv:deprecated="5.1.4"
	this._EVENT_ON_SERVICE_STATE_CHANGED = "onServiceStateChanged"
	// events from methods
	this._EVENT_CLEAR_OK = "clearOK";
	this._EVENT_CLEAR_FAILED = "clearFailed";
	this._EVENT_FACTORY_RESET_OK = "factoryResetOK";
	this._EVENT_FACTORY_RESET_FAILED = "factoryResetFailed";
	this._EVENT_REFURBISH_OK = "refurbishOK";
	this._EVENT_REFURBISH_FAILED = "refurbishFailed";
	this._EVENT_SEND_OK = "sendOK";
	this._EVENT_SEND_FAILED = "sendFailed";
	this._EVENT_CACHE_CLEAR_OK = "cacheClearOK";
	this._EVENT_CACHE_CLEAR_FAILED = "cacheClearFailed";
	this._supportedEvents = [ 
		this._EVENT_ON_USER_NOTIFICATION, //otv:deprecated="5.1.4"
		this._EVENT_CLEAR_OK,
		this._EVENT_CLEAR_FAILED,
		this._EVENT_SEND_OK,
		this._EVENT_SEND_FAILED,
		this._EVENT_CACHE_CLEAR_OK,
		this._EVENT_CACHE_CLEAR_FAILED
	];
	this._ver = CCOM.stubs.getCurrentMWVersion();

	//ServiceState
	this.DISCONNECTED 	= 0;
	this.CONNECTING		= 1;
	this.CONNECTED 		= 2;
	this.DISCONNECTING	= 3;

	var that = this, 
		_factoryReset = function() {
			document.location.reload(true);
			return CCOM.stubs.getHandle();
		}, 
		_refurbish = function() {
			this.logWarning("This API has not been implemented yet!");
			return {
				error : {
					domain : "com.opentv.ControlCenter",
					name : "Failed",
					message : "Not implemented yet"
				}
			};
		},
		_addEventListener = function(event, callback) {
			if (this._supportedEvents.indexOf(event) === -1)
			{
				return CCOM.stubs.ERROR_INVALID_EVENT;
			}
			return CCOM.stubs.addEventListener(this._id, this._MY_NAME_SPACE, event, callback);
		},
		_removeEventListener = function(event, callback) {
			if (this._supportedEvents.indexOf(event) === -1)
			{
				return CCOM.stubs.ERROR_INVALID_EVENT;
			}
			return CCOM.stubs.removeEventListener(this._id, this._MY_NAME_SPACE, event, callback);
		};

	function Settings () {
		this._MY_NAME_SPACE = "CCOM.ControlCenter.Settings";
		this._id = CCOM.stubs.uuid();
		this._supportedEvents = [ 
			that._EVENT_FACTORY_RESET_OK,
			that._EVENT_FACTORY_RESET_FAILED,
			that._EVENT_REFURBISH_OK,
			that._EVENT_REFURBISH_FAILED
		];
		this.factoryReset = _factoryReset;
		this.refurbish = _refurbish;
		this.addEventListener = _addEventListener;
		this.removeEventListener = _removeEventListener;
	}

	if (parseFloat(this._ver) > parseFloat(CCOM.stubs.MW_VER_5_1_5)) {		// 5.2 > 5.1 	// 5.2.0 and above
		this.Settings = new Settings();
	} else {		// 5.1.3 - 5.1.5
		this.factoryReset = _factoryReset;
		this.refurbish = _refurbish;
		this._supportedEvents.push(this._EVENT_FACTORY_RESET_OK,
			this._EVENT_FACTORY_RESET_FAILED,
			this._EVENT_REFURBISH_OK,
			this._EVENT_REFURBISH_FAILED);
	}

	this.getServiceState = function(service)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ControlCenter",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.clear = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ControlCenter",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.add = function(UriList)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ControlCenter",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.remove = function(UriList)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ControlCenter",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.send = function(messageCode)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ControlCenter",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.cacheClear = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ControlCenter",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	/**
	 * @method addEventListener
	 * @param {String} eventName The name of the event to listen for
	 * @param {Function} eventHandler The event handler function to be called when an event occurs
	 * @return {Object} An empty object indicates success; otherwise failure.
	 */
	this.addEventListener = _addEventListener;
	this.removeEventListener = _removeEventListener;
})();
