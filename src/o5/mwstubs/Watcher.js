/**
 * Stub for WATCHER: CCOM.Watcher
 * @ignore
 */
CCOM.Watcher = new (function Watcher()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.Watcher";
	this._id = CCOM.stubs.uuid();
	// events in xml
	this._EVENT_LAUNCH_STATUS = "launchStatus";
	// events from methods
	this._EVENT_LAUNCH_APP_OK = "launchAppOK";
	this._EVENT_LAUNCH_APP_FAILED = "launchAppFailed";
	this._EVENT_HANDLE_CONNECTION_EVENT_OK = "handleConnectionEventOK";
	this._EVENT_HANDLE_CONNECTION_EVENT_FAILED = "handleConnectionEventFailed";
	this._supportedEvents = [
		this._EVENT_LAUNCH_STATUS,
		this._EVENT_LAUNCH_APP_OK,
		this._EVENT_LAUNCH_APP_FAILED,
		this._EVENT_HANDLE_CONNECTION_EVENT_OK,
		this._EVENT_HANDLE_CONNECTION_EVENT_FAILED
	];
	// LaunchState
	this.O_WATCHER_STATE_LAUNCH_WAITING = 1;
	this.O_WATCHER_STATE_LAUNCH_RUNNING = 2;
	this.O_WATCHER_STATE_LAUNCH_COMPLETE = 3;
	this.O_WATCHER_STATE_LAUNCH_ABORTED = 4;
	// WatcherResult
	this.O_WATCHER_OK = 0;
	this.O_WATCHER_ERROR_FAILED = 1;
	this.O_WATCHER_ERROR_INVALID_OPERATION = 2;
	this.O_WATCHER_ERROR_INVALID_PARAM = 3;
	this.O_WATCHER_ERROR_UNKNOWN = 0xFF;
	// LaunchFailedReason
	this.O_WATCHER_LAUNCH_OK = 0;
	this.O_WATCHER_LAUNCH_FAILED_REASON_NOT_SUPPORTED = -1;
	this.O_WATCHER_LAUNCH_FAILED_REASON_INTERNAL = -2;
	this.O_WATCHER_LAUNCH_FAILED_REASON_GENERIC = -3;

	/**
	 * @method launchApp
	 * @param {Object}
	 *            request The structure contains the information about the app request. It specifies a map containing information about the
	 *            application that is to be launched.
	 * 
	 * @return {Number} requestId If call is successful then requestID contains an unique identifier (Request ID) for the launch operation.
	 *         If the call failed then the return "error" value will be GError
	 */
	this.launchApp = function(request)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Watcher",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	/**
	 * @method handleConnectionEvent
	 * 
	 * @param {Number}
	 *            eventType May be connected, disconnected or PMT update
	 * 
	 * @param {Number}
	 *            connectionId Handle to the connection. Used to identify the connection in case we have multiple connections where some are
	 *            of interest to watcher and some are not (e.g. we're only interested in a disconnect if the connect with the same ID was of
	 *            interest to watcher)
	 * 
	 * @param {String}
	 *            srcUri Identifies the source used in the connection so watcher can: 1) establish whether the connection is of interest
	 *            (Initially only interested in sources of tv://... but later may be interested in other sources, e.g. pvr://...). 2) Use
	 *            this information in conjunction with the information from the AIT to establish how applications can run.
	 * 
	 * @param {String}
	 *            destUri Identifies the destination used in the connection so watcher can establish whether the connection is of interest
	 *            to watcher. (Initially only interested in destinations of display://... Is the URI different for PIP?
	 * 
	 */
	this.handleConnectionEvent = function(eventType, connectionId, srcUri, destUri)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Watcher",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	/**
	 * @method addEventListener
	 * @param {String}
	 *            eventName The name of the event to listen for
	 * @param {Function}
	 *            eventHandler The event handler function to be called when an event occurs
	 * @return {Object} An empty object indicates success; otherwise failure.
	 */
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
