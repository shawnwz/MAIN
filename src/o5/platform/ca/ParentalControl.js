/**
 * CCOM 2.0
 * ParentalControl deals with functions that determine whether a given program or channel can be
 * viewed, given the current maturity rating and parental controls set on the STB. Covers blocking /
 * time-locking channels
 *
 * @class o5.platform.ca.ParentalControl
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.ca.ParentalControl = new (function ParentalControl () {
    this._restrictedChannels = {};
    this._timeWindowNameChannels = {};
    this._TIMEW_INDOW_NAME_KEY_TIME_LOCK_CHANNEL = "o5TLC_"; // time window name prefix for time lock channel
    this._parentalAgeChannels = {};
    this._timeLockedChannels = {};
    this._timeWindows = {};
    this._MAXIMUM_AGE_RATING = 100;
    this._userRating = this._MAXIMUM_AGE_RATING;
    this._isCurrentUserMaster = false;
    this._authenticationEnabled = false;
    this._userRatinglevel = 0;
    this._AUTHENTICATION_TIMEOUT_PATH = "/users/preferences/userauth/defaultDurationSec";
    this._CURRENT_USER_PATH = "/users/current/updated";
    this._ccomUserAuth = null;
    this._queryUserProfileCallback = function (e) {};
    this._blankAndUnblankVideoCallback = function (e) {};
    this._modifyUserCallback = function (e) {};
    this._userChangedCallback = function () {};
    this._setAllRestrictedChannelsCallback = function (e) {};
    this._getAllRestrictedChannelsCallback = function (e) {};
    this._removeRestrictedChannelCallback = function (e) {};
    this._removeAllRestrictedChannelsCallback = function (e) {};
    this._resetDefaultProfileCallback = function (e) {};
    this._resetUserProfileCallback = function (e) {};
    this._addRestrictedChannelCallback = function (e) {};
    this._addTimeWindowCallback = function (e) {};
    this._removeTimeWindowCallback = function (e) {};
    this._getAllTimeWindowsCallback = function (e) {};
    this._setAllTimeWindowsCallback = function (e) {};
    this._removeAllTimeWindowsCallback = function (e) {};
    this._ratingLookUp = {
        '0': {
            ratingCode: "U",
            description: "Universal"
        },
        '12': {
            ratingCode: "12",
            description: "12"
        },
        '15': {
            ratingCode: "15",
            description: "15"
        },
        '18': {
            ratingCode: "18",
            description: "18"
        },
        '21': {
            ratingCode: "X",
            description: "X"
        }
    };
})();

/**
 * Returns a object that has hour: HH minute: MM for the given time
 * where the given time is amount of seconds since midnight
 * @method _getTimeObjectForTimeWindowName
 * @private
 * @param {Number} seconds StartTime seconds from midnight
 * @return {Object} Hour and minute string. if invalid time, return null
 */
o5.platform.ca.ParentalControl._getTimeObjectForTimeWindowName = function _getTimeObjectForTimeWindowName (seconds) {
    var hours,
        minutes;
    hours = Math.floor(seconds / 3600);
    if (0 <= hours && hours <= 24) {
        minutes = Math.round((seconds - (hours * 3600)) / 60);
        if (0 <= hours && hours < 60) {
            return { hour: (hours < 10 ? "0" : "") + String(hours),
                     minute: (minutes < 10 ? "0" : "") + String(minutes) };
        }
    }
    return null;
};

/**
 * Returns a object that has hour: HH minute: MM for the given time window name
 * where the given time is amount of seconds since midnight
 * @method _getStartEndTimeObjFromTimeWindowName
 * @private
 * @param {String} timeWindowName The time windows name
 * @return {Object} Object of hour and minute string. if invalid time, return null
 */
o5.platform.ca.ParentalControl._getStartEndTimeObjFromTimeWindowName = function _getStartEndTimeObjFromTimeWindowName (timeWindowName) {
    // twName Format: o5TLC_HHMMhhmmxx (o5: created by o5, _: delimiter, TLC: TimeListChannel HHMM: start time, hhmm: end time,
    if (timeWindowName.lastIndexOf(this._TIMEW_INDOW_NAME_KEY_TIME_LOCK_CHANNEL, 0) !== 0) {
        return null;
    }
    return {
        startTime: parseInt(timeWindowName.substr(6, 2), 10) * 3600 + parseInt(timeWindowName.substr(8, 2), 10) * 60,
        endTime: parseInt(timeWindowName.substr(10, 2), 10) * 3600 + parseInt(timeWindowName.substr(12, 2), 10) * 60
    };
};

/**
 * Returns a time in the format HH:MM for the given time
 * where the given time is amount of seconds since midnight
 * @method _getTimeStringForSeconds
 * @private
 * @removed
 */

/**
 * Returns the amount of seconds since midnight for the given timeStr
 * which is of format HH:MM e.g. "18:00"
 * @method _getSecondsForTimeString
 * @private
 * @param {String} timeStr Time string with format HH:MM
 * @return {Number} Amount of seconds since midnight
 */
o5.platform.ca.ParentalControl._getSecondsForTimeString = function _getSecondsForTimeString (timeStr) {
    var timeArray,
        hoursAsSeconds,
        minutesAsSeconds;
    if (timeStr) {
        timeArray = timeStr.split(":");
        hoursAsSeconds = parseInt(timeArray[0], 10) * 3600;
        minutesAsSeconds = parseInt(timeArray[1], 10) * 60;
        return hoursAsSeconds + minutesAsSeconds;
    } else {
        return 0;
    }
};

/**
 * Converts the given time stamp (milliseconds) to a time
 * and returns amount of seconds since midnight for that time
 * @method _getTimestampToSecondsSinceMidnight
 * @private
 * @param {Number} dateTime Milliseconds
 * @return {Number} seconds Since midnight for time
 */
o5.platform.ca.ParentalControl._getTimestampToSecondsSinceMidnight = function _getTimestampToSecondsSinceMidnight (dateTime) {
    var date = new Date(dateTime);
    return this._getSecondsForTimeString(String(date.getHours()) + ":" + String(date.getMinutes()));
};

/**
 * Returns the start and end time as an object with startTime and endTime properties
 * for the given startEndTimeStr which is of format HH:MM-HH:MM e.g "18:00-21:00"
 * @method _getStartEndTimeObj
 * @private
 * @removed
 */

/**
 * Parse the event object of getAllTimeWindowsCallback for making the time windows array
 * @method _parseAllTimeWindows
 * @private
 * @param {Object} event Event object of getAllTimeWindowsCallback
 * @return {Object} timeWindowList Object made from the time windows array, if failed events, return null.
 */
o5.platform.ca.ParentalControl._parseAllTimeWindows = function _parseAllTimeWindows (event) {
    var timeWindows = {};
    if (!event.error) {
        for (var i = 0; i < event.timeWindowList.length; i++) {
            timeWindows[event.timeWindowList[i].twName] = event.timeWindowList[i];
        }
        return timeWindows;
    } else if (event.error.name === "NotFound") {
        return {};  // No time window
    }
    return null;
};

/**
 * Sets time windows array
 * @method _cachedParsedTimeWindows
 * @private
 * @param {Object} parsedData Parsed restricted channels data
 */
o5.platform.ca.ParentalControl._cachedParsedTimeWindows = function _cachedParsedTimeWindows (parsedData) {
    this.logEntry();
    /* for Debug */
    /*
     for (var twName in this._timeWindows) {
        if (this._timeWindows.hasOwnProperty(twName)) {
            this.logDebug("FROM twName=" + twName);
        }
    }
    */
    this.logDebug("FROM length=" + Object.keys(this._timeWindows).length + " TO length=" + Object.keys(parsedData).length);
    this._timeWindows = parsedData;
    /* for Debug */
    /*
    for (var twName2 in this._timeWindows) {
        if (this._timeWindows.hasOwnProperty(twName2)) {
            this.logDebug("TO   twName=" + twName2);
        }
    }
    */
    this.logExit();
};

/**
 * Parse the event object of getAllRestrictedChannelsCallback for making the restricted channels array
 * @method _createTimeLockedChannel
 * @private
 * @param {Array} timeWindowNameArray Array of name list of the time windows
 * @return {Array} parsedData Parsed restricted channels data, if failed events, return null.
 */
o5.platform.ca.ParentalControl._createTimeLockedChannel = function _createTimeLockedChannel (timeWindowNameArray) {
    var timeObj,
        timeLockedChannel = [];
    if (timeWindowNameArray) {
        for (var j = 0; j < timeWindowNameArray.length; j++) {
            timeObj = this._getStartEndTimeObjFromTimeWindowName(timeWindowNameArray[j]);
            if (timeObj !== null) {
                timeLockedChannel.push(timeObj);
            }
        }
    }
    return timeLockedChannel;
};

/**
 * Parse the event object of getAllRestrictedChannelsCallback for making the restricted channels array
 * @method _parseAllRestrictedChannels
 * @private
 * @param {Object} event Event object of getAllRestrictedChannelsCallback
 * @return {Object} parsedData Parsed restricted channels data, if failed events, return null.
 */
o5.platform.ca.ParentalControl._parseAllRestrictedChannels = function _parseAllRestrictedChannels (event) {
    var i,
        startIndex,
        ageStartIndex,
        endIndex,
        serviceId,
        timeWindowNameArray,
        parentalAge,
        restrictedChannelsToParse,
        parsedData = { restrictedChannels: {}, timeWindowNameChannels: {}, parentalAgeChannels: {}, timeLockedChannels: {} };

    if (!event.error) {
        restrictedChannelsToParse = event.channelList || [];
    } else if (event.error.name === "NotFound") {
        return parsedData;  // No restricted Channel
    } else {
        return null;  // Failed events
    }

    for (i = 0; i < restrictedChannelsToParse.length; i++) {
        startIndex = restrictedChannelsToParse[i].indexOf("[");
        if (startIndex !== -1) {
            this.logDebug("restrictedChannelsToParse[" + i + "]=" + restrictedChannelsToParse[i]);
            serviceId = restrictedChannelsToParse[i].substring(0, startIndex);
            endIndex = restrictedChannelsToParse[i].indexOf("]", ++startIndex);
            startIndex = restrictedChannelsToParse[i].indexOf("/tw:", startIndex);
            ageStartIndex = restrictedChannelsToParse[i].indexOf("/age:", startIndex);
            if (startIndex !== -1) {
                if (ageStartIndex !== -1) {
                    timeWindowNameArray = restrictedChannelsToParse[i].substring(startIndex + 4, ageStartIndex).split(",");
                } else {
                    timeWindowNameArray = restrictedChannelsToParse[i].substring(startIndex + 4, endIndex).split(",");
                }
            } else {
                timeWindowNameArray = [];
            }
            if (ageStartIndex !== -1) {
                parentalAge = restrictedChannelsToParse[i].substring(ageStartIndex + 5, endIndex);
            } else {
                parentalAge = null;
            }
            parsedData.restrictedChannels[serviceId] = serviceId;
            parsedData.timeWindowNameChannels[serviceId] = timeWindowNameArray;
            parsedData.timeLockedChannels[serviceId] = this._createTimeLockedChannel(timeWindowNameArray);
            parsedData.parentalAgeChannels[serviceId] = parentalAge;
        } else {
            parsedData.restrictedChannels[restrictedChannelsToParse[i]] = restrictedChannelsToParse[i];
        }
    }
    return parsedData;
};

/**
 * Create a string for restricted channel operations
 * @method _createRestrictedChannelString
 * @private
 * @param {String} serviceId Service id of the channel
 * @param {Array} timeWindowNameArray Array of name list of the time windows
 * @param {String} parentalAge User rating value for restricted channel
 * @return {String} String of restrictedChannelString for restricted channel operations
 */
o5.platform.ca.ParentalControl._createRestrictedChannelString = function _createRestrictedChannelString (serviceId, timeWindowNameArray, parentalAge) {
    var str,
    timeWindowStr = null;
    if (timeWindowNameArray && timeWindowNameArray.length > 0) {
        timeWindowStr = "/tw:" + timeWindowNameArray.join(",");
    }
    if (timeWindowStr !== null || parentalAge) {
        str = serviceId + "[" + (timeWindowStr ? timeWindowStr : "") + (parentalAge ? "/age:" + parentalAge : "") + "]";
    }
    else {
        str = serviceId;
    }
    //this.logDebug("str=" + str);
    return str;
};

