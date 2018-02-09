/**
 * The Video Control is used for presentation of any type of video.
 * It implements HTMLMediaElement and HTMLVideoElement interfaces as supported by OpenTV OS, with extensions and enhancements for TV STB use cases.
 *
 * Example markup for Video is:
 *
 * 	<o5-video></o5-video>
 *
 * @class o5.gui.controls.Video
 * @extends o5.gui.controls.Control
 *
 * @author lmayle
 */

o5.gui.controls.Video = function Video () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.Video);

//o5.log.setAll(o5.gui.controls.Video, true);
var destIndex = 0;

o5.gui.controls.Video.prototype.createdCallback = function createdCallback ()
{
    this._video = this.ownerDocument.createElement("video");
    this._video._o5video = this;

    var preloadOrg = this._video.preload;

    /* The o5-video element will have 2 video windows associated with it. In order for
       PIP to function, we'll need properly assign the otv-priority. This will be done
       when we are ready to test PIP.*/

    this._createVideoElem(this._video, 200);

    if (o5.legacySupport)
    {
	    // legacy code, to be removed
	    this._rootElement = this._video;
	    this._innerElement = this._video;

	    this._href = "";

	    if (this.attributes.src)
	    {
	    	if (this.attributes.src.value.startsWith('display://'))
	    	{
	    		this._innerElement.setAttribute("otv-video-destination", this.attributes.src.value);
	    	}
	    	this.setHref(this.attributes.src.value);
	    }

	    if (this.attributes.width)
		{
	        this._rootElement.setAttribute("width", this.attributes.width.nodeValue);
	    }
        else if (this.style && this.style.width)
		{
	        this._rootElement.setAttribute("width", this.style.width);
	    }
        else
		{
	        this.logWarning("Element has no 'width' attribute defined, set default value as '1280px'");
	        this._rootElement.setAttribute('width', '1280px');
	    }

	    if (this.attributes.height)
		{
	        this._rootElement.setAttribute("height", this.attributes.height.nodeValue);
	    }
        else if (this.style && this.style.height)
		{
	        this._rootElement.setAttribute("height", this.style.height);
	    }
        else
		{
	        this.logWarning("Element has no 'height' attribute defined, set default value as '720px'");
	        this._rootElement.setAttribute('height', '720px');
	    }
    }

    this._readyState = false;
    this._seeking = false;
	this._isPaused = true;

	this._video.preload = preloadOrg;

    // by default, the common case
    this.autoplay = true;
    this.preloadEnabled = false;

};

