/**
 * @class app.gui.controls.DialogAudioAndCcOptions
 */

app.gui.controls.DialogAudioAndCcOptions = function DialogAudioAndCcOptions () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogAudioAndCcOptions, app.gui.controls.HtmlDialogContainer);

app.gui.controls.DialogAudioAndCcOptions.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._player = document.querySelector('#videoView').videoPlayer;
	this._textTracks = this._player.textTracks;
	this._audioTracks = this._player.audioTracks;
	this._currentAudioLangIndex = 0;
	this._audioLang = this.querySelector('#audioAndCcOptionsAudioLang');
	this._ccStatus = false;
	this._getCurrentCCStatus = function () { //TBD: Current CC status should be retreived from current content or get/set from setting/config?
		for (var i = 0; i < this._textTracks.length; i++) {
			if (this._textTracks[i].mode === "showing") {
				return "On";
			}
		}
		return "Off";
	};
	this._getCurrentAudioLang = function () {

		for (var i = 0; i < this._audioTracks.length; i++) {
            if (this._audioTracks[i].enabled && this._audioTracks[i].language) {
            	this._currentAudioLangIndex = i;
                return this._audioTracks[i].language;
            }
        }
        return "eng";
	};
    $util.ControlEvents.on([
        ":audioAndCcOptionsCc",
        ":audioAndCcOptionsAudioLang"
    ], "back", function () {
        $util.ControlEvents.fire(":audioAndCCOptionsDialog", "hide");
    }, this);
    $util.ControlEvents.on([
        ":audioAndCcOptionsCc",
        ":audioAndCcOptionsAudioLang"
    ], "enter", function () {
        $util.ControlEvents.fire(":audioAndCCOptionsDialog", "hide");
        $util.ControlEvents.fire("app-video", "setAudio", this._audioLang._data);
        $util.ControlEvents.fire("app-video", "setSubtitle", this._ccStatus, "eng");
        //TBD: which language should be turned on if there are multiple language? Hans: safely assume there will be only English as subtitles.
    }, this);
    $util.ControlEvents.on(":audioAndCcOptionsCc", "exit:down", function () {
        $util.ControlEvents.fire(":audioAndCcOptionsAudioLang", "focus");
    }, this);
    $util.ControlEvents.on(":audioAndCcOptionsAudioLang", "exit:up", function () {
        $util.ControlEvents.fire(":audioAndCcOptionsCc", "focus");
    }, this);
    $util.ControlEvents.on(":audioAndCcOptionsCc", "exit:left", function (ctrl) {
        $util.ControlEvents.fire(":audioAndCcOptionsCc", "toggle");
        this._ccStatus = ctrl.textContent === "On";
    }, this);
    $util.ControlEvents.on(":audioAndCcOptionsCc", "exit:right", function (ctrl) {
        $util.ControlEvents.fire(":audioAndCcOptionsCc", "toggle");
        this._ccStatus = ctrl.textContent === "On";
    }, this);
    $util.ControlEvents.on(":audioAndCcOptionsAudioLang", "exit:left", function () {
        if (this._audioTracks.length > 1) {
            this._currentAudioLangIndex = this._currentAudioLangIndex === 0 ? this._audioTracks.length - 1 : --this._currentAudioLangIndex;
            if (this._audioTracks[this._currentAudioLangIndex].language) {
                $util.ControlEvents.fire(":audioAndCcOptionsAudioLang", "reset", this._audioTracks[this._currentAudioLangIndex].language);
            }
        }
    }, this);
    $util.ControlEvents.on(":audioAndCcOptionsAudioLang", "exit:right", function () {
        if (this._audioTracks.length > 1) {
            this._currentAudioLangIndex = this._currentAudioLangIndex === this._audioTracks.length - 1 ? 0 : ++this._currentAudioLangIndex;
            if (this._audioTracks[this._currentAudioLangIndex].language) {
                $util.ControlEvents.fire(":audioAndCcOptionsAudioLang", "reset", this._audioTracks[this._currentAudioLangIndex].language);
            }
        }
    }, this);

	this.logExit();
};

/**
 * @method _store
 */
app.gui.controls.DialogAudioAndCcOptions.prototype._store = function _store () {
	this.logEntry();
	console.log("dialog settings not stored");
	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.DialogAudioAndCcOptions.prototype._show = function _show () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.DialogAudioAndCcOptions.prototype._populate = function _populate () {
    this.logEntry();
    this.superCall();
    $util.ControlEvents.fire(":audioAndCcOptionsCc", "reset", this._getCurrentCCStatus());
    $util.ControlEvents.fire(":audioAndCcOptionsAudioLang", "reset", this._getCurrentAudioLang());
    this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.DialogAudioAndCcOptions.prototype._focus = function _focus () {
    this.logEntry();
    $util.ControlEvents.fire(":audioAndCcOptionsCc", "focus");
    this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.DialogAudioAndCcOptions.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.DialogAudioAndCcOptions.prototype._onKeyDown = function _onKeyDown () {
	this.logEntry();
	this.logExit();
};

/**
 * @class app.gui.controls.AudioAndCcOptionsCc
 */

app.gui.controls.AudioAndCcOptionsCc = function AudioAndCcOptionsCc () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.AudioAndCcOptionsCc, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.AudioAndCcOptionsCc.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "focused";
    this.logExit();
};

/**
 * @method _reset
 */
app.gui.controls.AudioAndCcOptionsCc.prototype._reset = function _reset (data) {
    this.logEntry();
    this.textContent = data;
    this.logExit();
};

/**
 * @method _toggle
 */
app.gui.controls.AudioAndCcOptionsCc.prototype._toggle = function _reset () {
    this.logEntry();
    this.textContent = this.textContent === "On" ? "Off" : "On";
    this.logExit();
};

/**
 * @class app.gui.controls.AudioAndCcOptionsAudio
 */

app.gui.controls.AudioAndCcOptionsAudio = function AudioAndCcOptionsAudio () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.AudioAndCcOptionsAudio, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.AudioAndCcOptionsAudio.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "focused";
    this.logExit();
};

/**
 * @method _reset
 */
app.gui.controls.AudioAndCcOptionsAudio.prototype._reset = function _reset (data) {
    this.logEntry();
    this._clear();
    this._data = data;
    this.textContent = $util.constants.AUDIO_LANGUAGE[data] || data;
    this.logExit();
};
