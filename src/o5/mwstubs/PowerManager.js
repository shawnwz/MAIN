/**
 * Stub for Power Manager: CCOM.Pwrmgr, a singleton introduced in v5.1.2
 * @ignore
 */
CCOM.Pwrmgr = new (function Pwrmgr()
{
	//"use strict";
	//var _obj, _id, _ns, _supportedEvents, _EVENT_ON_PWRMGR_MODE_CHANGED, _EVENT_MODE_CHANGE_SIGNAL,
	//	_STANDBY_OFF_MODE, _STANDBY_ON_MODE, _LOW_POWER_MODE, _currentMode;
	this._id = CCOM.stubs.uuid();
	this._ns = "CCOM.Pwrmgr";
	this._EVENT_ON_PWRMGR_MODE_CHANGED = "onPwrmgrModeChanged";

	this._EVENT_MODE_CHANGE_SIGNAL = "modeChangeSignal";
	this._supportedEvents = [
		this._EVENT_ON_PWRMGR_MODE_CHANGED,
		this._EVENT_MODE_CHANGE_SIGNAL
	];
	this._STANDBY_OFF_MODE = 0;
	this._STANDBY_ON_MODE = 1;
	this._LOW_POWER_MODE = 2;
	this._currentMode = this._LOW_POWER_MODE;

	//PwrmgrMode
	this.STANDBY_OFF = this._STANDBY_OFF_MODE;
	this.STANDBY_ON = this._STANDBY_ON_MODE;
	this.LOW_POWER = this._LOW_POWER_MODE;
	//system_wake_reason
	this.STB_WAKE_REASON_BOOTUP = 0;
	this.STB_WAKE_REASON_KEYPRESS = 1;
	this.STB_WAKE_REASON_SCHEDULED = 2;
	this.STB_WAKE_REASON_WOL = 3;
	//PI_STB_Mode
	//STANDBY_OFF= 0;
	//STANDBY_ON= 1;
	this.SUSPEND_TO_RAM = 2;
	this.SOFT_OFF = 3;
	//pwrmgr_client
	this.PWRMGR_CLIENT_DEFER = 0;
	this.PWRMGR_CLIENT_PREPARE = 1;
	this.userModeGet = function()
	{
		return this._currentMode;
	};
	this.userModeSet = function(pwrmgr_mode)
	{
		switch (pwrmgr_mode)
		{
		case this._LOW_POWER_MODE:
		case this._STANDBY_OFF_MODE:
		case this._STANDBY_ON_MODE:
			this._currentMode = pwrmgr_mode;
			return this._currentMode;
		default:
			this.logInfo("Unknown power status");
			return {
				error : {
					domain : "com.opentv.Pwrmgr",
					name : "Failed",
					message : "Unknown power status"
				}
			};
		}
	};
	this.userReboot = function(force_reboot)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Pwrmgr",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};
	this.userWakeReasonGet = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Pwrmgr",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};
	this.ModeGet = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Pwrmgr",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};
	this.WakeReasonGet = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Pwrmgr",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};
	this.Reboot = function(force_reboot)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Pwrmgr",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};
	this.clientRegister = function(szName, enType, callback_func, cookie)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Pwrmgr",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.clientUnregister = function(clientHandle)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Pwrmgr",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.clientResponse = function(clientHandle, PeriodSec, sessionTag)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Pwrmgr",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};
	
	this.modeSet = function(pwrmgr_mode){
		this.logWarning("This API has not been implemented yet!");
		return {
			error: {
				domain  : "com.opentv.Pwrmgr",
				name    : "Failed",
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
		return CCOM.stubs.addEventListener(this._id, this._ns, event, callback);
	};
	this.removeEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.removeEventListener(this._id, this._ns, event, callback);
	};
})();
