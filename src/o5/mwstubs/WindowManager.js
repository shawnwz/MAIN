/**
 * Stub for CCOM.WindowManager, a singleton added since v5.0.0
 * @ignore
 */
CCOM.WindowManager = new (function WindowManager()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.WindowManager";
	this._id = CCOM.stubs.uuid();
	// events in xml
	this._EVENT_ON_INPUT_EVENT_OCCURRED = "inputEventOccurred";
	// events from methods
	this._EVENT_REGISTER_INPUT_EVENTS_OK = "registerInputEventsOK"; // otv:deprecated="5.1.5"
	this._EVENT_REGISTER_INPUT_EVENTS_FAILED = "registerInputEventsFailed"; // otv:deprecated="5.1.5"
	this._supportedEvents = [
		this._EVENT_ON_INPUT_EVENT_OCCURRED,
		this._EVENT_REGISTER_INPUT_EVENTS_OK, // otv:deprecated="5.1.5"
		this._EVENT_REGISTER_INPUT_EVENTS_FAILED // otv:deprecated="5.1.5"
	];

	/*
	 * The object exists since the beginning (v5.0.0)
	 */
	// inputEventSignalTypes
	this.INPUT_EVENT_TYPE_STEAL_KEY = 1;
	// winmanInputEventTypes
	this.KEY_PRESS = 1;
	this.KEY_RELEASE = 2;

	// otv:deprecated="5.1.5"
	this.registerInputEvents = function(winInputEvent)
	{
		this.logDeprecated();
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REGISTER_INPUT_EVENTS_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.WindowManager",
				message : "Warning:This API is deprecated. "
			}
		});
		return _handle;
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
})();
