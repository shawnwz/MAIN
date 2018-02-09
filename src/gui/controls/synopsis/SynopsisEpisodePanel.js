/**
 * @class app.gui.controls.SynopsisEpisodePanel
 */

app.gui.controls.SynopsisEpisodePanel = function SynopsisEpisodePanel () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisEpisodePanel, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SynopsisEpisodePanel.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this._image 	 = this.querySelector("#synopsisEpisodesPreviewImage");
	this._title 	 = this.querySelector("#synopsisEpisodeTitleText");
	this._subTitle = this.querySelector("#synopsisEpisodeSubTitleText");
	this._desc  	 = this.querySelector("#synopsisEpisodeDescText");

	$util.ControlEvents.on("app-synopsis:synopsisMosaicTiles", "exit:left", function () {
		if (this.visible) {
			$util.ControlEvents.fire("app-synopsis:synopsisEpisodeActions", "focus");
			$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "select", "app-synopsis:synopsisEpisodes");
		}
	}, this);

	this._nodePromo = null;

	this._hiddenClass = "hide";

	this.logExit();
};

/**
 * @method hide
 */
app.gui.controls.SynopsisEpisodePanel.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
	this._image.style.backgroundImage = "";
	this._title.textContent 	 = "";
	this._subTitle.textContent = "";
	this._desc.textContent  	 = "";
	this._nodePromo = null;
	this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.SynopsisEpisodePanel.prototype._focus = function _focus () {
	this.logEntry();
	if (this.visible) {
		$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "select", "app-synopsis:synopsisEpisodes");
		$util.ControlEvents.fire("app-synopsis:synopsisEpisodesList", "focus");
	}
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SynopsisEpisodePanel.prototype._fetch = function _fetch (node, editorial) {
	this.logEntry();
	this._nodePromo = node ? node.promo : null;
	$util.ControlEvents.fire("app-synopsis:synopsisEpisodesList", "clear");
	$util.ControlEvents.fire("app-synopsis:synopsisEpisodeActions", "clear");
	this.fireControlEvent("populate", editorial);
	$util.ControlEvents.fire("app-synopsis:synopsisEpisodesList", "fetch", editorial);
	this.logExit();
};

/**
 * @method populate
 */
app.gui.controls.SynopsisEpisodePanel.prototype._populate = function _populate (editorial) {
	this.logEntry();

	if (editorial) {
		var backgroundImage,
			hasCast = (editorial.actors && editorial.actors.length > 0),
			hasDirectore = (editorial.directors && editorial.directors.length > 0);

		this._title.textContent 	 = editorial.episodeTitle;
		this._subTitle.textContent = editorial.titleText;
		this._desc.textContent  	 = (editorial.description ? editorial.description :
																	 (editorial.synopsis ? editorial.synopsis :
																		 (editorial.episodeTitle ? editorial.episodeTitle : '')));

		if (editorial.promo) {
			backgroundImage = "url(" + editorial.promo + ")";
		} else if (this._nodePromo) {
			backgroundImage = "url(" + this._nodePromo + ")";
		}

		if (backgroundImage) {
			if (backgroundImage !== this._image.style.backgroundImage) { // only if image exists and is different
				this._image.style.backgroundImage = backgroundImage;
			}
		} else {
			this._image.style.backgroundImage = "";
		}

		if (hasDirectore || hasCast) {
			$util.ControlEvents.fire("app-synopsis:synopsisCast", "show");
			$util.ControlEvents.fire("app-synopsis:synopsisCast", "populate", editorial);
		} else {
			$util.ControlEvents.fire("app-synopsis:synopsisCast", "hide");
		}

		$util.ControlEvents.fire("app-synopsis:synopsisEpisodeActions", "populate", editorial);
		$util.ControlEvents.fire("app-synopsis:synopsisEpisodeRating", "populate", editorial);
		$util.ControlEvents.fire("app-synopsis:synopsisEpisodeDetails", "populate", editorial);
	}

	this.logExit();
};

