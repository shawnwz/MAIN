/**
 * Stub for AppTimeSource: CCOM.AppTimeSource singleton, which was added since OTV5 v5.1.1
 * @ignore
 */
CCOM.AppTimeSource = new (function AppTimeSource()
{
	"use strict";
	this._MY_NAME_SPACE = "CCOM.AppTimeSource";
	this._ver = CCOM.stubs.getCurrentMWVersion();
	this._id = CCOM.stubs.uuid();
	this._supportedEvents = [];

	this.setTimeData = function(remoteUTC, systemUTC)
	{
		if (arguments.length < 2)
		{
			throw "usage: CCOM.ApplicationTime(remoteUTC, systemUTC)";
		}
		if ((typeof remoteUTC !== 'number') || remoteUTC.constructor !== Number)
		{
			throw "The first parm should be number!";
		}
		if ((typeof systemUTC !== 'number') || systemUTC.constructor !== Number)
		{
			throw "The second parm should be number!";
		}
		return {
			error : {
				domain : "com.opentv.AppTimeSource",
				name : "InvalidData",
				message : "Set time data failed!"
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
