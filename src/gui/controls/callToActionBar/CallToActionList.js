/**
 * @class app.gui.controls.CallToActionList
 */

app.gui.controls.CallToActionList = function CallToActionList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.CallToActionList, app.gui.controls.HtmlList);

/**
 * @method createdCallback
 */
app.gui.controls.CallToActionList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this.itemTemplate = "app-call-to-action-list-item";

	this.onControlEvent("key:down", this._onKeyDown);
	this.onControlEvent("add", this._add);
	this.onControlEvent("remove", this._remove);
	this.onControlEvent("swap", this._swap);

	this._listElem.style.position = "absolute"; // so we dont have to add CSS for each different cta

	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.CallToActionList.prototype._populate = function _populate(arr) {
	this.logEntry();
	var filtered = app.screenConfig.callToAction.filter(function(item) {
		return (this.indexOf(item.id) !== -1);
	}, arr);
	this.superCall(filtered);
	this.logExit();
};

/**
 * @method hasId
 */
app.gui.controls.CallToActionList.prototype._hasId = function _hasId(itemId) {
    this.logEntry();
    var i, len = this._itemNb;

    // create list of current item ids, add the new one and repopulate
    for (i = 0; i < len; i++) {
        if (this._data[i].id === itemId) { // exists already
            return true; // nothing more to do
        }

    }
    this.logExit();
    return false;


};

/**
 * @method _add
 */
app.gui.controls.CallToActionList.prototype._add = function _add(itemId) {
	this.logEntry();
	var i, len = this._itemNb,
		arr = [];

	// create list of current item ids, add the new one and repopulate
	for (i = 0; i < len; i++) {
		if (this._data[i].id === itemId) { // exists already
			return; // nothing more to do
		}
		arr.push(this._data[i].id);
	}
	arr.push(itemId);
	this._populate(arr);

	this.logExit();
};

/**
 * @method _remove
 */
app.gui.controls.CallToActionList.prototype._remove = function _remove(itemId) {
	this.logEntry();
	var i, len = this._itemNb,
		arr = [];

	// create list of item ids we want to keep and repopulate
	for (i = 0; i < len; i++) {
		if (this._data[i].id !== itemId) {
			arr.push(this._data[i].id);
		}
	}
	this._populate(arr);

	this.logExit();
};

/**
 * @method _swap
 */
app.gui.controls.CallToActionList.prototype._swap = function _swap(itemId1, itemId2) {
	this.logEntry();
	var i, len = this._itemNb,
		arr = [];

	// create list of item ids where item1 is swapped for item2 and repopulate
	for (i = 0; i < len; i++) {
		if (this._data[i].id === itemId1) {
			arr.push(itemId2); // swap
		} else {
			arr.push(this._data[i].id);
		}
	}
	this._populate(arr);

	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.CallToActionList.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();

	if (this._itemNb > 0) {
		var actions = this._data.filter(function(item) {
			return (item.key.indexOf(e.key) !== -1);
		});
		actions.forEach(function (item) {
			this.fireControlEvent(item.id, e.key);
		}, this);
	}

	this.logExit();
};



/**
 * @class app.gui.controls.CallToActionListItem
 */

app.gui.controls.CallToActionListItem = function CallToActionListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.CallToActionListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 */
app.gui.controls.CallToActionListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

  this._imgSpan = this.ownerDocument.createElement("span");
  this.appendChild(this._imgSpan);

  this._textSpan = this.ownerDocument.createElement("span");
  this.appendChild(this._textSpan);

	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.CallToActionListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;

		if (data.text) { // must have at least this

			this.dataset.id = data.id;

		  this._imgSpan.className = data.btn;
		  this._textSpan.innerHTML = $util.Translations.translate(data.text);
		  this._textSpan.dataset.i18n = data.text;

		} else {
		  this._imgSpan.className = "";
		  this._textSpan.textContent = "unknown";
		}
	}
});

