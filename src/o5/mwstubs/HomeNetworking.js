/**
* Stub for Home Networking: CCOM.HomeNetworking, a singleton added since v5.0.0
 * @ignore
*/
CCOM.HomeNetworking = new (function HomeNetworking ()
{
	//"use strict";
    this._MY_NAME_SPACE = "CCOM.HomeNetworking";
	this._id = CCOM.stubs.uuid();
	this._EVENT_ON_DEVICE_FOUND = "onDeviceFound";
	this._EVENT_ON_DEVICE_LOST = "onDeviceLost";
	this._EVENT_ON_SUBSCRIBED_EVENT = "onSubscribedEvent";
	this._EVENT_ON_DISPLAY_PICTURE = "onDisplayPicture";
	this._EVENT_ON_PLAY_REQUESTED = "onPlayRequested";
	this._EVENT_ON_THROW_REQUESTED = "onThrowRequested";
	this._EVENT_BROWSE_CONTAINER_OK = "browseContainerOK";
	this._EVENT_BROWSE_CONTAINER_FAILED = "browseContainerFailed";
	this._EVENT_CANCEL_SUBSCRIBED_SERVICE_OK = "cancelSubscribedServiceOK";
	this._EVENT_CANCEL_SUBSCRIBED_SERVICE_FAILED = "cancelSubscribedServiceFailed";
	this._EVENT_DELETE_OBJECT_OK = "deleteObjectOK";
	this._EVENT_DELETE_OBJECT_FAILED = "deleteObjectFailed";
	this._EVENT_GET_DEVICES_OK = "getDevicesOK";
	this._EVENT_GET_DEVICES_FAILED = "getDevicesFailed";
	this._EVENT_GET_SEARCH_CAPABILITIES_OK = "getSearchCapabilitiesOK";
	this._EVENT_GET_SEARCH_CAPABILITIES_FAILED = "getSearchCapabilitiesFailed";
	this._EVENT_GET_SORT_CAPABILITIES_OK = "getSortCapabilitiesOK";
	this._EVENT_GET_SORT_CAPABILITIES_FAILED = "getSortCapabilitiesFailed";
	this._EVENT_GET_SYSTEM_UPDATE_ID_OK = "getSystemUpdateIdOK";
	this._EVENT_GET_SYSTEM_UPDATE_ID_FAILED = "getSystemUpdateIdFailed";
	this._EVENT_SUBSCRIBE_SERVICE_OK = "subscribeServiceOK";
	this._EVENT_SUBSCRIBE_SERVICE_FAILED = "subscribeServiceFailed";
	this._EVENT_BROWSE_OBJECT_OK = "browseObjectOK";
	this._EVENT_BROWSE_OBJECT_FAILED = "browseObjectFailed";
	this._EVENT_DELETE_BOOKMARK_OK = "deleteBookmarkOK";
	this._EVENT_DELETE_BOOKMARK_FAILED = "deleteBookmarkFailed";
	this._EVENT_SEARCH_CONTAINER_OK = "searchContainerOK";
	this._EVENT_SEARCH_CONTAINER_FAILED = "searchContainerFailed";
	this._EVENT_UPDATE_BOOKMAK_OK = "updateBookmarkOK";
	this._EVENT_UPDATE_BOOKMARK_FAILED = "updateBookmarkFailed";
	this._EVENT_GET_VALUE_BY_STRING_OK = "getValueByStringOK";
	this._EVENT_GET_VALUE_BY_STRING_FAILED = "getValueByStringFailed";
	this._EVENT_SET_VALUE_BY_STRING_OK = "setValueByStringOK";
	this._EVENT_SET_VALUE_BY_STRING_FAILED = "setValueByStringFailed";
	this._EVENT_UPDATE_OBJECT_OK = "updateObjectOK";
	this._EVENT_UPDATE_OBJECT_FAILED = "updateObjectFailed";
	this._EVENT_GET_INSTANCE_OK = "getInstanceOK";
	this._EVENT_GET_INSTANCE_FAILED = "getInstanceFailed";
	this._EVENT_RELEASE_INSTANCE_OK = "releaseInstanceOK";
	this._EVENT_RELEASE_INSTANCE_FAILED = "releaseInstanceFailed";
	  
	this._supportedEvents = [
		this._EVENT_ON_DEVICE_FOUND,
		this._EVENT_ON_DEVICE_LOST,
		this._EVENT_ON_SUBSCRIBED_EVENT,
		this._EVENT_ON_DISPLAY_PICTURE,
		this._EVENT_ON_PLAY_REQUESTED,
		this._EVENT_BROWSE_CONTAINER_OK,
		this._EVENT_BROWSE_CONTAINER_FAILED,
		this._EVENT_CANCEL_SUBSCRIBED_SERVICE_OK,
		this._EVENT_CANCEL_SUBSCRIBED_SERVICE_FAILED,
		this._EVENT_DELETE_OBJECT_OK,
		this._EVENT_DELETE_OBJECT_FAILED,
		this._EVENT_GET_DEVICES_OK,
		this._EVENT_GET_DEVICES_FAILED,
		this._EVENT_GET_SEARCH_CAPABILITIES_OK,
		this._EVENT_GET_SEARCH_CAPABILITIES_FAILED,
		this._EVENT_GET_SORT_CAPABILITIES_OK,
		this._EVENT_GET_SORT_CAPABILITIES_FAILED,
		this._EVENT_GET_SYSTEM_UPDATE_ID_OK,
		this._EVENT_GET_SYSTEM_UPDATE_ID_FAILED,
		this._EVENT_SUBSCRIBE_SERVICE_OK,
		this._EVENT_SUBSCRIBE_SERVICE_FAILED,
		this._EVENT_BROWSE_OBJECT_OK,
		this._EVENT_BROWSE_OBJECT_FAILED,
		this._EVENT_DELETE_BOOKMARK_OK,
		this._EVENT_DELETE_BOOKMARK_FAILED,
		this._EVENT_SEARCH_CONTAINER_OK,
		this._EVENT_SEARCH_CONTAINER_FAILED,
		this._EVENT_UPDATE_BOOKMAK_OK,
		this._EVENT_UPDATE_BOOKMARK_FAILED,
		this._EVENT_GET_VALUE_BY_STRING_OK,
		this._EVENT_GET_VALUE_BY_STRING_FAILED,
		this._EVENT_SET_VALUE_BY_STRING_OK,
		this._EVENT_SET_VALUE_BY_STRING_FAILED,
		this._EVENT_UPDATE_OBJECT_OK,
		this._EVENT_UPDATE_OBJECT_FAILED,
		this._EVENT_GET_INSTANCE_OK,
		this._EVENT_GET_INSTANCE_FAILED,
		this._EVENT_RELEASE_INSTANCE_OK,
		this._EVENT_RELEASE_INSTANCE_FAILED
	];
	
	this._obsoletedEvents = [];
	this._newSupportedEvents = [];
	this.HN_CONTENT_TYPE_CONTAINER = 1;
	this.HN_CONTENT_TYPE_ITEM = 0;

	//HNThrowRequestedType
	this.HN_THROW_REQUESTED_TYPE_PLAY = 0;
	this.HN_THROW_REQUESTED_TYPE_STOP = 1;
	this.HN_THROW_REQUESTED_TYPE_SET_SPEED = 2;
	this.HN_THROW_REQUESTED_TYPE_SET_POSITION = 3;

	//HNSeekWhence
	this.SEEK_INVALID = 0;
	this.SEEK_SET = 1;
	this.SEEK_END = 2;
	this.SEEK_CUR = 3;

	Object.defineProperty(this, 'hnNumDevices', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.homeNetworking) ? CCOM.stubs.stbData.homeNetworking.hnNumDevices : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'dlnaServers', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.homeNetworking) ? CCOM.stubs.stbData.homeNetworking.dlnaServers : null;
		},
		enumerable: true
	});
		  
	Object.defineProperty(this, 'dlnaContentString1', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.homeNetworking) ? CCOM.stubs.stbData.homeNetworking.dlnaContentString1 : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'dlnaContentString2', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.homeNetworking) ? CCOM.stubs.stbData.homeNetworking.dlnaContentString2 : null;
		},
		enumerable: true
	});
		  
	Object.defineProperty(this, 'dlnaContentString3', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.homeNetworking) ? CCOM.stubs.stbData.homeNetworking.dlnaContentString3 : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'dlnaContentString1_Video', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.homeNetworking) ? CCOM.stubs.stbData.homeNetworking.dlnaContentString1_Video : null;
		},
		enumerable: true
	});
		  
	Object.defineProperty(this, 'dlnaContentString2_Video', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.homeNetworking) ? CCOM.stubs.stbData.homeNetworking.dlnaContentString2_Video : null;
		},
		enumerable: true
	});
	
	Object.defineProperty(this, 'dlnaContentString3_Video', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.homeNetworking) ? CCOM.stubs.stbData.homeNetworking.dlnaContentString3_Video : null;
		},
		enumerable: true
	});
		  
	Object.defineProperty(this, 'dlnaContentString1_Image', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.homeNetworking) ? CCOM.stubs.stbData.homeNetworking.dlnaContentString1_Image : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'dlnaContentString2_Image', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.homeNetworking) ? CCOM.stubs.stbData.homeNetworking.dlnaContentString2_Image : null;
		},
		enumerable: true
	});
		  
	Object.defineProperty(this, 'dlnaContentString3_Image', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.homeNetworking) ? CCOM.stubs.stbData.homeNetworking.dlnaContentString3_Image : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'dlnaContentString3_Audio', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.homeNetworking) ? CCOM.stubs.stbData.homeNetworking.dlnaContentString3_Audio : null;
		},
		enumerable: true
	});

	this.browseContainer = function(deviceUdn, containerId, sortCriteria, filter, startIndex, maxResults)
	{
		var data = null, switchString = deviceUdn + ", " + containerId, hdl = CCOM.stubs.getHandle();

		switch (switchString)
		{
		case "uuid: 5AFEF00D-BABE-DADA-FA5A-0011321E7644, 0":
			data = JSON.parse(this.dlnaContentString1);
			break;
		case "uuid: 0011321e-7644-0011-4476-44761e321100, 0":
			data = JSON.parse(this.dlnaContentString2);
			break;
		case "uuid: 5AFEF00D-BABE-DADA-FA5A-0011321E7644, Video":
			data = JSON.parse(this.dlnaContentString1_Video);
			break;
		case "uuid: 0011321e-7644-0011-4476-44761e321100, Video":
			data = JSON.parse(this.dlnaContentString2_Video);
			break;
		case "uuid: 5AFEF00D-BABE-DADA-FA5A-0011321E7644, Image":
			data = JSON.parse(this.dlnaContentString1_Image);
			break;
		case "uuid: 0011321e-7644-0011-4476-44761e321100, Image":
			data = JSON.parse(this.dlnaContentString2_Image);
			break;

		case "uuid: 0000001A-0001-3EC0-67C6-FFFFFFFFFFFF, 0":
			data = JSON.parse(this.dlnaContentString3);
			break;
		case "uuid: 0000001A-0001-3EC0-67C6-FFFFFFFFFFFF, Video":
			data = JSON.parse(this.dlnaContentString3_Video);
			break;
		case "uuid: 0000001A-0001-3EC0-67C6-FFFFFFFFFFFF, Image":
			data = JSON.parse(this.dlnaContentString3_Image);
			break;
		case "uuid: 0000001A-0001-3EC0-67C6-FFFFFFFFFFFF, Audio":
			data = JSON.parse(this.dlnaContentString3_Audio);
			break;
		default:
			// ignore
			break;
		}
		if (data)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_BROWSE_CONTAINER_OK, {
				target : this,
				handle : hdl,
				content : data,
				totalMatches : data.length
			});
		}
		else
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_BROWSE_CONTAINER_FAILED, {
				target : this,
				handle : hdl,
				error : {
					domain : "com.opentv.HomeNetworking",
					name : "HnStatusInvalid",
					message : "error"
				}
			});
		}
		return hdl;
	};

	this.cancelSubscribedService = function(deviceUdn, serviceType)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CANCEL_SUBSCRIBED_SERVICE_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusInvalid",
				message : "error"
			}
		});
		return hdl;
	};

	this.deleteObject = function(deviceUdn, objectId)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DELETE_OBJECT_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusInvalid",
				message : "error"
			}
		});
		return hdl;
	};

	this.getDevices = function()
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_DEVICES_OK, {
			target : this,
			handle : hdl,
			devices : JSON.parse(this.dlnaServers)
		});
		return hdl;
	};

	this.getSearchCapabilities = function(deviceUdn)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_SEARCH_CAPABILITIES_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusInvalid",
				message : "error"
			}
		});
		return hdl;
	};

	this.getSortCapabilities = function(deviceUdn)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_SORT_CAPABILITIES_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusInvalid",
				message : "error"
			}
		});
		return hdl;
	};

	this.getSystemUpdateId = function(deviceUdn)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_SYSTEM_UPDATE_ID_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusInvalid",
				message : "error"
			}
		});
		return hdl;
	};

	this.subscribeService = function(deviceUdn, serviceType)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SUBSCRIBE_SERVICE_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusInvalid",
				message : "error"
			}
		});
		return hdl;
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

	this.getInstance = function(createArgs)
	{
		this.logWarning("This API has not been implemented yet!");
		var ret;

		ret.error = {
			domain : "com.opentv.HomeNetworking",
			name : "HnStatusInvalid",
			message : "error"
		};
		return ret;
	};

	this.releaseInstance = function(objectPath)
	{ //otv:private="true"
		this.logWarning("This API has not been implemented yet!");
		var ret;

		ret.error = {
			domain : "com.opentv.HomeNetworking",
			name : "HnStatusInvalid",
			message : "error"
		};
		return ret;
	};

	this.browseObject = function(deviceUdn, objectId, filter)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_BROWSE_OBJECT_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusError",
				message : "error"
			}
		});
		return hdl;
	};

	this.deleteBookmark = function(deviceUdn, objectId, all)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DELETE_BOOKMARK_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusError",
				message : "error"
			}
		});
		return hdl;
	};

	this.getValueByString = function(deviceUdn, stringId, result)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_VALUE_BY_STRING_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusError",
				message : "error"
			}
		});
		return hdl;
	};

	this.searchContainer = function(deviceUdn, containerId, searchCriteria, sortCriteria, filter, startIndex, maxResults)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SEARCH_CONTAINER_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusError",
				message : "error"
			}
		});
		return hdl;
	};

	this.setValueByString = function(deviceUdn, stringId, stringIdValue, result)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_VALUE_BY_STRING_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusError",
				message : "error"
			}
		});
		return hdl;
	};

	this.updateBookmark = function(deviceUdn, objectId, time, allowDuplicates)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent("updateBookmarkFailed", {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusError",
				message : "error"
			}
		});
		return hdl;
	};

	this.updateObject = function(deviceUdn, currentCds, newCds)
	{
		this.logWarning("This API has not been implemented yet!");
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UPDATE_OBJECT_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.HomeNetworking",
				name : "HnStatusError",
				message : "error"
			}
		});
		return hdl;
	};

})();
