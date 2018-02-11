/* Implementation of the Main View, which act as the view controller */

app.views.Video = function Video () {};
o5.gui.controls.Control.registerAppControl(app.views.Video, o5.gui.controls.View);

/**
 * @method createdCallback
 * @private
 */
app.views.Video.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this.onkeydown = this._onKeyDown;
	this.onfocus = this._onFocus;
	this.onblur = this._onBlur;
    this.onload = this._onLoad;

    this.tunedChannel = {};
    this.channelToTune = null;
    this.currentVideo = {};
    this.isLive = false;
    this.isRecover = false;

    $util.ControlEvents.on("app-video", "setSrc", function (data, isRecover) {
        this.isRecover = isRecover;
        if (data.uri.substring(0, 5) === "tv://") { //set channelToTune, to be update if there are other protocols when tune to a channel
            this.channelToTune = data;
            if (this.videoPlayer.src !== data.uri) {
                this.videoPlayer.src = data.uri;
                $util.ControlEvents.fire("app-video", "channelChanged", data);//for surf to update current channel
        }
        } else {
            this.channelToTune = null;
            this.videoPlayer.src = data.uri;
        }
        this.currentVideo = data;
    }, this);
    $util.ControlEvents.on("app-video", "play", function () {
        if (!this.videoPlayer.seeking || this.videoPlayer.paused) {
            this.videoPlayer.playbackRate = 1;
        	this.videoPlayer.play();
        	this.isRecover = true;
        }
    }, this);
    $util.ControlEvents.on("app-video", "pause", function () {
        if (!this.videoPlayer.paused) {
            this.videoPlayer.pause();
        }
    }, this);
    $util.ControlEvents.on("app-video", "setSpeed", function (speed) {
        this.videoPlayer.playbackRate = speed;
    }, this);
    $util.ControlEvents.on("app-video", "seek", function (position) {
        this.videoPlayer.currentTime += position;
    }, this);
    $util.ControlEvents.on("app-video", "stop", function () {
        this.videoPlayer.src = "";
    }, this);
    $util.ControlEvents.on("app-video", "setSubtitle", function (status, lang) {
        var i = 0,
            textTracks = this.videoPlayer.textTracks;

        if (status) {
            for (i = 0; i < textTracks.length; i++) {
                textTracks[i].mode = "hidden";
                if (textTracks[i].language && textTracks[i].language === lang) {
                    textTracks[i].mode = "showing";
                }
            }
        } else {
            for (i = 0; i < textTracks.length; i++) {
                textTracks[i].mode = "hidden";
            }
        }
    }, this);
    $util.ControlEvents.on("app-video", "setAudio", function (lang) {
        var i = 0,
            audioTracks = this.videoPlayer.audioTracks;

        for (i = 0; i < audioTracks.length; i++) {
            audioTracks[i].enabled = false;
            if (audioTracks[i].language && audioTracks[i].language === lang) {
                audioTracks[i].enabled = true;
            }
        }
    }, this);
    $util.Events.once("app:boot", this.tuneOnBoot);

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.Video.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();
	$util.Events.fire("app:view:attached", "video");
	this.logExit();
};


/**
 * @method _onLoad
 * @private
 */
app.views.Video.prototype._onLoad = function _onLoad () {
	var tuner = null;
    app.views.Video.prototype.videoPlayer = this.children.fullScreenVideo;
    this.videoPlayer.addEventListener('seeking', this.showVideoBuffering.bind(this));
    this.videoPlayer.addEventListener('seeked', this.onVideoSeek.bind(this));
    this.videoPlayer.addEventListener('error', this.onError.bind(this));
    this.videoPlayer.addEventListener('waiting', this.onWaiting.bind(this));
    this.videoPlayer.addEventListener('playing', this.onPlaying.bind(this));
    this.videoPlayer.addEventListener('abort', this.hideVideoBuffering.bind(this));
    this.videoPlayer.addEventListener('loadedmetadata', this.onLoadedMetadata.bind(this));
    this.videoPlayer.addEventListener('play', this.onPlay.bind(this));
    this.videoPlayer.addEventListener('pause', this.onPause.bind(this));
    this.videoPlayer.addEventListener('ended', this.onEnd.bind(this));
    this.videoPlayer._video._player.addEventListener("onLockerStatusUpdate", function (e) {
        $util.ControlEvents.fire("lockerManager", "lockerStatusUpdate", e);
    });
    tuner =  new o5.platform.output.Tuner(this.videoPlayer);
    $service.tuner.Signal.init(tuner);
};

