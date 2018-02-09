/**
 * @class app.gui.controls.CarouselList
 */

app.gui.controls.CarouselList = function CarouselList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.CarouselList, app.gui.controls.HtmlFlexList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.CarouselList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this.animate = true;
    this.orientation = "Vertical";
    this._wrapped = false;

    this._listElem.classList.add("carouselList-List");
    this._focusWindow.classList.add("carouselList-ListFocus");
    this.onControlEvent("populate", this._populate);
    this.onControlEvent("fetch", this._fetch);
    this.onControlEvent("enter", this._enter);
    this.onControlEvent("focus", function () {
        this.logEntry();
        var selectedItem = this.selectedItem;
        //this.superCall();
        if (selectedItem && selectedItem._carouselRow) {
                selectedItem._carouselRow.fireControlEvent("change", selectedItem._carouselRow);
        }
        this.logExit();
    }, this);
    this.logExit();
};

/**
 * @method _fetch
 * @public
 */
app.gui.controls.CarouselList.prototype._fetch = function _fetch (node) {
    this.logEntry();
    var promises = [],
        me = this,
        key, subNodes;

    this.fireControlEvent("clear");

    subNodes = (node && node._subNodes && node._subNodesNb) ? node._subNodes : null;

    if (subNodes) {
        // eslint-disable-next-line guard-for-in
        for (key in subNodes) {
            promises.push($service.MDS.Node.assets(subNodes[key]));
        }
    } else { // no subnodes, get assets of node itself
        promises.push($service.MDS.Node.assets(node));
    }
    Promise.all(promises).then(function() {
        me.fireControlEvent("populate", node);
    });
    this.logExit();
};

/**
 * @method _enter
 * @public
 */
app.gui.controls.CarouselList.prototype._enter = function _enter (node) {
    this.logEntry();
    var selectedRow = node ? node.selectedRow : null,
      selectedCell = selectedRow ? selectedRow.selectedItem : null,
      data = selectedCell ? selectedCell.itemData : null;

    if (data) {
        if (data.isCollection === true) {
            this._focusedElem = document.activeElement;
            $util.ControlEvents.fire("app-search-collection", "fetch", data);
            $util.Events.fire("app:navigate:to", "searchCollection");
        } else if (data.isApplication === true) { //@hdk let view deal with this for now
            $util.ControlEvents.fire("app-apps:app-carouselList-view", "enter", data);
        } else {
            this._focusedElem = document.activeElement;
            $util.ControlEvents.fire("app-synopsis", "fetch", data);
            $util.Events.fire("app:navigate:to", "synopsis");
        }
    }
    this.logExit();
};

/**
 * @method _change
 * @public
 */
app.gui.controls.CarouselList.prototype._change = function _change (ctrl) {
    this.logEntry();
    var selectedItem = this.selectedItem,
      data = (selectedItem && selectedItem.itemData) ? selectedItem.itemData : null;
    if (data) {
        this._focusWindow.classList.remove("asset-tv");
        this._focusWindow.classList.remove("asset-movie");
        this._focusWindow.classList.add("asset-" + data.assetType);
    }
    this.superCall(ctrl);
    if (selectedItem && selectedItem._carouselRow) {
            selectedItem._carouselRow.fireControlEvent("change", selectedItem._carouselRow);
    }
    this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.CarouselList.prototype._populate = function _populate (node) {
    this.logEntry();
    var nodeId,
      nthNode,
      arr = [];

    if (node) {
        if (node._subNodesNb > 0) { // if we have subNodes: each subnode is a row with assets
            // eslint-disable-next-line guard-for-in
            for (nodeId in node._subNodes) {
                nthNode = node._subNodes[nodeId];
                if (nthNode._assets.length > 0) {
                    arr.push({
                        title    : nthNode.displayName,
                        id       : nthNode.id,
                        assetType: (nthNode._assets[0].contentType === "MOVIE") ? "movie" : "tv",
                        assets   : nthNode._assets
                    });
                }
            }
        } else if (node._assets && node._assets.length > 0) { // no subnodes: add the assets of the node (if any)
            arr.push({
                title    : "",
                id       : node.id,
                assetType: (node._assets[0].contentType === "MOVIE") ? "movie" : "tv",
                assets   : node._assets
            });
        }
    }

    this.superCall(arr);
    this.fireControlEvent("populated", { itemNb: arr.length });
    this.logExit();
};

/**
 * @property selectedRow
 * @public
 * @type {Object} selectedRow
 */
Object.defineProperty(app.gui.controls.CarouselList.prototype, "selectedRow", {
    get: function get () {
        return (this.selectedItem ? this.selectedItem._carouselRow : null);
    }
});

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.CarouselList.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false,
        data,
        row;

    switch (e.key) {
        case "Back":
            this.fireControlEvent("exit:up", this);
            e.stopImmediatePropagation();
            handled = true;
            break;
        case "ArrowLeft":
        case "ArrowRight":
            row = this.selectedRow;
            if (row) { // pass the key to the row
                row.fireControlEvent("key:down", e);
            }
            handled = true;
            break;
        case "FastForward":
        case "Forward":
            // we cant pass on the key to the row, since we need to get the jump size
            data = this.selectedItem ? this.selectedItem.itemData : null;
            row = this.selectedRow;
            if (row && data) {
                row.fireControlEvent("jump", (data.assetType === "tv") ? 4 : 6, e.repeat);
            }
            handled = true;
            break;
        case "Rewind":
            // we cant pass on the key to the row, since we need to get the jump size
            data = this.selectedItem ? this.selectedItem.itemData : null;
            row = this.selectedRow;
            if (row && data) {
                row.fireControlEvent("jump", (data.assetType === "tv") ? -4 : -6, e.repeat);
            }
            handled = true;
            break;
        case "Info":
            this.fireControlEvent("enter", this);
            handled = true;
            break;
        default:
            handled = this.superCall(e);
            break;
    }

    if (handled) {
        e.stopImmediatePropagation();
        e.preventDefault();
    }

    this.logExit(handled);
};



