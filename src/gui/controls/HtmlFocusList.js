/**
 * @class app.gui.controls.HtmlFocusList
 *
 * HTML List with selection, focus, and appending/prepending of elements, no scrolling
 */

app.gui.controls.HtmlFocusList = function HtmlFocusList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlFocusList, app.gui.controls.HtmlList);

/**
 * @method createdCallback
 */
app.gui.controls.HtmlFocusList.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();

    this.tabIndex = -1;

    this._wrapped = false;

    // the window in which the highlited element should be
    this._focusWindow = this.querySelector("#" + this.id + "-ListFocus");
	
    if (this._focusWindow === null) { // only append if not yet created
        this._focusWindow = this.ownerDocument.createElement("div");
        this.appendChild(this._focusWindow);
    }

    this._focusClass = this.id + '-focused';
    this._blurClass = this.id + '-blurred';

    this._scrollBarElem = null; // by default
    this._scrollBarFillElem = null; // by default

    if (this.dataset.scrollbar) {
        // the fill element of the scrollbar should have class: scrollBarItemFill
        this._scrollBarElem = document.querySelector('#' + this.dataset.scrollbar);
        if (this._scrollBarElem) {
            this._scrollBarFillElem = this._scrollBarElem.querySelector(".scrollBarItemFill");
        }

    }

    // private variables
    this._isFocused = false;
    this._selectedItem = undefined;

    this.onfocus = this._onFocus;
    this.onblur = this._onBlur;
    this.onkeydown = this._onKeyDown;

    this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlFocusList.prototype.attachedCallback = function attachedCallback() {
    this.logEntry();
    this.superCall();
    if (this.id) {
        this._focusWindow.id = this.id + "-ListFocus";

        this.onControlEvent("focus", this._focus);
        this.onControlEvent("change", this._change);
        this.onControlEvent("select", this._select);
        this.onControlEvent("key:down", this._onKeyDown);
        this.onControlEvent("jump", this._jump);
        // eslint-disable-next-line no-unused-vars
        this.onControlEvent("next", function(skipAnimation) {
            var args = [].slice.call(arguments);
            if (!this._next.apply(this, args)) {
                if (this._orientation === "Horizontal") {
                    this.fireControlEvent("exit:right", this);
                } else {
                    this.fireControlEvent("exit:down", this);
                }
            }
        });
        // eslint-disable-next-line no-unused-vars
        this.onControlEvent("previous", function(skipAnimation) {
            var args = [].slice.call(arguments);
            if (!this._previous.apply(this, args)) {
                if (this._orientation === "Horizontal") {
                    this.fireControlEvent("exit:left", this);
                } else {
                    this.fireControlEvent("exit:up", this);
                }
            }
        });
    }
    this.logExit();
};

/**
 * @method _reset
 */
app.gui.controls.HtmlFocusList.prototype._reset = function _reset() {
    this.logEntry();
    this.superCall();
    var index = this._selectedItem ? this._selectedItem.itemIndex : -1;
    if (index !== 0) {
        this.selectedItem = 0;
    }
    this.logExit();
};

/**
 * @method _change
 */
app.gui.controls.HtmlFocusList.prototype._change = function _change() {
    this.logEntry();
    this.logExit();
};

/**
 * @method _select
 */
