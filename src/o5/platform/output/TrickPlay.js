/**
 * TrickPlay contains the methods that control the Player's playback speed.
 * This allows for the following functionality:
 *
 * - Rewind
 * - Fast-Forward
 * - Play/Pause
 * - Stop
 *
 * It registers listeners that listen out for the following events within the Player
 * which can be overwritten by application.
 *
 * - `onPlayStarted`
 * - `onBoc`
 * - `onEoc`
 *
 * Callbacks are used so that the application that calls the TrickPlay class can update
 * its GUI accordingly.
 *
 * @class o5.platform.output.TrickPlay
 * @constructor
 * @param {Object} player The CCOM player object that this TrickPlay is
 * associated with and listening to events for.
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.output.TrickPlay = function TrickPlay (player) {
    var me = this;
    this.PLAY_SPEED = 100;
    this.PAUSE_SPEED = 0;
    this._player = null;
    this._SPEED_MULTIPLIERS = [ 200, 400, 800, 1600, 3200 ];
    this._allowSpeedCycle = true;
    this._defaultSkipTimeInSeconds = 30;
    this._isDirectMode = true;
    this._savedPlayerMode = null;
    this._savedPlayerSpeed = null;

    if (player) {
        this.setPlayer(player);
    } else {
        this.logError("invalid player");
    }

    // these three functions can be overwritten by application
    this._appOnPositionChangedCallback = null;
    this._appOnPositionChangeFailedCallback = null;
    this._uiRefreshCallback = null;

    // defalut onPlayStarted callback, can be overwritten by application
    this._onPlayStartedCallback = function _onPlayStartedCallback (e) {
        me.logEntry();
        me.logDebug("event onPlayStarted callback");
        me.play();
        me.logExit();
    };

    // defalut onBuffering callback.
    this._onBufferingCallback = function _onBufferingCallback (e) {
        me.logEntry();

        if (e && e.bufferingInfo) {
            me.logDebug("event onBuffering callback, percentBuffered: " + e.bufferingInfo.percentBuffered);

            if (me._uiRefreshCallback) {
                me.logDebug("call _uiRefreshCallback(" + me.getTrickPlayMode() + ", " + me.getSpeed() +
                    ", " + e.bufferingInfo.percentBuffered + ")");
                me._uiRefreshCallback(me.getTrickPlayMode(), me.getSpeed(), e.bufferingInfo.percentBuffered);
            }
        }

        me.logExit();
    };

    // default onBoc callback, can be overwritten by application
    this._onBocCallback = function _onBocCallback (e) {
        me.logEntry();
        me.logDebug("event onBoc callback");
        me.play();
        me.logExit();
    };

    // default onEoc callback, can be overwritten by application
    this._onEocCallback = function _onEocCallback (e) {
        me.logEntry();
        me.logDebug("event onEoc callback");
        me.pause();
        me.logExit();
    };

    // default onCaughtUptoLive callback.
    this._onCaughtUptoLiveCallback = function _onCaughtUptoLiveCallback (e) {
        me.logEntry();
        me.logDebug("event onCaughtUptoLive callback");
        me.play();
        me.logExit();
    };

    // callback functions for private _setSpeed() and _setPosition()
    this._playerSetSpeedCallback = function _playerSetSpeedCallback (result, reason) {
        me.logEntry();
        me.logExit();
    };
    this._playerSetPositionCallback = function _playerSetPositionCallback (result, reason) {
        me.logEntry();
        me.logExit();
    };


    // callback functions for native player speed related events
    this._setPositionOK = function _setPositionOK (e) {
        me.logEntry();
        me.logDebug("event setPositionOK callback");
        me.logExit();
    };

    this._setPositionFailedCallback = function _setPositionFailedCallback (e) {
        me.logEntry();
        me.logDebug("event setPositionFailed callback");
        me.logExit();
    };

    this._onPositionChangeFailedCallback = function _onPositionChangeFailedCallback (e) {
        me.logEntry();
        me.logDebug("event onPositionChangeFailed callback");
        me.logExit();
    };

    this._onPositionChangedCallback = function _onPositionChangedCallback (e) {
        me.logEntry();
        me.logDebug("event onPositionChanged callback");
        me.logExit();
    };

    // callback functions for native player speed related events

    this._setSpeedOKCallback = function _setSpeedOKCallback (e) {
        me.logEntry();
        me.logDebug("event setSpeedOK callback");
        me.logExit();
    };

    this._setSpeedFailedCallback = function _setSpeedFailedCallback (e) {
        me.logEntry();
        me.logDebug("event setSpeedFailed callback");
        me.logExit();
    };

    this._onSpeedChangeFailedCallback = function _onSpeedChangeFailedCallback (e) {
        me.logEntry();
        me.logDebug("event onSpeedChangeFailed callback");
        me.logExit();
    };

    this._onSpeedChangedCallback = function _onSpeedChangedCallback (e) {
        me.logEntry();
        me.logDebug("event onSpeedChanged callback");
        me.logExit();
    };

};

/**
 * Enumeration of playback modes.
 * @readonly
 * @property {String} MODES
 * @property {String} MODES.PLAY play
 * @property {String} MODES.PAUSE pause
 * @property {String} MODES.FF ff
 * @property {String} MODES.RW rew
 */
