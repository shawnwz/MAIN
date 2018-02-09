/**
 * @class app.gui.controls.SettingsText
 * @extends o5.gui.controls.Control
 */

app.gui.controls.SettingsText = function SettingsText() {
	this._isVisible = true;
};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsText);

/**
 * @property visible
 * @public
 * @type {Boolean}
 */
Object.defineProperty(app.gui.controls.SettingsText.prototype, "visible", {
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
app.gui.controls.SettingsText.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
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
app.gui.controls.SettingsText.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsText.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();

	if (this._isEditable) {
		switch (e.key) {
			case "Enter":
			case "Ok":
				this.select();
				e.stopImmediatePropagation();
				break;
			default:
				break;
		}
	}
	this.logExit();
};

/**
 * @method _onFocus
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsText.prototype._onFocus = function _onFocus() {
	this.logEntry();
	this.highlight();
	this.logExit();
};

/**
 * @method _onBlur
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsText.prototype._onBlur = function _onBlur() {
	this.logEntry();
	this.unHighlight();
	this.logExit();
};

/**
 * @method update
 * @public
 * @param {Object} data
 */
app.gui.controls.SettingsText.prototype.update = function update(data) {
	this.logEntry();
	this._data = data.get();
	this._events = data.events;
	this._isEditable = data.isEditable;
	this.textContent = this._data.text;
	this.logExit();
};

/**
 * @method highlight
 * @public
 */
app.gui.controls.SettingsText.prototype.highlight = function highlight() {
	this.logEntry();
	this.setAttribute("selected", "");
	this.logExit();
};

/**
 * @method unHighlight
 * @public
 */
app.gui.controls.SettingsText.prototype.unHighlight = function unHighlight() {
	this.logEntry();
	this.removeAttribute("selected");
	this.logExit();
};

/**
 * @method select
 * @public
 */
app.gui.controls.SettingsText.prototype.select = function select() {
	this.logEntry();
	$util.Events.once("settings:keyboard:close", this._fireEvents, this);
	$util.Events.fire("settings:keyboard:open", this._data.value);
	this.logExit();
};

/**
 * @method _fireEvents
 * @public
 * @param {Mixed} value
 */
app.gui.controls.SettingsText.prototype._fireEvents = function _fireEvents(value) {
	this.logEntry();
	this._events.forEach(function (event) {
		$util.Events.fire(event.name, value);
	});
	this.logExit();
};

/**
 * @method undo
 * @public
 */
app.gui.controls.SettingsText.prototype.undo = function undo() {
	this.logEntry();
	this.textContent = this._data.text;
	this._fireEvents(this._data.value);
	this.logExit();
};
