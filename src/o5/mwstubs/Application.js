/**
 * Stub for Application: CCOM.Application
 * This object has been added since OTV 5.1.1, for representing application instances.
 * @ignore
 */
CCOM.Application = new (function Application()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.Application";
	this._id = CCOM.stubs.uuid();
	
	// events in headline of html doc
	this._EVENT_REQUEST_ACTION_SIGNAL 					= "requestActionSignal";
	this._EVENT_SEND_MESSAGE_SIGNAL 					= "sendMessageSignal";
	this._EVENT_ON_REQUEST_STATE 						= "onRequestState";
	this._EVENT_ON_STATE_CHANGED 						= "onStateChanged";
	this._EVENT_ON_STATE_TRANSITION 					= "onStateTransition";
	this._EVENT_ON_BORROWED_INPUT 						= "onBorrowedInput";
	this._EVENT_ON_MEMORY_THRESHOLD_CROSSED				= "onMemoryThresholdCrossed";
	this._EVENT_ON_SHOWING_WINDOW_NO_FOCUS_TIMEOUT		= "onShowingWindowNoFocusTimeout";
	
	// method events
	this._EVENT_DELAY_LOW_POWER_OK 							= "delayLowPowerOK";
	this._EVENT_DELAY_LOW_POWER_FAILED 						= "delayLowPowerFailed";
	this._EVENT_SUSPENDED_OK 								= "suspendedOK"; //otv:deprecated="5.1.5"
	this._EVENT_SUSPENDED_FAILED 							= "suspendedFailed";//otv:deprecated="5.1.5"
	this._EVENT_RESUMED_OK 									= "resumedOK";//otv:deprecated="5.1.5"
	this._EVENT_RESUMED_FAILED 								= "resumedFailed";//otv:deprecated="5.1.5"
	this._EVENT_REQUEST_STATE_OK 							= "requestStateOK";
	this._EVENT_REQUEST_STATE_FAILED 						= "requestStateFailed";
	this._EVENT_READY_FOR_STATE_TRANSITION_OK 				= "readyForStateTransitionOK";
	this._EVENT_READY_FOR_STATE_TRANSITION_FAILED 			= "readyForStateTransitionFailed";
	this._EVENT_REGISTER_AS_CONTROL_APPLICATION_OK 			= "registerAsControlApplicationOK";
	this._EVENT_REGISTER_AS_CONTROL_APPLICATION_FAILED 		= "registerAsControlApplicationFailed";
	this._EVENT_UNREGISTER_AS_CONTROL_APPLICATION_OK 		= "unregisterAsControlApplicationOK";
	this._EVENT_UNREGISTER_AS_CONTROL_APPLICATION_FAILED 	= "unregisterAsControlApplicationFailed";
	this._EVENT_NEED_KEYS_IN_FOCUS_OK 						= "needKeysInFocusOK";
	this._EVENT_NEED_KEYS_IN_FOCUS_FAILED 					= "needKeysInFocusFailed";
	this._EVENT_BORROW_KEYS_FROM_FOCUS_OK 					= "borrowKeysFromFocusOK";
	this._EVENT_BORROW_KEYS_FROM_FOCUS_FAILED 				= "borrowKeysFromFocusFailed";
	
	this._supportedEvents = [
		this._EVENT_REQUEST_ACTION_SIGNAL,
		this._EVENT_SEND_MESSAGE_SIGNAL,
		this._EVENT_ON_REQUEST_STATE,
		this._EVENT_ON_STATE_CHANGED,
		this._EVENT_ON_STATE_TRANSITION,
		this._EVENT_ON_BORROWED_INPUT,
		this._EVENT_DELAY_LOW_POWER_OK,
		this._EVENT_DELAY_LOW_POWER_FAILED,
		this._EVENT_SUSPENDED_OK,
		this._EVENT_SUSPENDED_FAILED,
		this._EVENT_RESUMED_OK,
		this._EVENT_RESUMED_FAILED,
		this._EVENT_REQUEST_STATE_OK,
		this._EVENT_REQUEST_STATE_FAILED,
		this._EVENT_READY_FOR_STATE_TRANSITION_OK,
		this._EVENT_READY_FOR_STATE_TRANSITION_FAILED,
		this._EVENT_REGISTER_AS_CONTROL_APPLICATION_OK,
		this._EVENT_REGISTER_AS_CONTROL_APPLICATION_FAILED,
		this._EVENT_UNREGISTER_AS_CONTROL_APPLICATION_OK,
		this._EVENT_UNREGISTER_AS_CONTROL_APPLICATION_FAILED,
		this._EVENT_NEED_KEYS_IN_FOCUS_OK,
		this._EVENT_NEED_KEYS_IN_FOCUS_FAILED,
		this._EVENT_BORROW_KEYS_FROM_FOCUS_OK,
		this._EVENT_BORROW_KEYS_FROM_FOCUS_FAILED
	];
	
	this._ver = CCOM.stubs.getCurrentMWVersion();
	
	// o_appman_action_type_t otv:deprecated="5.1.3"
	this.REQUEST_TYPE_SHOW = 1;
	// REQUEST_LOW_POWER= 2
	
	// appManRequest
	this.REQUEST_SHOW 		= 1; // otv=deprecated="5.1.5"
	this.REQUEST_LOW_POWER 	= 2;
	this.REQUEST_SUSPEND 	= 3; // otv=deprecated="5.1.5"
	this.REQUEST_RESUME 	= 4; // otv=deprecated="5.1.5"
	
	
	// applicationMode otv=deprecated="5.1.5"
	this.MODE_FOCUSED = 0;
	this.MODE_SUSPEND = 1;
	
	// AppState
	this.STATE_APP_DESTROYED 	= 0;
	this.STATE_APP_FOCUSED 		= 1;
	this.STATE_APP_BLURRED 		= 2;
	this.STATE_APP_HIDDEN 		= 3;
	this.STATE_APP_SUSPEND 		= 4;
	
	// AppStateRequestStatus
	this.STATUS_SUCCESS 					= 0;
	this.STATUS_FAILED						= 1;
	this.STATUS_FAILED_INVALID_PARAM 		= 2;
	this.STATUS_FAILED_PERMISSION_DENIED 	= 3;
	this.STATUS_FAILED_APP_NOT_FOUND 		= 4;
	this.STATUS_FAILED_REQUEST_DENIED 		= 5;
	this.STATUS_FAILED_APP_NOT_SUPPORTED 	= 6;
	this.STATUS_FAILED_APP_NOT_RESPONDING 	= 7;
	this.STATUS_FAILED_RTE_ERROR 			= 8;
	this.STATUS_FAILED_INVALID_METADATA 	= 9;
	
	// AppStateChangeReason
	this.REASON_STATE_CHANGE_REQUESTED 			= 0;
	this.REASON_STATE_CHANGE_LOW_ON_RESOURCES 	= 1;
	this.REASON_STATE_CHANGE_APP_EXIT_UNKNOWN 	= 2;
	this.REASON_STATE_CHANGE_APP_UNINSTALLED 	= 3;
	this.REASON_STATE_CHANGE_APP_UPDATED 		= 4;
	this.REASON_STATE_CHANGE_RTE_ERROR 			= 5;
	this.REASON_STATE_CHANGE_APP_NOT_FOUND 		= 6;
	this.REASON_STATE_CHANGE_APP_NOT_RESPONDING = 7;

	//AppMemoryType
	this.SMALL 	= 0;
	this.MEDIUM = 1;
	this.LARGE 	= 2;
	this.XLARGE = 3;
	
	// AppStateRequester
	this.REQUESTER_CONTROLAPP 	= 0;
	this.REQUESTER_SELF 		= 1;
	this.REQUESTER_APPMGR 		= 2;
	this.REQUESTER_APPLICATION 	= 3;
	this.REQUESTER_SERVICE 		= 4;
	this.REQUESTER_DIAL 		= 5;
	this.REQUESTER_WATCHER 		= 6;
	this.REQUESTER_USER 		= 7;
	
	// EventType
	this.KEYPRESS 		= 1;
	this.KEYRELEASE 	= 2;
	this.BUTTONPRESS 	= 3;
	this.BUTTONRELEASE 	= 4;
	
	// LockState
	this.SCROLL = 1;
	this.NUM 	= 2;
	this.CAPS 	= 4;
	
	// ButtonID
	this.LEFT 	= 0;
	this.MIDDLE = 1;
	this.RIGHT 	= 2;
	
	// ButtonMask
	this.LEFT_MASK 		= 1;
	this.MIDDLE_MASK 	= 2;
	this.RIGHT_MASK 	= 4;
	
	// AppRunReason
	this.REASON_REQUESTED 	= 0;
	this.REASON_AUTOMATIC 	= 1;
	this.REASON_RESUMED 	= 2;
	
	// EventOrigin
	this.BORROWED 	= 0;
	this.ASSOCIATED = 1;

	this.addEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.addEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};
	this.removeEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.removeEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};
	// otv:deprecated="5.1.5"
	this.suspended = function()
	{
		this.logDeprecated();
		return {
			error : {
				domain : "com.opentv.Application",
				name : "Failed",
				message : "Warning:This API is deprecated."
			}
		};
	};

	// otv:deprecated="5.1.5"
	this.resumed = function()
	{
		this.logDeprecated();
		return {
			error : {
				domain : "com.opentv.Application",
				name : "Failed",
				message : "Warning:This API is deprecated."
			}
		};
	};
	this.requestState = function(appState)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Application",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};
	this.readyForStateTransition = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Application",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.registerAsControlApplication = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Application",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.unregisterAsControlApplication = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Application",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.needKeysInFocus = function(codes)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Application",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.borrowKeysFromFocus = function(codes)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Application",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};
	this.delayLowPower = function(delay)
	{
		// the uuid for identifying this call
		var hdl = CCOM.stubs.getHandle();
		// note: so far we just raise an OK event here

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DELAY_LOW_POWER_OK, {
			target : this,
			handle : hdl
		}, delay);
		return hdl;
	};

	this.getMemoryUsage = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Application",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.startShowingWindowNoFocus = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Application",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.stopShowingWindowNoFocus = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Application",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	Object.defineProperty(this, 'applicationId', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.application) ? CCOM.stubs.stbData.application.applicationId : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'producerId', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.application) ? CCOM.stubs.stbData.application.producerId : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'aimUuid', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.application) ? CCOM.stubs.stbData.application.aimUuid : null;
		},
		enumerable: true
	});
	
})();