o5.gui.controls.Video.prototype._createVideoElem = function _createVideoElem (videoElem, priority)
{
	//Each video element will need its own unique destUri when getting the player instance.
	videoElem._destUri = "display://" + CCOM.Application.aimUuid + destIndex++;
    videoElem.setAttribute("otv-video-destination", videoElem._destUri);
//    videoElem.setAttribute("otv-priority", priority);
    videoElem.style.otvPriority = priority;

    /* This is to workaround because the MW will not create the player instance until the src
       is set.  */
    videoElem.setAttribute("preload", "none");
	videoElem._eventMsg = [];
	videoElem.brdSrc = '';

    //code for NW
    if (!(window.nw || window.nwDispatcher))
    {
    	videoElem.setAttribute("src", videoElem._destUri);
    }
    this.appendChild(videoElem);

        /* This will allow us to forward all */
    this._videoEventListener("addEventListener", videoElem);

    var res = CCOM.PlayerManager.getInstance({ destUri: videoElem._destUri });

	if (res.error)
	{
		this.logError("FAILED to get player instance for preload");
		this.logError(res.error.message);
        this.removeChild(videoElem);
//        delete videoElem;
	}
    else
    {
        videoElem._player = res.instance;
        videoElem._player.addEventListener("onIframeDecode", this._onIframeDecode.bind(videoElem), true);

        videoElem._player.addEventListener("onSpeedChanged", this._onSpeedChanged.bind(videoElem), true);
        videoElem._player.addEventListener("onPlayStarted", this._onPlayStarted.bind(videoElem), true);
        videoElem._player.addEventListener("playFailed", this._playFailed.bind(videoElem), true);
        videoElem._player.addEventListener("onPlayError", this._onPlayError.bind(videoElem), true);
        videoElem._player.addEventListener("onPlayStartFailed", this._onPlayStartFailed.bind(videoElem), true);
        videoElem._player.addEventListener("onStreamDisabled", this._onStreamDisabled.bind(videoElem), true);

        videoElem._player.addEventListener("onJumpToLiveFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("onPlayStopFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("onPositionChangeFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("onReviewBufferDisableFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("onReviewBufferEnableFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("onSpeedChangeFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("onStreamError", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("onStreamStartFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("onStreamStopFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("onVideoBlankFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("onVideoUnblankFailed", this._onError.bind(videoElem), true);

        videoElem._player.addEventListener("setPositionFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("setSpeedFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("startStreamsFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("stopFailed", this._onError.bind(videoElem), true);
        videoElem._player.addEventListener("stopStreamsFailed", this._onError.bind(videoElem), true);
    }
};

/*
 * Public properties
 */
/*
 *****************************
 * HTMLVideoElement properties
 *****************************
 */
/**
 * Is a DOMString that reflects the height HTML attribute, which specifies the height of the
 * display area, in CSS pixels.
 * @property {String} height
 * @htmlAttribute
 */
o5.gui.controls.Control.definePropertyWithAttribute(o5.gui.controls.Video.prototype, 'height', {
	get: function get ()
	{
		return this._video.height;
	},
	set: function set (val)
	{
		this._video.height = val;
	}
});

/**
 * Is a DOMString that reflects the poster HTML attribute, which specifies an image to show
 * while no video data is available.
 * @property {String} poster
 * @htmlAttribute
 *
 */
o5.gui.controls.Control.definePropertyWithAttribute(o5.gui.controls.Video.prototype, 'poster', {
	get: function get ()
	{
		return this._video.poster;
	},
	set: function set (val)
	{
		if (this._video.brdSrc !== "")
		{
			this._video.poster = null;
		}
		else
		{
			this._video.poster = val;
		}
	}
});

/**
 * Returns an unsigned long containing the intrinsic height of the resource in CSS pixels,
 * taking into account the dimensions, aspect ratio, clean aperture, resolution, and so
 * forth, as defined for the format used by the resource. If the element's ready state is
 * HAVE_NOTHING, the value is 0.
 * @property {Number} videoHeight
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'videoHeight', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return this._video._player.videoDetails.height;
		}

		return this._video.videoHeight;

	},
	enumerable: true
});

/**
 * Returns an unsigned long containing the intrinsic width of the resource in CSS pixels,
 * taking into account the dimensions, aspect ratio, clean aperture, resolution, and so
 * forth, as defined for the format used by the resource. If the element's ready state is
 * HAVE_NOTHING, the value is 0.
 * @property {Number} videoWidth
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'videoWidth', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return this._video._player.videoDetails.width;
		}

		return this._video.videoWidth;

	},
	enumerable: true
});

/**
 * Is a DOMString that reflects the width HTML attribute, which specifies the width of the
 * display area, in CSS pixels.
 * @property {String} width
 * @htmlAttribute
 */
o5.gui.controls.Control.definePropertyWithAttribute(o5.gui.controls.Video.prototype, 'width', {
	get: function get ()
	{
		return this._video.width;
	},
	set: function set (val)
	{
		this._video.width = val;
	}
});


/*
 *****************************
 * HTMLMediaElement properties
 *****************************
 */
/**
 * Is a AudioTrackList that lists the AudioTrack objects contained in the element.
 * @property {AudioTrack[]} audioTracks
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'audioTracks', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			var numStreams = this._video._player.availableStreams.length;
			var audioTracks = [];
			var audioTrackIndex = 0;

			audioTracks.getTrackById = function getTrackById (x)
			{
				for (var i = 0; i < this.length; i++)
				{
					if (this[i].id === x)
					{
						return this[i];
					}
				}
				return null;
			};

			for (var i = 0; i < numStreams; i++)
			{
				var availStream = this._video._player.availableStreams[i];
				var audioTrack = {
					set enabled (x)
					{
						if ((this._enabled !== null) && (x !== this._enabled))
						{
							var streamArray = [];

							if (x)
							{
								var startStream =
								{
										specType: this._playInst.STREAM_SPEC_TYPE_JUST_ID,
										type: this._playInst.STREAM_TYPE_AUDIO,
										id: this.id
								};

								streamArray.push(startStream);
								this._playInst.startStreams(streamArray);
							}
							else
							{
								var stopStream =
								{
									stopStreamTypes: this._playInst.STREAM_TYPE_AUDIO
								};

								streamArray.push(stopStream);
								this._playInst.stopStreams(streamArray);
							}
						}
						this._enabled = x;

						},
					get enabled () { return this._enabled; }
				};

				if (availStream.type === this._video._player.STREAM_TYPE_AUDIO)
				{
					var streamEnabled = false;

					audioTrack.id = availStream.id;
//					audioTracks[audioTrackIndex].kind = ;
//					audioTracks[audioTrackIndex].label = ;
					audioTrack.language = availStream.iaudio.language;
					audioTrack._playInst = this._video._player;

					for (var j = 0; j < this._video._player.activeStreams.length; j++)
					{
						var activeStream = this._video._player.activeStreams[j];

						if (activeStream.id === audioTrack.id)
						{
							streamEnabled = true;
						}
					}
					audioTrack.enabled = streamEnabled;
					audioTracks[audioTrackIndex] = audioTrack;
					audioTrackIndex++;
				}
			}

			return audioTracks;
		}

		return this._video.audioTracks;

	},
	set: function set (val)
	{
		this._video.audioTracks = val;
	},
	enumerable: true
});

/**
 * Is a Boolean that reflects the autoplay HTML attribute, indicating whether playback should
 * automatically begin as soon as enough media is available to do so without interruption.
 *
 * O5.js will by default set autoplay to true as that is the common case with TV apps.
 * @property {Boolean} [autoplay=true]
 * @htmlAttribute
 */
o5.gui.controls.Control.defineBooleanPropertyWithAttribute(o5.gui.controls.Video.prototype, 'autoplay', {
	get: function get ()
	{
		return this._video.autoplay;
	},
	set: function set (val)
	{
		if (this._video.brdSrc !== "")
		{
			this._video.autoplay = true;
		}
		else
		{
			this._video.autoplay = val;
		}
	}
});

/**
 * Returns a TimeRanges object that indicates the ranges of the media source that the browser
 * has buffered (if any) at the moment the buffered property is accessed.
 * @property {Boolean} buffered
 * @readonly
 * @htmlAttribute
 * @ignore
 */
o5.gui.controls.Control.definePropertyWithAttribute(o5.gui.controls.Video.prototype, 'buffered', {
	get: function get ()
	{
		return this._video.buffered;
	},
	enumerable: true
});

/**
 * Is a MediaController object that represents the media controller assigned to the element, or
 * null if none is assigned.
 * @property {MediaController} controller
 * @ignore
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'controller', {
	get: function get ()
	{
		return this._video.controller;
	},
	set: function set (val)
	{
		this._video.controller = val;
	},
	enumerable: true
});

/**
 * Is a Boolean that reflects the controls HTML attribute, indicating whether user interface items
 * for controlling the resource should be displayed.
 * @property {Boolean} controls
 * @htmlAttribute
 * @ignore
 */
o5.gui.controls.Control.defineBooleanPropertyWithAttribute(o5.gui.controls.Video.prototype, 'controls', {
	get: function get ()
	{
		return this._video.controls;
	},
	set: function set (val)
	{
		if (this._video.brdSrc !== "")
		{
			this._video.controls = false;
		}
		else
		{
			this._video.controls = val;
		}
	}
});

/**
 * Returns a DOMString with the absolute URL of the chosen media resource.
 * @property {String} currentSrc
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'currentSrc', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return this._video.brdSrc;
		}

		return this._video.currentSrc;

	},
	enumerable: true
});

/**
 * Is a double indicating the current playback time in seconds. Setting this value seeks the media to the new time.
 * @property {Number} currentTime
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'currentTime', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return null;
		}

		return this._video.currentTime;

	},
	set: function set (val)
	{
		if (this._video.brdSrc === "")
		{
			this._video.currentTime = val;
		}
	},
	enumerable: true
});

/**
 * @property {Boolean} defaultMuted
 * Is a Boolean that reflects the muted HTML attribute, which indicates whether the media
 * element's audio output should be muted by default.
 *
 * @ignore
 *
 */
o5.gui.controls.Control.definePropertyWithAttribute(o5.gui.controls.Video.prototype, 'defaultMuted', {
	get: function get ()
	{
		return this._video.defaultMuted;
	},
	set: function set (val)
	{
		this._video.defaultMuted = val;
	}
});

/**
 * Is a double indicating the default playback rate for the media.
 * @property {Number} defaultPlaybackRate
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'defaultPlaybackRate', {
	get: function get ()
	{
		return this._video.defaultPlaybackRate;
	},
	set: function set (val)
	{
		this._video.defaultPlaybackRate = val;
	},
	enumerable: true
});

/**
 * Returns a double indicating the length of the media in seconds, or 0 if no media data is available.
 * @property {Number} duration
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'duration', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return null;
		}

		return this._video.duration;

	},
	enumerable: true
});

/**
 * Returns a Boolean that indicates whether the media element has finished playing.
 * @property {Boolean} ended
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'ended', {
	get: function get ()
	{
		return this._video.ended;
	},
	enumerable: true
});

/**
 * Returns a MediaError object for the most recent error, or null if there has not been an error.
 * @property {MediaError} error
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'error', {
	get: function get ()
	{
		return this._video.error;
	},
	enumerable: true
});

/**
 * Is a Boolean that reflects the loop HTML attribute, which indicates whether the media element should start over when it reaches the end.
 * @property {Boolean} loop
 * @htmlAttribute
 */
o5.gui.controls.Control.defineBooleanPropertyWithAttribute(o5.gui.controls.Video.prototype, 'loop', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return false;
		}

		return this._video.loop;

	},
	set: function set (val)
	{
		if (this._video.brdSrc !== "")
		{
			this._video.loop = false;
		}
		else
		{
			this._video.loop = val;
		}
	}
});

/**
 * Is a DOMString that reflects the mediagroup HTML attribute, which indicates the name of
 * the group of elements it belongs to. A group of media elements shares a common MediaController.
 * @property {String} mediagroup
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'mediagroup', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return null;
		}

		return this._video.mediagroup;

	},
	set: function set (val)
	{
		if (this._video.brdSrc === "")
		{
			this._video.mediagroup = val;
		}
	},
	enumerable: true
});

/**
 * Is a Boolean that determines whether audio is muted. true if the audio is muted and false otherwise.
 * @property {Boolean} muted
 * @htmlAttribute
 */
o5.gui.controls.Control.defineBooleanPropertyWithAttribute(o5.gui.controls.Video.prototype, 'muted', {
	get: function get ()
	{
		return CCOM.System.muteAudio;
	},
	set: function set (val)
	{
		CCOM.System.muteAudio = val;
		var newevt = new Event("volumechange", {
			bubbles: false,
			cancelable: true
		});

		this.dispatchEvent(newevt);
	}
});

/**
 * Returns a unsigned short (enumeration) indicating the current state of fetching the media over the network.
 * @property {Number} networkState
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'networkState', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return null;
		}

		return this._video.networkState;

	},
	enumerable: true
});

/**
 * Returns a Boolean that indicates whether the media element is paused.
 * @property {Boolean} paused
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'paused', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return this._isPaused;
		}

		return this._video.paused;

	},
	enumerable: true
});

/**
 * Is a double that indicates the rate at which the media is being played back.
 * @property {Number} playbackRate
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'playbackRate', {
	get: function get ()
	{
		return this._video.playbackRate;
	},
	set: function set (val)
	{

		/* If the source is broadcast, then we need to use the Player CCOM to set the speed. */
		this._video.playbackRate = val;
		if (this._video.brdSrc !== "")
		{
			this._video._player.setSpeed(this._video.playbackRate * 100);
		}
	},
	enumerable: true
});

/**
 * Returns a TimeRanges object that contains the ranges of the media source that the browser has played, if any.
 * @property {Boolean} played
 * @htmlAttribute
 * @readonly
 */
o5.gui.controls.Control.definePropertyWithAttribute(o5.gui.controls.Video.prototype, 'played', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return null;
		}

		return this._video.played;

	},
	enumerable: true
});

