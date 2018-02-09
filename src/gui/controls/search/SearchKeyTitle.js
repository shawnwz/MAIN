/**
 * @class app.gui.controls.SearchKeyTitle
 */

app.gui.controls.SearchKeyTitle = function SearchKeyTitle() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchKeyTitle);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchKeyTitle.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	var tmpl = document.getElementById("searchKeyTitleTemplate");
	this.appendChild(tmpl.content.cloneNode(true));

	this.onControlEvent("populate", this._populate);
	this.onControlEvent("append", this._append);
	this.onControlEvent("backspace", this._backspace);

	this._searchKeyTitleText = this.querySelector("#searchKeyTitleText");

	this._term = "";
	this._timer = null;	// slow down get response, otheriwse we get too many responses if we enter chars fast

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.SearchKeyTitle.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	this.logExit();
};

/**
 * @method _append
 * @private
 */
app.gui.controls.SearchKeyTitle.prototype._append = function _append(term) {
	this.logEntry();
	var newTerm = term;
	if (newTerm === "&nbsp;") {
		newTerm = " ";
	}
	this._term += newTerm;
	this._searchKeyTitleText.textContent = this._term;
	this._kickTimer();
	this.logExit();
};

/**
 * @method _backspace
 * @private
 */
app.gui.controls.SearchKeyTitle.prototype._backspace = function _backspace() {
	this.logEntry();
	var term = this._term;
	if (term.length > 0) {
		this._term = term.slice(0, -1);
		this._searchKeyTitleText.textContent = this._term;
	} else {
		this.fireControlEvent("back", this);
	}
	this._kickTimer();
	this.logExit();
};

/**
 * @method _populate
 * @private
 */
app.gui.controls.SearchKeyTitle.prototype._populate = function _populate(term) {
	this.logEntry();
	this._term = term;
	if (term) {
		this._searchKeyTitleText.textContent = term;
	} else {
		this._searchKeyTitleText.textContent = "";
	}
	this._kickTimer();
	this.logExit();
};

/**
 * @method _kickTimer
 * @private
 */
app.gui.controls.SearchKeyTitle.prototype._kickTimer = function _kickTimer() {
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
