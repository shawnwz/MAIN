
app.views.SearchCollection = function SearchCollection() {};
o5.gui.controls.Control.registerAppControl(app.views.SearchCollection, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.SearchCollection.prototype.createdCallback = function createdCallback() {

	this.logEntry();
	this.superCall();

	this._searchCollectionTitle = this.querySelector("#searchCollectionTitle");

	$util.ControlEvents.on("app-search-collection", "fetch", function(node) {
		var title = (node && node.title) ? node.title : null;
		if (title) {
			this._searchCollectionTitle.textContent = title;
		}
		$util.ControlEvents.fire("app-search-collection:searchMosaicTiles", "fetch", node); // will reply with "searchMosaicTiles", "populated"
	}, this);
	$util.ControlEvents.on("app-search-collection", "search", function(data) {
		var title = (data && data.title) ? data.title : null,
		  //term = (data && data.field && data.title) ? encodeURIComponent(data.field + ":\"" + data.title + "\"") : null;
		  term = (data && data.title) ? data.title : null;
		if (title) {
			this._searchCollectionTitle.textContent = title;
		}
		$util.ControlEvents.fire("app-search-collection:searchMosaicTiles", "search", term); // will reply with "searchMosaicTiles", "populated"
	}, this);

	$util.ControlEvents.on("app-search-collection:searchMosaicTiles", "enter", function(selectedItem) {
		var data = (selectedItem && selectedItem.itemData) ? selectedItem.itemData : null;
		if (data) {
			if (data.isCollection === true) { // collection inside collection?
				$util.ControlEvents.fire("app-search-collection", "fetch", data);
				$util.Events.fire("app:navigate:to", "searchCollection");
			} else {
				$util.ControlEvents.fire("app-synopsis", "fetch", data);
				$util.Events.fire("app:navigate:to", "synopsis");
			}
		}
	}, this);
	$util.ControlEvents.on("app-search-collection:searchMosaicTiles", "back", function() {
		$util.ControlEvents.fire("app-search-collection:searchMosaicTiles", "clear");
		$util.Events.fire("app:navigate:back");
	}, this);
	$util.ControlEvents.on("app-search-collection:searchMosaicTiles", "change", function(pageList) {
		$util.ControlEvents.fire("app-search-collection:searchTilesScrollBar", "populate", pageList);
	}, this);
	$util.ControlEvents.on("app-search-collection:searchMosaicTiles", "populated", function(pageList) {
		$util.ControlEvents.fire("app-search-collection:searchTilesScrollBar", "populate", pageList);
		if (pageList.itemNb > 0) {
//			this.fireControlEvent("show");
		} else {
//			this.fireControlEvent("hide");
			//@hdk show dialog "nothing here!"
			this.focus();
		}
	}, this);

	this.onkeydown = this._onKeyDown;
	this.onfocus = this._onFocus;
//	this.onload = this._onLoad;
	this.onshow = this._onShow;

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.SearchCollection.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	$util.Events.fire("app:view:attached", "searchCollection");
	this.logExit();
};

/**
 * @method _onLoad
 * @private
 */
app.views.SearchCollection.prototype._onLoad = function _onLoad() {
	this.logEntry();
	this.logExit();
};


/**
 * @method _onShow
 * @private
 */
app.views.SearchCollection.prototype._onShow = function _onShow() {
	this.logEntry();
	$util.ControlEvents.fire("app-search-collection", "show");
	this.logExit();
};

/**
 * @method _onHide
 * @private
 */
app.views.SearchCollection.prototype._onHide = function _onHide() {
	this.logEntry();
	$util.ControlEvents.fire("app-search-collection", "hide");
	this.logExit();
};

/**
 * @method _onFocus
 * @private
 */
app.views.SearchCollection.prototype._onFocus = function _onFocus() {
	this.logEntry();
	$util.ControlEvents.fire("app-search-collection:searchMosaicTiles", "focus");
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.views.SearchCollection.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	switch (e.key) {
		case "Back":
			$util.Events.fire("app:navigate:back");
			e.stopImmediatePropagation();
			break;
		default:
			break;
	}
	this.logExit();
};

