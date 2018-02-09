/**
 * @class app.gui.controls.HtmlFlexList
 *
 * HTML List with selection, focus and scrolling, appending/prepending of elements
 * Will only place as any elements in the DOM to fill up the visible area
 * Elements are positioned behind eachother with top/left coordinates
 */

app.gui.controls.HtmlFlexList = function HtmlFlexList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlFlexList, app.gui.controls.HtmlScrollList);

/**
 * @method createdCallback
 */
app.gui.controls.HtmlFlexList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    /**
     * insert elements at the start until we have enough invisible ones
     */
    this._prependList = function (count) {
    //@hdk TODO this function does not work when there is nothing in the DOM
        var children = this._listElem.children,
            cLen = children.length,
            i, n = 0, iLen = Math.max(this._minItemNb, this._itemNb),
            first = cLen > 0 ? children[0].itemIndex : -1, // this._listElem.firstChild?
            last = cLen > 0 ? children[cLen - 1].itemIndex : -1,
            selectable = (cLen > 0 && children[0].selectable === true),
            elemEdge = this._getEdge(first),
            wrapped = this._wrapped,
            me = this,
            viewEdge;

        function __prependIndex (m, start) {
            var index = m;
            if (wrapped) {
                index = (m < 0 ? ((m % iLen) + iLen) : (m % iLen)); // wrap if needed
                if (index === last) {
                    return -1; // we have gone round: stop
                }
            } else if (m < 0) {
                return -1; // we reached the first: stop
            }
            me._prependItem(index, start);
            n++;
            return index; // actual index added
        }

        if (count === undefined) { // prepend until we have a (partially) invisible one

            viewEdge = this._getEdge(this._viewWindow, -this._scrolledPix);

            /* if the added element is not selectable, we add one more so that we always have a
             * selectable element as the first child. Otherwise we will not be able to navigate
             * past it
             */
            while ((elemEdge.start >= viewEdge.start && first !== -1) || !selectable) {
                first = __prependIndex(first - 1, elemEdge.start);
                selectable = (first === -1 || this._listElem.children[0].selectable === true);
                elemEdge = this._getEdge(first);
            }

        } else { // prepend count elements
            for (i = 0; i < count && first !== -1; i++) {
                first = __prependIndex(first - 1, elemEdge.start);
                elemEdge = this._getEdge(first);
            }
        }
        return n; // actually prepended items
    };

    /**
     * insert elements at the end until we have enough invisible ones
     */
    this._appendList = function (count) {
    //@hdk this function does not work when there is nothing in the DOM
        var children = this._listElem.children,
            cLen = children.length,
            i, n = 0, iLen = Math.max(this._minItemNb, this._itemNb),
            first = cLen > 0 ? children[0].itemIndex : -1,
            last = cLen > 0 ? children[cLen - 1].itemIndex : -1,
            selectable = (cLen > 0 && children[cLen - 1].selectable === true),
            elemEdge = this._getEdge(last),
            wrapped = this._wrapped,
            me = this,
            viewEdge;

        function __appendIndex (m, end) {
            var index = m;
            if (wrapped) {
                index = (m < 0 ? ((m % iLen) + iLen) : (m % iLen)); // wrap if needed
                if (index === first) {
                    return -1; // we have gone round: stop
                }
            } else if (m >= iLen) {
                return -1; // we reached the last: stop
            }
            me._appendItem(index, end);
            n++;
            return index; // actual index added
        }

        if (count === undefined) { // append until we have a (partially) invisible one

            viewEdge = this._getEdge(this._viewWindow, -this._scrolledPix);

            /* if the added element is not selectable, we add one more so that we always have a
             * selectable element as the last child. Otherwise we will not be able to navigate
             * past it
             */
            while ((elemEdge.end <= viewEdge.end && last !== -1) || !selectable) {
                last = __appendIndex(last + 1, elemEdge.end);
                selectable = (last === -1 || this._listElem.children[children.length - 1].selectable === true);
                elemEdge = this._getEdge(last);
            }

        } else { // append count elements
            for (i = 0; i < count && last !== -1; i++) {
                last = __appendIndex(last + 1, elemEdge.end);
                elemEdge = this._getEdge(last);
            }
        }
        return n; // actually appended items
    };

    this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlFlexList.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    this.superCall();
    this.logExit();
};

/* populate the list*/
app.gui.controls.HtmlFlexList.prototype._populate = function _populate (data, index) {
    this.logEntry();

    var i, len = data.length,
        elem, actualIndex,
        scrollEdge = this._getEdge(this._focusWindow, 0);

    this._clear();

    this._itemNb = len; // does not include empty ones if there is a minimum value
    this._data = data;

    if (this._minItemNb && this._minItemNb > len) { // need to add some empty ones
        len = this._minItemNb;
    }

    // prepare all the elements (including empty ones)
    for (i = 0; i < len; i++) {
        elem = this.newItem();
        elem.dataset.index = i;
        this._elems[i] = elem; // additional fields are added when we populate the DOM
    }

    actualIndex = index || 0;
    actualIndex = (actualIndex < 0 ? ((actualIndex % len) + len) : (actualIndex % len)); // wrap if needed

    // add the focused element to the DOM at the start of the scroll window
    this._appendItem(actualIndex, scrollEdge.start);

    // set the focused element which will populate the rest of the DOM by triggering a scroll
    this.selectedItem = actualIndex;

    this.logExit();
};

