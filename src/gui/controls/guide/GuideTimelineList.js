/**
 * @class app.gui.controls.GuideTimelineList
 */

app.gui.controls.GuideTimelineList = function GuideTimelineList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideTimelineList, app.gui.controls.HtmlList);

/**
 * @method createdCallback
 */
app.gui.controls.GuideTimelineList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this._listElem.className = "timelineScroller";
	this._listElem.style.width = "3132px";

	this._stepTime = 1800 * 1000; // 30 mins

	this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.GuideTimelineList.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	this.superCall();

	this._grid = document.querySelector("#" + this.dataset.grid);

	if (this._grid) {
		var me = this;
		this._grid.onControlEvent("populated", function() {
			me.fireControlEvent("populate", false);
		});
		this._grid.onControlEvent("scroll", function(offset, fastMode) {
			me.fireControlEvent("populate", fastMode);
		});
	}
	this._pixUnit = $config.getConfigValue("settings.tv.guide.grid.pixels");
	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.GuideTimelineList.prototype._populate = function _populate(fastMode) {
	this.logEntry();

	var arr = [],
		startTime = this._grid._gridVisibleStart,
		endTime = this._grid.gridEnd;

	while (startTime < endTime) {
		arr.push(startTime);
		startTime += this._stepTime;
	}

	this.superCall(arr);

	if (!fastMode) {
		this._listElem.style.left = "0px";
		this._listElem.style.webkitTransform = "translate3d(" + this._grid._scrolledPix + "px, 0px, 0px)";
	}

	this.logExit();
};


/**
 * @class app.gui.controls.GuideTimelineListItem
 */

app.gui.controls.GuideTimelineListItem = function GuideTimelineListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideTimelineListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideTimelineListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._floatItem = true;
	this.logExit();
};


/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.GuideTimelineListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;

		var obj = $util.DateTime.timeObject(data);

		if (obj.mins === 0) {
			this.textContent = obj.hours; // hours only
		} else if (obj.mins < 10) {
			this.textContent = obj.hours + ":0" + obj.mins; // hours and 0minutes
		} else {
			this.textContent = obj.hours + ":" + obj.mins; // hours and minutes
		}
		this.setAttribute("x-meridiem", obj.meridiem);
	}
});
