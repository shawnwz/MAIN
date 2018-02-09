/**
 * Stub for Application Manager
 * @ignore
 */
CCOM.ApplicationManager = new (function ApplicationManager()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.ApplicationManager";
	this.ver = CCOM.stubs.getCurrentMWVersion();
	this._id = CCOM.stubs.uuid();

	// events
	this._EVENT_ON_APP_STATE_CHANGED = "onAppStateChanged";
	this._EVENT_ON_REQUEST_APP_STATE = "onRequestAppState";
	this._EVENT_ON_APP_MEMORY_AVAILABLE = "onAppMemoryAvailable";
	this._EVENT_APPLICATION_MODE_CHANGED = "applicationModeChanged";
	this._EVENT_DESTROY_APPLICATION_OK = "destroyApplicationOK";
	this._EVENT_DESTROY_APPLICATION_FAILED = "destroyApplicationFailed";
	this._EVENT_IS_APPLICATION_RUNNING_OK = "isApplicationRunningOK";
	this._EVENT_IS_APPLICATION_RUNNING_FAILED = "isApplicationRunningFailed";
	this._EVENT_LAUNCH_APPLICATION_OK = "launchApplicationOK";
	this._EVENT_LAUNCH_APPLICATION_FAILED = "launchApplicationFailed";
	this._EVENT_LIST_RUNNING_APPLICATIONS_OK = "listRunningApplicationsOK";
	this._EVENT_LIST_RUNNING_APPLICATIONS_FAILED = "listRunningApplicationsFailed";
	this._EVENT_REQUEST_APPLICATION_ACTION_OK = "requestApplicationActionOK";
	this._EVENT_REQUEST_APPLICATION_ACTION_FAILED = "requestApplicationActionFailed";
	this._EVENT_SEND_MESSAGE_OK = "sendMessageOK";
	this._EVENT_SEND_MESSAGE_FAILED = "sendMessageFailed";
	this._EVENT_APPLICATION_DESTROYED = "applicationDestroyed"; //otv:deprecated="5.2.0"
	this._EVENT_APPLICATION_LAUNCHED = "applicationLaunched";  //otv:deprecated="5.2.0"
	this._EVENT_APPLICATION_LAUNCH_FAILED = "applicationLaunchFailed"; //otv:deprecated="5.2.0"
	this._EVENT_REQUEST_APP_STATE_Ok = "requestAppStateOK";
	this._EVENT_REQUEST_APP_STATE_FAILED = "requestAppStateFailed";
	this._EVENT_GET_APP_STATE_OK = "getAppStateOK";
	this._EVENT_GET_APP_STATE_FAILED = "getAppStateFailed";
	this._EVENT_SUBSCRIBE_APP_STATE_CHANGED_EVENTS_OK = "subscribeAppStateChangedEventsOK";
	this._EVENT_SUBSCRIBE_APP_STATE_CHANGED_EVENTS_FAILED = "subscribeAppStateChangedEventsFailed";

	this._supportedEvents = [
		this._EVENT_ON_APP_STATE_CHANGED,
		this._EVENT_ON_REQUEST_APP_STATE,
		this._EVENT_ON_APP_MEMORY_AVAILABLE,
		this._EVENT_DESTROY_APPLICATION_OK,
		this._EVENT_DESTROY_APPLICATION_FAILED,
		this._EVENT_IS_APPLICATION_RUNNING_OK,
		this._EVENT_IS_APPLICATION_RUNNING_FAILED,
		this._EVENT_LAUNCH_APPLICATION_OK,
		this._EVENT_LAUNCH_APPLICATION_FAILED,
		this._EVENT_LIST_RUNNING_APPLICATIONS_OK,
		this._EVENT_LIST_RUNNING_APPLICATIONS_FAILED,
		this._EVENT_REQUEST_APPLICATION_ACTION_OK,
		this._EVENT_REQUEST_APPLICATION_ACTION_FAILED,
		this._EVENT_SEND_MESSAGE_OK,
		this._EVENT_SEND_MESSAGE_FAILED,
		this._EVENT_APPLICATION_DESTROYED,
		this._EVENT_APPLICATION_LAUNCHED,
		this._EVENT_APPLICATION_LAUNCH_FAILED,
		this._EVENT_APPLICATION_MODE_CHANGED,
		this._EVENT_REQUEST_APP_STATE_Ok,
		this._EVENT_REQUEST_APP_STATE_FAILED,
		this._EVENT_GET_APP_STATE_OK,
		this._EVENT_GET_APP_STATE_FAILED,
		this._EVENT_SUBSCRIBE_APP_STATE_CHANGED_EVENTS_OK,
		this._EVENT_SUBSCRIBE_APP_STATE_CHANGED_EVENTS_FAILED
	];

	/*
	 * The object exists since the beginning (v5.0.0)
	 */

	// applicationLaunch otv:deprecated="5.1.5"
	this.REASON_REQUESTED = 0;
	this.REASON_AUTOMATIC = 1;
	this.REASON_RESUMED = 2;
	// applicationLaunchFailure otv:deprecated="5.2.0"
	this.REASON_GENERIC = 1;
	this.REASON_APP_INVALID_PARAM = 2;
	this.REASON_APP_NOT_FOUND = 3;
	this.REASON_APP_INVALID = 4;
	this.REASON_APP_NOT_SUPPORTED = 5;
	this.REASON_APP_PERMISSION_DENIED = 6;
	this.REASON_APP_POLICY_DENIED = 7;
	this.REASON_APP_RTE_ERROR = 8;
	this.REASON_APP_INVALID_METADATA = 9;
	this.REASON_APP_NO_MEM = 10;
	this.REASON_APP_RUNNING_ALREADY = 11;
	this.REASON_APP_NOT_CONNECTED = 12;
	// applicationManagerExit otv:deprecated="5.2.0"
	this.REASON_NORMAL = 0;
	this.REASON_FROM_REQUEST = 1;
	this.REASON_ABNORMAL = 2;
	this.REASON_NO_MEMORY = 3;
	this.REASON_SERVICE_NOT_FOUND = 4;
	this.REASON_PERMISSION_DENIED = 5;
	this.REASON_NOT_FOUND = 6;
	this.REASON_INVALID_PARAM = 7;
	this.REASON_NOT_SUPPORTED = 8;
	this.REASON_RTE_ERROR = 9;
	this.REASON_SUSPENDED = 10;
	this.REASON_LOW_ON_RESOURCES = 11;
	this.REASON_APP_CORRUPTED = 12;
	this.REASON_APP_DELETED = 13;
	this.REASON_UNKNOWN = 14;

	// applicationManagerRequest otv:deprecated="5.2.0"
	this.REQUEST_SHOW = 1;
	this.REQUEST_LOW_POWER_DELAY = 2;
	this.REQUEST_SUSPEND = 3;
	this.REQUEST_RESUME = 4;
	// o_appman_launch_fail_reason_t otv = deprecated="5.1.3"
	this.APP_LAUNCH_FAILED_GENERIC = 1;
	this.APP_LAUNCH_FAILED_INVALID_PARAM = 2;
	this.APP_LAUNCH_FAILED_APP_NOT_FOUND = 3;
	this.APP_LAUNCH_FAILED_APP_INVALID = 4;
	this.APP_LAUNCH_FAILED_APP_NOT_SUPPORTED = 5;
	this.APP_LAUNCH_FAILED_APP_PERMISSION_DENIED = 6;
	this.APP_LAUNCH_FAILED_APP_POLICY_DENIED = 7;
	this.APP_LAUNCH_FAILED_RTE_ERROR = 8;
	this.APP_LAUNCH_FAILED_APP_INVALID_METADATA = 9;
	this.APP_LAUNCH_FAILED_APP_NO_MEM = 10;
	this.APP_LAUNCH_FAILED_APP_RUNNING_ALREADY = 11;
	this.APP_LAUNCH_FAILED_APP_NOT_CONNECTED = 12;
	// o_appman_action_type_t otv = deprecated="5.1.3"
	this.REQUEST_TYPE_SHOW = 1;
	this.REQUEST_LPM_DELAY = 2;
	// o_appman_exit_reason_t otv = deprecated="5.1.3"
	this.APP_EXIT_NORMAL = 0;
	this.APP_EXIT_FROM_REQUEST = 1;
	this.APP_EXIT_ABNORMAL = 2;
	this.APP_EXIT_NO_MEMORY = 3;
	this.APP_EXIT_SERVICE_NOT_FOUND = 4;
	this.APP_EXIT_PERMISSION_DENIED = 5;
	this.APP_EXIT_NOT_FOUND = 6;
	this.APP_EXIT_INVALID_PARAM = 7;
	this.APP_EXIT_NOT_SUPPORTED = 8;
	this.APP_EXIT_RTE_ERROR = 9;
	this.APP_EXIT_SUSPENDED = 10;
	this.APP_EXIT_LOW_ON_RESOURCES = 11;
	this.APP_EXIT_APP_CORRUPTED = 12;
	this.APP_EXIT_APP_DELETED = 13;
	this.APP_EXIT_UNKNOWN = 14;
	// o_appman_launch_reason_t otv = deprecated="5.1.3"
	this.APP_LAUNCH_FROM_BOOT = 1;
	this.APP_LAUNCH_FROM_REQUEST = 0;
	this.APP_LAUNCH_FROM_SUSPEND = 2;
	this.APP_LAUNCH_UNKNOWN = 3;
	// applicationMode otv = deprecated="5.1.5"
	this.MODE_FOCUSED = 0;
	this.MODE_SUSPEND = 1;
	// AppState
	this.STATE_APP_DESTROYED = 0;
	this.STATE_APP_FOCUSED = 1;
	this.STATE_APP_BLURRED = 2;
	this.STATE_APP_HIDDEN = 3;
	this.STATE_APP_SUSPEND = 4;
	// AppStateRequestStatus
	this.STATUS_SUCCESS = 0;
	this.STATUS_FAILED = 1;
	this.STATUS_FAILED_INVALID_PARAM = 2;
	this.STATUS_FAILED_PERMISSION_DENIED = 3;
	this.STATUS_FAILED_APP_NOT_FOUND = 4;
	this.STATUS_FAILED_REQUEST_DENIED = 5;
	this.STATUS_FAILED_APP_NOT_SUPPORTED = 6;
	this.STATUS_FAILED_APP_NOT_RESPONDING = 7;
	this.STATUS_FAILED_RTE_ERROR = 8;
	this.STATUS_FAILED_INVALID_METADATA = 9;
	// AppStateChangeReason
	this.REASON_STATE_CHANGE_REQUESTED = 0;
	this.REASON_STATE_CHANGE_LOW_ON_RESOURCES = 1;
	this.REASON_STATE_CHANGE_APP_EXIT_UNKNOWN = 2;
	this.REASON_STATE_CHANGE_APP_UNINSTALLED = 3;
	this.REASON_STATE_CHANGE_APP_UPDATED = 4;
	this.REASON_STATE_CHANGE_RTE_ERROR = 5;
	this.REASON_STATE_CHANGE_APP_NOT_FOUND = 6;
	this.REASON_STATE_CHANGE_APP_NOT_RESPONDING = 7;
	// AppStateRequestResult
	this.RESULT_GRANTED = 1;
	this.RESULT_DENIED = 2;
	this.RESULT_NOT_REQUESTED = 1;
	// AppStateRequester
	this.REQUESTER_CONTROLAPP = 0;
	this.REQUESTER_SELF = 1;
	this.REQUESTER_APPMGR = 2;
	this.REQUESTER_APPLICATION = 3;
	this.REQUESTER_SERVICE = 4;
	this.REQUESTER_DIAL = 5;
	this.REQUESTER_WATCHER = 6;
	this.REQUESTER_USER=7;
	//AppMemoryType
	this.SMALL 	= 0;
	this.MEDIUM = 1;
	this.LARGE 	= 2;
	this.XLARGE = 3;

	// otv = deprecated="5.1.5"
	this.destroyApplication = function(appIdentifierInfo)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DESTROY_APPLICATION_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.ApplicationManager",
				// name: "OperationFailed",
				message : "Warning:This API is deprecated."
			}
		});
		return hdl;
	};

	this.isApplicationRunning = function(appIdentifierInfo)
	{
		this.logInfo("This API has not been supported yet!.");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_IS_APPLICATION_RUNNING_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.ApplicationManager",
				name : "OperationFailed",
				message : "not supported"
			}
		});
		return hdl;
	};

	// otv:deprecated="5.1.5"
	this.launchApplication = function(appIdentifierInfo)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_LAUNCH_APPLICATION_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.ApplicationManager",
				// name: "OperationFailed",
				message : "Warning:This API is deprecated."
			}
		});
		return hdl;
	};

	this.listRunningApplications = function()
	{
		this.logInfo("This API has not been supported yet!.");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_LIST_RUNNING_APPLICATIONS_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.ApplicationManager",
				name : "OperationFailed",
				message : "not supported"
			}
		});
		return hdl;
	};

	// otv:deprecated="5.1.5"
	this.requestApplicationAction = function(appIdentifierInfo, actionType, playload)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REQUEST_APPLICATION_ACTION_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.ApplicationManager",
				// name: "OperationFailed",
				message : "Warning:This API is deprecated."
			}
		});
		return hdl;
	};

	this.sendMessage = function(appIdentifierInfo, data)
	{
		this.logInfo("This API has not been supported yet!.");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SEND_MESSAGE_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.ApplicationManager",
				name : "OperationFailed",
				message : "not supported"
			}
		});
		return hdl;
	};

	this.requestAppState = function(appId, appState, additionalArgs)
	{	
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ApplicationManager",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.getAppState = function(appId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ApplicationManager",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.subscribeAppStateChangedEvents = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ApplicationManager",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.getAppMemoryUsage = function(appId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ApplicationManager",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.getAppsBudgetSizes = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ApplicationManager",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.notifyWhenEnoughMemory = function(memoryType)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.ApplicationManager",
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
})();