/**
 * Get a string for restricted channel operations from the parsedData parsed restricted channels data
 * @method _getParsedRestrictedChannelString
 * @private
 * @param {Object} parsedData parsed restricted channels data
 * @param {String} serviceId Service id of the channel
 * @return {String} String of restrictedChannelString for restricted channel operations
 */
o5.platform.ca.ParentalControl._getParsedRestrictedChannelString = function _getParsedRestrictedChannelString (parsedData, serviceId) {
    return this._createRestrictedChannelString(serviceId, parsedData.timeWindowNameChannels[serviceId], parsedData.parentalAgeChannels[serviceId]);
};

/**
 * Get a string for restricted channel operations from serviceId
 * @method _getRestrictedChannelString
 * @private
 * @param {String} serviceId Service id of the channel
 * @return {String} String of restrictedChannelString for restricted channel operations
 */
o5.platform.ca.ParentalControl._getRestrictedChannelString = function _getRestrictedChannelString (serviceId) {
    return this._createRestrictedChannelString(serviceId, this._timeWindowNameChannels[serviceId], this._parentalAgeChannels[serviceId]);
};

/**
 * Set the restricted channel setting to the parsed restricted channels data
 * @method _setParsedRestrictedChannels
 * @private
 * @param {Object} parsedData Parsed restricted channels data
 * @param {String} serviceId Service Id of the channel
 * @param {Array} timeWindowNameArray Array of name list of the time windows
 * @param {String} parentalAge User rating value for restricted channel
 */
o5.platform.ca.ParentalControl._setParsedRestrictedChannels = function _setParsedRestrictedChannels (parsedData, serviceId, timeWindowNameArray, parentalAge) {
    parsedData.restrictedChannels[serviceId] = serviceId;
    parsedData.parentalAgeChannels[serviceId] = parentalAge;
    parsedData.timeWindowNameChannels[serviceId] = timeWindowNameArray ? timeWindowNameArray : [];
    parsedData.timeLockedChannels[serviceId] = this._createTimeLockedChannel(parsedData.timeWindowNameChannels[serviceId]);
};

/**
 * Delete the restricted channel values for serviceId from the parsedData parsed restricted channels data
 * @method _deleteParsedRestrictedChannels
 * @private
 * @param {Object} parsedData Parsed restricted channels data
 * @param {String} serviceId Service id of the channel
 */
o5.platform.ca.ParentalControl._deleteParsedRestrictedChannels = function _deleteParsedRestrictedChannels (parsedData, serviceId) {
    delete parsedData.restrictedChannels[serviceId];
    delete parsedData.timeWindowNameChannels[serviceId];
    delete parsedData.parentalAgeChannels[serviceId];
    delete parsedData.timeLockedChannels[serviceId];
};

/**
 * Set the time window name to the restricted channel setting to the parsed restricted channels data
 * @method _addTimeWindowNameToParsedRestrictedChannels
 * @private
 * @param {Object} parsedData Parsed restricted channels data
 * @param {String} serviceId Service id of the channel
 * @param {String} timeWindowName The time windows name
 * @return {Boolean} True if set, false if not set
 */
o5.platform.ca.ParentalControl._addTimeWindowNameToParsedRestrictedChannels = function _addTimeWindowNameToParsedRestrictedChannels (parsedData, serviceId, timeWindowName) {
    var timeObj;
    if (parsedData.restrictedChannels[serviceId]) {
        if (!parsedData.timeWindowNameChannels[serviceId]) {
            parsedData.timeWindowNameChannels[serviceId] = [];
        } else {
             for (var i = 0; i < parsedData.timeWindowNameChannels[serviceId].length; i++) {
                 if (parsedData.timeWindowNameChannels[serviceId][i] === timeWindowName) {
                     this.logDebug("already exist timeWindowName=" + timeWindowName);
                     return false;
                 }
             }
        }
        parsedData.timeWindowNameChannels[serviceId].push(timeWindowName);
        if (!parsedData.timeLockedChannels[serviceId]) {
            parsedData.timeLockedChannels[serviceId] = [];
        }
        timeObj = this._getStartEndTimeObjFromTimeWindowName(timeWindowName);
        if (timeObj !== null) {
            parsedData.timeLockedChannels[serviceId].push(timeObj);
        }
        return true;
    }
    this.logDebug("No parsedData.restrictedChannels[" + serviceId + "] data for timeWindowName=" + timeWindowName);
    return false;
};

/**
 * Remove the time window name from the restricted channel setting to the parsed restricted channels data
 * @method _removeTimeWindowNameToParsedRestrictedChannels
 * @private
 * @param {Object} parsedData Parsed restricted channels data
 * @param {String} serviceId Service id of the channel
 * @param {String} timeWindowName The time windows name
 * @return {Boolean} True if removed, false if not
 */
/*
o5.platform.ca.ParentalControl._removeTimeWindowNameToParsedRestrictedChannels = function _removeTimeWindowNameToParsedRestrictedChannels(parsedData, serviceId, timeWindowName) {
    if (parsedData.restrictedChannels[serviceId]) {
        if (parsedData.timeWindowNameChannels[serviceId]) {
             for (var i = 0; i < parsedData.timeWindowNameChannels[serviceId].length; i++) {
                 if (parsedData.timeWindowNameChannels[serviceId][i] === timeWindowName) {
                     parsedData.timeWindowNameChannels[serviceId].splice(i, 1);
                     parsedData.timeLockedChannels[serviceId] = this._createTimeLockedChannel(parsedData.timeWindowNameChannels[serviceId]);
                     return true;
                 }
             }
        }
    }
    return false;
};
*/

/**
 * Sets service ids as restricted channels to the array for the all user
 * @method _cachedParsedRestrictedChannels
 * @private
 * @param {Object} parsedData Parsed restricted channels data
  */
o5.platform.ca.ParentalControl._cachedParsedRestrictedChannels = function _cachedParsedRestrictedChannels (parsedData) {
    var serviceId,
        timeLockedChannel,
        i, j, overlapping,
        endTime;
    this.logEntry();
    /* for Debug */
    /*
    for (var serviceId in this._restrictedChannels) {
        if (this._restrictedChannels.hasOwnProperty(serviceId)) {
            this.logDebug("FROM:" + this._getRestrictedChannelString(serviceId));
        }
    }
    */
    this.logDebug("FROM length=" + Object.keys(this._restrictedChannels).length + " TO length=" + Object.keys(parsedData.restrictedChannels).length);
    this._restrictedChannels = parsedData.restrictedChannels;
    this._timeWindowNameChannels = parsedData.timeWindowNameChannels;
    this._parentalAgeChannels = parsedData.parentalAgeChannels;

    for (serviceId in parsedData.timeLockedChannels) {
        if (parsedData.timeLockedChannels.hasOwnProperty(serviceId)) {
             timeLockedChannel = parsedData.timeLockedChannels[serviceId];
            if (timeLockedChannel.length > 1) {
                /* for Debug */
                /*
                for (i=0;i<timeLockedChannel.length;i++){
                    this.logDebug("FROM: timeLockedChannels["+serviceId+"]["+i+"] start:" + timeLockedChannel[i].startTime +
                                  " end:" +  + timeLockedChannel[i].endTime);
                }
                */
                // sort from the earliest start time, if start time is same, sort from the earliest end time
                timeLockedChannel.sort(function (a, b) {
                    if (a.startTime < b.startTime) return -1;
                    if (a.startTime > b.startTime) return 1;
                    if (a.endTime < b.endTime) return -1;
                    if (a.endTime > b.endTime) return 1;
                    return 0;
                });
            }
            for (i = 0; i < timeLockedChannel.length; i++) {
                endTime = timeLockedChannel[i].endTime;
                overlapping = 0;
                for (j = i + 1; j < timeLockedChannel.length; j++) {
                    if (timeLockedChannel[j].startTime <= endTime) {
                        overlapping++;
                        if (endTime < timeLockedChannel[j].endTime) {
                            endTime = timeLockedChannel[j].endTime;
                        }
                    } else {
                        break;
                    }
                }
                // merge overlapping entries into one.
                if (overlapping > 0) {
                    this.logDebug("overlapping=" + overlapping + " timeLockedChannels[" + serviceId + "][" + i + "] endTime=" + timeLockedChannel[i].endTime + " -> " + endTime);
                    timeLockedChannel[i].endTime = endTime;
                    this.logDebug("removed timeLockedChannels[" + serviceId + "][" + (i + 1) + "] - [" + (i + overlapping) + "]");
                    timeLockedChannel.splice(i + 1, overlapping);
                }
            }
            /* for Debug */
            /*
            for (i=0;i<timeLockedChannel.length;i++){
                this.logDebug("  TO: timeLockedChannels["+serviceId+"]["+i+"] start:" + timeLockedChannel[i].startTime +
                              " end:" + timeLockedChannel[i].endTime);
            }
            */
        }
    }
    this._timeLockedChannels = parsedData.timeLockedChannels;

    /* for Debug */
    /*
    for (var serviceId in this._restrictedChannels) {
        if (this._restrictedChannels.hasOwnProperty(serviceId)) {
            this.logDebug("TO  :" + this._getRestrictedChannelString(serviceId));
        }
    }
    */
    this.logExit();
};

