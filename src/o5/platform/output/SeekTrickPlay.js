/**
 * SeekTrickPlay contains the methods that control the Player's
 * playback speed. This allows for the following functionality:
 *
 * - Rewind
 * - Fast-Forward
 * - Play / Pause
 * - Stop
 *
 *
 * It allows Application to registers listeners that listen out for the following events within the Player:
 *
 * - `onPlayStarted`
 * - `onEoc`
 * - `onBoc`
 *
 * Callbacks are used so that the application that calls the TrickPlay class can update
 * its GUI accordingly. It should only be applied to HLS content.
 *
 * @class o5.platform.output.SeekTrickPlay
 * @constructor
 * @param {Object} player The CCOM player object that this SeektrickPlay is
 * associated with and listening to events for.
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.output.SeekTrickPlay = function SeekTrickPlay (player) {
    this.PLAY_SPEED = 100;
    this.PAUSE_SPEED = 0;
    this._player = null;
    this._speedIDX = 0;
    this._SPEED_MULTIPLIERS = [ 200, 400, 800, 1600, 3200 ]; //use 400, 800 etc to keep consistent with TrickPlay.js
    this._allowSpeedCycle = true;
    this._defaultSkipTime = 30; //30 seconds
    this._ffRwInterval = null;
    this._ffRwIntervalMS = 1000; //1 second by default
    this._trickPlayMode = null;
    this._ffRwPosition = 0;
    this._playingListernerCached = null;
    this._trickRate = 0;
    this._tempPlaybackPosition = null;
    this._tempPositionTimeout = null;


    var me = this;
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

    this._playerSetPositionCallback = function _playerSetPositionCallback (result, reason) {};
    this._playerSetSpeedCallback = function _playerSetSpeedCallback (result, reason) {};

    this._playerSetSpeedOKCalback = function _playerSetSpeedOKCalback (e) {};
    this._playerSetSpeedFailedCallback = function _playerSetSpeedFailedCallback (e) {};
    this._playerOnSpeedChangedCallback = function _playerOnSpeedChangedCallback (e) {};
    this._playerOnSpeedChangeFailedCallback = function _playerOnSpeedChangeFailedCallback (e) {};

    this._playerSetPositionOKCallback = function _playerSetPositionOKCallback (e) {};
    this._playerSetPositionFailedCallback = function _playerSetPositionFailedCallback (e) {};
    this._playerOnPositionChangedCallback = function _playerOnPositionChangedCallback (e) {};
    this._playerOnPositionChangeFailedCallback = function _playerOnPositionChangeFailedCallback (e) {};

    // this function can be overwritten by application
    this._uiRefreshCallback = null;

    if (player) {
        this.setPlayer(player);
    } else {
        this.logError("invalid player");
    }

    /**
     * Enumeration of playback modes.
     * @readonly
     * @property {String} MODES
     * @property {String} MODES.PLAY play
     * @property {String} MODES.PAUSE pause
     * @property {String} MODES.FF ff
     * @property {String} MODES.RW rew
     */
    this.MODES = {
        PLAY: "play",
        PAUSE: "pause",
        FF: "ff",
        RW: "rew"
    };
};

/**
 * Sets the playback position to the given time
 * @method _setPosition
 * @private
 * @async
 * @param {Number} position The position to set in milliseconds
 * @param {Function} [callback] Callback function to be invoked for success or failure
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason for the result.
 */
