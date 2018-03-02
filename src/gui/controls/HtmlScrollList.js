/**
 * @class app.gui.controls.HtmlScrollList
 *
 * HTML List with selection, focus and scrolling, appending/prepending of elements
 */

app.gui.controls.HtmlScrollList = function HtmlScrollList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlScrollList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 */
app.gui.controls.HtmlScrollList.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();

    // the window in which the highlited element should be
    this._focusWindow = this.querySelector("#" + this.id + "-ListFocus");
	
    if (this._focusWindow === null) { // only append if not yet created
        this._focusWindow = this.ownerDocument.createElement("div");
        this.appendChild(this._focusWindow);
    }

    this.animate = false;
    this._scrollFast = false; // can be used to temporarily scroll fast, e,g, on holding a key down
    this._scrollbarType = this.dataset.scrollbarType;
    this._scrolledPix = 0; // number of pixels scrolled
    this._sliderElem = this._listElem; // this element will be moved to scroll the highlited element into the _focusWindow

    /**
     * get the start and end edges of given element
     */
    this._getEdge = function (elem, offset) {
        var start = 0, size = 0,
          index, style, actualElem = elem;

        if (typeof actualElem === "number") { // use elem as index
            index = actualElem;
        } else { // see if its a list element
            index = actualElem.itemIndex;
        }

        if (typeof index === "number") { // have a valid index
            if (typeof this._elems[index] !== "undefined") {
                actualElem = this._elems[index];
                start = actualElem.startPos;
                size = actualElem.outerSize;
            }
        } else {
            style = window.getComputedStyle(actualElem);
            if (this._orientation === "Vertical") {
                start = parseInt(style.top) || 0;
                size = (actualElem.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom));
            } else {
                start = parseInt(style.left) || 0;
                size = (actualElem.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight));
            }
        }
        if (offset) {
            start += offset;
        }
        return { "start": start, "end": (start + size), "size": size };
    };

    /**
     * set the start edge of given element (top/left)
     */
    this._setEdge = function (elem, px) {
        if (elem) {
            if (this._orientation === "Vertical") {
                elem.style.top = px + 'px';
            } else {
                elem.style.left = px + 'px';
            }
        }
    };

    /**
     * set the start edge of given element by moving it (webkitTransform)
     */
    this._moveEdge = function (elem, px) {
        if (elem) {
            if (this._orientation === "Horizontal") {
                elem.style.webkitTransform = "translate3d(" + px + "px,0,0)";
            } else {
                elem.style.webkitTransform = "translate3d(0," + px + "px,0)";
            }
        }
    };

    /**
     * get number of pixels to move (scroll or wrap) to get given element in view
     */
    this._getScrollPix = function (elem) {
        if (!elem) {
            return 0;
        }
        var containerEdge = this._getEdge(this._focusWindow, -this._scrolledPix),
            edge = this._getEdge(elem),
            pix = 0;

        // determine how many pixels to scroll
        if (this._scrollbarType === "page") {
        	pix = edge.start - containerEdge.start; //scrolling forward pagewise
        } else if (edge.size > containerEdge.size) { // doesnt fit: line up the top/left
            pix = edge.start - containerEdge.start;
        } else if (edge.end > containerEdge.end) { // scroll to the end
            pix = edge.end - containerEdge.end;
        } else if (edge.start < containerEdge.start) { // scroll to the start
            pix = edge.start - containerEdge.start;
        }
        return pix;
    };

    /**
     * slide the focused element in view
     */
    this._slideInView = function (skipAnimation) {
        var selectedItem = this._selectedItem || this._listElem.children[0], // selected or first
            pix = -this._getScrollPix(selectedItem);

        if (!selectedItem || pix === 0) {
            this._setScrollbar(selectedItem); // at least move the scroll bar
            return 0; // nothing to do
        }

        pix += this._scrolledPix; // add pix already scrolled

        if (this.animate === true) { // use webkit-transform
            if (this._scrollFast === true || skipAnimation === true) {
                this._sliderElem.classList.add("noAnimation");
            } else {
                this._sliderElem.classList.remove("noAnimation");
            }
            this._moveEdge(this._sliderElem, pix);
        } else { // use position
            this._setEdge(this._sliderElem, pix);
        }

        this._scrolledPix = pix;
        this._setScrollbar(selectedItem);

        return pix;
    };

    this._setScrollbar = function (elem) { /* moves the scrollbar to the correct location */
        var index, free, start;

        if (elem && this._scrollBarElem && this._scrollBarFillElem) {
            index = elem.itemIndex;

            if (this._orientation === "Vertical") {
                free = this._scrollBarElem.offsetHeight - this._scrollBarFillElem.offsetHeight;
            } else {
                free = this._scrollBarElem.clientWidth - this._scrollBarFillElem.clientWidth;
            }

            start = Math.ceil((free * index) / (this._itemNb - 1));

            this._setEdge(this._scrollBarFillElem, start);
        }
    };

    this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlScrollList.prototype.attachedCallback = function attachedCallback() {
    this.logEntry();
    this.superCall();
    if (this.id) {
        this._focusWindow.id = this.id + "-ListFocus";

        this.onControlEvent("scroll", this._scroll);
    }
    this.logExit();
};

/**
 * @method _next
 */