/**
 * Updates the cached restricted channels, time locked channels and user age rating
 * for the current user
 * @method _cacheUserProperties
 * @private
 * @async
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._cacheUserProperties = function _cacheUserProperties (event) {
    this.logEntry();
    var parsedData;
    if (!event.error && event.property) {
        this.logDebug("FROM: this._userRating=" + this._userRating);
        this._userRating = event.property.userAge || this._MAXIMUM_AGE_RATING;
        this.logDebug("TO: this._userRating=" + this._userRating);
        this._getAllTimeWindowsCallback = function (e) {
            parsedData = this._parseAllTimeWindows(e);
            if (parsedData !== null) {
                this._cachedParsedTimeWindows(parsedData);
            }
        }.bind(this);
        this.logDebug("[CCOM] _ccomUserAuth.getAllTimeWindows");
        this._ccomUserAuth.getAllTimeWindows();
        this._getAllRestrictedChannelsCallback = function (e) {
            parsedData = this._parseAllRestrictedChannels(e);
            if (parsedData !== null) {
                this._cachedParsedRestrictedChannels(parsedData);
            }
        }.bind(this);
        this.logDebug("[CCOM] _ccomUserAuth.getAllRestrictedChannels");
        this._ccomUserAuth.getAllRestrictedChannels();
    }
    this.logExit();
};

/**
 * Set the time window. if the time window already exist, it calls callback with true.
 * @method _setTimeWindow
 * @private
 * @async
 * @param {String} masterPin The master pin number string
 * @param {Object} timeWindow The time window object
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl._setTimeWindow = function _setTimeWindow (masterPin, timeWindow, callback) {
    this.logEntry();
    var parsedData;
    this._getAllTimeWindowsCallback = function (e) {
        parsedData = this._parseAllTimeWindows(e);
        if (parsedData !== null) {
            if (!parsedData[timeWindow.twName]) {
                parsedData[timeWindow.twName] = timeWindow;
                this._addTimeWindow(masterPin, timeWindow, function (isModified) {
                    this.logDebug("_addTimeWindow callback isModified=" + isModified);
                    if (isModified === true) {
                        this._cachedParsedTimeWindows(parsedData);
                    }
                    callback(isModified);
                }.bind(this));
            } else {
                callback(true);  // already exits
                return;
            }
        } else {
            callback(false);  // error
            return;
        }
    }.bind(this);
    this.logDebug("[CCOM] _ccomUserAuth.getAllTimeWindows");
    this._ccomUserAuth.getAllTimeWindows();
    this.logExit();
};

/**
 * Removes unused time windows.
 * @method _cleanupTimeWindows
 * @private
 * @async
 * @param {String} masterPin The master pin number string
 * @param {Function} [callback] Optional callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl._cleanupTimeWindows = function _cleanupTimeWindows (masterPin, callback) {
    this.logEntry();
    var i,
        needToRemove = false,
        parsedData,
        timeWindowName,
        timeWindowNameChannel,
        timeWindowArray = [],
        activeTimeWindowNames = {};

    if (!callback) {
        callback = function (isModified) {};
    }

    // check active time window for time lock channel
    for (var serviceId in this._timeWindowNameChannels) {
        if (this._timeWindowNameChannels.hasOwnProperty(serviceId)) {
            timeWindowNameChannel = this._timeWindowNameChannels[serviceId];
            for (i = 0; i < timeWindowNameChannel.length; i++) {
                activeTimeWindowNames[timeWindowNameChannel[i]] = activeTimeWindowNames[timeWindowNameChannel[i]] ? ++activeTimeWindowNames[timeWindowNameChannel[i]] : 1;
            }
        }
    }
    this._getAllTimeWindowsCallback = function (e) {
        parsedData = this._parseAllTimeWindows(e);
        if (parsedData !== null) {
            for (timeWindowName in parsedData) {
                if (parsedData.hasOwnProperty(timeWindowName)) {
                    if (timeWindowName.lastIndexOf(this._TIMEW_INDOW_NAME_KEY_TIME_LOCK_CHANNEL, 0) !== 0 || activeTimeWindowNames[timeWindowName]) {
                        timeWindowArray.push(parsedData[timeWindowName]); // need to keep
                    } else {
                        needToRemove = true;
                        delete parsedData[timeWindowName];
                    }
                }
            }
            if (needToRemove === true) {
                if (timeWindowArray.length === 0) {
                    this._removeAllTimeWindows(o5.platform.ca.PINHandler.getLocalMasterPin(), function (isModified) {
                        this._cachedParsedTimeWindows(parsedData);
                        this.logDebug("_removeAllTimeWindows callback result=" + isModified);
                        callback(isModified);
                    }.bind(this));
                } else if (timeWindowArray.length > 0) {
                    this._setAllTimeWindows(o5.platform.ca.PINHandler.getLocalMasterPin(), timeWindowArray, function (isModified) {
                        this._cachedParsedTimeWindows(parsedData);
                        this.logDebug("_setAllTimeWindows result=" + isModified);
                        callback(isModified);
                    }.bind(this));
                } else {
                    this.logDebug("setAllTimeWindows error");
                    callback(false); // error
                    return;
                }
            } else {
                this.logDebug("setAllTimeWindows no need to remove");
                callback(false); // no need to remove
                return;
            }
        } else {
            this.logDebug("setAllTimeWindows error");
            callback(false);  // error
            return;
        }
    }.bind(this);
    this.logDebug("[CCOM] _ccomUserAuth.getAllTimeWindows");
    this._ccomUserAuth.getAllTimeWindows();
    this.logExit();
};

/**
 * Modifies the user (for the given userPin) profile with the given profileProperty and calls callback
 * @method _modifyUser
 * @private
 * @async
 * @param {String} masterPin The master pin number string
 * @param {String} userPin User profile associated with user pin will be acquired.
 * @param {Object} profileProperty Specifies the name and value pairs of properties that the user wants to change.
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl._modifyUser = function _modifyUser (masterPin, userPin, profileProperty, callback) {
    this._modifyUserCallback = function (e) {
        if (!e.error) {
            callback(true);
            return;
        } else {
            callback(false);
            return;
        }
    };
    this.logDebug("[CCOM] _ccomUserAuth.modifyUserProfile");
    this._ccomUserAuth.modifyUserProfile(masterPin, userPin, profileProperty);
};

/**
 * Set the restricted channels(for the given masterPin) with the given channelList and callback
 * @method _setAllRestrictedChannels
 * @private
 * @async
 * @param {String} masterPin The master pin number string
 * @param {Array} channelList The string list of restricted channels.
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl._setAllRestrictedChannels = function _setAllRestrictedChannels (masterPin, channelList, callback) {
    this._setAllRestrictedChannelsCallback = function (e) {
        if (!e.error) {
            callback(true);
            return;
        } else {
            callback(false);
            return;
        }
    };
    this.logDebug("[CCOM] _ccomUserAuth.setAllRestrictedChannels");
    this._ccomUserAuth.setAllRestrictedChannels(masterPin, channelList);
};

/**
 * Fired when call is made to retrieve current user profile
 * @method _getCurrentUserProfileListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._getCurrentUserProfileListener = function _getCurrentUserProfileListener (event) {
    var me = o5.platform.ca.ParentalControl;
    if (event.error && event.error.name === "PinOrCurrentUserIsMaster") {
        me.logDebug("this._isCurrentUserMaster FROM: " + me._isCurrentUserMaster + " TO: true");
        me._isCurrentUserMaster = true;
    } else {
        me.logDebug("this._isCurrentUserMaster FROM: " + me._isCurrentUserMaster + " TO: false");
        me._isCurrentUserMaster = false;
        me._cacheUserProperties(event);
    }
    if (me._blankAndUnblankVideoCallback) {
        me._blankAndUnblankVideoCallback();
    }
    me._userChangedCallback();
};

/**
 * Fired when the user authentication system is disabled
 * @private
 * @method _disableSystemListener
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._disableSystemListener = function _disableSystemListener (event) {
    var me = o5.platform.ca.ParentalControl;
    if (!event.error) {
        me._authenticationEnabled = false;
        me._restrictedChannels = {};
        me._timeWindowNameChannels = {};
        me._parentalAgeChannels = {};
        me._timeLockedChannels = {};
        me.logDebug("FROM: me._userRating=" + me._userRating);
        me._userRating = me._MAXIMUM_AGE_RATING;
        me.logDebug("TO: me._userRating=" + me._userRating);
    }
};

/**
 * Fired when the user authentication system is enabled
 * @method _enableSystemListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._enableSystemListener = function _enableSystemListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me.logEntry();
    if (!event.error) {
        me._authenticationEnabled = true;
        me.logDebug("[CCOM] _ccomUserAuth.getCurrentUserProfile");
        me._ccomUserAuth.getCurrentUserProfile();
    }
    me.logExit();

};

/**
 * Fired when the current user is set
 * @method _setCurrentUserListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._setCurrentUserListener = function _setCurrentUserListener (event) {
    var me = o5.platform.ca.ParentalControl;
    if (!event.error) {
        me.logDebug("this._isCurrentUserMaster FROM: " + me._isCurrentUserMaster + " TO: true");
        me._isCurrentUserMaster = true;
    }
};

/**
 * Called when  queryUserProfileOK or  queryUserProfileFailed  events are fired
 * @method _queryUserProfileListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._queryUserProfileListener = function _queryUserProfileListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me.logEntry();
    me._queryUserProfileCallback(event);
    me._queryUserProfileCallback = function (e) {};
    me.logExit();
};

/**
 * Called when modifyUserProfileOK or modifyUserProfileFailed  events are fired
 * @method _modifyUserProfileListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._modifyUserProfileListener = function _modifyUserProfileListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me.logEntry();
    me._modifyUserCallback(event);
    me._modifyUserCallback = function (e) {};
    me.logExit();
};

/**
 * Called when setAllRestrictedChannelsOK or setAllRestrictedChannelsFailed events are fired
 * @method _setAllRestrictedChannelsListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._setAllRestrictedChannelsListener = function _setAllRestrictedChannelsListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me.logEntry();
    me._setAllRestrictedChannelsCallback(event);
    me._setAllRestrictedChannelsCallback = function (e) {};
    me.logExit();
};

/**
 * Called when getAllRestrictedChannelsOK or getAllRestrictedChannelsFailed events are fired
 * @method _getAllRestrictedChannelsListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._getAllRestrictedChannelsListener = function _getAllRestrictedChannelsListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me.logEntry();
    me._getAllRestrictedChannelsCallback(event);
    me._getAllRestrictedChannelsCallback = function (e) {};
    me.logExit();
};

/**
 * Called when removeRestrictedChannelOK or removeRestrictedChannelFailed events are fired
 * @method _removeRestrictedChannelListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._removeRestrictedChannelListener = function _removeRestrictedChannelListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me.logEntry();
    me._removeRestrictedChannelCallback(event);
    me._removeRestrictedChannelCallback = function (e) {};
    me.logExit();
};

/**
 * Called when addRestrictedChannelOK or addRestrictedChannelFailed events are fired
 * @method _addRestrictedChannelListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._addRestrictedChannelListener = function _addRestrictedChannelListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me.logEntry();
    me._addRestrictedChannelCallback(event);
    me._addRestrictedChannelCallback = function (e) {};
    me.logExit();
};

/**
 * Called when removeAllRestrictedChannelsOK or removeAllRestrictedChannelsFailed events are fired
 * @method _removeAllRestrictedChannelsListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._removeAllRestrictedChannelsListener = function _removeAllRestrictedChannelsListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me.logEntry();
    me._removeAllRestrictedChannelsCallback(event);
    me._removeAllRestrictedChannelsCallback = function (e) {};
    me.logExit();
};

/**
 * Called when resetDefaultProfileOK or resetDefaultProfileFailed events are fired
 * @method _resetDefaultProfileListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._resetDefaultProfileListener = function _resetDefaultProfileListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me._resetDefaultProfileCallback(event);
    me._resetDefaultProfileCallback = function (e) {};
};

/**
 * Called when resetUserProfileOK or resetUserProfileFailed events are fired
 * @method _resetUserProfileListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._resetUserProfileListener = function _resetUserProfileListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me._resetUserProfileCallback(event);
    me._resetUserProfileCallback = function (e) {};
};

/**
 * Fired when the CURRENT_USER_PATH value changes
 * @method _currentUserUpdatedListener
 * @private
 * @param {Number} value The value of the CURRENT_USER_PATH
 */
o5.platform.ca.ParentalControl._currentUserUpdatedListener = function _currentUserUpdatedListener (value) {
    var me = o5.platform.ca.ParentalControl;
    me.logDebug("[CCOM] _ccomUserAuth.getCurrentUserProfile");
    me._ccomUserAuth.getCurrentUserProfile();
};

/**
 * Called when addTimeWindowOK or addTimeWindowFailed events are fired
 * @method _addTimeWindowListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._addTimeWindowListener = function _addTimeWindowListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me._addTimeWindowCallback(event);
    me._addTimeWindowCallback = function (e) {};
};
/**
 * Called when removeTimeWindowOK or removeTimeWindowFailed events are fired
 * @method _removeTimeWindowListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._removeTimeWindowListener = function _removeTimeWindowListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me._removeTimeWindowCallback(event);
    me._removeTimeWindowCallback = function (e) {};
};
/**
 * Called when getAllTimeWindowsOK or getAllTimeWindowsFailed events are fired
 * @method _getAllTimeWindowsListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._getAllTimeWindowsListener = function _getAllTimeWindowsListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me._getAllTimeWindowsCallback(event);
    me._getAllTimeWindowsCallback = function (e) {};
};
/**
 * Called when setAllTimeWindowsOK or setAllTimeWindowsFailed events are fired
 * @method _setAllTimeWindowsListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._setAllTimeWindowsListener = function _setAllTimeWindowsListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me._setAllTimeWindowsCallback(event);
    me._setAllTimeWindowsCallback = function (e) {};
};
/**
 * Called when removeAllTimeWindowsOK or removeAllTimeWindowsFailed events are fired
 * @method _removeAllTimeWindowsListener
 * @private
 * @param {Object} event Event object of the OK/Failed event
 */
o5.platform.ca.ParentalControl._removeAllTimeWindowsListener = function _removeAllTimeWindowsListener (event) {
    var me = o5.platform.ca.ParentalControl;
    me._removeAllTimeWindowsCallback(event);
    me._removeAllTimeWindowsCallback = function (e) {};
};

/**
 * Fired when the master user is authenticated
 * @method _masterUserAuthenticated
 * @private
 */
o5.platform.ca.ParentalControl._masterUserAuthenticated = function _masterUserAuthenticated () {
    var me = o5.platform.ca.ParentalControl;
    me.logDebug("[CCOM] _ccomUserAuth.selectCurrentUser");
    me._ccomUserAuth.selectCurrentUser(o5.platform.ca.PINHandler.getLocalMasterPin(), null);
};

/**
 * Sets up the rating lookup table that will be associated with IP services and events.
 * Adds the listeners for the User Authentication events
 * @method init
 * @param {Object} [ratingLookup] Optional rating LookUp table
 *
 *  e.g. {
 *          '0': {
 *              ratingCode: "U",
 *              description: "Universal"
 *          },
 *          '12': {
 *              ratingCode: "12",
 *              description: "12"
 *          },
 *          '18': {
 *              ratingCode: "18",
 *              description: "18"
 *          }
 *      }
 *
 */