o5.platform.output.SeekTrickPlay.prototype._setPosition = function _setPosition (position, callback) {
    var me = this;
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

    this._player.removeEventListener("setPositionOK", this._playerSetPositionOKCallback);
    this._player.removeEventListener("setPositionFailed", this._playerSetPositionFailedCallback);
    this._player.removeEventListener("onPositionChanged", this._playerOnPositionChangedCallback);
    this._player.removeEventListener("onPositionChangeFailed", this._playerOnPositionChangeFailedCallback);

    this._playerSetPositionCallback = callback;

    this._playerSetPositionOKCallback = function _playerSetPositionOKCallback (e) {
        //if this event is fired, we still need wait for onPositionChanged/onPositionChangeFailed event,
        //so just do nothing for this event
        me.logDebug("================ _playerSetPositionOKCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.handle = " + e.handle);
    };

    this._playerSetPositionFailedCallback = function _playerSetPositionFailedCallback (e) {
        me.logDebug("================ _playerSetPositionFailedCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.handle = " + e.handle);
        me.logDebug("e.error.message = " + e.error.message);

        if (me._playerSetPositionCallback) {
            me._playerSetPositionCallback(false, "setPositionFailed: " + e.error.message);
        }
    };

    this._playerOnPositionChangedCallback = function _playerOnPositionChangedCallback (e) {
        me.logDebug("================ _playerOnPositionChangedCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.positionChangedInfo.newPosition = " + e.positionChangedInfo.newPosition);
        me.logDebug("e.positionChangedInfo.playSessionHandle = " + e.positionChangedInfo.playSessionHandle);
        if (me._playerSetPositionCallback) {
            me._playerSetPositionCallback(true, "successful");
        }
        // CCOM player does not trigger 'onBoc' event when setPostion to 0
        // Manually call _onBocCallback() to fix it
        if (position === 0 && me._onBocCallback) {
            me._onBocCallback();
        }
    };

    this._playerOnPositionChangeFailedCallback = function _playerOnPositionChangeFailedCallback (e) {
        me.logDebug("================ _playerOnPositionChangeFailedCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.positionChangeFailedInfo.playSessionHandle = " + e.positionChangeFailedInfo.playSessionHandle);
        me.logDebug("e.positionChangeFailedInfo.reason = " + e.positionChangeFailedInfo.reason);
        me.logDebug("e.positionChangeFailedInfo.requestedPosition = " + e.positionChangeFailedInfo.requestedPosition);
        if (me._playerSetPositionCallback) {
            me._playerSetPositionCallback(false, "onPositionChangeFailed: " + e.positionChangeFailedInfo.reason);
        }
    };

    this._player.addEventListener("setPositionOK", this._playerSetPositionOKCallback);
    this._player.addEventListener("setPositionFailed", this._playerSetPositionFailedCallback);
    this._player.addEventListener("onPositionChanged", this._playerOnPositionChangedCallback);
    this._player.addEventListener("onPositionChangeFailed", this._playerOnPositionChangeFailedCallback);
    this._player.setPosition(positionCommand);

    this.logExit();
};

/**
 * Sets the playback position to the given time
 * @method _setSpeed
 * @private
 * @async
 * @param {Number} speed The speed to request
 * @param {Function} [callback] Callback function to be invoked for success or failure
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason for the result.
 */
o5.platform.output.SeekTrickPlay.prototype._setSpeed = function _setSpeed (speed, callback) {
    this.logEntry();
    var me = this;
    if (!this._player) {
        if (callback) {
            callback(false, "invalid player");
            return;
        }
        return;
    }

    this._player.removeEventListener("setSpeedOK", this._playerSetSpeedOKCalback);
    this._player.removeEventListener("setSpeedFailed", this._playerSetSpeedFailedCallback);
    this._player.removeEventListener("onSpeedChanged", this._playerOnSpeedChangedCallback);
    this._player.removeEventListener("onSpeedChangeFailed", this._playerOnSpeedChangeFailedCallback);

    this._playerSetSpeedCallback = callback;

    this._playerSetSpeedOKCalback = function _playerSetSpeedOKCalback (e) {
        //if this event is fired, we still need wait for onSpeedChanged/onSpeedChangeFailed event,
        //so just do nothing for this event
        me.logDebug("================ _playerSetSpeedOKCalback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.handle = " + e.handle);
    };

    this._playerSetSpeedFailedCallback = function _playerSetSpeedFailedCallback (e) {
        me.logDebug("================ _playerSetSpeedFailedCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.handle = " + e.handle);
        me.logDebug("e.error.message = " + e.error.message);
        if (me._playerSetSpeedCallback) {
            me._playerSetSpeedCallback(false, "setSpeedFailed: " + e.error.message);
        }
    };

    this._playerOnSpeedChangedCallback = function _playerOnSpeedChangedCallback (e) {
        me.logDebug("================ _playerOnSpeedChangedCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.speedChangedInfo.newSpeed = " + e.speedChangedInfo.newSpeed);
        me.logDebug("e.speedChangedInfo.oldSpeed = " + e.speedChangedInfo.oldSpeed);
        me.logDebug("e.speedChangedInfo.playSessionHandle = " + e.speedChangedInfo.playSessionHandle);
        if (me._playerSetSpeedCallback) {
            me._playerSetSpeedCallback(true, "successful");
        } else {
            me.logError("no callback function found");
        }
    };

    this._playerOnSpeedChangeFailedCallback = function _playerOnSpeedChangeFailedCallback (e) {
        me.logDebug("================ _playerOnSpeedChangeFailedCallback called ================");
        me.logDebug("e.target = " + e.target);
        me.logDebug("e.speedChangeFailedInfo.playSessionHandle = " + e.speedChangeFailedInfo.playSessionHandle);
        me.logDebug("e.speedChangeFailedInfo.reason = " + e.speedChangeFailedInfo.reason);
        me.logDebug("e.speedChangeFailedInfo.requestedSpeed = " + e.speedChangeFailedInfo.requestedSpeed);
        if (me._playerSetSpeedCallback) {
            me._playerSetSpeedCallback(false, "onSpeedChangeFailed: " + e.speedChangeFailedInfo.reason);
        }
    };

    this._player.addEventListener("setSpeedOK", this._playerSetSpeedOKCalback);
    this._player.addEventListener("setSpeedFailed", this._playerSetSpeedFailedCallback);
    this._player.addEventListener("onSpeedChanged", this._playerOnSpeedChangedCallback);
    this._player.addEventListener("onSpeedChangeFailed", this._playerOnSpeedChangeFailedCallback);

    this._player.setSpeed(speed);
    this.logExit();
};

