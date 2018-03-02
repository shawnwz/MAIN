/**
 * @class app.gui.controls.SearchPopularList
 */

app.gui.controls.SearchPopularList = function SearchPopularList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchPopularList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchPopularList.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();

    this.orientation = "Vertical";
    this.minItems = 4;
    this.maxItems = 4;

    this._focusClass = "focused";

    this.logExit();
};

/**
 * @method _fetch
 * @private
 */
app.gui.controls.SearchPopularList.prototype._fetch = function _fetch() {
    this.logEntry();
    var me = this;
    $service.DISCO.Search.popular(this.maxItems).then(function(data) {
        me.fireControlEvent("populate", data, 0);
    });
    this.logExit();
};



/**
 * @class app.gui.controls.SearchPopularListItem
 */

app.gui.controls.SearchPopularListItem = function SearchPopularListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchPopularListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchPopularListItem.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
  this._text = this.querySelector('.searchRecentPopularMatch');
    this._focusClass = "popularSearches-focused";
    this.logExit();
};

/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.SearchPopularListItem.prototype, "itemData", {
    get: function get() {
        return this._data;
    },
    set: function set(data) {
        this._data = data;

        if (data && data.title) {
            this._text.textContent = data.title;
            this.classList.remove("popularSearches-empty");
        } else {
            this._text.textContent = "";
            this.classList.add("popularSearches-empty");
        }
    }
});
