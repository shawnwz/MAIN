/**
 * @class app.gui.controls.SynopsisEpisodesList
 */

app.gui.controls.SynopsisEpisodesList = function SynopsisEpisodesList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisEpisodesList, app.gui.controls.HtmlFlexList);  // HtmlFlexList

/**
 * @method createdCallback
 */
app.gui.controls.SynopsisEpisodesList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this.orientation = "Vertical";
	this.animate = true;
	this._blurClass = "episodeList-disabled";

	this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.SynopsisEpisodesList.prototype._focus = function _focus() {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "select", "app-synopsis:synopsisEpisodes");
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SynopsisEpisodesList.prototype._fetch = function _fetch(editorial) {
	this.logEntry();
	var me = this;
	if (editorial.seriesRef) {
		$service.MDS.Episode.fetch(editorial).then(function(data) {
				me.fireControlEvent("populate", data);
			});
	}
	this.logExit();
};

/**
 * @method populate
 */
app.gui.controls.SynopsisEpisodesList.prototype._populate = function _populate(arr) {
	this.logEntry();

	//@hdk TODO: do we populate back to front?
	//@hdk TODO: how to deal with duplicates from BTV and VOD? v1 merges the objects
	//@hdk it should highlight the one we display in the middle!
	this.superCall(arr, 0);

	this.logExit();
};


/**
 * @class app.gui.controls.SynopsisEpisodesListItem
 */

app.gui.controls.SynopsisEpisodesListItem = function SynopsisEpisodesListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisEpisodesListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SynopsisEpisodesListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this._number = this.querySelector(".episodeNum");
	this._title  = this.querySelector(".episodeTitle");
	this._icons  = this.querySelector(".episodeIcons");

//	this.classList.add("episodeList-cell");
	this._focusClass = "episodeList-focused";

	this.logExit();
};


/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.SynopsisEpisodesListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(episode) {
		this._data = episode;
		var dataReady = false;

		if (dataReady) { // if (watched)
			this.classList.add("episodeList-watched");
		} else {
			this.classList.remove("episodeList-watched");
		}

		if (episode.seasonNumber && episode.episodeNumber) {
			this._number.textContent = 'Season ' + episode.seasonNumber + ' Episode ' + episode.episodeNumber;
		} else if (episode.seasonNumber) {
			this._number.textContent = 'Season ' + episode.seasonNumber;
		} else if (episode.episodeNumber) {
			this._number.textContent = 'Episode ' + episode.episodeNumber;
		} else {
			this._number.textContent = episode.titleText;
		}

		this._title.textContent = (episode.episodeTitle ? episode.episodeTitle : '');

		/*if (false) {
			if (episode.type) {
				if (episode.type === "multiple") {
					this._iconsList["PPV"].element.style.display  = "";
				} else if (episode.type === "subscription") {
					this._iconsList["Play"].element.style.display  = "";
				}
			}
			if (episode.isOnNow === true) {
				this._iconsList["OnNow"].element.style.display  = "";
			}
			if (false) {
				this._iconsList["Keep"].element.style.display  = "";
			}
			if (false) {
				this._iconsList["Locked"].element.style.display  = "";
			}
			if (false) {
				this._iconsList["Reminder"].element.style.display  = "";
			}
			if (false) {
				this._iconsList["Recorded"].element.style.display  = "";
			}
			if (false) {
				this._iconsList["Scheduled"].element.style.display  = "";
			}
			if (false) {
				this._iconsList["ScheduledPlus"].element.style.display  = "";
			}
			if (episode.isDolby === true) {
				this._iconsList["Dolby"].element.style.display  = "";
			}
			if (episode.isSubs === true) {
				this._iconsList["Subs"].element.style.display  = "";
			}
			if (false) {
				this._iconsList["Error"].element.style.display  = "";
			}
		}*/
	}
});

