/**
 * @class app.gui.controls.DialogGenre
 */

app.gui.controls.DialogGenre = function DialogGenre () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogGenre, app.gui.controls.HtmlDialogContainer);

app.gui.controls.DialogGenre.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _store
 */
app.gui.controls.DialogGenre.prototype._store = function _store () {
	this.logEntry();
	console.log("dialog settings not stored");
	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.DialogGenre.prototype._populate = function _populate () {
    this.logEntry();
    this.superCall();
    $util.ControlEvents.fire(":dialogGenreList", "populate");
    this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.DialogGenre.prototype._focus = function _focus () {
    this.logEntry();
    $util.ControlEvents.fire(":dialogGenreList", "focus");
    this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.DialogGenre.prototype._show = function _show () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.DialogGenre.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.DialogGenre.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	switch (e.key) {
		default:
			this.superCall(e);
			break;
	}

	this.logExit();
};

/**
 * @class app.gui.controls.DialogGenreList
 */
app.gui.controls.DialogGenreList = function DialogGenreList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogGenreList, app.gui.controls.HtmlFlexList); // HtmlFlexList

/**
 * @method createdCallback
 */
app.gui.controls.DialogGenreList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this.orientation = "Vertical";
    this.animate = true;
    this._keyArrays = [ 'All Programmes', 'Entertainment', 'Movies', 'Sport', 'News&Documentaries', 'Kids&Family', 'Music&Radio', 'Special Interest' ];
    this.logExit();
};

/**
 * @method attachedCallback
*/
app.gui.controls.DialogGenreList.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    this.superCall();
    this.onControlEvent("enter", function (ctrl) {
        var genre = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData : null;

        if (genre) {
            $util.ControlEvents.fire(":genreDialog", "hide");
            $util.ControlEvents.fire("app-guide:epgListingsGenreFilter", "reset", genre);
            if (genre === "All Programmes") {
                $util.ControlEvents.fire("app-guide:epgListingsSubGenreFilter", "hide");
            } else {
                $util.ControlEvents.fire("app-guide:epgListingsSubGenreFilter", "reset", "All Programmes");
                $util.ControlEvents.fire("app-guide:epgListingsSubGenreFilter", "show");
            }
            $util.ControlEvents.fire("app-guide:epgListingsGenreFilter", "focus");
            $util.ControlEvents.fire("app-guide:epgListingsProgList-List", "fetch", "filter", "genre", genre);
        }
    });
    this.onControlEvent("back", function (ctrl) {
        var genre = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData : null;

        if (genre) {
            $util.ControlEvents.fire(":genreDialog", "hide");
            $util.ControlEvents.fire("app-guide:epgListingsGenreFilter", "focus");
        }
    });
    this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.DialogGenreList.prototype._populate = function _populate () {
    this.logEntry();
    var arr = this._keyArrays;

    this.superCall(arr, 0);
    this.logExit();
};

/**
 * @class app.gui.controls.DialogGenreListItem
 */
app.gui.controls.DialogGenreListItem = function DialogGenreListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogGenreListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.DialogGenreListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "listView-focused";
    this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.DialogGenreListItem.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        this._data = data;

        if (data) {
            this.textContent = data;

        } else {
                this.textContent = "";
                this.classList.add("dialogGenreList-empty");
        }
    }
});
