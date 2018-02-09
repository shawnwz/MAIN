/**
 * @class app.gui.controls.TileMosaicColumnList
 */

app.gui.controls.TileMosaicColumnList = function TileMosaicColumnList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.TileMosaicColumnList, o5.gui.controls.List);

/**
 * @method createdCallback
 */
app.gui.controls.TileMosaicColumnList.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this.fixedLayout = true;

	this.itemTemplate = "app-tile-mosaic-column-list-item";
	this.orientation = "horizontal";

	this.onfocus = this._onFocus;
	this.onblur = this._onBlur;

	this._left = 0;

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.TileMosaicColumnList.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();
	this.logExit();
};


/**
 * @property assets
 * @public
 */
Object.defineProperty(app.gui.controls.TileMosaicColumnList.prototype, "assets", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {

		this._data = data;
		this._populate(data);
		this.selectedItem = 0;
	}
});

/**
 * @property width
 * @public
 */
Object.defineProperty(app.gui.controls.TileMosaicColumnList.prototype, "width", {
	get: function get () {
		return this._left;
	}
});


/**
 * @method _reset
 */
app.gui.controls.TileMosaicColumnList.prototype._reset = function _reset () {
	this.logEntry();
	this.selectedItem = 0;
	if (this.selectedItem) {
		this.selectedItem.subList._reset();
	}
	this.logExit();
};


/**
 * @method _addItem
 * @param {Object} text
 */
app.gui.controls.TileMosaicColumnList.prototype._addItem = function _addItem (item) {
	//this.logEntry();
	var elem =  this.insertItem();

	elem.itemData = item;
	elem.style.left = this._left + "px";
	this._left += item[0].tileSize.width + 10;
	//this.logExit();
};


/**
 * @method populate
 */
app.gui.controls.TileMosaicColumnList.prototype._populate = function _populate (items) {
	//this.logEntry();
	this._left = 0;
	this.deleteAllItems();
	if (items) {
		items.forEach(this._addItem, this);
	}
	//this.logExit();
};



