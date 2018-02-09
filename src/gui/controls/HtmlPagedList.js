/**
 * @class app.gui.controls.HtmlPagedList
 */

app.gui.controls.HtmlPagedList = function HtmlPagedList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlPagedList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 */
app.gui.controls.HtmlPagedList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._allData = [];
	this._pageIndex = 0;
	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.HtmlPagedList.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	this.superCall();

	// overwrite the handler, we want to keep the onclear function for when we populate without resettng the page
	this.removeControlEvent("clear");
	this.onControlEvent("clear", function() {
		this._pageIndex = 0;
		this._clear();
	});

	this.onControlEvent("page:next", this._nextPage);
	this.onControlEvent("page:previous", this._previousPage);

	this.onControlEvent("page:index", function(index) {
		if (index >= 0 && index < this._pagesNb) {
			this._pageIndex = index;
			this.fireControlEvent("populate");
		}
	});

	this.onControlEvent("page:size", this._setPageSize);

	this.logExit();
};

/**
 * @method _reset
 */
app.gui.controls.HtmlPagedList.prototype._reset = function _reset() {
	this.logEntry();
	if (this._pageIndex !== 0) {
		this._pageIndex = 0;
		this.fireControlEvent("populate");
	} else {
		this.superCall();
	}
	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.HtmlPagedList.prototype._populate = function _populate(arr, index) {
	this.logEntry();
	var data = arr,
		i,
		len,
		maxNb = this._maxItemNb;

	if (typeof data === "undefined") { // reuse same data
		data = this._allData;
	}

	len = data ? data.length : 0;

	if (len > 0) {
		this._allData = data;

		if (maxNb === 0) {
			this._pagesNb = 1;
			this.superCall(data);
		} else {
			this._pagesNb = Math.ceil(len / maxNb);

			i = this._pageIndex * maxNb;
			if (i < len) { // get given page
				this.superCall(data.slice(i, i + maxNb), index);
			} else { // get last page
				this.superCall(data.slice(-1 * maxNb), index);
			}
		}
	}

	this.logExit();
};

/**
 * @method _nextPage
 */
app.gui.controls.HtmlPagedList.prototype._nextPage = function _nextPage() {
	this.logEntry();
	var handled = false;
	if (this._pageIndex < (this._pagesNb - 1)) {
		this._pageIndex++;
		this.fireControlEvent("populate");
		handled = true;
	} else if (this._cyclic) {
		this._pageIndex = 0;
		this.fireControlEvent("populate");
		handled = true;
	}
	this.logExit(handled);
	return handled;
};

/**
 * @method _previousPage
 */
app.gui.controls.HtmlPagedList.prototype._previousPage = function _previousPage() {
	this.logEntry();
	var handled = false;
	if (this._pageIndex > 0) {
		this._pageIndex--;
		this.fireControlEvent("populate");
		handled = true;
	} else if (this._cyclic) {
		this._pageIndex = (this._pagesNb - 1);
		this.fireControlEvent("populate");
		handled = true;
	}
	this.logExit(handled);
	return handled;
};

/**
 * @method _onKeyDown
 */
app.gui.controls.HtmlPagedList.prototype._setPageSize = function _setPageSize(size) {
	this.logEntry();

	if (this._maxItemNb === size) { // nothing to do
		return;
	}

	var selectedIndex = -1;

	if (this.selectedItem) { // get current item index on all pages
		selectedIndex = this.selectedItem.itemIndex + (this._maxItemNb * this._pageIndex);
	}

	this._maxItemNb = size;
	this._minItemNb = size;

	if (selectedIndex > -1) {
		this._pageIndex = Math.floor(selectedIndex / this._maxItemNb);
		selectedIndex %= this._maxItemNb;

		this.fireControlEvent("populate", this._allData, selectedIndex);
	} else {
		this._pageIndex = 0;
		this.fireControlEvent("populate");
	}

	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.HtmlPagedList.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	switch (e.key) {
		case "ChannelDown":
			if (!this._nextPage(e)) {
				this.fireControlEvent("select", this._itemNb - 1);
			}
			e.stopImmediatePropagation();
			break;
		case "ChannelUp":
			if (!this._previousPage(e)) {
				this.fireControlEvent("select", 0);
			}
			e.stopImmediatePropagation();
			break;
		default:
			this.superCall(e);
			break;
	}
	this.logExit();
};

