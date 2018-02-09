/**
 * @class app.gui.controls.TileMosaicColumnListItem
 */

app.gui.controls.TileMosaicColumnListItem = function TileMosaicColumnListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.TileMosaicColumnListItem, o5.gui.controls.ListItem);

/**
 * @method createdCallback
 */
app.gui.controls.TileMosaicColumnListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	//  <div class="tileColumn holder-standard" style="left:0px;" data-tile-id="TileCell-83">
	//    <div class="tile standard " data-tile-id="TileCell-7f" style=""></div>
	//    <div class="tile standard " data-tile-id="TileCell-81" style=""></div>
	//  </div>
	this.className = "tileColumn";
	this.orientation = "horizontal";

	this._tileList = this.ownerDocument.createElement("app-tile-mosaic-tile-list");
	this._tileList.dataset.orientation = "vertical";
	this.appendChild(this._tileList);

	this._data = null;

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.TileMosaicColumnListItem.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	this.logExit();
};

/**
 * @property itemData
 * @public
 * @type {Object} itemData
 */
Object.defineProperty(app.gui.controls.TileMosaicColumnListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;
		this._tileList.assets = data;

		if (data[0].tileType === "tall" || data[0].tileType === "promo" || data[0].tileType === "feature") {
			this.classList.add(data[0].tileType);
		} else if (data[0].tileType === "standard" || data[0].tileType === "square") {
			this.classList.add("holder-" + data[0].tileType);
		}
	}
});

/**
 * @property subList
 * @public
 */
Object.defineProperty(app.gui.controls.TileMosaicColumnListItem.prototype, "subList", {
	get: function get() {
		return this._tileList;
	}
});

/**
 * @method onSelect
 * @public
 */
app.gui.controls.TileMosaicColumnListItem.prototype._onSelect = function _onSelect() {
	this.logEntry();
	this.logExit();
};

/**
 * @method _onDeselect
 */
app.gui.controls.TileMosaicColumnListItem.prototype._onDeselect = function _onDeselect() {
	this.logEntry();
	this.logExit();
};

