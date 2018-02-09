/**
 * GridMenu is a mosaic-like menu with static menu items.
 * The number of rows and columns are configured via the data-rows
 * and data-cols attributes. Items are set by passing and array of
 * objects to setData(). This loads items into the menu column first.
 * Unused DOM elements are hidden. Excess data items are ignored.
 *
 * Example markup:
 *
 *     <app-grid-menu data-rows="5" data-cols="2" data-item-template="app-menu-item"></app-grid-menu>
 *
 * The data-item-template atribute will default to app-menu-item.
 * Any menu item can be used that implements the following interface:
 * 		update()
 * 		highlight()
 * 		unHighlight()
 *
 * @class app.gui.controls.GridMenu
 * @extends o5.gui.controls.Control
 */

app.gui.controls.GridMenu = function GridMenu() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GridMenu);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GridMenu.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this._items = [];
	this._data = [];
	this._selectedCol = 0;
	this._selectedRow = 0;
	this.selectedData = null;
	this._selectedCallback = function () {};
	this._highlightedCallback = function () {};

	this.tabIndex = -1;

	this.onkeydown = this._onKeyDown;
	this.onfocus = this._onFocus;
	this.onblur = this._onBlur;

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.GridMenu.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	var colIndex = 0,
		rowIndex = 0,
		item = {};

	for (colIndex = 0; colIndex < (this.dataset.cols); colIndex++) {
		if (!this._items[colIndex]) {
			this._items[colIndex] = [];
		}
		for (rowIndex = 0; rowIndex < (this.dataset.rows); rowIndex++) {
			item = this.ownerDocument.createElement(this.dataset.itemTemplate || "app-menu-item");
			item.dataset.col = colIndex % this.dataset.cols;
			item.dataset.row = rowIndex % this.dataset.rows;
			this._items[colIndex].push(item);
			this.appendChild(item);
		}
	}
	this.logExit();
};

/**
 * @method _onFocus
 * @private
 * @param {Object} e
 */
app.gui.controls.GridMenu.prototype._onFocus = function _onFocus() {
	this.logEntry();
	this.highlight();
	this.logExit();
};

/**
 * @method _onBlur
 * @private
 * @param {Object} e
 */
app.gui.controls.GridMenu.prototype._onBlur = function _onBlur() {
	this.logEntry();
	this.unHighlight();
	this.logExit();
};

/**
 * @method setData
 * @public
 * @param {Array} data
 */
app.gui.controls.GridMenu.prototype.setData = function setData(data) {
	this.logEntry();
	var itemIndex = 0;

	this._data = [];

	this._items.forEach(function (col, colIndex) {
		if (!this._data[colIndex]) {
			this._data[colIndex] = [];
		}
		col.forEach(function (item) {
			if (!this._data[colIndex]) {
				this._data[colIndex] = [];
			}
			if (data[itemIndex]) {
				this._data[colIndex].push(data[itemIndex]);
			}
			item.update(data[itemIndex]);
			itemIndex++;
		}, this);
	}, this);

	this._updateSelectedData();

	this.logExit();
};

/**
 * @method setSelectedCallback
 * @public
 * @param {function} callback
 */
app.gui.controls.GridMenu.prototype.setSelectedCallback = function setSelectedCallback(callback) {
	this.logEntry();
	if (typeof callback === "function") {
		this._selectedCallback = callback;
	}
	this.logExit();
};

/**
 * @method setHighlightedCallback
 * @public
 * @param {function} callback
 */
app.gui.controls.GridMenu.prototype.setHighlightedCallback = function setHighlightedCallback(callback) {
	this.logEntry();
	if (typeof callback === "function") {
		this._highlightedCallback = callback;
	}
	this.logExit();
};

/**
 * @method _moveSelection
 * @private
 * @param {Number} vertical
 * @param {Number} horizontal
 * @return {Boolean} True if the selection moved, false otherwise
 */
app.gui.controls.GridMenu.prototype._moveSelection = function _moveSelection(vertical, horizontal) {
	this.logEntry();
	var newVerticalPosition = this._selectedCol + vertical,
		newHorizontalPosition = this._selectedRow + horizontal,
		positionChanged = false;
	if (this._data[newVerticalPosition] && this._data[newVerticalPosition][newHorizontalPosition]) {
		positionChanged = true;
		this.unHighlight();
		this._selectedCol = newVerticalPosition;
		this._selectedRow = newHorizontalPosition;
		this._updateSelectedData();
		this.highlight();
	}
	this.logExit();
	return positionChanged;
};

/**
 * @method resetSelection
 * @public
 */
app.gui.controls.GridMenu.prototype.resetSelection = function resetSelection() {
	this.logEntry();
	this.highlightItem(0, 0);
	this.logExit();
};

/**
 * @method highlightItem
 * @public
 * @param {Number} column
 * @param {Number} row
 */
app.gui.controls.GridMenu.prototype.highlightItem = function highlightItem(column, row) {
	this.logEntry();
	this.unHighlight();
	this._selectedCol = column;
	this._selectedRow = row;
	this._updateSelectedData();
	this.highlight();
	this.logExit();
};

/**
 * @method highlight
 * @public
 */
app.gui.controls.GridMenu.prototype.highlight = function highlight() {
	this.logEntry();
	this._items[this._selectedCol][this._selectedRow].highlight();
	this._highlightedCallback(this.selectedData);
	this.logExit();
};

/**
 * @method unHighlight
 * @public
 */
app.gui.controls.GridMenu.prototype.unHighlight = function unHighlight() {
	this.logEntry();
	this._items[this._selectedCol][this._selectedRow].unHighlight();
	this.logExit();
};

/**
 * @method select
 * @public
 */
app.gui.controls.GridMenu.prototype.select = function select() {
	this.logEntry();
	this._selectedCallback(this.selectedData);
	this.logExit();
};

/**
 * @method _updateSelectedData
 * @private
 */
app.gui.controls.GridMenu.prototype._updateSelectedData = function _updateSelectedData() {
	this.selectedData = this._data[this._selectedCol][this._selectedRow];
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.GridMenu.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	var handled = false;

	if (e.repeat) {
		e.stopImmediatePropagation();
		return true;
	}

	switch (e.key) {
		case "ArrowDown":
			handled = this._moveSelection(0, 1);
			break;
		case "ArrowUp":
			handled = this._moveSelection(0, -1);
			break;
		case "ArrowLeft":
			handled = this._moveSelection(-1, 0);
			break;
		case "ArrowRight":
			handled = this._moveSelection(1, 0);
			break;
		case "Ok":
		case "Enter":
			this.select();
			handled = true;
			break;
		default:
			break;
	}

	if (handled === true) {
		e.stopImmediatePropagation();
	}

	this.logExit();
	return false;
};

