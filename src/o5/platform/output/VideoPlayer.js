/**
 * A wrapper class to maintain the components required for video playback
 * including, tuner, tracks and trick play.
 * This class search for destUri (otv-video-destination) from videoTag and uses that to
 * create the video player instance for VideoPlayer object. If destUri is not found, then
 * it internally creates destUri="display://"+counter, where counter starts from 0.
 * The application is responsible for setting the video layer z-order and video window size and position.
 * The video player instance are created with the following properties:
 *
 *        priority: High (1st instance), medium (all others)
 *        audio: Enable (1st instance), disable (all others)
 *        review buffer: Enable (1st instance), disable (all others)
 *
 * @class o5.platform.output.VideoPlayer
 * @constructor
 * @param {Object} [videoTag] Video tag object
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */
// Disable ESLint complexity to avoid regression.
// eslint-disable-next-line complexity
o5.platform.output.VideoPlayer = function VideoPlayer (videoTag) {
    var me = this,
        destUri,
        playerManager = CCOM.PlayerManager,
        instanceResult,
        res;

    if (videoTag && videoTag instanceof o5.gui.controls.Video) {
        // videoTag is <o5-video>
        destUri = videoTag.getHref();
        if (!destUri) {
            destUri = "display://" + o5.platform.output.VideoPlayer._instanceCount;
            videoTag._innerElement.setAttribute("otv-video-destination", destUri);
            videoTag.setHref(destUri);
        }
    } else if (videoTag && videoTag instanceof HTMLVideoElement) {
        // videoTag is <video>
        destUri = videoTag.getAttribute("otv-video-destination");
        // Check for empty string or invalid destUri
        if (!destUri) {
            destUri = "display://" + o5.platform.output.VideoPlayer._instanceCount;
            videoTag.setAttribute("otv-video-destination", destUri);
        }
    } else {
        // No videoTag passed in, use default counter
        destUri = "display://" + o5.platform.output.VideoPlayer._instanceCount;
    }

    this._playerObj = videoTag || null;

    this._playerPlayingListeners = [];
    this._playerBufferingListeners = [];
    this._lostResourcesListeners = [];
    this._playerPmtUpdateListeners = [];

    /*
     * Get player instance with following parameters:
     * priority: High (1st instance), medium (all others)
     * audio: Play audio (1st instance), mute audio (all others)
     * review buffer: Enable (1st instance), disable (all others)
     */
    this._priority = o5.platform.output.VideoPlayer._instanceCount === 0 ?
        playerManager.INSTANCE_PRIORITY_HIGH : playerManager.INSTANCE_PRIORITY_MEDIUM;
    this._reviewBufferState = o5.platform.output.VideoPlayer._instanceCount === 0 ? true : false;
    this._audioStatus = o5.platform.output.VideoPlayer._instanceCount === 0 ?
        playerManager.AUD_OUT_VAL_TRUE : playerManager.AUD_OUT_VAL_FALSE;

    instanceResult = playerManager.getInstance({
        destUri: destUri,
        priority: this._priority
    });
    // Increment _instanceCount even if destUri is given in videoTag so that
    // _priority, _reviewBufferState, _audioStatus can move forward from _instanceCount === 0
    o5.platform.output.VideoPlayer._instanceCount++;

    if (instanceResult.instance) {
        this._player = instanceResult.instance;
        this.logDebug("Player instance obtained from PlayerManager");

        // Short-cut to get instanceHandle instead of getting it from onPlayerInstanceCreated event callback
        if (this._player.instanceHandle !== undefined) {
            playerManager.setReviewBufferState(this._player.instanceHandle, this._reviewBufferState);
            res = playerManager.setAudioStatus(this._player.instanceHandle, this._audioStatus);
            if (res.error) {
                this._audioStatus = playerManager.AUD_OUT_VAL_FALSE;
                this.logError("setAudioStatus() failed! Disable audio.");
            }
        } else {
            this.logError("Failed to get player instance handle! " + this._player.instanceHandle);
        }
        // Application will take care of z-order, opacity, and video window size
    } else {
        this._player = null;
        this.logError("Failed to get player instance!");
    }


    this.tuner = new o5.platform.output.Tuner(this._player);

    this.trickPlay = new o5.platform.output.TrickPlay(this._player);

    this.seekTrickPlay = new o5.platform.output.SeekTrickPlay(this._player);

    this.tracks = new o5.platform.output.Tracks(this._player);

    this.setTrickPlayDirectMode(true);

    if (this._player) {
        // register internal listeners
        this._player.addEventListener("onPlayStarted", function (e) {
            me._playStartedListener(e);
        });
        this._player.addEventListener("onBuffering", function (e) {
            me._bufferingListener(e);
        });
        this._player.addEventListener("onPlayError", function (e) {
            me._playErrorListener(e);
        });
    }
};

