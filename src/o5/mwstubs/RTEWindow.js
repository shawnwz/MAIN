/**
 * Stub for CCOM 2.0 CCOM.RTEWindow, a singleton added since v5.1.2
 * @ignore
 */
CCOM.RTEWindow = new (function()
{
	"use strict";
	this._MY_NAME_SPACE = "CCOM.RTEWindow";
	this._id = CCOM.stubs.uuid();
	this._ver = CCOM.stubs.getCurrentMWVersion();

	// events in xml
	this._EVENT_ON_LOST_FOCUS = "onLostFocus";
	this._EVENT_ON_GOT_FOCUS = "onGotFocus";
	this._supportedEvents = [
		this._EVENT_ON_LOST_FOCUS,
		this._EVENT_ON_GOT_FOCUS
	];

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