o5.platform.ca.ParentalControl.init = function init (ratingLookup) {
    this.logEntry();
    this._ccomUserAuth = CCOM.UserAuth;
    if (ratingLookup) {
        this.setRatingLookUp(ratingLookup);
    }
    this._ccomUserAuth.addEventListener("enableSystemOK", this._enableSystemListener);
    this._ccomUserAuth.addEventListener("enableSystemFailed", this._enableSystemListener);
    this._ccomUserAuth.addEventListener("disableSystemOK", this._disableSystemListener);
    this._ccomUserAuth.addEventListener("disableSystemFailed", this._disableSystemListener);
    this._ccomUserAuth.addEventListener("getCurrentUserProfileOK", this._getCurrentUserProfileListener);
    this._ccomUserAuth.addEventListener("getCurrentUserProfileFailed", this._getCurrentUserProfileListener);
    this._ccomUserAuth.addEventListener("selectCurrentUserOK", this._setCurrentUserListener);
    this._ccomUserAuth.addEventListener("selectCurrentUserFailed", this._setCurrentUserListener);
    this._ccomUserAuth.addEventListener("queryUserProfileOK", this._queryUserProfileListener);
    this._ccomUserAuth.addEventListener("queryUserProfileFailed", this._queryUserProfileListener);
    this._ccomUserAuth.addEventListener("modifyUserProfileOK", this._modifyUserProfileListener);
    this._ccomUserAuth.addEventListener("modifyUserProfileFailed", this._modifyUserProfileListener);
    this._ccomUserAuth.addEventListener("setAllRestrictedChannelsOK", this._setAllRestrictedChannelsListener);
    this._ccomUserAuth.addEventListener("setAllRestrictedChannelsFailed", this._setAllRestrictedChannelsListener);
    this._ccomUserAuth.addEventListener("getAllRestrictedChannelsOK", this._getAllRestrictedChannelsListener);
    this._ccomUserAuth.addEventListener("getAllRestrictedChannelsFailed", this._getAllRestrictedChannelsListener);
    this._ccomUserAuth.addEventListener("removeRestrictedChannelOK", this._removeRestrictedChannelListener);
    this._ccomUserAuth.addEventListener("removeRestrictedChannelFailed", this._removeRestrictedChannelListener);
    this._ccomUserAuth.addEventListener("removeAllRestrictedChannelsOK", this._removeAllRestrictedChannelsListener);
    this._ccomUserAuth.addEventListener("removeAllRestrictedChannelsFailed", this._removeAllRestrictedChannelsListener);
    this._ccomUserAuth.addEventListener("addRestrictedChannelOK", this._addRestrictedChannelListener);
    this._ccomUserAuth.addEventListener("addRestrictedChannelFailed", this._addRestrictedChannelListener);
    this._ccomUserAuth.addEventListener("resetDefaultProfileOK", this._resetDefaultProfileListener);
    this._ccomUserAuth.addEventListener("resetDefaultProfileFailed", this._resetDefaultProfileListener);
    this._ccomUserAuth.addEventListener("resetUserProfileOK", this._resetUserProfileListener);
    this._ccomUserAuth.addEventListener("resetUserProfileFailed", this._resetUserProfileListener);
    this._ccomUserAuth.addEventListener("addTimeWindowOK", this._addTimeWindowListener);
    this._ccomUserAuth.addEventListener("addTimeWindowFailed", this._addTimeWindowListener);
    this._ccomUserAuth.addEventListener("removeTimeWindowOK", this._removeTimeWindowListener);
    this._ccomUserAuth.addEventListener("removeTimeWindowFailed", this._removeTimeWindowListener);
    this._ccomUserAuth.addEventListener("getAllTimeWindowsOK", this._getAllTimeWindowsListener);
    this._ccomUserAuth.addEventListener("getAllTimeWindowsFailed", this._getAllTimeWindowsListener);
    this._ccomUserAuth.addEventListener("setAllTimeWindowsOK", this._setAllTimeWindowsListener);
    this._ccomUserAuth.addEventListener("setAllTimeWindowsFailed", this._setAllTimeWindowsListener);
    this._ccomUserAuth.addEventListener("removeAllTimeWindowsOK", this._removeAllTimeWindowsListener);
    this._ccomUserAuth.addEventListener("removeAllTimeWindowsFailed", this._removeAllTimeWindowsListener);
    o5.platform.system.Preferences.monitorValue(this._CURRENT_USER_PATH, this._currentUserUpdatedListener, this, true);
    window.document.addEventListener("masterUserAuthenticated", this._masterUserAuthenticated, false);
    this.logExit();
};

/**
 * Sets up the rating lookup table that will be associated with IP services and events.
 * Adds the listeners for the User Authentication events
 * @method initialise
 * @deprecated use init()
 * @param {Object} [ratingLookup] Optional rating LookUp table
 *
 *  e.g. {
 *          '0': {
 *              ratingCode: "U",
 *              description: "Universal"
 *          },
 *          '12': {
 *              ratingCode: "12",
 *              description: "12"
 *          },
 *          '18': {
 *              ratingCode: "18",
 *              description: "18"
 *          }
 *      }
 *
 */
o5.platform.ca.ParentalControl.initialise = function initialise (ratingLookup) {
    this.logDeprecated();

    this.init(ratingLookup);
};

/**
 * Get the user profile associated with the user pin and username.
 * @method queryUserProfile
 * @param {String} userPin User profile associated with user pin will be acquired.
 * @param {String} username User profile associated with username will be acquired.
 */
o5.platform.ca.ParentalControl.queryUserProfile = function queryUserProfile (userPin, username) {
    this.logDebug("[CCOM] _ccomUserAuth.queryUserProfile");
    this._ccomUserAuth.queryUserProfile(userPin, username);
};

/**
 * Enables the user authentication system. Caches the locked channels for the current user
 * @method enableAuthentication
 */
o5.platform.ca.ParentalControl.enableAuthentication = function enableAuthentication () {
    this.logDebug("[CCOM] _ccomUserAuth.enableSystem");
    this._ccomUserAuth.enableSystem();
};

/**
 * Disables the user authentication system. Clears the cached locked channels
 * @method disableAuthentication
 */
o5.platform.ca.ParentalControl.disableAuthentication = function disableAuthentication () {
    this.logDebug("[CCOM] _ccomUserAuth.disableSystem");
    this._ccomUserAuth.disableSystem(o5.platform.ca.PINHandler.getLocalMasterPin());
};

/**
 * Determines if the authentication system has been enabled
 * @method isAuthenticationEnabled
 * @return {Boolean} True if the authentication system has been enabled, false otherwise
 */
o5.platform.ca.ParentalControl.isAuthenticationEnabled = function isAuthenticationEnabled () {
    this.logDebug(String(this._authenticationEnabled));
    return this._authenticationEnabled;
};

/**
 * Sets the policy modifier which defines when the master user will revert to the default user.
 * @method setPolicyModifier
 * @param {Array} policyModifier Array of objects consisting of type and data properties e.g.
 *
 *     [{type: o5.platform.ca.ParentalControl.PolicyModifiers.TIMEOUT, data: 1800},
 *     {type: o5.platform.ca.ParentalControl.PolicyModifiers.CHANNEL_CHANGE, data: ""},
 *     {type: o5.platform.ca.ParentalControl.PolicyModifiers.EVENT_CHANGE, data: ""}];
 * The `TIMEOUT` type requires a number in seconds. When this time expires, the user will revert to the default user
 *
 * The `CHANNEL_CHANGE` and `EVENT_CHANGE` types require data as an empty string.
 *
 * When `CHANNEL_CHANGE` is passed in as a policy modifier, the user will revert to the default user when the current channel changes.
 *
 * When `EVENT_CHANGE` is passed in as a policy modifier, the user will revert to the default user when the current event changes.
 */
o5.platform.ca.ParentalControl.setPolicyModifier = function setPolicyModifier (policyModifier) {
    this.logDebug("[CCOM] _ccomUserAuth.setPolicyModifier");
    this._ccomUserAuth.setPolicyModifier(o5.platform.ca.PINHandler.getLocalMasterPin(), policyModifier);
};

/**
 * Sets the callback for when the current user is reset to the default user
 * @method setUserChangedCallback
 * @param {Function} [callback] Optional callback function for user change event.
 */
o5.platform.ca.ParentalControl.setUserChangedCallback = function setUserChangedCallback (callback) {
    this._userChangedCallback = callback || function () {};
};

/**
 * Checks that the current user has permission to view VOD content for the given age rating
 * @method isVODRatingPermitted
 * @param {Number} ageRating  VOD content rating value
 * @return {Boolean} True if the current user is permitted, false otherwise
 */
o5.platform.ca.ParentalControl.isVODRatingPermitted = function isVODRatingPermitted (ageRating) {
    return this.isRatingPermitted(ageRating);
};

/**
 * Checks that the current user has permission to view content for the given age rating.
 * If user is master, then it always return true.
 * @method isRatingPermitted
 * @param {Number} ageRating  The event / program rating value
 * @return {Boolean} True if the current user is permitted, false otherwise
 */
o5.platform.ca.ParentalControl.isRatingPermitted = function isRatingPermitted (ageRating) {
    this.logEntry();
    if (this._isCurrentUserMaster || !ageRating) {
        return true;
    }
    this.logDebug("this._userRating=" + this._userRating + " >= ageRating=" + ageRating);
    this.logExit();
    return this._userRating >= ageRating; //have to add 3 for dvb rating
};

/**
 * Checks if the current user has permission to view the given service and event by
 * <ul>
 * <li>a. Check the user's list of restricted channels against the service</li>
 * <li>b. Check the user's age rating against the age rating of the service</li>
 * <li>c1. Check the user's age rating against the age rating of the event</li>
 * <li>d. Check the user's list of time lock of the service</li>
 * </ul>
 * @method isServiceAndEventPermitted
 * @param {Object} epgService Service id's object of the channel
 * @param {Object} epgEvent Valid EPG Event Object
 * @return {Boolean} True if the current user is permitted, false otherwise
 */
o5.platform.ca.ParentalControl.isServiceAndEventPermitted = function isServiceAndEventPermitted (epgService, epgEvent) {
    this.logEntry();
    if (this._isCurrentUserMaster || !epgService || !epgEvent) {
        return true;
    }

    if (!this.isRatingPermitted(epgService.parentalRating)) {
        this.logExit();
        return false;
    }

    if (!this.isRatingPermitted(epgEvent.parentalRating)) {
        this.logExit();
        return false;
    }

    if (this.serviceIdRestricted(epgService.serviceId)) {
        this.logExit();
        return false;
    }

    if (this._isServiceLockedAtEpgEvent(epgService.serviceId, epgEvent)) {
        this.logExit();
        return false;
    }
    this.logExit();
    return true;
};

/**
 * Checks the current user has permission to view the given event by checking the user's restricted age rating
 * against the age rating of the event. This method checks only the age rating of the event.
 * If an application needs to check restrict and time block channels, use isServiceAndEventPermitted().
 * <ul>
 * <li>c1. Check the user's age rating against the age rating of the event</li>
 * </ul>
 * @method isEventPermitted
 * @param {Object} epgEvent Valid EPG Event Object
 * @return {Boolean} True if the current user is permitted, false otherwise
 */
o5.platform.ca.ParentalControl.isEventPermitted = function isEventPermitted (epgEvent) {
    this.logEntry();
    if (this._isCurrentUserMaster) {
        return true;
    }
    return (epgEvent !== null) ? this.isRatingPermitted(epgEvent.parentalRating) : true;
};

/**
 * Checks the current user has permission to view the given service by checking the user's restricted channels
 * and user's age rating against the service
 * <ul>
 * <li>a. Check the user's list of restricted channels against the service</li>
 * <li>b. Check the user's age rating against the age rating of the service</li>
 * </ul>
 * @method isServicePermitted
 * @param {Object} epgService Service id's object of the channel
 * @return {Boolean} True if the current user is permitted, false otherwise
 */
o5.platform.ca.ParentalControl.isServicePermitted = function isServicePermitted (epgService) {
    this.logEntry();
    if (this._isCurrentUserMaster) {
        return true;
    }
    if (epgService.parentalRating && !this.isRatingPermitted(epgService.parentalRating)) {
        this.logExit();
        return false;
    }

    if (this.serviceIdRestricted(epgService.serviceId)) {
        this.logExit();
        return false;
    }
    this.logExit();
    return true;
};

/**
 * Sets the rating lookup table that will be associated with IP services and events
 * @method setRatingLookUp
 * @param {Object} lookUpObj Rating LookUp table
 * @param {Object} ratingLookup Rating LookUp table
 *
 *  e.g. {
 *          '0': {
 *              ratingCode: "U",
 *              description: "Universal"
 *          },
 *          '12': {
 *              ratingCode: "12",
 *              description: "12"
 *          },
 *          '18': {
 *              ratingCode: "18",
 *              description: "18"
 *          }
 *      }
 *
 */