/**
 * Set the player object that is to be used for video playback
 * @method setPlayer
 * @param {Object} player CCOM player object
 */
o5.platform.output.SeekTrickPlay.prototype.setPlayer = function setPlayer (player) {
    this.logEntry();
    this._player = player;
    if (!this._player) {
        this.logError("invalid player");
    }
    this.logExit();
};

/**
 * Returns the player in use for video playback
 * @method getPlayer
 * @return {Object} Returns the player object
 */
o5.platform.output.SeekTrickPlay.prototype.getPlayer = function getPlayer () {
    return this._player;
};

/**
 * Overrides the default behavior for when the player starts
 * playing, the callback function will be called when the player
 * starts playing
 * @method setPlayerPlayingCallback
 * @param {Function} callback Callback function to be invoked when player starts playing
 */
o5.platform.output.SeekTrickPlay.prototype.setPlayerPlayingCallback = function setPlayerPlayingCallback (callback) {
    var me = this;
    if (this._player) {
        this._player.removeEventListener("onPlayStarted", this._onPlayStartedCallback, false);
        this._onPlayStartedCallback = function _onPlayStartedCallback (e) {
            me.logEntry();
            me.logDebug("appplication onPlayStarted event callback");
            me.play();
            if (callback) {
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
o5.platform.output.SeekTrickPlay.prototype.setPlayerAtBeginningCallback = function setPlayerAtBeginningCallback (callback) {
    var me = this;
    if (this._player) {
        this._player.removeEventListener("onBoc", this._onBocCallback, false);
        this._onBocCallback = function _onBocCallback (e) {
            me.logEntry();
            me.logDebug("application onBoc event callback");
            me.play();
            if (callback) {
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
o5.platform.output.SeekTrickPlay.prototype.setPlayerAtEndCallback = function setPlayerAtEndCallback (callback) {
    var me = this;
    if (this._player) {
        this._player.removeEventListener("onEoc", this._onEocCallback, false);
        this._onEocCallback = function _onEocCallback (e) {
            me.logEntry();
            me.logDebug("application onEoc event callback");
            me.pause();
            if (callback) {
                callback(e);
                return;
            }
            me.logExit();
        };
        this._player.addEventListener("onEoc", this._onEocCallback, false);
    }
};

/**
 * Sets the callback function to be invoked for updating the UI.
 * The callback is invoked after calling the following methods:
 * play, pause, playPause, rewind, fastForward, slowFastForward, slowRewind.
 * @method setUIRefreshCallback
 * @param {Function} callback Callback function
 * @param {String} callback.mode Trick play mode, which is one of the `MODES` enumeration.
 * @param {Number} callback.speed Trick play speed
 * @param {Number|undefined} callback.bufferPercentage Video buffer percentage. If 0,
 * video buffer is at 0%. If 100, video buffer is at 100%. If undefined, it is unknown.
 */
o5.platform.output.SeekTrickPlay.prototype.setUIRefreshCallback = function setUIRefreshCallback (callback) {
    this.logEntry();
    this._uiRefreshCallback = callback;
    this.logExit();
};

/**
 * Sets the direct mode flag. When direct mode is true, pressing rewind while in
 * fast-forward will slow down the fast-forward speed and vice versa
 * @method setDirectMode
 * @deprecated Does nothing, don't use.
 * @param {Boolean} flag Unused variable
 */
o5.platform.output.SeekTrickPlay.prototype.setDirectMode = function setDirectMode (flag) {
    this.logEntry();
    this.logExit();
};

/**
 * Sets whether fast-forward and rewind functionality should allow the various
 * speeds to cycle. If true, and fast-forward / rewind is on the maximum speed, the
 * playrate will cycle back to the lowest. If false, subsequent presses of
 * the fast-forward / rewind keys when on maximum speed will have no effect.
 * @method setAllowSpeedCycle
 * @param {Boolean} allow True to allow
 */
o5.platform.output.SeekTrickPlay.prototype.setAllowSpeedCycle = function setAllowSpeedCycle (allow) {
    this.logEntry();
    this._allowSpeedCycle = allow;
    this.logExit();
};

/**
 * Sets the trick play speeds to be used for fast-forward and rewind. If not set, the default
 * is 400, 800, 1600 and 3200 which corresponds to 4x, 8x, 16x and 32x.
 * @method setPlayRateMultipliers
 * @param {Array} mutliplierArray Array of trick play speeds
 */
o5.platform.output.SeekTrickPlay.prototype.setPlayRateMultipliers = function setPlayRateMultipliers (mutliplierArray) {
    this.logEntry();
    this._SPEED_MULTIPLIERS = mutliplierArray;
    this.logExit();
};

/**
 * Sets the default time to skip in the content when the keyHandler
 * receives a request to skip forwards or back.
 * @method setDefaultSkipTime
 * @param {Number} timeSeconds Time to skip in seconds
 */
o5.platform.output.SeekTrickPlay.prototype.setDefaultSkipTime = function setDefaultSkipTime (timeSeconds) {
    this.logEntry();
    this._defaultSkipTime = timeSeconds;
    this.logExit();
};

/**
 * Listener for buffering event. If buffering is complete calls the
 * player playing call back.
 * @method _bufferingListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.output.SeekTrickPlay.prototype._bufferingListener = function _bufferingListener (e) {
    this.logEntry();
    if (e.bufferingInfo && e.bufferingInfo.percentBuffered >= 100) {
        this.play();
    }
    this.logExit();
};

/**
 * Registers relevant listeners to allow the player events callbacks to be executed.
 * @method registerEventListeners
 */
o5.platform.output.SeekTrickPlay.prototype.registerEventListeners = function registerEventListeners () {
    this.logEntry();

    if (this._player) {
        this._player.addEventListener("onPlayStarted", this._onPlayStartedCallback);
        this._player.addEventListener("onBuffering", this._onBufferingCallback);
        this._player.addEventListener("onEoc", this._onEocCallback);
        this._player.addEventListener("onBoc", this._onBocCallback);

        this._player.addEventListener("setSpeedOK", this._playerSetSpeedOKCalback);
        this._player.addEventListener("setSpeedFailed", this._playerSetSpeedFailedCallback);
        this._player.addEventListener("onSpeedChanged", this._playerOnSpeedChangedCallback);
        this._player.addEventListener("onSpeedChangeFailed", this._playerOnSpeedChangeFailedCallback);

        this._player.addEventListener("setPositionOK", this._playerSetPositionOKCallback);
        this._player.addEventListener("setPositionFailed", this._playerSetPositionFailedCallback);
        this._player.addEventListener("onPositionChanged", this._playerOnPositionChangedCallback);
        this._player.addEventListener("onPositionChangeFailed", this._playerOnPositionChangeFailedCallback);
    }
    this.logExit();
};

/**
 * Unregisters the listeners to registered with `registerEventListeners`
 * @method unRegisterEventListeners
 */
o5.platform.output.SeekTrickPlay.prototype.unRegisterEventListeners = function unRegisterEventListeners () {
    this.logEntry();
    if (this._player) {
        this._player.removeEventListener("onPlayStarted", this._onPlayStartedCallback);
        this._player.removeEventListener("onBuffering", this._onBufferingCallback);
        this._player.removeEventListener("onEoc", this._onEocCallback);
        this._player.removeEventListener("onBoc", this._onBocCallback);

        this._player.removeEventListener("setSpeedOK", this._playerSetSpeedOKCalback);
        this._player.removeEventListener("setSpeedFailed", this._playerSetSpeedFailedCallback);
        this._player.removeEventListener("onSpeedChanged", this._playerOnSpeedChangedCallback);
        this._player.removeEventListener("onSpeedChangeFailed", this._playerOnSpeedChangeFailedCallback);

        this._player.removeEventListener("setPositionOK", this._playerSetPositionOKCallback);
        this._player.removeEventListener("setPositionFailed", this._playerSetPositionFailedCallback);
        this._player.removeEventListener("onPositionChanged", this._playerOnPositionChangedCallback);
        this._player.removeEventListener("onPositionChangeFailed", this._playerOnPositionChangeFailedCallback);
    }

    this.logExit();
};

/**
 * @method setFfRwIntervalTime
 * @removed
 */

/**
 * Starts the updating the playback position when in fast forward or rewind mode.
 * @method _startFfRwInterval
 * @private
 * @param {String} mode Trick play mode, which is one of the `MODES` enumeration.
 * @param {Number} rate Playback rate to use for calculating boundaries
 */
o5.platform.output.SeekTrickPlay.prototype._startFfRwInterval = function _startFfRwInterval (mode, rate) {
    this.logEntry();
    this._ffRwInterval = setInterval(function () {
        this._ffRwPosition = this._ffRwPosition + (rate * this._ffRwIntervalMS);
        this._setPosition(this._ffRwPosition);
        if (mode === this.MODES.RW) {
            if (this._ffRwPosition <= 0) {
                //BOC
                this._ffRwPosition = 0;
                this._onBocCallback();
            }
        } else if (this._ffRwPosition >= this._player.duration) {
            //EOC
            this._onEocCallback();
        }
    }.bind(this), this._ffRwIntervalMS);

    this.logExit();
};

/**
 * Stops updating the playback position when in FF/REW mode.
 * @method _stopFfRwInterval
 * @private
 */
o5.platform.output.SeekTrickPlay.prototype._stopFfRwInterval = function _stopFfRwInterval () {
    this.logEntry();
    if (this._ffRwInterval) {
        clearInterval(this._ffRwInterval);
        this._ffRwInterval = null;
    }
    this.logExit();
};

/**
 * Returns playback position.
 * Gets the temporary stored position if in fast forward or rewind mode.
 * @method getPlaybackPosition
 * @return {Number} Returns playback position
 */
o5.platform.output.SeekTrickPlay.prototype.getPlaybackPosition = function getPlaybackPosition ()
{
    this.logEntry(this._trickPlayMode + ' ' + this._ffRwPosition + ' ' + this._player.position);
    
    var position = 0;
    
    if (this._trickPlayMode !== this.MODES.PLAY && this._trickPlayMode !== this.MODES.PAUSE)
    {
        position = this._ffRwPosition / 1000;
    }
    else
    {
	    position = this._player.position / 1000;
	    
	    if (position < 0)
	    {
	        position = 0; // this can happen when the first video frame has not been decoded yet
	    }
    }
    
    this.logExit("playback position: " + position);
    
    return position;
};

/**
 * Returns the updated trick play rate e.g. 4, 8, -4, -8 etc
 * after the given trick play mode has been performed
 * @method _getUpdatedTrickPlayRate
 * @private
 * @param {String} mode Trick play mode, which is one of the `MODES` enumeration.
 * @param {Boolean} forceMode If true will force rewind or fast-forward regardless of direct mode
 * @return {Number} Returns the trick play rate
 */
// Disable ESLint complexity because this API may be refactored in the future to simplify trick play
// eslint-disable-next-line complexity
o5.platform.output.SeekTrickPlay.prototype._getUpdatedTrickPlayRate = function _getUpdatedTrickPlayRate (mode, forceMode) {
    this.logEntry();
    var multiplier; //will be -1 if rewind, 1 if fast-forward

    this.logDebug("this.getTrickPlayMode() = " + this.getTrickPlayMode());

    if (mode === this.MODES.RW || mode === this.MODES.FF) {
        if (!forceMode && ((this.getTrickPlayMode() === this.MODES.RW && mode === this.MODES.FF) ||
                (this.getTrickPlayMode() === this.MODES.FF && mode === this.MODES.RW))) {
            if (this._speedIDX === 1) {
                this.logExit("0");
                return 1;
            } else if (this._speedIDX > 1) {
                this._speedIDX--;
            }
            multiplier = (this.getTrickPlayMode() === this.MODES.RW) ? -1 : 1;
        } else if (this.getTrickPlayMode() === this.MODES.RW && mode === this.MODES.FF) {
            if (this._speedIDX === 1) {
                this._trickRate = 100;
                this.logExit("1");
                return 1;
            } else if (this._speedIDX > 1) {
                this._speedIDX = this._speedIDX - 1;
            }
            multiplier = -1;
        } else if (this.getTrickPlayMode() === this.MODES.FF && mode === this.MODES.RW) {
            if (this._speedIDX === 1) {
                this._trickRate = 100;
                this.logExit("2");
                return 1;
            } else if (this._speedIDX > 1) {
                this._speedIDX = this._speedIDX - 1;
            }
            multiplier = 1;
        } else {
            if (this._trickPlayMode !== mode) {
                this._speedIDX = 1;
            } else if (this._speedIDX < this._SPEED_MULTIPLIERS.length) {
                this._speedIDX++;
            } else if (this._allowSpeedCycle) {
                this._speedIDX = 1;
                this._trickRate = 100;
                this.logExit("3");
                return 1;
            }
            multiplier = (mode === this.MODES.RW) ? -1 : 1;
        }
        this._trickRate = this._SPEED_MULTIPLIERS[this._speedIDX - 1] * multiplier;
        this.logExit("4");
        return this._trickRate / this.PLAY_SPEED;
    } else if (mode === this.MODES.PLAY) {
        this._trickRate = 100;
        this.logExit("5");
        return 1;
    } else {
        this._trickRate = 0;
        this.logExit("6");
        return 0;
    }
};

/**
 * Toggles the video playback between play and pause
 * @method playPause
 * @async
 * @param {Boolean} dedicated Denotes if dedicated play button was pressed (not play / pause)
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.SeekTrickPlay.prototype.playPause = function playPause (dedicated, callback) {
    this.logEntry();

    if (this.getTrickPlayMode() === this.MODES.PLAY) {
        this.pause(callback);
    } else {
        this.play(callback);
    }
    this.logExit();
};

/**
 * Pauses the video playback and calls the function registered by `setUIRefreshCallback`
 * @method pause
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.SeekTrickPlay.prototype.pause = function pause (callback) {
    this.logEntry();
    this._stopFfRwInterval();
    this._speedIDX = 0;
    var me = this;
    var _setSpeedCB = function _setSpeedCB (result, reason) {
        me.logDebug("================== SeekTrickPlay.prototype.pause._setSpeedCB called, result = " + result + " =======================");
        if (result) {
            if (me._uiRefreshCallback) {
                me.logDebug("call _uiRefreshCallback(" + me.MODES.PAUSE + ", " + me.PAUSE_SPEED + ")");
                me._uiRefreshCallback(me.MODES.PAUSE, me.PAUSE_SPEED);
            }
            me._trickPlayMode = me.MODES.PAUSE;
            me._trickRate = me.PAUSE_SPEED;
            if (callback) {
                callback(true, "successful");
                return;
            }
        } else if (callback) {
            callback(false, reason);
            return;
        }
    };

    if (this._player.speed !== this.PAUSE_SPEED) {
        this._setSpeed(this.PAUSE_SPEED, _setSpeedCB);
    } else {
        if (this._trickPlayMode !== this.MODES.PAUSE) {
            if (this._uiRefreshCallback) {
                this.logDebug("call _uiRefreshCallback(" + this.MODES.PAUSE + ", " + this.PAUSE_SPEED + ")");
                this._uiRefreshCallback(this.MODES.PAUSE, this.PAUSE_SPEED);
            }
            this._trickPlayMode = this.MODES.PAUSE;
        }
        if (callback) {
            this.logExit();
            callback(true, "successful");
            return;
        }
    }

    this.logExit();
};

/**
 * Changes the player to play mode.
 * @method play
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result  True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.SeekTrickPlay.prototype.play = function play (callback) {
    this.logEntry();
    this._ffRwPosition = this._player.position;
    this._stopFfRwInterval();
    var me = this;

    var _setPositionCB = function _setPositionCB (result, reason) {
        me.logDebug("================ _setPositionCB called ================");
        if (result) {
            me._stopFfRwInterval();
            me._speedIDX = 0;
            if (me._uiRefreshCallback) {
                me.logDebug("call _uiRefreshCallback(" + me.MODES.PLAY + ", " + me.PLAY_SPEED + ")");
                me._uiRefreshCallback(me.MODES.PLAY, me.PLAY_SPEED);
            }
            me._trickPlayMode = me.MODES.PLAY;
        } else if (callback) {
            callback(false, reason);
            return;
        }
    };

    var _setSpeedCB = function _setSpeedCB (result, reason) {
        me.logDebug("================ _setSpeedCB called ================");
        if (result) {
            me.logDebug("_speedIDX = " + me._speedIDX);
            if (me._speedIDX !== 0) {
            	me._stopFfRwInterval();
            	me._speedIDX = 0;
            	me._trickPlayMode = me.MODES.PLAY;
//                me._setPosition(me._ffRwPosition, _setPositionCB);
            }/* else {*/
                if (me._uiRefreshCallback) {
                    me.logDebug("call _uiRefreshCallback(" + me.MODES.PLAY + ", " + me.PLAY_SPEED + ")");
                    me._uiRefreshCallback(me.MODES.PLAY, me.PLAY_SPEED);
                }
                me._trickPlayMode = me.MODES.PLAY;
//            }
        }
        if (callback) {
            callback(result, reason);
            return;
        }
    };

    if (this._player.speed !== this.PLAY_SPEED) {
        this._setSpeed(this.PLAY_SPEED, _setSpeedCB); //need to play before we set position for HLS
    } else {
        this.logDebug("_player.speed = " + this.PLAY_SPEED);
        if (this._trickPlayMode !== this.MODES.PLAY) {
            if (this._uiRefreshCallback) {
                this.logDebug("call _uiRefreshCallback(" + this.MODES.PAUSE + ", " + this.PAUSE_SPEED + ")");
                this._uiRefreshCallback(this.MODES.PLAY, this.PLAY_SPEED);
            }
            this._trickPlayMode = this.MODES.PLAY;
        }
        if (callback) {
            this.logExit();
            callback(true, "successful");
            return;
        }
    }
    this.logExit();
};

/**
 * Performs either fast forward or rewind trick play
 * @method _rwFfTrickPlay
 * @private
 * @async
 * @param {String} mode Trick play mode, which is one of the `MODES` enumeration.
 * @param {Boolean} forceMode If true will force rewind or fast-forward regardless of direct mode
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result  True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.SeekTrickPlay.prototype._rwFfTrickPlay = function _rwFfTrickPlay (mode, forceMode, callback) {
    this.logEntry();
    var rate = this._getUpdatedTrickPlayRate(mode, forceMode);
    var me = this;
    this.logDebug("rate=" + rate);
    this.logDebug("this._speedIDX = " + this._speedIDX);

    var _playCB = function _playCB (result, reason) {
        me.logDebug("===================== _rwFfTrickPlay _playCB ========================");
        if (result) {
            if (me._uiRefreshCallback) {
                me.logDebug("call _uiRefreshCallback(" + me._trickPlayMode + ", " + rate * me.PLAY_SPEED + ")");
                me._uiRefreshCallback(me._trickPlayMode, rate * me.PLAY_SPEED);
            }
            if (callback) {
                callback(true, "successful");
                return;
            }
        } else if (callback) {
            callback(false, reason);
            return;
        }
        me.logDebug("===================== _rwFfTrickPlay _playCB Done ========================");
    };

    var _setSpeedCB = function _setSpeedCB (result, reason) {
        me.logDebug("===================== _rwFfTrickPlay _setSpeedCB ========================");
        if (result) {
            if (rate > 0) {
                me._trickPlayMode = me.MODES.FF;
            } else {
                me._trickPlayMode = me.MODES.RW;
            }
            me._startFfRwInterval(mode, rate);
            if (me._uiRefreshCallback) {
                me.logDebug("call _uiRefreshCallback(" + me._trickPlayMode + ", " + rate * me.PLAY_SPEED + ")");
                me._uiRefreshCallback(me._trickPlayMode, rate * me.PLAY_SPEED);
            }
        }
        if (callback) {
            callback(result, reason);
            return;
        }
        me.logDebug("===================== _rwFfTrickPlay _setSpeedCB Done ========================");
    };

    if (rate === 1) {
        this.play(_playCB);
    } else {
        this._ffRwPosition = this._player.position;
        this._stopFfRwInterval();

        if (this._speedIDX === 1 && (mode === this.MODES.PLAY || mode === this.MODES.PAUSE)) {
            this._setSpeed(rate * this.PLAY_SPEED, _setSpeedCB);
        } else {
            if (rate > 0) {
                this._trickPlayMode = this.MODES.FF;
            } else {
                this._trickPlayMode = this.MODES.RW;
            }
            this._startFfRwInterval(mode, rate);

            if (this._uiRefreshCallback) {
                this.logDebug("call _uiRefreshCallback(" + this._trickPlayMode + ", " + rate * this.PLAY_SPEED + ")");
                this._uiRefreshCallback(this._trickPlayMode, rate * this.PLAY_SPEED);
            }

            if (callback) {
                callback(true, "successful");
                return;
            }
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
o5.platform.output.SeekTrickPlay.prototype.rewind = function rewind (callback) {
    this.logEntry();
    this._rwFfTrickPlay(this.MODES.RW, true, callback);
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
o5.platform.output.SeekTrickPlay.prototype.fastForward = function fastForward (callback) {
    this.logEntry();
    this._rwFfTrickPlay(this.MODES.FF, true, callback);
    this.logExit();
};

/**
 * Slow fast-forward will slow down the fast-forward speed, or if in rewind mode, will increase the rewind speed.
 * It is called from the keyHandler when rewind key is pressed and it is not in direct mode
 * @method slowFastForward
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result  True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.SeekTrickPlay.prototype.slowFastForward = function slowFastForward (callback) {
    this.logEntry();
    this._rwFfTrickPlay(this.MODES.RW, false, callback);
    this.logExit();
};

/**
 * Slow rewind will slow down the rewind speed, or if in fast forward mode, will increase the fast forward speed.
 * It is called from the keyHandler when fast-forward key is pressed and it is not in direct mode
 * @method slowRewind
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result  True if successful or false for failure.
 * @param {String} callback.reason Reason that fails this request
 */
o5.platform.output.SeekTrickPlay.prototype.slowRewind = function slowRewind (callback) {
    this.logEntry();
    this._rwFfTrickPlay(this.MODES.FF, false, callback);
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
o5.platform.output.SeekTrickPlay.prototype.skip = function skip (timeSeconds, callback) {
    this.logEntry();
    var me = this,
        playbackPosition;

    timeSeconds = parseInt(timeSeconds, 10);
    this.logDebug("will skip timeSeconds = " + timeSeconds);

    var _setPositionCB = function _setPositionCB (result, reason) {
        if (result) {
            if (me._tempPositionTimeout) {
                clearTimeout(me._tempPositionTimeout);
            }
            me._tempPositionTimeout = setTimeout(function () {
                me._tempPlaybackPosition = null;
            }, 1000);

            if (callback) {
                callback(true, "successful");
                return;
            }
        } else {
            me.logError("_setPosition failed: " + reason);
            if (callback) {
                callback(false, "_setPosition failed: " + reason);
                return;
            }
        }
    };

    var _playCB = function _playCB (result, reason) {
        // _uiRefreshCallback() could have been called in play() prior to _playCB()
        if (result) {
            if (me._tempPlaybackPosition) {
                playbackPosition = me._tempPlaybackPosition + timeSeconds * 1000;
            } else {
                playbackPosition = me._player.position + (timeSeconds * 1000);
            }

            me.logDebug("player.duration is " + me._player.duration);
            me.logDebug("new playbackPosition (in seconds) is " + playbackPosition / 1000);

            if (playbackPosition < 0) {
                playbackPosition = 0;
            }

            if (playbackPosition < me._player.duration) {
                me._tempPlaybackPosition = playbackPosition;
                me._setPosition(playbackPosition, _setPositionCB);
            }

        } else if (callback) {
            callback(false, "play error" + reason);
            return;
        }
    };

    this.play(_playCB);
    this.logExit();
};

/**
 * Returns the current playback mode depending on the playrate of the player
 * @method getTrickPlayMode
 * @return {String} Returns the trick play mode, which is one of the `MODES` enumeration.
 */
o5.platform.output.SeekTrickPlay.prototype.getTrickPlayMode = function getTrickPlayMode () {
    return this._trickPlayMode;
};

/**
 * Returns the trick play rate which will be the playing speed, pause speed or
 * one of the Play Rate Multipliers. Negative values indicate rewind speed
 * @method getTrickPlayRate
 * @return {Number} Returns the trick play rate or null if player object is not set.
 */
o5.platform.output.SeekTrickPlay.prototype.getTrickPlayRate = function getTrickPlayRate () {
    if (this._player) {
        return this._player.speed;
    } else {
        this.logError("invalid player");
        return null;
    }
};

/**
 * @method keyHandler
 * @deprecated
 * @param {Object} key Key object
 * @return {Boolean} Returns true if key is handled
 */
o5.platform.output.SeekTrickPlay.prototype.keyHandler = function keyHandler (key) {
    this.logEntry();

    var handled = true,
        contentLength = this._player && (this._player.duration / 1000),
        keys = o5.apps.core.KeyInterceptor.getKeyMap();
    switch (key) {
        case keys.KEY_PLAY:
            this.play();
            break;
        case keys.KEY_PLAY_PAUSE:
            this.playPause(true);
            break;
        case keys.KEY_PAUSE:
            this.pause();
            break;
        case keys.KEY_REW:
            if (contentLength > 0) {
                this.rewind();
            }
            break;
        case keys.KEY_FFW:
            if (contentLength > 0) {
                this.fastForward();
            }
            break;
        case keys.KEY_SKIP_FW:
            this.skip(this._defaultSkipTime);
            break;
        case keys.KEY_SKIP_REW:
            this.skip(-this._defaultSkipTime);
            break;
        default:
            handled = false;
    }

    this.logExit();
    return handled;
};

// uncomment to turn debugging on for SeekTrickPlay object
// o5.log.setAll(o5.platform.output.SeekTrickPlay, true);
