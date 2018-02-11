/**
 * @class app.gui.controls.GuideReverseGrid
 */

app.gui.controls.GuideReverseGrid = function GuideReverseGrid() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideReverseGrid, app.gui.controls.GuideGrid);

/**
 * @method createdCallback
 */
app.gui.controls.GuideReverseGrid.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _scroll
 */
app.gui.controls.GuideReverseGrid.prototype._scroll = function _scroll(offset, fastMode) {
	this.logEntry();
	var gridStart = this.gridStart,
		limit = this.lowerLimit,
		end = 0,
		actualOffset = offset;
    if (gridStart <= limit && offset < 0 && offset !== -24 * 3600 * 1000) {
    	return;
    }
	if ((gridStart + actualOffset) < limit) { // limit to start of grid
		actualOffset = limit - gridStart;
		if (fastMode === true && actualOffset === 0) {
            end = 1;
	    }
	}

	this.superCall(actualOffset, fastMode, end);
	
	this.logExit();
};

/**
 * @property zeroOffset
 */
Object.defineProperty(app.gui.controls.GuideReverseGrid.prototype, "zeroOffset", {
	get: function get() {
		var now = Date.now();
		return (now - (now % this._gridSpanBuffer) + this._gridSpanBuffer - this.gridSpan);
	}
});

/**
 * @property upperLimit
 */
Object.defineProperty(app.gui.controls.GuideReverseGrid.prototype, "upperLimit", {
	get: function get() {
		return (Date.now() + this._gridSpanBuffer);
	}
});

/**
 * @property lowerLimit
 */
Object.defineProperty(app.gui.controls.GuideReverseGrid.prototype, "lowerLimit", {
	get: function get() {
		var limit = Date.now() - (27 * 3600 * 1000); // 27 hrs in the past
		return (limit - this._gridSpanBuffer - (limit % this._gridSpanBuffer)); // round to buffer
	}
});

/**
 * @class app.gui.controls.GuideReverseGridCell
 */

app.gui.controls.GuideReverseGridCell = function GuideReverseGridCell() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideReverseGridCell, app.gui.controls.GuideGridCell);

/**
 * @method createdCallback
 */
app.gui.controls.GuideReverseGridCell.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	/*
		<app-guide-reverse-grid-data id="reverseEpg-event-id1488095509320" class="reverseEpg-event" style="width: 17px; left: 0px;">
			<div class="reverseEpg-cell" style="padding-right: 12px;">
				<span class="reverseEpg-title" data-start="" data-stop=""></span>
				<div class="epgIcons">
					<span class="epgCellIcon iconRecord">R</span>
					<span class="epgCellIcon iconSeriesLinkList"></span>
					<span class="epgCellIcon iconPlay"></span>
					<span class="epgCellIcon iconCC">cc</span>
				</div>
			</div>
		</div>
	*/
	this.className = "reverseEpg-event";
  this._cell.className = "reverseEpg-cell";
  this._title.className = "reverseEpg-title";

	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.GuideReverseGridCell.prototype, "itemData", { //@hdk TODO merge this with GuideFutureGridCell
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		var parent = this.parentControl,
			width, left, duration, titleLeft,
			// eslint-disable-next-line no-unused-vars
			titleRight,
			html;

		this._data = data;

		if (data && parent) {
			this.dataset.id = "reverseEpg-event-" + data.eventId;

			this._title.dataset.start = data.progStartDate;
			this._title.dataset.stop = data.progEndDate;

			width = this._getWidth(data.progStartDate, data.progEndDate);
			left = this._getWidth(parent.zeroOffset, data.progStartDate);
			duration = data.duration;
			titleLeft = 0;
			titleRight = 0;

			// crop events on bounderies
			if (data.progStartDate <= parent._gridVisibleStart && data.progEndDate > parent._gridVisibleStart) {
				titleLeft = this._getWidth(data.progStartDate, parent._gridVisibleStart);
				this.classList.add("reverseEpg-event-before-start");
			}
			if (data.progStartDate <= parent._gridVisibleEnd && data.progEndDate > parent._gridVisibleEnd) {
				titleRight = this._getWidth(parent._gridVisibleEnd, data.progEndDate);
				this.classList.add("reverseEpg-event-after-end");
			}

			this.style.left = left + "px";
			this.style.width = width + "px";

			if (!data.isCatchUp && data.isReverse && !data.isStartOver) {
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
				if ((data.isStartOver === true || data.isCatchUp === true) && data.isReverse === true) {
					html += '<span class="epgCellIcon iconPlay"></span>';
				}
			}
			this._icons.innerHTML = html;
		} else {
			this._title.textContent	=	"Unknown Event";
		}
	}
});

