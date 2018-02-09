
/**
 * @class app.gui.controls.PlayerCallToActionList
 */

app.gui.controls.PlayerCallToActionList = function PlayerCallToActionList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.PlayerCallToActionList, app.gui.controls.CallToActionList);

/**
 * @method createdCallback
 */
app.gui.controls.PlayerCallToActionList.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._player = document.querySelector('#player');
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.PlayerCallToActionList.prototype._fetch = function _fetch () {
	this.logEntry();
	var items = [];

	if (this._player.classList.contains("synopsisView")) {
		items.push("ctaFullDetails");
	} else {
		items.push("ctaInfo");
	}

	items.push("ctaJumpTo");

	items.push("ctaOptions");

	this.fireControlEvent("populate", items);
	this.fireControlEvent("show");

	this.logExit();
};

