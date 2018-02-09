/**
 * @class app.gui.controls.GuideListingsGenreFilter
 */

app.gui.controls.GuideListingsGenreFilter = function GuideListingsGenreFilter () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsGenreFilter, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideListingsGenreFilter.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "guideSortItems-focused";
    this.logExit();
};

/**
 * @method _reset
 */
app.gui.controls.GuideListingsGenreFilter.prototype._reset = function _reset (genre) {
    this.logEntry();
    this._clear();
    this.innerHTML = '<span>' + genre + '</span>';
    this.logExit();
};


/**
 * @class app.gui.controls.GuideListingsSubGenreFilter
 */

app.gui.controls.GuideListingsSubGenreFilter = function GuideListingsSubGenreFilter () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsSubGenreFilter, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideListingsSubGenreFilter.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "guideSortItems-focused";
    this.logExit();
};

/**
 * @method _reset
 */
app.gui.controls.GuideListingsSubGenreFilter.prototype._reset = function _reset (genre) {
    this.logEntry();
    this._clear();
    this.innerHTML = '<span class="icon-subcategory">' + genre + '</span>';
    this.logExit();
};
