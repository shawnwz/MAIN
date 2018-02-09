/**
 * The aim of this class is to offer a single code base to
 * handle all tune requests from RTSP, IGMP, DVB, etc. and also disconnect requests.
 * The Tuner needs to be associated with a Player object. This
 * allows systems with multiple tuners to have 2+ player objects allowing
 * picture in picture. To use this class you instantiate it with
 * a player. Typically, you would do this once in an application.
 * For example, in a single player environment, this class should only
 * ever be instantiated once.
 *
 * @class o5.platform.output.Tuner
 * @constructor
 * @param {Object} player The CCOM player object that this Tuner is
 * associated with and listening to events for.
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.output.Tuner = function Tuner (player) {
    var me = this;

    this._instance = o5.platform.output.Tuner.instanceCount++;
    this._player = null;
    this._ready = true;
    this._queuedRequest = null;
    this._readyTO = null;
    this._readyBufferMs = 400;

    this._tuneFailedCallback = function () {};

    this._playFailedListener = function (e) {
        me._tuneFailedCallback("Player", null, e.error.message);
    };

    this._playStartFailedListener = function (e) {
        me._tuneFailedCallback("Player", null, e);
    };

    this._streamStartFailedListener = function (e) {
        me._tuneFailedCallback("Source", null, e);
    };

    if (player) {
        this.setPlayer(player);
    } else {
        this.logError("invalid player");
    }
};

o5.platform.output.Tuner.instanceCount = 0;

/**
 * Updates the internal state of the class to allow tune requests
 * to be serviced.  Since multiple tuner requests may be received in
 * a short space of time there is a 400ms delay before they are
 * serviced to avoid too many requests at once overloading the tuner.
 * @method _updateReadyFlag
 * @private
 */
o5.platform.output.Tuner.prototype._updateReadyFlag = function _updateReadyFlag () {
    this.logEntry();
    this._ready = true;
    if (this._queuedRequest) {
        this.logDebug("Processing queued request with URI: " + this._queuedRequest.uri);
        this._tuneWithPlayOption(this._queuedRequest.uri, this._queuedRequest.playOption);
        this._queuedRequest = null;
    }
};

/**
 * Private helper function to avoid duplicated code in the public API,
 * Handles the tuning request
 * @method _tuneWithPlayOption
 * @private
 * @param {String} uri Source URI
 * @param {Object} playOption Play option
 */
o5.platform.output.Tuner.prototype._tuneWithPlayOption = function _tuneWithPlayOption (uri, playOption) {
    this.logEntry();

    var me = this;

    if (this.getCurrentUri() !== uri) {
        if (this._ready) {
            this.logDebug("Ready flag true calling CCOM player.play");
            this._ready = false;
            this._player.play(uri, playOption ? [playOption] : []);
        } else {
            clearTimeout(this._readyTO);
            this.log("Not ready so queueing request for later");
            this._queuedRequest = {
                uri: uri,
                playOption: playOption
            };
        }
        this._readyTO = setTimeout(function () {
            me._updateReadyFlag();
        }, this._readyBufferMs);
    } else {
        this.logDebug("Tune request to same stream ignoring");
    }
    this.logExit();
};

/**
 * Sets the player to be for used the tuning process.
 * @method setPlayer
 * @param {Object} player CCOM player object
 */
o5.platform.output.Tuner.prototype.setPlayer = function setPlayer (player) {
    this._player = player;
    this._player.addEventListener("playFailed", this._playFailedListener);
    this._player.addEventListener("onPlayStartFailed", this._playStartFailedListener);
    this._player.addEventListener("onStreamStartFailed", this._streamStartFailedListener);
};

/**
 * Gets the player used for the tuning process.
 * @method getPlayer
 * @return {Object} Returns the player object
 */
o5.platform.output.Tuner.prototype.getPlayer = function getPlayer () {
    return this._player;
};

/**
 * @method setReadyBufferMs
 * @removed
 */

/**
 * Sets the function to be executed if a tune request fails, either
 * because of a stream problem or a player problem.
 * @method setTuneFailedCallback
 * @param {Function} callback Callback function to set to
 */
o5.platform.output.Tuner.prototype.setTuneFailedCallback = function setTuneFailedCallback (callback) {
    this._tuneFailedCallback = callback;
};

/**
 * Returns the source URI that the player is tuned to.
 * @method getCurrentUri
 * @return {String} Returns the source URI that the player is tuned to.
 * Returns null if no source URI is set.
 */
o5.platform.output.Tuner.prototype.getCurrentUri = function getCurrentUri () {
    if (this._player) {
        return this._player.sourceUri;
    } else {
        return null;
    }
};

/**
 * @method getStream
 * @removed
 */

/**
 * Tunes the player to the given URI, and starts playing the stream from the given position
 * @method tune
 * @param {String} uri Source URI
 * @param {Number} [position=0] Position to begin playback in seconds
 */
o5.platform.output.Tuner.prototype.tune = function tune (uri, position) {
    this.logEntry();
    
    if(!o5.platform.output.Tuner._firstTune)
    {
    	o5.platform.output.Tuner._firstTune = true;
    	
    	this.log('first tune after ' + (Date.now() - window.performance.timing.requestStart) + ' ms');
    }

    if (!position) {
        position = 0;
    } else if (uri.indexOf(".m3u8") > -1) {
        uri = uri.replace(/http:/g, "ahls:");
    }
    var playOption = {
        commandType: this._player.PLAY_CONTROL_CMD_POSITION,
        positionCommandData: {
            whence: this._player.SEEK_SET,
            type: this._player.POSITION_TYPE_TIME_BASED,
            timePosition: position * 1000
        }
    };
    this._tuneWithPlayOption(uri, playOption);
    this.logExit();
};