o5.platform.output.TrickPlay.MODES = {
    PLAY: "play",
    PAUSE: "pause",
    FF: "ff",
    RW: "rew"
};

/**
 * Set the player object that is being used for video playback
 * @method setPlayer
 * @param {Object} player CCOM player object
 */
o5.platform.output.TrickPlay.prototype.setPlayer = function setPlayer (player) {
    this._player = player;
    if (!this._player) {
        this.logError("invalid player");
    }
};

/**
 * Returns the player in use for video playback
 * @method getPlayer
 * @return {Object} player CCOM player object
 */
o5.platform.output.TrickPlay.prototype.getPlayer = function getPlayer () {
    return this._player;
};

/**
 * Overrides the default behavior for when the player trigger `onPlayStarted` event.
 * The default player behavior is to start playing.
 * @method setPlayerPlayingCallback
 * @param {Function} callback Callback function to be invoked when player starts playing
 */
o5.platform.output.TrickPlay.prototype.setPlayerPlayingCallback = function setPlayerPlayingCallback (callback) {
    var me = this;
    if (this._player) {
        this._player.removeEventListener("onPlayStarted", this._onPlayStartedCallback, false);
        this._onPlayStartedCallback = function _onPlayStartedCallback (e) {
            me.logEntry();
            me.logDebug("application onPlayStarted event callback");
            me.play();
            if (callback) {
                me.logExit();
                callback(e);
                return;
            }
            me.logExit();
        };
        this._player.addEventListener("onPlayStarted", this._onPlayStartedCallback, false);
    }

};

/**
 * Overrides the behavior for when the player reaches the start of the content.
 * The default player behavior is to start playing.
 * @method setPlayerAtBeginningCallback
 * @param {Function} callback Callback function to be invoked at the beginning of the video
 */
o5.platform.output.TrickPlay.prototype.setPlayerAtBeginningCallback = function setPlayerAtBeginningCallback (callback) {
    var me = this;
    if (this._player) {
        this._player.removeEventListener("onBoc", this._onBocCallback, false);
        this._onBocCallback = function _onBocCallback (e) {
            me.logEntry();
            me.logDebug("application onBoc event callback");
            me.play();
            if (callback) {
                me.logExit();
                callback(e);
                return;
            }
            me.logExit();
        };
        this._player.addEventListener("onBoc", this._onBocCallback, false);
    }
};

/**
 * Overrides the behavior for when the player reaches the end of the content.
 * The default behavior is to pause the player.
 * @method setPlayerAtEndCallback
 * @param {Function} callback Callback function to be invoked at the end of the video
 */
o5.platform.output.TrickPlay.prototype.setPlayerAtEndCallback = function setPlayerAtEndCallback (callback) {
    var me = this;
    if (this._player) {
        this._player.removeEventListener("onEoc", this._onEocCallback, false);
        this._onEocCallback = function _onEocCallback (e) {
            me.logEntry();
            me.logDebug("application onEoc event callback");
            me.pause();
            if (callback) {
                me.logExit();
                callback(e);
                return;
            }
            me.logExit();
        };
        this._player.addEventListener("onEoc", this._onEocCallback, false);
    }
};

/**
 * Sets the callback function to be executed for updating the UI.
 * The callback is executed after calling the trick play methods such as
 * play, pause, fast-forward etc.
 * @method setUIRefreshCallback
 * @param {Function} callback Callback function
 * @param {String} callback.mode Trick play mode, which is one of the `MODES` enumeration.
 * @param {Number} callback.speed Trick play speed
 * @param {Number|undefined} callback.bufferPercentage Video buffer percentage. If 0,
 * video buffer is at 0%. If 100, video buffer is at 100%. If undefined, it is unknown.
 */
