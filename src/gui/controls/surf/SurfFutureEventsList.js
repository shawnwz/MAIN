/**
 * @class app.gui.controls.SurfFutureEventsList
 */

app.gui.controls.SurfFutureEventsList = function SurfFutureEventsList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SurfFutureEventsList, app.gui.controls.SurfEventsList);

/**
 * @method createdCallback
 */
app.gui.controls.SurfFutureEventsList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
  this._eventsLabel = this._surfScanBar.querySelector('#currentEventsLabel');

    this._listElem.className = "currentEvents-list currentEvents-anim-normal";
    this._listElem.style.left = "-145px";

    this.maxItems = 5;

    this.onControlEvent("exit:left", function () {
        $util.ControlEvents.fire("app-surf:surfPastEventsList", "focus");
    }, this);

    this.logExit();
};

/**
 * @method _onFocus
 */
app.gui.controls.SurfFutureEventsList.prototype._onFocus = function _onFocus () {
    this.logEntry();
    this.superCall();
    this._surfScanProgListContRight.classList.remove("currentEvents-inactive");
    this._surfScanProgListContLeft.classList.add("pastEvents-inactive");
    this._surfScanBar.classList.remove("right");
    //"change" event can't be fired when navigate from past EventList,then current focused event can not be updated.
    this.fireControlEvent("change", this);
    this.logExit();
};

/**
 * @method populate
 */
app.gui.controls.SurfFutureEventsList.prototype._populate = function _populate (data) {

    this.logEntry();

    var arr = [], i, len,
        dummy = { title: "no event" },
        channel = null,
        startTime = 0;

    if (data.length > 0 && data[0].isRadio === true) {
        // add one and only one item
        arr = data;
        arr[0]._class = [];
        arr[0]._class.push("radio-Cell");
        arr[0]._class.push("currentEvents-empty");
        this.superCall(arr, 0);
        return;
    }

    // filter out all events which have stopped, but keep the previous event
    for (i = 0, len = data.length; i < len; i++) {
        if (data[i].isOnNow === true) {
            if (i > 0) { // slice the array at previous event
                arr = data.slice(i - 1);
            } else { // use the whole array
                arr = data;
                arr.unshift({ title: "" }); // prepend a dummy previous event (it will never show but the UI expects it)
            }
            break; // can stop now
        }
    }

    //get channel, starTime: use for <View the TV Guide>
    channel = data[0].channel;
    startTime = data[data.length - 1].startTime;

    // we want at least 3 events (one past, two future)
    while (arr.length < 3) { //@hdk check where to push based on existing event
        arr.push(dummy);
    }

    // add one more for the endCell
    arr.push({ title: "View the TV Guide", _class: "", isEndCell: true, channel: channel, startTime: startTime });

    // add some info so we dont have to do this each time
    for (i = 0, len = arr.length; i < len; i++) {
        arr[i]._class = [];
        arr[i]._icons = ""; // '<span style="display:none" class="surfScanIcon iconRecord">R</span>';
        if (arr[i - 1] &&
            arr[i - 1].isToday === true &&
            arr[i].isTomorrow === true) { // first one of tomorrow
            arr[i]._class.push("showLabel"); //@hdk not nice! do different!
        }
    }

    arr[0]._class.push("currentEvents-empty"); // we never want to select these the dummy cells and they should be blank, they are purely for display
    arr[len - 1]._class.push("currentEvents-endCell"); // special end cell

    this.superCall(arr, 1); // select "now" event

    this.logExit();
};

/**
 * @method _scroll
 * slide the focused element in view
 */
app.gui.controls.SurfFutureEventsList.prototype._scroll = function _scroll () {
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

        this._prependList(1);
        this._appendList(3);

    } else if (n < 1) { // move left: remove from the right, append to the left

        n = 1 - n;
        this._prependList(n);
        for (i = children.length - 1; i >= this._maxItemNb; i--) { // leave first _maxItemNb elements
            children[i].remove();
        }
        this._scrolledPix += (n * children[0].outerSize);
        this._moveEdge(this._sliderElem, this._scrolledPix);

    } else if (n > 2) { // move right: remove on the left, append to the right

        n -= 2;
        this._appendList(n);
        for (i = n; i > 0; i--) { // remove as many as we tried to append (we might end up with less than _maxItemNb items if we are near/at the end of the list)
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
 */
app.gui.controls.SurfFutureEventsList.prototype._change = function _change (ctrl) {
    this.logEntry();

    /*
    * Important! Must do the superCall() before set Label Text!
    * superCall() make the list scroll, the Label Text should be set according to the scrolled list status
    */
    this.superCall(ctrl);

    var children = this._listElem.children,
        data = children.length > 2 ? children[1].itemData : null;

    if (data) {
        if (data.isTomorrow === true) {
            this._eventsLabel.classList.add("show");
            this._eventsLabel.innerHTML = "Tomorrow";
        } else {
            this._eventsLabel.classList.remove("show");
            this._eventsLabel.innerHTML = "";
        }
    }

    this.logExit();
};




/**
 * @class app.gui.controls.SurfFutureEventsListItem
 */

app.gui.controls.SurfFutureEventsListItem = function SurfFutureEventsListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SurfFutureEventsListItem, app.gui.controls.SurfEventsListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SurfFutureEventsListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this._emptyClass = "currentEvents-empty";

    this.logExit();
};