/**
 * Is a DOMString that reflects the preload HTML attribute, indicating what data should be
 * preloaded, if any. Possible values are: none, metadata, auto.
 * @property {String} preload
 * @htmlAttribute
 */
o5.gui.controls.Control.definePropertyWithAttribute(o5.gui.controls.Video.prototype, 'preload', {
	get: function get ()
	{
		return this._video.preload;
	},
	set: function set (val)
	{
		this._video.preload = val;
	},
	enumerable: true
});

/**
 * Returns a unsigned short (enumeration) indicating the readiness state of the media.
 * @property {Number} readyState
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'readyState', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			if (this._readyState)
			{
				return this._video.HAVE_ENOUGH_DATA; //Returning HAVE_ENOUGH_DATA if broadcast is playing.
			}

			return this._video.HAVE_NOTHING; // Returning HAVE_NOTHING if broadcast is not playing.
		}

		return this._video.readyState;

	},
	enumerable: true
});

/**
 * Returns a TimeRanges object that contains the time ranges that the user is able to seek to, if any.
 * @property {TimeRanges} seekable
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'seekable', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return null;
		}

		return this._video.seekable;

	},
	enumerable: true
});

/**
 * Returns a Boolean that indicates whether the media is in the process of seeking to a new position.
 * @property {Boolean} seeking
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'seeking', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return this._seeking;
		}

		return this._video.seeking;

	},
	enumerable: true
});

/**
 * Is a DOMString that reflects the src HTML attribute, which contains the URL of a media resource to use.
 * @property {String} src
 * @htmlAttribute
 */
