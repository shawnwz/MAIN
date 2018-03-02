app.views.HomeSearch = function HomeSearch () {};
o5.gui.controls.Control.registerAppControl(app.views.HomeSearch, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 */
app.views.HomeSearch.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this._recentList = this.querySelector("#homeSearchRecent");
    this._resultsList = this.querySelector("#searchSearchResults");
    this._searchField = this.querySelector("#searchField");
    this._searchKeys = this.querySelector("#searchKeys");
    this._searchButtons = this.querySelector("#searchButtons");
    this._searchResultsContainer = this.querySelector("#searchResultsContainer");
    this._resultsListContainer = this.querySelector("#searchResults");

    this._focusedElem = null;
    this._isFullScreenMode = false;
    this._keyboardType = null;

    // searchKeysTable
    $util.ControlEvents.on("app-home-search:searchKeysTable", [ "exit:up", "back" ], function (/* list */) {
        $util.ControlEvents.fire("app-home", "focus");
        $util.ControlEvents.fire("app-home-search:searchKeysTable", "reset");
    }, this);
    $util.ControlEvents.on("app-home-search:searchKeysTable", "exit:down", function () {
        $util.ControlEvents.fire("app-home-search:searchButtonsList", "focus");
    }, this);
    $util.ControlEvents.on("app-home-search:searchKeysTable", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            term = selectedItem ? selectedItem.itemData : null;
        if (term) {
            $util.ControlEvents.fire("app-home-search:searchEntry", "append", term, this._keyboardType);
        }
    }, this);

    // searchButtonsList
    $util.ControlEvents.on("app-home-search:searchButtonsList", [ "exit:up", "back" ], function (/*list*/) {
        $util.ControlEvents.fire("app-home-search:searchKeysTable", "focus");
    }, this);
    $util.ControlEvents.on([ "app-home-search:searchButtonsList", "app-home-search:searchNewButton" ], "exit:down", function (list) {
        if (list.id === "searchButtonsList" && this._searchContent.classList.contains("showResults")) {
            $util.ControlEvents.fire("app-home-search:searchSearchResults", "select", 0);
            $util.ControlEvents.fire("app-home-search:searchSearchResults", "focus");
        } else if (this._recentSearches.itemNb > 0) {
            $util.ControlEvents.fire("app-home-search:homeSearchRecent", "select", 0);
            $util.ControlEvents.fire("app-home-search:homeSearchRecent", "focus");
        } else if (this._popularSearches.itemNb > 0) {
            $util.ControlEvents.fire("app-home-search:homeSearchPopular", "select", 0);
            $util.ControlEvents.fire("app-home-search:homeSearchPopular", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-home-search:searchButtonsList", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            data = selectedItem ? selectedItem.itemData : null,
            action = data ? data.action : null;

        switch (action.toLowerCase()) {
            case "123":
                this._keyboardType = "123";
                $util.ControlEvents.fire("app-home-search:searchButtonsList", "populate", "ABC");
                $util.ControlEvents.fire("app-home-search:searchKeysTable", "populate", "123");
                $util.ControlEvents.fire("app-home-search:searchKeysTable", "select", "last", "middle");
                break;
            case "abc":
                this._keyboardType = "abc";
                $util.ControlEvents.fire("app-home-search:searchButtonsList", "populate", "123");
                $util.ControlEvents.fire("app-home-search:searchKeysTable", "populate", "ABC");
                $util.ControlEvents.fire("app-home-search:searchKeysTable", "select", "last", "middle");
                break;
            case "space":
                $util.ControlEvents.fire("app-home-search:searchEntry", "append", "&nbsp;", this._keyboardType);
                break;
            case "backspace":
                $util.ControlEvents.fire("app-home-search:searchEntry", "backspace");
                break;
            case "clear":
                $util.ControlEvents.fire("app-home-search:searchEntry", "clear");
                break;
            default:
                break;
        }
    }, this);

    // homeSearchPopular
    $util.ControlEvents.on("app-home-search:homeSearchPopular", "exit:left", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            index = selectedItem ? selectedItem.itemIndex : 0;
        if (this._recentSearches.itemNb > 0) {
            $util.ControlEvents.fire("app-home-search:homeSearchRecent", "select", index);
            $util.ControlEvents.fire("app-home-search:homeSearchRecent", "focus");
        }
    }, this);
    $util.ControlEvents.on([ "app-home-search:homeSearchPopular", "app-home-search:homeSearchRecent", "app-home-search:searchSearchResults" ], [ "exit:up", "back" ], function () {
        if (this._themeName === "Rel8") {
            $util.ControlEvents.fire("app-home-search:searchButtonsList", "focus");
        } else {
            $util.ControlEvents.fire("app-home-search:searchNewButton", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-home-search:homeSearchPopular", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            data = (selectedItem && selectedItem.itemData) ? selectedItem.itemData : null;
        this._focusedElem = document.activeElement;
        if (data) {
            $util.ControlEvents.fire("app-synopsis", "fetch", data);
            $util.Events.fire("app:navigate:to", "synopsis");
        }
    }, this);
    $util.ControlEvents.on([ "app-home-search:homeSearchPopular", "app-home-search:homeSearchRecent" ], "populated", function () {
        clearTimeout(this._spinnerTimer);
        $util.ControlEvents.fire("app-home", "dialog", "");
    }, this);

    // homeSearchRecent
    $util.ControlEvents.on("app-home-search:homeSearchRecent", "exit:right", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            index = selectedItem ? selectedItem.itemIndex : 0;
        if (this._popularSearches.itemNb > 0) {
            $util.ControlEvents.fire("app-home-search:homeSearchPopular", "select", index);
            $util.ControlEvents.fire("app-home-search:homeSearchPopular", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-home-search:homeSearchRecent", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            data = selectedItem ? selectedItem.itemData : null;
        this._focusedElem = document.activeElement;
        if (data && data.title) {
            $util.ControlEvents.fire("app-home-search", "search", data.title);
            $util.ControlEvents.fire("app-home-search:searchSearchResults", "focus");
        }
    }, this);

    // searchNewButton
    $util.ControlEvents.on("app-home-search:searchNewButton", "enter", function () {
        this._focusedElem = document.activeElement;
        $util.ControlEvents.fire("app-home-search", "populate", "");
        $util.Events.fire("app:navigate:to", "searchQuery");
    }, this);

    /*
     * search
     */
    this._recentSearches = this.querySelector("#homeSearchRecent");
    this._popularSearches = this.querySelector("#homeSearchPopular");

    this._searchContent = this.querySelector("#searchHomeContent");
    this._searchDidYouMean = this.querySelector("#searchDidYouMean");
    this._searchNoResultsFound = this.querySelector("#searchNoResultsFound");
    this._searchSuggested = this.querySelector("#searchSuggested");
    this._searchTerm = "";

    $util.ControlEvents.on("app-home-search:searchEntry", "change", function (term) {
        this._searchTerm = term;
        if (term.length > 0) {
            $util.ControlEvents.fire("app-home-search", "search", term);
        } else {
            $util.ControlEvents.fire("app-home:ctaHomeMenu", "remove", "ctaFullSearch");
            if (this._recentList.itemNb > 0) {
                $util.ControlEvents.fire("app-home:ctaHomeMenu", "add", "ctaClearRecent");
            }
            this._searchContent.classList.remove("showResults");
            this._searchContent.classList.remove("loadingResults");
            $util.ControlEvents.fire("app-home-search:homeSearchRecent", "fetch");
        }
    }, this);

    $util.ControlEvents.on("app-home-search", "search", function (term) {
        this._searchDidYouMean.classList.remove("show");
        this._searchContent.classList.add("loadingResults");
        $util.ControlEvents.fire("app-home-search:searchSearchResults", "fetch", term); // will reply with "searchSearchResults", "populated"
        this._searchContent.classList.add("showResults"); // show it before we populate, so we can get heights of elements
        $util.ControlEvents.fire("app-home:ctaHomeMenu", "remove", "ctaClearRecent");
    }, this);

    $util.ControlEvents.on("app-home-search:searchSearchResults", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            data = selectedItem ? selectedItem.itemData : null;

        if (data && data.type) {
            $util.ControlEvents.fire("app-home-search:searchRecentList", "add", data.title);
            if (data.type === "Keyword") {
                this._focusedElem = document.activeElement;
                $util.ControlEvents.fire("app-search-collection", "search", data);
                $util.Events.fire("app:navigate:to", "searchCollection");
            } else if (data.type === "Movie" || data.type === "TV Show") {
                this._focusedElem = document.activeElement;
                $util.ControlEvents.fire("app-synopsis", "fetch", data.hits[0] ? data.hits[0] : "");
                $util.Events.fire("app:navigate:to", "synopsis");
            } else if (data.type === "Actor" || data.type === "Director") {
                this._focusedElem = document.activeElement;
                $util.ControlEvents.fire("app-search-collection", "search", data);
                $util.Events.fire("app:navigate:to", "searchCollection");
            }
        }
    }, this);
    $util.ControlEvents.on("app-home-search:searchSearchResults", "populated", function (list) {
        this._searchContent.classList.remove("loadingResults");
        this._searchContent.classList.remove("loadingMoreResults");
        $util.ControlEvents.fire("app-home:ctaHomeMenu", "add", "ctaFullSearch");
        if (list && list.itemNb > 0) {
            this._searchSuggested.classList.add("show");
            this._searchNoResultsFound.classList.remove("show");
        } else {
            this._searchSuggested.classList.remove("show");
            this._searchNoResultsFound.classList.add("show");
            //this._searchDidYouMean.classList.add("show");
        }
    }, this);

    $util.ControlEvents.on("app-home:ctaHomeMenu", "ctaFullSearch", function () {
        $util.Events.fire("app:navigate:to", "searchFullQuery");
        $util.ControlEvents.fire("app-search-full-query", "search", this._searchTerm);
    }, this);

    $util.ControlEvents.on("app-home:ctaHomeMenu", "ctaClearRecent", function () {
        $util.ControlEvents.fire("app-home-search:searchRecentList", "clear");
        $util.ControlEvents.fire("app-home-search:homeSearchRecent", "fetch");
        $util.ControlEvents.fire("app-home:ctaHomeMenu", "remove", "ctaClearRecent");
        $util.ControlEvents.fire("app-home-search:searchKeysTable", "focus");
    }, this);

    $util.ControlEvents.on("app-home-search", "modeFull", function() {
        this._isFullScreenMode = true;
        this._searchSuggested.classList.add("fullScreenMode");
        this._searchField.classList.add("fullScreenMode");
        this._searchKeys.classList.add("fullScreenMode");
        this._searchButtons.classList.add("fullScreenMode");
        this._searchResultsContainer.classList.add("fullScreenMode");
        this._searchResultsContainer.style.height = "685px";
        this._resultsList.style.height = "640px";
        this._searchResultsContainer.style.top = "185px";
        this._resultsListContainer.style.height = "585px";
    }, this);

    $util.ControlEvents.on("app-home-search", "modeOrigin", function() {
        this._isFullScreenMode = false;
        this._searchSuggested.classList.remove("fullScreenMode");
        this._searchField.classList.remove("fullScreenMode");
        this._searchKeys.classList.remove("fullScreenMode");
        this._searchButtons.classList.remove("fullScreenMode");
        this._searchResultsContainer.classList.remove("fullScreenMode");
        this._searchResultsContainer.style.height = "385px";
        this._resultsList.style.height = "164px";
        this._searchResultsContainer.style.top = "250px";
        this._resultsListContainer.style.height = "385px";
    }, this);
    $util.ControlEvents.on("app-home-search:searchSearchResults", "showMore", function () {
        this._searchContent.classList.add("loadingMoreResults");
    }, this);

    $util.Translations.update();

    this._themeName = $config.getConfigValue("settings.view.theme");

    this.onload = this._onLoad;
    this.onshow = this._onShow;
    this.onhide = this._onHide;
    this.onfocus = this._onFocus;
    this.onblur = this._onBlur;
    this.onkeydown = this._onKeyDown;

    this.logExit();
};

/**
 * @method attachedCallback
 */
app.views.HomeSearch.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    $util.Events.fire("app:view:attached", "home-search");
    this.logExit();
};

/**
 * @method _onLoad
 */
app.views.HomeSearch.prototype._onLoad = function _onLoad () {
    this.logEntry();
    this.logExit();
};


/**
 * @method _onShow
 */
app.views.HomeSearch.prototype._onShow = function _onShow () {
    this.logEntry();

    $util.ControlEvents.fire("app-home-search:homeSearchRecent", "fetch");
    $util.ControlEvents.fire("app-home-search:homeSearchPopular", "fetch");
    this._keyboardType = "abc";

    if (this._themeName === "Rel8") {
        $util.ControlEvents.fire("app-home-search:searchEntry", "clear");
        $util.ControlEvents.fire("app-home-search:searchKeysTable", "populate", "ABC");
        $util.ControlEvents.fire("app-home-search:searchButtonsList", "populate", "123");
    } else {
      console.log("rel6");
    }

    this.logExit();
};

/**
 * @method _onHide
 */
app.views.HomeSearch.prototype._onHide = function _onHide () {
    this.logEntry();
    this.logExit();
};

/**
 * @method _onFocus
 */
app.views.HomeSearch.prototype._onFocus = function _onFocus () {
    this.logEntry();
    if (this._recentList.itemNb === 0) {
        $util.ControlEvents.fire("app-home:ctaHomeMenu", "remove", "ctaClearRecent");
    }
    if (this._themeName === "Rel8") {
        $util.ControlEvents.fire("app-home-search:searchKeysTable", "focus");
        $util.ControlEvents.fire("app-home-search:searchKeysTable", "select", "first", "middle");
    } else {
        $util.ControlEvents.fire("app-home-search:searchNewButton", "focus");
    }
    this.logExit();
};


/**
 * @method _onBlur
 */
app.views.HomeSearch.prototype._onBlur = function _onBlur () {
    this.logEntry();
    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.views.HomeSearch.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false;

    if (handled === true) {
        e.stopImmediatePropagation();
        e.preventDefault();
    } else {
        $util.ControlEvents.fire("app-home:ctaHomeMenu", "key:down", e);
    }
    this.logExit();
};

