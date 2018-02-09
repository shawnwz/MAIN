/**
 * This class is responsible for handling Tracks and provides utility methods to deal with
 * subtitle, audio and video Tracks selections. Each Tracks object will be available through the
 * video player. It controls which PIDs are active by registering PIDFound and PIDLost event
 * listeners and updates the active PID index variables accordingly upon being fired.
 *
 * @class o5.platform.output.Tracks
 * @constructor
 * @param {Object} player The CCOM player object that this Tracks is
 * associated with and listening to events for.
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.output.Tracks = function Tracks (player) {
    var me = this;

    this._player = player;
    this._clearInternalCache();
    this._activeAudioTrackLostCallback = null;
    this._activeSubtitleTrackLostCallback = null;
    this._newAudioTrackFoundCallback = null;
    this._newTracksFoundCallback = null;
    this._newSubtitleTrackFoundCallback = null;
    this._onStreamStartedCallback = null;

    if (!this._player) {
        this.logError("invalid player");
        return;
    }

    if (!o5.platform.output.TYPES) {
        o5.platform.output.TYPES = {
            audio: player.STREAM_TYPE_AUDIO,
            subtitle: player.STREAM_TYPE_SUBTITLE,
            video: player.STREAM_TYPE_VIDEO,
            other: player.STREAM_TYPE_DATA
        };
    }

    this._streamErrorListener = function (e) {
        var streamErrorInfo = e.streamErrorInfo,
            currentTrack;
        if (streamErrorInfo) {
            if (streamErrorInfo.type === player.STREAM_TYPE_AUDIO && me._activeAudioTrackLostCallback) {
                currentTrack = me.getActiveAudioTrack();
                if (currentTrack && currentTrack.id === streamErrorInfo.id) {
                    me._activeAudioTrackLostCallback(streamErrorInfo.id);
                }
            } else if (streamErrorInfo.type === player.STREAM_TYPE_SUBTITLE && me._activeSubtitleTrackLostCallback) {
                currentTrack = me.getActiveSubtitleTrack();
                if (currentTrack && currentTrack.id === streamErrorInfo.id) {
                    me._activeSubtitleTrackLostCallback(streamErrorInfo.id);
                }
            }
        }
        me._sortTracksInStream();
    };

    this._newTrackFoundListener = function (e) {
        if (me._newTracksFoundCallback) {
            me._newTracksFoundCallback();
        }
        me._sortTracksInStream();
        var audioTracks = me.getAudioTracks(),
            subtitleTracks = me.getSubtitleTracks();
        if (audioTracks.length && me._newAudioTrackFoundCallback) {
            me._newAudioTrackFoundCallback(audioTracks);
        }
        if (subtitleTracks.length && me._newSubtitleTrackFoundCallback) {
            me._newSubtitleTrackFoundCallback(subtitleTracks);
        }
    };

    this._startStreamOKListener = function (e) {
        if (this._onStreamStartedCallback) {
            this._onStreamStartedCallback(e);
            this._onStreamStartedCallback = null;
        }
    };
    this._startStreamOK = function () {};

    this._registerStreamStartedEventListener = function (callback) {
        this._onStreamStartedCallback = callback;
        this._player.addEventListener("onStreamStarted", function (e) {
            me._startStreamOKListener(e);
        });
    };

    // register internal listeners
    this._player.addEventListener("onStreamError", function (e) {
        me._streamErrorListener(e);
    });
    this._player.addEventListener("onStreamAvailable", function (e) {
        me._newTrackFoundListener(e);
    });
    this._player.addEventListener("startStreamsOK", function (e) {
        me._startStreamOK(e);
    });
};

/**
 * @deprecated Unused property, always null.
 * @property {Number} TYPES
 */
o5.platform.output.Tracks.TYPES = null;

/**
 * Clears the cache of tracks stored in this object.
 * @method _clearInternalCache
 * @private
 */
o5.platform.output.Tracks.prototype._clearInternalCache = function _clearInternalCache () {
    this._audioTracks = [];
    this._subtitleTracks = [];
    this._videoTracks = [];
    this._otherTracks = [];
};

