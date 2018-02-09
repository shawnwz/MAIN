/**
 * Stub for AppController: CCOM.AppController
 * This object has been added since OTV 5.1.1, for representing application instances.
 * @ignore
 */
CCOM.ApplicationController = new (function ApplicationController ()
{
	//"use strict";
	
	this._MY_NAME_SPACE = "CCOM.ApplicationController";
	this._id = CCOM.stubs.uuid();
	
	// events
	this._EVENT_ON_APP_STATE_REQUESTED 	= "onAppStateRequested";
	this._EVENT_ON_SET_APP_STATE 		= "onSetAppState";
	this._EVENT_PROCESS_REQUEST_OK 		= "processRequestOK";
	this._EVENT_PROCESS_REQUEST_FAILED 	= "processRequestFailed";
	this._EVENT_SET_APP_STATE_OK 		= "setAppStateOK";
	this._EVENT_SET_APP_STATE_FAILED 	= "setAppStateFailed";
	
	this._supportedEvents = [
		this._EVENT_ON_APP_STATE_REQUESTED,
		this._EVENT_ON_SET_APP_STATE,
		this._EVENT_PROCESS_REQUEST_OK,
		this._EVENT_PROCESS_REQUEST_FAILED,
		this._EVENT_SET_APP_STATE_OK,
		this._EVENT_SET_APP_STATE_FAILED
	];
	
	//AppState
	this.STATE_APP_DESTROYED	= 0;
	this.STATE_APP_FOCUSED		= 1;
	this.STATE_APP_BLURRED		= 2;
	this.STATE_APP_HIDDEN		= 3;
	this.STATE_APP_SUSPEND		= 4;
	
	//AppStateRequestStatus
	this.STATUS_SUCCESS						= 0;
	this.STATUS_FAILED						= 1;
	this.STATUS_FAILED_INVALID_PARAM		= 2;
	this.STATUS_FAILED_PERMISSION_DENIED	= 3;
	this.STATUS_FAILED_APP_NOT_FOUND		= 4;
	this.STATUS_FAILED_REQUEST_DENIED		= 5;
	this.STATUS_FAILED_APP_NOT_SUPPORTED	= 6;
	this.STATUS_FAILED_APP_NOT_RESPONDING	= 7;
	this.STATUS_FAILED_RTE_ERROR			= 8;
	this.STATUS_FAILED_INVALID_METADATA		= 9;
	
	//AppStateChangeReason
	this.REASON_STATE_CHANGE_REQUESTED			= 0;
	this.REASON_STATE_CHANGE_LOW_ON_RESOURCES	= 1;
	this.REASON_STATE_CHANGE_APP_EXIT_UNKNOWN	= 2;
	this.REASON_STATE_CHANGE_APP_UNINSTALLED	= 3;
	this.REASON_STATE_CHANGE_APP_UPDATED		= 4;
	this.REASON_STATE_CHANGE_RTE_ERROR			= 5;
	this.REASON_STATE_CHANGE_APP_NOT_FOUND		= 6;
	this.REASON_STATE_CHANGE_APP_NOT_RESPONDING	= 7;
	
	//AppStateRequestResult
	this.RESULT_GRANTED			= 1;
	this.RESULT_DENIED			= 2;
	this.RESULT_NOT_REQUESTED	= 1;
	
	//AppStateRequester
	this.REQUESTER_CONTROLAPP	= 0;
	this.REQUESTER_SELF			= 1;
	this.REQUESTER_APPMGR		= 2;
	this.REQUESTER_APPLICATION	= 3;
	this.REQUESTER_SERVICE		= 4;
	this.REQUESTER_DIAL			= 5;
	this.REQUESTER_WATCHER		= 6;

	//AppMemoryType
	this.SMALL	= 0;
	this.MEDIUM	= 1;
	this.LARGE	= 2;
	this.XLARGE	= 3;
	
	this.addEventListener = function (event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		
		return CCOM.stubs.addEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};
	
	this.removeEventListener = function (event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		
		return CCOM.stubs.removeEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};
	
	this.processRequest = function (requestHandle, requestResult)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error: {
				domain: "com.opentv.ApplicationController",
				name: "Failed",
				message: "Not implemented yet"
			}
		};
	};
	
	this.setAppState = function (appId, appState, changeReason, additionalArgs)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error: {
				domain: "com.opentv.ApplicationController",
				name: "Failed",
				message: "Not implemented yet"
			}
		};
	};

	this.getAvailableMemory = function ()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error: {
				domain: "com.opentv.ApplicationController",
				name: "Failed",
				message: "Not implemented yet"
			}
		};
	};
	
})();
   	
