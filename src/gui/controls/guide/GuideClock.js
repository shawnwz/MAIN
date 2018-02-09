/**
 * @class app.gui.controls.GuideClock
 */
app.gui.controls.GuideClock = function GuideClock() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideClock, app.gui.controls.HtmlItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideClock.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	/*
		<div id="epgClock">7:28<span> PM</span></div>
	*/
	this._timer = null;

	this.logExit();
};

/**
 * @method _show
 * @private
 */
app.gui.controls.GuideClock.prototype._show = function _show() {
	this.logEntry();
	this._refresh();
	this.superCall();
	this.logExit();
};

/**
 * @method _hide
 * @private
 */
app.gui.controls.GuideClock.prototype._hide = function _hide() {
	this.logEntry();
	this.superCall();
	clearTimeout(this._timer);
	this.logExit();
};

/**
 * @method _refresh
 * @private
 */
app.gui.controls.GuideClock.prototype._refresh = function _refresh() {
	this.logEntry();
	var now = new Date(),
	  	hrs = now.getHours(),
	  	mins = now.getMinutes(),
	  	secs = now.getSeconds(),
		ampm = "AM",
		me = this;

	clearTimeout(this._timer);
	this._timer = null;

	if (hrs >= 12) {
		hrs -= 12;
		ampm = "PM";
		if (hrs === 0) {
			hrs = 12;
		}
	}
	this.innerHTML = hrs + ":" + (mins < 10 ? '0' : '') + mins/*+"."+secs*/ + " <span>" + ampm + "</span>";

	this._timer = setTimeout(function() {
		me._refresh();
	}, (60 - secs) * 1000); // fire every whole minute
	this.logExit();
};
