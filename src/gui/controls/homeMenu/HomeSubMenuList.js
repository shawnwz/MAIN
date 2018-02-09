/**
 * @class app.gui.controls.HomeSubMenuList
 */

app.gui.controls.HomeSubMenuList = function HomeSubMenuList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HomeSubMenuList, app.gui.controls.HtmlList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.HomeSubMenuList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this.orientation = "horizontal";
	this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.HomeSubMenuList.prototype._populate = function _populate(node) {
	this.logEntry();
	this._clear();

	var items = (node && node._subNodes && node._subNodesNb) ? node._subNodes : null,
		data = [],
		key;

	if (items) {
		// eslint-disable-next-line guard-for-in
		for (key in items) {
			data.push(items[key]);
		}
		this.superCall(data);
		this.fireControlEvent("select", 0);
	}
	this.logExit();
};



/**
 * @class app.gui.controls.HomeSubMenuListItem
 */

app.gui.controls.HomeSubMenuListItem = function HomeSubMenuListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HomeSubMenuListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.HomeSubMenuListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._floatItem = true;
  this._text = this.querySelector('.homeSubMenuItemText');
	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.HomeSubMenuListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;

		if (data) {
			this._text.textContent = data.displayName;
		} else {
			this._text.textContent = "item" + this.itemIndex;
		}
	}
});