/**
 * Internal counter of player instances
 * @ignore
 */
o5.platform.output.VideoPlayer._instanceCount = 0;

/**
 * Video player instance priority. The lower the priority, the more likely it is to lose its
 * resources (i.e. lost of audio, review buffer, etc.) when the device is overwhelmed with
 * multiple video players playing at the same time.
 * Value is one of CCOM.PlayerManager.INSTANCE_PRIORITY_HIGH,
 * CCOM.PlayerManager.INSTANCE_PRIORITY_MEDIUM, or CCOM.PlayerManager.INSTANCE_PRIORITY_LOW.
 * @property {Number} playerInstancePriority
 */
Object.defineProperty(o5.platform.output.VideoPlayer.prototype, "playerInstancePriority", {
    get: function get () {
        return this._priority;
    },
    set: function set (newPriority) {
        this._priority = newPriority;
        // async
        CCOM.PlayerManager.setPlayerInstancePriorities([{
            instanceHandle: this._player.instanceHandle,
            priority: this._priority
        }]);
    }
});

/**
 * Video player audio on/off property.
 * @property {Boolean} audioEnabled
 */
Object.defineProperty(o5.platform.output.VideoPlayer.prototype, "audioEnabled", {
    get: function get () {
        if (this._audioStatus === CCOM.PlayerManager.AUD_OUT_VAL_TRUE) {
            return true;
        } else {
            return false;
        }
    },
    set: function set (newAudioEnabled) {
        var oldValue = this._audioStatus,
            res;
        if (newAudioEnabled) {
            this._audioStatus = CCOM.PlayerManager.AUD_OUT_VAL_TRUE;
        } else {
            this._audioStatus = CCOM.PlayerManager.AUD_OUT_VAL_FALSE;
        }
        res = CCOM.PlayerManager.setAudioStatus(this._player.instanceHandle, this._audioStatus);
        if (res.error) {
            this._audioStatus = oldValue;
            this.logError("setAudioStatus() failed!");
        }
    }
});

/**
 * Video player review buffer on/off property.
 * @property {Boolean} reviewBufferEnabled
 */
Object.defineProperty(o5.platform.output.VideoPlayer.prototype, "reviewBufferEnabled", {
    get: function get () {
        return this._reviewBufferState;
    },
    set: function set (newReviewBufferEnabled) {
        this._reviewBufferState = newReviewBufferEnabled;
        // async
        CCOM.PlayerManager.setReviewBufferState(this._player.instanceHandle, this._reviewBufferState);
    }
});

/**
 * Swap the priority, audio state, and review buffer state between the two video player objects.
 * @method swapVideo
 * @static
 * @param {Object} videoPlayer1 Video player object 1
 * @param {Object} videoPlayer2 Video player object 2
 */