o5.platform.ca.ParentalControl.setRatingLookUp = function setRatingLookUp (lookUpObj) {
    this.logEntry();
    if (lookUpObj) {
        this._ratingLookUp = lookUpObj;
    }
    this.logExit();
};

/**
 * Returns the rating lookup table that is associated with IP services and events
 * @method getRatingLookUp
 * @return {Object} The rating look-up table object
 *
 * The table object has the rating look-up entry object with {Number} type property name that is the rating age.
 *
 *        return.{Number} {Object} the rating look-up entry object
 *
 * Each rating look-up entry object has the following attributes:
 *
 *        ratingCode {String} rating code
 *        description {String} the description of the rating
 */
o5.platform.ca.ParentalControl.getRatingLookUp = function getRatingLookUp () {
    return this._ratingLookUp;
};

/**
 * Returns the rating details that are associated with the given rating value.
 * Returns null if no rating lookup table has been set
 * or the rating value does not exist in the table
 * @method getRatingDetailsForValue
 * @param {String} ageRating Rating age for the rating LookUp table
 * @return {Object} The rating object associated with the given rating value
 */
o5.platform.ca.ParentalControl.getRatingDetailsForValue = function getRatingDetailsForValue (ageRating) {
    this.logEntry();
    var ratingObj = this._ratingLookUp[ageRating];
    this.logExit(ratingObj || null);
    return ratingObj || null;
};

/**
 * Returns the rating code that is associated with the given rating value.
 * Returns an empty string if no rating lookup table has been set
 * or the rating value does not exist in the table
 * @method getRatingCodeForValue
 * @param {String} ageRating Rating age for the rating LookUp table
 * @return {String} The rating code for the given rating value
 */
o5.platform.ca.ParentalControl.getRatingCodeForValue = function getRatingCodeForValue (ageRating) {
    this.logEntry();
    var rating = this._ratingLookUp[ageRating];
    if (rating && rating.ratingCode) {
        return rating.ratingCode;
    }
    this.logExit();
    return "";
};

/**
 * Returns the rating description that is associated with the given rating value.
 * Returns an empty string if no rating lookup table has been set
 * or the rating value does not exist in the table
 * @method getRatingDescriptionForValue
 * @param {String} ageRating Rating age for the rating LookUp table
 * @return {String} The description for the given rating value
 */
o5.platform.ca.ParentalControl.getRatingDescriptionForValue = function getRatingDescriptionForValue (ageRating) {
    this.logEntry();
    var rating = this._ratingLookUp[ageRating];
    if (rating && rating.description) {
        this.logExit();
        return rating.description;
    }
    this.logExit();
    return "";
};

/**
 * Sets the age rating value for the given user
 * @method setUserRatingValue
 * @param {Number} ageRating  User rating value
 * @param {String} [userPin=''] Pin number of user to update. If undefined / null then default user is modified
 */
o5.platform.ca.ParentalControl.setUserRatingValue = function setUserRatingValue (ageRating, userPin) {
    this.logEntry();
    if (!userPin) {
        userPin = "";
    }
    if (o5.platform.ca.PINHandler.isPinCurrentUser(userPin)) {
        this.logDebug("FROM: this._userRating=" + this._userRating);
        this._userRating = ageRating;
        this.logDebug("TO: this._userRating=" + this._userRating);
    }
    this._modifyUser(o5.platform.ca.PINHandler.getLocalMasterPin(), userPin, {
        userAge: ageRating
    }, function (isModified) {});
    this.logExit();
};

/**
 * Overrides the user rating level
 * @method setUserRatinglevel
 * @deprecated
 * @param {Number} level User rating level
 */
o5.platform.ca.ParentalControl.setUserRatinglevel = function setUserRatinglevel (level) {
    this._userRatinglevel = level;
};

/**
 * Returns the age rating value for the current user
 * @method getUserRatingValue
 * @return {String} Age rating value for current user
 */
o5.platform.ca.ParentalControl.getUserRatingValue = function getUserRatingValue () {
    this.logEntry();
    this.logExit(String(this._userRating));
    return (this._userRatinglevel || this._userRating);
};

/**
 * Checks if the given service has a time lock associated with it for the current user
 * @method isTimeLocked
 * @param {String} serviceId Service id of the channel
 * @return {Boolean} True if the service does have a time lock, false otherwise
 */
o5.platform.ca.ParentalControl.isTimeLocked = function isTimeLocked (serviceId) {
    this.logEntry(serviceId);
    if (this._isCurrentUserMaster) {
        return false;
    }
    return this._timeLockedChannels[serviceId] ? true : false;
};

/**
 * Create the time window object with given the start and end time for the time window name key
 * @method _createTimeWindow
 * @private
 * @param {String} timeWindowNameKey Time window name key (e.g. "o5TLC_": time window name prefix for time lock channel)
 * @param {Number} startTime Seconds from midnight
 * @param {Number} endTime Seconds from midnight
 * @return {Object} Time window object
 */
o5.platform.ca.ParentalControl._createTimeWindow = function _createTimeWindow (timeWindowNameKey, startTime, endTime) {
    this.logEntry();
    var tw = {};
    var startTimeObject = this._getTimeObjectForTimeWindowName(startTime);
    var endTimeObject = this._getTimeObjectForTimeWindowName(endTime);
    if (startTimeObject === null || endTimeObject === null || startTime >= endTime) { // invalid time setting
        return null;
    }
    // twName Format: o5TLC_HHMMhhmmxx (o5: created by o5, _: delimiter, TLC: TimeLockedChannel HHMM: start time, hhmm: end time,
    // xx: week day [hex value 00-7F e.g "----!--"=04 "!!!!!!!"=7F])
    // may support MMDDYYmmddyy after the o5TLC_HHMMhhmmxx in the future. (MMDDYY: start date, mmddyy: end date)
    tw.twName = timeWindowNameKey + startTimeObject.hour + startTimeObject.minute + endTimeObject.hour + endTimeObject.minute + "7F";
    tw.startTime = startTimeObject.hour + ":" + startTimeObject.minute;
    tw.stopTime = endTimeObject.hour + ":" + endTimeObject.minute;
    tw.weekDay = "!!!!!!!";
    tw.active = true;
    return tw;
};

/**
 * Sets a time lock for the given time window (startTime -> endTime) against the given service for all users by the given user
 * @method setTimeLocked
 * @async
 * @param {String} serviceId Service id of the channel
 * @param {Number} startTime Seconds from midnight
 * @param {Number} endTime Seconds from midnight
 * @param {String} userPin Pin number of user to update. If undefined / null then default user is modified
 * @param {Function} [callback] Optional callback function that is called once the time lock has been set. If call fails will pass a false
 * parameter to the callback, if succeeds will pass true parameter
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl.setTimeLocked = function setTimeLocked (serviceId, startTime, endTime, userPin, callback) {
    this.logEntry();
    var timeWindow;

    if (!userPin) {
        userPin = ""; //default user
    }
    if (!callback) {
        callback = function (isSet) {};
    }

    if (o5.platform.ca.PINHandler.isPinCurrentUser(userPin) && serviceId) {
        timeWindow = this._createTimeWindow(this._TIMEW_INDOW_NAME_KEY_TIME_LOCK_CHANNEL, startTime, endTime);
        if (timeWindow !== null) {
            this._setTimeWindow(o5.platform.ca.PINHandler.getLocalMasterPin(), timeWindow, function (isModified) {
                if (isModified === true) {
                    this._setTimeWindowToRestrictedService(serviceId, userPin, timeWindow.twName, function (isModified2) {
                        callback(isModified2);
                    });
                } else {
                    callback(false);
                    return;
                }
            }.bind(this));
        } else {
            callback(false);
            return;
        }
    } else {
        callback(false);
        return;
    }
    this.logExit();
};

/**
 * Removes all time locks for the given serviceId for all users by the given user
 * @method removeTimeLock
 * @async
 * @param {String} serviceId Service id of the channel
 * @param {String} userPin Pin number of user to update, if undefined/null then default user is modified
 * @param {Function} [callback] Optional callback function that is called once the time lock has been removed. If call fails will pass a false
 * parameter to the callback, if succeeds will pass true parameter
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl.removeTimeLock = function removeTimeLock (serviceId, userPin, callback) {
    this.logEntry();
    if (!userPin) {
        userPin = ""; //default user
    }
    if (!callback) {
        callback = function (isModified) {};
    }

    if (o5.platform.ca.PINHandler.isPinCurrentUser(userPin) && serviceId) {
        this.unsetRestrictedService(serviceId, userPin, function (isModified) {
            if (isModified === true) {
                this._cleanupTimeWindows(o5.platform.ca.PINHandler.getLocalMasterPin(), null);
            }
            callback(isModified);
        }.bind(this));
    } else {
        callback(false);
        return;
    }
    this.logExit();
};

/**
 * Checks if the given channel will be locked at all between the given start and end time of the epgEvent for the current user.
 * This check is carried out against the user's time locked channels.
 * Returns true if channel will be locked at all between given time window, false otherwise
 * @method _isServiceLockedAtEpgEvent
 * @private
 * @param {String} serviceId Service id of the channel
 * @param {Object} epgEvent Valid EPG Event Object
 * @return {Boolean} True if service is locked at time window, false otherwise
 */
o5.platform.ca.ParentalControl._isServiceLockedAtEpgEvent = function _isServiceLockedAtEpgEvent (serviceId, epgEvent) {
    this.logEntry();
    var timeLockedChannel,
        startTime,
        endTime;
    if (!epgEvent || !epgEvent.startTime || !epgEvent.endTime) {
        this.logExit("Exit1 false");
        return false;
    }

    timeLockedChannel = this._timeLockedChannels[serviceId];
    if (!timeLockedChannel) {
        this.logExit("Exit2 false");
        return false;
    }
    startTime = this._getTimestampToSecondsSinceMidnight(epgEvent.startTime);
    endTime = this._getTimestampToSecondsSinceMidnight(epgEvent.endTime);

    return this._isTimeLockedChannelAtTime(timeLockedChannel, startTime, endTime);
};

/**
 * Checks if the given channel will be locked at all between the given start and end time for the current user.
 * This check is carried out against the user's time locked channels.
 * Returns true if channel will be locked at all between given time window, false otherwise
 * @method isServiceLockedAtTime
 * @param {String} serviceId Service id of the channel
 * @param {Number} startTime Seconds since midnight
 * @param {Number} endTime Seconds since midnight
 * @return {Boolean} True if service is locked at time window, false otherwise
 */
o5.platform.ca.ParentalControl.isServiceLockedAtTime = function isServiceLockedAtTime (serviceId, startTime, endTime) {
    this.logEntry();
    var timeLockedChannel;
    if (this._isCurrentUserMaster) {
        this.logExit("Exit1 false");
        return false;
    }
    timeLockedChannel = this._timeLockedChannels[serviceId];
    if (!timeLockedChannel) {
        this.logExit("Exit3 false");
        return false;
    }

    if (startTime === undefined || startTime === null || endTime === undefined || endTime === null) {
        this.logExit("Exit2 false invalid value startTime=" + startTime + " and/or endTime=" + endTime);
        return false;
    }

    return this._isTimeLockedChannelAtTime(timeLockedChannel, startTime, endTime);
};

/**
 * Checks if the channel will be locked at all between the given start and end time for the current user.
 * This check is carried out against the user's time locked channel.
 * Returns true if the channel will be locked at all between given time window, false otherwise
 * @method _isTimeLockedChannelAtTime
 * @private
 * @param {Array} timeLockedChannel Time lock array of the list that has start and end time
 * @param {Number} startTime Seconds since midnight
 * @param {Number} endTime Seconds since midnight
 * @return {Boolean} True if service is locked at time window, false otherwise
 */
o5.platform.ca.ParentalControl._isTimeLockedChannelAtTime = function _isTimeLockedChannelAtTime (timeLockedChannel, startTime, endTime) {
    this.logEntry();
    var lockedServiceStartTime,
        lockedServiceEndTime,
        i;
    for (i = 0; i < timeLockedChannel.length; i++) {
        lockedServiceStartTime = timeLockedChannel[i].startTime;
        lockedServiceEndTime = timeLockedChannel[i].endTime;
        if ((startTime <= lockedServiceStartTime && lockedServiceEndTime <= endTime) ||
            (lockedServiceStartTime <= startTime && startTime < lockedServiceEndTime) ||
            (lockedServiceStartTime < endTime && endTime <= lockedServiceEndTime)) {
            this.logExit("Exit1 true");
            return true;
        }
    }
    this.logExit("Exit2 false");
    return false;
};

