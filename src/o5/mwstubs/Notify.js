/**
 * Stub for NOTIFYSERVICE: CCOM.NotifyService
 * @ignore
 */
CCOM.NotifyService = new (function NotifyService()
{
	"use strict";
	this._MY_NAME_SPACE = "CCOM.NotifyService";
	this._id = CCOM.stubs.uuid();
	// events in xml

	this._EVENT_ON_NOTIFY_MESSAGE = "onNotifyMessage";

	this._supportedEvents = [ this._EVENT_ON_NOTIFY_MESSAGE ];

	/**
	 * @method addEventListener
	 * @param {String} eventName The name of the event to listen for
	 * @param {Function} eventHandler The event handler function to be called when an event occurs
	 * @return {Object} An empty object indicates success; otherwise failure.
	 */
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
