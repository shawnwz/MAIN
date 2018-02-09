/**
 * @class app.gui.controls.SearchButtonsList
 */

app.gui.controls.SearchButtonsList = function SearchButtonsList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchButtonsList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchButtonsList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this.orientation = "Horizontal";
	this._focusClass = "focused";
	this._wrapped = true;

	this._keyArrays = {
		"ABC": [
			{ action: 'ABC',       text: 'ABC',   class: 'searchButtonNumbers' },
			{ action: 'space',     text: 'space', class: 'searchButtonSpace' },
			{ action: 'backspace', text: '',      class: 'searchButtonBackspace' },
			{ action: 'clear',     text: 'clear', class: 'searchButtonClear' }
		],
		"123": [
			{ action: '123',       text: '123#',   class: 'searchButtonNumbers' },
			{ action: 'space',     text: 'space',  class: 'searchButtonSpace' },
			{ action: 'backspace', text: '',       class: 'searchButtonBackspace' },
			{ action: 'clear',     text: 'clear',  class: 'searchButtonClear' }
		]
	};

	$util.ControlEvents.on("app-search-query:searchButtonsList", "focus", function () {
		$util.ControlEvents.fire("app-search-query:searchButtonsList", "select", 1);
	}, this);
	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.SearchButtonsList.prototype._populate = function _populate(term) {
	this.logEntry();
	var arr = (term && this._keyArrays[term]) ? this._keyArrays[term] : this._keyArrays.ABC;
	if (arr && arr.length > 0) {
		this.superCall(arr);
	}
	this.logExit();
};



/**
 * @class app.gui.controls.SearchButtonsListItem
 */

app.gui.controls.SearchButtonsListItem = function SearchButtonsListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchButtonsListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchButtonsListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._text = this.querySelector('.searchButtonItem');
	this._focusClass = "focused";
	this.logExit();
};

/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.SearchButtonsListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;

		if (data && data.text) {
			this._text.textContent = data.text;
		} else {
			this._text.textContent = "";
		}
		if (data && data.class) {
			this.classList.add(data.class);
		}
	}
});
