/**
 * Stub for AIM (Application Information Manager): CCOM.AppinfoManager
 * @ignore
 */
CCOM.AppinfoManager = new (function AppinfoManager()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.AppinfoManager";
	this._id = CCOM.stubs.uuid();
	
	// events in xml
	this._EVENT_ON_APP_INSTALL 						= "onAppInstall";
	this._EVENT_ON_APP_UNINSTALL 					= "onAppUninstall";
	this._EVENT_ON_APP_UPDATE 						= "onAppUpdate";
	this._EVENT_ON_SYSTEM_APP_INSTALL_STATUS 		= "onSystemAppInstallStatus";
	// events from methods
	this._EVENT_INSTALL_APP_OK 						= "installAppOK";
	this._EVENT_INSTALL_APP_FAILED 					= "installAppFailed";
	this._EVENT_UPDATE_APP_OK 						= "updateAppOK";
	this._EVENT_UPDATE_APP_FAILED 					= "updateAppFailed";
	this._EVENT_UNINSTALL_APP_OK 					= "uninstallAppOK";
	this._EVENT_UNINSTALL_APP_FAILED 				= "uninstallAppFailed";
	this._EVENT_GET_APPINFO_BY_QUERY_OK 			= "getAppinfoByQueryOK";
	this._EVENT_GET_APPINFO_BY_QUERY_FAILED			= "getAppinfoByQueryFailed";
	this._EVENT_INSTALL_SYSTEM_APP_PKG_OK 			= "installSystemAppPkgOK";
	this._EVENT_INSTALL_SYSTEM_APP_PKG_FAILED 		= "installSystemAppPkgFailed";
	this._EVENT_CANCEL_REQUEST_OK 					= "cancelRequestOK";
	this._EVENT_CANCEL_REQUEST_FAILED 				= "cancelRequestFailed";
	this._EVENT_GET_SYSTEM_APP_PKG_STATUS_FAILED	="getSystemAppPkgStatusFailed";
	
	this._supportedEvents = [
		this._EVENT_ON_APP_INSTALL,
		this._EVENT_ON_APP_UNINSTALL,
		this._EVENT_ON_APP_UPDATE,
		this._EVENT_INSTALL_APP_OK,
		this._EVENT_INSTALL_APP_FAILED,
		this._EVENT_UPDATE_APP_OK,
		this._EVENT_UPDATE_APP_FAILED,
		this._EVENT_UNINSTALL_APP_OK,
		this._EVENT_UNINSTALL_APP_FAILED,
		this._EVENT_GET_APPINFO_BY_QUERY_OK,
		this._EVENT_GET_APPINFO_BY_QUERY_FAILED,
		this._EVENT_INSTALL_SYSTEM_APP_PKG_OK,
		this._EVENT_INSTALL_SYSTEM_APP_PKG_FAILED,
		this._EVENT_CANCEL_REQUEST_OK,
		this._EVENT_CANCEL_REQUEST_FAILED,
		this._EVENT_ON_SYSTEM_APP_INSTALL_STATUS
	];
	
	// each added app is an obj occupying one slice in this array
	this._apps = [];
	this._ver = CCOM.stubs.getCurrentMWVersion();

	this.O_AIM_STATE_DOWNLOADING 	= 1;
	this.O_AIM_STATE_INSTALLING 	= 2;
	this.O_AIM_STATE_UNINSTALLING 	= 3;
	this.O_AIM_STATE_UPDATING 		= 4;
	this.O_AIM_STATE_COMPLETED 		= 15;
	
	// o_aim_status_t otv=deprecated="5.1.3"
	this.O_AIM_STATUS_SUCCESS 				= 0;
	this.O_AIM_STATUS_FAILURE 				= 1;
	this.O_AIM_STATUS_INVALID_OPERATION 	= 2;
	this.O_AIM_STATUS_INVALID_PARAM 		= 3;
	this.O_AIM_STATUS_INVALID_DATA 			= 4;
	this.O_AIM_STATUS_UUID_NOT_MATCH 		= 5;
	this.O_AIM_STATUS_ACCESS_DENIED 		= 6;
	this.O_AIM_STATUS_DOWNLOAD_FAILED 		= 7;
	this.O_AIM_STATUS_DB_NO_ENTRY 			= 8;
	this.O_AIM_STATUS_DB_ERROR 				= 9;
	this.O_AIM_STATUS_UNSIGNED_PKG 			= 10;
	this.O_AIM_STATUS_SIGN_VERIFY_FAILED 	= 11;
	
	// installState
	this.STATE_DOWNLOADING 	= 1;
	this.STATE_INSTALLING 	= 2;
	this.STATE_UNINSTALLING = 3;
	this.STATE_UPDATING 	= 4;
	this.STATE_COMPLETED 	= 15;
	
	// aimStatus
	this.STATUS_SUCCESS 			= 0;
	this.STATUS_FAILURE 			= 1;
	this.STATUS_INVALID_OPERATION 	= 2;
	this.STATUS_INVALID_PARAM 		= 3;
	this.STATUS_INVALID_DATA 		= 4;
	this.STATUS_UUID_NOT_MATCH 		= 5;
	this.STATUS_ACCESS_DENIED 		= 6;
	this.STATUS_DOWNLOAD_FAILED 	= 7;
	this.STATUS_DB_NO_ENTRY 		= 8;
	this.STATUS_DB_ERROR 			= 9;
	this.STATUS_UNSIGNED_PKG 		= 10;
	this.STATUS_SIGN_VERIFY_FAILED 	= 11;
	this.STATUS_INVALID_APPLICATION = 12;
	this.STATUS_REQUEST_CANCELLED 	= 13;
	this.STATUS_SERVICE_BUSY		= 14;
	this.STATUS_NOT_ENOUGH_SPACE	= 15;
	this.STATUS_EXCEEDS_SIZE_LIMIT	= 16;
	this.STATUS_IN_PROGRESS			= 17;
	this.STATUS_NO_PENDING_REQUEST	=18;
	//PkgInstallType
	this.PKG_DOWNLOAD_AND_INSTALL	= 1;
	this.PKG_DOWNLOAD_AND_VERIFY	= 2;
	this.PKG_INSTALL_DOWNLOADED		= 3;

	/**
	 * @method installApp
	 * @param {String}
	 *            downloadUrl The location of the metadata
	 * @return An integer handle uniquely identifying this call..
	 */
	this.installApp = function(downloadUrl)
	{
		var app_id;
		var requestID = CCOM.stubs.uuid();

		if (arguments.length < 1)
		{
			throw "usage: CCOM.AIM.installApp(downloadUrl)";
		}
		if ((typeof downloadUrl !== 'string') || downloadUrl.constructor !== String)
		{
			throw "The first param should be string!";
		}
		app_id = CCOM.stubs.uuid();
		this._apps[this._apps.length] = {
			id : app_id,
			source : downloadUrl
		};
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_INSTALL_APP_OK, {
			target : this,
			handle : CCOM.stubs.getHandle(),
			requestID : requestID
		});
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ON_APP_INSTALL, {
			target : this,
			handle : CCOM.stubs.getHandle(),
			status : {
				currentState : this.STATE_COMPLETED,
				errorCode : this.STATUS_SUCCESS,
				errorMessage : "",
				percentage : 100,
				requestID : requestID,
				uuid : ""
			}
		}, 2000);
		return app_id;
	};

	/**
	 * Delete apps from AIM
	 * 
	 * @method delete
	 * @param {Array}
	 *            idList An array of UUIDs (string)
	 * @return {Array} invalid list of UUIDs (string)
	 */
	this.uninstallApp = function(uuid)
	{
		var i, j, hdl, requestID = CCOM.stubs.uuid();

		if (arguments.length < 1)
		{
			throw "usage: CCOM.AIM.delete(uuid)";
		}
		if ((typeof uuid !== 'string') || uuid.constructor !== String)
		{
			throw "The first param should be string!";
		}
		// clone the list, for emitting onDelete event
		// cloneList = idList.filter(function () { return true; });
		for (j = 0, i = 0; j < this._apps.length; j += 1)
		{
			if (uuid === this._apps[j].id)
			{
				this._apps.splice(j, 1);
				i -= 1;
				break;
			}
		}
		hdl = CCOM.stubs.getHandle();
		if (i !== 0)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UNINSTALL_APP_OK, {
				target : this,
				handle : hdl,
				requestID : requestID
			});
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ON_APP_UNINSTALL, {
				target : this,
				handle : CCOM.stubs.getHandle(),
				status : {
					currentState : this.STATE_COMPLETED,
					errorCode : this.STATUS_SUCCESS,
					errorMessage : "",
					percentage : 100,
					requestID : requestID,
					uuid : ""
				}
			}, 2000);
		}
		else
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UNINSTALL_APP_FAILED, {
				target : this,
				handle : hdl
			});
		}
		return hdl;
	};

	/**
	 * @method getAppinfoByQuery
	 * @param {String}
	 *            properties The comma-separated metadata properties the client is interested in, e.g. UUID, UID, GID, APP_ID
	 * @param {String}
	 *            criteria The criteria for selecting the entry. If ther eare multiple criteria, they must be separated by 'AND'.
	 * @param {String}
	 *            orderby How to order the resultset
	 * @param {Number}
	 *            maxCount The maximum number of rows that can be returned.
	 * @return {Object} applicationInfo An array consisting of hashtables with requested application data. The hashtable consists of
	 *         metadata properties as keynames and their values.
	 */
	this.getAppinfoByQuery = function(properties, criteria, orderby, maxCount)
	{
		var hdl = CCOM.stubs.getHandle();

		if (arguments.length < 4)
		{
			throw "usage: CCOM.AIM.getAppinfoByQuery(properties, criteria, orderby, maxCount)";
		}
		if (properties.constructor !== String)
		{
			throw "The first param should be string!";
		}
		if (criteria && criteria.constructor !== String)
		{
			throw "The second param should be string!";
		}
		if (orderby && orderby.constructor !== String)
		{
			throw "The third param should be string!";
		}
		if (maxCount.constructor !== Number)
		{
			throw "The fourth parm should be number!";
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_APPINFO_BY_QUERY_OK, {
			target : this,
			handle : hdl,
			applicationInfo : [ {
				NAME : "test1",
				UUID : "1234"
			}, {
				NAME : "test2",
				UUID : "1235"
			}, {
				NAME : "Appstore",
				UUID : "1236"
			} ]
		});
		return hdl;
	};
	
	this.getSystemAppPkgStatus= function(){
        var hdl = CCOM.stubs.getHandle();
        this.logWarning("This API has not been implemented yet!");
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_SYSTEM_APP_PKG_STATUS_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: "com.opentv.AppinfoManager",
				message: "Warning:This API is not implemented. "
			}
		});
		this.logInfo("This API has been added in 5.2.1!.");
		return hdl;
  };


	/**
	 * @method update
	 * @param {String}
	 *            downloadUrl The metadata with update information
	 * @param {String}
	 *            uuid The UUID that identifies the entry to be updated
	 * @return no return (according to xml)
	 */
	this.updateApp = function(downloadUrl, uuid)
	{
		var j, i, requestID = CCOM.stubs.uuid();

		if (arguments.length < 2)
		{
			throw "usage: CCOM.AIM.update(downloadUrl, uuid)";
		}
		if ((typeof downloadUrl !== 'string') || downloadUrl.constructor !== String)
		{
			throw "The first param should be string!";
		}
		if ((typeof uuid !== 'string') || uuid.constructor !== String)
		{
			throw "The second param should be string!";
		}
		for (j = 0, i = 0; j < this._apps.length; j += 1)
		{
			if (uuid === this._apps[j].id)
			{
				this._apps[j].source = downloadUrl;
				i -= 1;
				break;
			}
		}
		var hdl = CCOM.stubs.getHandle();

		if (i !== 0)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UPDATE_APP_OK, {
				target : this,
				handle : hdl,
				requestID : requestID
			});
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ON_APP_UPDATE, {
				target : this,
				handle : CCOM.stubs.getHandle(),
				status : {
					currentState : this.STATE_COMPLETED,
					errorCode : this.STATUS_SUCCESS,
					errorMessage : "",
					percentage : 100,
					requestID : requestID,
					uuid : ""
				}
			}, 2000);
		}
		else
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UPDATE_APP_FAILED, {
				target : this,
				handle : hdl
			});
		}
		return hdl;
	};

	this.installSystemAppPkg = function(downloadUrl, installType){
		this.logWarning("This API has not been implemented yet!");
        return {
			error: {
				domain  : "com.opentv.AppinfoManager",
				name    : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.cancelRequest= function(requestID){
		this.logWarning("This API has not been implemented yet!");
        return {
			error: {
				domain  : "com.opentv.AppinfoManager",
				name    : "Failed",
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
