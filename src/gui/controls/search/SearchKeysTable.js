/**
 * @class app.gui.controls.SearchKeysTable
 */

app.gui.controls.SearchKeysTable = function SearchKeysTable() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchKeysTable, app.gui.controls.HtmlTable);

/**
 * @method createdCallback
 */
app.gui.controls.SearchKeysTable.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this._focusClass = "focused";

	this._keyArrays = {
		"ABC": [ [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M' ],
		         [ 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ] ],
		"123": [ [ ':', '\'', '-', '!', '&', '.', ',', '?', '/', '@' ], // '$', '#', ')', '(', '+', '"', '*', ';', '='],
		         [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ] ]
	};

	// wrap around left and right */
	this.onControlEvent("exit:left", function () {
		this.fireControlEvent("select:column", "last");
	}, this);
	this.onControlEvent("exit:right", function () {
		this.fireControlEvent("select:column", "first");
	}, this);
	this.onControlEvent("focus", function () {
		if (!this._selectedItem) {
			this.fireControlEvent("select", "first", "middle");
		}
	}, this);
	this.logExit();
};


/**
 * @method _populate
 */
app.gui.controls.SearchKeysTable.prototype._populate = function _populate(term) {
	this.logEntry();
	var arr = (term && this._keyArrays[term]) ? this._keyArrays[term] : this._keyArrays.ABC;
	if (arr && arr.length > 0) {
		this.superCall(arr);
	}
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.SearchKeysTable.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	if (e.key >= "0" && e.key <= "9") {
		console.log("SearchKeysTable e.key" + e.key);
		this.fireControlEvent("number:up", e);
		e.stopImmediatePropagation();
	}
	this.superCall(e);
	this.logExit();
};

/**
 * @class app.gui.controls.SearchKeysTableCell
 */

app.gui.controls.SearchKeysTableCell = function SearchKeysTableCell() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchKeysTableCell, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 */
app.gui.controls.SearchKeysTableCell.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	var tmpl = document.getElementById("searchKeysCellTemplate");
	this.appendChild(tmpl.content.cloneNode(true));

	this._text = this.querySelector('.text');

	this._focusClass = "focused";

	this.logExit();
};

/**
 * @property itemData
 * @public
 */
Object.defineProperty(app.gui.controls.SearchKeysTableCell.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;

		if (data) {
			this._text.textContent = data;
		}
	}
});



