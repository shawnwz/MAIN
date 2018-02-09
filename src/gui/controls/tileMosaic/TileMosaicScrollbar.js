/**
 * @class app.gui.controls.TileMosaicScrollbar
 */

app.gui.controls.TileMosaicScrollbar = function TileMosaicScrollbar() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.TileMosaicScrollbar);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.TileMosaicScrollbar.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	/*
			<div id="homeTilesScrollBar" class="scrollbar-h">
				<div class="scrollBarStorageFill"></div>
				<div class="scrollBarItemFill"></div>
			</div>
	*/
	this.id = "homeTilesScrollBar";
	this.className = "scrollbar-h";

	this._storageFill = this.ownerDocument.createElement("div");
	this._storageFill.className = "scrollBarStorageFill";
	this.appendChild(this._storageFill);

	this._itemFill = this.ownerDocument.createElement("div");
	this._itemFill.className = "scrollBarItemFill";
	this.appendChild(this._itemFill);

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.TileMosaicScrollbar.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();

	this.onControlEvent("show", this._show);
	this.onControlEvent("hide", this._hide);
	this.onControlEvent("populate", this._update);

	this.logExit();
};

/*
 * @method _show
 * @private
 */
app.gui.controls.TileMosaicScrollbar.prototype._show = function _show() {
	this.logEntry();
	if (this._timer !== null) {
		clearTimeout(this._timer);
	}
	this._timer = setTimeout(this._hide.bind(this), $config.getConfigValue("settings.home.scrollbar.timeout"));
	this.classList.add('show');
	this.logExit();
};

/*
 * @method _hide
 * @private
 */
app.gui.controls.TileMosaicScrollbar.prototype._hide = function _hide() {
	this.logEntry();
	clearTimeout(this._timer);
	this._timer = null;
	this.classList.remove('show');
	this.logExit();
};

/**
 * @method populate
 * @param {Object}[] texts
 */
app.gui.controls.TileMosaicScrollbar.prototype._update = function _update(pageList) {
	this.logEntry();
	var pagesNb = pageList.pageNb,
		page = pageList.currentPage,
		size = (pagesNb > 0) ? Math.floor(this.clientWidth / pagesNb) : 0;

	if (pagesNb > 1) {
		this.fireControlEvent("show");
	} else {
		this.fireControlEvent("hide");
	}

	this._itemFill.style.width = size + "px";
	this._itemFill.style.left = (size * page) + "px";

	this.logExit();
};