/**
 * @method showVideoBuffering
 *
 */
app.views.Video.prototype.showVideoBuffering = function showVideoBuffering () {

};

/**
 * @method onVideoSeek
 *
 */
app.views.Video.prototype.onVideoSeek = function onVideoSeek () {

};

/**
 * @method onError
 *
 */
app.views.Video.prototype.onError = function onError () {

};

/**
 * @method onWaiting
 *
 */
app.views.Video.prototype.onWaiting = function onWaiting () {

};

/**
 * @method onPlaying
 *
 */
app.views.Video.prototype.onPlaying = function onPlaying () {

};

/**
 * @method hideVideoBuffering
 *
 */
app.views.Video.prototype.hideVideoBuffering = function hideVideoBuffering () {

};

/**
 * @method onLoadedMetadata
 *
 */
app.views.Video.prototype.onLoadedMetadata = function onLoadedMetadata () {

};

/**
 * @method onPlay
 *
 */
app.views.Video.prototype.onPlay = function onPlay () {
    $util.ControlEvents.fire("app-video", "videoStarted", this.currentVideo); //fire event to player gui to update data
	if (this.channelToTune || this.videoPlayer.src.substring(0, 5) === "tv://") {
	    this.isLive = true;
        if (o5.gui.viewManager.activeView.localName !== "app-surf" && this.isRecover === false) {
            $util.Events.fire("app:navigate:to", "surf");
        }
        if (this.channelToTune) {
            o5.platform.system.Preferences.set("tv.previousServiceId", this.tunedChannel.serviceId);
            o5.platform.system.Preferences.set("tv.currentServiceId", this.channelToTune.serviceId);
            this.tunedChannel = this.channelToTune;
            this.channelToTune = null;
        }
	} else {
            this.isLive = false;
            if (!this.isRecover) {
                $util.Events.fire("app:navigate:to", "player");
            }
    }
};

/**
 * @method onPause
 *
 */
app.views.Video.prototype.onPause = function onPause () {

};

/**
 * @method onPause
 *
 */
app.views.Video.prototype.onEnd = function onEnd () {
    $util.ControlEvents.fire("app-player", "stop");
};

/*
 * @method tuneOnBoot
 */
app.views.Video.prototype.tuneOnBoot = function tuneOnBoot () {
    var lastTunedServiceId = o5.platform.system.Preferences.get("tv.currentServiceId"),
        channelToTune = $service.EPG.Channel.getByServiceId(lastTunedServiceId) || $service.EPG.Channel.get()[0];

    if (this.videoPlayer && channelToTune) {
        this.videoPlayer.src = channelToTune.uri;
        this.channelToTune = channelToTune;
        this.currentVideo = channelToTune;
    }
};

/**
 * @method _onFocus
 */
app.views.Video.prototype._onFocus = function _onFocus () {
};

/**
 * @method _onBlur
 */
app.views.Video.prototype._onBlur = function _onBlur () {
};


/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.views.Video.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	if (e.repeat) {
		return;
	}

	switch (e.key) {
        case "ChannelUp":
            $util.ControlEvents.fire("app-video", "setSrc", $service.EPG.Channel.getNextService(this.tunedChannel));
            e.stopImmediatePropagation();
            break;
        case "ChannelDown":
            $util.ControlEvents.fire("app-video", "setSrc", $service.EPG.Channel.getPreviousService(this.tunedChannel));
            e.stopImmediatePropagation();
            break;
        case "Info":
		case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "Ok":
        case "Enter":
            $util.Events.fire("app:navigate:to", "surf");
            e.stopImmediatePropagation();
            break;
        case "Record":
        case "Favorites":
            $util.Events.fire("app:navigate:to", "surf");
            $util.ControlEvents.fire("app-surf", "favorite");
            e.stopImmediatePropagation();
            break;
        case "Play":
        case "Pause":
        case "Rewind":
        case "FastForward":
        case "TrackPrevious":
        case "TrackNext":
            $util.Events.fire("app:navigate:to", "player");
            $util.ControlEvents.fire("app-player", "key:down", e);
            e.stopImmediatePropagation();
			break;
        case "Yellow":
            $util.ControlEvents.fire(":audioAndCCOptionsDialog", "show", this._currentContent);
            $util.ControlEvents.fire(":audioAndCCOptionsDialog", "focus");
            e.stopImmediatePropagation();
            break;
        default:
            break;
	}

	this.logExit();
};
