/**
 * @class app.gui.controls.GuideNowNextGrid
 */

app.gui.controls.GuideNowNextGrid = function GuideNowNextGrid() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideNowNextGrid, app.gui.controls.HtmlTable);

/**
 * @method createdCallback
 */
app.gui.controls.GuideNowNextGrid.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	$util.ControlEvents.on("app-guide:epgChannelStack", "page:previous", function() {
	}, this);
	$util.ControlEvents.on("app-guide:epgChannelStack", "page:next", function() {
	}, this);

	this._hiddenClass = "hide";

	this._fetchTimeout = null;
	this._readyToFetch = false;
	this._FETCHTIMEOUT = 1000;

	this._clearFetchTimeout = function () {
		clearTimeout(this._fetchTimeout);
		this._fetchTimeout = null;
	};

	this._resetTimeout = function () {
		var me = this;
		this._clearFetchTimeout();
		if (this._readyToFetch) {
			this._fetchTimeout = setTimeout(function () {
				me._readyToFetch = false;
				me.fireControlEvent("populate");
			}, this._FETCHTIMEOUT);
		}
	};

	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.GuideNowNextGrid.prototype._fetch = function _fetch(channels) {
	this.logEntry();
	var i, len = channels ? channels.length : 0,
		promises = [],
		now = Date.now(),
		me = this,
		service;

	if (this._itemNb === 0) {
		for (i = 0; i < len; i++) {
			service = channels[i];
			if (service && service.serviceId) {
				promises.push($service.EPG.Event.byCount(service, now, 2, true).then(function(data) { //@hdk iQ3 has 3 events!
					return data;
				},
				function() {
					return []; //@hdk do something?
				}));
			}
		}

		Promise.all(promises).then(function(data) {
			me._readyToFetch = true;
			me._clearFetchTimeout();
			me._fetchTimeout = setTimeout(function () {
				me._readyToFetch = false;
				me.fireControlEvent("populate", data);
			}, me._FETCHTIMEOUT);
		});
	}
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.GuideNowNextGrid.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	if (e.key === "ChannelDown" || e.key === "ChannelUp" || e.key === "ArrowUp" || e.key === "ArrowDown") {
		this._resetTimeout();
	}
	switch (e.key) {
		case "ChannelDown":
			$util.ControlEvents.fire("app-guide:epgChannelStack", "page:next");
			e.stopImmediatePropagation();
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
 * @class app.gui.controls.GuideNowNextGridCell
 */
app.gui.controls.GuideNowNextGridCell = function GuideNowNextGridCell() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideNowNextGridCell, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 */
app.gui.controls.GuideNowNextGridCell.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	/*
		<app-guide-now-next-grid-cell id="nowNextGrid-event-x" class="nowNextGrid-cell now">
			<div class="nowNextGrid-time"></div>
			<div class="nowNextGrid-title"></div>
			<div class="nowNextGrid-progress" style="width:0;"></div>
		</app-guide-now-next-grid-cell>
	*/
	this.className = "nowNextGrid-cell";

	this._time = this.ownerDocument.createElement("div");
	this._time.className = "nowNextGrid-time";
	this.appendChild(this._time);

	this._title = this.ownerDocument.createElement("div");
	this._title.className = "nowNextGrid-title";
	this.appendChild(this._title);

	this._progress = this.ownerDocument.createElement("div");
	this._progress.className = "nowNextGrid-progress";
	this.appendChild(this._progress);

	this._icons = this.ownerDocument.createElement("div");
	this._icons.className = "epgIcons";
	this.appendChild(this._icons);

	this._focusClass = "focus";
	this._emptyClass = "unavailable";

	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.GuideNowNextGridCell.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;
		var dataReady = false,
			html = "";

		if (data) {
			this.dataset.id = "nowNextGrid-event-" + data.eventId;

			if (data.isOnNow === true) {
				this.classList.add("now");
				this._progress.style.width = data.progress + "%";
			} else { // if (data.isNext === true) {
				this.classList.add("next");
				this._progress.style.width = 0;
			}

			this._time.textContent	=	data.progStartDateText;
			this._title.textContent	=	data.title;

			if (dataReady) {
				this._cell.classList.add("unavailable");
			}

			if (data.isClosedCaptioned !== undefined && data.isClosedCaptioned === true) {
				html += '<span class="epgCellIcon iconCC">CC</span>';
			}
			if (data.isStartOver === true && data.isOnNow === true) {
				html += '<span class="epgCellIcon iconPlay"></span>';
			}

			/*
			if (data.seriesId && data.seriesId !== undefined) {
				html += "<span class='epgCellIcon iconSeriesLinkList'></span>";
			}
			*/
			
			if (data.isInFuture && o5.platform.btv.Reminders.isReminderSetForEventId(data.eventId)) {
				html += '<span class="epgCellIcon iconReminder"></span>';
			}
			this._icons.innerHTML = html;
		} else {
			this._title.textContent	=	"Unknown Event";
		}
	}
});

