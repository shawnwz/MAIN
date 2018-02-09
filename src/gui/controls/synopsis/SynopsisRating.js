/**
 * @class app.gui.controls.SynopsisRating
 */

app.gui.controls.SynopsisRating = function SynopsisRating() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisRating, app.gui.controls.HtmlItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SynopsisRating.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	// <div class="synopsisRatingIcon"></div>
	// <div class="synopsisRatingText"></div>

	this._icon = this.ownerDocument.createElement("div");
  	this._icon.className = "synopsisRatingIcon";

	this._text = this.ownerDocument.createElement("div");
  	this._text.className = "synopsisRatingText";

	this.appendChild(this._icon);
	this.appendChild(this._text);

	this.logExit();
};


/**
 * @method populate
 * @param {Object}[] texts
 */
app.gui.controls.SynopsisRating.prototype._populate = function _populate(editorial) {
	this.logEntry();

	if (editorial) {
		if (editorial.ratingImage) {
			this._icon.style.backgroundImage = "url('images/common/ratings/" + editorial.ratingImage + "')";
		} else {
			this._icon.style.backgroundImage = "";
		}

		if (editorial.contentWarningText) {
			this._text.textContent = editorial.contentWarningText;
		} else {
			this._text.textContent = "";
		}
	}

	this.logExit();
};


