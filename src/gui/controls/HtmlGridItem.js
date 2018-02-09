/**
 * @class app.gui.controls.HtmlGridItem
 */
app.gui.controls.HtmlGridItem = function HtmlGridItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlGridItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 */
app.gui.controls.HtmlGridItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _getWidth
 */
app.gui.controls.HtmlGridItem.prototype._getWidth = function _getWidth(start, end) {
	this.logEntry();
	var pixUnit = $config.getConfigValue("settings.tv.guide.grid.pixels"),
		pix = Math.floor(((end - start) * pixUnit) / (60 * 1000));
	this.logExit(pix);
	return pix;
};

Object.defineProperty(app.gui.controls.HtmlGridItem.prototype, "cellStart", {
	get: function get() {
		var data = this.itemData;
		return ((data && data.start !== undefined) ? data.start : null);
	}
});

Object.defineProperty(app.gui.controls.HtmlGridItem.prototype, "cellEnd", {
	get: function get() {
		var data = this.itemData;
		return ((data && data.end !== undefined) ? data.end : null);
	}
});

Object.defineProperty(app.gui.controls.HtmlGridItem.prototype, "cellMiddle", {
	get: function get() {
		var start = this.cellStart,
			end = this.cellEnd,
			middle = (start !== null && end !== null ? (start + Math.floor((end - start) / 2)) : null);
		return middle;
	}
});

/**
 * @property itemRowIndex
 * Row index of given element in the full list
 */
Object.defineProperty(app.gui.controls.HtmlGridItem.prototype, "itemRowIndex", {
	get: function get() {
		return parseInt(this.dataset.row);
	},
	set: function set(index) { // only works when in DOM!?
		this.dataset.row = index;
	}
});

/**
 * @property itemColIndex
 * Column index of given element in the full list
 */
Object.defineProperty(app.gui.controls.HtmlGridItem.prototype, "itemColIndex", {
	get: function get() {
		return parseInt(this.dataset.col);
	},
	set: function set(index) { // only works when in DOM!?
		this.dataset.col = index;
	}
});
