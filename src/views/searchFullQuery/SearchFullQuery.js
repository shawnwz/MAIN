
app.views.SearchFullQuery = function SearchFullQuery () {};
o5.gui.controls.Control.registerAppControl(app.views.SearchFullQuery, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.SearchFullQuery.prototype.createdCallback = function createdCallback () {

	this.logEntry();
	this.superCall();

	this._searchFullTitle = this.querySelector("#searchFullTitle");
	this._searchFullFilter = this.querySelector("#searchFullFilter");
	this._resultsList = this.querySelector("#searchFullResults");
	this._searchContent = this.querySelector("#searchFullResultsContent");
	this._searchNoResultsFound = this.querySelector("#searchFullNoResultsFound");
	this._LoadingMoreResults = this.querySelector("#searchFullLoadingMoreResults");

	$util.ControlEvents.on("app-search-full-query", "populate", function (selectedItem) {
		var title = (selectedItem && selectedItem.itemData) ? selectedItem.itemData.title : null,
			term = title ? encodeURIComponent("searchTerms:\"" + title + "\"") : null;

		if (title) {
			this._searchFullTitle.textContent = title;
		}
		$util.ControlEvents.fire("app-search-full-query", "search", term);
	}, this);
	$util.ControlEvents.on("app-search-full-query", "setFilter", function (filter) {
		if (filter) {
			this._searchFullFilter.textContent = $util.Translations.translate("searchFilteredBy") + $util.Translations.translate(filter);
		}
	}, this);
	$util.ControlEvents.on("app-search-full-query", "search", function (term) {
		this._searchFullTitle.textContent = term;
		this._searchContent.classList.remove("showResults");
		this._searchContent.classList.add("loadingResults");
		$util.ControlEvents.fire("app-search-full-query:searchFullResults", "fetch", term, "searchFilterALL");	// will reply with "searchFullResults", "populated"
		this._searchContent.classList.add("showResults"); // show it before we populate, so we can get heights of elements
	}, this);

	$util.ControlEvents.on("app-search-full-query:searchFullResults", "back", function () {
		$util.Events.fire("app:navigate:back");
	}, this);
	$util.ControlEvents.on("app-search-full-query:searchFullResults", "enter", function (list) {
		var selectedItem = list ? list.selectedItem : null,
			data = selectedItem ? selectedItem.itemData : null;

		if (data) {
			$util.ControlEvents.fire("app-search-query:searchRecentList", "add", data.title);
			$util.ControlEvents.fire("app-synopsis", "fetch", data);
			$util.Events.fire("app:navigate:to", "synopsis");
		}
	}, this);
	$util.ControlEvents.on("app-search-full-query:searchFullResults", "populated", function (resulstList) {
		this._searchContent.classList.remove("loadingResults");
		this._searchContent.classList.remove("loadingMoreResults");
		if (resulstList && resulstList.itemNb > 0) {
			this._searchNoResultsFound.classList.remove("show");
			$util.ControlEvents.fire("app-search-full-query:searchFullResults", "show");
			$util.ControlEvents.fire("app-search-full-query:searchFullResults", "focus");
		} else {
			this._searchNoResultsFound.classList.add("show");
			$util.ControlEvents.fire("app-search-full-query:searchFullResults", "hide");
			this.focus();
		}
	}, this);

	$util.ControlEvents.on("app-search-full-query:ctaSearchFullQuery", "ctaFilter", function () {
		    $util.ControlEvents.fire(":searchFilterDialog", "show");
            $util.ControlEvents.fire(":searchFilterDialog", "focus");
	}, this);

	$util.ControlEvents.on("app-search-full-query:searchFullResults", "showMore", function () {
		this._searchContent.classList.add("loadingMoreResults");
	}, this);

	this.onkeydown = this._onKeyDown;
	this.onfocus = this._onFocus;
//	this.onload = this._onLoad;
	this.onshow = this._onShow;
	$util.Translations.update();
	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.SearchFullQuery.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();
	$util.Events.fire("app:view:attached", "searchFullQuery");
	this.logExit();
};

/**
 * @method _onLoad
 * @private
 */
app.views.SearchFullQuery.prototype._onLoad = function _onLoad () {
	this.logEntry();
	this.logExit();
};


/**
 * @method _onShow
 * @private
 */
app.views.SearchFullQuery.prototype._onShow = function _onShow () {
	this.logEntry();
	this._searchFullFilter.textContent = "";
	$util.ControlEvents.fire("app-search-full-query", "show");
	$util.ControlEvents.fire("app-search-full-query:ctaSearchFullQuery", "fetch");
	this.logExit();
};

/**
 * @method _onHide
 * @private
 */
app.views.SearchFullQuery.prototype._onHide = function _onHide () {
	this.logEntry();
	$util.ControlEvents.fire("app-search-full-query", "hide");
	this.logExit();
};

/**
 * @method _onFocus
 * @private
 */
app.views.SearchFullQuery.prototype._onFocus = function _onFocus () {
	this.logEntry();
	$util.ControlEvents.fire("app-search-full-query:searchFullResults", "focus");
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.views.SearchFullQuery.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	var handled = false;
	switch (e.key) {
		case "Back":
			$util.Events.fire("app:navigate:back");
			e.stopImmediatePropagation();
			handled = true;
			break;
		default:
			break;
	}
	if (handled === false) {
		$util.ControlEvents.fire("app-search-full-query:ctaSearchFullQuery", "key:down", e);
	}
	this.logExit();
};

