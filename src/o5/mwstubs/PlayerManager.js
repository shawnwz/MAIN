/**
 * Stub for Player: CCOM.PlayerManager
 * @ignore
 */
CCOM.PlayerManager = new (function PlayerManager()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.PlayerManager";
	this._id = CCOM.stubs.uuid();
	
	// events in xml
	// events from methods
	this._EVENT_SET_PLAYER_INSTANCE_PRIORITIES_OK = "setPlayerInstancePrioritiesOK";
	this._EVENT_SET_PLAYER_INSTANCE_PRIORITIES_FAILED = "setPlayerInstancePrioritiesFailed";
	this._EVENT_SET_REVIEW_BUFFER_STATE_OK = "setReviewBufferStateOK";
	this._EVENT_SET_REVIEW_BUFFER_STATE_FAILED = "setReviewBufferStateFailed";

	this._supportedEvents = [
		this._EVENT_SET_PLAYER_INSTANCE_PRIORITIES_OK,
		this._EVENT_SET_PLAYER_INSTANCE_PRIORITIES_FAILED,
		this._EVENT_SET_REVIEW_BUFFER_STATE_OK,
		this._EVENT_SET_REVIEW_BUFFER_STATE_FAILED
	];

	// 5.1.3 changes
	// AudioOutVal
	this.AUD_OUT_VAL_FALSE = 0;
	this.AUD_OUT_VAL_TRUE = 1;
	this.AUD_OUT_VAL_UNDEFINED = -1;
	// InstancePriority
	//otv:deprecated="5.2.3
	this.INSTANCE_PRIORITY_LOW = 1;
	this.INSTANCE_PRIORITY_MEDIUM = 2;
	this.INSTANCE_PRIORITY_HIGH = 3;
	
	this.getInstance = function(createArgs)
	{
		var i, playerObj = {}, videos = document.getElementsByTagName("video");

		for (i = 0; i < videos.length; i++)
		{
			if (videos[i].attributes["otv-video-destination"])
			{
				if (videos[i].attributes["otv-video-destination"].value === createArgs.destUri)
				{
					playerObj.instance = new CCOM.Player(videos[i]);
					break;
				}
			}
		}

		if (!playerObj.instance)
		{
			return {
				error : {
					domain : "com.opentv.PlayerManager",
					name : "PLAYER_MANAGER_METHOD_ERROR_BAD_URI",
					message : ""
				}
			};
		}
		return playerObj;
	};
	
	this.releaseInstance = function(objectPath)
	{
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

	this.setAudioStatus = function(instanceHandle, status)
	{
		return {
			error : {
				domain : "com.opentv.PlayerManager",
				name : "PLAYER_MANAGER_METHOD_ERROR_NOT_SUPPORTED",
				message : "error"
			}
		};
	};
	
	this.setPlayerInstancePriorities = function(priorityInfo)
	{
		this.logDeprecated();
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_PLAYER_INSTANCE_PRIORITIES_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.PlayerManager",
				name : "PLAYER_MANAGER_METHOD_ERROR_NOT_SUPPORTED",
				message : "error"
			}
		});
		return _handle;
	};
	
	this.setReviewBufferState = function(instanceHandle, state)
	{
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_REVIEW_BUFFER_STATE_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.PlayerManager",
				name : "PLAYER_MANAGER_METHOD_ERROR_NOT_SUPPORTED",
				message : "error"
			}
		});
		return _handle;
	};
})();