o5.platform.output.TrickPlay.prototype.setUIRefreshCallback = function setUIRefreshCallback (callback) {
    this.logEntry();
    this._uiRefreshCallback = callback;
    this.logDebug("=================== _uiRefreshCallback is defined");
    this.logExit();
};

/**
 * Sets the callback function to be executed upon receiving a positionChangeFailed event.
 * @method setPositionChangeFailedCallback
 * @param {Function} callback Callback function
 */
o5.platform.output.TrickPlay.prototype.setPositionChangeFailedCallback = function setPositionChangeFailedCallback (callback) {
    this._appOnPositionChangeFailedCallback = callback;
};

/**
 * Sets the callback function to be executed when the playback position changes.
 * @method setPositionChangeCallback
 * @param {Function} callback Callback function
 */
o5.platform.output.TrickPlay.prototype.setPositionChangeCallback = function setPositionChangeCallback (callback) {
    this._appOnPositionChangedCallback = callback;
};

/**
 * Sets whether fast-forward and rewind functionality should allow the various
 * speeds to cycle. If true, and fast-forward / rewind is on the maximum speed, the
 * playrate will cycle back to the lowest. If false, subsequent presses of
 * the fast-forward / rewind keys when on maximum speed will have no effect.
 * @method setAllowSpeedCycle
 * @param {Boolean} allow True to allow
 */
o5.platform.output.TrickPlay.prototype.setAllowSpeedCycle = function setAllowSpeedCycle (allow) {
    this._allowSpeedCycle = allow;
};

/**
 * Sets the trick play speeds to be used for fast-forward and rewind. If not set, the default
 * is 200, 400, 800, 1600 and 3200 which corresponds to 2x, 4x, 8x, 16x and 32x.
 * @method setPlayRateMultipliers
 * @param {Array} mutliplierArray Array of trick play speeds
 */
o5.platform.output.TrickPlay.prototype.setPlayRateMultipliers = function setPlayRateMultipliers (mutliplierArray) {
    this._SPEED_MULTIPLIERS = mutliplierArray;
};

/**
 * Sets the default time to skip in the content when the keyHandler
 * receives a request to skip forwards or back.
 * @method setDefaultSkipTime
 * @param {Number} timeSeconds Time to skip in seconds
 */
o5.platform.output.TrickPlay.prototype.setDefaultSkipTime = function setDefaultSkipTime (timeSeconds) {
    this._defaultSkipTimeInSeconds = timeSeconds;
};


/**
 * Saves the current player mode and speed. This will be used in case a player speed change
 * request fails.
 * @method _saveCurrentPlayerState
 * @private
 */
o5.platform.output.TrickPlay.prototype._saveCurrentPlayerState = function _saveCurrentPlayerState () {
    this.logEntry();
    this._savedPlayerMode = this.getTrickPlayMode();
    this._savedPlayerSpeed = this.getSpeed();
    this.logExit();
};

/**
 * Registers relevant listeners to allow the UI callbacks to be executed.
 * @method registerEventListeners
 */
o5.platform.output.TrickPlay.prototype.registerEventListeners = function registerEventListeners () {
    if (this._player) {
        this._player.addEventListener("onPlayStarted", this._onPlayStartedCallback, false);
        this._player.addEventListener("onBuffering", this._onBufferingCallback, false);
        this._player.addEventListener("onEoc", this._onEocCallback, false);
        this._player.addEventListener("onBoc", this._onBocCallback, false);
        this._player.addEventListener("onCaughtUptoLive", this._onCaughtUptoLiveCallback, false);

        this._player.addEventListener("setSpeedOK", this._setSpeedOKCallback, false);
        this._player.addEventListener("setSpeedFailed", this._setSpeedFailedCallback, false);
        this._player.addEventListener("onSpeedChangeFailed", this._onSpeedChangeFailedCallback, false);
        this._player.addEventListener("onSpeedChanged", this._onSpeedChangedCallback, false);

        this._player.addEventListener("setPositionOK", this._setPositionOK, false);
        this._player.addEventListener("setPositionFailed", this._setPositionFailedCallback, false);
        this._player.addEventListener("onPositionChangeFailed", this._onPositionChangeFailedCallback, false);
        this._player.addEventListener("onPositionChanged", this._onPositionChangedCallback, false);
    }
};

