/**
 * @class app.gui.controls.GuideListingsShowOnlyCc
 */

app.gui.controls.GuideListingsShowOnlyCc = function GuideListingsShowOnlyCc () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsShowOnlyCc, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideListingsShowOnlyCc.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "guideSortItems-focused";
    this.logExit();
};

/**
 * @method _toggle
 */
app.gui.controls.GuideListingsShowOnlyCc.prototype._toggle = function _toggle () {
    this.logEntry();
    // TODO: repopulate programme list
    if (!this.classList.contains("checked")) {
        this.classList.add("checked");
    } else {
        this.classList.remove("checked");
    }

    this.logExit();
};

/**
 * @class app.gui.controls.GuideListingsShowOnlyHd
 */

app.gui.controls.GuideListingsShowOnlyHd = function GuideListingsShowOnlyHd () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsShowOnlyHd, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideListingsShowOnlyHd.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "guideSortItems-focused";
    this.logExit();
};

/**
 * @method _toggle
 */
app.gui.controls.GuideListingsShowOnlyHd.prototype._toggle = function _toggle () {
    this.logEntry();
    // TODO: repopulate programme list
    if (!this.classList.contains("checked")) {
        this.classList.add("checked");
    } else {
        this.classList.remove("checked");
    }

    this.logExit();
};
