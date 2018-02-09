/**
 * @class app.gui.controls.GuideListingsSortList
 */

app.gui.controls.GuideListingsSortList = function GuideListingsSortList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsSortList, app.gui.controls.HtmlFlexList);  // HtmlFlexList

/**
 * @method createdCallback
 */
app.gui.controls.GuideListingsSortList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this.orientation = "Vertical";
    this.animate = true;

    this.logExit();
};

/**
 * @method _onFocus
 */
app.gui.controls.GuideListingsSortList.prototype._onFocus = function _onFocus () {
    this.logEntry();
    this.superCall();
    this.parentElement.classList.remove("disabled");
    $util.ControlEvents.fire("app-guide:ctaGuide", "fetch", null);
    this.logExit();
};

/**
 * @method _onBlur
 */
app.gui.controls.GuideListingsSortList.prototype._onBlur = function _onBlur () {
    this.logEntry();
    this.superCall();
    this.parentElement.classList.add("disabled");
    this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.GuideListingsSortList.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false;

    switch (e.key) {
        case "Enter":
        case "Ok":
            $util.ControlEvents.fire("app-guide:epgListingsProgList-List", "fetch", "sort", this._selectedItem.dataset.index);
            handled = true;
            break;
        default:
            handled = this.superCall(e);
            break;
    }
    if (handled === true) {
        e.stopImmediatePropagation();
    }
    this.logExit();
};

/**
 * @class app.gui.controls.GuideListingsSortListItem
 */
app.gui.controls.GuideListingsSortListItem = function GuideListingsSortListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsSortListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideListingsSortListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this.logExit();
};

/**
 * @class app.gui.controls.GuideListingsSortListDate
 */
app.gui.controls.GuideListingsSortListDate = function GuideListingsSortListDate () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsSortListDate, app.gui.controls.GuideListingsSortList);
app.gui.controls.GuideListingsSortListDate.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._listElem.className = "dateList-list";
    this._keyArrays = [ 'Yesterday', 'Today' ];
    for (var i = 1; i < 14; i++) { //By default, there are 15 days(from 'yesterday') events were shown on epg listing view.
        this._keyArrays.push($util.DateTime.dayText(new Date(Date.now() + 86400000 * i).getTime()));
    }
    this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.GuideListingsSortListDate.prototype._populate = function _populate (index) {
    this.logEntry();
    var arr = this._keyArrays;
    
    this.superCall(arr, index);
    this.logExit();
};

/**
 * @class app.gui.controls.GuideListingsSortListDateItem
 */

app.gui.controls.GuideListingsSortListDateItem = function GuideListingsSortListDateItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsSortListDateItem, app.gui.controls.GuideListingsSortListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideListingsSortListDateItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "dateList-focused";

    //this.classList.add("dateList-cell");

    this.logExit();
};

/**
 * @class app.gui.controls.GuideListingsSortListLetter
 */
app.gui.controls.GuideListingsSortListLetter = function GuideListingsSortListLetter () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsSortListLetter, app.gui.controls.GuideListingsSortList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideListingsSortListLetter.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._listElem.className = "letterList-list";
    this._keyArrays = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

    this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.GuideListingsSortListLetter.prototype._populate = function _populate (index) {
    this.logEntry();
    var arr = this._keyArrays;

    this.superCall(arr, index);
    this.logExit();
};

/**
* @class app.gui.controls.GuideListingsSortListLetterItem
*/

app.gui.controls.GuideListingsSortListLetterItem = function GuideListingsSortListLetterItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsSortListLetterItem, app.gui.controls.GuideListingsSortListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideListingsSortListLetterItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "letterList-focused";
    this.logExit();
};

/**
 * @property itemData
 * @public
 */
Object.defineProperty(app.gui.controls.GuideListingsSortListItem.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        this._data = data;

        if (data) {
            this.textContent = data;
            this.classList.remove("listingsSortList-empty");
        } else {
            this.textContent = "";
            this.classList.add("listingsSortList-empty");
        }
    }
});
