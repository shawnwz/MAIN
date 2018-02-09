/**
 * Example markup:
 *
 *     <app-event-progress-bar></app-event-progress-bar>
 *
 * @class app.gui.controls.EventEventProgressBar
 * @extends o5.gui.controls.Control
 */

app.gui.controls.EventProgressBar = function EventProgressBar () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.EventProgressBar);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.EventProgressBar.prototype.createdCallback = function createdCallback () {
	this.logEntry();

	this._updateTimer = null;
	this._event = {};
	this._enabled = true;

	this._inner = this.ownerDocument.createElement("div");
	this.appendChild(this._inner);

	this.logExit();
};

/**
 * @property event
 * @public
 * @type {Object} event - event to show progress for
 */
Object.defineProperty(app.gui.controls.EventProgressBar.prototype, "event", {
	get: function get () {
		return this._event;
	},
	set: function set (event) {
		this._event = event;
		this._update();
	}
});

/**
 * @property visible
 * @public
 * @type {Boolean} visible - show progress or not
 */
Object.defineProperty(app.gui.controls.EventProgressBar.prototype, "enabled", {
	get: function get () {
		return this._enabled;
	},
	set: function set (enabled) {
		this._enabled = enabled;
		if (enabled) {
			this._update();
			this._show();
		} else {
			this._setUpdateTimer();
			this._hide();
		}
	}
});

app.gui.controls.EventProgressBar.prototype._setUpdateTimer = function _setUpdateTimer () {
	clearTimeout(this._updateTimer);
	if (this._enabled) {
		this._updateTimer = setTimeout(this._update.bind(this), 60000);
	}
};

/**
 * @method _update
 * @public
 */
app.gui.controls.EventProgressBar.prototype._update = function _update () {
	this.logEntry();

	var duration = this._event.endTime - this._event.startTime,
		now = Date.now(),
		percent = ((now - this._event.startTime) / duration) * 100;

	if (percent > 100) {
		percent = 100;
	} else if (percent < 0) {
		percent = 0;
	}

	this._inner.style.width = percent + "%";

	this._setUpdateTimer();
	this.logExit();
};

/**
 * @method _hide
 * @public
 */
app.gui.controls.EventProgressBar.prototype._hide = function _hide () {
	this.logEntry();
	this.classList.add("hidden");
	this.logExit();
};

/**
 * @method _show
 * @public
 */
app.gui.controls.EventProgressBar.prototype._show = function _show () {
	this.logEntry();
	this.classList.remove("hidden");
	this.logExit();
};
