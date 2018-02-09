/**
 * @class app.gui.controls.SearchEntryText
 */

app.gui.controls.SearchEntryText = function SearchEntryText() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchEntryText);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchEntryText.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	var tmpl = document.getElementById("searchKeyTitleTemplate");
	this.appendChild(tmpl.content.cloneNode(true));

	this.onControlEvent("populate", this._populate);
	this.onControlEvent("append", this._append);
	this.onControlEvent("backspace", this._backspace);
	this.onControlEvent("clear", function() {
		this.fireControlEvent("populate");
	});

	this._searchKeyTitleText = this.querySelector("#searchEntryText");

	this._term = "";
	this._timer = null;	// slow down get response, otheriwse we get too many responses if we enter chars fast

	this.logExit();
};

/**
 * @method _append
 * @private
 */
app.gui.controls.SearchEntryText.prototype._append = function _append(term) {
	this.logEntry();
	var newTerm = term;
	if (newTerm === "&nbsp;") {
		newTerm = " ";
	}
	this.fireControlEvent("populate", this._term + newTerm);
	this.logExit();
};

/**
 * @method _backspace
 * @private
 */
app.gui.controls.SearchEntryText.prototype._backspace = function _backspace() {
	this.logEntry();
	var term = this._term;
	if (term.length > 0) {
		this.fireControlEvent("populate", term.slice(0, -1));
	} else {
//		this.fireControlEvent("back", this);
	}
	this.logExit();
};

/**
 * @method _populate
 * @private
 */
app.gui.controls.SearchEntryText.prototype._populate = function _populate(term) {
	this.logEntry();
	var newTerm = term;
	if (!newTerm) {
		newTerm = "";
	}
	if (newTerm === "") {
		this._searchKeyTitleText.innerHTML = "<span class='searchEntryInfo'>Search for TV Shows, Movies or People</span>";
	} else {
		this._searchKeyTitleText.innerHTML = "<span class='searchEntryInfo'>Search </span><span class='searchEntryTerm'>" + newTerm + "_</span>";
	}
	this._term = newTerm;
	this._kickTimer();
	this.logExit();
};

/**
 * @method _kickTimer
 * @private
 */
app.gui.controls.SearchEntryText.prototype._kickTimer = function _kickTimer() {
	this.logEntry();
	if (this._timer) {
		clearTimeout(this._timer);
	}
	var me = this;
	this._timer = setTimeout(function() {
		me.fireControlEvent("change", me._term);
	}, 500);
	this.logExit();
};

/**
 * @property itemData
 * @public
 * @type {Object} itemData
 */
Object.defineProperty(app.gui.controls.SearchEntryText.prototype, "itemData", {
	get: function get() {
		return this._term;
	}
});