/**
 * Returns the array index of the active track for the given track array, or null if no
 * active track exists.
 * @method _getIndexOfActiveTrack
 * @private
 * @param {Array} trackArray Track array
 * @return {Number} Returns the track array index or null if not found
 */
o5.platform.output.Tracks.prototype._getIndexOfActiveTrack = function _getIndexOfActiveTrack (trackArray) {
    var trackArrayLength = trackArray.length,
        i;
    for (i = 0; i < trackArrayLength; i++) {
        if (this.isActive(trackArray[i])) {
            return i;
        }
    }
    return null;
};

/**
 * Sets the track for a given language to active if it exists in the taskArray, and returns whether the
 * track was found.
 * @method _activateTrackForLanguage
 * @private
 * @param {String} language Language
 * @param {Array} trackArray Track array
 * @return {Boolean} Returns true if found, otherwise false.
 */
o5.platform.output.Tracks.prototype._activateTrackForLanguage = function _activateTrackForLanguage (language, trackArray) {
    var trackArrayLength = trackArray.length,
        i;
    for (i = 0; i < trackArrayLength; i++) {
        if (this.getLanguage(trackArray[i]) === language) {
            this.activateTrack(trackArray[i]);
            return true;
        }
    }
    return false;
};

/**
 * Goes to the next active track in the given array. If allowAllOff is true, allows all tracks to
 * be inactive as part of the cycle.
 * @method _activateNextTrack
 * @private
 * @param {Array} trackArray Track array
 * @param {Boolean} allowAllOff True to allows all tracks to be inactive as part of the cycle
 * @return {Object} Returns the new active track or null if none active
 */
o5.platform.output.Tracks.prototype._activateNextTrack = function _activateNextTrack (trackArray, allowAllOff) {
    var activeIndex = this._getIndexOfActiveTrack(trackArray);
    if (activeIndex !== null) {
        this.deactivateTrack(trackArray[activeIndex]);
        if (activeIndex === trackArray.length - 1) {
            if (!allowAllOff) {
                this.activateTrack(trackArray[0]);
                return trackArray[0];
            }
        } else {
            this.activateTrack(trackArray[++activeIndex]);
            return trackArray[activeIndex];
        }
    } else if (trackArray.length > 0) {
        this.activateTrack(trackArray[0]);
        return trackArray[0];
    }
    return null;
};

/**
 * Updates (clears and re-populates) the cache of tracks stored in this object.
 * The available tracks are obtained from the player object.
 * @method _sortTracksInStream
 * @private
 */
o5.platform.output.Tracks.prototype._sortTracksInStream = function _sortTracksInStream () {
    var availableStreams = this._player.availableStreams,
        streamsLength = availableStreams ? availableStreams.length : 0,
        i,
        stream,
        player = this._player;

    this.logDebug("_sortTracksInStream", "found " + String(streamsLength) + " streams");

    this._clearInternalCache();

    if (typeof availableStreams === "string") {
        // availableStreams returned an error string rather than an array
        this.logDebug("_sortTracksInStream", availableStreams);
        return;
    }

    for (i = 0; i < streamsLength; i++) {
        stream = availableStreams[i];
        if (stream) {
            switch (stream.type) {
                case player.STREAM_TYPE_AUDIO:
                    stream.language = stream.iaudio.language;
                    this._audioTracks.push(stream);
                    this.logDebug("_sortTracksInStream", "Added audio track: " + stream.id);
                    break;
                case player.STREAM_TYPE_VIDEO:
                    this._videoTracks.push(stream);
                    this.logDebug("_sortTracksInStream", "Added video track: " + stream.id);
                    break;
                case player.STREAM_TYPE_SUBTITLE:
                    stream.language = this.getLanguage(stream);
                    this._subtitleTracks.push(stream);
                    break;
                default:
                    this._otherTracks.push(stream);
                    this.logDebug("_sortTracksInStream", "Added other track: " + stream.id);
                    break;
            }
        }
    }
};

/**
 * Returns an object with Dolby audio formats properties
 * @method _getDolbyStreamFormat
 * @private
 * @return {Object} Returns the audio format object with the following properties:
 *
 *        AC3 {Number} 15
 *        EAC3 {Number} 16
 */
