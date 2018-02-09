/**
 * This class is WIP and will have generic functionality extracted into a generic base class.
 *
 * Example markup:
 *
 *     <app-menu data-orientation="vertical" data-items="6" data-item-template="app-menu-item"></app-menu>
 *
 * The data-item-template atribute will default to app-menu-item.
 * Any menu item can be used that implements the following interface:
 * 		update()
 * 		highlight()
 * 		unHighlight()
 *
 * @class app.gui.controls.Menu
 * @extends o5.gui.controls.Control
 */

app.gui.controls.Menu = function Menu() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.Menu);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.Menu.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	var itemIndex = 0,
		item = {};
	this.superCall();
	this._items = new app.data.Collection();
	this._data = new app.data.Collection();
	this._VERTICAL = "v";
	this._HORIZONTAL = "h";
	this._selectedCallback = function () {};
	this._highlightedCallback = function () {};
	this._orientation = this.dataset.orientation === "vertical" ? this._VERTICAL : this._HORIZONTAL;

	this.tabIndex = -1;

	this.onkeydown = this._onKeyDown;
	this.onfocus = this._onFocus.bind(this);
	this.onblur = this._onBlur;

	for (itemIndex = 0; itemIndex < (this.dataset.items); itemIndex++) {
		item = this.ownerDocument.createElement(this.dataset.itemTemplate || "app-menu-item");
		this._items.push(item);
		this.appendChild(item);
	}
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.Menu.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	var handled = false;

	switch (e.key) {
		case "ArrowLeft":
			if (this._orientation === this._HORIZONTAL) {
				this.selectPrevious();
				handled = true;
			}
			break;
		case "ArrowUp":
			if (this._orientation === this._VERTICAL) {
				this.selectPrevious();
				handled = true;
			}
			break;
		case "ArrowRight":
			if (this._orientation === this._HORIZONTAL) {
				this.selectNext();
				handled = true;
			}
			break;
		case "ArrowDown":
			if (this._orientation === this._VERTICAL) {
				this.selectNext();
				handled = true;
			}
			break;
		case "Enter":
		case "Ok":
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
};

/**
 * @method _onFocus
 * @private
 * @param {Object} e
 */
app.gui.controls.Menu.prototype._onFocus = function _onFocus() {
	this.logEntry();
	this.highlight();
	this.logExit();
};

/**
 * @method _onBlur
 * @private
 * @param {Object} e
 */
app.gui.controls.Menu.prototype._onBlur = function _onBlur() {
	this.logEntry();
	this.unHighlight();
	this.logExit();
};

/**
 * @method setData
 * @public
 * @return {Array} data
 */
app.gui.controls.Menu.prototype.setData = function setData(data) {
	this.logEntry();

	this._data.setData(data);

	this._items.forEach(function (item, itemIndex) {
		item.update(data[itemIndex]);
	});

	this.logExit();
};

/**
 * @method setSelectedCallback
 * @public
 * @param {function} callback
 */
app.gui.controls.Menu.prototype.setSelectedCallback = function setSelectedCallback(callback) {
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
app.gui.controls.Menu.prototype.setHighlightedCallback = function setHighlightedCallback(callback) {
	this.logEntry();
	if (typeof callback === "function") {
		this._highlightedCallback = callback;
	}
	this.logExit();
};

/**
 * @method select
 * @public
 */
app.gui.controls.Menu.prototype.select = function select() {
	this.logEntry();
	this._selectedCallback(this._data.current());
	this.logExit();
};

/**
 * @method highlight
 * @public
 */
app.gui.controls.Menu.prototype.highlight = function highlight() {
	this.logEntry();
	this._items.current().highlight();
	this._highlightedCallback(this._data.current());
	this.logExit();
};

/**
 * @method unHighlight
 * @public
 */
app.gui.controls.Menu.prototype.unHighlight = function unHighlight() {
	this.logEntry();
	this._items.current().unHighlight();
	this.logExit();
};

/**
 * @method selectNext
 * @public
 */
app.gui.controls.Menu.prototype.selectNext = function selectNext() {
	this.logEntry();
	if (this._data.hasNext()) {
		this.unHighlight();
		this._data.next();
		if (this._items.hasNext()) {
			this._items.next();
		} else {
			// handle move
		}
		this.highlight();
	}
	this.logExit();
};

/**
 * @method selectPrevious
 * @public
 */
app.gui.controls.Menu.prototype.selectPrevious = function selectPrevious() {
	this.logEntry();
	if (this._data.hasPrevious()) {
		this.unHighlight();
		this._data.previous();
		if (this._items.hasPrevious()) {
			this._items.previous();
		} else {
			// handle move
		}
		this.highlight();
	}
	this.logExit();
};
