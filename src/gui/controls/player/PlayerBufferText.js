/**
 * @class app.gui.controls.PlayerBufferText
 */

app.gui.controls.PlayerBufferText = function PlayerBufferText () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.PlayerBufferText, app.gui.controls.HtmlItem);

app.gui.controls.PlayerBufferText.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._player = document.querySelector('#videoView').videoPlayer;
	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.PlayerBufferText.prototype._show = function _show () {
	this.logEntry();
	this.superCall();
	// this also shows together with PlayerTrickMode in css
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.PlayerBufferText.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
	// this also hides together with PlayerTrickMode in css
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.PlayerBufferText.prototype._fetch = function _fetch (data) {
	this.logEntry();

	var now = Date.now(),
		duration = 600, //if in review buffer, duration should be retrieved by o5-video tag;
		pb = {}; //@hdk get real data for current review buffer

	pb.start = now - (now % duration) - 120 + 60; // tuned 5 mins after start
	pb.end = now;
	pb.current = (now % duration);
	pb.contentLength = now - pb.start;

	if (data.contentType) { //if it is a vod content
        duration = data.duration;
        pb.start = 0;
        pb.end = duration;
        pb.current = this._player.currentTime % duration;
        pb.contentLength = this._player.currentTime - pb.start;
	}
	if (pb) { // have playback data: show it and populate
		this.fireControlEvent("show");
		this.fireControlEvent("populate", pb);
	} else { // no playback data: hide
		this.fireControlEvent("hide");
	}

	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.PlayerBufferText.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;

		if (data && data.current) {
			// how much behind live?
			var now = Date.now();

			if (data.start) {
                this.textContent = Math.floor((data.start + data.current - now) / 60);
			} else {
                this.textContent = Math.floor(data.current / 60); //show how many mins after start
			}
		} else if (this._emptyClass) {
			this.classList.add(this._emptyClass);
		}
	}
});
