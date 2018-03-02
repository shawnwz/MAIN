
app.views.SearchQuery = function SearchQuery () {};
o5.gui.controls.Control.registerAppControl(app.views.SearchQuery, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.SearchQuery.prototype.createdCallback = function createdCallback () {

    this.logEntry();
    this.superCall();

    this._recentList = this.querySelector("#searchSearchRecent");
    this._popularList = this.querySelector("#searchSearchPopular");
    this._resultsList = this.querySelector("#searchSearchResults");
    this._searchResults = this.querySelector("#searchResults");
    this._searchContent = this.querySelector("#searchContent");
    this._searchDidYouMean = this.querySelector("#searchDidYouMean");
    this._searchNoResultsFound = this.querySelector("#searchNoResultsFound");
    this._searchSuggested = this.querySelector("#searchSuggested");
    this._searchEntry = this.querySelector("#searchEntry");
    this._searchField = this.querySelector("#searchField");
    this._searchQueryKeys = this.querySelector("#searchQueryKeys");
    this._searchQueryButtons = this.querySelector("#searchQueryButtons");
    this._searchQueryResultsContainer = this.querySelector("#searchQueryResultsContainer");
    this._resultsListContainer = this.querySelector("#searchResults");

    this._focusedElem = null;
    this._themeName = $config.getConfigValue("settings.view.theme");
    this._keyboardType = null;
    this._isFullScreenMode = false;

    /* when we toggle the Results and Popular/Recent, we set focus to key-list, otherwise we
     * run the risk that the focus remains on a hidden control.
     * //@hdk is there an easier way? e.g. notify when we hide focuesed element? would be nice if
     *        all control have something easy/automated for this!
     */
    this._observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === "class") {
                var hasResults = mutation.target.classList.contains("showResults") || mutation.target.classList.contains("loadingResults"),
                    hadResults = (mutation.oldValue.indexOf("showResults") !== -1); //@hdk not a waterproof check!

                if (hasResults !== hadResults) {
                    $util.ControlEvents.fire("app-search-query:searchKeyList", "focus");
                    if (hadResults) { // "showResults" removed: clear list and fetch popular and recent
                        $util.ControlEvents.fire("app-search-query:searchSearchResults", "clear");
                        $util.ControlEvents.fire("app-search-query:searchSearchRecent", "fetch");
                        $util.ControlEvents.fire("app-search-query:searchSearchPopular", "fetch");
                    }
                }
            }
        });
    });

    $util.ControlEvents.on("app-search-query", "fetch", function (term) {
        this._themeName = $config.getConfigValue("settings.view.theme");
        if (this._themeName === "Rel8") {
            $util.ControlEvents.fire("app-search-query:searchSearchRecent", "fetch");
            $util.ControlEvents.fire("app-search-query:searchSearchPopular", "fetch");
            if (this._recentList.itemNb > 0) {
                $util.ControlEvents.fire("app-search-query:ctaSearch", "fetch");
            }

        } else {
            $util.ControlEvents.fire("app-search-query:searchKeyTitle", "populate", term); // will reply with "searchKeyTitle", "change"
        }
    }, this);
    $util.ControlEvents.on("app-search-query", "search", function (term) {
        this._searchDidYouMean.classList.remove("show");
        this._searchContent.classList.add("loadingResults");
        $util.ControlEvents.fire("app-search-query:searchSearchResults", "fetch", term); // will reply with "searchSearchResults", "populated"
        this._searchContent.classList.add("showResults"); // show it before we populate, so we can get heights of elements
        $util.ControlEvents.fire("app-search-query:ctaSearch", "remove", "ctaClearRecent");
    }, this);


    $util.ControlEvents.on("app-search-query:searchSearchPopular", "exit:left", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            index = selectedItem ? selectedItem.itemIndex : 0;

        if (this._recentList.itemNb > 0) {
            $util.ControlEvents.fire("app-search-query:searchSearchRecent", "select", index);
            $util.ControlEvents.fire("app-search-query:searchSearchRecent", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchPopular", "exit:up", function () {
        if (this._themeName === "Rel8") {
            $util.ControlEvents.fire("app-search-query:searchButtonsList", "focus");
        } else {
            $util.ControlEvents.fire("app-search-query:searchNewButton", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchPopular", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            data = (selectedItem && selectedItem.itemData) ? selectedItem.itemData : null;

        this._focusedElem = document.activeElement;
        if (data) {
            $util.ControlEvents.fire("app-synopsis", "fetch", data);
            $util.Events.fire("app:navigate:to", "synopsis");
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchKeyTitle", "change", function (term) {
        if (term.length > 2) {
            $util.ControlEvents.fire("app-search-query", "search", term);
        } else {
            this._searchContent.classList.remove("showResults");
            this._searchContent.classList.remove("loadingResults");
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchKeyTitle", "back", function () {
        this._focusedElem = null;
        $util.Events.fire("app:navigate:back");
    }, this);

    $util.ControlEvents.on("app-search-query:searchKeyList", "exit:right", function () {
        if (this._resultsList.itemNb > 0) {
            $util.ControlEvents.fire("app-search-query:searchSearchResults", "select", 0);
            $util.ControlEvents.fire("app-search-query:searchSearchResults", "focus");
        } else if (this._recentList.itemNb > 0) {
            $util.ControlEvents.fire("app-search-query:searchSearchRecent", "select", 0);
            $util.ControlEvents.fire("app-search-query:searchSearchRecent", "focus");
        } else if (this._popularList.itemNb > 0) {
            $util.ControlEvents.fire("app-search-query:searchSearchPopular", "select", 0);
            $util.ControlEvents.fire("app-search-query:searchSearchPopular", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchKeyList", "exit:left", function () {
        $util.ControlEvents.fire("app-search-query:searchKeyTitle", "backspace");
    }, this);
    $util.ControlEvents.on("app-search-query:searchKeyList", "back", function () {
        $util.ControlEvents.fire("app-search-query:searchKeyTitle", "backspace");
    }, this);
    $util.ControlEvents.on("app-search-query:searchKeyList", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            term = selectedItem ? selectedItem.itemData : null;

        if (term) {
            $util.ControlEvents.fire("app-search-query:searchKeyTitle", "append", term);
        }
    }, this);

    $util.ControlEvents.on("app-search-query:searchButtonsList", "exit:up", function () {
        $util.ControlEvents.fire("app-search-query:searchKeysTable", "focus");
        //$util.ControlEvents.fire("app-search-query:searchKeysTable", "select", "first", "middle");
    }, this);
    $util.ControlEvents.on("app-search-query:searchButtonsList", "exit:down", function () {
        if (this._searchContent.classList.contains("showResults")) {
            $util.ControlEvents.fire("app-search-query:searchSearchResults", "select", 0);
            $util.ControlEvents.fire("app-search-query:searchSearchResults", "focus");
        } else if (this._recentList.itemNb > 0) {
            $util.ControlEvents.fire("app-search-query:searchSearchRecent", "select", 0);
            $util.ControlEvents.fire("app-search-query:searchSearchRecent", "focus");
        } else if (this._popularList.itemNb > 0) {
            $util.ControlEvents.fire("app-search-query:searchSearchPopular", "select", 0);
            $util.ControlEvents.fire("app-search-query:searchSearchPopular", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchButtonsList", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            data = selectedItem ? selectedItem.itemData : null,
            action = data ? data.action : null;

        switch (action.toLowerCase()) {
            case "123":
                this._keyboardType = "123";
                $util.ControlEvents.fire("app-search-query:searchButtonsList", "populate", "ABC");
                $util.ControlEvents.fire("app-search-query:searchKeysTable", "populate", "123");
                $util.ControlEvents.fire("app-search-query:searchKeysTable", "select", "last", "middle");
                break;
            case "abc":
                this._keyboardType = "abc";
                $util.ControlEvents.fire("app-search-query:searchButtonsList", "populate", "123");
                $util.ControlEvents.fire("app-search-query:searchKeysTable", "populate", "ABC");
                $util.ControlEvents.fire("app-search-query:searchKeysTable", "select", "last", "middle");
                break;
            case "space":
                $util.ControlEvents.fire("app-search-query:searchEntry", "append", "&nbsp;", this._keyboardType);
                break;
            case "backspace":
                $util.ControlEvents.fire("app-search-query:searchEntry", "backspace");
                break;
            case "clear":
                $util.ControlEvents.fire("app-search-query:searchEntry", "backspace", true);
                break;
            default:
                break;
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchEntry", "change", function (term) {
        if (term.length > 0) {
            $util.ControlEvents.fire("app-search-query", "search", term);
        } else {
            $util.ControlEvents.fire("app-search-query:ctaSearch", "swap", "ctaFullSearch", "ctaClearRecent");
            this._searchContent.classList.remove("showResults");
            this._searchContent.classList.remove("loadingResults");
            $util.ControlEvents.fire("app-search-query:searchSearchRecent", "fetch");
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchRecent", "exit:right", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            index = selectedItem ? selectedItem.itemIndex : 0;

        if (this._popularList.itemNb > 0) {
            $util.ControlEvents.fire("app-search-query:searchSearchPopular", "select", index);
            $util.ControlEvents.fire("app-search-query:searchSearchPopular", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchRecent", "exit:up", function () {
        if (this._themeName === "Rel8") {
            $util.ControlEvents.fire("app-search-query:searchButtonsList", "focus");
        } else {
            $util.ControlEvents.fire("app-search-query:searchNewButton", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchRecent", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            data = selectedItem ? selectedItem.itemData : null;

        this._focusedElem = document.activeElement;
        if (data && data.title) {
            //$util.ControlEvents.fire("app-search-query", "fetch", data.title);
            $util.ControlEvents.fire("app-search-query", "search", data.title);
            $util.Events.fire("app:navigate:to", "searchQuery");
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchKeysTable", "exit:up", function () {
        $util.ControlEvents.fire("app-search-query:searchButtonsList", "focus");
    }, this);
    $util.ControlEvents.on("app-search-query:searchKeysTable", "number:up", function (e) {
        if (this._keyboardType === "abc") {
            $util.ControlEvents.fire("app-search-query:searchEntry", "focus");
            $util.ControlEvents.fire("app-search-query:searchEntry", "append", e.key, this._keyboardType);
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchKeysTable", "exit:down", function () {
        $util.ControlEvents.fire("app-search-query:searchButtonsList", "focus");
    }, this);
    $util.ControlEvents.on("app-search-query:searchKeysTable", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            term = selectedItem ? selectedItem.itemData : null;

        if (term) {
            $util.ControlEvents.fire("app-search-query:searchEntry", "append", term, this._keyboardType);
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchKeysTable", "back", function () {
        if (this._searchEntry.itemData.length > 0) {
            $util.ControlEvents.fire("app-search-query:searchEntry", "backspace");
        } else {
            if (this._searchContent.classList.contains("showResults")) {
                this._searchContent.classList.remove("showResults");
            }
            $util.ControlEvents.fire("app-home", "fetch");
            $util.Events.fire("app:navigate:to", "home");
            setTimeout(function () {
                $util.ControlEvents.fire("app-home:portalMenu", "select", 6); //6: Home menu Search option
            }, 10);
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchResults", "exit:left", function () {
        $util.ControlEvents.fire("app-search-query:searchKeyList", "focus");
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchResults", "exit:up", function () {
        $util.ControlEvents.fire("app-search-query:searchButtonsList", "focus");
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchResults", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            data = selectedItem ? selectedItem.itemData : null;

        if (data && data.type) {
            $util.ControlEvents.fire("app-search-query:searchRecentList", "add", data.title);
            if (data.type === "Keyword") {
                this._focusedElem = document.activeElement;
                //$util.ControlEvents.fire("app-search-full-query", "populate", selectedItem);
                //$util.Events.fire("app:navigate:to", "searchFullQuery");
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
    $util.ControlEvents.on("app-search-query:searchSearchResults", "back", function () {
        $util.ControlEvents.fire("app-search-query:searchKeysTable", "focus");
        $util.ControlEvents.fire("app-search-query:searchEntry", "backspace", true);
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchResults", "populated", function (list) {
        if (this._searchContent.classList.contains("showResults") === false) {
            return;
        }
        this._searchContent.classList.remove("loadingResults");
        this._searchContent.classList.remove("loadingMoreResults");
        if (list && list.itemNb > 0) {
            this._searchSuggested.classList.add("show");
            this._searchNoResultsFound.classList.remove("show");
            $util.ControlEvents.fire("app-search-query:ctaSearch", "add", "ctaFullSearch");
            if (this._isFullScreenMode === true) {
                this._searchResults.style.overflow = "visible";
                this._searchResults.style.top = "5px";
                //list._listElem.children[list._listElem.children.length - 1].style.opacity = "0.1";
                this._resultsList._listElem.classList.add("searchResultsListLast-Item");
            } else {
                this._searchResults.style.overflow = "hidden";
                this._searchResults.style.top = "60px";
                this._resultsList._listElem.classList.remove("searchResultsListLast-Item");
            }
        } else {
            this._searchSuggested.classList.remove("show");
            this._searchNoResultsFound.classList.add("show");

            //this._searchDidYouMean.classList.add("show");
        }
    }, this);

    $util.ControlEvents.on("app-search-query:searchSearchPopular", "exit:left", function (selectedItem) {
        if (this._recentList.itemNb > 0) {
            var index = selectedItem ? selectedItem.itemIndex : 1;

            $util.ControlEvents.fire("app-search-query:searchSearchRecent", "select", index);
            $util.ControlEvents.fire("app-search-query:searchSearchRecent", "focus");
        } else {
            $util.ControlEvents.fire("app-search-query:searchKeyList", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchPopular", "enter", function () {
        this._focusedElem = document.activeElement;
        $util.ControlEvents.fire("app-search-query:app-synopsis", "fetch", "");
        $util.Events.fire("app:navigate:to", "synopsis");
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchPopular", "back", function () {
        $util.ControlEvents.fire("app-search-query:searchKeyTitle", "backspace");
        //$util.ControlEvents.fire("app-search-query:searchKeyList", "focus");
        //$util.ControlEvents.fire("app-search-query:searchSearchRecent", "exit:left", selectedItem);
    }, this);

    $util.ControlEvents.on("app-search-query:searchSearchRecent", "exit:left", function () {
        $util.ControlEvents.fire("app-search-query:searchKeyList", "focus");
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchRecent", "exit:right", function (selectedItem) {
        if (this._popularList.itemNb > 0) {
            var index = selectedItem ? selectedItem.itemIndex : 1;

            $util.ControlEvents.fire("app-search-query:searchSearchPopular", "select", index);
            $util.ControlEvents.fire("app-search-query:searchSearchPopular", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchRecent", "enter", function (selectedItem) {
        $util.ControlEvents.fire("app-search-query", "populate", selectedItem);
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchRecent", "back", function () {
        //$util.ControlEvents.fire("app-search-query:searchKeyTitle", "backspace");
        $util.ControlEvents.fire("app-search-query:searchKeysTable", "focus");
        //$util.ControlEvents.fire("app-search-query:searchKeyList", "focus");
        //$util.ControlEvents.fire("app-search-query:searchSearchPopular", "exit:left", selectedItem);
    }, this);

    $util.ControlEvents.on("app-search-query:ctaSearch", "ctaFullSearch", function () {
        $util.Events.fire("app:navigate:to", "searchFullQuery");
        $util.ControlEvents.fire("app-search-full-query", "search", this._searchEntry.itemData);
    }, this);

    $util.ControlEvents.on("app-search-query:ctaSearch", "ctaClearRecent", function () {
        $util.ControlEvents.fire("app-search-query:searchRecentList", "clear");
        $util.ControlEvents.fire("app-search-query:searchSearchRecent", "fetch");
        $util.ControlEvents.fire("app-search-query:ctaSearch", "remove", "ctaClearRecent");
        $util.ControlEvents.fire("app-search-query:searchKeysTable", "focus");
    }, this);

    $util.ControlEvents.on("app-search-query", "modeFull", function() {
        this._isFullScreenMode = true;
        this._searchSuggested.classList.add("fullScreenMode");
        this._searchField.classList.add("fullScreenMode");
        this._searchQueryKeys.classList.add("fullScreenMode");
        this._searchQueryButtons.classList.add("fullScreenMode");
        this._searchQueryResultsContainer.classList.add("fullScreenMode");
        this._searchQueryResultsContainer.style.height = "685px";
        this._resultsList.style.height = "640px";
        this._searchQueryResultsContainer.style.top = "185px";
        this._resultsListContainer.style.height = "585px";
    }, this);

	$util.ControlEvents.on("app-search-query", "modeOrigin", function() {
        this._isFullScreenMode = false;
        this._searchSuggested.classList.remove("fullScreenMode");
        this._searchField.classList.remove("fullScreenMode");
        this._searchQueryKeys.classList.remove("fullScreenMode");
        this._searchQueryButtons.classList.remove("fullScreenMode");
        this._searchQueryResultsContainer.classList.remove("fullScreenMode");
        this._searchQueryResultsContainer.style.height = "385px";
        this._resultsList.style.height = "164px";
        this._searchQueryResultsContainer.style.top = "250px";
        this._resultsListContainer.style.height = "385px";
    }, this);
    $util.ControlEvents.on("app-search-query:searchSearchResults", "showMore", function () {
        this._searchContent.classList.add("loadingMoreResults");
    }, this);

    this.onkeydown = this._onKeyDown;
    this.onfocus = this._onFocus;
//  this.onload = this._onLoad;
    this.onshow = this._onShow;
    $util.Translations.update();

    this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.SearchQuery.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    $util.Events.fire("app:view:attached", "searchQuery");
    this.logExit();
};

/**
 * @method _onLoad
 * @private
 */
app.views.SearchQuery.prototype._onLoad = function _onLoad () {
    this.logEntry();
    this.logExit();
};


/**
 * @method _onShow
 * @private
 */
app.views.SearchQuery.prototype._onShow = function _onShow () {
    this.logEntry();
    this._themeName = $config.getConfigValue("settings.view.theme");
    $util.ControlEvents.fire("app-search-query", "show");
    if (this._themeName === "Rel8") {
        //$util.ControlEvents.fire("app-search-query:searchEntry", "clear");
        $util.ControlEvents.fire("app-search-query:searchButtonsList", "populate", "123");
        $util.ControlEvents.fire("app-search-query:searchKeysTable", "populate", "ABC");
        this._keyboardType = "abc";
    } else {
        $util.ControlEvents.fire("app-search-query:searchSearchRecent", "fetch");
        $util.ControlEvents.fire("app-search-query:searchSearchPopular", "fetch");
        $util.ControlEvents.fire("app-search-query:searchKeyList", "populate", "ABC");
        this._keyboardType = "abc";
        this._observer.observe(this._searchContent, {
            attributes       : true,
            attributeOldValue: true,
            attributeFilter  : ["class"]
        });
    }
    this.logExit();
};

/**
 * @method _onHide
 * @private
 */
app.views.SearchQuery.prototype._onHide = function _onHide () {
    this.logEntry();
    $util.ControlEvents.fire("app-search-query", "hide");
    this._observer.disconnect();
    this.logExit();
};

/**
 * @method _onFocus
 * @private
 */
app.views.SearchQuery.prototype._onFocus = function _onFocus () {
    this.logEntry();
    if (this._themeName === "Rel8") {
        if (this._searchEntry.itemData && this._resultsList.selectedItem) {
            //@Lizzy: focus back to searchKeysTable will lost focus at first time, why?
            $util.ControlEvents.fire("app-search-query:searchSearchResults", "select", (this._resultsList.selectedItem.itemIndex));
            $util.ControlEvents.fire("app-search-query:searchSearchResults", "focus");
        } else {
            $util.ControlEvents.fire("app-search-query:searchKeysTable", "focus");
            $util.ControlEvents.fire("app-search-query:searchKeysTable", "select", "first", "middle");
        }
    } else if (this._focusedElem) {
        this._focusedElem.focus();
    } else {
        $util.ControlEvents.fire("app-search-query:searchKeyList", "focus");
    }
    this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.views.SearchQuery.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false;
    switch (e.key) {
        case "Back":
            this._focusedElem = null;
            $util.Events.fire("app:navigate:back");
            handled = true;
            break;
        case "Left":
            $util.ControlEvents.fire("app-search-query:searchKeyList", "focus");
            handled = true;
            break;
        default:
            break;
    }

    if (handled === true) {
        e.stopImmediatePropagation();
        e.preventDefault();
    } else {
        $util.ControlEvents.fire("app-search-query:ctaSearch", "key:down", e);
    }
    this.logExit();
};

