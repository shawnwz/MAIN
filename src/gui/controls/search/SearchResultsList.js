/**
 * @class app.gui.controls.SearchResultsList
 */

app.gui.controls.SearchResultsList = function SearchResultsList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchResultsList, app.gui.controls.HtmlFlexList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchResultsList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this.orientation = "Vertical";
	this.animate = true;
	this.minItems = 6;

	this.className = "searchResultsListItem-list searchResultsListItem-anim-normal";

	this._focusClass = "focused";
	this._visibleClass = "show";
	this._isFullScreenMode = false;
	this._cache = [];
	this._isFetchingMore = false;
	this._term = "";

	this.logExit();
};

/**
 * @method _fetch
 * @private
 */
app.gui.controls.SearchResultsList.prototype._fetch = function _fetch(term) {
	this.logEntry();
	var me = this;
	this._term = term;
	$service.DISCO.Search.suggested(term).then(function(data) {
		me._cache = [];
		me._cache = me._cache.concat(data);
		me.fireControlEvent("populate", data);
	});
	this.logExit();
};

/**
 * @method _fetchMore
 * @private
 */
app.gui.controls.SearchResultsList.prototype._fetchMore = function _fetchMore(offset) {
	this.logEntry();
	var me = this,
		selected = me._cache.length - 1;
	$service.DISCO.Search.suggested(me._term, offset).then(function(data) {
		if (data && data.length > 0) {
			me._cache = me._cache.concat(data);
			me.fireControlEvent("populate", me._cache, selected);
		} else {
			me.fireControlEvent("populated", me);
		}

		me._isFetchingMore = false;
	});
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.SearchResultsList.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();

	switch (e.key) {

		case "ArrowDown":
			if (this._selectedItem.itemIndex === 3 && this._itemNb > 4 && this._isFullScreenMode === false) {
				//$util.ControlEvents.fire("app-home-search:searchKeysTable", "hide");
				//$util.ControlEvents.fire("app-home-search:searchButtonsList", "hide");
				$util.ControlEvents.fire("app-home-search", "modeFull");
				this.fireControlEvent("populate", this._cache, 3);
				this._isFullScreenMode = true;
			} else if (this._selectedItem.itemIndex === this._itemNb - 1 && this._isFetchingMore === false) {
				$util.ControlEvents.fire("app-home-search:searchSearchResults", "showMore");
				this._isFetchingMore = true;
				this._fetchMore(this._itemNb);
			}
			this.superCall(e);
			break;

		case "ArrowUp":
			if (this._selectedItem.itemIndex === 4 && this._isFullScreenMode === true) {
				//$util.ControlEvents.fire("app-home-search:searchKeysTable", "show");
				//$util.ControlEvents.fire("app-home-search:searchButtonsList", "show");
				$util.ControlEvents.fire("app-home-search", "modeOrigin");
				this.fireControlEvent("populate", this._cache);
				this.fireControlEvent("select", 3);
				this._isFullScreenMode = false;
			} else {
				this.superCall(e);
			}
			break;
		case "Back":
			if (this._isFullScreenMode === true) {
				//$util.ControlEvents.fire("app-home-search:searchKeysTable", "show");
				//$util.ControlEvents.fire("app-home-search:searchButtonsList", "show");
				$util.ControlEvents.fire("app-home-search", "modeOrigin");
				this.fireControlEvent("populate", this._cache);
				this.fireControlEvent("select", 2);
				this._isFullScreenMode = false;
				e.stopImmediatePropagation();
				e.preventDefault();
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
 * @class app.gui.controls.SearchResultsListItem
 */

app.gui.controls.SearchResultsListItem = function SearchResultsListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchResultsListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchResultsListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this._showLogos = false; //@hdk mmove to config?

	this._searchResultsMatch = this.querySelector(".searchResultsMatch");
	this._searchResultsType = this.querySelector(".searchResultsType");

	this._focusClass = "searchResultsListItem-focused";

	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SearchResultsListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {

		this._data = data;

		if (data && data.title) {

			this._searchResultsMatch.innerHTML = data.match;
			this._searchResultsType.textContent = data.type;

			if (this._showLogos && data.from) {
				this.classList.add("from" + data.from.capitalizeFirstLetter());
			} else {
				this.classList.add("noLogo");
			}

			this.classList.remove("searchResultsListItem-empty");
		} else {
			this._searchResultsMatch.textContent = "";
			this._searchResultsType.textContent = "";
			this.classList.add("noLogo");
			this.classList.add("searchResultsListItem-empty");
		}
	}
});
