/**
 * @class app.gui.controls.PlayerMiniSynopsis
 */

app.gui.controls.PlayerMiniSynopsis = function PlayerMiniSynopsis () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.PlayerMiniSynopsis, app.gui.controls.HtmlItem);

app.gui.controls.PlayerMiniSynopsis.prototype.createdCallback = function createdCallback () {
//	this.logEntry();
	this.superCall();

	this._title = this.querySelector(".synopsisTitle");
	this._description = this.querySelector(".synopsisDescription");
	this._icons = this.querySelector(".miniSynopsisIcons");

	this._visibleClass = "show";
	
//	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.PlayerMiniSynopsis.prototype._fetch = function _fetch (data) {
	this.logEntry();
	var ev = {};
	if (data.mainContentRef) { //vod data
        ev.title = data.title;
        ev.description = data.description;
        ev.rating = data.rating;
        ev.isClosedCaptioned = data.isClosedCaptioned;
        ev.isDolby = data.isDolby;
        ev.isWidescreen = data.isWidescreen;
        ev.isHD = data.isHD;
        ev.isSubtitled = data.isSubtitled;
        ev.seasonNumber = data.seasonNumber;
        ev.episodeNumber = data.episodeNumber;
        ev.episodeTitle = data.episodeTitle;
        ev.DispSEpNum = data.DispSEpNum;
        ev.contentWarningText = data.contentWarningText;
	} else { //fake data if it is a event data, will  integrate real RB event when event schema was ready
        ev.title = "Some event we like!";
        ev.description = "This event is very good! We like it very much!";
        ev.rating = "R";
        ev.isClosedCaptioned = true;
        ev.isDolby = true;
        ev.seasonNumber = 20;
        ev.episodeNumber = 1;
        ev.episodeTitle = "The Best Episode";
        ev.DispSEpNum = true;
	}


	this.fireControlEvent("populate", ev);

	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.PlayerMiniSynopsis.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;

		if (data) {
			var programme = data,
				pash, contentWarnings, movieDetails, descriptionEndText, str,
				descLen = 130, // for surfScanMiniSynopsis and playerMiniSynopsis
				icons = "";
	
			if (programme.seasonNumber && programme.episodeNumber && programme.episodeTitle && programme.DispSEpNum) {
				this._title.textContent = "S" + programme.seasonNumber + " EP" + programme.episodeNumber + " - " + programme.episodeTitle;
			} else {
				this._title.textContent = programme.title ? programme.title : "";
			}
			if (data.rating) {
				this._title.setAttribute("x-synopsis-rating", data.rating);
			}
	
			pash = ""; // programme.isMovie ? "" : MiniSynopsis.prototype.getPASH(programme); //pash is added in the title for a movie
			contentWarnings = programme.contentWarningText ? programme.contentWarningText : "";
			movieDetails = ""; // programme.isMovie ? MiniSynopsis.prototype.getMovieDetails(programme) : "";
			descriptionEndText = " " + movieDetails + " " + contentWarnings;
			str = pash + (programme.description ? programme.description : "No description available");
	
			if ((str.length + descriptionEndText.length) > descLen) {
				str = str.substring(0, descLen);
				str += "...";
			}
			this._description.textContent = str + descriptionEndText;
	
			if (programme.isClosedCaptioned === true) { //  && _mediaPlayer.areSubtitlesEnabled()) {
				icons += "<span class='iconCC' x-divider='|'>CC</span>";
			}
			if (programme.isDolby === true) {
				icons += "<span class='iconDolby' x-divider='|'></span>";
			}
			if (programme.isHD === true) {
				icons += "<span class='iconHD' x-divider='|'>HD</span>";
			} else if (programme.isWidescreen === true) {
				icons += "<span class='iconWS' x-divider='|'></span>";
			}
			if (programme.isSubtitled === true) {
				icons += "<span class='iconSubs' x-divider='|'></span>";
			}
			this._icons.innerHTML = "<div>" + icons + "</div>";

		} else if (this._emptyClass) {
			this.classList.add(this._emptyClass);
		}
	}
});
