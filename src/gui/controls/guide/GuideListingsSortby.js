/**
 * @class app.gui.controls.GuideListingsSortTime
 */

app.gui.controls.GuideListingsSortTime = function GuideListingsSortTime () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsSortTime, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideListingsSortTime.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "guideSortItems-menu-highlight";
    this.logExit();
};


/**
 * @class app.gui.controls.GuideListingsSortString
 */

app.gui.controls.GuideListingsSortString = function GuideListingsSortString () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsSortString, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideListingsSortString.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "guideSortItems-menu-highlight";
    this.logExit();
};
