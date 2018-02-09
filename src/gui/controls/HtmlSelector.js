/**
 * @class app.gui.controls.HtmlSelector
 */
app.gui.controls.HtmlSelector = function HtmlSelector () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlSelector, app.gui.controls.HtmlItem);

/**
 * @method createdCallback
 */
app.gui.controls.HtmlSelector.prototype.createdCallback = function createdCallback () {
	this.superCall();
	var children = this.children,
		i, len = children.length,
		child, selector;

	// private variables
	this._elems = []; // the DOM elements
	this._selectedItem = undefined;
	this._unique = false;

	for (i = 0; i < len; i++) {
		child = children[i];
		selector = child.dataset.selector;
		if (selector) {
			this._elems.push(child);
		}
	}

	this._itemNb = this._elems.length; // total number of elements in the list
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlSelector.prototype.attachedCallback = function attachedCallback () {
	if (this.id) {
		this.onControlEvent("select", this._select);
		// eslint-disable-next-line no-unused-vars
		this.onControlEvent("forward", function (eventName) { // forward given message to the selected element
			if (this._selectedItem) {
				var args = [].slice.call(arguments);
				this._selectedItem.fireControlEvent.apply(this._selectedItem, args);
			}
		});
//		this.onControlEvent("next", this._next);
//		this.onControlEvent("prevous", this._prevous);

//		var i, len = this._elems.length;
//		for (i=0; i<len; i++) {
//			this._elems[i].fireControlEvent("hide");
//		}
//
//		if (this.dataset.default) {
//			this.fireControlEvent("select", this.dataset.default);
//		}
	}
};

/**
 * @method _select
 */
app.gui.controls.HtmlSelector.prototype._select = function _select (selector) {
	var i = -1, elem,
		id = selector.startsWith("#") ? selector.substring(1) : null;

	if (typeof selector === "string") {
		// eslint-disable-next-line no-shadow
		i = this._elems.findIndex(function (elem) {
			return (id && elem.id === id) || (elem.dataset.selector === selector);
		});
	} else if (typeof selector === "number") {
		i = selector;
	}

	if (i > -1) {
		elem = this._elems[i] ? this._elems[i] : null;
		if (elem) {
			this.selectedItem = i;
		}
	}
};

/**
 * @method _next
 */
app.gui.controls.HtmlSelector.prototype._next = function _next () {
};

/**
 * @method _prevous
 */
app.gui.controls.HtmlSelector.prototype._prevous = function _prevous () {
};

/**
 * Enables or disables circular navigation of the list items in an infinite loop.
 *
 *     <html-selector data-unique></html-selector>
 *
 * @property {Boolean} [cyclic=false]
 */
o5.gui.controls.Control.defineBooleanPropertyWithDataAttribute(app.gui.controls.HtmlSelector.prototype, 'unique', {
	get: function () {
		return this._unique;
	},
	set: function (val) {
		this._unique = val;
		if (this._unique) {
			this.setAttribute('data-unique', '');
		} else {
			this.removeAttribute('data-unique');
		}
	}
});

/**
 * @property selectedItem
 */
Object.defineProperty(app.gui.controls.HtmlSelector.prototype, "selectedItem", {
	get: function get () {
		return this._selectedItem;
	},
	set: function set (index) {
		var elem = this._elems[index] ? this._elems[index] : null;

		if (elem && this._selectedItem !== elem) {
			if (this._unique && this._selectedItem) { // unique: always hide the current selected one
				this._selectedItem.fireControlEvent("hide");
			}
			this._selectedItem = elem;
			this._selectedItem.fireControlEvent("show");
		}
	}
});
