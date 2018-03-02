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

    this._progressElem = document.querySelector("#tileSpinner .percentage");

    this._listElem.classList.add("carouselList-List");
    this._focusWindow.classList.add("carouselList-ListFocus");

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

    for (key in node._collections) {
        if (node._collections[key]) {
            promises.push(this._newPromises($service.MDS.Node.assets, node._collections[key]));
        }
    }

    if (subNodes) {
        for (key in subNodes) {
          if (subNodes[key]) {
              promises.push(this._newPromises($service.MDS.Node.assets, subNodes[key]));
          }
        }
    } else { // no subnodes, get assets of node itself
        promises.push(this._newPromises($service.MDS.Node.assets, node));
    }

    this.fireControlEvent("progress"); // kick of progress indicator

    Promise.all(promises)
        .then(function() {
            var nodeId, nthNode, arr = [];

            if (node._subNodesNb > 0) { // if we have subNodes: each subnode is a row with assets
                for (nodeId in node._subNodes) {
                    if (node._subNodes[nodeId]) {
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
                }
            }
            if (node._collections && node._collections.length > 0) { // if we have subNodes: each subnode is a row with assets
                for (nodeId in node._collections) {
                    if (node._collections[nodeId]) {
                        nthNode = node._collections[nodeId];
                        if (nthNode._assets.length > 0) {
                            arr.push({
                                title    : nthNode.displayName,
                                id       : nthNode.id,
                                assetType: (nthNode._assets[0].contentType === "MOVIE") ? "movie" : "tv",
                                assets   : nthNode._assets
                            });
                        }
                    }
                }
            }
            if (node._assets && node._assets.length > 0) { // no subnodes: add the assets of the node (if any)
                arr.push({
                    title    : node.displayName,
                    id       : node.id,
                    assetType: (node._assets[0].contentType === "MOVIE") ? "movie" : "tv",
                    assets   : node._assets
                });
            }

            me.fireControlEvent("populate", arr);
    });

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
        data,   row;

    switch (e.key) {
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
            default:
                    handled = this.superCall(e);
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

    var tmpl = document.getElementById("carouselListItemTemplate");
    this.appendChild(tmpl.content.cloneNode(true));

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
              i = 7;

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


