/**
 * Stub for Software Upgrade Manager: CCOM.SoftwareUpgradeManager, which was added in v5.0.0
 * @ignore
 */
CCOM.SoftwareUpgradeManager = new (function SoftwareUpgradeManager()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.SoftwareUpgradeManager";
	this._id = CCOM.stubs.uuid();

	// events in xml
	this._EVENT_UPGRADE_STATUS_NOITFICATION = "upgradeStatusNotification";
	this._EVENT_SYSTEM_PACKAGE_UPGRADE_AVAILABLE = "systemPackageUpgradeAvailable";
	// events from methods
	this._EVENT_GET_UPGRADE_STATUS_OK = "getUpgradeStatusOK";
	this._EVENT_GET_UPGRADE_STATUS_FAILED = "getUpgradeStatusFailed";
	this._EVENT_REQUEST_UPGRADE_OK = "requestUpgradeOK";
	this._EVENT_REQUEST_UPGRADE_FAILED = "requestUpgradeFailed";
	this._EVENT_IS_SYSTEM_PACKAGE_UPGRADE_AVAILABLE_OK = "isSystemPackageUpgradeAvailableOK";
	this._EVENT_IS_SYSTEM_PACKAGE_UPGRADE_AVAILABLE_FAILED = "isSystemPackageUpgradeAvailableFailed";
	this._supportedEvents = [
		this._EVENT_UPGRADE_STATUS_NOITFICATION,
		this._EVENT_SYSTEM_PACKAGE_UPGRADE_AVAILABLE,
		this._EVENT_GET_UPGRADE_STATUS_OK,
		this._EVENT_GET_UPGRADE_STATUS_FAILED,
		this._EVENT_REQUEST_UPGRADE_OK,
		this._EVENT_REQUEST_UPGRADE_FAILED,
		this._EVENT_IS_SYSTEM_PACKAGE_UPGRADE_AVAILABLE_OK,
		this._EVENT_IS_SYSTEM_PACKAGE_UPGRADE_AVAILABLE_FAILED
	];

	/*
	 * The object exists since the beginning (v5.0.0)
	 */
	//o_sum_error_t
	this.O_SUM_ERROR_FAILED = 1;
	this.O_SUM_ERROR_INVALID_PARAMS = 2;
	this.O_SUM_ERROR_PERMISSION_DENIED = 3;
	this.O_SUM_ERROR_UPGRADE_PENDING = 4;
	this.O_SUM_ERROR_SCHEDULE_FAILED = 5;
	this.O_SUM_ERROR_NO_UPGRADE_REQUESTED = 6;
	this.O_SUM_ERROR_INVALID_IMAGE = 7;
	this.O_SUM_ERROR_DOWNLOAD_FAILED = 8;
	this.O_SUM_ERROR_POLICY_DENIED = 9;
	this.O_SUM_ERROR_REQUEST_TIMEOUT = 10;
	this.O_SUM_ERROR_REQUEST_CANCELLED = 11;
	this.O_SUM_ERROR_INTERNAL = 12;
	this.O_SUM_ERROR_NO_DATA_STREAMS = 13;
	this.O_SUM_ERROR_UNKNOWN = 14;
	//o_sum_state_t
	this.O_SUM_STATE_IDLE = 0;
	this.O_SUM_STATE_IMAGE_AVAILABLE = 1;
	this.O_SUM_STATE_DOWNLOAD_SCHEDULED = 2;
	this.O_SUM_STATE_DOWNLOAD_PROGRESS = 3;
	this.O_SUM_STATE_DOWNLOAD_COMPLETE = 4;
	this.O_SUM_STATE_REBOOT_SCHEDULED = 5;
	this.O_SUM_STATE_STOPPING = 6;
	this.O_SUM_STATE_UPDATE_COMPLETE = 7;

	//o_sum_upgrade_type_t
	this.SUM_UPGRADE_TYPE_FORCED = 1;
	this.SUM_UPGRADE_TYPE_STANDBY = 2;
	this.SUM_UPGRADE_TYPE_MANUAL = 3;
	//UpgradeType
	//SUM_UPGRADE_TYPE_FORCED= 1;
	//SUM_UPGRADE_TYPE_STANDBY= 2;
	//SUM_UPGRADE_TYPE_MANUAL= 3;
	//SoftwareLevel
	this.SUM_SOFTWARE_LEVEL_BETA_TEST = 16;
	this.SUM_SOFTWARE_LEVEL_PRODUCTION = 32;
	this.SUM_SOFTWARE_LEVEL_ANY = 255;
	this.getUpgradeStatus = function()
	{
		this.logWarning("This API has not been supported yet!");
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_UPGRADE_STATUS_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.SoftwareUpgradeManager",
				name : "OperationFailed",
				message : "not supported"
			}
		});
		return _handle;
	};
	this.requestUpgrade = function(isCancel, upgradeInfo)
	{
		this.logWarning("This API has not been supported yet!");
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REQUEST_UPGRADE_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.SoftwareUpgradeManager",
				name : "OperationFailed",
				message : "not supported"
			}
		});
		return _handle;
	};
	this.isSystemPackageUpgradeAvailable = function()
	{
		this.logWarning("This API has not been supported yet!");
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_IS_SYSTEM_PACKAGE_UPGRADE_AVAILABLE_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.SoftwareUpgradeManager",
				name : "OperationFailed",
				message : "not supported"
			}
		});
		return _handle;
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