/**
 * @method _prepend
 * prepend current elements with given elements
 */
app.gui.controls.HtmlFlexList.prototype._prepend = function _prepend (data) {
    this.logEntry();
    var i, len = data.length,
        elems = [];

    // prepare all the new elements
    for (i = 0; i < len; i++) {
        elems[i] = this.newItem();
    }

    this._itemNb += len;
    this._data.unshift.apply(this._data, data);
    this._elems.unshift.apply(this._elems, elems);

    if (this._minItemNb && this._minItemNb > this._itemNb) { // get rid of empty ones if they are there
        this._elems.splice(this._minItemNb);
    } else {
        this._elems.splice(this._itemNb);
    }
//@hdk  to implement!!!
    if (this._itemNb > this._maxItemNb) {
        console.warn("more than max (%d>%d) number of items!! need to implement _maxItemNb!", this._itemNb, this._maxItemNb);
    }
//  if (this._maxItemNb && this._itemNb > this._maxItemNb) { // limit to the max at the start
//      if (this._minItemNb > this._maxItemNb) {
//          console.warn("min larger than max! dont know what to do!");
//      }
//      this._data.splice(0, this._itemNb - this._maxItemNb);
//      this._elems.splice(0, this._itemNb - this._maxItemNb);
//      this._itemNb = this._data.length;
//  }

    // reindex the elements
    len = this._itemNb;
    for (i = 0; i < len; i++) {
        this._elems[i].dataset.index = i;
    }

    this.fireControlEvent("scroll", false);

    this.logExit();
};

/**
 * @method _append
 * append current elements with given elements
 */
app.gui.controls.HtmlFlexList.prototype._append = function _append (data) {
    this.logEntry();
    var i, len = data.length,
        elems = [];

    if (this._minItemNb && this._minItemNb > (this._itemNb + len)) { // need to add some empty ones
        len = this._minItemNb - this._itemNb;
    }

    // prepare all the elements (including empty ones)
    for (i = 0; i < len; i++) {
        elems[i] = this.newItem();
    }

    this._itemNb += len;
    this._data.push.apply(this._data, data);
    this._elems.splice(this._itemNb); // get rid of empty ones if they are there
    this._elems.push.apply(this._elems, elems);
//@hdk  to implement!!!
    if (this._itemNb > this._maxItemNb) {
        console.warn("more than max (%d>%d) number of items!! need to implement _maxItemNb!", this._itemNb, this._maxItemNb);
    }
//  if (this._maxItemNb && this._itemNb > this._maxItemNb) { // limit to the max at the start
//      if (this._minItemNb > this._maxItemNb) {
//          console.warn("min larger than max! dont know what to do!");
//      }
//      this._data.splice(0, this._itemNb - this._maxItemNb);
//      this._elems.splice(0, this._itemNb - this._maxItemNb);
//      this._itemNb = this._data.length;
//  }

    // reindex the elements
    len = this._itemNb;
    for (i = 0; i < len; i++) {
        this._elems[i].dataset.index = i;
    }

    this.fireControlEvent("scroll", false);

    this.logExit();
};

/* slide the focused element in view */
app.gui.controls.HtmlFlexList.prototype._scroll = function _scroll (skipAnimation) {
    this.logEntry();

    this.superCall(skipAnimation);

    var children = this._listElem.children,
        n, i, len = children.length, start,
        viewEdge, elemEdge;

    if (len === 0 || len === this._itemNb) {
        return;
    }

    // populate or remove additional items in the view window until it is full
    viewEdge = this._getEdge(this._viewWindow, -this._scrolledPix);

    // remove invisible elements at the start
    len = children.length;
    if (len > 1) {
        elemEdge = this._getEdge(children[0]);
        while (elemEdge.end < viewEdge.start && len > 1) {
            children[0].remove(); // remove first one
            len--;
            elemEdge = this._getEdge(children[0]);
        }
    }

    // remove invisible elements at the end
    len = children.length;
    if (len > 1) {
        elemEdge = this._getEdge(children[len - 1]);
        while (elemEdge.start > viewEdge.end && len > 1) {
            children[len - 1].remove(); // remove last one
            len--;
            elemEdge = this._getEdge(children[len - 1]);
        }
    }

    // append as many elements as fit in the visible area
    this._appendList();
    this._prependList();

    // reposition all the elements in case the sizes have changed
    len = children.length;
    start = children[0].startPos;
    n = children[0].itemIndex;

    for (i = 0; i < len; i++) {
        //console.log(children[i].startPos, children[i].outerSize, end);
        start = this._appendItem(n + i, start);
    }

    this.logExit();
};

