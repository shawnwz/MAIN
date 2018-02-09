/**
 * Stub for DRM (Digital Rights Management): CCOM.DRM
 * This singleton has been added since OTV5 v5.1.2
 * @ignore
 */
CCOM.DRM = new (function DRM ()
{
	//"use strict";
	this._id = CCOM.stubs.uuid();
	this._ns = "CCOM.DRM";
	// Events in xml
	this._EVENT_DRM_SESSION_EVENT = "drmSessionEvent";
	this._EVENT_DRM_ASSET_EVENT = "drmAssetEvent";
	// events from methods
	this._EVENT_GET_DRM_INFO_OK = "getDrmInfoOK";
	this._EVENT_GET_DRM_INFO_FAILED = "getDrmInfoFailed";
	this._EVENT_GET_DRM_LIST_OK = "getDrmListOK";
	this._EVENT_GET_DRM_LIST_FAILED = "getDrmListFailed";
	this._EVENT_SESSION_CREATE_OK = "sessionCreateOK";
	this._EVENT_SESSION_CREATE_FAILED = "sessionCreateFailed";
	this._EVENT_SESSION_START_OK = "sessionStartOK";
	this._EVENT_SESSION_START_FAILED = "sessionStartFailed";
	this._EVENT_SESSION_STOP_OK = "sessionStopOK";
	this._EVENT_SESSION_STOP_FAILED = "sessionStopFailed";
	this._EVENT_SESSION_DESTROY_OK = "sessionDestroyOK";
	this._EVENT_SESSION_DESTROY_FAILED = "sessionDestroyFailed";
	this._EVENT_DRM_INFO_GET_OK = "drmInfoGetOK";
	this._EVENT_DRM_INFO_GET_FAILED = "drmInfoGetFailed";
	this._EVENT_KEY_INFO_GET_OK = "keyInfoGetOK";
	this._EVENT_KEY_INFO_GET_FAILED = "keyInfoGetFailed";
	this._EVENT_CREDENTIAL_INFO_GET_OK = "credentialInfoGetOK";
	this._EVENT_CREDENTIAL_INFO_GET_FAILED = "credentialInfoGetFailed";
	this._EVENT_CREDENTIAL_GET_OK = "credentialGetOK";
	this._EVENT_CREDENTIAL_GET_FAILED = "credentialGetFailed";
	this._EVENT_CREDENTIAL_CLONE_OK = "credentialCloneOK";
	this._EVENT_CREDENTIAL_CLONE_FAILED = "credentialCloneFailed";
	this._EVENT_DRM_MANAGEMENT_MESSAGE_POST_OK = "drmManagementMessagePostOK";
	this._EVENT_DRM_MANAGEMENT_MESSAGE_POST_FAILED = "drmManagementMessagePostFailed";
	this._EVENT_USAGE_RULES_GET_OK = "usageRulesGetOK";
	this._EVENT_USAGE_RULES_GET_FAILED = "usageRulesGetFailed";
	this._EVENT_LEGACY_ASSET_MIGRATE_OK = "legacyAssetMigrateOK";
	this._EVENT_LEGACY_ASSET_MIGRATE_FAILED = "legacyAssetMigrateFailed";
	this._EVENT_HOME_NETWORK_INFO_QUERY_OK = "homeNetworkInfoQueryOK";
	this._EVENT_HOME_NETWORK_INFO_QUERY_FAILED = "homeNetworkInfoQueryFailed";
	this._EVENT_GET_SUPPORTED_DRM_OK = "getSupportedDrmOK";
	this._EVENT_GET_SUPPORTED_DRM_FAILED = "getSupportedDrmFailed";
	this._EVENT_LICENSE_REQUEST_GENERATE_OK = "licenseRequestGenerateOK";
	this._EVENT_LICENSE_REQUEST_GENERATE_FAILED = "licenseRequestGenerateFailed";
	this._EVENT_CREDENTIAL_ADD_OK = "credentialAddOK";
	this._EVENT_CREDENTIAL_ADD_FAILED = "credentialAddFailed";
	this._EVENT_KEY_INFO_GET_EXTENDED_OK = "keyInfoGetExtendedOK";
	this._EVENT_KEY_INFO_GET_EXTENDED_FAILED = "keyInfoGetExtendedFailed";
	this._EVENT_IS_KEY_AVAILABLE_OK = "isKeyAvailableOK";
	this._EVENT_IS_KEY_AVAILABLE_FAILED = "isKeyAvailableFailed";
	this._EVENT_GET_IDS_OK = "getIdsOK";
	this._EVENT_GET_IDS_FAILED = "getIdsFailed";
	this._EVENT_GET_REPORT_OK = "getReportOK";
	this._EVENT_GET_REPORT_FAILED = "getReportFailed";
	this._EVENT_GET_LICENSE_INFO_OK = "getLicenseInfoOK";
	this._EVENT_GET_LICENSE_INFO_FAILED = "getLicenseInfoFailed";
	this._EVENT_GET_NUM_DELETED_SECURE_STOPS_OK = "getNumDeletedSecureStopsOK";
	this._EVENT_GET_NUM_DELETED_SECURE_STOPS_FAILED = "getNumDeletedSecureStopsFailed";
	this._EVENT_GET_DRM_DATA_OK = "getDrmDataOK";
	this._EVENT_GET_DRM_DATA_FAILED = "getDrmDataFailed";
	this._EVENT_SET_DRM_DATA_OK = "setDrmDataOK";
	this._EVENT_SET_DRM_DATA_FAILED = "setDrmDataFailed";
	 
	 // currently; all events are supported
	this._supportedEvents = [

		this._EVENT_DRM_SESSION_EVENT,
		this._EVENT_DRM_ASSET_EVENT,
		this._EVENT_GET_DRM_INFO_OK,
		this._EVENT_GET_DRM_INFO_FAILED,
		this._EVENT_GET_DRM_LIST_OK,
		this._EVENT_GET_DRM_LIST_FAILED,
		this._EVENT_SESSION_CREATE_OK,
		this._EVENT_SESSION_CREATE_FAILED,
		this._EVENT_SESSION_START_OK,
		this._EVENT_SESSION_START_FAILED,
		this._EVENT_SESSION_STOP_OK,
		this._EVENT_SESSION_STOP_FAILED,
		this._EVENT_SESSION_DESTROY_OK,
		this._EVENT_SESSION_DESTROY_FAILED,
		this._EVENT_DRM_INFO_GET_OK,
		this._EVENT_DRM_INFO_GET_FAILED,
		this._EVENT_KEY_INFO_GET_OK,
		this._EVENT_KEY_INFO_GET_FAILED,
		this._EVENT_CREDENTIAL_INFO_GET_OK,
		this._EVENT_CREDENTIAL_INFO_GET_FAILED,
		this._EVENT_CREDENTIAL_GET_OK,
		this._EVENT_CREDENTIAL_GET_FAILED,
		this._EVENT_CREDENTIAL_CLONE_OK,
		this._EVENT_CREDENTIAL_CLONE_FAILED,
		this._EVENT_DRM_MANAGEMENT_MESSAGE_POST_OK,
		this._EVENT_DRM_MANAGEMENT_MESSAGE_POST_FAILED,
		this._EVENT_USAGE_RULES_GET_OK,
		this._EVENT_USAGE_RULES_GET_FAILED,
		this._EVENT_LEGACY_ASSET_MIGRATE_OK,
		this._EVENT_LEGACY_ASSET_MIGRATE_FAILED,
		this._EVENT_HOME_NETWORK_INFO_QUERY_OK,
		this._EVENT_HOME_NETWORK_INFO_QUERY_FAILED,
		this._EVENT_GET_SUPPORTED_DRM_OK,
		this._EVENT_GET_SUPPORTED_DRM_FAILED,
		this._EVENT_LICENSE_REQUEST_GENERATE_OK,
		this._EVENT_LICENSE_REQUEST_GENERATE_FAILED,
		this._EVENT_CREDENTIAL_ADD_OK,
		this._EVENT_CREDENTIAL_ADD_FAILED,
		this._EVENT_KEY_INFO_GET_EXTENDED_OK,
		this._EVENT_KEY_INFO_GET_EXTENDED_FAILED,
		this._EVENT_IS_KEY_AVAILABLE_OK,
		this._EVENT_IS_KEY_AVAILABLE_FAILED,
		this._EVENT_IS_KEY_AVAILABLE_FAILED,
		this._EVENT_GET_IDS_OK,
		this._EVENT_GET_IDS_FAILED,
		this._EVENT_GET_REPORT_OK,
		this._EVENT_GET_REPORT_FAILED,
		this._EVENT_GET_LICENSE_INFO_OK,
		this._EVENT_GET_LICENSE_INFO_FAILED,
		this._EVENT_GET_NUM_DELETED_SECURE_STOPS_OK,
		this._EVENT_GET_NUM_DELETED_SECURE_STOPS_FAILED,
		this._EVENT_GET_DRM_DATA_OK,
		this._EVENT_GET_DRM_DATA_FAILED,
		this._EVENT_SET_DRM_DATA_OK,
		this._EVENT_SET_DRM_DATA_FAILED
	];

						   
	//drmMethodReturnErrors
	this.DRM_METHOD_ERROR_FAILURE = 1;
	this.DRM_METHOD_ERROR_NOT_SUPPORTED = 2;
	this.DRM_METHOD_ERROR_INFO_NOT_AVAILABLE = 3;
	this.DRM_METHOD_ERROR_BAD_PARAM = 4;
	this.DRM_METHOD_ERROR_ACCESS_DENIED = 5;
	//drmType
	this.DRM_TYPE_NATIVE = 0;
	this.DRM_TYPE_PRM = 1;
	this.DRM_TYPE_CLEARKEY = 2;
	this.DRM_TYPE_PLAYREADY = 3;
	this.DRM_TYPE_WIDEVINE = 4;
	this.DRM_TYPE_CCL = 5;
	this.DRM_TYPE_END = 6;

	this.getDrmInfo = function(type)
	{
		this.logWarning("This API has not been supported yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : type
			},

			drm : {
				chipsetType : 'Fake'
			}
		};
	};

	this.getDrmList = function()
	{
		return [ this.DRM_TYPE_NATIVE, this.DRM_TYPE_PRM,

		this.DRM_TYPE_CLEARKEY, this.DRM_TYPE_PLAYREADY, this.DRM_TYPE_WIDEVINE, this.DRM_TYPE_CCL, this.DRM_TYPE_END ];
	};

	this.sessionCreate = function(drmType)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.sessionStart = function(drmCommandType, cmdParams)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.sessionStop = function(sessionId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.sessionDestroy = function(sessionId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.drmInfoGet = function(sessionId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.keyInfoGet = function(sessionId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.credentialInfoGet = function(sessionId, assetId, credential)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.credentialGet = function(sessionId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.credentialClone = function(sessionId, assetId, credential, newAssetId, specificMetadataSize, specificMetadata)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.drmManagementMessagePost = function(sessionId, drmManagementMessage)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.usageRulesGet = function(sessionId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.legacyAssetMigrate = function(sessionId, assetId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.homeNetworkInfoQuery = function(sessionId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.getSupportedDrm = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.licenseRequestGenerate = function(sessionId, licenseReqData)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.credentialAdd = function(sessionId, assetId, licenseReqData, credential)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.keyInfoGetExtended = function(sessionId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.isKeyAvailable = function(drmType, licenseReqData)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Method not supported",
				message : "Not implemented yet"
			}
		};
	};

	this.getIds = function(sessionId, drmPayloadType)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.getReport = function(sessionId, drmPayloadType, id)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.getLicenseInfo = function(sessionId, drmPayloadType)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.getNumDeletedSecureStops = function(sessionId, drmPayloadType)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.getDrmData = function(sessionId, drmPayloadType, id)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.setDrmData = function(sessionId, drmPayloadType, drmData)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.DRM",
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
