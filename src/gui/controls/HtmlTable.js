/**
 * @class app.gui.controls.HtmlTable
 */

app.gui.controls.HtmlTable = function HtmlTable () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlTable, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.HtmlTable.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._config = this.dataset.config || null;

	this._rowClass = "";
	this._rowId = "";

	this._rows = [];
	this._selectedItem = null;
	this._itemNb = 0;

	/**
	 * @method _split
	 */
	this._split = function (arr, chunk) {
		var items = [],
			i,
			len = arr.length;

		for (i = 0; i < len; i += chunk) {
			items.push(arr.slice(i, i + chunk));
		}
		return items;
	};

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.HtmlTable.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();
	this.superCall();
	if (this.id) {
		this.onControlEvent("change", this._change);

		this.onControlEvent("select:row", function (r) {
			var selectedItem = this.selectedItem,
				col = selectedItem ? selectedItem.itemColIndex : -1;

			this._select(r || 0, col);
		});
		this.onControlEvent("select:column", function (c) {
			var selectedItem = this.selectedItem,
				row = selectedItem ? selectedItem.itemRowIndex : -1;

			this._select(row, c || 0);
		});
		this.onControlEvent("select", function (r, c) {
			this._select(r || 0, c || 0);
		});

		this.onControlEvent("enter", function (table) {
			if (this._config) {
				var selectedItem = (table && table.selectedItem) ? table.selectedItem : null,
					data = (selectedItem && selectedItem.itemData) ? selectedItem.itemData : null,
					events = (data && data.events) ? data.events : null;

				if (events) {
					events.forEach(function (event) {
						if (event.control && event.event) {
							$util.ControlEvents.fire(event.control, event.event, event.data);
						} else if (event.name) {
							$util.Events.fire(event.name, event.data);
						}
					});
				}
			}
		});
	}
	this.logExit();
};

/**
 * @property focused
 */
Object.defineProperty(app.gui.controls.HtmlTable.prototype, "focused", {
	get: function get () {
		return this._isFocused;
	}
});

/**
 * @method _reset
 */
app.gui.controls.HtmlTable.prototype._reset = function _reset () {
	this.logEntry();
	this._setSelection(0, 0);
	this.logExit();
};

/**
 * @method _clear
 */
