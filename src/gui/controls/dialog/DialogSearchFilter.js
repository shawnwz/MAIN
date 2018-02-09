/**
 * @class app.gui.controls.DialogSearchFilter
 */

app.gui.controls.DialogSearchFilter = function DialogSearchFilter () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogSearchFilter, app.gui.controls.HtmlDialogContainer);

app.gui.controls.DialogSearchFilter.prototype.createdCallback = function createdCallback () {
//	this.logEntry();
	this.superCall();

//  this._fill = this.querySelector('#volumeBarFill');

//	this.logExit();
    $util.Translations.update();
};

/**
 * @method _store
 */
app.gui.controls.DialogSearchFilter.prototype._store = function _store () {
	this.logEntry();
	console.log("dialog settings not stored");
	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.DialogSearchFilter.prototype._populate = function _populate () {
    this.logEntry();
    this.superCall();
    $util.ControlEvents.fire(":dialogSearchFilterList", "populate");
    this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.DialogSearchFilter.prototype._focus = function _focus () {
    this.logEntry();
    $util.ControlEvents.fire(":dialogSearchFilterList", "focus");
    this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.DialogSearchFilter.prototype._show = function _show () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.DialogSearchFilter.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.DialogSearchFilter.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();

	switch (e.key) {
		default:
			this.superCall(e);
			break;
	}

	this.logExit();
};

/**
 * @class app.gui.controls.DialogSearchFilterList
 */

app.gui.controls.DialogSearchFilterList = function DialogSearchFilterList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogSearchFilterList, app.gui.controls.HtmlFlexList);  // HtmlFlexList

/**
 * @method createdCallback
 */
app.gui.controls.DialogSearchFilterList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this.orientation = "Vertical";
    this.animate = true;
    this._keyArrays = [ 'searchFilterALL', 'searchFilterMOVIE', 'searchFilterTVSHOW', 'searchFilterPEOPLE', 'searchFilterKEYWORD' ];
    this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.DialogSearchFilterList.prototype._populate = function _populate () {
    this.logEntry();
    var arr = this._keyArrays;

    this.superCall(arr, 0);
    this.logExit();
};

/**
 * @method attachedCallback
 * @public
 */
app.gui.controls.DialogSearchFilterList.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    this.superCall();
    this.onControlEvent("enter", function (ctrl) {
        var filter = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData : null;

        if (filter) {
            $util.ControlEvents.fire(":searchFilterDialog", "hide");
            $util.ControlEvents.fire("app-search-full-query", "setFilter", filter);
            $util.ControlEvents.fire("app-search-full-query:searchFullResults", "focus");
            $util.ControlEvents.fire("app-search-full-query:searchFullResults", "fetch", '', filter);
        }
    });
    this.onControlEvent("back", function (ctrl) {
        var filter = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData : null;

        if (filter) {
            $util.ControlEvents.fire(":searchFilterDialog", "hide");
            $util.ControlEvents.fire("app-search-full-query:searchFullResults", "focus");
        }
    });
    this.logExit();
};

/**
 * @class app.gui.controls.DialogSearchFilterListItem
 */
app.gui.controls.DialogSearchFilterListItem = function DialogSearchFilterListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogSearchFilterListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.DialogSearchFilterListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "listView-focused";
    this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.DialogSearchFilterListItem.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        this._data = data;

        if (data) {
            this.textContent = $util.Translations.translate(data);

        } else {
            this.textContent = "";
            this.classList.add("dialogSubGenreList-empty");
        }
    }
});