o5.gui.controls.Control.definePropertyWithAttribute(o5.gui.controls.Video.prototype, 'src', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			return this._video.brdSrc;
		}

			return this._video.src;

	},
	set: function set (val)
	{

		/* Detect if the src is for broadcast or OTT.  If broadcast we need to set the video element
		 * src to null so that it stops the playing of any OTT.  Then we can go ahead with playing
		 * the broadcast with the player CCOM.
		 */
        this.logDebug("Setting the source. " + val);

        if (this.preloadEnabled &&
           this._videoPreload._preloadSrc === val &&
           this._videoPreload._started)
        {
            this.logDebug("Source switch preload.");

            this._videoPreload._hidden = false;
            this._video._hidden = true;
            this._videoPreload.brdSrc = this._videoPreload._preloadSrc;

            this._videoPreload.style.otvPriority = 200;
            this._video.style.otvPriority = 20;


            this._videoPreload.style.visibility = "";
            this._video.style.visibility = "hidden";

/* Waiting for OTV52-6070 before activating this code.
            this._videoPreload.style.display = "inline";
            this._video.style.display = "none";
*/
            CCOM.PlayerManager.setAudioStatus(this._video._player.instanceHandle, this._video._player.AUD_OUT_VAL_FALSE);
            CCOM.PlayerManager.setAudioStatus(this._videoPreload._player.instanceHandle, this._videoPreload._player.AUD_OUT_VAL_TRUE);

            var tmpVideo = this._video;

            this._video = this._videoPreload;
            this._videoPreload = tmpVideo;
            this._videoPreload._preloadSrc = "";

            var newevt = new Event(this._video._eventMsg.pop(), {
                bubbles: false,
                cancelable: true
            });

            this.dispatchEvent(newevt);
        }
        else if (this._useCCOM(val))
		{
            this.logDebug("Source no preload.");
            var ctrlcmd = [];

            this._video.brdSrc = val;
            this._video._decoding = false;
            this._video._sessionHdl = this._video._player.play(this._video.brdSrc, ctrlcmd);
            this._video.style.visibility = "";
//            this._video.style.display = "inline";
            this._video._hidden = false;

            this._video.autoplay = true;
            this._video.controls = false;
		}
		else
		{
			this._video._player.stop();
			this._readyState = false;
			this._video.brdSrc = "";
			this._video.src = val;
		}
	}
});