/**
 * Unregisters the listeners to registered with `registerEventListeners`
 * @method unRegisterEventListeners
 */
o5.platform.output.TrickPlay.prototype.unRegisterEventListeners = function unRegisterEventListeners () {
    if (this._player) {
        this._player.removeEventListener("onPlayStarted", this._onPlayStartedCallback, false);
        this._player.removeEventListener("onBuffering", this._onBufferingCallback, false);
        this._player.removeEventListener("onEoc", this._onEocCallback, false);
        this._player.removeEventListener("onBoc", this._onBocCallback, false);
        this._player.removeEventListener("onCaughtUptoLive", this._onCaughtUptoLiveCallback, false);

        this._player.removeEventListener("setSpeedOK", this._setSpeedOKCallback, false);
        this._player.removeEventListener("setSpeedFailed", this._setSpeedFailedCallback, false);
        this._player.removeEventListener("onSpeedChangeFailed", this._onSpeedChangeFailedCallback, false);
        this._player.removeEventListener("onSpeedChanged", this._onSpeedChangedCallback, false);

        this._player.removeEventListener("setPositionOK", this._setPositionOK, false);
        this._player.removeEventListener("setPositionFailed", this._setPositionFailedCallback, false);
        this._player.removeEventListener("onPositionChangeFailed", this._onPositionChangeFailedCallback, false);
        this._player.removeEventListener("onPositionChanged", this._onPositionChangedCallback, false);
    }
};