/**
 * Returns the next time that the given service will be locked due to the current user's restrictions.
 * Regard overlapping or connected entries as one entry.
 * <pre>e.g.
 * Overlapping entries: 09:00-10:00 and 09:30-10:30 -> 09:00-10:30
 * Connected entries:  09:00-10:00 and 10:00-11:00 -> 09:00-11:00
 * There are three entries. 09:00-10:00, 09:30-10:30, 11:00-12:00:
 *     Current time: 08:00, Next start time: 09:00
 *     Current time: 09:15, Next start time: 11:00
 *     Current time: 10:00, Next end time: 11:00
 *     Current time: 10:45, Next end time: 11:00</pre>
 * @method getServiceLockStartTime
 * @param {String} serviceId Service id of the channel
 * @return {Number} Time in seconds from midnight
 */
o5.platform.ca.ParentalControl.getServiceLockStartTime = function getServiceLockStartTime (serviceId) {
    this.logEntry();
    var i,
        currentTime,
        currentTimeSeconds,
        startTime = null,
        lockedTimesForService;
    if (!serviceId) {
        this.logExit();
        return null;
    }
    lockedTimesForService = this._timeLockedChannels[serviceId];
    if (!lockedTimesForService || lockedTimesForService.length === 0) {
        this.logExit();
        return null;
    }
    currentTime = new Date();
    currentTimeSeconds = this._getSecondsForTimeString(String(currentTime.getHours()) + ":" + String(currentTime.getMinutes()));

    for (i = 0; i < lockedTimesForService.length; i++) {
        startTime = lockedTimesForService[i].startTime;
        if (currentTimeSeconds < startTime) {
            this.logExit("timeLockedChannels[" + serviceId + "][" + i + "].startTime=" + startTime);
            return startTime;
        }
    }
    if (lockedTimesForService.length > 0) {
        startTime = lockedTimesForService[0].startTime;
        this.logDebug("NEXT DAY: timeLockedChannels[" + serviceId + "][" + 0 + "].startTime=" + startTime);
    }

    this.logExit();
    return startTime;
};

/**
 * Returns the next time that the given service will be unlocked due to the current user's restrictions.
 * Regard overlapping or connected entries as one entry.
 * <pre>e.g.
 * Overlapping entries: 09:00-10:00 and 09:30-10:30 -> 09:00-10:30
 * Connected entries:  09:00-10:00 and 10:00-11:00 -> 09:00-11:00
 * There are three entries. 09:00-10:00, 09:30-10:30, 11:00-12:00:
 *     Current time: 08:00, Next end time: 10:30
 *     Current time: 09:15, Next end time: 10:30
 *     Current time: 10:00, Next end time: 10:30
 *     Current time: 10:45, Next end time: 12:00</pre>
 * @method getServiceLockEndTime
 * @param {String} serviceId Service id of the channel
 * @return {Number} Time in seconds from midnight
 */
o5.platform.ca.ParentalControl.getServiceLockEndTime = function getServiceLockEndTime (serviceId) {
    this.logEntry();
    var i,
        currentTime,
        currentTimeSeconds,
        endTime = null,
        lockedTimesForService;
    if (!serviceId) {
        this.logExit();
        return null;
    }
    lockedTimesForService = this._timeLockedChannels[serviceId];
    if (!lockedTimesForService || lockedTimesForService.length === 0) {
        this.logExit();
        return null;
    }
    currentTime = new Date();
    currentTimeSeconds = this._getSecondsForTimeString(String(currentTime.getHours()) + ":" + String(currentTime.getMinutes()));

    for (i = 0; i < lockedTimesForService.length; i++) {
        endTime = lockedTimesForService[i].endTime;
        if (currentTimeSeconds < endTime) {
            this.logExit("timeLockedChannels[" + serviceId + "][" + i + "].endTime=" + endTime);
            return endTime;
        }
    }
    if (lockedTimesForService.length > 0) {
        endTime = lockedTimesForService[0].endTime;
        this.logDebug("NEXT DAY: timeLockedChannels[" + serviceId + "][" + 0 + "].endTime=" + endTime);
    }
    this.logExit();
    return endTime;
};

/**
 * Returns an array of objects with properties `serviceId` and `lockedTimes`. LockedTimes is an object itself
 * containing properties `startTime` and `endTime`
 * @method getTimeLockedServices
 * @return {Array} Array of objects with `serviceId`, `lockedTimes` properties
 */
o5.platform.ca.ParentalControl.getTimeLockedServices = function getTimeLockedServices () {
    this.logEntry();
    var timeLockedServices = [],
        i,
        timeLockedServiceObj,
        serviceId;
    for (serviceId in this._timeLockedChannels) {
        if (this._timeLockedChannels.hasOwnProperty(serviceId)) {
            timeLockedServiceObj = {};
            timeLockedServiceObj.serviceId = serviceId;
            timeLockedServiceObj.lockedTimes = [];
            for (i = 0; i < this._timeLockedChannels[serviceId].length; i++) {
                timeLockedServiceObj.lockedTimes.push({
                    startTime: this._timeLockedChannels[serviceId][i].startTime,
                    endTime: this._timeLockedChannels[serviceId][i].endTime
                });
            }
            timeLockedServices.push(timeLockedServiceObj);
        }
    }
    this.logExit();
    return timeLockedServices;
};

/**
 * Returns the number of time locked services for the current user
 * @method getTimeLockedServicesCount
 * @return {Number} Number of locked services
 */
o5.platform.ca.ParentalControl.getTimeLockedServicesCount = function getTimeLockedServicesCount () {
    this.logEntry();
    var count = 0,
        serviceId;
    for (serviceId in this._timeLockedChannels) {
        if (this._timeLockedChannels.hasOwnProperty(serviceId)) {
            count++;
        }
    }
    this.logExit();
    return count;
};

/**
 * Returns the number of restricted services for the current user
 * @method getRestrictedServicesCount
 * @return {Number} Number of locked services
 */
o5.platform.ca.ParentalControl.getRestrictedServicesCount = function getRestrictedServicesCount () {
    this.logEntry();
    return this._restrictedChannels ? Object.keys(this._restrictedChannels).length : 0;
};

