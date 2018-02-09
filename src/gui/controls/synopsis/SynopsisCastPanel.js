/**
 * @class app.gui.controls.SynopsisCastPanel
 */

app.gui.controls.SynopsisCastPanel = function SynopsisCastPanel () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisCastPanel, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SynopsisCastPanel.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	$util.ControlEvents.on("app-synopsis:castGridMenu", "exit:up", function () {
		if (this.classList.contains("director")) {
			$util.ControlEvents.fire("app-synopsis:directorGridMenu", "select", "last");
			$util.ControlEvents.fire("app-synopsis:directorGridMenu", "focus");
		} else {
			$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "focus");
		}
	}, this);

	this._hiddenClass = "hide";

	this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.SynopsisCastPanel.prototype._focus = function _focus () {
	this.logEntry();
	if (this.visible) {
		$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "select", "app-synopsis:synopsisCast");
		if (this.classList.contains("director")) {
			$util.ControlEvents.fire("app-synopsis:directorGridMenu", "select", "first");
			$util.ControlEvents.fire("app-synopsis:directorGridMenu", "focus");
		} else {
			$util.ControlEvents.fire("app-synopsis:castGridMenu", "select", "first");
			$util.ControlEvents.fire("app-synopsis:castGridMenu", "focus");
		}
	}
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SynopsisCastPanel.prototype._fetch = function _fetch (data) {
	this.logEntry();
	this._assetPromo = (this.visible && data) ? data.promo : null;
	this.fireControlEvent("hide"); // hide this when we get a new update
	$util.ControlEvents.fire("app-synopsis:directorGridMenu", "clear");
	$util.ControlEvents.fire("app-synopsis:castGridMenu", "clear");
	this.logExit();
};

/**
 * @method populate
 * @param {Object}[] texts
 */
app.gui.controls.SynopsisCastPanel.prototype._populate = function _populate (editorial) {
	this.logEntry();
		var hasCast = (editorial.actors && editorial.actors.length > 0),
			hasDirectore = (editorial.directors && editorial.directors.length > 0);

	if (hasDirectore) {
		$util.ControlEvents.fire("app-synopsis:directorGridMenu", "populate", editorial);
		this.classList.add("director");
	} else {
		this.classList.remove("director");
	}

	if (hasCast) {
		$util.ControlEvents.fire("app-synopsis:castGridMenu", "populate", editorial);
	}

	this.logExit();
};