/**
 * Tunes the player to the given URI but doesn't play automatically
 * @method tuneWithoutPlay
 * @param {String} uri Source URI
 */
o5.platform.output.Tuner.prototype.tuneWithoutPlay = function tuneWithoutPlay (uri) {
    this.logEntry();
    var playOption = {
        commandType: this._player.PLAY_CONTROL_CMD_DONT_START_STREAMS
    };
    this._tuneWithPlayOption(uri, playOption);
    this.logExit();
};

/**
 * Disconnects all active streams (video, audio, subtitle) so that no stream
 * is actively playing. This method does not remove the current URI.
 * @method disconnect
 */
o5.platform.output.Tuner.prototype.disconnect = function disconnect () {
    this.logEntry();
    var i,
        streamTypes = [];
    if (this._player) {
        for (i = 0; i < this._player.availableStreams.length; i++) {
            streamTypes.push({
                stopStreamTypes: this._player.availableStreams[i].type
            });
        }
        this._player.stopStreams(streamTypes);
    }
    this.logExit();
};

/**
 * @method showFullscreen
 * @deprecated Use CSS rules with the < o5-video > if using it or directly on the videoElement otherwise
 * @param {Object} [videoElement] Video element
 */
o5.platform.output.Tuner.prototype.showFullscreen = function showFullscreen (videoElement) {
    this.logEntry();
    this.logDeprecated();
    var videos;

    if (!videoElement) {
        videos = document.getElementsByTagName("video");
        videoElement = videos[this._instance];
    }
    if (videoElement) {
        videoElement.style.left = "0px";
        videoElement.style.top = "0px";
        videoElement.style.width = document.body.clientWidth + 'px';
        videoElement.style.height = document.body.clientHeight + 'px';
        this.logDebug("Restoring video window to full screen");
    } else {
        this.logError("Failed to restore video window no element found");
    }
    this.logExit();
};

/**
 * @method showScaled
 * @deprecated Use CSS rules with the < o5-video > if using it or directly on the videoElement otherwise
 * @param {Number} x X pixel position
 * @param {Number} y Y pixel position
 * @param {Number} width Width
 * @param {Number} height Height
 * @param {Object} [videoEl] Video element
 */
o5.platform.output.Tuner.prototype.showScaled = function showScaled (x, y, width, height, videoEl) {
    this.logEntry();
    this.logDeprecated();
    var videos;

    if (!videoEl) {
        videos = document.getElementsByTagName("video");
        videoEl = videos[this._instance];
    }
    if (videoEl) {
        // videoEl.setAttribute("href", "display://" + this._instance); - removed in JSFW 2.3.0-b4 - remove this comment if no issues found
        videoEl.style.left = x + "px";
        videoEl.style.top = y + "px";
        videoEl.style.width = width + 'px';
        videoEl.style.height = height + 'px';
        this.logDebug("Scaling video window");
    } else {
        this.logError("Failed to scale video window no element found");
    }
    this.logExit();
};

/**
 * @method showInSVGVideo
 * @deprecated
 */
o5.platform.output.Tuner.prototype.showInSVGVideo = function showInSVGVideo () {
    this.logDeprecated();
};

/**
 * Hides the video.
 * @method hideVideo
 */
o5.platform.output.Tuner.prototype.hideVideo = function hideVideo () {
    this.logEntry();
    this._player.blankVideo();
    this.logExit();
};

/**
 * Makes the video to be visible after it was hidden via hideVideo() API
 * @method showVideo
 */
o5.platform.output.Tuner.prototype.showVideo = function showVideo () {
    this.logEntry();
    this._player.unblankVideo();
    this.logExit();
};

/**
 * Registers the given function to fire when the Quality Of
 * Service is such that video can no longer play and buffering
 * begins
 * @method registerQosDegradedListener
 * @param {Function} listener Callback function to be invoked when signal is lost
 */
o5.platform.output.Tuner.prototype.registerQosDegradedListener = function registerQosDegradedListener (listener) {
    this._player.addEventListener("onSignalLoss", listener);
};

/**
 * Registers the given function to fire when the Quality Of
 * Service has returned to a state such that video can play
 * and buffering ends
 * @method registerQosImprovedListener
 * @param {Function} listener Callback function to be invoked when signal has improved
 */
o5.platform.output.Tuner.prototype.registerQosImprovedListener = function registerQosImprovedListener (listener) {
    this._player.addEventListener("onSignalGain", listener);
};
/**
 * Unregisters the given function to NOT fire when the Quality
 * Of Service is such that video can no longer play and buffering
 * begins
 * @method unregisterQosDegradedListener
 * @param {Function} listener Callback function to be removed
 */
o5.platform.output.Tuner.prototype.unregisterQosDegradedListener = function unregisterQosDegradedListener (listener) {
    this._player.removeEventListener("onSignalLoss", listener);
};

/**
 * Unregisters the given function to NOT fire when the Quality
 * Of Service has returned to a state such that video can play
 * and buffering ends
 * @method unregisterQosImprovedListener
 * @param {Function} listener Callback function to be removed
 */
o5.platform.output.Tuner.prototype.unregisterQosImprovedListener = function unregisterQosImprovedListener (listener) {
    this._player.removeEventListener("onSignalGain", listener);
};

// uncomment to turn debugging on for Tuner object
// o5.log.setAll(o5.platform.output.Tuner, true);
