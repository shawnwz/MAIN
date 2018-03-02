/**
 * @class app.gui.controls.CarouselViewList
 */

app.gui.controls.CarouselViewList = function CarouselViewList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.CarouselViewList, app.gui.controls.HtmlScrollList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.CarouselViewList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this.animate = true;
    this.orientation = "Vertical";
    this._wrapped = false;
    //this._fetchControl = true;

    var me = this;

    this._fetching = function() {
        $util.ControlEvents.fire("app-home", "dialog", "");
        clearTimeout(me._spinnerTimer);
        me._spinnerTimer = setTimeout(function () {
            $util.ControlEvents.fire("app-home", "dialog", "loading");
            me._spinnerTimer = null;
        }, 1000);
    };
    this.onControlEvent("focus", function() {
        var carouselList = this._carouselList,
            selectedCarouselListItem = carouselList ? carouselList.selectedItem : null,
            selectedRow = selectedCarouselListItem ? selectedCarouselListItem._carouselRow : null,
            selectedTile = selectedRow ? selectedRow.selectedItem : null;

        if (selectedTile) {
            $util.ControlEvents.fire("app-home:ctaHomeMenu", "fetch", selectedTile);
            selectedRow.onControlEvent("change", function(list) { // once the carouselview get focus
                selectedTile = list ? list.selectedItem : null;
                if (selectedTile) {
                    $util.ControlEvents.fire("app-home:ctaHomeMenu", "fetch", selectedTile);
                }
            });
            carouselList.onControlEvent("change", function(list) {
                selectedCarouselListItem = list ? list.selectedItem : null;
                selectedRow = selectedCarouselListItem ? selectedCarouselListItem._carouselRow : null;
                selectedTile = selectedRow ? selectedRow.selectedItem : null;
                if (selectedTile) {
                    $util.ControlEvents.fire("app-home:ctaHomeMenu", "fetch", selectedTile);
                }
                //each time selected row need to register the change event
                selectedRow.onControlEvent("change", function(rowList) {
                    selectedTile = rowList ? rowList.selectedItem : null;
                    if (selectedTile) {
                        $util.ControlEvents.fire("app-home:ctaHomeMenu", "fetch", selectedTile);
                    }
                });
            }, this);
        }
    });
    $util.ControlEvents.on("app-home:ctaHomeMenu", "ctaInfo", function () {
        var row = this._carouselList ? this._carouselList.selectedRow : null,
            selectedItem = row ? row.selectedItem : null,
            data = selectedItem ? selectedItem.itemData : null;

        if (data) {
            if (data.isCollection === true) {
                me._focusedElem = document.activeElement;
                $util.ControlEvents.fire("app-search-collection", "fetch", data);
                $util.Events.fire("app:navigate:to", "searchCollection");
            } else if (data.isApplication === true) { //@hdk let view deal with this for now
                $util.Events.fire("app:launch", data);
            } else {
                me._focusedElem = document.activeElement;
                $util.ControlEvents.fire("app-synopsis", "fetch", data);
                $util.Events.fire("app:navigate:to", "synopsis");
            }
        }
    }, this);
    this.onControlEvent("populated", function() {

        me._jumpoffList  = this.querySelector("app-jumpoff-list");
        me._heroesList   = this.querySelector("app-heroes-list");
        me._genreList    = this.querySelector("app-genre-list");
        me._carouselList = this.querySelector("app-carousel-list");

        setTimeout(function() { // give it some time for the elements to attach
            me._carouselList.onControlEvent("populated", function(list) {
                clearTimeout(me._spinnerTimer); /* we had a response */
                $util.ControlEvents.fire("app-home", "dialog", list.itemNb > 0 ? "" : "empty");
            });
            me._carouselList.onControlEvent("enter", function(list) {
                var row = list ? list.selectedRow : null,
                    selectedItem = row ? row.selectedItem : null,
                    data = selectedItem ? selectedItem.itemData : null;

                if (data) {
                    if (data.isCollection === true) {
                        me._focusedElem = document.activeElement;
                        $util.ControlEvents.fire("app-search-collection", "fetch", data);
                        $util.Events.fire("app:navigate:to", "searchCollection");
                    } else if (data.isApplication === true) { //@hdk let view deal with this for now
                        $util.Events.fire("app:launch", data);
                    } else {
                        // enter will go to the channel
                        // $util.ControlEvents.fire("app-video", "setSrc", data.itemData);
                    }
                }
            });

            if (me._jumpoffList) { // have jumpoffs

                if (me._heroesList) { // have jumpoffs and heroes
                    // fetch heroes when jumpoff change
                    me._jumpoffList.onControlEvent("change", function(list) {
                        var selectedItem = list ? list.selectedItem : null,
                            node = selectedItem ? selectedItem.itemData : null;
                        if (node) {
                            me._heroesList.fireControlEvent("fetch", node);
                            me._fetching();
                        }
                    });
                }
                if (me._genreList) { // have jumpoffs and genres
                    // fetch genres when jumpoff change
                    me._jumpoffList.onControlEvent("change", function(list) {
                        var selectedItem = list ? list.selectedItem : null,
                            node = selectedItem ? selectedItem.itemData : null;
                        if (node) {
                            me._genreList.fireControlEvent("fetch", node);
                            me._fetching();
                        }
                    });
                    // fetch carousels if genres have no entries
                    me._genreList.onControlEvent("populated", function(list) {
                        var itemNb = list ? list.itemNb : 0,
                          selectedItem = me._jumpoffList ? me._jumpoffList.selectedItem : null,
                          node = selectedItem ? selectedItem.itemData : null;
                        if (itemNb === 0) {
                          me._genreList.parentElement.fireControlEvent("hide"); //@hdk improve this! Should also move carousel up...
                          me._carouselList.fireControlEvent("clear");
                          me._carouselList.fireControlEvent("fetch", node);
                          me._fetching();
                        } else {
                          me._genreList.parentElement.fireControlEvent("show");
                        }
                    });
                    // fetch carousels when genres changes
                    me._genreList.onControlEvent("change", function(list) {
                        var selectedItem = list ? list.selectedItem : null,
                            node = selectedItem ? selectedItem.itemData : null;
                        if (node) {
                            me._carouselList.fireControlEvent("clear");
                            me._carouselList.fireControlEvent("fetch", node);
                            me._fetching();
                        }
                    });
                } else { // have jumpoffs and no genres
                    // fetch carousels when jumpoffs changes
                    me._jumpoffList.onControlEvent("change", function(list) {
                        var selectedItem = list ? list.selectedItem : null,
                            node = selectedItem ? selectedItem.itemData : null;
                        if (node) {
                            me._carouselList.fireControlEvent("clear");
                            me._carouselList.fireControlEvent("fetch", node);
                            me._fetching();
                        }
                    });
                }
                // fetch the jumpoffs
                me._jumpoffList.fireControlEvent("fetch", me._node);
                me._fetching();

            } else { // no jumpoffs: fetch heroes and carousel directly
                if (me._heroesList) {
                    me._heroesList.fireControlEvent("fetch", me._node);
                }
                me._carouselList.fireControlEvent("clear");
                me._carouselList.fireControlEvent("fetch", me._node);
                me._fetching();
            }

        }, 10);
    });

    this._spinnerTimer = null;

    $util.Translations.update(this);

    this.logExit();
};