o5.platform.output.Tracks.prototype._getDolbyStreamFormat = function _getDolbyStreamFormat () {
    return {
        AC3: this._player.STREAM_FORMAT_AUDIO_AC3,
        EAC3: this._player.STREAM_FORMAT_AUDIO_ENHANCED_AC3
    };
};

/**
 * @method getStream
 * @removed
 */

/**
 * Clears and re-loads the active streams from the player stored within this object.
 * @method setStream
 */
o5.platform.output.Tracks.prototype.setStream = function setStream () {
    this._sortTracksInStream();
};

/**
 * Returns all the audio tracks in the stream object passed in to the `setStream` method
 * @method getAudioTracks
 * @return {Array} Returns an array of audio tracks, which may be empty if there is none.
 */
o5.platform.output.Tracks.prototype.getAudioTracks = function getAudioTracks () {
    return this._audioTracks;
};

/**
 * Returns object with properties describing audio track
 * @method getAudioTrackInfo
 * @return {Object} Returns the audio track info object with following properties:
 *
 *        isDolbyTrack {Boolean} True if Dolby track
 *        isDolbyPlusTrack {Boolean} True if Dolby plus track
 *        isMultiAudioTrack {Boolean} True if multiple audio track
 */
o5.platform.output.Tracks.prototype.getAudioTrackInfo = function getAudioTrackInfo () {
    var dolbyFormat = this._getDolbyStreamFormat(),
        isDolbyTrack = false,
        isDolbyPlusTrack = false,
        isMultiAudioTrack = false,
        i,
        audioTrackLength = this._audioTracks.length;
    if (audioTrackLength > 1) {
        isMultiAudioTrack = true;
    }
    for (i = 0; i < audioTrackLength; i++) {
        if (this._audioTracks[i].format === dolbyFormat.AC3) {
            isDolbyTrack = true;
        } else if (this._audioTracks[i].format === dolbyFormat.EAC3) {
            isDolbyPlusTrack = true;
        }
    }
    return {
        isDolbyTrack: isDolbyTrack,
        isDolbyPlusTrack: isDolbyPlusTrack,
        isMultiAudioTrack: isMultiAudioTrack
    };
};

/**
 * @method isTeletextSubtitleTracks
 * @removed
 */

/**
 * Returns all the video tracks in the stream object passed in to the `setStream` method
 * @method getVideoTracks
 * @return {Array} Returns an array of video tracks, which may be empty if there is none.
 */
o5.platform.output.Tracks.prototype.getVideoTracks = function getVideoTracks () {
    return this._videoTracks;
};

/**
 * Returns all the subtitle tracks in the stream object passed in to the `setStream` method
 * @method getSubtitleTracks
 * @return {Array} Returns an array of subtitle tracks, which may be empty if there is none.
 */
o5.platform.output.Tracks.prototype.getSubtitleTracks = function getSubtitleTracks () {
    return this._subtitleTracks;
};

/**
 * Gets subtitle track info
 * @method getSubtitleTrackInfo
 * @return {Object} Returns the subtitle track info object with the following properties:
 *
 *        isCcSubtitle {Boolean} True if closed caption is in the subtitle track
 *        isMultiSubtitle {Boolean} True if multiple subtitles are in the subtitle track
 */
o5.platform.output.Tracks.prototype.getSubtitleTrackInfo = function getSubtitleTrackInfo () {
    var closedCaptionFormat = this._player.STREAM_FORMAT_SUBTITLE_ARIB_CLOSED_CAPTION || this._player.STREAM_FORMAT_SUBTITLE_EIT_608_CLOSED_CAPTION,
        i,
        isMultiSubtitle = false,
        isCcSubtitle = false,
        subtitleTracksLength = this._subtitleTracks.length;
    if (subtitleTracksLength > 0) {
        isMultiSubtitle = true;
    }
    for (i = 0; i < subtitleTracksLength; i++) {
        if (this._subtitleTracks[i].format === closedCaptionFormat) {
            isCcSubtitle = true;
        }
    }
    return {
        isCcSubtitle: isCcSubtitle,
        isMultiSubtitle: isMultiSubtitle
    };
};

