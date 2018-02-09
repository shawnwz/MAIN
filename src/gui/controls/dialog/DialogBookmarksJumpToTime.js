/**
 * @class app.gui.controls.DialogBookmarksJumpToTime
 */

app.gui.controls.DialogBookmarksJumpToTime = function DialogBookmarksJumpToTime () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogBookmarksJumpToTime, app.gui.controls.HtmlDialogContainer);

app.gui.controls.DialogBookmarksJumpToTime.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
    this._dialog = {
        title    : "Enter time to jump to",
        text     : "Use the number buttons on your remote control to enter a time.",
        subText  : "",
        errorCode: ""
    };
	this.logExit();
};

/**
 * @method _store
 */
app.gui.controls.DialogBookmarksJumpToTime.prototype._store = function _store () {
	this.logEntry();
	console.log("dialog settings not stored");
	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.DialogBookmarksJumpToTime.prototype._show = function _show () {
	this.logEntry();
	this.superCall();
    this.fireControlEvent("populate", this._dialog);
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.DialogBookmarksJumpToTime.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
    $util.ControlEvents.fire(":jumpToTimeBox", "clear");
    $util.ControlEvents.fire("app-player", "focus");
	this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.DialogBookmarksJumpToTime.prototype._focus = function _focus () {
    this.logEntry();
    $util.ControlEvents.fire(":jumpToTimeBox", "focus");
    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.DialogBookmarksJumpToTime.prototype._onKeyDown = function _onKeyDown () {
	this.logEntry();
	this.logExit();
};

/**
 * @class app.gui.controls.JumpToTimeBox
 */

app.gui.controls.JumpToTimeBox = function JumpToTimeBox () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.JumpToTimeBox, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.JumpToTimeBox.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._player = document.querySelector('#videoView').videoPlayer;
    this.onkeydown = this._onKeyDown;
    this._maxLen = 4;
    this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.JumpToTimeBox.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();
    this.superCall();
    if (this.id) {
        this.onControlEvent("clear", this._clear);
    }
    this.itemData = "";
	this.logExit();
};

/**
 * @method _clear
 */
app.gui.controls.JumpToTimeBox.prototype._clear = function _clear () {
    this.logEntry();
    this.itemData = "";
    this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.JumpToTimeBox.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        this._data = data;
        this.textContent = data;
    }
});

/**
 * @method _onKeyDown
 */
app.gui.controls.JumpToTimeBox.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var len = this._maxLen,
        timeSeconds = Number(this.itemData) * 60;


    switch (e.key) {
        case "Back":
            $util.ControlEvents.fire(":bookmarksJumpToTimeDialog", "hide");
            e.stopImmediatePropagation();
            break;
        case "Ok":
        case "Enter":
            if (this.itemData !== "") {
                if (timeSeconds > this._player.duration) {
                    //TODO: warning dialog should be shown here as requirement in iq3.5
                } else {
                    $util.ControlEvents.fire(":bookmarksJumpToTimeDialog", "hide");
                    this._player.currentTime = timeSeconds;
                }
            } else {
                //TODO: another notification should be displayed as requirement in iq3.5
            }
            e.stopImmediatePropagation();
            break;
        default:
            if (e.key >= '0' && e.key <= '9') {
                if (this.itemData.length < len) {
                    this.itemData = this.itemData + e.key;
                    len++;
                }
                e.stopImmediatePropagation();
            }
            break;
    }

    this.logExit();
};