app.gui.controls.HtmlTable.prototype._clear = function _clear () {
	this.logEntry();
	this.innerHTML = '';
	this._selectedItem = null;
	this._rows = [];
	this._cols = [];
	this._itemNb = 0;
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.HtmlTable.prototype._fetch = function _fetch () {
	this.logEntry();
	var me = this;

	if (this._config) {
		$util.fetch(this._config, 3000).then(function (data) {
			me.fireControlEvent("populate", data);
		}).then(function () {
			me.fireControlEvent("reset");
		});
	}
	this.logExit();
};

/**
 * @method _change
 */
app.gui.controls.HtmlTable.prototype._change = function _change () {
	this.logEntry();
	this.logExit();
};

/**
 * @method _select
 */
app.gui.controls.HtmlTable.prototype._select = function _select (r, c) {
	this.logEntry();
	var selectedItem = this._selectedItem,
		row = selectedItem ? selectedItem.itemRowIndex : -1,
		col = selectedItem ? selectedItem.itemColIndex : -1,
		__getValue = function (val, old, len) {
			var newVal = val;
			if (typeof newVal === 'string') {
				if (newVal === 'last') {
					newVal = len - 1;
				} else if (newVal === 'first') {
					newVal = 0;
				} else if (newVal === 'middle') {
					newVal = Math.floor(len / 2);
				}
			} else if (typeof newVal === 'number') {
				if (newVal < 0) { // from the end
					newVal = len + newVal;
				}
			} else { // leave as is
				newVal = old;
			}
			if (typeof newVal !== "undefined") { // do out of bounds check
				if (newVal >= len) {
					newVal = len - 1;
				} else if (newVal < 0) {
					newVal = 0;
				}
			}
			return newVal;
		},
		actualR = r,
		actualC = c;

	if (this._rows.length === 0) {
		return;
	}
	actualR = __getValue(actualR, row, this._rows.length);
	actualC = __getValue(actualC, col, this._rows[actualR].length);
	if (row !== actualR || col !== actualC) {
		// we use move not set so we dont have to check the rowIndex
		this._moveSelection(actualR - row, actualC - col);
	}
	this.logExit();
};

/**
 * @property itemNb - number of items in the list
 */
Object.defineProperty(app.gui.controls.HtmlTable.prototype, "itemNb", {
	get: function get () {
		return this._itemNb;
	}
});

///**
// * @property itemData - current items in the list
// */
//Object.defineProperty(app.gui.controls.HtmlTable.prototype, "itemData", {
//	get: function get() {
//		return this._rows;
//	}
//});

/**
 * @property selectedItem
 */
Object.defineProperty(app.gui.controls.HtmlTable.prototype, "selectedItem", {
	get: function get () {
		return this._selectedItem;
	},
	set: function () {
		console.warn("HtmlTable.selectedItem - Not implemented");
	},
	enumerable: true
});

o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(app.gui.controls.HtmlTable.prototype, 'itemTemplate',	{
	template     : app.gui.controls.HtmlListItem,
	querySelector: ':scope template'
});

o5.gui.controls.Control.definePropertyWithDataAttribute(app.gui.controls.HtmlTable.prototype, 'rowClass',	{
	get: function () {
		return this._rowClass;
	},
	set: function (val) {
		this._rowClass = val;
	},
	toAttribute: function (val) {
		return val ? val.localName : '';
	},
	fromAttribute: function (val) {
		return val;
	}
});

o5.gui.controls.Control.definePropertyWithDataAttribute(app.gui.controls.HtmlTable.prototype, 'rowId',	{
	get: function () {
		return this._rowId;
	},
	set: function (val) {
		this._rowId = val;
	},
	toAttribute: function (val) {
		return val ? val.localName : '';
	},
	fromAttribute: function (val) {
		return val;
	}
});

o5.gui.controls.Control.definePropertyWithDataAttribute(app.gui.controls.HtmlTable.prototype, 'focusClass',	{
	get: function () {
		return this._focusClass;
	},
	set: function (val) {
		this._focusClass = val;
	},
	toAttribute: function (val) {
		return val ? val.localName : '';
	},
	fromAttribute: function (val) {
		return val;
	}
});

/**
 * @method _populate
 */
app.gui.controls.HtmlTable.prototype._populate = function _populate (items) {
	this.logEntry();
	this._clear();
	this._itemNb = 0;

	if (items) {
		var rows = items,
			div;

		rows.forEach(function (row, EachR) {
			this._rows[EachR] = [];

			div = this.ownerDocument.createElement("div");

			if (this._rowClass) {
				div.className = this._rowClass;
			}
			if (this._rowId) {
				div.id = this._rowId + EachR;
			}
			this.appendChild(div);

			row.forEach(function(data, eachC) {
				if (!this._cols[eachC]) {
					this._cols[eachC] = [];
				}
			  	var elem = this.newItem(data);
				div.appendChild(elem);

				elem.itemData = data;
				elem.itemRowIndex = EachR;
				elem.itemColIndex = eachC;
				this._rows[EachR][eachC] = elem;
				this._cols[eachC][EachR] = elem;

				this._itemNb++;
			}, this);
		}, this);
	}
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.HtmlTable.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	switch (e.key) {
		case "ArrowDown":
			if (!this._moveSelection(1, 0)) {
				this.fireControlEvent("exit:down", this);
			}
			e.stopImmediatePropagation();
			break;
		case "ArrowUp":
			if (!this._moveSelection(-1, 0)) {
				this.fireControlEvent("exit:up", this);
			}
			e.stopImmediatePropagation();
			break;
		case "ArrowLeft":
			if (!this._moveSelection(0, -1)) {
				this.fireControlEvent("exit:left", this);
			}
			e.stopImmediatePropagation();
			break;
		case "ArrowRight":
			if (!this._moveSelection(0, 1)) {
				this.fireControlEvent("exit:right", this);
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
app.gui.controls.HtmlTable.prototype._moveSelection = function _moveSelection (r, c) {
	this.logEntry();
	var selectedItem = this._selectedItem,
		row = (selectedItem ? selectedItem.itemRowIndex : -1) + r,
		col = (selectedItem ? selectedItem.itemColIndex : -1) + c,
		positionChanged = false,
		getClosest = function (arr, goal) {
			return arr.reduce(function(prev, curr) {
				return (Math.abs(curr - goal) < Math.abs(prev - goal) ? Number(curr) : prev);
			}, Number(arr[0]));
		},
		keys;

	// some rows/cols might have less elements
	if (this._rows[row] && r !== 0) { // new row exists and moving up/down
		keys = Object.keys(this._rows[row]);
		col = getClosest(keys, col);
	}
	if (this._cols[col] && c !== 0) { // new column exists and moving left/right
		keys = Object.keys(this._cols[col]);
		row = getClosest(keys, row);
	}

	if (this._rows[row] && this._rows[row][col] && this._rows[row][col].selectable) {
		positionChanged = (!selectedItem || row !== selectedItem.itemRowIndex || col !== selectedItem.itemColIndex);
		// positionChanged = (this._rows[row][col] !== this._selectedItem);
		this._setSelection(col, row);
	}

	this.logExit();

	return positionChanged;
};

/**
 * @method _setSelection
 */
app.gui.controls.HtmlTable.prototype._setSelection = function _setSelection (col, row) {
	this.logEntry();
	var selectedItem = this._selectedItem;

	if (selectedItem &&
		row === selectedItem.itemRowIndex &&
		col === selectedItem.itemColIndex) {
		return; // same position
	}

	if (this._rows[row] && this._rows[row][col]) {

		if (selectedItem) {
			selectedItem._onDeselect();
		}

		this._selectedItem = this._rows[row][col];

		if (this._selectedItem) {
			this._selectedItem._onSelect();
		}
	}
	this.logExit();
};

