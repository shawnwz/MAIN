/**
 * @class app.gui.controls.SurfPastEventsList
 */

app.gui.controls.SurfPastEventsList = function SurfPastEventsList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SurfPastEventsList, app.gui.controls.SurfEventsList);

/**
 * @method createdCallback
 */
app.gui.controls.SurfPastEventsList.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
    this._eventsLabel = this._surfScanBar.querySelector('#pastEventsLabel');

    this._listElem.className = "pastEvents-list pastEvents-anim-normal";

    this._maxItemNb = 5;

    this.onControlEvent("exit:right", function () {
        $util.ControlEvents.fire("app-surf:surfFutureEventsList", "focus");
    }, this);

    this.logExit();
};

/**
 * @method _onFocus
 */
app.gui.controls.SurfPastEventsList.prototype._onFocus = function _onFocus() {
    this.logEntry();
    this.superCall();
    this._surfScanProgListContLeft.classList.remove("pastEvents-inactive");
    this._surfScanProgListContRight.classList.add("currentEvents-inactive");
    this._surfScanBar.classList.add("right");
    //"change" event can't be fired when navigate from futerEventList,then current focused event can not be updated.
    this.fireControlEvent("change", this);
    this.logExit();
};

/**
 * @method populate
 */
app.gui.controls.SurfPastEventsList.prototype._populate = function _populate(data) {

    this.logEntry();

    var arr = [], i, len,
        dummy = { title: "no event" };

    if (data.length > 0 && data[0].isRadio === true) {
        // add one and only one item
        arr = data;
        arr[0]._class = [];
        arr[0]._class.push("radio-Cell");
        arr[0]._class.push("currentEvents-empty");
        this._listElem.style.left = "162px";
        this.superCall(arr, 0);
        return;
    }

    this._listElem.style.left = "740px";

    // filter out all events which still have to start, but keep the now event
    for (i = 0, len = data.length; i < len; i++) {
        if (data[i].isOnNow === true) {
            arr = data.slice(0, i + 1); // slice the array at next event
            break; // can stop now
        }
    }

    // we want at least 3 events (two past, one future)
    while (arr.length < 3) {
        arr.push(dummy);
    }

    // prepend two dummy events (it will never show but the UI expects it)
    arr.unshift({ title: "" });
    arr.unshift({ title: "" });

    // add some info so we dont have to do this each time
    for (i = 0, len = arr.length; i < len; i++) {
        arr[i]._class = [];
        arr[i]._icons = ""; // '<span style="display:none" class="surfScanIcon iconRecord">R</span>';
        if (arr[i + 1] &&
            arr[i + 1].isToday === true &&
            arr[i].isYesterday === true) { // the last one of yesterday
            arr[i]._class.push("showLabel");
        }
    }

    arr[0]._class.push("pastEvents-empty"); // we never want to select these two dummy cells and ...
    arr[1]._class.push("pastEvents-empty"); // ... they should be blank, they are purely for display

    arr[arr.length - 1]._class.push("pastEvents-empty"); // even though the last cell has the now event, we never want to select it, it is purely for display

    this.superCall(arr, len - 2); // select previous event

    this.logExit();
};


/**
 * @method _scroll
 * slide the focused element in view
 */
app.gui.controls.SurfPastEventsList.prototype._scroll = function _scroll() {
    this.logEntry();

    var children = this._listElem.children,
        n, i, len = children.length,
        selectedItem = this.selectedItem,
        start;

    if (len === 0 || !selectedItem) {
        return; // nothing to do
    }

    n = selectedItem.domIndex;

    if (len === 1) { // new list

        this._prependList(3);
        this._appendList(1);

    } else if (n < 2) { // remove from the right, append to the left

        n = 2 - n;
        this._prependList(n);
        for (i = children.length - 1; i >= this._maxItemNb; i--) { // leave first elements
            children[i].remove();
        }
        this._scrolledPix += (n * children[0].outerSize);
        this._moveEdge(this._sliderElem, this._scrolledPix);

    } else if (n > 3) { // remove on the left, append to the right

        n -= 3;
        this._appendList(n);
        len = children.length;
        for (i = (len - this._maxItemNb); i > 0; i--) { // leave last elements
            children[0].remove();
        }
        this._scrolledPix -= (n * children[0].outerSize);
        this._moveEdge(this._sliderElem, this._scrolledPix);

    }

    // move all items to the right location as there size might have changed
    len = children.length;
    start = children[0].startPos;
    n = children[0].itemIndex;
    for (i = 0; i < len; i++) {
        start = this._appendItem(n + i, start);
    }
};

/**
 * @method _change
 * slide the focused element in view
 */
app.gui.controls.SurfPastEventsList.prototype._change = function _change(ctrl) {
    this.logEntry();
    var children = this._listElem.children,
        data = children.length > 2 ? children[2].itemData : null;

    if (data) {
        if (data.isYesterday === true) {
            this._eventsLabel.classList.add("show");
            this._eventsLabel.innerHTML = "Yesterday";
        } else {
            this._eventsLabel.classList.remove("show");
            this._eventsLabel.innerHTML = "";
        }
    }

    this.superCall(ctrl);

    this.logExit();
};




/**
 * @class app.gui.controls.SurfPastEventsListItem
 */

app.gui.controls.SurfPastEventsListItem = function SurfPastEventsListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SurfPastEventsListItem, app.gui.controls.SurfEventsListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SurfPastEventsListItem.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();

    this._emptyClass = "pastEvents-empty";

    this.logExit();
};

