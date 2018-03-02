/**
 * @class app.gui.controls.GuideFutureGrid
 */

app.gui.controls.GuideFutureGrid = function GuideFutureGrid() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideFutureGrid, app.gui.controls.GuideGrid);

/**
 * @method createdCallback
 */
app.gui.controls.GuideFutureGrid.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this._fetchCount = 0;
	this.superCall();
 	this.onControlEvent("scrollToTime", function (startTime) {
            var startTimeOffset = (startTime - this._gridSpanBuffer - (startTime % this._gridSpanBuffer)),
        	gridStart = this.gridStart,
        	actualOffset = startTimeOffset - gridStart;
            this.fireControlEvent("scroll", actualOffset, false);//shall scroll if already in the page?

	});
	this.logExit();
};

/**
 * @method _scroll
 */
app.gui.controls.GuideFutureGrid.prototype._scroll = function _scroll(offset, fastMode) {
	this.logEntry();

	var gridSpan = this.gridSpan,
		gridStart = this.gridStart,
		limit = this.upperLimit,
		actualOffset = offset,
		end = 0;

	if ((gridStart + gridSpan + actualOffset) > limit) { // limit to end of grid
		actualOffset = limit - gridStart - gridSpan;
		if (fastMode === true && actualOffset === 0) {
            end = 2;
	    }
	}

	this.superCall(actualOffset, fastMode, end);

	this.logExit();
};

app.gui.controls.GuideFutureGrid.prototype._fetch = function _fetch(channels) {
	this.logEntry();
	this._fetchCount = this._fetchCount + 1;
	if (this._isFocused && this._fetchCount > 0) {
		$util.ControlEvents.fire("app-guide", "startLoading");
	}
	this.superCall(channels);
	this.logExit();
};

app.gui.controls.GuideFutureGrid.prototype._populate = function _populate(ctrl) {
	this.logEntry();
	this._fetchCount = this._fetchCount - 1;
	if (this._fetchCount <= 0) {
		this._fetchCount = 0;
		if (this._isFocused) {
			$util.ControlEvents.fire("app-guide", "stopLoading");
		}
		this.superCall(ctrl);
	}
	this.logExit();
};

/**
 * @property zeroOffset
 */
Object.defineProperty(app.gui.controls.GuideFutureGrid.prototype, "zeroOffset", {
	get: function get() {
		var now = Date.now();
		return (now - this._gridSpanBuffer - (now % this._gridSpanBuffer));
	}
});

/**
 * @property upperLimit
 */
Object.defineProperty(app.gui.controls.GuideFutureGrid.prototype, "upperLimit", {
	get: function get() {
		var limit = Date.now() + (14 * 24 * 3600 * 1000); // one week
		return (limit - this._gridSpanBuffer - (limit % this._gridSpanBuffer)); // round to buffer
	}
});

/**
 * @property lowerLimit
 */
Object.defineProperty(app.gui.controls.GuideFutureGrid.prototype, "lowerLimit", {
	get: function get() {
		return (Date.now() - (2 * this._gridSpanBuffer));
	}
});

/**
 * @class app.gui.controls.GuideFutureGridCell
 */

app.gui.controls.GuideFutureGridCell = function GuideFutureGridCell() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideFutureGridCell, app.gui.controls.GuideGridCell);

/**
 * @method createdCallback
 */
app.gui.controls.GuideFutureGridCell.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	/*
		<app-guide-future-grid-data id="futureEpg-event-id1488095509320" class="futureEpg-event" style="width: 17px; left: 0px;">
			<div class="futureEpg-cell" style="padding-left: 12px;">
				<span class="futureEpg-title" data-start="" data-stop=""></span>
				<div class="epgIcons">
					<span class="epgCellIcon iconRecord">R</span>
					<span class="epgCellIcon iconSeriesLinkList"></span>
					<span class="epgCellIcon iconPlay"></span>
					<span class="epgCellIcon iconCC">cc</span>
				</div>
			</div>
		</div>
	*/
	this.className = "futureEpg-event";
  this._cell.className = "futureEpg-cell";
  this._title.className = "futureEpg-title";

	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.GuideFutureGridCell.prototype, "itemData", { //@hdk TODO merge this with GuideReverseGridCell
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		var parent = this.parentControl,
			width,
			left,
			duration,
			titleLeft,
			// eslint-disable-next-line no-unused-vars
			titleRight,
			html,
			dataReady = false;

		this._data = data;

		if (data && parent) {
			this.dataset.id = "futureEpg-event-" + data.eventId;

			this._title.dataset.start = data.progStartDate;
			this._title.dataset.stop = data.progEndDate;

			width = this._getWidth(data.progStartDate, data.progEndDate);
			left  = this._getWidth(parent._gridStart, data.progStartDate);
			duration = data.duration;
			titleLeft = 0;
			titleRight = 0;

			// crop events on bounderies
			if (data.progStartDate <= parent._gridVisibleStart && data.progEndDate > parent._gridVisibleStart) {
				titleLeft = this._getWidth(data.progStartDate, parent._gridVisibleStart);
				this.classList.add("futureEpg-event-before-start");
			}
			if (data.progStartDate <= parent._gridVisibleEnd && data.progEndDate > parent._gridVisibleEnd) {
				titleRight = this._getWidth(parent._gridVisibleEnd, data.progEndDate);
				this.classList.add("futureEpg-event-after-end");
			}

			this.style.left = left + "px";
			this.style.width = width + "px";

			if (dataReady) { // if ((!isConnected && data.progEndDate < data)) {
				this._cell.classList.add("unavailable");
			}

			if (duration >= 120 && duration <= 300) {
				this._title.textContent = "i"; // short event (2-5 mins) : display i
				//@hdk TODO: when this happens the CC and Watch Now icons are droppped off as the Record and Series Link icons come in
			} else if (titleLeft > 0) { // when started before edge time
				this._title.innerHTML = "<span style='padding-left:" + (5 + titleLeft) + "px; padding-right:12px'>" + data.title + "</span>";
			} else {
				this._title.textContent = data.title;
			}

			html = "";
			if (data.progEndDate < parent._gridVisibleEnd) {
				if (data.isClosedCaptioned !== undefined && data.isClosedCaptioned === true) { // if (data.closedCaptionsAvailable && subtitlesEnabled) {
					html += '<span class="epgCellIcon iconCC">CC</span>';
				}
				if (data.isCatchUp === true || data.isStartOver === true) {
					if (data.isOnNow === true) {
						html += '<span class="epgCellIcon iconPlay"></span>';
					}
				}
			}
			if (data.isInFuture && o5.platform.btv.Reminders.isReminderSetForEventId(data.eventId)) {
				html += '<span class="epgCellIcon iconReminder"></span>';
			}
			this._icons.innerHTML = html;
		} else {
			this._title.textContent	=	"Unknown Event";
		}
	}
});

