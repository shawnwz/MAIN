/**
 * Stub for DSMCC: CCOM.Dsmcc
 * @ignore
 *
 */
CCOM.Dsmcc = new (function Dsmcc()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.Dsmcc";
	this._id = CCOM.stubs.uuid();
	// events in xml
	this._EVENT_ON_STREAM_EVENT_RECEIVED = "onStreamEventReceived";
	// events from methods
	this._EVENT_SUBSCRIBE_TO_STREAM_EVENT_OK = "subscribeToStreamEventOK";
	this._EVENT_SUBSCRIBE_TO_STREAM_EVENT_FAILED = "subscribeToStreamEventFailed";
	this._EVENT_UNSUBSCRIBE_FROM_STREAM_EVENT_OK = "unsubscribeFromStreamEventok";
	this._EVENT_UNSUBSCRIBE_FROM_STREAM_EVENT_FAILED = "unsubscribeFromStreamEventFailed";
	this._supportedEvents = [
		this._EVENT_ON_STREAM_EVENT_RECEIVED,
		this._EVENT_SUBSCRIBE_TO_STREAM_EVENT_OK,
		this._EVENT_SUBSCRIBE_TO_STREAM_EVENT_FAILED,
		this._EVENT_UNSUBSCRIBE_FROM_STREAM_EVENT_OK,
		this._EVENT_UNSUBSCRIBE_FROM_STREAM_EVENT_FAILED
	];

	/**
	 * @method subscribeToStreamEvent
	 * @param {String}
	 * @param {String}
	 */
	this.subscribeToStreamEvent = function(target_uri, eventName)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.dsmcc",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	/**
	 * @method unsubscribeFromStreamEvent
	 * @param {String}
	 * @param {String}
	 */
	this.unsubscribeFromStreamEvent = function(target_uri, eventName)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.dsmcc",
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