/**
 * Toggles the video playback between play and pause
 * @method playPause
 * @async
 * @param {Boolean} dedicated Denotes if dedicated play button was pressed (not play / pause)
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result  True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.TrickPlay.prototype.playPause = function playPause (dedicated, callback) {
    this.logEntry();

    if (this._player.speed === this.PLAY_SPEED ||
        (dedicated && (this._player.speed > this.PAUSE_SPEED || this._player.speed < this.PAUSE_SPEED))) {
        // If play, then pause
        this.pause(callback);
    } else {
        // if we're rewinding, paused etc, then resume play at normal playing speed
        this.play(callback);
    }
    this.logExit();
};

/**
 * Sets playback speed
 * @method _setSpeed
 * @private
 * @async
 * @param {Number} speed Speed to set to
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.TrickPlay.prototype._setSpeed = function _setSpeed (speed, callback) {
    var me = this;
    this.logEntry();

    if (!this._player) {
        if (callback) {
            callback(false, "invalid player");
            return;
        }
        return;
    }

    this._playerSetSpeedCallback = callback;

    this._player.removeEventListener("setSpeedOK", this._setSpeedOKCallback);
    this._player.removeEventListener("setSpeedFailed", this._setSpeedFailedCallback);
    this._player.removeEventListener("onSpeedChanged", this._onSpeedChangedCallback);
    this._player.removeEventListener("onSpeedChangeFailed", this._onSpeedChangeFailedCallback);

    this._setSpeedOKCallback = function _setSpeedOKCallback (e) {
        //if this event is fired, we still need wait for onSpeedChanged/onSpeedChangeFailed event,
        //so just do nothing for this event
        me.logDebug("================ _setSpeedOKCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.handle = " + e.handle);
    };

    this._setSpeedFailedCallback = function _setSpeedFailedCallback (e) {
        me.logDebug("================ _setSpeedFailedCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.handle = " + e.handle);
        me.logDebug("e.error.message = " + e.error.message);
        if (me._playerSetSpeedCallback) {
            me._playerSetSpeedCallback(false, "setSpeedFailed: " + e.error.message);
        }
    };

    this._onSpeedChangedCallback = function _onSpeedChangedCallback (e) {
        me.logDebug("================ _onSpeedChangedCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.speedChangedInfo.newSpeed = " + e.speedChangedInfo.newSpeed);
        me.logDebug("e.speedChangedInfo.oldSpeed = " + e.speedChangedInfo.oldSpeed);
        me.logDebug("e.speedChangedInfo.playSessionHandle = " + e.speedChangedInfo.playSessionHandle);
        if (me._playerSetSpeedCallback) {
            me._playerSetSpeedCallback(true, "Successful");
        }
    };

    this._onSpeedChangeFailedCallback = function _onSpeedChangeFailedCallback (e) {
        me.logDebug("================ _onSpeedChangeFailedCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.speedChangeFailedInfo.playSessionHandle = " + e.speedChangeFailedInfo.playSessionHandle);
        me.logDebug("e.speedChangeFailedInfo.reason = " + e.speedChangeFailedInfo.reason);
        me.logDebug("e.speedChangeFailedInfo.requestedSpeed = " + e.speedChangeFailedInfo.requestedSpeed);
        if (me._playerSetSpeedCallback) {
            me._playerSetSpeedCallback(false, "onSpeedChangeFailed: " + e.speedChangeFailedInfo.reason);
        }
    };

    this._player.addEventListener("setSpeedOK", this._setSpeedOKCallback);
    this._player.addEventListener("setSpeedFailed", this._setSpeedFailedCallback);
    this._player.addEventListener("onSpeedChanged", this._onSpeedChangedCallback);
    this._player.addEventListener("onSpeedChangeFailed", this._onSpeedChangeFailedCallback);

    this._player.setSpeed(speed);
    this.logExit();
};


/**
 * Sets the playback position to the given time
 * @method _setPosition
 * @private
 * @async
 * @param {Number} position The position to set in milliseconds
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.TrickPlay.prototype._setPosition = function _setPosition (position, callback) {
    var positionCommand;
    this.logEntry();

    if (!this._player) {
        if (callback) {
            callback(false, "invalid player");
            return;
        }
        return;
    }

    positionCommand = {
        whence: this._player.SEEK_SET,
        type: this._player.POSITION_TYPE_TIME_BASED,
        timePosition: position
    };

    var me = this;
    this._player.removeEventListener("setPositionOK", this._setPositionOK);
    this._player.removeEventListener("setPositionFailed", this._setPositionFailedCallback);
    this._player.removeEventListener("onPositionChanged", this._onPositionChangedCallback);
    this._player.removeEventListener("onPositionChangeFailed", this._onPositionChangeFailedCallback);

    this._playerSetPositionCallback = callback;

    this._setPositionOK = function _setPositionOK (e) {
        //if this event is fired, we still need wait for onPositionChanged/onPositionChangeFailed event,
        //so just do nothing for this event
        me.logDebug("================ _setPositionOK called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.handle = " + e.handle);
    };

    this._setPositionFailedCallback = function _setPositionFailedCallback (e) {
        me.logDebug("================ _setPositionFailedCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.handle = " + e.handle);
        me.logDebug("e.error.message = " + e.error.message);

        if (me._playerSetPositionCallback) {
            me._playerSetPositionCallback(false, "setPositionFailed: " + e.error.message);
        }
    };

    this._onPositionChangedCallback = function _onPositionChangedCallback (e) {
        me.logDebug("================ _onPositionChangedCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.positionChangedInfo.newPosition = " + e.positionChangedInfo.newPosition);
        me.logDebug("e.positionChangedInfo.playSessionHandle = " + e.positionChangedInfo.playSessionHandle);
        if (me._playerSetPositionCallback) {
            me._playerSetPositionCallback(true, "successful");
        }
        if (me._appOnPositionChangedCallback) {
            me._appOnPositionChangedCallback(e);
        }
        // CCOM player does not trigger 'onBoc' event when setPostion to 0
        // Manually call _onBocCallback() to fix it
        if (position === 0 && me._onBocCallback) {
            me._onBocCallback();
        }
    };

    this._onPositionChangeFailedCallback = function _onPositionChangeFailedCallback (e) {
        me.logDebug("================ _onPositionChangeFailedCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.positionChangeFailedInfo.playSessionHandle = " + e.positionChangeFailedInfo.playSessionHandle);
        me.logDebug("e.positionChangeFailedInfo.reason = " + e.positionChangeFailedInfo.reason);
        me.logDebug("e.positionChangeFailedInfo.requestedPosition = " + e.positionChangeFailedInfo.requestedPosition);
        if (me._playerSetPositionCallback) {
            me._playerSetPositionCallback(false, "onPositionChangeFailed: " + e.positionChangeFailedInfo.reason);
        }

        if (me._appOnPositionChangeFailedCallback) {
            me._appOnPositionChangeFailedCallback(e);
        }
    };

    this._player.addEventListener("setPositionOK", this._setPositionOK);
    this._player.addEventListener("setPositionFailed", this._setPositionFailedCallback);
    this._player.addEventListener("onPositionChanged", this._onPositionChangedCallback);
    this._player.addEventListener("onPositionChangeFailed", this._onPositionChangeFailedCallback);
    this._player.setPosition(positionCommand);

    this.logExit();
};


/**
 * Set the new playback speed for FF and Rewind
 * @method _setNewSpeed
 * @private
 * @async
 * @param {Boolean} keyFF When keyFF is true, return a new FF speed, otherwise return a new rewind speed
 * @param {Boolean} isDirectMode Direct mode flag
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
// Disable ESLint complexity because this API may be refactored in the future to simplify trick play
// eslint-disable-next-line complexity
o5.platform.output.TrickPlay.prototype._setNewSpeed = function _setNewSpeed (keyFF, isDirectMode, callback) {
    this.logEntry();
    var actionFF = keyFF,
        newSpeedIDX = 0, // index of the lowest speed
        absSpeed,
        speed = this._player.speed,
        newSpeed;

    // get the index of the _SPEED_MULTIPLIERS array for current speed
    if (speed !== this.PLAY_SPEED && speed !== this.PAUSE_SPEED) {
        absSpeed = Math.abs(speed);
        for (var i = 0; i < this._SPEED_MULTIPLIERS.length; i++) {
            if (absSpeed === this._SPEED_MULTIPLIERS[i]) {
                newSpeedIDX = i; // current speed
            }
        }
    }

    // Get the new index for the new speed
    if ((keyFF === true && speed > this.PLAY_SPEED) || // during FF
        (keyFF === false && speed < this.PAUSE_SPEED)) { // during Rewind
        newSpeedIDX++; // Speed Up
        if (newSpeedIDX === this._SPEED_MULTIPLIERS.length) {
            if (!this._allowSpeedCycle) {
                this.logExit("Exit 1");
                return;
            }
            newSpeedIDX = -1; // play for allow cycle -1: Play
        }
    } else if ((keyFF === true && speed < this.PAUSE_SPEED) || // during Rewind
        (keyFF === false && speed > this.PLAY_SPEED)) { // during FF
        if (isDirectMode === true) {
            newSpeedIDX = 0; // lowest speed
        } else if (newSpeedIDX >= 0) {
            actionFF = !actionFF;
            newSpeedIDX--; // Speed Down
        }
    }

    if (newSpeedIDX === -1) {
        newSpeed = this.PLAY_SPEED;
    } else if (actionFF === true) {
        newSpeed = this._SPEED_MULTIPLIERS[newSpeedIDX];
    } else {
        newSpeed = -this._SPEED_MULTIPLIERS[newSpeedIDX];
    }

    var me = this;
    var _setSpeedCB = function _setSpeedCB (result, reason) {
        if (result) {
            me._saveCurrentPlayerState();
        }
        if (callback) {
            callback(result, reason); // eslint-disable-line callback-return
        }
        if (me._uiRefreshCallback) {
            me.logDebug("call _uiRefreshCallback(" + me.getTrickPlayMode() + ", " + me.getSpeed() + ")");
            me._uiRefreshCallback(me.getTrickPlayMode(), me.getSpeed());
        }
    };

    if (speed !== newSpeed) {
        this.logDebug("Key=" + (keyFF ? "(>>)" : "(<<)") + " Speed: " + speed + " -> " + newSpeed);
        this._setSpeed(newSpeed, _setSpeedCB);
    } else if (callback) {
        callback(true, "Successful");
        return;
    }
    this.logExit("Exit 2");
};

/**
 * Pauses the video playback and calls the function registered by `setUIRefreshCallback`
 * @method pause
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.TrickPlay.prototype.pause = function pause (callback) {
    this.logEntry();
    var me = this;
    var _setSpeedCB = function _setSpeedCB (result, reason) {
        me.logDebug("======= _setSpeedCB: result = " + result + ",reason =" + reason + " ===============");
        if (result === true) {
            me._savedPlayerSpeed = me.PAUSE_SPEED;
            me._savedPlayerMode = o5.platform.output.TrickPlay.MODES.PAUSE;
        }

        if (callback) {
            callback(result, reason); // eslint-disable-line callback-return
        }

        if (me._uiRefreshCallback) {
            me.logDebug("call _uiRefreshCallback(" + me.getTrickPlayMode() + ", " + me.getSpeed() + ")");
            me._uiRefreshCallback(me.getTrickPlayMode(), me.getSpeed());
        }
    };

    this.logDebug("prototype.pause _player.speed = " + this._player.speed);
    if (this._player.speed !== this.PAUSE_SPEED) {
        this._setSpeed(this.PAUSE_SPEED, _setSpeedCB);
    } else {
        if (callback) {
            callback(true, "Successful"); // eslint-disable-line callback-return
        }
        if (this._savedPlayerMode !== o5.platform.output.TrickPlay.MODES.PAUSE) {
            this._savedPlayerMode = o5.platform.output.TrickPlay.MODES.PAUSE;
            if (this._uiRefreshCallback) {
                this.logDebug("call _uiRefreshCallback(" + o5.platform.output.TrickPlay.MODES.PAUSE + ", " + this.PAUSE_SPEED + ")");
                this._uiRefreshCallback(o5.platform.output.TrickPlay.MODES.PAUSE, this.PAUSE_SPEED);
            }
        }
    }
    this.logExit();
};

/**
 * Changes the player to play mode.
 * @method play
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.TrickPlay.prototype.play = function play (callback) {
    this.logEntry();
    var me = this;
    var _setSpeedCB = function _setSpeedCB (result, reason) {
        if (result) {
            me._savedPlayerSpeed = me.PLAY_SPEED;
            me._savedPlayerMode = o5.platform.output.TrickPlay.MODES.PLAY;
        }
        if (callback) {
            callback(result, reason); // eslint-disable-line callback-return
        }
        if (me._uiRefreshCallback) {
            me.logDebug("call _uiRefreshCallback(" + me.getTrickPlayMode() + ", " + me.getSpeed() + ")");
            me._uiRefreshCallback(me.getTrickPlayMode(), me.getSpeed());
        }
    };

    this.logDebug("current player.speed = " + this._player.speed);
    if (this._player.speed !== this.PLAY_SPEED) {
        this._setSpeed(this.PLAY_SPEED, _setSpeedCB);
    } else {
        if (this._savedPlayerMode !== o5.platform.output.TrickPlay.MODES.PLAY) {
            if (this._uiRefreshCallback) {
                this.logDebug("call _uiRefreshCallback(" + o5.platform.output.TrickPlay.MODES.PLAY + ", " + this.PLAY_SPEED + ")");
                this._uiRefreshCallback(o5.platform.output.TrickPlay.MODES.PLAY, this.PLAY_SPEED);
                this._savedPlayerMode = o5.platform.output.TrickPlay.MODES.PLAY;
            }
        }
        if (callback) {
            callback(true, "Successful");
            return;
        }
    }
    this.logExit();
};

/**
 * Rewinds the content currently playing. Successive calls increase the rate at which the
 * player rewinds. If `setAllowSpeedCycle` was called with `true` and the max. rewind speed
 * is reached, calling this function sets the play rate to the minimum rewind speed. If false, the
 * rewind speed will remain at the top speed.
 * @method rewind
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.TrickPlay.prototype.rewind = function rewind (callback) {
    this.logEntry();
    this._setNewSpeed(false, true, callback);
    this.logExit();
};

/**
 * Fast-forwards the content currently playing. Successive calls increase the rate at which the
 * player fast-forwards. If `setAllowSpeedCycle` was called with `true` and the max. fast-forward speed
 * is reached, calling this function sets the play rate to the minimum fast-forward speed. If false, the
 * fast-forward speed will remain at the top speed.
 * @method fastForward
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.TrickPlay.prototype.fastForward = function fastForward (callback) {
    this.logEntry();
    this._setNewSpeed(true, true, callback);
    this.logExit();
};

/**
 * Slow fast-forward will slow down the fast-forward speed or if in rewind mode will speed up the rewind speed
 * It is called from the keyHandler when rewind key is pressed and it is not in direct mode
 * @method slowFastForward
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.TrickPlay.prototype.slowFastForward = function slowFastForward (callback) {
    this.logEntry();
    if (this._player.speed > this.PLAY_SPEED || this.PAUSE_SPEED > this._player.speed) {
        this._setNewSpeed(false, false, callback);
    } else if (callback) {
        callback(false, "player is not in FF/RW mode");
        return;
    }
    this.logExit();
};

/**
 * Slow rewind will slow down the rewind speed or if in fast forward mode will speed up the fast forward speed
 * It is called from the keyHandler when fast-forward key is pressed and it is not in direct mode
 * @method slowRewind
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.TrickPlay.prototype.slowRewind = function slowRewind (callback) {
    this.logEntry();
    if (this._player.speed > this.PLAY_SPEED || this.PAUSE_SPEED > this._player.speed) {
        this._setNewSpeed(true, false);
    } else if (callback) {
        callback(false, "player is not in FF/RW mode");
        return;
    }
    this.logExit();
};

/**
 * Updates the current playback position with the given time offset in seconds.
 * Negative time offset indicates skip backwards.
 * @method skip
 * @async
 * @param {Number} timeSeconds Time offset relative to current playback position in seconds.
 * Negative value indicates skip backwards. If (current position + time offset) < 0, then
 * set position to 0. If (current position + time offset) > video content duration, then no
 * skipping.
 * @param {Function} [callback] Callback function to be invoked after skip is completed.
 * @param {Boolean} callback.result If true, skip is completed successfully. If false, skip
 * failed.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.TrickPlay.prototype.skip = function skip (timeSeconds, callback) {
    this.logEntry();
    var skipPosition = parseInt(timeSeconds, 10) * 1000 + this._player.position;
    var me = this;
    var _curMode = this.getTrickPlayMode();
    var _curSpeed = this.getSpeed();

    var _setPositionCB = function _setPositionCB (result, reason) {
        if (result) {
            if ((_curMode !== me.getTrickPlayMode()) || (_curSpeed !== me.getSpeed())) {
                if (me._uiRefreshCallback) {
                    me.logDebug("call _uiRefreshCallback(" + me.getTrickPlayMode() + ", " + me.getSpeed() + ")");
                    me._uiRefreshCallback(me.getTrickPlayMode(), me.getSpeed());
                }
            }
        }
        if (callback) {
            callback(result, reason);
            return;
        }
    };

    var _playCB = function _playCB (result, reason) {
        if (result) {
            me._setPosition(skipPosition, _setPositionCB);
        } else if (callback) {
            callback(false, "_player.play() failed");
            return;
        }
    };

    this.play(_playCB);
    this.logExit();
};

/**
 * Returns the current playback mode depending on the speed of the player
 * @method getTrickPlayMode
 * @return {String} Returns the trick play mode, which is one of the `MODES` enumeration.
 */
