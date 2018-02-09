/**
 * @class app.gui.controls.SearchKeyList
 */

app.gui.controls.SearchKeyList = function SearchKeyList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchKeyList, app.gui.controls.HtmlFlexList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchKeyList.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this.animate = true;
	this.orientation = "Vertical";
	this.minItems = 9;
	this.cyclic = true;

	this._focusClass = "focused";

	this._keyArrays = {
		"ABC": [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',  '123',  '!@#', ' ' ],
		"!@#": [ ':', '\'', '-', '!', '&', '.', ',', '?', '/', '@', '$', '#', ')', '(', '+', '"', '*', ';', '=', '123', 'ABC', ' ' ],
		"123": [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '!@#', 'ABC', ' ' ]
	};

	this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.SearchKeyList.prototype._populate = function _populate (term) {
	this.logEntry();
	var arr = (term && this._keyArrays[term]) ? this._keyArrays[term] : this._keyArrays.ABC;

	this.superCall(arr, 0);
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.SearchKeyList.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	var handled = false, term, key;

	switch (e.key) {
		case "Enter":
		case "Ok":
			term = this.selectedItem ? this.selectedItem.itemData : null;
			key = term ? term.replace(/<([^>]+)>/ig, "") : null; // strip tags

			if (key && this._keyArrays[key]) {
				this.fireControlEvent("populate", key);
			} else {
				this.fireControlEvent("enter", this);
			}
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
 * @class app.gui.controls.SearchKeyListItem
 */

app.gui.controls.SearchKeyListItem = function SearchKeyListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchKeyListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchKeyListItem.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
  this._text = this.querySelector('.letter');
	this._focusClass = "searchKeyList-focused";
	this.logExit();
};

/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.SearchKeyListItem.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;

		if (data) {
			this.dataset.index = this.itemIndex;
			if (data === ' ') {
				this._text.textContent = " ";
				this._text.classList.add("searchKeySpace");
			} else if (data.length === 1) {
				this._text.textContent = data;
			} else {
				this._text.innerHTML = "<span class='specialSet'>" + data + "</span>";
			}
			this.classList.remove("searchKeyList-empty");
		} else {
			this._text.textContent = "";
			this.classList.add("searchKeyList-empty");
		}
	}
});