/**
 * Returns the list of TextTrack objects contained in the element.
 * @property {TextTrack[]} textTracks
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'textTracks', {
	get: function get ()
	{
		if (this._video.brdSrc !== "")
		{
			var numStreams = this._video._player.availableStreams.length;
			var textTracks = [];
			var textTrackIndex = 0;

			textTracks.getTrackById = function getTrackById (x)
			{
				for (var i = 0; i < this.length; i++)
				{
					if (this[i].id === x)
					{
						return this[i];
					}
				}
				return null;
			};

			for (var i = 0; i < numStreams; i++)
			{
				var availStream = this._video._player.availableStreams[i];
				var textTrack = {
					set enabled (x)
				{
						if ((this._enabled !== null) && (x !== this._enabled))
						{
							var streamArray = [];

							if (x)
							{
								var startStream =
								{
										specType: this._playInst.STREAM_SPEC_TYPE_JUST_ID,
										type: this._playInst.STREAM_TYPE_SUBTITLE,
										id: this.id
								};

								streamArray.push(startStream);
								this._playInst.startStreams(streamArray);
							}
							else
							{
								var stopStream =
								{
									stopStreamTypes: this._playInst.STREAM_TYPE_SUBTITLE
								};

								streamArray.push(stopStream);
								this._playInst.stopStreams(streamArray);
							}
						}
						this._enabled = x;

						},
						get enabled () { return this._enabled; }
				};

				if (availStream.type === this._video._player.STREAM_TYPE_SUBTITLE)
				{
					var streamEnabled = false;

					textTrack.id = availStream.id;
//					textTrack.kind = ;
//					textTrack.label = ;
					textTrack._playInst = this._video._player;

					switch (availStream.format)
					{
					case this._video._player.STREAM_FORMAT_SUBTITLE_DVB_TLTXT_SUBTITLE:
						textTrack.language = availStream.idvbTltxtSubtitle.language;
						break;
					case this._video._player.STREAM_FORMAT_SUBTITLE_DVB_SUBTITLE:
						textTrack.language = availStream.idvbSubtitle.language;
						break;
					case this._video._player.STREAM_FORMAT_SUBTITLE_SCTE27:
						textTrack.language = availStream.iscteSubtitle.language;
						break;
					case this._video._player.STREAM_FORMAT_SUBTITLE_ARIB_CLOSED_CAPTION:
						textTrack.language = availStream.iaribCc.language;
						break;
					case this._video._player.STREAM_FORMAT_SUBTITLE_DFXP:
						textTrack.language = availStream.idfxpSubtitle.language;
						break;
					case this._video._player.STREAM_FORMAT_SUBTITLE_SRT:
						textTrack.language = availStream.isrtSubtitle.language;
						break;
					case this._video._player.STREAM_FORMAT_SUBTITLE_WEBVTT:
						textTrack.language = availStream.iwebvttSubtitle.language;
						textTrack.kind = availStream.iwebvttSubtitle.kind;
						textTrack.label = availStream.iwebvttSubtitle.label;
						break;
					default:
						break;
					}

					for (var j = 0; j < this._video._player.activeStreams.length; j++)
					{
						var activeStream = this._video._player.activeStreams[j];

						if (activeStream.id === textTrack.id)
						{
							streamEnabled = true;
							break;
						}
					}

					textTrack.enabled = streamEnabled;
					textTracks[textTrackIndex] = textTrack;
					textTrackIndex++;
				}
			}

			return textTracks;
		}

		return this._video.textTracks;

	},
	enumerable: true
});

/**
 * Returns the list of ThumbnailTrack objects contained in the element.
 * @property {ThumbnailTrack[]} thumbnailTracks
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'thumbnailTracks', {
	get: function get ()
	{

		if (!this._thumbnailTracks)
		{
			this._thumbnailTracks = new o5.gui.controls.Video.ThumbnailTrackList(this);
		}

		return this._thumbnailTracks;
	},
	enumerable: true
});

/**
 * Returns the list of VideoTrack objects contained in the element.
 * @property {VideoTrack[]} videoTracks
 * @readonly
 * @ignore
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'videoTracks', {
	get: function get ()
	{
		return this._video.videoTracks;
	},
	enumerable: true
});

/**
 * Is a double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
 * @property {number} volume
 */
Object.defineProperty(o5.gui.controls.Video.prototype, 'volume', {
	get: function get ()
	{
		return (CCOM.System.volume / 100);
	},
	set: function set (val)
{
		CCOM.System.volume = val * 100;
		var newevt = new Event("volumechange", {
			bubbles: false,
			cancelable: true
		});

		this.dispatchEvent(newevt);
	},
	enumerable: true
});




/*
 * Public methods
 */

/**
 * Returns a VideoPlaybackQuality objects that contains the current playback metrics.
 * @method getVideoPlaybackQuality
 * @return {VideoPlaybackQuality} The VideoPlaybackQuality objects that contains the current playback metrics.
 * @deprecated
 */
o5.gui.controls.Video.prototype.getVideoPlaybackQuality = function getVideoPlaybackQuality ()
{
	if (typeof this._video.getVideoPlaybackQuality === "function")
	{
		return this._video.getVideoPlaybackQuality();
	}
	return null;
};

/**
 * Adds a text track (such as a track for subtitles) to a media element.
 * @method addTextTrack
 * @param {String} kind Specifies the kind of text track.
 *                      Possible values:
 *						"subtitles"
 *						"caption"
 *						"descriptions"
 *						"chapters"
 *						"metadata"
 * @param {String} label A string specifying the label for the text track. Is used to identify the text track for the users
 * @param {String} language A two-letter language code that specifies the language (ISO 639-1) of the text track.
 * @return {Object} A new TextTrack object
 *
 * @ignore
 *
 */
o5.gui.controls.Video.prototype.addTextTrack = function addTextTrack (kind, label, language)
{
	return this._video.addTextTrack(kind, label, language);
};