o5.platform.output.VideoPlayer.swapVideo = function (videoPlayer1, videoPlayer2) {
    if (videoPlayer1 && videoPlayer2) {
        var old1, old2;

        old1 = videoPlayer1.playerInstancePriority;
        videoPlayer1.playerInstancePriority = videoPlayer2.playerInstancePriority;
        videoPlayer2.playerInstancePriority = old1;

        if (videoPlayer1.audioEnabled) {
            old1 = videoPlayer1.audioEnabled;
            videoPlayer1.audioEnabled = videoPlayer2.audioEnabled;
            videoPlayer2.audioEnabled = old1;
        } else {
            old2 = videoPlayer2.audioEnabled;
            videoPlayer2.audioEnabled = videoPlayer1.audioEnabled;
            videoPlayer1.audioEnabled = old2;
        }

        if (videoPlayer1.reviewBufferEnabled) {
            old1 = videoPlayer1.reviewBufferEnabled;
            videoPlayer1.reviewBufferEnabled = videoPlayer2.reviewBufferEnabled;
            videoPlayer2.reviewBufferEnabled = old1;
        } else {
            old2 = videoPlayer2.reviewBufferEnabled;
            videoPlayer2.reviewBufferEnabled = videoPlayer1.reviewBufferEnabled;
            videoPlayer1.reviewBufferEnabled = old2;
        }
    }
};

/**
 * Adds a listener to the supplied listener cache, if not already present.
 * @method _addListener
 * @private
 * @param {Array} cache An array of functions representing the listeners
 * @param {Function} listener A function which represents the listener
 */
o5.platform.output.VideoPlayer.prototype._addListener = function _addListener (cache, listener) {
    if (cache.indexOf(listener) !== -1) {
        this.logWarning("Listener already registered.");
    } else {
        cache.push(listener);
    }
};

/**
 * Removes a listener from the supplied listener cache.
 * @method _removeListener
 * @private
 * @param {Array} cache An array of functions representing the listeners
 * @param {Function} listener A function which represents the listener
 */
o5.platform.output.VideoPlayer.prototype._removeListener = function _removeListener (cache, listener) {
    var i, end = cache.length;
    for (i = 0; i < end; i++) {
        if (cache[i] === listener) {
            this.logDebug("listener removed");
            cache.splice(i, 1);
            break;
        }
    }
};

/**
 * Calls all listeners in the supplier array of listener functions.
 * @method _callListeners
 * @private
 * @param {Array} listeners An array of functions representing the listeners
 * @param {Object} e CCOM Player event payload (see CCOM documentation)
 */
o5.platform.output.VideoPlayer.prototype._callListeners = function _callListeners (listeners, e) {
    this.logEntry();
    var i, end = listeners.length;
    for (i = 0; i < end; i++) {
        listeners[i](e);
    }
    this.logExit();
};

/**
 * Listens for buffering event and fires either buffering callback
 * or player playing call back depending no whether the buffering
 * has finished.
 * @method _bufferingListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.output.VideoPlayer.prototype._bufferingListener = function _bufferingListener (e) {
    this.logEntry();
    if (e.bufferingInfo.percentBuffered < 100) {
        this._callListeners(this._playerBufferingListeners, e);
    } else {
        this._callListeners(this._playerPlayingListeners, e);
    }
    this.logExit();
};

/**
 * Listens for playing event and calls the play playing callback.
 * @method _playStartedListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.output.VideoPlayer.prototype._playStartedListener = function _playStartedListener (e) {
    this.logEntry();
    this._callListeners(this._playerPlayingListeners, e);
    this.logExit();
};

/**
 * Called upon the onPlayError event being fired
 * @method _playErrorListener
 * @private
 * @param {Object} e The event object that is returned
 */
o5.platform.output.VideoPlayer.prototype._playErrorListener = function _playErrorListener (e) {
    this.logEntry();
    if (e.contentErrorInfo.reason === this._player.CONTENT_ERROR_REASON_RESOURCES_LOST) {
        this._callListeners(this._lostResourcesListeners, e);
    } else if (e.contentErrorInfo.reason === this._player.CONTENT_ERROR_REASON_PMT_UPDATED) {
        this._callListeners(this._playerPmtUpdateListeners, e);
    }
    this.logExit();
};

/**
 * Returns the CCOM player object used for video playback by this video player.
 * @method getPlayer
 * @return {Object} Returns the CCOM player instance
 */
o5.platform.output.VideoPlayer.prototype.getPlayer = function getPlayer () {
    return this._player;
};

/**
 * Returns the CCOM player object and instance.
 * @method getPlayerInstanceObj
 * @return {Object} Returns object
 */