app.gui.controls.HtmlScrollList.prototype._next = function _next(skipAnimation) {
    this._scrollFast = skipAnimation;
    var handled = false,
        itemNb = this.itemNb,
        count = itemNb,
        n, index = this._selectedItem ? this._selectedItem.itemIndex : 0,
        wrapped = this._wrapped,
        elem;
    if (this._scrollbarType && this._scrollbarType === "page") {
        for (n = index + 1; count > 0; n++, count--) {
            if (n >= itemNb) {
                if (!wrapped) {
                    break; // nothing left
                }
                n = 0; // wrap to first
                break;
            }
            if (parseInt(this._elems[n].style.top) + this._elems[n].outerSize >= parseInt(this._elems[index].style.top) + this._focusWindow.clientHeight) {
                break;
            }
        }
        elem = this._elems[n];
        if (elem.selectable) { // first selectable one: done!
            this.selectedItem = n;
            handled = true;
        }
    } else {
        handled = this.superCall(skipAnimation);
    }
    this._scrollFast = false;
    return handled;
};

/**
 * @method _previous
 */
app.gui.controls.HtmlScrollList.prototype._previous = function _previous(skipAnimation) {
    this._scrollFast = skipAnimation;
    var handled = false,
        itemNb = this.itemNb,
        count = itemNb,
        n, index = this._selectedItem ? this._selectedItem.itemIndex : 0,
        wrapped = this._wrapped,
        elem;



    if (this._scrollbarType && this._scrollbarType === "page") {
        for (n = index; count > 0 && index > 0; n--, count--) {
            if (n < 0) {
                if (!wrapped) {
                    break; // nothing left
                }
                n = itemNb - 1; // wrap to last
                break;
           } else if (n === 0) {
               break;
           }
            if (parseInt(this._elems[index].style.top) - this._focusWindow.clientHeight > parseInt(this._elems[n - 1].style.top)) {
                break;
            }
        }
        if (index === 0) {
            n = Math.ceil(itemNb - (this._sliderElem.clientHeight % 483) / this.selectedItem.outerSize);
        }
        elem = this._elems[n];
        if (elem.selectable) { // first selectable one: done!
            this.selectedItem = n;
            handled = true;
        }
    } else {
        handled = this.superCall(skipAnimation);
    }
    this._scrollFast = false;
    return handled;
};

/**
 * @method _jump
 */
app.gui.controls.HtmlScrollList.prototype._jump = function _jump(nb, skipAnimation) {
    this._sliderElem.classList.add("jumpFast");
    this.superCall(nb, skipAnimation);
    this._sliderElem.classList.remove("jumpFast");
};

/**
 * @method _change
 */
app.gui.controls.HtmlScrollList.prototype._change = function _change() {
    this.logEntry();
    this.fireControlEvent("scroll", false);
    this.logExit();
};

/**
 * @method _clear
 */
app.gui.controls.HtmlScrollList.prototype._clear = function _clear() {
    this.logEntry();
    this.superCall();

    this._scrolledPix = 0;

    if (this._scrollBarElem && this._scrollBarFillElem) {
        this._setEdge(this._scrollBarFillElem, 0);
    }

    if (this._sliderElem) {
        if (this.animate === true) {
            this._sliderElem.classList.add("noAnimation");
            this._moveEdge(this._sliderElem, 0);
            this._sliderElem.classList.remove("noAnimation");
        } else {
            this._setEdge(this._sliderElem, 0);
        }
    }
    this.logExit();
};

/**
 * @method _populate
 * populate the list
 */
app.gui.controls.HtmlScrollList.prototype._populate = function _populate(arr, index) {
    this.logEntry();
    this.superCall(arr, index);

    if (this._scrollBarElem && this._scrollBarFillElem) { // have a scrollbar calculte its fillitem size
        var size, pagesNb,
          children = this._listElem.children;

        if (this._orientation === "Vertical") {
            pagesNb = Math.ceil(this._sliderElem.clientHeight / this._focusWindow.clientHeight);
        } else {
            pagesNb = Math.ceil(this._sliderElem.clientWidth / this._focusWindow.clientWidth);
        }

        if (this._scrollbarType === "item" && pagesNb > 1 && children.length > 0) {
            this._scrollBarElem.classList.remove('hide');
            this._scrollBarElem.classList.add('show');
            size = Math.floor(100 / this._itemNb);
        } else if (this._scrollbarType === "page" && pagesNb > 1 && children.length > 0) {
            this._scrollBarElem.classList.remove('hide');
            this._scrollBarElem.classList.add('show');
            size = Math.floor(100 / pagesNb);
        } else { // fits on one page: no scrollbar
            this._scrollBarElem.classList.remove('show');
            this._scrollBarElem.classList.add('hide');
            size = 100;
        }
        if (this._orientation === "Vertical") {
            this._scrollBarFillElem.style.height = size + "%";
        } else {
            this._scrollBarFillElem.style.width = size + "%";
        }
    }

    this.logExit();
};

/**
 * @method _scroll
 * slide the focused element in view
 */
app.gui.controls.HtmlScrollList.prototype._scroll = function _scroll(skipAnimation) {
    this.logEntry();

    var children = this._listElem.children,
        len = children.length,
        selectedItem;

    if (len === 0) { // no children: bail
        return;
    }

    selectedItem = this._selectedItem || children[0]; // selected or first

    if (!selectedItem.parentElement) { // not in DOM: repopulate
        //@hdk improve this?! should perhaps append/prepend then slide?
        this._populate(this._data, selectedItem.itemIndex);
        return;
    }

    /* first slide selected item in view */
    this._slideInView(skipAnimation);

    this.logExit();
};