o5.platform.output.TrickPlay.prototype.getTrickPlayMode = function getTrickPlayMode () {
    this.logDebug("this._player.speed = " + this._player.speed);
    if (this._player.speed < 0) {
        return o5.platform.output.TrickPlay.MODES.RW;
    } else if (this._player.speed === this.PAUSE_SPEED) {
        return o5.platform.output.TrickPlay.MODES.PAUSE;
    } else if (this._player.speed > this.PLAY_SPEED) {
        return o5.platform.output.TrickPlay.MODES.FF;
    } else {
        return o5.platform.output.TrickPlay.MODES.PLAY;
    }
};

/**
 * Returns the current playback speed
 * @method getSpeed
 * @return {Number} Returns the current trick play speed, where 100 being normal playback
 * speed, -200 rewind at 2x etc.
 */
o5.platform.output.TrickPlay.prototype.getSpeed = function getSpeed () {
    return this._player.speed;
};

/**
 * Sets the direct mode flag. When direct mode is true, pressing rewind while in
 * fast-forward will slow down the fast-forward speed and vice versa
 * @method setDirectMode
 * @param {Boolean} flag Direct mode flag to set to
 */
o5.platform.output.TrickPlay.prototype.setDirectMode = function setDirectMode (flag) {
    this._isDirectMode = flag;
};

