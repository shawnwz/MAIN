/**
 * @class app.gui.controls.SearchRecentList
 */

app.gui.controls.SearchRecentList = function SearchRecentList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchRecentList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchRecentList.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();

    this.orientation = "Vertical";
    this.minItems = 4;
    this.maxItems = 4;

    this._focusClass = "focused";

    $util.ControlEvents.on("app-home-search:searchRecentList", "add", function (term) {
        $service.DISCO.Search.add(term);
    }, this);
    $util.ControlEvents.on("app-home-search:searchRecentList", "clear", function () {
        $service.DISCO.Search.clear();
    }, this);
    this.logExit();
};

/**
 * @method _fetch
 * @private
 */
app.gui.controls.SearchRecentList.prototype._fetch = function _fetch() {
    this.logEntry();
    var me = this;
    $service.DISCO.Search.recent(this.maxItems).then(function(data) {
        me.fireControlEvent("populate", data, 0);
    });
    this.logExit();
};



/**
 * @class app.gui.controls.SearchRecentListItem
 */

app.gui.controls.SearchRecentListItem = function SearchRecentListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchRecentListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchRecentListItem.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
  this._text = this.querySelector('.searchRecentPopularMatch');
    this._focusClass = "recentSearches-focused";
    this.logExit();
};

/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.SearchRecentListItem.prototype, "itemData", {
    get: function get() {
        return this._data;
    },
    set: function set(data) {
        this._data = data;

        if (data && data.title) {
            this._text.textContent = data.title;
            this.classList.remove("recentSearches-empty");
        } else {
            this._text.textContent = "";
            this.classList.add("recentSearches-empty");
        }
    }
});
