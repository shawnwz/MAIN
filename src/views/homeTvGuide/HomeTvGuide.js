/* Implementation of the HomeTvGuide View, which acts as the view controller */

app.views.HomeTvGuide = function HomeTvGuide() {};
o5.gui.controls.Control.registerAppControl(app.views.HomeTvGuide, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.HomeTvGuide.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.on("app-home-tv-guide", "fetch", function (node) {
		this._node = node;
		$util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "fetch");
	}, this);

	$util.ControlEvents.on("app-home-tv-guide:epgGridMenu", "exit:up", function () {
		$util.Events.fire("app:navigate:open", "home-menu");
		$util.ControlEvents.fire("app-home-tv-guide:ctaHomeTvGuide", "clear");
	}, this);
	$util.ControlEvents.on("app-home-tv-guide:epgGridMenu", "back", function () {
		$util.Events.fire("app:navigate:open", "home-menu");
	}, this);
    $util.ControlEvents.on("app-home-tv-guide:ctaHomeTvGuide", "ctaSortListings", function () {
        $util.ControlEvents.fire("app-guide", "sortListings");
        $util.Events.fire("app:navigate:to", "guide");
        $util.ControlEvents.fire("app-guide:epgListingsProgList-List", "fetch", "init");
        $util.ControlEvents.fire("app-guide:epgListingsSortListDateList", "populate", 1);
    }, this);
    $util.ControlEvents.on("app-home-tv-guide:epgGridMenu", "numberEnterTvGuide", function (e) {
		var genreObject = null,
			i = 0,
			j = 0,
			key = "",
			found = false;

		$util.fetch("./views/homeTvGuide/screenConfig/epggrid.json", 3000).then(function(data) {
			key = e.key;

			if (key === "Favorites") {
				key = "\u2605";
			}
				
			// find out the correct genre
			// might the epggrid.json change the position of objects ?
			if (data && data.length > 0) {
				i = data.length;
				while (i--) {
					if (data[i] && data[i].length > 0) {
						j = data[i].length;
						while (j--) {
							if (data[i][j].name && $util.Translations.translate(data[i][j].name)[0] === key) {
								found = true;
								genreObject = data[i][j];
								break;
							}
						}
						if (found === true) {
							break;
						}
					}
				}

				if (genreObject && genreObject.events && genreObject.events.length > 0) {
					i = 0;
					while (i < genreObject.events.length) {
						$util.ControlEvents.fire(genreObject.events[i].control, genreObject.events[i].event, genreObject.events[i].data);
						i++;
					}
				}
			}
		},
		function(data) {
			console.log("Failed to load epg grid ", data);
		});
    }, this);
	this.onshow = this._onShow;
	this.onfocus = this._onFocus;
	this.onkeydown = this._onKeyDown;

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.HomeTvGuide.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	$util.Events.fire("app:view:attached", "HomeTvGuide");
	this.logExit();
};

/**
 * @method _onFocus
 */
app.views.HomeTvGuide.prototype._onFocus = function _onFocus() {
	this.logEntry();
	$util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "focus");
	$util.ControlEvents.fire("app-home-tv-guide:ctaHomeTvGuide", "fetch", { "component": this._node });
	this.logExit();
};

/**
 * @method _onShow
 */
app.views.HomeTvGuide.prototype._onShow = function _onShow() {
	this.logEntry();
	$util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "show");
	this.logExit();
};

/**
 * @method _onHide
 * @private
 */
app.views.HomeTvGuide.prototype._onHide = function _onHide () {
	this.logEntry();
	//this.className = "oxygen-transition-none-bringOut oxygen-transition-none-hide";
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.views.HomeTvGuide.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	var handled = false;
	if (e.key === "Record") { //7268 has no "Star" key, use the "Record" instead now
		e.key = "Favorites";
	}
	if ((e.key >= "0" && e.key <= "9") || e.key === "Favorites") {
		$util.ControlEvents.fire("app-home-tv-guide:epgGridMenu", "numberEnterTvGuide", e);
		handled = true;
	}
	if (handled === true) {
		e.stopImmediatePropagation();
		e.preventDefault();
	} else {
		$util.ControlEvents.fire("app-home-tv-guide:ctaHomeTvGuide", "key:down", e);
	}
	this.logExit();
};