/**
 * Determines whether the specified media type can be played back.
 * @method canPlayType
 * @param {String} type A string containing the MIME type of the media.
 * @return {String} A new string. Possible values are:
 * 					'probably': The specified media type appears to be playable.
 * 					'maybe': Cannot tell if the media type is playable without playing it.
 * 					'' (empty string): The specified media type definitely cannot be played.
 */
o5.gui.controls.Video.prototype.canPlayType = function canPlayType (type)
{
	return this._video.canPlayType(type);
};

/**
 * Directly seeks to the given time.
 * @method fastSeek
 * @param {Number} time Seek time.
 */
o5.gui.controls.Video.prototype.fastSeek = function fastSeek (time)
{
	this._video.fastSeek(time);
};

/**
 * Resets the media element and restarts the media resource. Any pending
 * events are discarded. How much media data is fetched is still affected
 * by the preload attribute. This method can be useful for releasing
 * resources after any src attribute and source element descendants have
 * been removed. Otherwise, it is usually unnecessary to use this method,
 * unless required to rescan source element children after dynamic changes.
 * @method load
 */
o5.gui.controls.Video.prototype.load = function load ()
{
	this._video.load();
};

/**
 * Pauses the media playback.
 * @method pause
 */
o5.gui.controls.Video.prototype.pause = function pause ()
{

	/* Use Player CCOM if the src is broadcast, else use video element. */
	if (this._video.brdSrc !== "")
	{
		this._video.playbackRate = 0;
		this._video._player.setSpeed(this._video.playbackRate * 100);
	}
	else
	{
		this._video.pause();
	}
};

/**
 * Begins playback of the media.
 * @method play
 */
o5.gui.controls.Video.prototype.play = function play ()
{

	/* Use Player CCOM if the src is broadcast, else use video element. */
	if (this._video.brdSrc !== "")
	{

		/* If in process of trick mode, then just reset to normal speed. */
		if (this._video.playbackRate !== 1)
		{
			this._video.playbackRate = 1;
			this._video._player.setSpeed(this._video.playbackRate * 100);
		}
	}
	else
	{
		this._video._sessionHdl = this._video.play();
	}
};



/*
 * Private properties
 */


/*
 * Private methods
 */
/* This will forward all the video element events up to the O5 video element. */
o5.gui.controls.Video.prototype._onforwardMsg = function _onforwardMsg (e)
{
//	this.logEntry();

	if (e.type === 'loadeddata')
	{
		this._o5video._fetchThumbnails();
	}

	e.stopImmediatePropagation();

	    if (this._hidden !== true)
	{
        var newevt = new Event(e.type, {
            bubbles: e.bubbles,
            cancelable: e.cancelable
        });

        this._o5video.dispatchEvent(newevt);
    }
};

o5.gui.controls.Video.prototype._useCCOM = function _useCCOM (uri)
{
    if ((uri !== null) && (uri.substring(0, 5) === "tv://" || uri.substring(0, 6) === "pvr://" || uri.substring(0, 7) === "file://"))
    {
        return true;
    }
    return false;
};

/* This signal is not documented. Need to find out why. */
o5.gui.controls.Video.prototype._onIframeDecode = function _onIframeDecode ()
{
    this._decoding = true;
    if (this._o5video.preloadEnabled)
    {
        if (this._hidden !== true &&
		   this._o5video._videoPreload._preloadSrc !== "" &&
		   this._o5video._videoPreload._decoding === false)
        {
            var ctrlcmd = [];

            this._o5video.logDebug("Iframe starting preload " + this._o5video._videoPreload._preloadSrc);
            this._o5video._videoPreload._started = true;
            if (this._o5video._useCCOM(this._o5video._videoPreload._preloadSrc))
                { this._o5video._videoPreload._sessionHdl = this._o5video._videoPreload._player.play(this._o5video._videoPreload._preloadSrc, ctrlcmd); }
            else
                { this._o5video._videoPreload.src = this._o5video._videoPreload._preloadSrc; }
        }
    }
};

o5.gui.controls.Video.prototype._onSpeedChanged = function _onSpeedChanged (e)
{
	if (this._o5video._video.brdSrc !== "")
	{
		var newevt = new Event("ratechange", {
			bubbles: false,
			cancelable: true
		});

		this._o5video.dispatchEvent(newevt);

		this._o5video._seeking = false;
		if (e.speedChangedInfo.newSpeed === 0)
		{
			this._o5video._isPaused = true;
			newevt = new Event("pause", {
				bubbles: false,
				cancelable: true
			});

			this._o5video.dispatchEvent(newevt);
		}
		else
		{
			this._o5video._isPaused = false;
			if (e.speedChangedInfo.newSpeed !== 100)
			{
				this._o5video._seeking = true;
				newevt = new Event("seeking", {
					bubbles: false,
					cancelable: true
				});

				this._o5video.dispatchEvent(newevt);

			}
			else
			{
				newevt = new Event("play", {
					bubbles: false,
					cancelable: true
				});

				this._o5video.dispatchEvent(newevt);
			}
		}
	}
};

