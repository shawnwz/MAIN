/**
 * @class app.gui.controls.TileMosaicPageList
 */

app.gui.controls.TileMosaicPageList = function TileMosaicPageList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.TileMosaicPageList, o5.gui.controls.List);

/**
 * @method createdCallback
 */
app.gui.controls.TileMosaicPageList.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this.fixedLayout = true;

	//	<div id="homeMosaicTiles" class="tileCont" data-oxy-anim="true" style="display: block;transform: translate3d(-2800px, 0px, 0px);">
	//		<div class="tileListDomPool"></div>
	//		<div class="tileListDomPool"></div>
	//		<div class="tileListDomPool"></div>
	//		<div class="tileListDomPool"></div>
	//	</div>
	this.itemTemplate = "app-tile-mosaic-page-list-item";
	this.className = "tileCont";
	this.orientation = "horizontal";

	this.onfocus = this._onFocus;
	this.onblur = this._onBlur;

	this._PAGESIZE = { "width": 1216, "height": 315 }; // fixed value
	this._left = 0;
	this._view = null;
	this._nodeId = null;
	this._itemNb = 0;
	this._maxPages = (this.dataset.maxPages ? this.dataset.maxPages : 0); // zero is unlimited

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.TileMosaicPageList.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();

	this.onControlEvent("focus", this.focus);
	this.onControlEvent("reset", this._reset);
	this.onControlEvent("populate", this._populate); // populate assets list
	this.onControlEvent("fetch", this._fetch); // fetch the assets of a node and populate
	this.onControlEvent("search", this._search); // search a term and populate
	this.onControlEvent("clear", this._clear);
	this.onControlEvent("change", this._pageChange); // new page selected
	this.onControlEvent("hide", this._hide);
	this.onControlEvent("show", this._show);
	this.onControlEvent("select", this._select);

	this.logExit();
};

/**
 * @method _onFocus
 */
app.gui.controls.TileMosaicPageList.prototype._onFocus = function _onFocus () {
	this.logEntry();
	this.setAttribute("selected", "");
	this.fireControlEvent("change", this);
	this.logExit();
};

/**
 * @method _onBlur
 */