/**
 * Returns all the 'other' tracks (streams) (i.e. those not considered to be of any
 * other recognized type) stored within this object.
 * @method getDataTracks
 * @return {Array} Returns an array of 'other' tracks, which may be empty if there is none.
 */
o5.platform.output.Tracks.prototype.getDataTracks = function getDataTracks () {
    return this.getOtherTracks();
};

/**
 * Returns all the 'other' tracks (streams) (i.e. those not considered to be of any
 * other recognized type) stored within this object.
 * @method getOtherTracks
 * @return {Array} Returns an array of 'other' tracks, which may be empty if there is none.
 */
o5.platform.output.Tracks.prototype.getOtherTracks = function getOtherTracks () {
    return this._otherTracks;
};

/**
 * Returns the currently active audio track for the stream id. Useful for keeping the user informed.
 * If no audio track is active, null is returned.
 * @method getActiveAudioTrackById
 * @param {Number} streamId Stream id of the audio track
 * @return {Object} Returns the audio track that is active, or null if there is none.
 */
o5.platform.output.Tracks.prototype.getActiveAudioTrackById = function getActiveAudioTrackById (streamId) {
    if (this._audioTracks) {
        for (var i = 0; i < this._audioTracks.length; i++) {
            if (this._audioTracks[i].id === streamId) {
                return this.isActive(this._audioTracks[i]) ? this._audioTracks[i] : null;
            }
        }
    }
    return null;
};

/**
 * Returns the currently active audio track for the stream. Useful for keeping the user
 * informed. If no audio track is active, null is returned.
 * @method getActiveAudioTrack
 * @return {Object} Returns the audio track that is active, or null if there is none.
 */
o5.platform.output.Tracks.prototype.getActiveAudioTrack = function getActiveAudioTrack () {
    var activeIndex = this._getIndexOfActiveTrack(this._audioTracks);
    return activeIndex === null ? null : this._audioTracks[activeIndex];
};

/**
 * Returns the currently active subtitle track for the stream. Useful for keeping the user
 * informed. If no subtitle track is active, null is returned.
 * @method getActiveSubtitleTrack
 * @return {Object} Returns the subtitle track that is active, or null if there is none.
 */
o5.platform.output.Tracks.prototype.getActiveSubtitleTrack = function getActiveSubtitleTrack () {
    var activeIndex = this._getIndexOfActiveTrack(this._subtitleTracks);
    return activeIndex === null ? null : this._subtitleTracks[activeIndex];
};

/**
 * Returns the currently active video track for the stream. Useful for keeping the user
 * informed. If no video track is active, null is returned.
 * @method getActiveVideoTrack
 * @return {Object} Returns the video track that is active, or null if there is none.
 */
o5.platform.output.Tracks.prototype.getActiveVideoTrack = function getActiveVideoTrack () {
    var activeIndex = this._getIndexOfActiveTrack(this._videoTracks);
    return activeIndex === null ? null : this._videoTracks[activeIndex];
};

/**
 * Returns the currently active data track for the stream, useful for when you want to inform
 * the user. If there is no data track active active, then null is returned.
 * @method getActiveDataTrack
 * @return {Object} Returns the data track that is active, or null if there is none.
 */
o5.platform.output.Tracks.prototype.getActiveDataTrack = function getActiveDataTrack () {
    return this.getActiveOtherTrack();
};

/**
 * Returns the currently active 'other' track for the stream, useful for when you want to inform
 * the user. If there is no 'other' track active, then null is returned. An 'other' track is one
 * that is not recognized as being one of the other types.
 * @method getActiveOtherTrack
 * @return {Object} Returns the 'other' video track that is active, or null if there is none.
 */
o5.platform.output.Tracks.prototype.getActiveOtherTrack = function getActiveOtherTrack () {
    var activeIndex = this._getIndexOfActiveTrack(this._otherTracks);
    return activeIndex === null ? null : this._otherTracks[activeIndex];
};

