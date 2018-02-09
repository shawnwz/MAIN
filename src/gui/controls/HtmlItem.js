/**
 * @class app.gui.controls.HtmlItem
 */
app.gui.controls.HtmlItem = function HtmlItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlItem);

/**
 * @method createdCallback
 */
app.gui.controls.HtmlItem.prototype.createdCallback = function createdCallback() {
	this.superCall();

	this._data = null;

	this._hiddenClass = "";
	this._visibleClass = "";
	this._emptyClass = this.dataset.emptyClass || "";
	this._isVisible = undefined; // unknown
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlItem.prototype.attachedCallback = function attachedCallback() {
	if (this.id) {
		this.onControlEvent("fetch", this._fetch);
		this.onControlEvent("clear", this._clear);
		this.onControlEvent("reset", this._reset);
		this.onControlEvent("hide", this._hide);
		this.onControlEvent("show", this._show);
		this.onControlEvent("toggle", this._toggle);
		// eslint-disable-next-line no-unused-vars
		this.onControlEvent("populate", function(data, index, event) {
			var args = [].slice.call(arguments);
			this._populate.apply(this, args);
			if (this.id) {
				this.fireControlEvent("populated", this, event);
			}
		});
	}
};

/**
 * @method detachedCallback
 */
app.gui.controls.HtmlItem.prototype.detachedCallback = function detachedCallback() {
	if (this.id) {
		this.fireControlEvent("detached");
	}
};

/**
 * @method _hide
 */
app.gui.controls.HtmlItem.prototype._hide = function _hide() {
	if (this._isVisible === false) {
		// nothing to do
	} else if (this._hiddenClass) {
		this.classList.add(this._hiddenClass);
	} else if (this._visibleClass) {
		this.classList.remove(this._visibleClass);
	} else {
		this.style.display = "none";
	}
	this._isVisible = false;
	if (this.id) {
		this.fireControlEvent("hidden", this);
	}
};

/**
 * @method _show
 */
app.gui.controls.HtmlItem.prototype._show = function _show() {
	if (this._isVisible === true) {
		// nothing to do
	} else if (this._hiddenClass) {
		this.classList.remove(this._hiddenClass);
	} else if (this._visibleClass) {
		this.classList.add(this._visibleClass);
	} else {
		this.style.display = "block";
	}
	this._isVisible = true;
	if (this.id) {
		this.fireControlEvent("visible", this);
	}
};

/**
 * @method _toggle
 */
app.gui.controls.HtmlItem.prototype._toggle = function _toggle() {
	this.visible = !this.visible;
};

/**
 * @property itemTemplate
 */
//o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(app.gui.controls.HtmlItem.prototype, 'itemTemplate',	{
//	template: app.gui.controls.HtmlItem,
//	querySelector: ':scope template'
//});

/**
 * @method newItem
 */
app.gui.controls.HtmlItem.prototype.newItem = function newItem() {
	var item = null;
	if (this._itemTemplateResolved) { // embedded template
		item = this._itemTemplateResolved.cloneNode(true);
	} else { // otherwise just a div
		item = this.ownerDocument.createElement("div");
	}
	return item;
};

/**
 * @property visible
 */
Object.defineProperty(app.gui.controls.HtmlItem.prototype, "visible", {
	get: function get() {
		if (this._isVisible !== undefined) {
			return this._isVisible; // already known
		}
		if (this._hiddenClass) {
			this._isVisible = !this.classList.contains(this._hiddenClass);
		} else if (this._visibleClass) {
			this._isVisible = this.classList.contains(this._visibleClass);
		} else {
			this._isVisible = (this.style.display !== "none" && this.style.visibility !== 'hidden');
		}
		if (this._isVisible === undefined) { // slow?
			var display = window.getComputedStyle(this).display,
				visibility = window.getComputedStyle(this).visibility;
			this._isVisible = (display !== "none" && visibility !== 'hidden');
		}
		return this._isVisible;
	},
	set: function set(val) {
		if (val === true) {
			this._show();
		} else {
			this._hide();
		}
	}
});

/**
 * @method _reset
 */
app.gui.controls.HtmlItem.prototype._reset = function _reset() {
};

/**
 * @method _clear
 */
app.gui.controls.HtmlItem.prototype._clear = function _clear() {
	this.innerHTML = "";
};

/**
 * @method _fetch
 */
app.gui.controls.HtmlItem.prototype._fetch = function _fetch() {
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.HtmlItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;

		if (data) {
			this.textContent = data;
		} else if (this._emptyClass) {
			this.classList.add(this._emptyClass);
		}
	}
});

/**
 * @method emptyClass
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(app.gui.controls.HtmlItem.prototype, 'emptyClass',	{
	get: function () {
		return this._emptyClass;
	},
	set: function (val) {
		this._emptyClass = val;
	},
	toAttribute: function (val) {
		return val ? val.localName : '';
	},
	fromAttribute: function (val) {
		return val;
	}
});

/**
 * @method _populate
 */
app.gui.controls.HtmlItem.prototype._populate = function _populate(item) {
	this.itemData = item;
};

