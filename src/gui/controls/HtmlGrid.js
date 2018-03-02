/**
 * @class app.gui.controls.HtmlGrid
 */

app.gui.controls.HtmlGrid = function HtmlGrid () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlGrid, app.gui.controls.HtmlTable);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.HtmlGrid.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this._gridSpanVisible = (130 * 60 * 1000); // visible part of the grid
    this._gridSpanBuffer = (30 * 60 * 1000); // invisible buffer on either side of visible span

    // this._gridStart        // actual start of grid
    // this._gridVisibleStart // visible start of grid
    // this._gridVisibleEnd   // visible end of grid
    // this._gridEnd                    // actual end of grid

    this.gridStart = this.zeroOffset;

    // redraw and cleanup
    this._redraw = function () {
        this._rows.forEach(function (row, r) {
            var div = this.querySelector("#" + this._rowId + r),
                children = div.children,
                c, elem, data, len = row.length;

            // remove elements outside grid area
            for (c = len - 1; c >= 0; c--) {
                elem = row[c];
                data = elem.itemData;
                if (data.endTime < this._gridStart) {   // remove all items before gridStart
                    children[c].remove();
                    row.splice(c, 1);
                    this._itemNb--;
                } else if (data.startTime > this._gridEnd) {    // remove all items after gridEnd
                    children[c].remove();
                    row.splice(c, 1);
                    this._itemNb--;
                }
            }

            // redraw and reindex the elements
            len = row.length;
            for (c = 0; c < len; c++) {
                elem = row[c];
                elem.itemRowIndex = r;
                elem.itemColIndex = c;
                elem.itemData = elem.itemData; // redraw the cell to line texts up
            }

        }, this);
    };

    this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlGrid.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    this.superCall();

    if (this.id) {
        this.onControlEvent("append", this._append);
        this.onControlEvent("prepend", this._prepend);
        this.onControlEvent("update", function (offset) {
            this._update(offset);
            this.fireControlEvent("updated", this);
        });
        this.onControlEvent("scroll", this._scroll);
        this.onControlEvent("scroll:left", function (fastMode) {
            this.fireControlEvent("scroll", -1 * this._gridSpanBuffer, fastMode);
        });
        this.onControlEvent("scroll:right", function (fastMode) {
            this.fireControlEvent("scroll", this._gridSpanBuffer, fastMode);
        });
    }
    this.logExit();
};

/**
 * @property gridStart
 */
Object.defineProperty(app.gui.controls.HtmlGrid.prototype, "gridStart", {
    get: function get () {
        return this._gridStart;
    },
    set: function set (val) {
        if (typeof val === "number") {
            var span = this.gridSpan,
                upperLimit = this.upperLimit,
                lowerLimit = this.lowerLimit,
                actualVal = val;

            if (actualVal !== this._gridStart) {
                if (lowerLimit !== undefined && actualVal < lowerLimit) {
                    this.logWarning("gridStart out of bounds! limit to lowerLimit", actualVal);
                    actualVal = lowerLimit;
                } else if (upperLimit !== undefined && (actualVal + span) > upperLimit) {
                    this.logWarning("gridStart out of bounds! limit to upperLimit", actualVal);
                    actualVal = upperLimit - span;
                }
                this._gridStart = actualVal;
                this._gridVisibleStart = this._gridStart + this._gridSpanBuffer;
                this._gridVisibleEnd = this._gridVisibleStart + this._gridSpanVisible;
                this._gridEnd = this._gridVisibleEnd + this._gridSpanBuffer;
            }
        }
    }
});

/**
 * @property gridEnd
 */
Object.defineProperty(app.gui.controls.HtmlGrid.prototype, "gridEnd", {
    get: function get () {
        return this._gridEnd;
    },
    set: function set (val) {
        if (typeof val === "number") {
            var span = this.gridSpan,
                upperLimit = this.upperLimit,
                lowerLimit = this.lowerLimit,
                actualVal = val;

            if (actualVal !== this._gridEnd) {
                if (lowerLimit !== undefined && (actualVal - span) < lowerLimit) {
                    this.logWarning("gridEnd out of bounds! limit to lowerLimit", actualVal);
                    actualVal = lowerLimit + span;
                } else if (upperLimit !== undefined && actualVal > upperLimit) {
                    this.logWarning("gridEnd out of bounds! limit to upperLimit", actualVal);
                    actualVal = upperLimit - span;
                }
                this._gridEnd = actualVal;
                this._gridVisibleEnd = this._gridEnd - this._gridSpanBuffer;
                this._gridVisibleStart = this._gridVisibleEnd - this._gridSpanVisible;
                this._gridStart = this._gridVisibleStart - this._gridSpanBuffer;
            }
        }
    }
});

/**
 * @property gridSpan
 */
Object.defineProperty(app.gui.controls.HtmlGrid.prototype, "gridSpan", {
    get: function get () {
        return (this._gridSpanBuffer + this._gridSpanVisible  + this._gridSpanBuffer);
    }
});

/**
 * @property zeroOffset
 */
Object.defineProperty(app.gui.controls.HtmlGrid.prototype, "zeroOffset", {
    get: function get () {
        return 0;
    }
});

/**
 * @property upperLimit
 */
Object.defineProperty(app.gui.controls.HtmlGrid.prototype, "upperLimit", {
    get: function get () {
        return undefined; // no limit
    }
});

/**
 * @property lowerLimit
 */
Object.defineProperty(app.gui.controls.HtmlGrid.prototype, "lowerLimit", {
    get: function get () {
        return undefined; // no limit
    }
});