/**
 * Get the list of all stored dual-mono audio tracks (channels; streams).
 * @method getDualMonoAudioTracks
 * @return {Array} Returns an array of audio tracks that have a dual-mono channel, which may be empty.
 */
o5.platform.output.Tracks.prototype.getDualMonoAudioTracks = function getDualMonoAudioTracks () {
    var dualMonoTracks = [],
        audioTracks = this.getAudioTracks(),
        numberOfAudioTracks = audioTracks.length,
        i;

    for (i = 0; i < numberOfAudioTracks; i++) {
        if (audioTracks[i].iaudio.dualMono === true) {
            dualMonoTracks.push(audioTracks[i]);
        }
    }
    return dualMonoTracks;
};

/**
 * @method getDualMonoChannelMode
 * @removed
 */

/**
 * @method setDualMonoChannelMode
 * @removed
 */

/**
 * Activates the given track. It is expected that the track is known prior to calling this
 * function by calling one of the `getTracks` methods.
 * @method activateTrack
 * @param {Object} track Track object
 * @param {Function} [callback] Callback to set and call when start stream ok notification fires
 */
o5.platform.output.Tracks.prototype.activateTrack = function activateTrack (track, callback) {
    if (track) {
        this._player.startStreams([{
            specType: this._player.STREAM_SPEC_TYPE_JUST_ID,
            id: track.id
        }]);
    }
    if (callback) {
        this._startStreamOK = callback;
    }
};

/**
 * Deactivates the given track. It is expected that the track is known prior to calling this
 * function by calling one of the `getTracks` methods.
 * @method deactivateTrack
 * @param {Object} track Track object
 */
o5.platform.output.Tracks.prototype.deactivateTrack = function deactivateTrack (track) {
    if (track) {
        this._player.stopStreams([{
            stopStreamTypes: track.type
        }]);
    }
};

/**
 * This method will check if there is an audio track available for the given language code, and
 * if so, activate it.
 * @method activateAudioTrackByLanguage
 * @param {String} languageCode Language code (i.e. eng, fra, rus)
 * @return {Boolean} Returns true if activated, false if not found.
 */
o5.platform.output.Tracks.prototype.activateAudioTrackByLanguage = function activateAudioTrackByLanguage (languageCode) {
    return this._activateTrackForLanguage(languageCode, this._audioTracks);
};

/**
 * This method will check if there is an subtitle track available for the given language code and,
 * if so, activate it.
 * @method activateSubtitleTrackByLanguage
 * @param {String} languageCode Language code (i.e. eng, fra, rus)
 * @return {Boolean} Returns true if activated, false if not found.
 */
o5.platform.output.Tracks.prototype.activateSubtitleTrackByLanguage = function activateSubtitleTrackByLanguage (languageCode) {
    return this._activateTrackForLanguage(languageCode, this._subtitleTracks);
};

/**
 * Activate the next audio track available in the stream. For example, if the stream has two
 * audio tracks, one in English and one in French, and if the current audio is English, this
 * method will switch the audio to French, and vice versa. Note that the behavior is cyclic,
 * so a call to this method after reaching the last track in the stored list will activate the
 * first track in the list.
 * @method cycleAudioTracks
 * @return {Object} Returns the next active track or null if none active
 */
o5.platform.output.Tracks.prototype.cycleAudioTracks = function cycleAudioTracks () {
    return this._activateNextTrack(this._audioTracks, false);
};

/**
 * Activate the next subtitle track available in the stream. For example, if the stream has two
 * subtitle tracks, one in English and one in French, and if the current subtitle is English, this
 * method will switch the subtitles to French, and vice versa. Note that the behavior is cyclic,
 * so a call to this method after reaching the last track in the stored list will activate the
 * first track in the list.
 * @method cycleSubtitleTracks
 * @return {Object} Returns the next active track or null if none active
 */
o5.platform.output.Tracks.prototype.cycleSubtitleTracks = function cycleSubtitleTracks () {
    return this._activateNextTrack(this._subtitleTracks, true);
};