o5.gui.controls.Video.prototype._onPlayStarted = function _onPlayStarted (e)
{
    this._o5video.logDebug("Play started: " + this._destUri);
    this._o5video.logDebug("Play started uri: " + e.contentStartedInfo.sourceUri);
    this._o5video.logDebug("Play started handle: " + e.contentStartedInfo.playSessionHandle);

	if (this._o5video._video.brdSrc !== "")
	{
        this._o5video._readyState = true;
		this._o5video._isPaused = false;
        if (this._hidden === true)
        {
            this._o5video.logDebug("Play started for Preload: " + this._destUri);
            this._o5video.logDebug("Play started priority: " + this.style.otvPriority);
            this._eventMsg.push("play");
        }
        else
        {
            this._o5video.logDebug("Play started: " + this._destUri);
            this._o5video.logDebug("Play started priority: " + this.style.otvPriority);
            var newevt = new Event("play", {
                bubbles: false,
                cancelable: true
            });

            this.dispatchEvent(newevt);
        }
	}
};

o5.gui.controls.Video.prototype._playFailed = function _playFailed (e)
{
    this._o5video.logDebug("Play failed: " + this._destUri);
    this._o5video.logDebug("Play failed handle: " + e.handle);
    this._o5video.logDebug("Play failed target: " + e.target);
    this._o5video.logDebug("Play failed message: " + e.error.message);
    this._o5video.logDebug("Play failed name: " + e.error.name);

    if (this._o5video._video.brdSrc !== "")
    {
        if (this._hidden === true)
        {
            this._preloadSrc = "";
        }
        else
        {

            var newevt = new Event("error", {
                bubbles: false,
                cancelable: true
            });

            this._o5video.dispatchEvent(newevt);
        }
    }
};

o5.gui.controls.Video.prototype._onPlayError = function _onPlayError (e)
{
    this._o5video.logDebug("Play error: " + this._destUri);
    this._o5video.logDebug("Play error uri: " + e.contentErrorInfo.sourceUri);
    this._o5video.logDebug("Play error handle: " + e.contentErrorInfo.playSessionHandle);
    this._o5video.logDebug("Play error reason: " + e.contentErrorInfo.reason);
    if (this._o5video._video.brdSrc !== "")
    {
        if (this._hidden === true)
        {
            this._preloadSrc = "";
        }
        else
        {
            var newevt = new Event("error", {
                bubbles: false,
                cancelable: true
            });

            this._o5video.dispatchEvent(newevt);
        }
    }
};

o5.gui.controls.Video.prototype._onPlayStartFailed = function _onPlayStartFailed (e)
{
    this._o5video.logDebug("Play start failed: " + this._destUri);
    this._o5video.logDebug("Play failed uri: " + e.contentStartFailedInfo.sourceUri);
    this._o5video.logDebug("Play failed handle: " + e.contentStartFailedInfo.playSessionHandle);
    this._o5video.logDebug("Play failed reason" + e.contentStartFailedInfo.reason);
    if (this._o5video._video.brdSrc !== "")
    {
        if (this._hidden === true)
        {
            this._preloadSrc = "";
        }
        else
        {
            if (e.contentStartFailedInfo.sourceUri === this._o5video._video.brdSrc) {
            	this._player.stop();
	            var newevt = new Event("error", {
	                bubbles: false,
	                cancelable: true
	            });

	            this._o5video.dispatchEvent(newevt);
            }
        }
    }
};

o5.gui.controls.Video.prototype._onStreamDisabled = function _onStreamDisabled ()
{
    this._o5video.logDebug("stream disabled: " + this._destUri);
    if (this._o5video._video.brdSrc !== "")
    {
        if (this._hidden === true)
        {
            this._preloadSrc = "";
        }
        else
        {
            var newevt = new Event("error", {
                bubbles: false,
                cancelable: true
            });

            this._o5video.dispatchEvent(newevt);
        }
    }
};

o5.gui.controls.Video.prototype._onError = function _onError ()
{
    this._o5video.logDebug("error: " + this._destUri);
    this._o5video.logDebug("error priority: " + this.style.otvPriority);
    if (this._hidden === true)
    {
        this._o5video.logError("Error for hidden window");
    }
	if (this._o5video._video.brdSrc !== "")
	{
		var newevt = new Event("error", {
			bubbles: false,
			cancelable: true
		});

		this._o5video.dispatchEvent(newevt);
	}
};

/**
 * This will attempt to tune a second video window.  It can be used to
 * speed up channel change time.
 * @method preloadUri
 * @param {String} uri The uri to preload.
 */
o5.gui.controls.Video.prototype.preloadUri = function preloadUri (uri)
{
    this.logDebug("Preloading called. " + uri);
    if (!this.preloadEnabled)
    {
        this._videoPreload = this.ownerDocument.createElement("video");
        this._videoPreload._o5video = this;
        this._videoPreload.autoplay = true;
        this._createVideoElem(this._videoPreload, 20);
        //    this._videoPreload.style.display = "none";
        this._videoPreload.style.visibility = "hidden";
        this.preloadEnabled = true;
    }
	this._videoPreload._preloadSrc = uri;
//    this._videoPreload.style.display = "none";
	this._videoPreload.style.visibility = "hidden";
    this._videoPreload._hidden = true;
    this._videoPreload._started = false;
    this._videoPreload._decoding = false;
    if (this._video._decoding && this._videoPreload._preloadSrc !== "")
    {
        var ctrlcmd = [];

        this.logDebug("Start Preloading " + uri);

        this._videoPreload._started = true;
        if (this._useCCOM(uri))
        {
			this._videoPreload._sessionHdl = this._videoPreload._player.play(this._videoPreload._preloadSrc, ctrlcmd);
		}
        else
        {
			this._videoPreload.src = this._videoPreload._preloadSrc;
		}
    }
};

