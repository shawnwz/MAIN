/**
 * @class app.gui.controls.HtmlVolumeBar
 */

app.gui.controls.HtmlVolumeBar = function HtmlVolumeBar() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlVolumeBar, app.gui.controls.HtmlFocusItem);

app.gui.controls.HtmlVolumeBar.prototype.createdCallback = function createdCallback() {
	this.superCall();

  this._fill  = this.querySelector('#volumeBarFill');
  this._mute  = this.querySelector('#volumeMuteValue');

	this._timeOut = null;

	this._hiddenClass = "volume-hide";

	this._setLevel = function(level) {
		var actualLevel = level;
		actualLevel = Math.min(actualLevel, 100);
		actualLevel = Math.max(actualLevel, 0);
		this._setMute(false); // always unmute when we set a new level
		o5.platform.system.Device.setVolume(actualLevel);
		this._fill.style.width = actualLevel + "%"; //@hdk is this level 0-100? or 0-255? check on real box
	};

	this._setMute = function(mute) {
		if (mute) {
			o5.platform.system.Device.setMuteAudio();
			this.classList.add("volume-muted");
		} else {
			o5.platform.system.Device.setUnmuteAudio();
			this.classList.remove("volume-muted");
		}
	};

	var me = this;
	this._onTimeOut = function() {
		me.fireControlEvent("hide");
	};
};

/**
 * @method _show
 */
app.gui.controls.HtmlVolumeBar.prototype._show = function _show() {
	this._setLevel(o5.platform.system.Device.getVolume());
	this._timeOut = setTimeout(this._onTimeOut, 3000);
	this.superCall();
};

/**
 * @method _hide
 */
app.gui.controls.HtmlVolumeBar.prototype._hide = function _hide() {
	clearTimeout(this._timeOut);
	this.superCall();
	if (this._focusedElem) { // reset focus
		this._focusedElem.focus();
	}
};

/**
 * @method _onKeyDown
 */
app.gui.controls.HtmlVolumeBar.prototype._onKeyDown = function _onKeyDown(e) {
	clearTimeout(this._timeOut);
	this._timeOut = setTimeout(this._onTimeOut, 3000); // kick on each keypress

	switch (e.key) {
		case "Exit":
		case "Back":
		case "Ok":
		case "Enter":
			this.fireControlEvent("hide");
			e.stopImmediatePropagation();
			break;
		case "Mute": // toggle mute state
			this._setMute(!o5.platform.system.Device.getMuteState());
			e.stopImmediatePropagation();
			break;
		case "VolumeDown":
			this._setLevel(o5.platform.system.Device.getVolume() - 10);
			e.stopImmediatePropagation();
			break;
		case "VolumeUp":
			this._setLevel(o5.platform.system.Device.getVolume() + 10);
			e.stopImmediatePropagation();
			break;
		default: // hide but don't eat
			this.fireControlEvent("hide");
			break;
	}
};