/**
 * Returns the language of the given track (stream), or "Unknown" if not found (e.g. because it's a video
 * track). Audio or subtitle tracks would be valid inputs.
 * @method getLanguage
 * @param {Object} track Track object
 * @return {String} Returns the language of the given track
 */
o5.platform.output.Tracks.prototype.getLanguage = function getLanguage (track) {
    var language;
    if (track) {
        if (track.iaudio && track.iaudio.language) {
            language = track.iaudio.language;
        } else if (track.idvbTltxtSubtitle && track.idvbTltxtSubtitle.language) {
            language = track.idvbTltxtSubtitle.language;
        } else if (track.idvbSubtitle && track.idvbSubtitle.language) {
            language = track.idvbSubtitle.language;
        } else if (track.iaribCc && track.iaribCc.language) {
            language = track.iaribCc.language;
        } else if (track.idvbTltxtTeletext && track.idvbTltxtTeletext.language) {
            language = track.idvbTltxtTeletext.language;
        }
    }
    if (language) {
        return language;
    } else {
        return "Unknown";
    }
};

/**
 * Determines whether the given track is active.
 * @method isActive
 * @param {Object} track Track object
 * @return {Boolean} Returns true if the track is active, false if not or if the player or given track is null.
 */
o5.platform.output.Tracks.prototype.isActive = function isActive (track) {
    var i,
        currentActiveStreams = this._player.activeStreams,
        len = currentActiveStreams.length;
    for (i = 0; i < len; i++) {
        if (currentActiveStreams[i] && track.id === currentActiveStreams[i].id) {
            return true;
        }
    }
    return false;
};

/**
 * Sets the callback to execute when an active subtitle track is lost
 * to allow the UI to be updated
 * @method setActiveSubtitleTrackLostCallback
 * @param {Function} callback Callback function to set. Set to null to remove event notification.
 */
o5.platform.output.Tracks.prototype.setActiveSubtitleTrackLostCallback = function setActiveSubtitleTrackLostCallback (callback) {
    this._activeSubtitleTrackLostCallback = callback;
};

/**
 * Sets the callback to execute when an active audio track is lost
 * to allow the UI to be updated
 * @method setActiveAudioTrackLostCallback
 * @param {Function} callback Callback function to set. Set to null to remove event notification.
 */
o5.platform.output.Tracks.prototype.setActiveAudioTrackLostCallback = function setActiveAudioTrackLostCallback (callback) {
    this._activeAudioTrackLostCallback = callback;
};

/**
 * Sets the callback to execute when an new subtitle track is found
 * to allow the UI to be updated / subtitles enabled for a
 * preferred language etc.
 * @method setNewSubtitleTrackFoundCallback
 * @param {Function} callback Callback function to set. Set to null to remove event notification.
 */
o5.platform.output.Tracks.prototype.setNewSubtitleTrackFoundCallback = function setNewSubtitleTrackFoundCallback (callback) {
    this._newSubtitleTrackFoundCallback = callback;
};

/**
 * Sets the callback to execute when an new audio track is found
 * to allow the UI to be updated / subtitles enabled for a
 * preferred language etc.
 * @method setNewAudioTrackFoundCallback
 * @param {Function} callback Callback function to set. Set to null to remove event notification.
 */
o5.platform.output.Tracks.prototype.setNewAudioTrackFoundCallback = function setNewAudioTrackFoundCallback (callback) {
    this._newAudioTrackFoundCallback = callback;
};

/**
 * Sets the callback to execute when an new track is found
 * to allow the UI to be updated / subtitles enabled for a
 * preferred language etc.
 * @method setTracksFoundCallback
 * @param {Function} callback Callback function to set. Set to null to remove event notification.
 */
o5.platform.output.Tracks.prototype.setTracksFoundCallback = function setTracksFoundCallback (callback) {
    this._newTracksFoundCallback = callback;
};

/**
 * Clears all internally stored track information
 * @method clearInternalCache
 */
o5.platform.output.Tracks.prototype.clearInternalCache = function clearInternalCache () {
    this._clearInternalCache();
};

// uncomment to turn debugging on for Tracks object
// o5.log.setAll(o5.platform.output.Tracks, true);
