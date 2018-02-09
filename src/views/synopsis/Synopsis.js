/* Implementation of the Synopsis View, which acts as the view controller */

app.views.Synopsis = function Synopsis () {};
o5.gui.controls.Control.registerAppControl(app.views.Synopsis, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.Synopsis.prototype.createdCallback = function createdCallback () {
	this.superCall();

	this._pageTitle   = this.querySelector("#synopsisPageTitle");
	this._channelLogo = this.querySelector("#synopsisPageChanLogo");
	this._pageSlider  = this.querySelector("#synopsisPageSlider");
	this._node = null;

	this.onshow = this._onShow;
	this.onhide = this._onHide;
	this.onfocus = this._onFocus;

	$util.ControlEvents.on("app-synopsis", "fetch", this._fetch, this);
	$util.ControlEvents.on("app-synopsis", "populate", this._populate, this);

	$util.ControlEvents.on("app-synopsis:synopsisPageNavMenu", "change", function (list) {
		var selectedItem = (list) ? list.selectedItem : null,
			index = (selectedItem && selectedItem.itemData) ? selectedItem.itemIndex : 0; //@hdk this should be visibleIndex!

		switch (index) {
			case 0: this._pageSlider.style.webkitTransform = "translateX(-0px)"; break;
			case 1: this._pageSlider.style.webkitTransform = "translateX(-0px)"; break;
			case 2: this._pageSlider.style.webkitTransform = "translateX(-1190px)"; break;
			case 3: this._pageSlider.style.webkitTransform = "translateX(-2440px)"; break;
			default: break;
		}

		//@hdk this should check if recordable!
		if (index === 0 || index === 1) { // only episodes and overview show "record"
			$util.ControlEvents.fire("app-synopsis:ctaSynopsis", "add", "ctaRecord");
		} else {
			$util.ControlEvents.fire("app-synopsis:ctaSynopsis", "remove", "ctaRecord");
		}
	}, this);
	$util.ControlEvents.on("app-synopsis:synopsisPageNavMenu", "exit:down", function (list) {
		var selectedItem = list ? list.selectedItem : null,
			data = selectedItem ? selectedItem.itemData : null,
			control = data ? data.control : null;

		if (control) {
			$util.ControlEvents.fire(control, "focus");
		}
	}, this);

	// Overview and Episodes are never together
	$util.ControlEvents.on("app-synopsis:synopsisOverview", "show", function () {
		$util.ControlEvents.fire("app-synopsis:synopsisEpisodes", "hide");
	}, this);
	$util.ControlEvents.on("app-synopsis:synopsisEpisodes", "show", function () {
		$util.ControlEvents.fire("app-synopsis:synopsisOverview", "hide");
	}, this);

	$util.ControlEvents.on("app-synopsis:synopsisEpisodesList", "change", function (list) {
		var selectedItem = (list) ? list.selectedItem : null,
			editorial = (selectedItem && selectedItem.itemData) ? selectedItem.itemData : null;

		if (editorial) {
			$util.ControlEvents.fire("app-synopsis:synopsisEpisodes", "populate", editorial);
			$util.ControlEvents.fire("app-synopsis:synopsisEpisodeActions", "populate", editorial);
		}
	}, this);
	$util.ControlEvents.on("app-synopsis:synopsisEpisodesList", "exit:right", function () {
		$util.ControlEvents.fire("app-synopsis:synopsisEpisodeActions", "focus");
		$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "select", "app-synopsis:synopsisEpisodes");
	}, this);

	$util.ControlEvents.on("app-synopsis:synopsisEpisodeActions", "exit:left", function () {
		$util.ControlEvents.fire("app-synopsis:synopsisEpisodesList", "focus");
	}, this);

	$util.ControlEvents.on("app-synopsis:synopsisMosaicTiles", "exit:right", function () {
		$util.ControlEvents.fire("app-synopsis:synopsisCast", "focus");
	}, this);

	$util.ControlEvents.on("app-synopsis:directorGridMenu", "exit:down", function () {
		$util.ControlEvents.fire("app-synopsis:castGridMenu", "reset");
		$util.ControlEvents.fire("app-synopsis:castGridMenu", "focus");
	}, this);

	$util.ControlEvents.on([
			"app-synopsis:synopsisEpisodesList",
			"app-synopsis:synopsisEpisodeActions",
			"app-synopsis:synopsisOverviewActions",
			"app-synopsis:synopsisMosaicTiles",
			"app-synopsis:directorGridMenu"
		],
		"exit:up",
		function () {
			$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "focus");
		}, this);

	$util.ControlEvents.on([
			"app-synopsis:synopsisEpisodesList",
			"app-synopsis:synopsisEpisodeActions",
			"app-synopsis:synopsisMosaicTiles",
			"app-synopsis:castGridMenu",
			"app-synopsis:synopsisOverviewActions",
			"app-synopsis:directorGridMenu",
			"app-synopsis:synopsisPageNavMenu"
		],
		"back",
		function () {
			$util.Events.fire("app:navigate:back");
		}, this);
};

