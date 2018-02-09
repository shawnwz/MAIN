/**
 * Stub for UserAuth: CCOM.UserAuth, a singleton added since v5.0.0, for user authentications (PIN code, e.g.)
 * @ignore
 */
CCOM.UserAuth = new (function UserAuth ()
{
	//"use strict";
	var pin;

	this._MY_NAME_SPACE = "CCOM.UserAuth";
	this._id = CCOM.stubs.uuid();

	// events in xml
	// events from methods
	this._EVENT_REGISTER_INPUT_EVENTS_OK = "registerInputEventsOK";
	this._EVENT_REGISTER_INPUT_EVENTS_FAILED = "registerInputEventsFailed";
	this._EVENT_CHANGE_MASTER_PIN_OK = "changeMasterPinOK";
	this._EVENT_CHANGE_MASTER_PIN_FAILED = "changeMasterPinFailed";
	this._EVENT_CREATE_MASTER_PIN_OK = "createMasterPinOK";
	this._EVENT_CREATE_MASTER_PIN_FAILED = "createMasterPinFailed";
	this._EVENT_DELETE_MASTER_PIN_OK = "deleteMasterPinOK";
	this._EVENT_DELETE_MASTER_PIN_FAILED = "deleteMasterPinFailed";
	this._EVENT_DISABLE_SYSTEM_OK = "disableSystemOK";
	this._EVENT_DISABLE_SYSTEM_FAILED = "disableSystemFailed";
	this._EVENT_ENABLE_SYSTEM_OK = "enableSystemOK";
	this._EVENT_ENABLE_SYSTEM_FAILED = "enableSystemFailed";
	this._EVENT_GET_CURRENT_USER_PROFILE_OK = "getCurrentUserProfileOK";
	this._EVENT_GET_CURRENT_USER_PROFILE_FAILED = "getCurrentUserProfileFailed";
	this._EVENT_GET_POLICY_MODIFIER_OK = "getPolicyModifierOK";
	this._EVENT_GET_POLICY_MODIFIER_FAILED = "getPolicyModifierFailed";
	this._EVENT_MODIFY_USER_PROFILE_OK = "modifyUserProfileOK";
	this._EVENT_MODIFY_USER_PROFILE_FAILED = "modifyUserProfileFailed";
	this._EVENT_SET_POLICY_MODIFIER_OK = "setPolicyModifierOK";
	this._EVENT_SET_POLICY_MODIFIER_FAILED = "setPolicyModifierFailed";
	this._EVENT_RESET_DEFAULT_PROFILE_OK = "resetDefaultProfileOK";
	this._EVENT_RESET_DEFAULT_PROFILE_FAILED = "resetDefaultProfileFailed";
	this._EVENT_ADD_RESTRICTED_CHANNEL_OK = "addRestrictedChannelOK";
	this._EVENT_ADD_RESTRICTED_CHANNEL_FAILED = "addRestrictedChannelFailed";
	this._EVENT_ADD_TIME_WINDOW_OK = "addTimeWindowOK";
	this._EVENT_ADD_TIME_WINDOW_FAILED = "addTimeWindowFailed";
	this._EVENT_DISABLE_LOCKER_OK = "disableLockerOK";
	this._EVENT_DISABLE_LOCKER_FAILED = "disableLockerFailed";
	this._EVENT_ENABLE_LOCKER_OK = "enableLockerOK";
	this._EVENT_ENABLE_LOCKER_FAILED = "enableLockerFailed";
	this._EVENT_GET_ALL_RESTRICTED_CHANNELS_OK = "getAllRestrictedChannelsOK";
	this._EVENT_GET_ALL_RESTRICTED_CHANNELS_FAILED = "getAllRestrictedChannelsFailed";
	this._EVENT_GET_ALL_TIMEWINDOWS_OK = "getAllTimeWindowsOK";
	this._EVENT_GET_ALL_TIMEWINDOWS_FAILED = "getAllTimeWindowsFailed";
	this._EVENT_REMOVE_ALL_RESTRICTED_CHANNELS_OK = "removeAllRestrictedChannelsOK";
	this._EVENT_REMOVE_ALL_RESTRICTED_CHANNELS_FAILED = "removeAllRestrictedChannelsFailed";
	this._EVENT_REMOVE_ALL_TIME_WINDOWS_OK = "removeAllTimeWindowsOK";
	this._EVENT_REMOVE_ALL_TIME_WINDOWS_FAILED = "removeAllTimeWindowsFailed";
	this._EVENT_REMOVE_RESTRICTED_CHANNEL_OK = "removeRestrictedChannelOK";
	this._EVENT_REMOVE_RESTRICTED_CHANNEL_FAILED = "removeRestrictedChannelFailed";
	this._EVENT_REMOVE_TIME_WINDOW_OK = "removeTimeWindowOK";
	this._EVENT_REMOVE_TIME_WINDOW_FAILED = "removeTimeWindowFailed";
	this._EVENT_RESET_USER_PROFILE_OK = "resetUserProfileOK";
	this._EVENT_RESET_USER_PROFILE_FAILED = "resetUserProfileFailed";
	this._EVENT_SET_ALL_RESTRICTED_CHANNELS_OK = "setAllRestrictedChannelsOK";
	this._EVENT_SET_ALL_RESTRICTED_CHANNELS_FAILED = "setAllRestrictedChannelsFailed";
	this._EVENT_SET_ALL_TIME_WINDOWS_OK = "setAllTimeWindowsOK";
	this._EVENT_SET_ALL_TIME_WINDOWS_FAILED = "setAllTimeWindowsFailed";
	this._EVENT_SET_CURRENT_USER_PROFILE_OK = "setCurrentUserProfileOK"; // otv:deprecated="5.1.3"
	this._EVENT_SET_CURRENT_USER_PROFILE_FAILED = "setCurrentUserProfileFailed"; // otv:deprecated="5.1.3"
	this._EVENT_GET_USER_PROFILE_OK = "getUserProfileOK"; // otv:deprecated="5.1.3"
	this._EVENT_GET_USER_PROFILE_FAILED = "getUserProfileFailed"; // otv:deprecated="5.1.3"
	// newly added events in 5.1.3
	this._EVENT_CHANGE_USER_PIN_OK = "changeUserPinOK";
	this._EVENT_CHANGE_USER_PIN_FAILED = "changeUserPinFailed";
	this._EVENT_CREATE_USER_PROFILE_OK = "createUserProfileOK";
	this._EVENT_CREATE_USER_PROFILE_FAILED = "createUserProfileFailed";
	this._EVENT_DELETE_USER_PROFILE_OK = "deleteUserProfileOK";
	this._EVENT_DELETE_USER_PROFILE_FAILED = "deleteUserProfileFailed";
	this._EVENT_QUERY_USER_PROFILE_OK = "queryUserProfileOK";
	this._EVENT_QUERY_USER_PROFILE_FAILED = "queryUserProfileFailed";
	this._EVENT_ITERATE_USER_PROFILES_OK = "iterateUserProfilesOK";
	this._EVENT_ITERATE_USER_PROFILES_FAILED = "iterateUserProfilesFailed";
	this._EVENT_SELECT_CURRENT_USER_OK = "selectCurrentUserOK";
	this._EVENT_SELECT_CURRENT_USER_FAILED = "selectCurrentUserFailed";
	this._EVENT_RESET_MASTER_PIN_OK = "resetMasterPinOK"; // otv:private="true"
	this._EVENT_RESET_MASTER_PIN_FAILED = "resetMasterPinFailed"; // otv:private="true"
	this._supportedEvents = [
		this._EVENT_REGISTER_INPUT_EVENTS_OK,
		this._EVENT_REGISTER_INPUT_EVENTS_FAILED,
		this._EVENT_CHANGE_MASTER_PIN_OK,
		this._EVENT_CHANGE_MASTER_PIN_FAILED,
		this._EVENT_CREATE_MASTER_PIN_OK,
		this._EVENT_CREATE_MASTER_PIN_FAILED,
		this._EVENT_DELETE_MASTER_PIN_OK,
		this._EVENT_DELETE_MASTER_PIN_FAILED,
		this._EVENT_DISABLE_SYSTEM_OK,
		this._EVENT_DISABLE_SYSTEM_FAILED,
		this._EVENT_ENABLE_SYSTEM_OK,
		this._EVENT_ENABLE_SYSTEM_FAILED,
		this._EVENT_GET_CURRENT_USER_PROFILE_OK,
		this._EVENT_GET_CURRENT_USER_PROFILE_FAILED,
		this._EVENT_GET_POLICY_MODIFIER_OK,
		this._EVENT_GET_POLICY_MODIFIER_FAILED,
		this._EVENT_MODIFY_USER_PROFILE_OK,
		this._EVENT_MODIFY_USER_PROFILE_FAILED,
		this._EVENT_SET_POLICY_MODIFIER_OK,
		this._EVENT_SET_POLICY_MODIFIER_FAILED,
		this._EVENT_RESET_DEFAULT_PROFILE_OK,
		this._EVENT_RESET_DEFAULT_PROFILE_FAILED,
		this._EVENT_ADD_RESTRICTED_CHANNEL_OK,
		this._EVENT_ADD_RESTRICTED_CHANNEL_FAILED,
		this._EVENT_ADD_TIME_WINDOW_OK,
		this._EVENT_ADD_TIME_WINDOW_FAILED,
		this._EVENT_DISABLE_LOCKER_OK,
		this._EVENT_DISABLE_LOCKER_FAILED,
		this._EVENT_ENABLE_LOCKER_OK,
		this._EVENT_ENABLE_LOCKER_FAILED,
		this._EVENT_GET_ALL_RESTRICTED_CHANNELS_OK,
		this._EVENT_GET_ALL_RESTRICTED_CHANNELS_FAILED,
		this._EVENT_GET_ALL_TIMEWINDOWS_OK,
		this._EVENT_GET_ALL_TIMEWINDOWS_FAILED,
		this._EVENT_REMOVE_ALL_RESTRICTED_CHANNELS_OK,
		this._EVENT_REMOVE_ALL_RESTRICTED_CHANNELS_FAILED,
		this._EVENT_REMOVE_ALL_TIME_WINDOWS_OK,
		this._EVENT_REMOVE_ALL_TIME_WINDOWS_FAILED,
		this._EVENT_REMOVE_RESTRICTED_CHANNEL_OK,
		this._EVENT_REMOVE_RESTRICTED_CHANNEL_FAILED,
		this._EVENT_REMOVE_TIME_WINDOW_OK,
		this._EVENT_REMOVE_TIME_WINDOW_FAILED,
		this._EVENT_RESET_USER_PROFILE_OK,
		this._EVENT_RESET_USER_PROFILE_FAILED,
		this._EVENT_SET_ALL_RESTRICTED_CHANNELS_OK,
		this._EVENT_SET_ALL_RESTRICTED_CHANNELS_FAILED,
		this._EVENT_SET_ALL_TIME_WINDOWS_OK,
		this._EVENT_SET_ALL_TIME_WINDOWS_FAILED,
		this._EVENT_SET_CURRENT_USER_PROFILE_OK,  //otv:deprecated="5.1.3"
		this._EVENT_SET_CURRENT_USER_PROFILE_FAILED, //otv:deprecated="5.1.3"
		this._EVENT_GET_USER_PROFILE_OK, //otv:deprecated="5.1.3"
		this._EVENT_GET_USER_PROFILE_FAILED, //otv:deprecated="5.1.3"
		//this. newly added events in 5.1.3
		this._EVENT_CHANGE_USER_PIN_OK,
		this._EVENT_CHANGE_USER_PIN_FAILED,
		this._EVENT_CREATE_USER_PROFILE_OK,
		this._EVENT_CREATE_USER_PROFILE_FAILED,
		this._EVENT_DELETE_USER_PROFILE_OK,
		this._EVENT_DELETE_USER_PROFILE_FAILED,
		this._EVENT_QUERY_USER_PROFILE_OK,
		this._EVENT_QUERY_USER_PROFILE_FAILED,
		this._EVENT_ITERATE_USER_PROFILES_OK,
		this._EVENT_ITERATE_USER_PROFILES_FAILED,
		this._EVENT_SELECT_CURRENT_USER_OK,
		this._EVENT_SELECT_CURRENT_USER_FAILED,
		this._EVENT_RESET_MASTER_PIN_OK,
		this._EVENT_RESET_MASTER_PIN_FAILED
	];
	
	this._users = [];
	this._DEFAULT_RESTRICTED_CHANNELS = [];
	//_RESTRICTED_CHANNELS = [];
	this._restrictedChannels = [];
	this._channelList = [];
	this.policies = [ {
		type : 2,
		data : ""
	}, {
		type : 4,
		data : ""
	} ];
	
	Object.defineProperty(this, '_isUserAuthEnabled', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.userauth) ? CCOM.stubs.stbData.userauth._isUserAuthEnabled : null;
		},
		set: function(val) {
 			CCOM.stubs.stbData.userauth._isUserAuthEnabled= val;
 		},
		enumerable: true
	});

	Object.defineProperty(this, '_USER_TYPES', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.userauth) ? CCOM.stubs.stbData.userauth._USER_TYPES : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, '_currentUser', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.userauth) ? CCOM.stubs.stbData.userauth._currentUser : null ;
		},
		set: function(val) {
 			CCOM.stubs.stbData.userauth._currentUser = val;
 		},
		enumerable: true
	});
	Object.defineProperty(this, '_DEFAULT_USER_AGE', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.userauth) ? CCOM.stubs.stbData.userauth._DEFAULT_USER_AGE : null ;
		},
		set: function(val) {
 			CCOM.stubs.stbData.userauth._DEFAULT_USER_AGE = val;
 		},
		enumerable: true
	});
	


	this._addUser = function (type, pin, property)
	{
		var userObj = {
			type : type,
			pin : pin,
			property : property
		};

		this._users.push(userObj);
	};

	this._getMasterPin = function ()
	{
		var i;

		for (i = 0; i < this._users.length; i += 1)
		{
			if (this._users[i].type === this._USER_TYPES.MASTER)
			{
				return this._users[i].pin;
			}
		}
		return null;
	};

	this._getDefaultUserIndex = function ()
	{
		var i;

		for (i = 0; i < this._users.length; i += 1)
		{
			if (this._users[i].type === this._USER_TYPES.DEFAULT)
			{
				return i;
			}
		}
		return null;
	}
	this._getUserForPin = function (pin)
	{
		var i;

		for (i = 0; i < this._users.length; i += 1)
		{
			if (this._users[i].pin === pin)
			{
				return this._users[i];
			}
		}
		return null;
	};
	this._getUserIndexForPin = function (pin)
	{
		var i;

		for (i = 0; i < this._users.length; i += 1)
		{
			if (this._users[i].pin === pin)
			{
				return i;
			}
		}
		return null;
	};
	this._addRestricted = function (serviceId)
	{
		var i, serviceId;

		for (i = 0; i < this._restrictedChannels.length; i += 1)
		{
			if (this._restrictedChannels === serviceId)
			{
				return this._restrictedChannels[i];
			}
		}
		return this._restrictedChannels.push(serviceId);
	};
	this._removeRestricted = function (serviceId)
	{
		var i, serviceId;

		for (i = 0; i < this._restrictedChannels.length; i += 1)
		{
			if (this._restrictedChannels === serviceId)
			{
				return this._restrictedChannels[i];
			}
		}
		return this._restrictedChannels.pop(serviceId);
	};

	/*
	 * The object exists since the beginning (v5.0.0)
	 */
	//PolicyType
	this.POLICY_NONE = 0;
	this.POLICY_UNTIL_MAX_TIMEOUT = 1;
	this.POLICY_UNTIL_NEXT_CHANNEL = 2;
	this.POLICY_UNTIL_NEXT_EVENT = 4;
	this.POLICY_UNTIL_TIMEOUT = 8;
	//LockType
	this.CHANNEL_LOCKER = 1;
	this.PARENTAL_LOCKER = 2;
	this.TIME_LOCKER = 3;
	this.createUserProfile = function(masterPin, userPin, profileObj)
	{
		var _handle = CCOM.stubs.getHandle();

		if (masterPin === this._getMasterPin())
		{
			this._addUser(this._USER_TYPES.DEFAULT, userPin, profileObj);
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CREATE_USER_PROFILE_OK, {
				target : this,
				handle : _handle
			});
		}
		else
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CREATE_USER_PROFILE_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "Master PIN is incorrect.",
					message : "error"
				}
			});
		}
		return _handle;
	};
	this.deleteUserProfile = function(masterPin, userPin, userName)
	{
		var _handle = CCOM.stubs.getHandle(), userIndex = this._getUserIndexForPin(userPin);

		if ((masterPin === this._getMasterPin()) && (userPin === this._users[userIndex].pin) && (userName === this._users[userIndex].property.userName))
		{
			this._users.splice(userIndex, 1);
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DELETE_USER_PROFILE_OK, {
				target : this,
				handle : _handle
			});
		}
		else
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DELETE_USER_PROFILE_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "Master/user PIN or userName is incorrect.",
					message : "error"
				}
			});

		}
		return _handle;
	};

	this.changeMasterPin = function(masterPin, newPin)
	{
		var index, _handle = CCOM.stubs.getHandle();

		if (masterPin === this._getMasterPin())
		{
			index = this._getUserIndexForPin(masterPin);
			this._users[index].pin = newPin;
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CHANGE_MASTER_PIN_OK, {
				target : this,
				handle : _handle
			});
			return _handle;
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CHANGE_MASTER_PIN_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "InvalidParameter",
				message : "error"
			}
		});
		return _handle;
	};
	this.changeUserPin = function(masterPin, oldPin, newPin, userName)
	{
		var index, _handle = CCOM.stubs.getHandle(), userIndex = this._getUserIndexForPin(oldPin), mpin = this._getMasterPin(), uindex = this._users[userIndex].pin, uname = this._users[userIndex].property.userName;

		if ((masterPin === mpin) && (oldPin === this._users[userIndex].pin) && (userName === this._users[userIndex].property.userName))
		{
			this._users[userIndex].pin = newPin;
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CHANGE_USER_PIN_OK, {
				target : this,
				handle : _handle
			});
			return _handle;
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CHANGE_USER_PIN_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "InvalidParameter",
				message : "error"
			}
		});
		return _handle;
	};
	this.selectCurrentUser = function(pin)
	{
		var _handle = CCOM.stubs.getHandle();

		this._currentUser = pin;
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SELECT_CURRENT_USER_OK, {
			target : this,
			handle : _handle
		});
		return _handle;
	};
	this.queryUserProfile = function(userPin, userName)
	{
		var _handle = CCOM.stubs.getHandle();
		var userIndex = this._getUserIndexForPin(userPin);

		if (this._isUserAuthEnabled === false)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_QUERY_USER_PROFILE_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "SystemNotAuth",
					message : "User authentication is disabled"
				}
			});
			return _handle;
		}

		if (!userName)
		{
			if (userPin === this._getMasterPin())
			{
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_QUERY_USER_PROFILE_FAILED, {
					target : this,
					handle : _handle,
					error : {
						domain : "com.opentv.UserAuth",
						name : "PinOrCurrentUserIsMaster",
						message : "pin is the master PIN, or the current user is the master"
					}
				});
				return _handle;

			}

			if (null != this._getUserIndexForPin(userPin))
			{
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_USER_PROFILE_OK, {
					target : this,
					handle : _handle,
					//userPin: this._users[userIndex].pin,
					property : this._users[userIndex]
				});
				return _handle;
			}

		} else {
			var index = this._getUserIndexForPin(userPin);

			if (index != null) 
			{
				if(userName === this._users[index].property.userName)
				{
					if(userPin === this._getMasterPin())
					{
						CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_QUERY_USER_PROFILE_FAILED, {
							target : this,
							handle : _handle,
							error : {
								domain : "com.opentv.UserAuth",
								name : "PinOrCurrentUserIsMaster",
								message : "pin is the master PIN, or the current user is the master"
							}
						});
						return _handle;

					}else {
						CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_QUERY_USER_PROFILE_OK, {
							target : this,
							handle : _handle,
							//userPin: this._users[userIndex].pin,
							property : this._users[userIndex].property
						});
						return _handle;

					}
				}
				
			}
		}

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_QUERY_USER_PROFILE_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "NotFound",
				message : "pin or userName cannot be found."
			}
		});
		return _handle;
	};
	this.iterateUserProfiles = function(masterPin, index)
	{
		var _handle = CCOM.stubs.getHandle(), userIndex = this._getUserIndexForPin(masterPin);

		if ((masterPin === this._getMasterPin()) && (index <= this._users.length))
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ITERATE_USER_PROFILES_OK, {
				target : this,
				handle : _handle,
				userPin : this._users[userIndex].pin,
				profile : this._users[userIndex].property
			});
			return _handle;
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ITERATE_USER_PROFILES_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "InvalidParameter",
				message : "error"
			}
		});
		return _handle;
	};
	this.createMasterPin = function(masterPin)
	{
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CREATE_MASTER_PIN_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "InvalidParameter",
				message : "error"
			}
		});
		return _handle;
	};

	this.resetMasterPin = function(newMasterPin)
	{
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_RESET_MASTER_PIN_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "InvalidParameter",
				message : "error"
			}
		});
		return _handle;
	};
	this.deleteMasterPin = function(masterPin)
	{
		var _handle = CCOM.stubs.getHandle(), storedMasterPin = this._getMasterPin();

		if (masterPin === storedMasterPin)
		{
			//  this.setCurrentUserProfile(masterPin);
			this._users = [];
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DELETE_MASTER_PIN_OK, {
				target : this,
				handle : _handle
			});
			return _handle;
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DELETE_MASTER_PIN_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "InvalidParameter",
				message : "error"
			}
		});
		return _handle;
	};
	this.disableSystem = function(masterPin)
	{
		var storedMasterPin = this._getMasterPin(), _handle = CCOM.stubs.getHandle();

		if (masterPin === storedMasterPin)
		{
			//   this.setCurrentUserProfile(storedMasterPin);
			this._isUserAuthEnabled = false;
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DISABLE_SYSTEM_OK, {
				target : this,
				handle : _handle
			});
			return _handle;
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DISABLE_SYSTEM_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "InvalidParameter",
				message : "error"
			}
		});
		return _handle;
	};
	this.enableSystem = function()
	{
		var _handle = CCOM.stubs.getHandle();

		this._addUser(this._USER_TYPES.MASTER, "1234", {
			userAge : 100,
			restrictedChannels : []
		});
		this._addUser(this._USER_TYPES.DEFAULT, "1111", {
			// _addUser(this._USER_TYPES.DEFAULT, "1234", {
			userAge : this._DEFAULT_USER_AGE,
			userName : "nisha",
			// userName: "default",
			restrictedChannels : this._DEFAULT_RESTRICTED_CHANNELS
		});
		this._currentUser = "1111";
		//this._currentUser = "1234";
		//   this.setCurrentUserProfile("1111");
		this._isUserAuthEnabled = true;
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ENABLE_SYSTEM_OK, {
			target : this,
			handle : _handle
		});
		return _handle;
	};
	this.getCurrentUserProfile = function()
	{
		var i, _handle = CCOM.stubs.getHandle();

		if (this._isUserAuthEnabled === false)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_CURRENT_USER_PROFILE_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "SystemNotAuth",
					message : "error"
				}
			});
			return _handle;
		}
		for (i = 0; i < this._users.length; i += 1)
		{
			if (this._users[i].pin === this._currentUser)
			{
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_CURRENT_USER_PROFILE_OK, {
					target : this,
					handle : _handle,
					property : this._users[i].property
				});
				return _handle;
			}
		}
		return _handle;
	};
	this.getPolicyModifier = function()
	{
		var _handle = CCOM.stubs.getHandle();

		if (this._isUserAuthEnabled === false)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_POLICY_MODIFIER_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "SystemNotAuth",
					message : "User authentication is disabled"
				}
			});
			return _handle;
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_POLICY_MODIFIER_OK, {
			target : this,
			handle : _handle,
			policies : this.policies

		});
		return _handle;
	};
	//otv:deprecated="5.1.3"
	this.getUserProfile = function(userPin)
	{
    this.logDeprecated();
		var _handle = CCOM.stubs.getHandle();
		var userIndex = this._getUserIndexForPin(userPin);

		if (this._isUserAuthEnabled === false)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_USER_PROFILE_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "SystemNotAuth",
					message : "User authentication is disabled"
				}
			});
			return _handle;
		}

		
		if (userPin === this._getMasterPin())
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_USER_PROFILE_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "PinOrCurrentUserIsMaster",
					message : "pin is the master PIN, or the current user is the master"
				}
			});
			return _handle;

		}

		
		if (null != this._getUserIndexForPin(userPin))
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_USER_PROFILE_OK, {
				target : this,
				handle : _handle,
				//userPin: this._users[userIndex].pin,
				property : this._users[userIndex].property
			});
			return _handle;
		}

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_USER_PROFILE_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "NotFound",
				message : "pin or userName cannot be found."
			}
		});
		return _handle;
	};
	this.modifyUserProfile = function(masterPin, userPin, profileObj)
	{
		var retrievedUserIndex, prop, _handle = CCOM.stubs.getHandle();

		if (masterPin === this._getMasterPin())
		{
			if (!userPin)
			{
				retrievedUserIndex = this._getDefaultUserIndex();
			}
			else
			{
				retrievedUserIndex = this._getUserIndexForPin(userPin);
			}
			for (prop in profileObj)
			{
				if (profileObj.hasOwnProperty(prop))
				{
					this._users[retrievedUserIndex].property[prop] = profileObj[prop];
				}
			}
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_MODIFY_USER_PROFILE_OK, {
				target : this,
				handle : _handle
			});
			return _handle;
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_MODIFY_USER_PROFILE_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "InvalidParameter",
				message : "error"
			}
		});
		return _handle;
	};
	this.setPolicyModifier = function(masterPin, user_policies)
	{
		var _handle = CCOM.stubs.getHandle();
	
		if (this._isUserAuthEnabled === false)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_POLICY_MODIFIER_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "SystemNotAuth",
					message : "User authentication is disabled"
				}
			});
			return _handle;
		}

		if (masterPin === this._getMasterPin())
		{
			for (var i = 0; i < this.policies.length; i++)
			{
		
				this.policies[i] = user_policies[i];
			}
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_POLICY_MODIFIER_OK, {
				target : this,
				handle : _handle
			});
			return _handle;
		}
		if (masterPin != this._getMasterPin())
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_POLICY_MODIFIER_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "IncorrectMasterPin",
					message : "Master PIN is incorrect."
				}
			});
			return _handle;
		}
	};
	//otv:deprecated="5.1.3"
	this.setCurrentUserProfile = function(pin)
	{
		this.logDeprecated();
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_CURRENT_USER_PROFILE_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				message : "Warning:This API is deprecated. "
			}
		});
		return _handle;
	};
	this.resetDefaultProfile = function()
	{
		var _handle = CCOM.stubs.getHandle();

		this._users = [];
		this._currentUser = null;
		this._DEFAULT_USER_AGE = 18;
		this._DEFAULT_RESTRICTED_CHANNELS = [];
		if (this._currentUser === this._getDefaultUserIndex())
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_RESET_DEFAULT_PROFILE_OK, {
				target : this,
				handle : _handle
			});
			return _handle;
		}
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

	this.addRestrictedChannel = function(masterPin, serviceId)
	{
		var _handle = CCOM.stubs.getHandle();
		var _serviceId = this._addRestricted(serviceId);

		if (this._isUserAuthEnabled === false)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ADD_RESTRICTED_CHANNEL_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "SystemNotAuth",
					message : "User authentication is disabled."
				}
			});
			return _handle;
		}
		if (masterPin != this._getMasterPin())
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ADD_RESTRICTED_CHANNEL_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : " IncorrectMasterPin",
					message : "Master PIN is incorrect."
				}
			});
			return _handle;
		}
		if (masterPin === this._getMasterPin())
		{
			if (serviceId === this._restrictedChannels)
			{
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ADD_RESTRICTED_CHANNEL_OK, {
					target : this,
					handle : _handle
				});
				return _handle;
			}
		}

	};
	this.addTimeWindow = function(masterPin, timeWindow)
	{
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ADD_TIME_WINDOW_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "GenericError",
				message : "error"
			}
		});
		return _handle;
	};
	this.disableLocker = function(masterPin, lockType)
	{
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DISABLE_LOCKER_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "GenericError",
				message : "error"
			}
		});
		return _handle;
	};
	this.enableLocker = function(lockType)
	{
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ENABLE_LOCKER_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "GenericError",
				message : "error"
			}
		});
		return _handle;
	};
	this.getAllRestrictedChannels = function()
	{
		var _handle = CCOM.stubs.getHandle();
		var serviceId;
		var channelList = [];

		if (this._isUserAuthEnabled === false)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_ALL_RESTRICTED_CHANNELS_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "SystemNotAuth",
					message : "User authentication is disabled."
				}
			});
			return _handle;
		}
		if (channelList.length > 0)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_ALL_RESTRICTED_CHANNELS_OK, {
				target : this,
				handle : _handle,
				channelList : channelList
			});
			return _handle;
		}
		if (channelList != this._addRestricted(serviceId))
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_ALL_RESTRICTED_CHANNELS_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "NotFound",
					message : "Specifies that restricted channels cannot be found."
				}
			});
			return _handle;
		}

	};
	this.getAllTimeWindows = function()
	{
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_ALL_TIMEWINDOWS_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "GenericError",
				message : "error"
			}
		});
		return _handle;
	};
	this.removeAllRestrictedChannels = function(masterPin)
	{
		var _handle = CCOM.stubs.getHandle();

		if (this._isUserAuthEnabled === false)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REMOVE_ALL_RESTRICTED_CHANNELS_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "SystemNotAuth",
					message : "User authentication is disabled"
				}
			});
			return _handle;
		}

		if (masterPin === this._getMasterPin())
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REMOVE_ALL_RESTRICTED_CHANNELS_OK, {
				target : this,
				handle : _handle
			});
			return _handle;
		}
		if (masterPin != this._getMasterPin())
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REMOVE_ALL_RESTRICTED_CHANNELS_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "IncorrectMasterPin",
					message : "Master PIN is incorrect."
				}
			});
			return _handle;
		}

	};
	this.removeAllTimeWindows = function(masterPin)
	{
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REMOVE_ALL_TIME_WINDOWS_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "GenericError",
				message : "error"
			}
		});
		return _handle;
	};
	this.removeRestrictedChannel = function(masterPin, serviceId)
	{
		var _handle = CCOM.stubs.getHandle();

		if (this._isUserAuthEnabled === false)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REMOVE_RESTRICTED_CHANNEL_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "SystemNotAuth",
					message : "User authentication is disabled"
				}
			});
			return _handle;
		}
		if (masterPin != this._getMasterPin())
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REMOVE_RESTRICTED_CHANNEL_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : " IncorrectMasterPin",
					message : "Master PIN is incorrect."
				}
			});
			return _handle;
		}
		if (masterPin === getMasterPin())
		{
			if (serviceId === this._removeRestricted(serviceId))
			{
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REMOVE_RESTRICTED_CHANNEL_OK, {
					target : this,
					handle : _handle

				});
				return _handle;
			}

		}
		if (serviceId != this._removeRestricted(serviceId))
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REMOVE_RESTRICTED_CHANNEL_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "  NotFound",
					message : "Specifies that the restricted channel is not found."
				}
			});
			return _handle;
		}
	};
	this.removeTimeWindow = function(masterPin, twName)
	{
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REMOVE_TIME_WINDOW_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "GenericError",
				message : "error"
			}
		});
		return _handle;
	};
	this.resetUserProfile = function()
	{
		var _handle = CCOM.stubs.getHandle();

		if (this._isUserAuthEnabled === false)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_RESET_USER_PROFILE_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "SystemNotAuth",
					message : "User authentication is disabled"
				}
			});
			return _handle;
		}
		if (this._currentUser === this._getDefaultUserIndex())
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_RESET_USER_PROFILE_OK, {
				target : this,
				handle : _handle
			});
			return _handle;
		}
	};
	this.setAllRestrictedChannels = function(masterPin, channelList)
	{
		var _handle = CCOM.stubs.getHandle();
		var serviceId;
		//var this._channelList = [];
		//var this._channelList = this._restrictedChannels;

		if (this._isUserAuthEnabled === false)
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_ALL_RESTRICTED_CHANNELS_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : "SystemNotAuth",
					message : "User authentication is disabled"
				}
			});
			return _handle;
		}
		if (masterPin != this._getMasterPin())
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_ALL_RESTRICTED_CHANNELS_FAILED, {
				target : this,
				handle : _handle,
				error : {
					domain : "com.opentv.UserAuth",
					name : " IncorrectMasterPin",
					message : "Master PIN is incorrect."
				}
			});
			return _handle;
		}

		if (masterPin === this._getMasterPin())
		{
			if (channelList.length > 0)
			{
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_ALL_RESTRICTED_CHANNELS_OK, {
					target : this,
					handle : _handle
				});
				return _handle;
			}
		}

	};
	this.setAllTimeWindows = function(masterPin, timeWindowList)
	{
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_ALL_TIME_WINDOWS_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.UserAuth",
				name : "GenericError",
				message : "error"
			}
		});
		return _handle;
	};

})();
