/* Implementation of the Player View, which acts as the view controller */

app.views.Player = function Player () {};
o5.gui.controls.Control.registerAppControl(app.views.Player, o5.gui.controls.View, null, true);


/**
 * @method createdCallback
 * @private
 */
app.views.Player.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this._player = this.querySelector('#player');
	this._miniSynopsis = this.querySelector('#playerMiniSynopsis');

	$util.ControlEvents.on("app-player", "fetch", function () {
		$util.ControlEvents.fire("app-player:tmBufferText", "fetch", this._currentContent);
		$util.ControlEvents.fire("app-player:playerBanner", "fetch", this._currentContent);
	}, this);

	$util.ControlEvents.on("app-player:ctaPlayer", "ctaChannelView", function () {
//		$util.ControlEvents.fire("app-surf", "fetch", null);
		$util.Events.fire("app:navigate:to", "surf");
	}, this);
	$util.ControlEvents.on("app-player:ctaPlayer", "ctaInfo", function () {
		this._showMiniSynopsis();
	}, this);
	$util.ControlEvents.on("app-player:ctaPlayer", "ctaClose", function () {
		this._hideMiniSynopsis();
	}, this);
    $util.ControlEvents.on("app-player:ctaPlayer", "ctaFullDetails", function () {
        if (this._currentContent) {
            $util.ControlEvents.fire("app-player", "hide");
            $util.ControlEvents.fire("app-synopsis", "fetch", this._currentContent);
            $util.Events.fire("app:navigate:to", "synopsis");
        }
        $util.ControlEvents.fire("app-surf:ctaPlayer", "swap", "ctaFullDetails", "ctaInfo");
    }, this);
    $util.ControlEvents.on("app-player:ctaPlayer", "ctaJumpTo", function () {
        if (this._currentContent) {
            $util.ControlEvents.fire(":bookmarksDialog", "show", this._currentContent);
            $util.ControlEvents.fire(":bookmarksDialog", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-player:ctaPlayer", "ctaOptions", function () {
        if (this._currentContent) {
            $util.ControlEvents.fire(":audioAndCCOptionsDialog", "show", this._currentContent);
            $util.ControlEvents.fire(":audioAndCCOptionsDialog", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-player", "key:down", function (key) {
        this._onKeyDown(key);
    }, this);
    $util.ControlEvents.on("app-player", "stop", function () {
        var lastTunedServiceId = o5.platform.system.Preferences.get("tv.currentServiceId"),
            channelToTune = $service.EPG.Channel.getByServiceId(lastTunedServiceId) || $service.EPG.Channel.get()[0];

        $util.ControlEvents.fire("app-video", "stop");
        if (channelToTune) {
            $util.ControlEvents.fire("app-video", "setSrc", channelToTune, true);
		}
        $util.ControlEvents.fire("app-synopsis", "fetch", this._currentContent);
        $util.Events.fire("app:navigate:back");
    }, this);
    $util.ControlEvents.on("app-player", "hide", this._hide, this);
    $util.ControlEvents.on("app-player", "show", this._show, this);
    $util.ControlEvents.on("app-video", "videoStarted", function (data) {
        this._currentContent = data;
        this._currentSpeedIndex = 0;
        this._isFw = false;
        this._isRw = false;
    }, this);
    this._speedArr = [ 100, 200, 400, 1600, 3200, 6400 ];
	this._focusedElem = null; // focused element

	this.onkeydown = this._onKeyDown;
	this.onfocus = this._onFocus;
	this.onblur = this._onBlur;
	this.onload = this._onLoad;
	this.onshow = this._onShow;
	this.onhide = this._onHide;
	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.Player.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();
	$util.Events.fire("app:view:attached", "player");
	this.logExit();
};

/**
 * @method _onLoad
 * @private
 */
app.views.Player.prototype._onLoad = function _onLoad () {
	this.logEntry();
	this._loaded = true;
	this.logExit();
};

/**
 * @method _onFocus
 */
app.views.Player.prototype._onFocus = function _onFocus () {
	this.logEntry();
	if (this._focusedElem) {
		this._focusedElem.focus();
	} else {
		this.focus();
	}
	this.logExit();
};

/**
 * @method _onBlur
 */
app.views.Player.prototype._onBlur = function _onBlur () {
	this.logEntry();
	this.logExit();
};

/**
 * @method _onShow
 */
app.views.Player.prototype._onShow = function _onShow () {
	this.logEntry();

	var updateTrickBanner = function () {
		console.log(Date.now());
		$util.ControlEvents.fire("app-player", "fetch");
	};

	updateTrickBanner();
	$util.ControlEvents.fire("app-player:trickMode", "fetch");
	$util.ControlEvents.fire("app-player:trickMode", "show");
	this.updateTimer = setInterval(updateTrickBanner, 10000);
	$util.ControlEvents.fire("app-player:ctaPlayer", "fetch");

    this.className = "oxygen-transition-none-prepareDisplay oxygen-transition-none-bringIn";
	this.logExit();
};

/**
 * @method _onHide
 */
app.views.Player.prototype._onHide = function _onHide () {
	this.logEntry();
	this._hideMiniSynopsis();
	clearInterval(this.updateTimer);
    clearTimeout(this._timeoutTrigger);
	this.logExit();
};

/**
 * @method _hide
 * @private
 */
app.views.Player.prototype._hide = function _hide () {
    this.logEntry();
    this.className = "oxygen-transition-fade-bringOut";
    this.logExit();
};

/**
 * @method _show
 * @private
 */
app.views.Player.prototype._show = function _show () {
    this.logEntry();
    this.className = "oxygen-transition-none-prepareDisplay oxygen-transition-none-bringIn";
    this.logExit();
};

/**
 * @method _timeoutReset
 * @private
 */
app.views.Player.prototype._timeoutReset = function _timeoutReset () {
    this.logEntry();
    clearTimeout(this._timeoutTimer);
    if (this.className === "oxygen-transition-fade-bringOut") {
        $util.ControlEvents.fire("app-player", "show");
	}
    this._timeoutTimer = setTimeout(
        this._timeoutTrigger,
        $config.getConfigValue("settings.notifications.banner.timeout") * 1000
    );
    this.logExit();
};

/**
 * @method _timeoutTrigger
 * @private
 */
app.views.Player.prototype._timeoutTrigger = function _timeoutTrigger () {
    this.logEntry();
    $util.ControlEvents.fire("app-player", "hide");
    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.views.Player.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	var handled = false;

    this._timeoutReset();
	switch (e.key) {
		case "Stop":
			$util.ControlEvents.fire("app-player", "stop");
            $util.Events.fire("app:navigate:back");
			handled = true;
			break;
		case "Pause":
			$util.ControlEvents.fire("service:trickmode", "update", { mode: "pause", speed: 0 });
            $util.ControlEvents.fire("app-video", "pause");
			handled = true;
			break;
		case "Play":
			$util.ControlEvents.fire("service:trickmode", "update", { mode: "play", speed: 100 });
            $util.ControlEvents.fire("app-video", "play");
			handled = true;
			break;
		case "FastForward":
        case "Forward":
			if (this._isRw) {
                this._currentSpeedIndex = 0;
			}
			if (this._currentSpeedIndex < this._speedArr.length - 1) {
				this._currentSpeedIndex++;
			}
			$util.ControlEvents.fire("service:trickmode", "update", { mode: "forward", speed: this._speedArr[this._currentSpeedIndex] });
            $util.ControlEvents.fire("app-video", "setSpeed", this._speedArr[this._currentSpeedIndex] / 100);
            this._isFw = true;
            this._isRw = false;
			handled = true;
			break;
		case "Rewind":
            if (this._isFw) {
                this._currentSpeedIndex = 0;
            }
            if (this._currentSpeedIndex < this._speedArr.length - 1) {
                this._currentSpeedIndex++;
            }
			$util.ControlEvents.fire("service:trickmode", "update", { mode: "rewind", speed: -(this._speedArr[this._currentSpeedIndex]) });
            $util.ControlEvents.fire("app-video", "setSpeed", -(this._speedArr[this._currentSpeedIndex] / 100));
            this._isRw = true;
            this._isFw = false;
			handled = true;
			break;
		case "TrackPrevious":
			$util.ControlEvents.fire("service:trickmode", "update", { mode: "skip-rewind" });
            $util.ControlEvents.fire("app-video", "seek", -20); //20s seeking once press TrackPrevious
            $util.ControlEvents.fire("app-player", "show");
			handled = true;
			break;
		case "TrackNext":
			$util.ControlEvents.fire("service:trickmode", "update", { mode: "skip-forward" });
            $util.ControlEvents.fire("app-video", "seek", 20); //20s seeking once press TrackNext
			handled = true;
			break;
        case "Back":
            if (this._player.classList.contains("synopsisView")) {
                this._hideMiniSynopsis();
                //$util.ControlEvents.fire("app-surf:ctaPlayer", "swap", "ctaInfo", "ctaFullDetails");
            } else {
                $util.ControlEvents.fire("app-player", "stop");
            }
            handled = true;
            break;
		default:
			break;
	}

	if (handled === true) {
		e.stopImmediatePropagation();
		e.preventDefault();
	} else {
		$util.ControlEvents.fire("app-player:ctaPlayer", "key:down", e);
	}
	this.logExit();
};

/**
 * _hideMiniSynopsis
 */
app.views.Player.prototype._hideMiniSynopsis = function _hideMiniSynopsis () {

	this._player.classList.remove("synopsisView");
	$util.ControlEvents.fire("app-player:playerMiniSynopsis", "hide");

	$util.ControlEvents.fire("app-player:ctaPlayer", "swap", "ctaFullDetails", "ctaInfo");

	this._synopsisVisible = false;
};

/**
 * _showMiniSynopsis
 */
app.views.Player.prototype._showMiniSynopsis = function _showMiniSynopsis () {

	this._player.classList.add("synopsisView");
	$util.ControlEvents.fire("app-player:playerMiniSynopsis", "fetch", this._currentContent);
	$util.ControlEvents.fire("app-player:playerMiniSynopsis", "show");

	$util.ControlEvents.fire("app-player:ctaPlayer", "swap", "ctaInfo", "ctaFullDetails");

	this._synopsisVisible = true;
};