app.gui.controls.HtmlFocusList.prototype._select = function _select(index) {
    this.logEntry();
    var selectIndex,
        elem;
    if (this._itemNb > 0) { // only if we have some items
        if (typeof index === 'string') {
            if (index === 'last') {
                selectIndex = this._itemNb - 1;
            } else if (index === 'first') {
                selectIndex = 0;
            } else if (index === 'middle') {
                selectIndex = Math.floor(this._itemNb / 2);
            }
        } else if (index < 0) { // from the end
            selectIndex += this._itemNb;
        } else {
            selectIndex = index;
        }
        if (!this._selectedItem || this._selectedItem.itemIndex !== selectIndex) {

            if (selectIndex >= this._itemNb) {
                selectIndex = this._wrapped ? (selectIndex % this._itemNb) : (this._itemNb - 1);
            } else if (selectIndex < 0) {
                selectIndex = this._wrapped ? (selectIndex + this._itemNb) : 0;
            }

            elem = this._elems[selectIndex];
            if (elem && elem.selectable !== false) {
                this.selectedItem = selectIndex;
            }
        }
    }
    this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.HtmlFocusList.prototype._focus = function _focus() {
    this.logEntry();
    this.focus();
    this.logExit();
};

/**
 * @method _next
 * skipAnimation is not used (no scroll in HtmlFocusList), this is for classes which override this class
 */
app.gui.controls.HtmlFocusList.prototype._next = function _next() {
    this.logEntry();
    var handled = false,
        itemNb = this.itemNb,
        count = itemNb,
        n, index = this._selectedItem ? this._selectedItem.itemIndex : 0,
        wrapped = this._wrapped,
        elem;

	// Look for the next selectable item in the list. If there is none, keep same one selected.
    for (n = index + 1; count > 0; n++, count--) {
        if (n >= itemNb) {
            if (!wrapped) {
                break; // nothing left
            }
            n = 0; // wrap to first
        }
        elem = this._elems[n];
        if (elem.selectable) { // first selectable one: done!
            this.selectedItem = n;
            handled = true;
            break;
        }
    }
    this.logExit(handled);
    return handled;
};

/**
 * @method _previous
 * skipAnimation is not used (no scroll in HtmlFocusList), this is for classes which override this class
 */
app.gui.controls.HtmlFocusList.prototype._previous = function _previous() {
    this.logEntry();
    var handled = false,
        itemNb = this.itemNb,
        count = itemNb,
        n, index = this._selectedItem ? this._selectedItem.itemIndex : 0,
        wrapped = this._wrapped,
        elem;


    // Look for the previous selectable item in the list. If there is none, keep same one selected.
    for (n = index - 1; count > 0; n--, count--) {
        if (n < 0) {
            if (!wrapped) {
                break; // nothing left
            }
            n = itemNb - 1; // wrap to last
        }
        elem = this._elems[n];
        if (elem.selectable) { // first selectable one: done!
            this.selectedItem = n;
            handled = true;
            break;
	        }
    }
    this.logExit(handled);
    return handled;
};

/**
 * @method _jump
 * jump nb of items from the selected one
 * skipAnimation is not used (no scroll in HtmlFocusList), this is for classes which override this class
 */
app.gui.controls.HtmlFocusList.prototype._jump = function _jump(nb, skipAnimation) {
    this.logEntry();

    /* For lists which do not populate the DOM with all elements (e.g. FlexLists), a jump to an
     * item currently not in the DOM will fail (for example, it can't know if it is selectable).
     * The only way to jump for these Lists is to repopulate the whole DOM from the newly selected
     * item. This of course will not have any animation and could jump to an item which is not
     * selectable.
     *
     * Also, for cyclic (wrapped) Lists, jumping beyond the boundary needs to wrap. While none cyclic
     * Lists should end up at the boundary of the List (first or last item).
     *
     * Finally, since some items in the List might not be selectable, we need to jump over them but still
     * count them. We should end up on the selectable item before or after (depending on jump direction)
     * the desired item.
     *
     * To overcome above "issues" we "simply" do repeated "next"/"previous" events until we get to the
     * new selected item. Note: for large or repeated jumps this might not be optimal.
     */
    var i, count = Math.abs(nb),
      dir = nb < 0 ? "previous" : "next";

    for (i = 0; i < count; i++) {
        this.fireControlEvent(dir, skipAnimation);
    }

    this.logExit();
};


/**
 * @method _populate
 * simply populate the DOM with all items
 */
app.gui.controls.HtmlFocusList.prototype._populate = function _populate(arr, index) {
    this.logEntry();
    this.superCall(arr);

    var len = this._itemNb,
        acutalIndex = index;

    acutalIndex = acutalIndex || 0;
    acutalIndex = (acutalIndex < 0 ? ((acutalIndex % len) + len) : (acutalIndex % len)); // wrap if needed

    this.selectedItem = acutalIndex;
    this.logExit();
};

/**
 * @method _prepend
 * prepend current elements with given elements
 */
app.gui.controls.HtmlFocusList.prototype._prepend = function _prepend(data) {
    this.logEntry();
    var index = this._selectedItem ? this._selectedItem.itemIndex : 0;

    this._data.unshift.apply(this._data, data);
    this._populate(this._data, index);

    this.logExit();
};

/**
 * @method _append
 * append current elements with given elements
 */
app.gui.controls.HtmlFocusList.prototype._append = function _append(data) {
    this.logEntry();
    var index = this._selectedItem ? this._selectedItem.itemIndex : 0;

    this._data.push.apply(this._data, data);
    this._populate(this._data, index);

    this.logExit();
};

/**
 * @property selectedItem
 */
Object.defineProperty(app.gui.controls.HtmlFocusList.prototype, "selectedItem", {
    get: function get() {
        var elem = null;
        if (this._selectedItem) {
            elem = this._selectedItem;// || this._listElem.children[0]; // selected or first (//@hdk essumes not empty and selectable!
        }
        return elem;
    },
    set: function set(index) {
        var elem = this._elems[index] ? this._elems[index] : null;
        if (elem && this._selectedItem !== elem) {
            if (this._selectedItem) {
                this._selectedItem._onDeselect();
            }
            this._selectedItem = elem;
            if (elem._onSelect) {
                elem._onSelect();
            }
        }
    }
});


/**
 * Enables or disables circular navigation of the list items in an infinite loop.
 *
 *     <html-focus-list data-cyclic></html-focus-list>
 *
 * @property {Boolean} [cyclic=false]
 */
o5.gui.controls.Control.defineBooleanPropertyWithDataAttribute(app.gui.controls.HtmlFocusList.prototype, 'cyclic', {
    get: function () {
        return this._wrapped;
    },
    set: function (val) {
        this._wrapped = val;
        if (this._wrapped) {
            this.setAttribute('data-cyclic', '');
        } else {
            this.removeAttribute('data-cyclic');
        }
    }
});

/**
 * @method focusClass
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(app.gui.controls.HtmlFocusList.prototype, 'focusClass', {
    get: function () {
        return this._focusClass;
    },
    set: function (val) {
        this._focusClass = val;
    },
    toAttribute: function (val) {
        return val ? val : '';
    },
    fromAttribute: function (val) {
        return val;
    }
});


/**
 * @property focused
 */
Object.defineProperty(app.gui.controls.HtmlFocusList.prototype, "focused", {
    get: function get() {
        return this._isFocused;
    }
});

/**
 * @method _onFocus
 */
app.gui.controls.HtmlFocusList.prototype._onFocus = function _onFocus() {
    this.logEntry();
    if (this._isFocused === false) { // only if not yet focused
        this.fireControlEvent("focussed", this);
    }
    this._isFocused = true;
    this.setAttribute("selected", "");
    if (this._focusClass) {
        this.classList.add(this._focusClass);
    } else if (this._blurClass) {
        this.classList.remove(this._blurClass);
    }
    this.logExit();
};

/**
 * @method _onBlur
 */
app.gui.controls.HtmlFocusList.prototype._onBlur = function _onBlur() {
    this.logEntry();
    if (this._isFocused === true) { // only if focused
        this.fireControlEvent("blurred", this);
    }
    this._isFocused = false;
    this.removeAttribute("selected");
    if (this._focusClass) {
        this.classList.remove(this._focusClass);
    } else if (this._blurClass) {
        this.classList.add(this._blurClass);
    }
    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.HtmlFocusList.prototype._onKeyDown = function _onKeyDown(e) {
    this.logEntry();

    var handled = true;

    switch (e.key) {
        case "Back":
        case "backspace":
            this.fireControlEvent("back", this);
            break;
        case "ArrowDown":
            if (this._orientation === "Horizontal" || !this._next(e.repeat)) {
                this.fireControlEvent("exit:down", this);
            }
            break;
        case "ArrowUp":
            if (this._orientation === "Horizontal" || !this._previous(e.repeat)) {
                this.fireControlEvent("exit:up", this);
            }
            break;
        case "ArrowLeft":
            if (this._orientation === "Vertical" || !this._previous(e.repeat)) {
                this.fireControlEvent("exit:left", this);
            }
            break;
        case "ArrowRight":
            if (this._orientation === "Vertical" || !this._next(e.repeat)) {
                this.fireControlEvent("exit:right", this);
            }
            break;
        case "Ok":
        case "Enter":
            this.fireControlEvent("enter", this);
            break;
        default:
            handled = false;
            break;
    }

    if (handled) {
        e.stopImmediatePropagation();
        e.preventDefault();
    }

    this.logExit(handled);
    return handled;
};