o5.platform.output.VideoPlayer.prototype.getPlayerInstanceObj = function getPlayerInstanceObj () {
    return {
        playerInstance: this._player,
        playerObj: this._playerObj || null
    };
};

/**
 * @method getSource
 * @removed
 */

/**
 * Returns the position (in seconds) that the player is currently at in the stream.
 * Use `getReviewBufferPlaybackPosition` or `getReviewBufferInfo` for review buffer
 * @method getPlaybackPosition
 * @return {Number} Returns the current playback position in seconds
 */
o5.platform.output.VideoPlayer.prototype.getPlaybackPosition = function getPlaybackPosition () {
    var pos = this._player.position / 1000;
    this.logDebug("_player.position: " + pos + ", timeStamp: " + new Date().getTime());

    return pos;
};

/**
 * Returns an object consisting of start time, end time and current time for the player buffer.
 * The values of each property are real time values in milliseconds
 * @method getReviewBufferInfo
 * @return {Object} Returns the review buffer info object with the following properties:
 *
 *        startPosition {Number} Start position
 *        endPosition {Number} End position
 *        currentPosition {Number} Current position
 *        contentLength {Number} Content length
 */
o5.platform.output.VideoPlayer.prototype.getReviewBufferInfo = function getReviewBufferInfo () {
    this.logEntry();
    var realTimePosition,
        contentLength,
        retObject;

    // only query CCOM Player 'realTimePosition' property if review buffer is started.
    // When review buffer is not started, the 'realTimePosition' always returns 0 values per CCOM docs
    realTimePosition = this._player.realTimePosition;

    if (realTimePosition) {
        contentLength = (realTimePosition.endPosition - realTimePosition.startPosition) * 1000;
        this.logExit(contentLength);
        retObject = {
            startPosition: realTimePosition.startPosition * 1000,
            endPosition: realTimePosition.endPosition * 1000,
            currentPosition: realTimePosition.currentPosition * 1000,
            contentLength: contentLength
        };
    } else {
        this.logWarning("Not able to get 'realTimePosition' from CCOM.Player");
        retObject = {
            startPosition: 0,
            endPosition: 0,
            currentPosition: 0,
            contentLength: 0
        };
    }
    return retObject;
};

/**
 * Returns a real time value for the starting time of the review buffer
 * @method getReviewBufferStartTime
 * @return {Number} Returns the starting time of the review buffer
 */
o5.platform.output.VideoPlayer.prototype.getReviewBufferStartTime = function getReviewBufferStartTime () {
    this.logDebug();
    return this._player.realTimePosition && this._player.realTimePosition.startPosition ? this._player.realTimePosition.startPosition * 1000 : 0;
};

/**
 * Returns a real time value for the ending time of the review buffer
 * @method getReviewBufferEndTime
 * @return {Number} Returns the ending time of the review buffer
 */
o5.platform.output.VideoPlayer.prototype.getReviewBufferEndTime = function getReviewBufferEndTime () {
    this.logDebug();
    return this._player.realTimePosition && this._player.realTimePosition.endPosition ? this._player.realTimePosition.endPosition * 1000 : 0;
};

/**
 * Returns a real time value for the current playback position of the review buffer
 * @method getReviewBufferPlaybackPosition
 * @return {Number} Returns the current playback position of the review buffer
 */
o5.platform.output.VideoPlayer.prototype.getReviewBufferPlaybackPosition = function getReviewBufferPlaybackPosition () {
    this.logDebug();
    return this._player.realTimePosition && this._player.realTimePosition.currentPosition ? this.getReviewBufferStartTime() + (this._player.realTimePosition.currentPosition * 1000) : 0;
};

/**
 * Sets the position of playback in seconds for the
 * current stream
 * @method setPlaybackPosition
 * @param {Number} position Position in seconds
 */
o5.platform.output.VideoPlayer.prototype.setPlaybackPosition = function setPlaybackPosition (position) {
    this.logEntry();
    var timeMilliSeconds = position * 1000,
        positionCommand;
    positionCommand = {
        whence: this._player.SEEK_SET,
        type: this._player.POSITION_TYPE_TIME_BASED,
        timePosition: timeMilliSeconds
    };
    this._player.setPosition(positionCommand);
    this.logExit();
};