/**
 * @method attachedCallback
 * @private
 */
app.views.Synopsis.prototype.attachedCallback = function attachedCallback () {
	$util.Events.fire("app:view:attached", "synopsis");
};

/**
 * @method _onShow
 */
app.views.Synopsis.prototype._onShow = function _onShow () {
	// hide page when we show, so that it doesnt show until we populate
	this._pageTitle.textContent = "";
	this._pageSlider.className = "hidden";
};

app.views.Synopsis.prototype._onHide = function _onHide () {
	//  hide page when we leave, so that it doesnt show until we populate again
	this._pageTitle.textContent = "";
	this._pageSlider.className = "hidden";
};

/**
 * @method _onFocus
 */
app.views.Synopsis.prototype._onFocus = function _onFocus () {
	$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "focus");
};

/**
 * @method _fetch
 */
app.views.Synopsis.prototype._fetch = function _fetch (node) {
	if (node) {
		this._node = node;
		$service.MDS.Editorial.fetch(node).then(function (data) {
			// we just pick the first one, there normally is only one expected
			var editorial = (data && data.length > 0) ? data[0] : { title: "Unknown Title" };

			if (editorial) {
				$util.ControlEvents.fire("app-synopsis", "populate", node, editorial);
			}
		});
	}
};

/**
 * @method _populate
 */
app.views.Synopsis.prototype._populate = function _populate (node, editorial) {
	var panel = "app-synopsis:synopsisOverview",
		category = (node.categories && node.categories.length > 0) ? node.categories[0] : '',
		cssClass = "tv";

	if (node) {
		if (node.title) {
			this._pageTitle.textContent = node.title;
		} else {
			this._pageTitle.textContent = "unknown event";
		}
		$util.ControlEvents.fire("app-synopsis:synopsisPageChanLogo", "fetch", editorial.channelTag);

		switch (node.contentType) {
			case "PROGRAM":
				if (category === "TV_EPS") {
				  cssClass = "tvEpisodes noOverview";
				  panel = "app-synopsis:synopsisEpisodes";
				} else {
				  cssClass = "tv";
					panel = "app-synopsis:synopsisOverview";
				}
				break;
			case "TV_EPS":
				cssClass = "tvEpisodes noOverview";
				panel = "app-synopsis:synopsisEpisodes";
				break;
			case "MOVIE":
				cssClass = "movie";
				panel = "app-synopsis:synopsisOverview";
				break;
			case "TV_NO_EPS":
			case "EVENT":
			case "I_VIEW":
			case "YOU_TUBE":
			default:
				cssClass = "tv";
				panel = "app-synopsis:synopsisOverview";
				break;
		}
	}

	this._pageSlider.className = cssClass; /* add class="nonIP" when? */

	$util.ControlEvents.fire(panel, "show");
	$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "select", panel);

	if (panel === "app-synopsis:synopsisEpisodes") {
		$util.ControlEvents.fire("app-synopsis:synopsisEpisodes", "fetch", node, editorial);
	} else {
		$util.ControlEvents.fire("app-synopsis:synopsisOverview", "fetch", node, editorial);
	}
	$util.ControlEvents.fire("app-synopsis:synopsisMoreLikeThis", "fetch", node);
	$util.ControlEvents.fire("app-synopsis:ctaSynopsis", "fetch", node);
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.views.Synopsis.prototype._onKeyDown = function _onKeyDown (e) {
	var handled = false;

// any key to handle?
	if (handled === true) {
		e.stopImmediatePropagation();
		e.preventDefault();
	} else {
		$util.ControlEvents.fire("app-synopsis:ctaSynopsis", "key:down", e);
	}
};
