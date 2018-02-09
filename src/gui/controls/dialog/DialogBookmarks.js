/**
 * @class app.gui.controls.DialogBookmarks
 */

app.gui.controls.DialogBookmarks = function DialogBookmarks () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogBookmarks, app.gui.controls.HtmlDialogContainer);

app.gui.controls.DialogBookmarks.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _store
 */
app.gui.controls.DialogBookmarks.prototype._store = function _store () {
	this.logEntry();
	console.log("dialog settings not stored");
	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.DialogBookmarks.prototype._show = function _show () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.DialogBookmarks.prototype._populate = function _populate (list) {
    this.logEntry();
    this.superCall();
    $util.ControlEvents.fire(":dialogBookmarksList", "populate", list);
    this.logExit();
};

/**
* @method _focus
*/
app.gui.controls.DialogBookmarks.prototype._focus = function _focus () {
    this.logEntry();
    $util.ControlEvents.fire(":dialogBookmarksList", "focus");
    this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.DialogBookmarks.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.DialogBookmarks.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();

	switch (e.key) {
		default:
			this.superCall(e);
			break;
	}

	this.logExit();
};

/**
 * @class app.gui.controls.DialogBookmarksList
 */

app.gui.controls.DialogBookmarksList = function DialogBookmarksList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogBookmarksList, app.gui.controls.HtmlFlexList); // HtmlFlexList

/**
 * @method createdCallback
 */
app.gui.controls.DialogBookmarksList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this.orientation = "Vertical";
    this.animate = true;
    this._player = document.querySelector('#videoView').videoPlayer;
    this._keyArrays = [ { name: "Start", time: 0 }, { name: "Second half", time: this._player.duration / 2 }, { name: "End", time: this._player.duration }, { name: "A specific time", time: "----" } ];
    this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.DialogBookmarksList.prototype._populate = function _populate () {
    this.logEntry();
    var arr = this._keyArrays;

    this.superCall(arr, 0);
    this.logExit();
};

/**
 * @method attachedCallback
 * @public
 */
app.gui.controls.DialogBookmarksList.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    this.superCall();
    this.onControlEvent("enter", function (ctrl) {
        var bkName = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData.name : null,
            bkTime = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData.time : null;

        if (bkName) {
            $util.ControlEvents.fire(":bookmarksDialog", "hide");
            if (bkTime === "----") {
                $util.ControlEvents.fire(":bookmarksJumpToTimeDialog", "show", this._currentContent);
                $util.ControlEvents.fire(":bookmarksJumpToTimeDialog", "focus");
            } else {
              this._player.currentTime = bkTime;
            }
        }
    });
    this.onControlEvent("back", function () {
            $util.ControlEvents.fire(":bookmarksDialog", "hide");
    });
    this.logExit();
};

/**
 * @class app.gui.controls.DialogBookmarksListItem
 */
app.gui.controls.DialogBookmarksListItem = function DialogBookmarksListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogBookmarksListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.DialogBookmarksListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._name = this.querySelector('.bookmarkName');
    this._time = this.querySelector('.bookmarkTime');
    this._getContentLengthText = function (contentLength) {
        var hours = Math.floor(contentLength / (60 * 60)),
            mins = Math.floor(Math.round(contentLength - (hours * 60 * 60)) / 60),
            secs = Math.floor(Math.round(contentLength - ((hours * 60 * 60) + (mins * 60))));

        if (mins === 60) {
            hours++;
            mins = 0;
        }
        if (mins < 10) {
            mins = "0" + mins;
        }
        if (secs === 60) {
            mins++;
            secs = 0;
        }
        if (secs < 10) {
            secs = "0" + secs;
        }
        if (hours === 0) {
            return mins + ":" + secs;
        }
        return hours + ":" + mins + ":" + secs;
    };
    this._focusClass = "listView-focused";
    this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.DialogBookmarksListItem.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        this._data = data;

        if (data) {
            this._name.textContent = data.name;
            if (data.time !== "----") {
                this._time.textContent = this._getContentLengthText(data.time);
            } else {
                this._time.textContent = data.time;
            }


        } else {
            this.textContent = "";
            this.classList.add("dialogBookmarksList-empty");
        }
    }
});
