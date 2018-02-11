/**
 * @class app.gui.controls.HtmlListItem
 */
app.gui.controls.HtmlListItem = function HtmlListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlListItem, app.gui.controls.HtmlItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.HtmlListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this._position = 0; // either last set top (vertical list) or left (horizontal list) position
    this._size = 0; // size of element (assumed constant)

    this._floatItem = false; // set this to true if you want float list items (without positioning)
    this._focusClass = "focused";

    this._parent = this.parentControl; // the List containing this item

    this.logExit();
};

/**
 * @property selectable
 */
Object.defineProperty(app.gui.controls.HtmlListItem.prototype, "selectable", {
    get: function get () {
        if (this.classList.length === 0) {
            return true;
        } else if (this._hiddenClass && this.classList.contains(this._hiddenClass)) {
            return false;
        } else if (this._emptyClass && this.classList.contains(this._emptyClass)) {
            return false;
        }
        return true;
    }
});

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.HtmlListItem.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) { // only works when in DOM!?
        this._data = data;
    }
});

/**
 * @property itemIndex
 * index of given element in the full list
 */
Object.defineProperty(app.gui.controls.HtmlListItem.prototype, "itemIndex", {
    get: function get () {
        return parseInt(this.dataset.index);
    },
    set: function set (index) { // only works when in DOM!?
        this.dataset.index = index;
    }
});

/**
 * @property domIndex
 * index of given element in the dom list
 */
Object.defineProperty(app.gui.controls.HtmlListItem.prototype, "domIndex", {
    get: function get () {
        var parent = this.parentElement,
            index = -1;

        if (parent) {
            index = [].indexOf.call(parent.children, this);
        }
        return index;
    }
});


/**
 * @property outerSize
 * get the outer size of given element (height/width + margins)
 */
Object.defineProperty(app.gui.controls.HtmlListItem.prototype, "outerSize", {
    get: function get () {
            var parent = this._parent,
                style, size = 0,
                dataReady = false;

        if (dataReady && this._size) { // already done: just return it //@hdk disabled
            size = this._size;
        } else if (parent) {
            style = window.getComputedStyle(this);
            if (parent._orientation === "Vertical") {
                size = (this.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom));
            } else {
                size = (this.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight));
            }
            this._size = size;
        }
        return size;
    }
});

/**
 * @property startPos
 * set/get the start position of given element (top/left)
 */
Object.defineProperty(app.gui.controls.HtmlListItem.prototype, "startPos", {
    get: function get () {
        return this._position;
    },
    set: function get (px) {
        var parent = this._parent;

        if (parent) {
            if (this._floatItem !== true) {
                if (parent._orientation === "Vertical") {
                    this.style.top = px + "px";
                } else {
                    this.style.left = px + "px";
                }
            }
            this._position = px;
        }
    }
});

/**
 * @method onSelect
 */
app.gui.controls.HtmlListItem.prototype._onSelect = function _onSelect () {
    this.logEntry();
    var parent = this._parent;

    if (parent) {
        if (parent._delayChange) {
            if (parent._delayChangeTimer) { // cancel previous delay
                clearTimeout(parent._delayChangeTimer);
            }
            parent._delayChangeTimer = setTimeout(function() {
                parent.fireControlEvent("change", parent);
            }, parent._delayChange);
        } else {
            parent.fireControlEvent("change", parent);
        }
    }

    this.setAttribute("selected", "");
    if (this._focusClass) {
        this.classList.add(this._focusClass);
    }
    this.logExit();
};

/**
 * @method _onDeselect
 */
app.gui.controls.HtmlListItem.prototype._onDeselect = function _onDeselect () {
    this.logEntry();
    this.removeAttribute("selected");
    if (this._focusClass) {
        this.classList.remove(this._focusClass);
    }
    this.logExit();
};

