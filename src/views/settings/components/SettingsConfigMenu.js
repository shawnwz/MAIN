/**
 * SettingsConfigMenu is a reusable menu containing multiple
 * menu item types per line. These items are hidden when not
 * required. The item type to be used is determined by the
 * menu data supplied.
 *
 * Example markup:
 *
 *     <app-settings-config-menu data-rows="6"></app-grid-menu>
 *
 * @class app.gui.controls.SettingsConfigMenu
 * @extends o5.gui.controls.Control
 */

app.gui.controls.SettingsConfigMenu = function SettingsConfigMenu() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsConfigMenu);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsConfigMenu.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._initProperties();
	$util.Functional.range(this.dataset.rows).forEach(this._createRow, this);
	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.SettingsConfigMenu.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	this.logExit();
};

/**
 * @method _initProperties
 * @private
 */
app.gui.controls.SettingsConfigMenu.prototype._initProperties = function _initProperties() {
	this.logEntry();
	this._items = new app.data.Collection();
	this._data = new app.data.Collection();
	this._selectedItemIndex = 0;

	this.tabIndex = -1;

	this.onkeydown = this._onKeyDown;
	this.onfocus = this._onFocus;
	this.onblur = this._onBlur;
	this.logExit();
};

/**
 * @method _createRow
 * @private
 */
app.gui.controls.SettingsConfigMenu.prototype._createRow = function _createRow() {
	this.logEntry();
	var item = this.ownerDocument.createElement("app-settings-config-menu-row");
	this._items.push(item);
	this.appendChild(item);
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsConfigMenu.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	var handled = false;
	if (e.repeat) {
		e.stopImmediatePropagation();
		return;
	}

	switch (e.key) {
		case "ArrowDown":
			handled = this._moveSelection(1);
			break;
		case "ArrowUp":
			handled = this._moveSelection(-1);
			break;
		case "Red":
			handled = true;
			this._undo();
			break;
		default:
			break;
	}
	if (handled === true) {
		e.stopImmediatePropagation();
	}
	this.logExit();
};

/**
 * @method _onFocus
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsConfigMenu.prototype._onFocus = function _onFocus() {
	this.logEntry();
	this._items[this._selectedItemIndex].focus();
	this.logExit();
};

/**
 * @method _onBlur
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsConfigMenu.prototype._onBlur = function _onBlur() {
	this.logEntry();
	this.logExit();
};

/**
 * @method setData
 * @public
 * @param {Array} data
 */
app.gui.controls.SettingsConfigMenu.prototype.setData = function setData(data) {
	this.logEntry();
	this._data = [];

	this._items.forEach(function (item, itemIndex) {
		if (data[itemIndex]) {
			this._data.push(data[itemIndex]);
		}
		item.update(data[itemIndex]);
	}, this);

	this._updateSelectedData();

	this.logExit();
};

/**
 * @method _moveSelection
 * @private
 * @param {Number} vertical
 * @return {Boolean} True if the selection moved, false otherwise
 */
app.gui.controls.SettingsConfigMenu.prototype._moveSelection = function _moveSelection(vertical) {
	this.logEntry();
	var newVerticalPosition = this._selectedItemIndex + vertical,
		positionChanged = false;
	if (this._data[newVerticalPosition]) {
		positionChanged = true;
		this.unHighlight();
		this._selectedItemIndex = newVerticalPosition;
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
app.gui.controls.SettingsConfigMenu.prototype.resetSelection = function resetSelection() {
	this.logEntry();
	this.highlightItem(0);
	this.logExit();
};

/**
 * @method highlightItem
 * @public
 * @param {Number} row
 */
app.gui.controls.SettingsConfigMenu.prototype.highlightItem = function highlightItem(row) {
	this.logEntry();
	this.unHighlight();
	this._selectedItemIndex = row;
	this._updateSelectedData();
	this.highlight();
	this.logExit();
};

/**
 * @method highlight
 * @public
 */
app.gui.controls.SettingsConfigMenu.prototype.highlight = function highlight() {
	this.logEntry();
	this._items[this._selectedItemIndex].focus();
	this.logExit();
};

/**
 * @method unHighlight
 * @public
 */
app.gui.controls.SettingsConfigMenu.prototype.unHighlight = function unHighlight() {
	this.logEntry();
	this._items[this._selectedItemIndex].unHighlight();
	this.logExit();
};

/**
 * @method _updateSelectedData
 * @private
 */
app.gui.controls.SettingsConfigMenu.prototype._updateSelectedData = function _updateSelectedData() {
	this.selectedData = this._data[this._selectedItemIndex];
};

/**
 * @method _undo
 * @private
 */
app.gui.controls.SettingsConfigMenu.prototype._undo = function _undo() {
	this._items.filter(function (item) {
		return (item.visible);
	}).forEach(function (item) {
		item.undo();
	});
};
