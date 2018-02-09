app.gui.controls.TogglePanel = function TogglePanel() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.TogglePanel);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.TogglePanel.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	if (this.dataset.showEvent) {
		$util.Events.on(this.dataset.showEvent, this._show, this);
	}
	if (this.dataset.hideEvent) {
		$util.Events.on(this.dataset.hideEvent, this._hide, this);
	}
	if (this.dataset.toggleEvent) {
		$util.Events.on(this.dataset.toggleEvent, this._toggle, this);
	}
	this.logExit();
};

/**
 * @method _hide
 * @private
 */
app.gui.controls.TogglePanel.prototype._hide = function _hide() {
	this.logEntry();
	this.classList.add("hidden");
	this.logExit();
};

/**
 * @method _show
 * @private
 */
app.gui.controls.TogglePanel.prototype._show = function _show() {
	this.logEntry();
	this.classList.remove("hidden");
	this.logExit();
};

/**
 * @method _toggle
 * @private
 */
app.gui.controls.TogglePanel.prototype._toggle = function _toggle() {
	this.logEntry();
	this.classList.toggle("hidden");
	this.logExit();
};
