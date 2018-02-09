/**
 * @class app.gui.controls.Clock
 * @extends o5.gui.controls.DigitalClock
 *
 * @author nwilliams
 */
app.gui.controls.Clock = function Clock () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.Clock, o5.gui.controls.DigitalClock);

app.gui.controls.Clock.prototype.createdCallback = function createdCallback () {
	this.superCall();

	this._time = document.createTextNode("");
	this._period = document.createElement("span");
	this._period.classList.add("clock-period");

	this.appendChild(this._time);
	this.appendChild(this._period);
};

app.gui.controls.Clock.prototype._refresh = function _refresh () {
	var formatText = (new Date()).format(this.format),
		time = formatText.slice(0, -2),
		period = formatText.slice(-2);

	if (this._time) {
		this._time.textContent = time;
		this._period.innerText = period;
	}
};
