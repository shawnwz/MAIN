/**
 * @class app.gui.controls.GuideMiniSynopsis
 */

app.gui.controls.GuideMiniSynopsis = function GuideMiniSynopsis () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideMiniSynopsis, app.gui.controls.HtmlItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideMiniSynopsis.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this._epg = document.querySelector('#epg');

	var tmpl = document.getElementById("guideMiniSynopsisTemplate");

	this.appendChild(tmpl.content.cloneNode(true));
	this._title = this.querySelector('.synopsisTitle');
	this._epName = this.querySelector('#epgMiniSynopsisEpisodeName');
	//this._startTime = this.querySelector('#epgMiniSynopsisStartTime');
	//this._endTime = this.querySelector('#epgMiniSynopsisEndTime');
	this._ratings = this.querySelector('#epgMiniSynopsisRatings');
	this._icons = this.querySelector('#epgMiniSynopsisIcons');
	this._description = this.querySelector('.synopsisDescription');
	this._timeRemaining = this.querySelector('.synopsisTimeRemaining');
	this._synopsisTime = this.querySelector('#epgMiniSynopsisTime');

	this.logExit();
};

/**
 * @method _hide
 * @private
 */
app.gui.controls.GuideMiniSynopsis.prototype._hide = function _hide () {
	this.logEntry();
	this._epg.classList.remove("mainViewSynopsis");
	this.superCall();
	this.logExit();
};

/**
 * @method _show
 * @private
 */
app.gui.controls.GuideMiniSynopsis.prototype._show = function _show () {
	this.logEntry();
	this.superCall();
	this._epg.classList.add("mainViewSynopsis");
	this.logExit();
};

/**
 * @method _refresh
 * @private
 */
app.gui.controls.GuideMiniSynopsis.prototype._populate = function _populate (data) {
	this.logEntry();
	if (data) {

		if (data.title) {
			this._title.textContent = data.title;
		} else {
			this._title.innerHTML = "";
		}

		var str = "",
			year,
			isAdult,
			startTime,
			endTime,
			html,
			pash, contentWarnings, movieDetails, extraDescription,
			minsRemaining;

		if (data.isMovie) {
			year = data.year || "";
			isAdult = false; // (data.genre.id === 15) || (data.subGenre && data.genre.id === 14 && data.subGenre.id === 3);

			// var str = this.getPASH(data);

      		if (!isAdult && year) { // dont add year if its adult!
				str += year;
			}
		} else if (data.seasonNumber && data.episodeNumber && data.episodeTitle && !data.DispSEpNum) {
		 	str = "S" + data.seasonNumber + " EP" + data.episodeNumber + " - " + data.episodeTitle;
		} else if (data.episodeTitle) {
			str = data.episodeTitle;
		}
		if (str.length === 0) {
			this._epName.innerHTML = "";
		} else {
			if (str.length > 40) {
				str = str.substring(0, 40);
				str += "...";
			}
			this._epName.textContent = str;
		}

		startTime = $util.DateTime.timeObject(data.startTime);
		endTime = $util.DateTime.timeObject(data.endTime);
		html = '';

		if (startTime.mins === 0) {
			str = startTime.hours;
		} else if (startTime.mins < 10) {
			str = startTime.hours + ":0" + startTime.mins;
		} else {
			str = startTime.hours + ":" + startTime.mins;
		}
		html += '<span id="epgMiniSynopsisStartTime" class="synopsisStartTime" x-meridiem="' + startTime.meridiem + '">';
		html += str;
		html += '</span>';

		html += ' - ';

		if (endTime.mins === 0) {
			str =  endTime.hours;
		} else if (endTime.mins < 10) {
			str =  endTime.hours + ":0" + endTime.mins;
		} else {
			str =  endTime.hours + ":" + endTime.mins;
		}
		html += '<span id="epgMiniSynopsisEndTime" class="synopsisStartTime" x-meridiem="' + endTime.meridiem + '">';
		html += str;
		html += '</span>';

		this._synopsisTime.innerHTML = html;

		if (data.rating && data.rating !== "NC") {
			this._ratings.innerHTML = "<span>" + data.rating + "</span>";
		} else {
			this._ratings.innerHTML = "";
		}

		html = '';
		if (data.isHD) {
			html += '<span class="iconHD" x-divider="|">HD</span>';
		} else if (data.isWidescreen) {
			html += '<span class="iconWS" x-divider="|"></span>';
		}
		if (data.isClosedCaptioned/* && _mediaPlayer.areSubtitlesEnabled()*/) {
			html += '<span class="iconCC" x-divider="|">CC</span>';
		}
		if (data.isDolby) {
			html += '<span class="iconDolby" x-divider="|"></span>';
		}
		if (data.isSubtitled) {
			html += '<span class="iconSubs" x-divider="|"></span>';
		}
		this._icons.innerHTML = html;

		pash = ""; // data.isMovie ? "" : MiniSynopsis.prototype.getPASH(data); //pash is added in the title for a movie
		contentWarnings = data.contentWarningText ? data.contentWarningText : "";
		movieDetails = ""; // data.isMovie ? MiniSynopsis.prototype.getMovieDetails(data) : "",
		extraDescription = " " + movieDetails + " " + contentWarnings;

		str = pash + (data.description || $util.Translations.translate("miniSynopsisDescriptionError"));

		if ((str.length + extraDescription.length) > 250) {
			str = str.substring(0, 250);
			str += "...";
		}
		this._description.textContent = str + extraDescription;

		minsRemaining = data.isOnNow === true ? Math.max(0, Math.floor((data.endTime - Date.now()) / (60 * 1000))) : 0;

		if (minsRemaining && !isNaN(minsRemaining)) {
			this._timeRemaining.innerHTML = minsRemaining + " " + $util.Translations.translate("synopsisTimeInMinsRemaining");
			this._timeRemaining.dataset.i18n = "synopsisTimeInMinsRemaining";
		} else {
			this._timeRemaining.innerHTML = "";
		}
	}
	this.logExit();
};

app.gui.controls.GuideMiniSynopsis.prototype._reset = function _reset () {
	this.logEntry();
	this._title.innerHTML = "";
	this._epName.innerHTML = "";
	this._synopsisTime.innerHTML = "";
	this._ratings.innerHTML = "";
	this._icons.innerHTML = "";
	this._description.textContent = "";
	this._timeRemaining.innerHTML = "";
	this.logExit();
};