/**
 * Restricted the given service for all users by the given user
 * @method setRestrictedService
 * @async
 * @param {String} serviceId Service id of the channel
 * @param {String} userPin Pin number of user to update. If undefined / null then default user is modified
 * @param {Function} callback Callback function that is called once the service has been set to restricted. If call fails will pass a false
 * parameter to the callback, if succeeds will pass true parameter
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl.setRestrictedService = function setRestrictedService (serviceId, userPin, callback) {
    this.logEntry();
    if (!userPin) {
        userPin = ""; //default user
    }
    if (o5.platform.ca.PINHandler.isPinCurrentUser(userPin)) {
        this.addRestrictedChannel(o5.platform.ca.PINHandler.getLocalMasterPin(), serviceId, callback);
    } else {
        callback(false);
        return;
    }
    this.logExit();
};

/**
 * Add the restricted channel(for the given masterPin) with the given serviceId
 * @method addRestrictedChannel
 * @async
 * @param {String} masterPin The master pin number string
 * @param {String} serviceId Service id of the channel
 * @param {Function} [callback] Optional callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl.addRestrictedChannel = function addRestrictedChannel (masterPin, serviceId, callback) {
    this.logEntry();
    var parsedData;
    if (!callback) {
        callback = function (isModified) {};
    }

    this._getAllRestrictedChannelsCallback = function (e) {
        this.logDebug("addRestrictedChannel::_getAllRestrictedChannelsCallback serviceId=" + serviceId);
        parsedData = this._parseAllRestrictedChannels(e);
        if (parsedData !== null) {
            if (!parsedData.restrictedChannels[serviceId]) {
                parsedData.restrictedChannels[serviceId] = serviceId;
                this._addRestrictedChannel(masterPin, serviceId, function (isModified) {
                    this.logDebug("addRestrictedChannel::_getAllRestrictedChannelsCallback::_addRestrictedChannel serviceId=" + serviceId + " isModified=" + isModified);
                    if (isModified === true) {
                        this._cachedParsedRestrictedChannels(parsedData);
                    }
                    callback(isModified);
                }.bind(this));
            } else {
                this.logDebug("addRestrictedChannel::_getAllRestrictedChannelsCallback serviceId=" + serviceId + " No update needed");
                callback(false); // NO update needed.
                return;
            }
        } else {
            this.logDebug("addRestrictedChannel::_getAllRestrictedChannelsCallback serviceId=" + serviceId + " Failure");
            callback(false);
            return;
        }
    }.bind(this);

    if (serviceId) {
        this.logDebug("[CCOM] _ccomUserAuth.getAllRestrictedChannels");
        this._ccomUserAuth.getAllRestrictedChannels();
    } else {
        callback(false);
        return;
    }
    this.logExit();
};

/**
 * Removes the given service from the restricted list of services for all users by the given user.
 * @method unsetRestrictedService
 * @async
 * @param {String} serviceId Service id of the channel
 * @param {String} userPin Pin number of user to update. If undefined / null then default user is modified
 * @param {Function} callback Callback function that is called once the service restriction has been unset. If call fails will pass a false
 * parameter to the callback, if succeeds will pass true parameter. If the service is already unrestricted, it will also pass true into callback.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl.unsetRestrictedService = function unsetRestrictedService (serviceId, userPin, callback) {
    this.logEntry();
    if (!userPin) {
        userPin = ""; //default user
    }
    if (o5.platform.ca.PINHandler.isPinCurrentUser(userPin)) {
        this.removeRestrictedChannel(o5.platform.ca.PINHandler.getLocalMasterPin(), serviceId, callback);
    } else {
        callback(false);
        return;
    }
    this.logExit();
};

/**
 * Remove the restricted channel(for the given masterPin) with the given serviceId
 * @method removeRestrictedChannel
 * @async
 * @param {String} masterPin The master pin number string
 * @param {String} serviceId Service id of the channel
 * @param {Function} [callback] Optional callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl.removeRestrictedChannel = function removeRestrictedChannel (masterPin, serviceId, callback) {
    this.logEntry();
    var parsedData;
    if (!callback) {
        callback = function (isModified) {};
    }

    this._getAllRestrictedChannelsCallback = function (e) {
        this.logDebug("removeRestrictedChannel::_getAllRestrictedChannelsCallback serviceId=" + serviceId);
        parsedData = this._parseAllRestrictedChannels(e);
        if (parsedData !== null) {
            if (parsedData.restrictedChannels[serviceId]) {
                this._deleteParsedRestrictedChannels(parsedData, serviceId);
                this._removeRestrictedChannel(masterPin, serviceId, function (isModified) {
                    this.logDebug("removeRestrictedChannel::_getAllRestrictedChannelsCallback::_removeRestrictedChannel serviceId=" + serviceId + " isModified=" + isModified);
                    if (isModified === true) {
                        this._cachedParsedRestrictedChannels(parsedData);
                        this._cleanupTimeWindows(masterPin, null);
                    }
                    callback(isModified);
                }.bind(this));
            } else {
                this.logDebug("removeRestrictedChannel::_getAllRestrictedChannelsCallback serviceId=" + serviceId + " No update needed");
                callback(false); // NO update needed.
                return;
            }
        } else {
            this.logDebug("removeRestrictedChannel::_getAllRestrictedChannelsCallback serviceId=" + serviceId + " Failure");
            callback(false);
            return;
        }
    }.bind(this);

    if (serviceId) {
        this.logDebug("[CCOM] _ccomUserAuth.getAllRestrictedChannels");
        this._ccomUserAuth.getAllRestrictedChannels();
    } else {
        callback(false);
        return;
    }
    this.logExit();
};

/**
 * Sets the given services as restricted for all users by the given user.
 * These will override the current restricted services list
 * @method setRestrictedServices
 * @async
 * @param {Array} serviceIds Array of serviceIds. When the array length is 0, remove all.
 * @param {String} userPin Pin number of user to update. If undefined / null then default user is modified
 * @param {Function} [callback] Optional callback function that is called once the services have been set to restricted. If call fails will pass a false
 * parameter to the callback, if succeeds will pass true parameter
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl.setRestrictedServices = function setRestrictedServices (serviceIds, userPin, callback) {
    this.logEntry();
    var parsedData,
        i,
        newRestrictedChannels = {},
        restrictedChannelStrings = [];
    if (!userPin) {
        userPin = ""; //default user
    }
    if (!callback) {
        callback = function (isModified) {};
    }

    this._getAllRestrictedChannelsCallback = function (e) {
        this.logDebug("setRestrictedServices::_getAllRestrictedChannelsCallback");
        parsedData = this._parseAllRestrictedChannels(e);
        if (parsedData !== null) {
            for (i = 0; i < serviceIds.length; i++) {
                if (!parsedData.restrictedChannels[serviceIds[i]]) {
                    this._setParsedRestrictedChannels(parsedData, serviceIds[i], null, null);
                }
                newRestrictedChannels[serviceIds[i]] = true;
                restrictedChannelStrings.push(this._getParsedRestrictedChannelString(parsedData, serviceIds[i]));
            }
            for (var serviceId in parsedData.restrictedChannels) {
                if (parsedData.restrictedChannels.hasOwnProperty(serviceId)) {
                    if (newRestrictedChannels[serviceId] !== true) {
                        this._deleteParsedRestrictedChannels(parsedData, serviceId);
                    }
                }
            }
            this._setAllRestrictedChannels(o5.platform.ca.PINHandler.getLocalMasterPin(), restrictedChannelStrings, function (isModified) {
                this.logDebug("setRestrictedServices::_getAllRestrictedChannelsCallback::_setAllRestrictedChannels isModified=" + isModified);
                if (isModified === true) {
                    this._cachedParsedRestrictedChannels(parsedData);
                    this._cleanupTimeWindows(o5.platform.ca.PINHandler.getLocalMasterPin(), null);
                }
                callback(isModified);
            }.bind(this));
        } else {
            this.logDebug("setRestrictedServices::_getAllRestrictedChannelsCallback Failure");
            callback(false);
            return;
        }
    }.bind(this);
    if (o5.platform.ca.PINHandler.isPinCurrentUser(userPin) && serviceIds) {
        if (serviceIds.length > 0) {
            this.logDebug("[CCOM] _ccomUserAuth.getAllRestrictedChannels");
            this._ccomUserAuth.getAllRestrictedChannels();
        } else {
            this.removeAllRestrictedChannels(o5.platform.ca.PINHandler.getLocalMasterPin(), callback);
        }
    } else {
        callback(false);
        return;
    }

    this.logExit();
};

/**
 * Adds the time window to the service as restricted for all users by the given user.
 * @method _setTimeWindowToRestrictedService
 * @private
 * @async
 * @param {String} serviceId Service id of the channel
 * @param {String} userPin Pin number of user to update. If undefined / null then default user is modified
 * @param {String} timeWindowName the time windows name
 * @param {Function} [callback] Optional callback function that is called once the services have been set to restricted. If call fails will pass a false
 * parameter to the callback, if succeeds will pass true parameter
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl._setTimeWindowToRestrictedService = function _setTimeWindowToRestrictedService (serviceId, userPin, timeWindowName, callback) {
    this.logEntry();
    var parsedData,
        restrictedChannelStrings = [];
    if (!userPin) {
        userPin = ""; //default user
    }
    if (!callback) {
        callback = function (isModified) {};
    }

    this._getAllRestrictedChannelsCallback = function (e) {
        this.logDebug("_setTimeWindowToRestrictedService::_getAllRestrictedChannelsCallback");
        parsedData = this._parseAllRestrictedChannels(e);
        if (parsedData !== null) {
            if (!parsedData.restrictedChannels[serviceId]) {
                this._setParsedRestrictedChannels(parsedData, serviceId, null, null);
            }
            if (this._addTimeWindowNameToParsedRestrictedChannels(parsedData, serviceId, timeWindowName) !== true) {
                this.logDebug("did not add the timeWindowName");
                callback(false); // did not add
                return;
            }
            for (var serviceId2 in parsedData.restrictedChannels) {
                if (parsedData.restrictedChannels.hasOwnProperty(serviceId2)) {
                    restrictedChannelStrings.push(this._getParsedRestrictedChannelString(parsedData, serviceId2));
                }
            }
            this._setAllRestrictedChannels(o5.platform.ca.PINHandler.getLocalMasterPin(), restrictedChannelStrings, function (isModified) {
                this.logDebug("_setTimeWindowToRestrictedService::_getAllRestrictedChannelsCallback::_setAllRestrictedChannels isModified=" + isModified);
                if (isModified === true) {
                    this._cachedParsedRestrictedChannels(parsedData);
                }
                callback(isModified);
            }.bind(this));
        } else {
            this.logDebug("_setTimeWindowToRestrictedService::_getAllRestrictedChannelsCallback Failure");
            callback(false);
            return;
        }
    }.bind(this);
    if (o5.platform.ca.PINHandler.isPinCurrentUser(userPin) && serviceId && timeWindowName) {
        this.logDebug("[CCOM] _ccomUserAuth.getAllRestrictedChannels");
        this._ccomUserAuth.getAllRestrictedChannels();
    } else {
        callback(false);
        return;
    }
    this.logExit();
};

/**
 * Removes the given services from the restricted list for all users by the given user
 * @method unsetRestrictedServices
 * @async
 * @param {Array} serviceIds Array of serviceIds
 * @param {String} userPin Pin number of user to update. If undefined / null then default user is modified
 * @param {Function} [callback] Optional callback function that is called once the services restrictions have been unset. If call fails will pass a false
 * parameter to the callback, if succeeds will pass true parameter
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl.unsetRestrictedServices = function unsetRestrictedServices (serviceIds, userPin, callback) {
    this.logEntry();
    var parsedData,
        i,
        needToChange = false,
        needToRemoveRestrictedChannels = [],
        restrictedChannelStrings = [];
    if (!userPin) {
        userPin = ""; //default user
    }
    if (!callback) {
        callback = function (isModified) {};
    }

    this._getAllRestrictedChannelsCallback = function (e) {
        this.logDebug("unsetRestrictedServices::_getAllRestrictedChannelsCallback");
        parsedData = this._parseAllRestrictedChannels(e);
        if (parsedData !== null) {
            for (i = 0; i < serviceIds.length; i++) {
                if (parsedData.restrictedChannels[serviceIds[i]]) {
                    needToRemoveRestrictedChannels[serviceIds[i]] = true;
                    needToChange = true;
                }
            }
            for (var serviceId in parsedData.restrictedChannels) {
                if (parsedData.restrictedChannels.hasOwnProperty(serviceId)) {
                    if (needToRemoveRestrictedChannels[serviceId] === true) {
                        this._deleteParsedRestrictedChannels(parsedData, serviceId);
                    } else {
                       restrictedChannelStrings.push(this._getParsedRestrictedChannelString(parsedData, serviceId));
                    }
                }
            }

            if (needToChange === true) {
                if (restrictedChannelStrings.length > 0) {
                    this._setAllRestrictedChannels(o5.platform.ca.PINHandler.getLocalMasterPin(), restrictedChannelStrings, function (isModified) {
                        this.logDebug("unsetRestrictedServices::_getAllRestrictedChannelsCallback::_setAllRestrictedChannels isModified=" + isModified);
                        if (isModified === true) {
                            this._cachedParsedRestrictedChannels(parsedData);
                            this._cleanupTimeWindows(o5.platform.ca.PINHandler.getLocalMasterPin(), null);
                        }
                        callback(isModified);
                    }.bind(this));
                } else {
                     this._removeAllRestrictedChannels(o5.platform.ca.PINHandler.getLocalMasterPin(), function (isModified) {
                        this.logDebug("unsetRestrictedServices::_getAllRestrictedChannelsCallback::_removeAllRestrictedChannels isModified=" + isModified);
                        if (isModified === true) {
                            this._cachedParsedRestrictedChannels(parsedData);
                            this._cleanupTimeWindows(o5.platform.ca.PINHandler.getLocalMasterPin(), null);
                        }
                        callback(isModified);
                    }.bind(this));
                }
            } else {
                this.logDebug("unsetRestrictedServices::_getAllRestrictedChannelsCallback serviceId=" + serviceId + " NO update needed");
                callback(true); // NO update needed.
                return;
            }
        } else {
            this.logDebug("unsetRestrictedServices::_getAllRestrictedChannelsCallback Failure");
            callback(false);
            return;
        }
    }.bind(this);

    if (o5.platform.ca.PINHandler.isPinCurrentUser(userPin) && serviceIds && serviceIds.length > 0) {
        this.logDebug("[CCOM] _ccomUserAuth.getAllRestrictedChannels");
        this._ccomUserAuth.getAllRestrictedChannels();
    } else {
        callback(false);
        return;
    }
    this.logExit();
};

/**
 * Returns an object of service ids that have been set as restricted for the current user
 * @method getRestrictedServices
 * @return {Object} Object of serviceIds. The properties of the return object are serviceids.
 */
o5.platform.ca.ParentalControl.getRestrictedServices = function getRestrictedServices () {
    this.logEntry();
    return this._restrictedChannels || {};
};

/**
 * Returns true if the given serviceId is restricted for the current user.
 * If user is master, then it always return false.
 * @method isServiceIdRestricted
 * @deprecated  use isChannelLocked
 * @param {String} serviceId Service id of the channel
 * @return {Boolean} True if the serviceId is restricted, false otherwise
 */
o5.platform.ca.ParentalControl.isServiceIdRestricted = function isServiceIdRestricted (serviceId) {
    return this.isChannelLocked(serviceId);
};

/**
 * Returns true if the given serviceId is restricted for the current user
 * @method serviceIdRestricted
 * @param {String} serviceId Service id of the channel
 * @return {Boolean} True if the serviceId is restricted, false otherwise
 */
o5.platform.ca.ParentalControl.serviceIdRestricted = function serviceIdRestricted (serviceId) {
    if (serviceId === undefined || !this._restrictedChannels) {
        return false;
    }
    return this._restrictedChannels[serviceId] ? true : false;
};

/**
 * Checks that the current user has permission to view content for the given age rating
 * @method ratingPermitted
 * @param {String} ageRating The event / program rating value
 * @return {Boolean} True if the current user is permitted, false otherwise
 */
o5.platform.ca.ParentalControl.ratingPermitted = function ratingPermitted (ageRating) {
    if (!ageRating) {
        return true;
    }
    this.logDebug("this._userRating=" + this._userRating + " >= ageRating=" + ageRating);
    return this._userRating >= ageRating; //have to add 3 for dvb rating
};

/**
 * Creates a new user with same rights as the default user. These rights can be updated
 * calling `setUserRatingValue()` and `setRestrictedService/setRestrictedServices()`.
 * The new user will have the `userPin` as its PIN number.
 * @method createUser
 * @deprecated  only supported in OTV5.1
 * @param {String} userPin Pin number of user
 */
o5.platform.ca.ParentalControl.createUser = function createUser (userPin) {
    this.logEntry();
    this.logExit();
};

/**
 * The current user will be set to the default user after the given time has passed.
 * To cancel the authentication timer pass in 0 seconds
 * @method setAuthenticationTimeout
 * @param {Number} time Seconds
 */
o5.platform.ca.ParentalControl.setAuthenticationTimeout = function setAuthenticationTimeout (time) {
    this.logEntry();
    CCOM.ConfigManager.setValue(this._AUTHENTICATION_TIMEOUT_PATH, time);
    this.logExit();
};

/**
 * Returns the time (in seconds) set for the authentication timer
 * @method getAuthenticationTimeout
 * @return {Number} The authentication timeout in seconds
 */
o5.platform.ca.ParentalControl.getAuthenticationTimeout = function getAuthenticationTimeout () {
    this.logEntry();
    return CCOM.ConfigManager.getValue(this._AUTHENTICATION_TIMEOUT_PATH).keyValue;
};

/**
 * Returns true if the current user is the master user, false if not
 * @method isCurrentUserMaster
 * @return {Boolean} True if current user is the master user
 */
o5.platform.ca.ParentalControl.isCurrentUserMaster = function isCurrentUserMaster () {
    // Check from preferences because Master user could time out depending on setPolicyModifier() value
    this._isCurrentUserMaster = o5.platform.system.Preferences.get("/users/current/isMaster", true);

    this.logDebug("this._isCurrentUserMaster=" + this._isCurrentUserMaster);
    return this._isCurrentUserMaster;
};

/**
 * @method setBlocked
 * @removed use setRestrictedService
 */

/**
 * @method unsetBlocked
 * @removed use unsetRestrictedService
 */

/**
 * @method getDefaultLockStartTime
 * @removed this method is no longer supported
 */

/**
 * @method getDefaultLockEndTime
 * @removed this method is no longer supported
 */

/**
 * @method startChanLockTimer
 * @removed this method is no longer supported
 */

