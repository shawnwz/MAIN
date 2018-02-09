/**
 * @class app.gui.controls.SynopsisOverviewPanel
 */

app.gui.controls.SynopsisOverviewPanel = function SynopsisOverviewPanel () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisOverviewPanel, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SynopsisOverviewPanel.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this._image = this.querySelector("#synopsisOverviewImage");
	this._title = this.querySelector("#synopsisOverviewTitleText");
	this._desc = this.querySelector("#synopsisOverviewDescText");

	this._directorContainer = this.querySelector("#synopsisDirectorContainer");
	this._directorText = this._directorContainer.querySelector(".directorText");
	this._castContainer = this.querySelector("#synopsisCastContainer");
	this._castText = this._castContainer.querySelector(".castText");

	$util.ControlEvents.on("app-synopsis:synopsisMosaicTiles", "exit:left", function () {
		if (this.visible) {
			$util.ControlEvents.fire("app-synopsis:synopsisOverviewActions", "focus");
			$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "select", "app-synopsis:synopsisOverview");
		}
	}, this);

	this._nodePromo = null;

	this._hiddenClass = "hide";

	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.SynopsisOverviewPanel.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
	this._image.style.backgroundImage = "";
	this._title.textContent = "";
	this._desc.textContent = "";
	this._nodePromo = null;
	this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.SynopsisOverviewPanel.prototype._focus = function _focus () {
	this.logEntry();
	if (this.visible) {
		$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "select", "app-synopsis:synopsisOverview");
		$util.ControlEvents.fire("app-synopsis:synopsisOverviewActions", "focus");
	}
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SynopsisOverviewPanel.prototype._fetch = function _fetch (node, editorial) {
	this.logEntry();
	this._nodePromo = node ? node.promo : null;
	$util.ControlEvents.fire("app-synopsis:synopsisOverviewActions", "clear");
	this.fireControlEvent("populate", editorial);
	this.logExit();
};

/**
 * @method populate
 * @param {Object}[] texts
 */
app.gui.controls.SynopsisOverviewPanel.prototype._populate = function _populate (editorial) {
	this.logEntry();

	if (editorial) {
		var backgroundImage,
			hasCast = (editorial.actors && editorial.actors.length > 0),
			hasDirectore = (editorial.directors && editorial.directors.length > 0);

		this._title.textContent = editorial.titleText;
		this._desc.textContent  = (editorial.year ? '(' + editorial.year + ') ' : '') +
																(editorial.description ? editorial.description :
																	(editorial.synopsis ? editorial.synopsis :
																		(editorial.episodeTitle ? editorial.episodeTitle : '')));

		if (hasDirectore) {
			this._directorText.textContent = editorial.directors.join(", ");
			this._directorContainer.classList.remove("hide");
		} else {
			this._directorText.textContent = "";
			this._directorContainer.classList.add("hide");
		}

		if (hasCast) {
			this._castText.textContent = editorial.actors.join(", ");
			this._castContainer.classList.remove("hide");
		} else {
			this._castText.textContent = "";
			this._castContainer.classList.add("hide");
		}

		if (editorial.promo) {
			backgroundImage = "url(" + editorial.promo + ")";
		} else if (this._nodePromo) {
			backgroundImage = "url(" + this._nodePromo + ")";
		}

		if (backgroundImage && backgroundImage !== this._image.style.backgroundImage) { // only if image exists and is different
			this._image.style.backgroundImage = backgroundImage;
		}

		if (hasDirectore || hasCast) {
			$util.ControlEvents.fire("app-synopsis:synopsisCast", "show");
			$util.ControlEvents.fire("app-synopsis:synopsisCast", "populate", editorial);
		} else {
			$util.ControlEvents.fire("app-synopsis:synopsisCast", "hide");
		}

		$util.ControlEvents.fire("app-synopsis:synopsisOverviewActions", "populate", editorial);
		$util.ControlEvents.fire("app-synopsis:synopsisOverviewRating", "populate", editorial);
		$util.ControlEvents.fire("app-synopsis:synopsisOverviewDetails", "populate", editorial);
	}

	this.logExit();
};