/**
 * @method _fetch
 * @public
 */
app.gui.controls.CarouselViewList.prototype._fetch = function _fetch (node) {
    this.logEntry();
    var arr = [],
        nodeId, nthNode;

    this.fireControlEvent("clear");

    if (node._hasJumpOffs) {
        arr.push("app-jumpoff-list");
    }
    if (node.displayName.toLowerCase() !== "home" &&
        node.displayName.toLowerCase() !== "apps") {
        arr.push("app-heroes-list");
    }

    if (node._hasJumpOffs) { // only genres if we have jumpoffs
        if (node._subNodes && node._subNodesNb > 0) { // jumpoffs and subNodes: are the subNodes genres?
            for (nodeId in node._subNodes) {
                if (node._subNodes[nodeId]) {
                    nthNode = node._subNodes[nodeId];
                    if (nthNode._hasGenres) {
                        arr.push("app-genre-list");
                        break;
                    }
                }
            }
        }
    }

    arr.push("app-carousel-list");

    this.fireControlEvent("populate", arr);

    this._node = node;

    this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.CarouselViewList.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false,
      selectedItem = this.selectedItem ? this.selectedItem : null;

    switch (e.key) {
        case "Info":
                // pass the Info key back to view
                break;
        default:
                // pass on key to first child of selected item
                if (selectedItem) {
                    selectedItem.firstElementChild.fireControlEvent("key:down", e);
                }
                handled = true;
                break;
    }

    if (handled) {
        e.stopImmediatePropagation();
        e.preventDefault();
    }

    this.logExit(handled);
    return handled;
};



/**
 * @class app.gui.controls.CarouselViewListItem
 */

app.gui.controls.CarouselViewListItem = function CarouselViewListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.CarouselViewListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.CarouselViewListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this._floatItem = false;
    this._hiddenClass = "hide";

    this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.CarouselViewListItem.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    this.superCall();

    var me = this,
        elem =  this.firstElementChild;

    setTimeout(function() { // give it some time for the elements to attach

        elem.onControlEvent([ "exit:up", "back" ], function(list) {
            if (!me._parent._previous(false)) {
                me._parent.fireControlEvent("exit:up", me._parent);
            }
            if (list.id === "carouselList") {
                list.fireControlEvent("reset", list);
            }
        });
        elem.onControlEvent("exit:down", function(/* list */) {
            if (!me._parent._next(false)) {
                me._parent.fireControlEvent("exit:down", me._parent);
            }
        });
    }, 50);

    this.logExit();
};

/**
 * @method onSelect
 */
app.gui.controls.CarouselViewListItem.prototype._onSelect = function _onSelect () {
    this.logEntry();
    this.superCall();
    if (this.firstElementChild) {
        this.firstElementChild.setAttribute("selected", "");
    }
    this.logExit();
};

/**
 * @method _onDeselect
 */
app.gui.controls.CarouselViewListItem.prototype._onDeselect = function _onDeselect () {
    this.logEntry();
    this.superCall();
    if (this.firstElementChild) {
        this.firstElementChild.removeAttribute("selected");
    }
    this.logExit();
};

/**
 * @property CarouselViewListItem
 */
Object.defineProperty(app.gui.controls.CarouselViewListItem.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        this._data = data;

        this.id = "carouselViewListItem" + this.itemIndex;

        if (data) {
            var elem, tmpl;
            if (this._data === "app-jumpoff-list") {
                elem = this.ownerDocument.createElement("app-jumpoff-list");
                elem.id = "jumpoffList";
                elem.className = "jumpoff-list";
            } else if (this._data === "app-heroes-list") {
                elem = this.ownerDocument.createElement("app-heroes-list");
                elem.id = "heroesList";
                elem.className = "heroes-list";
            } else if (this._data === "app-genre-list") {
                elem = this.ownerDocument.createElement("app-genre-list");
                elem.id = "genreList";
                elem.className = "genre-list";
            } else if (this._data === "app-carousel-list") {
                tmpl = document.getElementById("carouselListTemplate");
                elem = tmpl.content.cloneNode(true);
            }

            this.appendChild(elem);
        }

    }
});