app.gui.controls.TileMosaicPageList.prototype._onBlur = function _onBlur () {
	this.logEntry();
	this.removeAttribute("selected");
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.TileMosaicPageList.prototype._hide = function _hide () {
	this.logEntry();
	this.style.display = "none";
	this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.TileMosaicPageList.prototype._show = function _show () {
	this.logEntry();
	this.style.display = "block";
	this.logExit();
};

/**
 * @method _select
 */
app.gui.controls.TileMosaicPageList.prototype._select = function _select (index) {
	this.logEntry();
	console.log("TileMosaicPageList._select", index); //@hdk to do!!
	this.logExit();
};

/**
 * @method selectPrevious
 * @param {Boolean} repeat - key repeat status
 */
app.gui.controls.TileMosaicPageList.prototype.selectPrevious = function selectPrevious (repeat) {
	this.logEntry();
	this._skipAnimation = repeat;
	var page = (this.selectedItem) ? this.selectedItem && this.selectedItem : null,
		column = (page && page.subList.selectedItem) ? page.subList.selectedItem : null,
		cellIndex = (column && column.subList.selectedItem) ? column.subList.selectedItem.itemIndex : 0,
		handled = this.selectedItem.subList.selectPrevious(repeat); // try previous column...

	if (!handled) { // ... no previous column: previous page
		handled = this.superCall(repeat);
	}

	if (handled === true) { // when change page or columns, keep tile index the same
		column = this.selectedItem.subList.selectedItem;
		if (column) {
			column.subList.selectedItem = cellIndex;
		}
	}

	this.logExit();
	return handled;
};

/**
 * @method selectNext
 * @param {Boolean} repeat - key repeat status
 */
app.gui.controls.TileMosaicPageList.prototype.selectNext = function selectNext (repeat) {
	this.logEntry();
	this._skipAnimation = repeat;
	var page = (this.selectedItem) ? this.selectedItem && this.selectedItem : null,
		column = (page && page.subList.selectedItem) ? page.subList.selectedItem : null,
		cellIndex = (column && column.subList.selectedItem) ? column.subList.selectedItem.itemIndex : 0,
		handled = this.selectedItem.subList.selectNext(repeat); // try next column...

	if (!handled) { // ... no next column: next page
		handled = this.superCall(repeat);
	}

	if (handled === true) { // when change page or columns, keep tile index the same
		column = this.selectedItem.subList.selectedItem;
		if (column) {
			column.subList.selectedItem = cellIndex;
		}
	}

	this.logExit();
	return handled;
};

/**
 * @property currentPage
 * @public
 */
Object.defineProperty(app.gui.controls.TileMosaicPageList.prototype, "currentPage", {
	get: function get () {
		var page = (this.selectedItem && this.selectedItem.itemIndex > -1) ? this.selectedItem.itemIndex : 0;

		return page;
	}
});

/**
 * @property itemNb - number of pages in the mosaic
 * @public
 */
Object.defineProperty(app.gui.controls.TileMosaicPageList.prototype, "pageNb", {
	get: function get () {
		return this._container.childElementCount;
	}
});

/**
 * @property itemNb - number of assets in teh mosaic
 * @public
 */
Object.defineProperty(app.gui.controls.TileMosaicPageList.prototype, "itemNb", {
	get: function get () {
		return this._itemNb;
	}
});

/**
 * @property itemNb - number of assets in teh mosaic
 * @public
 */
Object.defineProperty(app.gui.controls.TileMosaicPageList.prototype, "selectedTile", {
	get: function get () {
		var page = (this.selectedItem) ? this.selectedItem && this.selectedItem : null,
			column = (page && page.subList.selectedItem) ? page.subList.selectedItem : null,
			cell = (column && column.subList.selectedItem) ? column.subList.selectedItem : null;

		return cell;
	}
});

/**
 * @method _reset
 */
app.gui.controls.TileMosaicPageList.prototype._reset = function _reset () {
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
app.gui.controls.TileMosaicPageList.prototype._addItem = function _addItem (item) {
	//this.logEntry();
	var elem = this.insertItem();

	elem.itemData = item;
	elem.style.left = this._left + "px";
	this._left += elem.subList.width;
	//this.logExit();
};

/**
 * @method _sort
 * Sort the tiles based on size
 */
app.gui.controls.TileMosaicPageList.prototype._sort = function _sort (items) {
	this.logEntry();

	var i, len, nb = 0, tmp;

	for (i = 0, len = items.length; i < (len - 1); i++) {
		if (items[i].tileSize.perColumn === 1) {
			nb = 0; // now fullheight
		} else {
			nb++;
			if ((nb % items[i].tileSize.perColumn) !== 0) { // the next one must be same size
				if (items[i + 1].tileSize.perColumn !== items[i].tileSize.perColumn) { // next one is same size: swap them
					this.logDebug("swap " + i + " and " + (i + 1));
					tmp = items[i];
					items[i] = items[i + 1];
					items[i + 1] = tmp;
					nb = 0; // now fullheight
				}
			}
		}
	}
	this.logExit();
};

/**
 * @method _fetch
 * @private
 */
app.gui.controls.TileMosaicPageList.prototype._fetch = function _fetch (node) {
	this.logEntry();
	var me = this;

	if (this._nodeId === null || this._nodeId !== node._firstLeftNode.id) {
		// request assets of the first-left-node, these are the assets we want to fetch and display
		$service.MDS.Node.assets(node._firstLeftNode).then(this._populate.bind(this)
		).then(function () {
			me._nodeId = node._firstLeftNode.id;
		});
	} else {
		this.logDebug("Same node, dont fetch again [" + this._nodeId + "]");
	}
	this.logExit();
};

/**
 * @method _search
 */
app.gui.controls.TileMosaicPageList.prototype._search = function _search (term) {
	this.logEntry();
	this.fireControlEvent("clear");
	$service.DISCO.Search.search(term).then(this._populate.bind(this));
	this.logExit();
};

/**
 * @method _clear
 */
app.gui.controls.TileMosaicPageList.prototype._clear = function _clear () {
	this.logEntry();
	this.deleteAllItems();
	this._itemNb = 0;
	this._nodeId = null;
	this.logExit();
};

/**
 * @method populate
 */
app.gui.controls.TileMosaicPageList.prototype._populate = function _populate (items) {
	//this.logEntry();

	var width = 0, i, len, chunk,
		pagesNb = 0,
		tiles = []; // holds all culumns of tiles for one page

	this._clear();
	this._left = 0;
	this._itemNb = items.length;

	if (this._itemNb > 0) {

		this._sort(items);

		// split items in pages and columns
		for (i = 0, len = this._itemNb; i < len; i += chunk) {
			chunk = items[i].tileSize.perColumn;
			width += items[i].tileSize.width;

			if (width > this._PAGESIZE.width) { // column for next page
				this._addItem(tiles);
				width = items[i].tileSize.width;
				tiles = [];
				pagesNb++;

				if (this._maxPages !== 0 && pagesNb >= this._maxPages) { // max number of pages reached
					break;
				}
			}

			tiles.push(items.slice(i, i + chunk)); // push another column

			if (i + chunk >= len) { // push remainder
				this._addItem(tiles);
				break;
			}
		}
		this.selectedItem = 0; // select first page
	}

	this.fireControlEvent("populated", this);

	//this.logExit();
};

/**
 * @method _pageChange
 */
app.gui.controls.TileMosaicPageList.prototype._pageChange = function _pageChange () {
	this.logEntry();
	//@hdk this is not correct, we need to move over the previous page's width, except when we select/deselect the last one
	//@hdk and navigating left needs to be the same...
	//@hdk using selectedItem.style.left+" for now, but this is not same as iQ3 on the last page!
	if (this.selectedItem) {
		this.style.webkitTransform = "translate3d(-" + this.selectedItem.style.left + ", 0px, 0px)";
	}
	this.logExit();
};

/**
 * @method _onKeyDown
 * @param {Object} e
 */
app.gui.controls.TileMosaicPageList.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	var handled = false,
		page,
		column,
		tileList;

	switch (e.key) {
		case "ArrowUp":
			page = (this.selectedItem) ? this.selectedItem && this.selectedItem : null;
			column = (page && page.subList.selectedItem) ? page.subList.selectedItem : null;
			tileList = (column && column.subList) ? column.subList : null;
			if (tileList) {
				if (tileList.selectPrevious(e.repeat)) {
					this.fireControlEvent("change", this);
				} else { // no previous tile
					this.fireControlEvent("exit:up", this.selectedTile);
				}
			}
			handled = true;
			break;
		case "ArrowDown":
			page = (this.selectedItem) ? this.selectedItem && this.selectedItem : null;
			column = (page && page.subList.selectedItem) ? page.subList.selectedItem : null;
			tileList = (column && column.subList) ? column.subList : null;

			if (tileList) {
				if (tileList.selectNext(e.repeat)) {
					this.fireControlEvent("change", this);
				} else { // no next tile
					this.fireControlEvent("exit:down", this.selectedTile);
				}
			}
			handled = true;
			break;
		case "ArrowLeft":
			if (this.selectPrevious(e.repeat)) {
				this.fireControlEvent("change", this);
			} else {
				this.fireControlEvent("exit:left", this.selectedTile);
			}
			handled = true;
			break;
		case "ArrowRight":
			if (this.selectNext(e.repeat)) {
				this.fireControlEvent("change", this);
			} else {
				this.fireControlEvent("exit:right", this.selectedTile);
			}
			handled = true;
			break;
		case "Back":
			this.fireControlEvent("back", this);
			handled = true;
			break;
		case "Ok":
		case "Enter":
		case "Info":
			this.fireControlEvent("enter", this.selectedTile);
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