/**
 * @class app.gui.controls.CarouselListItem
 */

app.gui.controls.CarouselListItem = function CarouselListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.CarouselListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.CarouselListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this._title = this.querySelector('.carousel-title');
    this._infoTitle = this.querySelector('.carouselTileInfoTitle');
    this._infoSubTitle = this.querySelector('.carouselTileInfoSubTitle');
    this._carouselRow = this.querySelector('app-carousel-row-list');

    this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.CarouselListItem.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    this.superCall();

    if (this._carouselRow) {
        var me = this;

        // update the info when the cell changes selection
        this._carouselRow.onControlEvent("change", function (list) {
            var selectedItem = list ? list.selectedItem : null,
              data = selectedItem ? selectedItem.itemData : null,
              startTime, strTemp,
              weekDay = [],
              str = "",
              strLine2 = "",
              strLine3 = "",
              i = 7,
              component, componentMenu;

            while (i--) {
                str = "dateWeekdayShort" + i;
                weekDay[i] = $util.Translations.translate(str);
            }
            str = "";

            if (data) {
                me._infoTitle.innerHTML = data.title;

                if (data.isCollection === true) {
                    me._infoSubTitle.innerHTML = "";
                    return;
                }

                if (data.titleText) {
                	strTemp = data.titleText;
                    	str = $util.Translations.translate("tileOnNow") + ": ";
                	if (strTemp.indexOf(str) !== -1) { //donot display "On Now:"
                		strTemp = strTemp.substr(str.length);
                	}
                    	str = "";
					//future program display weekday & date (except onnow/today/tomorrow)
					//titleText include date but do not have weekday
                	if (data.progStartDate && !data.isOnNow && !data.isToday && !data.isTomorrow) {
                		startTime = new Date(parseInt(data.progStartDate, 10));
                		strLine2 = weekDay[startTime.getDay()] + " " + strTemp;
                	} else {
                		strLine2 = strTemp;
                	}

                    if (data.channel) {
                		strLine2 = strLine2 + " " + $util.Translations.translate("on").toLowerCase() + " " + data.channelName;
                	}
                }

                if (data.seasonNumber && data.episodeNumber && data.episodeTitle && !data.DispSEpNum) {
                    strLine3 = "S" + data.seasonNumber + " E" + data.episodeNumber + " - " + data.episodeTitle;
                } else if (data.episodeTitle) {
                    strLine3 = data.episodeTitle;
                }

                if (data.rating && data.rating !== "NC") {
                    strLine3 = strLine3 + "(" + data.rating + ")";
                }


                if (strLine2 && strLine3) { //display 3 lines totally
                	str = strLine2 + "<br/>" + strLine3;
                	me._infoSubTitle.style.fontSize = "24px";
                	me._infoSubTitle.style.lineHeight = "30px";
                } else { //display 2 lines totally
                	str = strLine2 + strLine3;
                	me._infoSubTitle.style.fontSize = "28px";
                	me._infoSubTitle.style.lineHeight = "40px";
                }

                me._infoSubTitle.innerHTML = str;
            }

            // update footer button to content in active view, selected carousel
            if (data && me.itemData && me.classList.contains("focused")) {
                componentMenu = document.querySelector('#portalMenu');
                component = (componentMenu && componentMenu.selectedItem) ? componentMenu.selectedItem.itemData : null;
                if (component && component.displayName) {
                        if (o5.gui.viewManager.activeView.localName.endsWith(component.displayName.toLowerCase()) === true) {
                            $util.ControlEvents.fire("app-home:ctaHome", "fetch", { "component": component, "carousel": me.itemData, "content": data });
                        }
                }
            }

        });

        // populate the row
        setTimeout(function() { // give it some time to really attach
            me._carouselRow.fireControlEvent("populate", me._data.assets);
        }, 10);
    }
    this.logExit();
};

/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.CarouselListItem.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        this._data = data;

        if (data) {
            this._title.textContent = data.title;

            this.classList.add("asset-" + data.assetType);

            // populate the row's cells once attached in attachedCallback()
        } else {
            // empty row?
            this._title.textContent = "no information";
        }
    }
});