/**
 * @method _reset
 */
app.gui.controls.HtmlGrid.prototype._reset = function _reset () {
    this.logEntry();
    this.gridStart = this.zeroOffset;
    this.superCall();
    this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.HtmlGrid.prototype._populate = function _populate (items) {
    this.logEntry();

    this.fireControlEvent("clear");

    items.forEach(function (row, r) {
        var div = this.ownerDocument.createElement("div");

        if (this._rowClass) {
            div.className = this._rowClass;
        }
        if (this._rowId) {
            div.id = this._rowId + r;
        }
        this.appendChild(div);

        this._rows[r] = [];

        row.forEach(function(data, c) {
            var elem = this.newItem(data);

            div.appendChild(elem); // append before setting itemData, so we can acess parent when we set it
            elem.itemRowIndex = r;
            elem.itemColIndex = c;
            elem.itemData = data;

            this._rows[r].push(elem);
            this._itemNb++;
        }, this);
    }, this);

    this.logExit();
};

/**
 * @method _prepend
 * prepend current elements with given elements
 */
app.gui.controls.HtmlGrid.prototype._prepend = function _prepend (items) {
    this.logEntry();

    // append all the new element
    items.forEach(function (row, r) {
        var div = this.querySelector("#" + this._rowId + r);
        //eslint-disable-next-line no-unused-vars
        row.forEach(function (data, c) {
            var elem = this.newItem(data);
            div.insertBefore(elem, div.firstChild); // append before setting itemData, so we can acess parent when we set it
            elem.itemData = data;
            this._rows[r].unshift(elem);
            this._itemNb++;
        }, this);
    }, this);

    this._redraw();

    this.logExit();
};

/**
 * @method _append
 * append current elements with given elements
 */
app.gui.controls.HtmlGrid.prototype._append = function _append (items) {
    this.logEntry();

    // append all the new element
    items.forEach(function (row, r) {
        var div = this.querySelector("#" + this._rowId + r);
        //eslint-disable-next-line no-unused-vars
        row.forEach(function (data, c) {
            var elem = this.newItem(data);
            div.appendChild(elem); // append before setting itemData, so we can acess parent when we set it
            elem.itemData = data;
            this._rows[r].push(elem);
            this._itemNb++;
        }, this);
    }, this);

    this._redraw();

    this.logExit();
};

/**
 * @method _update
 */
app.gui.controls.HtmlGrid.prototype._update = function _update (offset) {
    this.logEntry();
    this.gridStart = this._gridStart + offset;
    this.logExit();
};

/**
 * @method _scroll
 */
app.gui.controls.HtmlGrid.prototype._scroll = function _scroll (offset, fastMode) {
    this.logEntry();
    var gridStart = this._gridStart + offset,
        gridEnd = gridStart + this.gridSpan;
    if (gridStart < this.lowerLimit) { // got to the start of the grid
        this.fireControlEvent("exit:left", this, fastMode);
    } else if (gridEnd > this.upperLimit) { // got to the end of the grid
        this.fireControlEvent("exit:right", this, fastMode);
    } else if (fastMode) { // fast mode: just update start time, dont update
        this.gridStart = this._gridStart + offset;
        this.fireControlEvent("updated", this); // pretend update for the outside world
    } else { // slow mode: update the grid elements
        this.fireControlEvent("update", offset);
    }

    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.HtmlGrid.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    switch (e.key) {
        case "ArrowLeft":
            if (!this._moveSelection(0, -1)) { // got to first cell: scroll
                this.fireControlEvent("scroll:left", e.repeat);
            }
            e.stopImmediatePropagation();
            break;
        case "ArrowRight":
            if (!this._moveSelection(0, 1)) { // got to last cell: scroll
                this.fireControlEvent("scroll:right", e.repeat);
            }
            e.stopImmediatePropagation();
            break;
        default:
            this.superCall(e);
            break;
    }
    this.logExit();
};

/**
 * @method _moveSelection
 */
app.gui.controls.HtmlGrid.prototype._moveSelection = function _moveSelection (r, c) {
    this.logEntry();
    var selectedItem = this._selectedItem,
      row = (selectedItem ? selectedItem.itemRowIndex : -1) + r,
      col = (selectedItem ? selectedItem.itemColIndex : -1) + c,
        middle = selectedItem ? selectedItem.cellMiddle : null,
        positionChanged = false,
        getClosest = function (arr, goal) {
            var keys = Object.keys(arr);
            //eslint-disable-next-line no-shadow
            return keys.reduce(function (p, c) {
                return (Math.abs(arr[p].cellMiddle - goal) < Math.abs(arr[c].cellMiddle - goal) ? Number(p) : c);
            }, 0);
        };

    if ((typeof this._rows[row] === 'undefined') && r !== 0) { // new row does not exist and moving up/down
        return false;
    }
    if ((typeof this._rows[row][col] === 'undefined') && c !== 0) { // new column does not exist and moving left/right
        return false;
    }

    if (r !== 0 && middle !== null) { // moving up down and had a selection
        col = getClosest(this._rows[row], middle); // get the closest value of the next row
    }

    if (this._rows[row] && this._rows[row][col]) {
        positionChanged = (!selectedItem || row !== selectedItem.itemRowIndex || col !== selectedItem.itemColIndex);
        this._setSelection(col, row);
        if (this._rows[row][col]._data.endTime <= this._gridVisibleStart || this._rows[row][col].startTime >= this._gridVisibleEnd) {
            positionChanged = false;
        }
    }
    this.logExit();
    return positionChanged;
};
