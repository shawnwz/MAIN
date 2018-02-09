/**
 * @class app.gui.controls.SurfMiniSynopsis
 */

app.gui.controls.SurfMiniSynopsis = function SurfMiniSynopsis () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SurfMiniSynopsis, app.gui.controls.HtmlItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SurfMiniSynopsis.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

  this._surfScanBar = document.querySelector("#surfScanBar");

  this._title = this.querySelector(".synopsisTitle");
  this._description = this.querySelector(".synopsisDescription");
  this._icons = this.querySelector(".miniSynopsisIcons");
  this.className = "miniSynopsis";
  this._visibleClass = "show";
  $util.ControlEvents.on([
  	"app-surf:surfPastEventsList",
	"app-surf:surfFutureEventsList"
	], "change", this._populate, this);

	this.logExit();
};


/**
 * @method _populate
 */
app.gui.controls.SurfMiniSynopsis.prototype._populate = function _populate (ctrl) {
	this.logEntry();
	
	var selectedItem = ctrl ? ctrl.selectedItem : null,
		data = selectedItem ? selectedItem.itemData : null,
		programme, pash = "", year = "", actors = "", contentWarnings = "", movieDetails = "",
		descriptionEndText = "", str = "", descLen = 130, icons = "";

	if (data && data.isEndCell === true && this.visible) {
		$util.ControlEvents.fire("app-surf:surfScanMiniSynopsis", "hide");
		this._title.textContent = "";
		this._description.textContent = "";
		this._icons.innerHTML = "";
		return;
	}

	if (data) {
		programme = data;
		if (programme.isMovie) {
			this._title.style.display = "none";
			if (programme.genre && ((programme.genre.id === 15) || (programme.subGenre && programme.genre.id === 14 && programme.subGenre.id === 3))) {
				year = "";
			} else {
				year = "(" + programme.year + ") ";
			}

			if (programme.actors) {
				actors = " . " + programme.actors.toString();
			}

			if (programme.countries && programme.countries[0] && ('US' !== programme.countries[0].toUpperCase() && 'USA' !== programme.countries[0].toUpperCase() && 'AUS' !== programme.countries[0].toUpperCase())) {
				movieDetails += " . " + programme.countries;
				if (programme.language && 'ENG' !== programme.language.toUpperCase()) {
					movieDetails += ", " + programme.language;
				}
			}

			//movieDetails = ""; // programme.isMovie ? MiniSynopsis.prototype.getMovieDetails(programme) : "";
		} else {
			this._title.style.display = "";
			if (programme.seasonNumber && programme.episodeNumber && programme.episodeTitle && programme.dispSEpNum) {
				this._title.textContent = "S" + programme.seasonNumber + " EP" + programme.episodeNumber + " - " + programme.episodeTitle;
			} else {
				this._title.textContent = programme.title ? programme.title : "";
			}
		}
		//pash = ""; // programme.isMovie ? "" : MiniSynopsis.prototype.getPASH(programme); //pash is added in the title for a movie
		if (programme.pash) { //TODO: map pash field in "getGenericMapped"
			pash = programme.pash + " | ";
		}
		contentWarnings = programme.contentWarningText ? (" . " + programme.contentWarningText) : "";
		descriptionEndText = movieDetails + contentWarnings;
		str = pash + year + (programme.description ? programme.description : "No description available") + actors;

		if ((str.length + descriptionEndText.length) > descLen) {
			str = str.substring(0, descLen);
			str += "...";
		}
		this._description.textContent = str + descriptionEndText;

		if (programme.isHD === true) {
			icons += "<span class='iconHD' x-divider='|'>HD</span>";
		} else if (programme.isWidescreen === true) {
			icons += "<span class='iconWS' x-divider='|'></span>";
		}
		if (programme.isClosedCaptioned === true) {  //  && _mediaPlayer.areSubtitlesEnabled()) {
			icons += "<span class='iconCC' x-divider='|'>CC</span>";
		}
		if (programme.isDolby === true) {
			icons += "<span class='iconDolby' x-divider='|'></span>";
		}
		if (programme.isSubtitled === true) {
			icons += "<span class='iconSubs' x-divider='|'></span>";
		}
		this._icons.innerHTML = "<div>" + icons + "</div>";
	}

	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.SurfMiniSynopsis.prototype._show = function _show () {
	this.logEntry();
	this._surfScanBar.classList.add("synopsisView");
	this.superCall();
	this.logExit();
};


/**
 * @method _hide
 */
app.gui.controls.SurfMiniSynopsis.prototype._hide = function _hide () {
	this.logEntry();
	this._surfScanBar.classList.remove("synopsisView");
	this.superCall();
	this.logExit();
};

