/**
 * @class app.gui.controls.TileMosaicPageListItem
 */

app.gui.controls.TileMosaicPageListItem = function TileMosaicPageListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.TileMosaicPageListItem, o5.gui.controls.ListItem);

/**
 * @method createdCallback
 */
app.gui.controls.TileMosaicPageListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	//  <div id="" class="tileListDomPool">
	//    <div class="tileColumn holder-standard" style="left:0px;" data-tile-id="TileCell-83"></div>
	//    <div class="tileColumn holder-standard" style="left:282px;" data-tile-id="TileCell-89"</div>
	//    <div class="tileColumn holder-standard" style="left:564px;" data-tile-id="TileCell-8f"</div>
	//    <div class="tileColumn holder-standard" style="left:846px;" data-tile-id="TileCell-95"></div>
	//  </div>
	this.className = "tileListDomPool";
	this.orientation = "horizontal";

	this._columnList = this.ownerDocument.createElement("app-tile-mosaic-column-list");
	this._columnList.dataset.orientation = "horizontal";
	this.appendChild(this._columnList);

	this._data = null;

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.TileMosaicPageListItem.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	this.logExit();
};

/**
 * @property itemData
 * @public
 * @type {Object} itemData
 */
Object.defineProperty(app.gui.controls.TileMosaicPageListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;
		this._columnList.assets = data;
	}
});

/**
 * @property subList
 * @public
 */
Object.defineProperty(app.gui.controls.TileMosaicPageListItem.prototype, "subList", {
	get: function get() {
		return this._columnList;
	}
});

/**
 * @property selectedItem
 * @public
 */
Object.defineProperty(app.gui.controls.TileMosaicPageListItem.prototype, "selectedItem", {
	get: function get() {
		return this._columnList.selectedItem;
	}
});

/**
 * @method _onSelect
 * @public
 */
app.gui.controls.TileMosaicPageListItem.prototype._onSelect = function _onSelect() {
	this.logEntry();
	var parent = this.parentControl;
	if (parent) {
		parent.fireControlEvent("change", parent);
	}
	this.classList.add("focused");
	this.logExit();
};

/**
 * @method _onDeselect
 */
app.gui.controls.TileMosaicPageListItem.prototype._onDeselect = function _onDeselect() {
	this.logEntry();
	this.classList.remove("focused");
	this.logExit();
};