/**
 * @method keyHandler
 * @deprecated
 * @param {Object} key Key object
 * @return {Boolean} Returns true if key is handled
 */
o5.platform.output.TrickPlay.prototype.keyHandler = function keyHandler (key) {
    this.logEntry();

    var handled = true,
        keys = o5.apps.core.KeyInterceptor.getKeyMap();
    if (this._isAwaitingSpeedChangeEvent) {
        return true;
    }
    switch (key) {
        case keys.KEY_PLAY_PAUSE:
            this.playPause();
            break;
        case keys.KEY_PLAY:
            this.play();
            break;
        case keys.KEY_PAUSE:
            this.pause();
            break;
        case keys.KEY_REW:
            this._setNewSpeed(false, this._isDirectMode);
            break;
        case keys.KEY_FFW:
            this._setNewSpeed(true, this._isDirectMode);
            break;
        case keys.KEY_SKIP_FW:
            this.skip(this._defaultSkipTimeInSeconds);
            break;
        case keys.KEY_SKIP_REW:
            this.skip(-this._defaultSkipTimeInSeconds);
            break;
        default:
            handled = false;
    }

    this.logExit();
    return handled;
};

// uncomment to turn debugging on for TrickPlay object
// o5.log.setAll(o5.platform.output.TrickPlay, true);
