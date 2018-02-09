/**
 * @class app.gui.controls.PlayerTrickMode
 */

app.gui.controls.PlayerTrickMode = function PlayerTrickMode () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.PlayerTrickMode, app.gui.controls.HtmlItem);

app.gui.controls.PlayerTrickMode.prototype.createdCallback = function createdCallback () {
//	this.logEntry();
	this.superCall();

	this._speedAttr = {
		20  : "sp02",
		100 : "sp1",
		200 : "sp2",
		400 : "sp6",
		1600: "sp12",
		3200: "sp30",
		6400: "sp60"
	};

	$util.ControlEvents.on("service:trickmode", "update", function (data) {
		this.fireControlEvent("populate", data);
	}, this);

//	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.PlayerTrickMode.prototype._show = function _show () {
	this.logEntry();
//	this._timeOut = setTimeout(this._onTimeOut, 3000);
	this.superCall();
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.PlayerTrickMode.prototype._hide = function _hide () {
	this.logEntry();
	clearTimeout(this._timeOut);
	this.setAttribute("x-state", "hide");
	this.superCall();
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.PlayerTrickMode.prototype._fetch = function _fetch () {
	this.logEntry();

	var modeData = { //@hdk get real data for the trick mode
		mode : "play",
		speed: 100
	};

	this.fireControlEvent("populate", modeData);

	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.PlayerTrickMode.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;

		if (data && data.mode) {
			switch (data.mode) {
				case "play":
					this.setAttribute("x-state", "play");
					this.setAttribute("x-speed", "sp1");
					break;

				case "pause":
					this.setAttribute("x-state", "pause");
					this.setAttribute("x-speed", "sp0");
					break;

				case "forward":
					this.setAttribute("x-state", "forward");
					if (data.speed) {
						this.setAttribute("x-speed", this._speedAttr[data.speed]);
					}
					break;

				case "rewind":
					this.setAttribute("x-state", "rewind");
					if (data.speed) {
						this.setAttribute("x-speed", this._speedAttr[Math.abs(data.speed)]);
					}
					break;

				case "skip-rewind": // @hdk handle these!
					this.setAttribute("x-state", "skip-rewind");
					break;

				case "skip-forward":
					this.setAttribute("x-state", "skip-forward");
					break;

				case "streaming":
					this.setAttribute("x-state", "streaming");
					break;

				default: //nothing
					console.log("default mode: _refreshUi(" + data.mode + "," + data.speed + ")");
					break;
			}
		} else if (this._emptyClass) {
			this.classList.add(this._emptyClass);
		}
	}
});