/**
 * Returns the content length (in seconds) of the current stream.
 * Use `getReviewBufferInfo` to find the review buffer length.
 * @method getContentLength
 * @return {Number} Returns the content length in seconds
 */
o5.platform.output.VideoPlayer.prototype.getContentLength = function getContentLength () {
    var contentLength = this._player.duration / 1000;
    this.logDebug(contentLength);
    return contentLength;
};

/**
 * Returns the current stream for the player
 * @method getCurrentStream
 * @return {Object} Returns the stream object with the following properties:
 *
 *        uri {String} Source URI
 *        pids {Array} An array of available streams
 *        pidsAvailable {Boolean} True if `pids` property is available
 */
o5.platform.output.VideoPlayer.prototype.getCurrentStream = function getCurrentStream () {
    this.logEntry();
    var stream = {};
    stream.uri = this._player.sourceUri;
    stream.pids = this._player.availableStreams;
    stream.pidsAvailable = stream.pids ? true : false;
    this.logExit();
    return stream;
};

/**
 * Registers the given function to be called when the player has
 * connected to the steam
 * @method registerPlayerConnectedListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerPlayerConnectedListener = function registerPlayerConnectedListener (listener) {
    this.logDebug();
    this._player.addEventListener("onPlayStarted", listener);
};

/**
 * Registers the given function to be called when the player has
 * failed to connect to a stream
 * @method registerPlayerConnectFailedListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerPlayerConnectFailedListener = function registerPlayerConnectFailedListener (listener) {
    this.logEntry();
    this._player.addEventListener("onPlayStartFailed", listener);
    this.logExit();
};

/**
 * Registers the given function to be called when the new content
 * has started playing.
 * @method registerPlayerPlayingListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerPlayerPlayingListener = function registerPlayerPlayingListener (listener) {
    this.logDebug();
    this._addListener(this._playerPlayingListeners, listener);
};

/**
 * Registers the given function to be called if the player fails
 * to play the stream
 * @method registerIFrameDecodedListener
 * @deprecated
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerIFrameDecodedListener = function registerIFrameDecodedListener (listener) {
    this.logDeprecated();
};

/**
 * Registers the given function to be called if the player fails
 * to play the stream
 * @method registerPlayerPlayFailedListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerPlayerPlayFailedListener = function registerPlayerPlayFailedListener (listener) {
    this.logDebug();
    this._player.addEventListener("onPlayError", listener);
};

/**
 * Registers the given function to be called when the content is being
 * buffered.
 * @method registerPlayerBufferingListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerPlayerBufferingListener = function registerPlayerBufferingListener (listener) {
    this.logDebug();
    this._addListener(this._playerBufferingListeners, listener);
};

/**
 * Registers the given function to be called when the end of the content has been reached.
 * @method registerPlayerReachedEndListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerPlayerReachedEndListener = function registerPlayerReachedEndListener (listener) {
    this.logDebug();
    this._player.addEventListener("onEoc", listener);
};

/**
 * Registers the given function to be called when the player reaches the
 * beginning of the content.
 * @method registerPlayerReachedStartListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerPlayerReachedStartListener = function registerPlayerReachedStartListener (listener) {
    this.logDebug();
    this._player.addEventListener("onBoc", listener);
};

/**
 * Registers the given function to be called when the player has rejoined
 * the live content
 * @method registerCaughtUptoLiveListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerCaughtUptoLiveListener = function registerCaughtUptoLiveListener (listener) {
    this.logDebug();
    this._player.addEventListener("onCaughtUptoLive", listener);
};

/**
 * Registers the given function to be called when the player position
 * passes from one event boundary to another
 * @method registerEventBoundaryChangedListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerEventBoundaryChangedListener = function registerEventBoundaryChangedListener (listener) {
    this.logDebug();
    this._player.addEventListener("onEventBoundaryChanged", listener);
};

/**
 * Unregisters the given function to not fire when a new stream has been started.
 * @method unregisterPlayerConnectedListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterPlayerConnectedListener = function unregisterPlayerConnectedListener (listener) {
    this._player.removeEventListener("onPlayStarted", listener);
};

/**
 * Unregisters the given function to not fire when there is a
 * failure connecting to the requested stream.
 * @method unregisterPlayerConnectFailedListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterPlayerConnectFailedListener = function unregisterPlayerConnectFailedListener (listener) {
    this._player.removeEventListener("onPlayStartFailed", listener);
};

/**
 * Unregisters the given function to not fire when the new content
 * has started playing.
 * @method unregisterPlayerPlayingListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterPlayerPlayingListener = function unregisterPlayerPlayingListener (listener) {
    this._removeListener(this._playerPlayingListeners, listener);
};

/**
 * Unregisters the given function to not fire when the player fails to play
 * the stream.
 * @method unregisterPlayerPlayFailedListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterPlayerPlayFailedListener = function unregisterPlayerPlayFailedListener (listener) {
    this._player.removeEventListener("onPlayError", listener);
};

/**
 * Unregisters the given function to not fire when the content is being
 * buffered.
 * @method unregisterPlayerBufferingListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterPlayerBufferingListener = function unregisterPlayerBufferingListener (listener) {
    this._removeListener(this._playerBufferingListeners, listener);
};

/**
 * Unregisters the given function from being fired when the end of the content has been reached.
 * @method unregisterPlayerReachedEndListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterPlayerReachedEndListener = function unregisterPlayerReachedEndListener (listener) {
    this._player.removeEventListener("onEoc", listener);
};

/**
 * Unregisters the given function from being fired when the player reaches the
 * beginning of the content.
 * @method unregisterPlayerReachedStartListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterPlayerReachedStartListener = function unregisterPlayerReachedStartListener (listener) {
    this._player.removeEventListener("onBoc", listener);
};

/**
 * Unregisters the given function from being fired when the currently
 * playing the live content
 * @method unregisterCaughtUptoLiveListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterCaughtUptoLiveListener = function unregisterCaughtUptoLiveListener (listener) {
    this._player.removeEventListener("onCaughtUptoLive", listener);
};

/**
 * Unregisters the given function to be called when the player position
 * passes from one event boundary to another
 * @method unregisterEventBoundaryChangedListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterEventBoundaryChangedListener = function unregisterEventBoundaryChangedListener (listener) {
    this.logDebug();
    this._player.removeEventListener("onEventBoundaryChanged", listener);
};

/**
 * Registers the given function to be called when there is locker lock info available
 * @method registerLockerStatusUpdateListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerLockerStatusUpdateListener = function registerLockerStatusUpdateListener (listener) {
    this.logDebug();
    this._player.addEventListener("onLockerStatusUpdate", listener);
};

/**
 * Registers the given function to be called when there is change in parental rating
 * @method registerOnParentalRatingChangedListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerOnParentalRatingChangedListener = function registerOnParentalRatingChangedListener (listener) {
    this.logDebug();
    this._player.addEventListener("onParentalRatingChanged", listener);
};

/**
 * Unregisters the given function to not fire when there is locker lock info available
 * @method unregisterLockerStatusUpdateListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterLockerStatusUpdateListener = function unregisterLockerStatusUpdateListener (listener) {
    this.logDebug();
    this._player.removeEventListener("onLockerStatusUpdate", listener);
};

/**
 * Registers the given function to be called when the locked player has now been unlocked
 * @method registerLockerUnlockListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerLockerUnlockListener = function registerLockerUnlockListener (listener) {
    this.logDebug();
    this._player.addEventListener("onLockerUnlock", listener);
};

/**
 * Unregisters the given function to not fire when the locked player has now been unlocked
 * @method unregisterLockerUnlockListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterLockerUnlockListener = function unregisterLockerUnlockListener (listener) {
    this.logDebug();
    this._player.removeEventListener("onLockerUnlock", listener);
};

/**
 * Registers the given function to be called when the player failed due to lack of resources
 * @method registerResourcesLostListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerResourcesLostListener = function registerResourcesLostListener (listener) {
    this._addListener(this._lostResourcesListeners, listener);
};

/**
 * Unregisters the given function from being fired when the player failed due to lack of resources
 * @method unregisterResourcesLostListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterResourcesLostListener = function unregisterResourcesLostListener (listener) {
    this._removeListener(this._lostResourcesListeners, listener);
};

/**
 * Registers the given function to be called when the player failed due to PMT update
 * @method registerPlayerPmtUpdateListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerPlayerPmtUpdateListener = function registerPlayerPmtUpdateListener (listener) {
    this._addListener(this._playerPmtUpdateListeners, listener);
};

/**
 * @method unregisterPlayerPmtUpdateListener
 * @removed
 */

