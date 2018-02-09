/**
 * This class is currently tightly coupled to the provided menu data
 * due to the event handling behaviour in select(). If it need to be more generic,
 * a selected callback could be passed into this class and called by select().
 *
 * @class app.gui.controls.SettingsToggle
 * @extends o5.gui.controls.Control
 */

app.gui.controls.SettingsToggle = function SettingsToggle() {
	this._isVisible = true;
};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsToggle);

/**
 * @property visible
 * @public
 * @type {Boolean}
 */
Object.defineProperty(app.gui.controls.SettingsToggle.prototype, "visible", {
	get: function get() {
		return this._isVisible;
	},
	set: function set(visible) {
		this._isVisible = Boolean(visible);
		if (this._isVisible) {
			this.classList.remove("removed");
		} else {
			this.classList.add("removed");
		}
	}
});

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsToggle.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._data = new app.data.Collection();
	this._data.cyclic = true;

	this.tabIndex = -1;

	this.onkeydown = this._onKeyDown;
	this.onfocus = this._onFocus;
	this.onblur = this._onBlur;
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsToggle.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	var handled = false;
	if (e.repeat) {
		e.stopImmediatePropagation();
		return;
	}

	switch (e.key) {
		case "ArrowLeft":
			if (this._orientation === this._HORIZONTAL) {
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
app.gui.controls.SettingsToggle.prototype._onFocus = function _onFocus() {
	this.logEntry();
	this.highlight();
	this.logExit();
};

/**
 * @method _onBlur
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsToggle.prototype._onBlur = function _onBlur() {
	this.logEntry();
	this.unHighlight();
	this.logExit();
};

/**
 * @method setData
 * @public
 * @return {Array} data
 */
app.gui.controls.SettingsToggle.prototype.setData = function setData(data) {
	this.logEntry();
	this._data.setData(data.get());
	this._initialIndex = this._data.currentIndex = data.getSelectedIndex();
	this._updateSelectedItem();
	this.logExit();
};

/**
 * @method _updateSelectedItem
 * @public
 * @return {Array} data
 */
app.gui.controls.SettingsToggle.prototype._updateSelectedItem = function _updateSelectedItem() {
	this.logEntry();
	var current = this._data.current();
	this.textContent = (current) ? current.text : "";
	this.logExit();
};

/**
 * @method select
 * @public
 */
app.gui.controls.SettingsToggle.prototype.select = function select() {
	this.logEntry();
	var selectedItem = this._data.current() || {};
	this._events.forEach(function (event) {
		$util.Events.fire(event.name, selectedItem.value);
	});
	this.logExit();
};

/**
 * @method update
 * @public
 * @param {Object} data
 */
app.gui.controls.SettingsToggle.prototype.update = function update(data) {
	this.logEntry();
	this._events = data.events;
	this.setData(data);
	this.logExit();
};

/**
 * @method selectNext
 * @public
 */
app.gui.controls.SettingsToggle.prototype.selectNext = function selectNext() {
	this.logEntry();
	if (this._data.hasNext()) {
		this.textContent = this._data.next().text;
	}
	this.logExit();
};

/**
 * @method selectPrevious
 * @public
 */
app.gui.controls.SettingsToggle.prototype.selectPrevious = function selectPrevious() {
	this.logEntry();
	if (this._data.hasPrevious()) {
		this.textContent = this._data.previous().text;
	}
	this.logExit();
};

/**
 * @method highlight
 * @public
 */
app.gui.controls.SettingsToggle.prototype.highlight = function highlight() {
	this.logEntry();
	this.setAttribute("selected", "");
	this.logExit();
};

/**
 * @method unHighlight
 * @public
 */
app.gui.controls.SettingsToggle.prototype.unHighlight = function unHighlight() {
	this.logEntry();
	this.removeAttribute("selected");
	this.logExit();
};

/**
 * @method undo
 * @public
 */
app.gui.controls.SettingsToggle.prototype.undo = function undo() {
	this.logEntry();
	this._data.currentIndex = this._initialIndex;
	this._updateSelectedItem();
	this.select();
	this.logExit();
};
