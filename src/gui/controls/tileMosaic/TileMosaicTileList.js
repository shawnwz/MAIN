/**
 * @class app.gui.controls.TileMosaicTileList
 */

app.gui.controls.TileMosaicTileList = function TileMosaicTileList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.TileMosaicTileList, o5.gui.controls.List);

/**
 * @method createdCallback
 */
app.gui.controls.TileMosaicTileList.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this.fixedLayout = true;

	this.itemTemplate = "app-tile-mosaic-tile-list-item";
	this.orientation = "vertical";

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.TileMosaicTileList.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();
	this.logExit();
};


/**
 * @property itemData
 * @public
 * @type {Object} itemData
 */
Object.defineProperty(app.gui.controls.TileMosaicTileList.prototype, "assets", {
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
 * @method _reset
 */
app.gui.controls.TileMosaicTileList.prototype._reset = function _reset () {
	this.logEntry();
	this.selectedItem = 0; // first tile
	this.logExit();
};

/**
 * @method _addItem
 * @param {Object} text
 */
app.gui.controls.TileMosaicTileList.prototype._addItem = function _addItem (item) {
	//this.logEntry();
	var elem =  this.insertItem();

	elem.itemData = item;
	//this.logExit();
};

/**
 * @method populate
 */
app.gui.controls.TileMosaicTileList.prototype._populate = function _populate (items) {
	//this.logEntry();
	this.deleteAllItems();
	if (items) {
		items.forEach(this._addItem, this);
	}
	//this.logExit();
};


