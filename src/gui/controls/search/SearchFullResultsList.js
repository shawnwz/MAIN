/**
 * @class app.gui.controls.SearchFullResultsList
 */

app.gui.controls.SearchFullResultsList = function SearchFullResultsList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchFullResultsList, app.gui.controls.HtmlFlexList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchFullResultsList.prototype.createdCallback = function createdCallback() {
  this.logEntry();
  this.superCall();

  this.animate = true;
  this.orientation = "Vertical";
  this.minItems = 9;

  this._hiddenClass = "hide";
  this._focusClass = "focused";

  this._cache = [];
  this._filter = "searchFilterALL";
  this._term = "";
  this._isFetchingMore = false;

  this.logExit();
};

/**
 * @method _fetch
 * @private
 */
app.gui.controls.SearchFullResultsList.prototype._fetch = function _fetch(term, filter) {
  this.logEntry();
  var me = this;
  if (term && term !== '') {
    this._term = term;
  }
  this._filter = filter;
  $service.DISCO.Search.search(me._term, me._filter).then(function(data) {
    me._cache = [];
    me._cache = me._cache.concat(data);
    me.fireControlEvent("populate", data);
    me.fireControlEvent("select", 0);
  });
  this.logExit();
};

/**
 * @method _fetchMore
 * @private
 */
app.gui.controls.SearchFullResultsList.prototype._fetchMore = function _fetchMore(offset) {
  this.logEntry();

  var me = this,
    selected = me._cache.length - 1;
  $service.DISCO.Search.search(me._term, me._filter, offset).then(function(data) {
    if (data && data.length > 0) {
      me._cache = me._cache.concat(data);
      me.fireControlEvent("populate", me._cache, selected);
    } else {
      me.fireControlEvent("populated", me);
    }

    me._isFetchingMore = false;
    //me.fireControlEvent("select", selected);
  });
  this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.SearchFullResultsList.prototype._onKeyDown = function _onKeyDown(e) {
  this.logEntry();

  switch (e.key) {

    case "ArrowDown":
      if (this._selectedItem.itemIndex === this._itemNb - 1 && this._isFetchingMore === false) {
        $util.ControlEvents.fire("app-search-full-query:searchFullResults", "showMore");
        this._isFetchingMore = true;
        this._fetchMore(this._itemNb);
      } else {
        this.superCall(e);
      }

      break;
    default:
      this.superCall(e);
      break;
  }

  this.logExit();
};

/**
 * @class app.gui.controls.SearchFullResultsListItem
 */

app.gui.controls.SearchFullResultsListItem = function SearchFullResultsListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchFullResultsListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchFullResultsListItem.prototype.createdCallback = function createdCallback() {
  this.logEntry();
  this.superCall();

  this._searchResultsMatch = this.querySelector(".searchFullResultsMatch");
  this._searchResultsType = this.querySelector(".searchFullResultsType");

  this._focusClass = "searchFullResultsListItem-focused";
  this._emptyClass = "searchFullResultsListItem-empty";

  this.logExit();
};

/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.SearchFullResultsListItem.prototype, "itemData", {
  get: function get() {
    return this._data;
  },
  set: function set(data) {

    this._data = data;

    if (data && data.title) {

      this._searchResultsMatch.innerHTML = data.match;
      this._searchResultsType.textContent = data.type;

      if (data.from) {
        this.classList.add("from" + data.from.capitalizeFirstLetter());
      } else {
        this.classList.add("noLogo");
      }

      this.classList.remove(this._emptyClass);
    } else {
      this._searchResultsMatch.textContent = "";
      this._searchResultsType.textContent = "";
      this.classList.add("noLogo");
      this.classList.add(this._emptyClass);
    }
  }
});