/**
 * Registers the given function to be called when the Stream Disabled due to lack of resources
 * @method registerStreamDisabledListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerStreamDisabledListener = function registerStreamDisabledListener (listener) {
    this.logDebug();
    this._player.addEventListener("onStreamDisabled", listener);
};

/**
 * @method unregisterStreamDisabledListener
 * @removed
 */

/*
 * Registers the given function to be called when the Stream Enabled
 * @method registerStreamEnabledListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerStreamEnabledListener = function registerStreamEnabledListener (listener) {
    this.logDebug();
    this._player.addEventListener("onStreamEnabled", listener);
};

/*
 * @method unregisterStreamEnabledListener
 * @removed
 */

/**
 * Registers the given function to be called when the stream is started
 * @method registerStreamStartedListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerStreamStartedListener = function registerStreamStartedListener (listener) {
    this.logDebug();
    this._player.addEventListener("onStreamStarted", listener);
};

/**
 * Unregisters the given function to not fire when the stream is started
 * @method unregisterStreamStartedListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterStreamStartedListener = function unregisterStreamStartedListener (listener) {
    this.logDebug();
    this._player.removeEventListener("onStreamStarted", listener);
};

/**
 * Registers the given function to be called when the new position is set
 * @method registerSetPositionListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.registerSetPositionListener = function registerSetPositionListener (listener) {
    this.logDebug();
    this._player.addEventListener("onPositionChanged", listener);
};

/**
 * Unregisters the given function to not fire
 * @method unregisterSetPositionListener
 * @param {Function} listener Callback function
 */
