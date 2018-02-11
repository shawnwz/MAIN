/**
 * @class app.gui.controls.GuideGrid
 */

app.gui.controls.GuideGrid = function GuideGrid() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideGrid, app.gui.controls.HtmlGrid);

/**
 * @method createdCallback
 */
app.gui.controls.GuideGrid.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	$util.ControlEvents.on("app-guide:epgChannelStack", "page:previous", function() {
	}, this);
	$util.ControlEvents.on("app-guide:epgChannelStack", "page:next", function() {
	}, this);

    $util.ControlEvents.on("app-guide:guidegrid", "ctaSkip24H", function(key) {
		if (this.focused) {
			if (key === "FastForward" || key === "Forward") {
				this.fireControlEvent("scroll", 24 * 3600 * 1000, true);
			} else if (key === "Rewind") {
				this.fireControlEvent("scroll", -24 * 3600 * 1000, true);
			}
		}
	}, this);
	$util.ControlEvents.on("app-guide:ctaGuide", "ctaFfwdSkip", function(key) {
		if (this.focused) {
			//var gridStart = this.gridStart;
			if (key === "FastForward" || key === "Forward") {
				this.fireControlEvent("scroll", 24 * 3600 * 1000, true);
			}
		}
	}, this);
	$util.ControlEvents.on("app-guide:ctaGuide", "ctaRwdSkip", function(key) {
		if (this.focused) {
			//var gridStart = this.gridStart;
			if (key === "Rewind") {
				this.fireControlEvent("scroll", -24 * 3600 * 1000, true);
			}
		}
	}, this);
	$util.ControlEvents.on("app-guide:guidegrid", "ctaStar", function() {
		if (this.focused) {
			var selectedItem = this._selectedItem,
		        serviceId;

            if (selectedItem) {
                serviceId = selectedItem._data.serviceId;
            }
			$util.ControlEvents.fire("app-guide", "clear");
			$util.ControlEvents.fire("app-guide:epgChannelStack", "selectPage", serviceId, "genre_Favourites");
            $util.ControlEvents.fire("app-guide", "starChannel");
			$util.ControlEvents.fire("app-guide:epgChannelStack", "fetch", "genre_Favourites");
			$util.ControlEvents.fire("app-guide:epgChannelStack", "selectChannel", serviceId, "genre_Favourites", true);
		}
	}, this);

	$util.ControlEvents.on("app-guide:guidegrid", "noselectChannel", function() {
		if (this.focused) {
			if (!$config.getConfigValue("settings.tv.guide.now.and.next")) {
                $util.ControlEvents.fire("app-guide", "futureGrid");
                $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "select", 0, 0); // select one after next //@ "middle" instead? since 3 might not exist?
                $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "focus");
			} else {
				$util.ControlEvents.fire("app-guide", "nowNextGrid");
                $util.ControlEvents.fire("app-guide:nowNextGrid", "select", 0, 0); // select now event
                $util.ControlEvents.fire("app-guide:nowNextGrid", "focus");
                $util.ControlEvents.fire("app-guide:nowNextGrid", "noChannel");
			}
		}
	}, this);

	this._gridSpanVisible = (2 * 3600 * 1000); // 2 hrs
	this._gridSpanBuffer  = (30 * 60 * 1000);  // 30 mins

	this._hiddenClass = "hide";

	this._channels = [];
	this._sliderElem = this.parentElement.parentElement;
	this._scrolledPix = 0;
	this._fastModeTimer = null;
	this._lastScroll = 0;

	this._pixUnit = $config.getConfigValue("settings.tv.guide.grid.pixels");

	this.logExit();
};

/**
 * @method _reset
 */
app.gui.controls.GuideGrid.prototype._reset = function _reset() {
	this.logEntry();
	this._sliderElem.style.webkitTransform = "translate3d(0px, 0px, 0px)";
	this._scrolledPix = 0;
	this.superCall();
	this.logExit();
};

/**
 * @method _change
 */