/**
 * This register or unregister video element listeners.
 * @method _videoEventListener
 * @param {String} funcName The name of function to use.
 *                      Possible values:
 *						"addEventListener"
 *						"removeEventListener"
 * @param {Object} vidElem The o5-video element that you want to swap video elements with.
 *
 * @ignore
 */
o5.gui.controls.Video.prototype._videoEventListener = function _videoEventListener (funcName, vidElem)
{
	if (funcName === "addEventListener")
	{
		this._boundFun = this._onforwardMsg.bind(vidElem);
	}

    vidElem[funcName]('loadeddata', 	this._boundFun, true);
    vidElem[funcName]('abort', 			this._boundFun, true);
    vidElem[funcName]('canplay', 		this._boundFun, true);
    vidElem[funcName]('canplaythrough', this._boundFun, true);
    vidElem[funcName]('durationchange', this._boundFun, true);
    vidElem[funcName]('emptied', 		this._boundFun, true);
    vidElem[funcName]('ended', 			this._boundFun, true);
    vidElem[funcName]('error', 			this._boundFun, true);
    vidElem[funcName]('loadedmetadata', this._boundFun, true);
    vidElem[funcName]('loadstart',		this._boundFun, true);
    vidElem[funcName]('pause', 			this._boundFun, true);
    vidElem[funcName]('play', 			this._boundFun, true);
    vidElem[funcName]('playing', 		this._boundFun, true);
    vidElem[funcName]('progress', 		this._boundFun, true);
    vidElem[funcName]('ratechange', 	this._boundFun, true);
    vidElem[funcName]('seeked', 		this._boundFun, true);
    vidElem[funcName]('seeking', 		this._boundFun, true);
    vidElem[funcName]('stalled', 		this._boundFun, true);
    vidElem[funcName]('suspend', 		this._boundFun, true);
    vidElem[funcName]('timeupdate', 	this._boundFun, true);
    vidElem[funcName]('volumechange', 	this._boundFun, true);
	vidElem[funcName]('waiting', 		this._boundFun, true);
};

o5.gui.controls.Video.prototype._fetchThumbnails = function _fetchThumbnails ()
{
	if (!this.src.startsWith('http'))
	{
		return;
	}

	var filename = this.src.split('/').pop();
	var path = this.src.substring(0, this.src.lastIndexOf("/") + 1);

	filename = filename.substr(0, filename.lastIndexOf('.'));

	var vtt = document.createElement('track');

	vtt._o5video = this;
	vtt._path = path;
	vtt.addEventListener('load', this._thumbnailDataLoaded, true);
	vtt.src = path + filename + ".vtt";
	vtt.track.mode = 'hidden';
	this._video.appendChild(vtt);
};

o5.gui.controls.Video.prototype._thumbnailDataLoaded = function _thumbnailDataLoaded ()
{
	for (var i = 0; i < this.track.cues.length; i++)
	{
		this.track.cues[i].url = this._path + this.track.cues[i].text;
	}

	this._o5video.thumbnailTracks._addTrack(this.track);
};


o5.gui.controls.Video.ThumbnailTrackList = function ThumbnailTrackList (tag)
{
	this._tag = tag;
	this._tracks = [];
};

o5.gui.controls.Video.ThumbnailTrackList.prototype.__proto__ = o5.EventTarget.prototype;


Object.defineProperty(o5.gui.controls.Video.ThumbnailTrackList.prototype, 'length', {
	get: function get ()
	{
		return this._tracks.length;
	},
	enumerable: true
});


o5.gui.controls.Video.ThumbnailTrackList.prototype._addTrack = function _addTrack (track)
{
	this[0] = new o5.gui.controls.Video.ThumbnailTrack(this._tag, track);

	this._tracks.push(this[0]);

	this.dispatchEvent(new Event('addtrack'), { track: track });
};


o5.gui.controls.Video.ThumbnailTrack = function ThumbnailTrack (tag, track)
{
	this._tag = tag;
	this._track = track;

	Object.defineProperty(this, 'id', { value: '', enumerable: true });
	Object.defineProperty(this, 'kind', { value: 'thumbnails', enumerable: true });
	Object.defineProperty(this, 'label', { value: '', enumerable: true });
	Object.defineProperty(this, 'language', { value: '', enumerable: true });

	Object.defineProperty(this, 'activeCues', { get: function get ()
	{
		return this._track.activeCues;
	}, enumerable: true });

	Object.defineProperty(this, 'cues', { get: function get ()
	{
		return this._track.cues;
	}, enumerable: true });

	Object.defineProperty(this, 'nextCue', { get: function get ()
	{

		var time = this._tag.currentTime;

		for (var c = 0; c < this.cues.length; c++)
		{
			if (this.cues[c].startTime - ((this.cues[c].endTime - this.cues[c].startTime) * 0.5) > time)
			{
				return this.cues[c];
			}
		}

		return null;

	}, enumerable: true });

	Object.defineProperty(this, 'previousCue', { get: function get ()
	{

		var time = this._tag.currentTime;

		for (var c = this.cues.length - 1; c >= 0; c--)
		{
			if (this.cues[c].endTime - ((this.cues[c].endTime - this.cues[c].startTime) * 0.5) < time)
			{
				return this.cues[c];
			}
		}

		return null;

	}, enumerable: true });
};