o5.platform.output.VideoPlayer.prototype.unregisterSetPositionListener = function unregisterSetPositionListener (listener) {
    this.logDebug();
    this._player.removeEventListener("onPositionChanged", listener);
};

/**
 * @method registerSetPositionFailedListener
 * @removed
 */

/**
 * @method unregisterSetPositionFailedListener
 * @removed
 */

/**
 * Sets the direct mode flag for the trick play classes.
 * When direct mode is true, pressing rewind while in fast forward will slow down
 * the fast forward speed and vice versa
 * @method setTrickPlayDirectMode
 * @param {Boolean} flag Direct mode flag
 */
o5.platform.output.VideoPlayer.prototype.setTrickPlayDirectMode = function setTrickPlayDirectMode (flag) {
    this.trickPlay.setDirectMode(flag);
    this.seekTrickPlay.setDirectMode(flag);
};

/**
 * Starts playing live content if the current review buffer is being played
 * @method jumpToLive
 */
o5.platform.output.VideoPlayer.prototype.jumpToLive = function jumpToLive () {
    this._player.jumpToLive();
};

/**
 * This method blanks the video, ensuring that on return, video will not display until the client calls unblankVideo()
 * @method blankVideo
 */
o5.platform.output.VideoPlayer.prototype.blankVideo = function blankVideo () {
    this._player.blankVideo();
};

/**
 * The unblankVideo() method unblanks the video from this player. The player ensures that video is displayed from
 * then on until the client blanks the video. This request has no effect if the video is already unblanked.
 * @method unblankVideo
 */
o5.platform.output.VideoPlayer.prototype.unblankVideo = function unblankVideo () {
    this._player.unblankVideo();
};

// uncomment to turn debugging on for VideoPlayer object
// o5.log.setAll(o5.platform.output.VideoPlayer, true);