app.gui.controls.GuideGrid.prototype._change = function _change() {
	this.logEntry();

	if (this.visible) {
		// slide grid if we move to an event which has its outside of the visible area
		var selectedItem = this.selectedItem,
			cellStart = selectedItem ? selectedItem.cellStart : null,
			cellEnd = selectedItem ? selectedItem.cellEnd : null;
		if (cellEnd && cellEnd < this._gridVisibleStart) {
			this.fireControlEvent("scroll:left", false);
		} else if (cellStart && cellStart > this._gridVisibleEnd) {
			this.fireControlEvent("scroll:right", false);
		}
	}

	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.GuideGrid.prototype._fetch = function _fetch(channels) {
	this.logEntry();
	var channelList = channels,
		r, clen, service,
		promises = [],
		me = this;

	if (!channelList) { // use previous channels
		channelList = this._channels;
	}

	clen = channelList ? channelList.length : 0;
	this._channels = channelList;

	if (!this._gridStart) {
		this.fireControlEvent("reset");
	}
	if (!this._gridStart) {
		this.gridStart = Date.now();
	}

	for (r = 0; r < clen; r++) {
		service = this._channels[r];
		if (service && service.serviceId) {
			promises.push($service.EPG.Event.byTime(service, this._gridStart, this._gridEnd, true).then(function(data) { //+(6*3600*1000))
					return data;
				},
				function() {
					return []; // doesnt have to be a failure! e.g if stop<start
					}));
		}
	}

	Promise.all(promises).then(function(data) {
		me.fireControlEvent("populate", data);
	});

	this.logExit();
};

/**
 * @method _update
 */
app.gui.controls.GuideGrid.prototype._update = function _update(offset) {
	this.logEntry();

	this.gridStart = this._gridStart + offset;

	if (offset === 0 || Math.abs(offset) > this.gridSpan) { // no or large jump: refetch and repopulate
		this.fireControlEvent("fetch");
		return;
	}

	var r, rlen, clen = this._channels.length,
		service, data,
		promises = [],
		start, end,
		me = this;

		for (r = 0; r < clen; r++) {
			service = this._channels[r];
			rlen = this._rows[r].length;

			if (service && service.serviceId) {
				if (offset < 0) { // prepend: use first cell to get fetch time
					//@hdk ask for one more if selected is first
					data = rlen ? this._rows[r][0].itemData : null;
					start = this._gridStart;
					end = rlen ? data.startTime : this._gridEnd; // startTime of first cell or full range if no cells
				} else { // append: use last cell as fetch time
					//@hdk ask for one more if selected is last
					data = rlen ? this._rows[r][rlen - 1].itemData : null;
					start = rlen ? data.endTime : this._gridStart; // endTime of last cell or full range if no cells
					end = (this._gridEnd > start) ? this._gridEnd : start + this._gridSpanBuffer;
				}
				
				promises.push($service.EPG.Event.byTime(service, start, end, true).catch(function() {
					return []; // do something?
				}));
			}
		}

	Promise.all(promises).then(function(datas) {
		me.fireControlEvent(offset < 0 ? "prepend" : "append", datas);
	});

	this.logExit();
};

/**
 * @method _scroll
 */
app.gui.controls.GuideGrid.prototype._scroll = function _scroll(offset, fastMode, end) {
	this.logEntry();
	if (!this._fastMode && fastMode) { // switch to fast
		this.parentElement.classList.add('gridEpg-fast-horizontal');
		this._sliderElem.classList.add("noAnimation");
	} else if (this._fastMode && !fastMode) { // switch to slow
		this.parentElement.classList.remove('gridEpg-fast-horizontal');
		this._sliderElem.classList.remove("noAnimation");
	}

	this.superCall(offset, fastMode);

	if (fastMode) { // kick timer
		var me = this;
		clearTimeout(this._fastModeTimer);
		this._fastModeTimer = setTimeout(function() {
			me._scroll(0, false); // redraw
			if (end === 1) {
				me.fireControlEvent("select:column", "first"); // select somewhere in the middle
			} else if (end === 2) {
				me.fireControlEvent("select:column", "last");
			} else {
				me.fireControlEvent("select:column", "middle"); // select somewhere in the middle
			}
			
		}, 500);
	} else {
		this._scrolledPix = Math.floor((this._pixUnit * (this.zeroOffset - this._gridStart)) / (60 * 1000));
		this._sliderElem.style.webkitTransform = "translate3d(" + this._scrolledPix + "px, 0px, 0px)";
	}

	this._fastMode = fastMode;

	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.GuideGrid.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	switch (e.key) {
		case "ChannelDown":
			$util.ControlEvents.fire("app-guide:epgChannelStack", "page:next");
			break;
		case "ChannelUp":
			$util.ControlEvents.fire("app-guide:epgChannelStack", "page:previous");
			e.stopImmediatePropagation();
			break;
		default:
			this.superCall(e);
			break;
	}
	this.logExit();
};




/**
 * @class app.gui.controls.GuideGridCell
 */
app.gui.controls.GuideGridCell = function GuideGridCell() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideGridCell, app.gui.controls.HtmlGridItem);

/**
 * @method createdCallback
 */
app.gui.controls.GuideGridCell.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

  this._cell = this.ownerDocument.createElement("div");
  this.appendChild(this._cell);

  this._title = this.ownerDocument.createElement("span");
  this._cell.appendChild(this._title);

  this._icons = this.ownerDocument.createElement("div");
  this._icons.className = "epgIcons";
  this._cell.appendChild(this._icons);

	this._focusClass = "focus";
	this._emptyClass = "unavailable";

	this.logExit();
};

Object.defineProperty(app.gui.controls.GuideGridCell.prototype, "cellStart", {
	get: function get() {
		var data = this.itemData;
		return (data ? data.progStartDate : null);
	}
});

Object.defineProperty(app.gui.controls.GuideGridCell.prototype, "cellEnd", {
	get: function get() {
		var data = this.itemData;
		return (data ? data.progEndDate : null);
	}
});

