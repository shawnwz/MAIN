/**
 * @class app.gui.controls.SynopsisDetails
 */

app.gui.controls.SynopsisDetails = function SynopsisDetails() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisDetails, app.gui.controls.HtmlItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SynopsisDetails.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	var span;

	// <div class="synopsisDetailsYear"></div>
	// <span class="divider synopsisDetailsYear"></span>
	// <div class="synopsisDetailsGenre"></div>
	// <span class="divider synopsisDetailsGenre"></span>
	// <div class="synopsisDetailsLength"></div>
	// <span class="divider synopsisDetailsLength"></span>
	// <div class="synopsisDetailsHD"></div>
	// <span class="divider synopsisDetailsHD"></span>
	// <div class="synopsisDetailsCC"></div>
	// <span class="divider synopsisDetailsCC"></span>
	// <div class="synopsisDetailsDolby iconDolby"></div>
	// <span class="divider synopsisDetailsDolby"></span>
	// <div class="synopsisDetailsSubs iconSubs"></div>

  this._year = this.ownerDocument.createElement("div");
  this._year.className = "synopsisDetailsYear";
	span = this.ownerDocument.createElement("span");
  span.className = "divider synopsisDetailsYear";
  this.appendChild(this._year);
  this.appendChild(span);

  this._genre = this.ownerDocument.createElement("div");
  this._genre.className = "synopsisDetailsGenre";
	span = this.ownerDocument.createElement("span");
  span.className = "divider synopsisDetailsGenre";
  this.appendChild(this._genre);
  this.appendChild(span);

  this._length = this.ownerDocument.createElement("div");
  this._length.className = "synopsisDetailsLength";
	span = this.ownerDocument.createElement("span");
  span.className = "divider synopsisDetailsLength";
  this.appendChild(this._length);
  this.appendChild(span);

  this._hd = this.ownerDocument.createElement("div");
  this._hd.className = "synopsisDetailsHD";
	span = this.ownerDocument.createElement("span");
  span.className = "divider synopsisDetailsHD";
  this.appendChild(this._hd);
  this.appendChild(span);

  this._cc = this.ownerDocument.createElement("div");
  this._cc.className = "synopsisDetailsCC";
	this._cc.textContent = "CC";
	span = this.ownerDocument.createElement("span");
  span.className = "divider synopsisDetailsCC";
  this.appendChild(this._cc);
  this.appendChild(span);

  this._dolby = this.ownerDocument.createElement("div");
  this._dolby.className = "synopsisDetailsDolby iconDolby";
	span = this.ownerDocument.createElement("span");
  span.className = "divider synopsisDetailsDolby";
  this.appendChild(this._dolby);
  this.appendChild(span);

  this._subs = this.ownerDocument.createElement("div");
  this._subs.className = "synopsisDetailsSubs iconSubs";
  this.appendChild(this._subs);

	this.logExit();
};


/**
 * @method populate
 * @param {Object}[] texts
 */
app.gui.controls.SynopsisDetails.prototype._populate = function _populate(editorial) {
	this.logEntry();

//@hdk use this to remove dividers too: .miniSynopsis .synopsisTitle:empty { display: none }

	if (editorial) {
		if (editorial.year) {
			this._year.textContent = editorial.year;
			this._year.style.display = '';
		} else {
			this._year.textContent = '';
			this._year.style.display = 'none';
		}

		if (editorial.genre) {
			this._genre.textContent = editorial.genre.charAt(0).toUpperCase() + editorial.genre.slice(1).toLowerCase();
			this._genre.style.display = '';
		} else {
			this._genre.textContent = '';
			this._genre.style.display = 'none';
		}

		if (editorial.duration) {
			if (isNaN(editorial.duration)) {
				this._length.textContent = editorial.duration;
			} else {
				this._length.textContent = Math.ceil(editorial.duration / 60) + " mins";
			}
			this._length.style.display = '';
		} else {
			this._length.textContent = '';
			this._length.style.display = 'none';
		}

		this._hd.style.display = (editorial.isHD === true) ? '' : 'none';
		this._cc.style.display = (editorial.isClosedCaptioned === true) ? '' : 'none';
		this._dolby.style.display = (editorial.isDolby === true) ? '' : 'none';
		this._subs.style.display = (editorial.isSubtitled === true) ? '' : 'none';
	}

	this.logExit();
};