/**
 * @method isServiceCurrentlyPermitted
 * @removed use isServicePermitted
 */

/**
 * @method isChannelLockedAtTime
 * @removed use isServiceLockedAtTime
 */

/**
 * @method getChannelLockStartTime
 * @removed use getServiceLockStartTime
 */

/**
 * @method getChannelLockEndTime
 * @removed use getServiceLockEndTime
 */

/**
 * @method getLockedChannelsCount
 * @removed use getLockedServicesCount
 */

/**
 * Remove the restricted channel(for the given masterPin) with the given serviceId
 * @method _removeRestrictedChannel
 * @private
 * @async
 * @param {String} masterPin The master pin number string
 * @param {String} serviceId Service id of the channel
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl._removeRestrictedChannel = function _removeRestrictedChannel (masterPin, serviceId, callback) {
    this.logEntry();
    this._removeRestrictedChannelCallback = function (e) {
        if (!e.error) {
            callback(true);
            return;
        } else {
            callback(false);
            return;
        }
    };
    this.logDebug("[CCOM] _ccomUserAuth.removeRestrictedChannel");
    this._ccomUserAuth.removeRestrictedChannel(masterPin, serviceId);
    this.logExit();
};

/**
 * Add the restricted channel(for the given masterPin) with the given serviceId
 * @method _addRestrictedChannel
 * @private
 * @async
 * @param {String} masterPin The master pin number string
 * @param {String} serviceId Service id of the channel
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl._addRestrictedChannel = function _addRestrictedChannel (masterPin, serviceId, callback) {
    this.logEntry();
    this._addRestrictedChannelCallback = function (e) {
        if (!e.error) {
            callback(true);
            return;
        } else {
            callback(false);
            return;
        }
    };
    this.logDebug("[CCOM] _ccomUserAuth.addRestrictedChannel");
    this._ccomUserAuth.addRestrictedChannel(masterPin, serviceId);
    this.logExit();
};

/**
 * Remove All restricted channels(for the given masterPin)
 * @method removeAllRestrictedChannels
 * @async
 * @param {String} masterPin The master pin number string
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl.removeAllRestrictedChannels = function removeAllRestrictedChannels (masterPin, callback) {
    var parsedData = { restrictedChannels: {}, timeWindowNameChannels: {}, parentalAgeChannels: {}, timeLockedChannels: {} };
    this._removeAllRestrictedChannels(masterPin, function (isModified) {
        this.logDebug("callback _removeAllRestrictedChannels isModified=" + isModified);
        if (isModified === true) {
            this._cachedParsedRestrictedChannels(parsedData);
            this._cleanupTimeWindows(masterPin, null);
        }
        callback(isModified);
    }.bind(this));

};

/**
 * Remove All restricted channels(for the given masterPin)
 * @method _removeAllRestrictedChannels
 * @private
 * @async
 * @param {String} masterPin The master pin number string
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl._removeAllRestrictedChannels = function _removeAllRestrictedChannels (masterPin, callback) {
    this._removeAllRestrictedChannelsCallback = function (e) {
        if (!e.error) {
            callback(true);
            return;
        } else {
            callback(false);
            return;
        }
    };
    this.logDebug("[CCOM] _ccomUserAuth.removeAllRestrictedChannels");
    this._ccomUserAuth.removeAllRestrictedChannels(masterPin);
};

/**
 * Set the time windows with the given time window list and callback
 * @method _setAllTimeWindows
 * @private
 * @async
 * @param {String} masterPin the master pin number string
 * @param {Array} timeWindowArray Array of the time window objects
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl._setAllTimeWindows = function _setAllTimeWindows (masterPin, timeWindowArray, callback) {
    this._setAllTimeWindowsCallback = function (e) {
        if (!e.error) {
            callback(true);
            return;
        } else {
            callback(false);
            return;
        }
    };
    this.logDebug("[CCOM] _ccomUserAuth.setAllTimeWindows");
    this._ccomUserAuth.setAllTimeWindows(masterPin, timeWindowArray);
};

/**
 * Remove all time windows
 * @method _removeAllTimeWindows
 * @private
 * @async
 * @param {String} masterPin The master pin number string
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl._removeAllTimeWindows = function _removeAllTimeWindows (masterPin, callback) {
    this._removeAllTimeWindowsCallback = function (e) {
        if (!e.error) {
            callback(true);
            return;
        } else {
            callback(false);
            return;
        }
    };
    this.logDebug("[CCOM] _ccomUserAuth.removeAllTimeWindows");
    this._ccomUserAuth.removeAllTimeWindows(masterPin);
};

/**
 * Add the time window
 * @method _addTimeWindow
 * @private
 * @async
 * @param {String} masterPin The master pin number string
 * @param {Object} timeWindow The time window object
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl._addTimeWindow = function _addTimeWindow (masterPin, timeWindow, callback) {
    this.logEntry();
    this._addTimeWindowCallback = function (e) {
        if (!e.error) {
            callback(true);
            return;
        } else {
            callback(false);
            return;
        }
    };
    this.logDebug("[CCOM] _ccomUserAuth.addTimeWindow");
    this._ccomUserAuth.addTimeWindow(masterPin, timeWindow);
    this.logExit();
};

/**
 * Remove the time window
 * @method _removeTimeWindow
 * @private
 * @async
 * @param {String} masterPin the master pin number string
 * @param {String} timeWindowName The time windows name
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl._removeTimeWindow = function _removeTimeWindow (masterPin, timeWindowName, callback) {
    this.logEntry();
    this._removeTimeWindowCallback = function (e) {
        if (!e.error) {
            callback(true);
            return;
        } else {
            callback(false);
            return;
        }
    };
    this.logDebug("[CCOM] _ccomUserAuth.removeTimeWindow");
    this._ccomUserAuth.removeTimeWindow(masterPin, timeWindowName);
    this.logExit();
};

/**
 * Reset the current user profile into default user profile
 * @method resetDefaultProfile
 * @async
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl.resetDefaultProfile = function resetDefaultProfile (callback) {
    this._resetDefaultProfileCallback = function (e) {
        if (!e.error) {
            callback(true);
            return;
        } else {
            callback(false);
            return;
        }
    };
    this.logDebug("[CCOM] _ccomUserAuth.resetDefaultProfile");
    this._ccomUserAuth.resetDefaultProfile();
};

/**
 * Reset the current user profile into default user profile
 * @method resetUserProfile
 * @async
 * @param {Function} callback Callback function for success or failure event.
 * @param {Boolean} callback.isModified True if successful or false for failure.
 */
o5.platform.ca.ParentalControl.resetUserProfile = function resetUserProfile (callback) {
    this._resetUserProfileCallback = function (e) {
        if (!e.error) {
            callback(true);
            return;
        } else {
            callback(false);
            return;
        }
    };
    this.logDebug("[CCOM] _ccomUserAuth.resetUserProfile");
    this._ccomUserAuth.resetUserProfile();
};
/**
 * Callback Called when  queryUserProfileOK or  queryUserProfileFailed  events are fired
 * @method setQueryUserProfileListener
 * @param {Function} [callback] Optional callback function for success or failure event after called the queryUserProfile().
 * @param {Object} callback.event Pass the event object of queryUserProfileOK or queryUserProfileFailed. See OK/FAILED EVENTS of CCOM.UserAuth.queryUserProfile
 */
o5.platform.ca.ParentalControl.setQueryUserProfileListener = function setQueryUserProfileListener (callback) {
    this._queryUserProfileCallback = callback || function () {};
};

/**
 * Returns Event rating exceeded status based on given rating
 * @method isRatingExceeded
 * @param {number} ageRating The event / program rating value
 * @return {Boolean} True if given rating is higher than the user rating, false otherwise
 */
o5.platform.ca.ParentalControl.isRatingExceeded = function isRatingExceeded (ageRating) {
    if (!ageRating) {
        return false;
    }
    this.logDebug("ageRating=" + ageRating + " > this._userRating=" + this._userRating);
    return ageRating > this._userRating;
};

/**
 * Returns whether the BTV service and event is deemed
 * parentally locked, or blocked (for service) by the application.
 * The event.isProgramLocked property is set by an application or O5.
 * <ul>
 * <li>a. Check the user's list of restricted channels against the service</li>
 * <li>b. Check the user's age rating against the age rating of the service</li>
 * <li>c1. or c2.
 * <ul><li>c2. If the event.isProgramLocked property was set, check the event.isProgramLocked property.</li>
 *     <li>c1. Check the user's age rating against the age rating of the event</li></ul>
 * </li>
 * <li>d. Check the user's list of time lock of the service</li>
 * </ul>
 * @method isChannelOrProgramLocked
 * @param {Object} event Valid EPG Event Object
 * @return {Boolean} True if the the channel or program should not be authorized, false otherwise
 */
o5.platform.ca.ParentalControl.isChannelOrProgramLocked = function isChannelOrProgramLocked (event) {
    var epgService;
    this.logEntry();
    if (event) {
        if (this._isCurrentUserMaster) {
            this.logExit("Exit1 false");
            return false;
        }

        if (event.isProgramLocked !== undefined && event.isProgramLocked !== null) {
            if (event.isProgramLocked) {
                this.logExit("Exit2 true");
                return true;
            }
        } else if (!this.isRatingPermitted(event.parentalRating)) {
            this.logExit("Exit3 true");
            return true;
        }

        if (event.serviceId) {
            if (this.serviceIdRestricted(event.serviceId)) {
                this.logExit("Exit4 true");
                return true;
            }
            epgService = o5.platform.btv.EPG.getChannelByServiceId(event.serviceId);
            if (epgService !== undefined && epgService !== null) {
                if (!this.isRatingPermitted(epgService.parentalRating)) {
                    this.logExit("Exit5 true");
                    return true;
                }
            }
            if (this._isServiceLockedAtEpgEvent(event.serviceId, event)) {
                this.logExit("Exit6 true");
                return true;
            }
        }
    }
    this.logExit("Exit7 false");
    return false;
};

/**
 * Returns whether a BTV program is deemed as locked
 * by the application.
 * The event.isProgramLocked property is set by an application or O5.
 * <ul><li>c1. or c2.
 *     <ul><li>c2. If the event.isProgramLocked property was set, check the event.isProgramLocked property.</li>
 *     <li>c1. Check the user's age rating against the age rating of the event</li></ul>
 * </li></ul>
 * @method isProgramLocked
 * @param {Object} event Valid EPG Event Object
 * @return {Boolean} True if program is deemed locked, false otherwise
 */
o5.platform.ca.ParentalControl.isProgramLocked = function isProgramLocked (event) {
    this.logEntry();
    if (this._isCurrentUserMaster) {
        this.logExit("Exit1 false");
        return false;
    }
    if (event) {
        if (event.isProgramLocked !== undefined && event.isProgramLocked !== null) {
            if (event.isProgramLocked) {
                this.logExit("Exit2 true");
                return true;
            }
        } else if (!this.isRatingPermitted(event.parentalRating)) {
            this.logExit("Exit3 true");
            return true;
        }
    }
    this.logExit("Exit4 false");
    return false;
};

/**
 * Returns whether a BTV channel is deemed as locked
 * by the application
 * @method isChannelLocked
 * @param {String} serviceId Service id of the channel
 * @return {Boolean} True if service is deemed locked, false otherwise
 */
o5.platform.ca.ParentalControl.isChannelLocked = function isChannelLocked (serviceId) {
    this.logEntry();
    if (this._isCurrentUserMaster || serviceId === undefined || !this._restrictedChannels) {
        return false;
    }
    return this._restrictedChannels[serviceId] ? true : false;
};

/**
 * Sets the callback method for blank and unblank IP channels
 * when user change fired.
 * @method setBlankAndUnblankVideoCallback
 * @param {Function} [callback] Optional callback function for blank/unblank video
 */
o5.platform.ca.ParentalControl.setBlankAndUnblankVideoCallback = function setBlankAndUnblankVideoCallback (callback) {
    this._blankAndUnblankVideoCallback = callback || function () {};
};

/**
 * Enumeration of the policy modifier types
 * Possible values are `TIMEOUT`, `CHANNEL_CHANGE`, `EVENT_CHANGE`
 * @property {Number} PolicyModifiers
 */
o5.platform.ca.ParentalControl.PolicyModifiers = {
    TIMEOUT: 1,
    CHANNEL_CHANGE: 2,
    EVENT_CHANGE: 4
};

// uncomment to turn debugging on for PParentalControl object
// o5.log.setAll(o5.platform.ca.ParentalControl, true);
