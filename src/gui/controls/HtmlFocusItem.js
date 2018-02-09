/**
 * @class app.gui.controls.HtmlFocusItem
 */
app.gui.controls.HtmlFocusItem = function HtmlFocusItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlFocusItem, app.gui.controls.HtmlItem);

/**
 * @method createdCallback
 */
app.gui.controls.HtmlFocusItem.prototype.createdCallback = function createdCallback () {
//	this.logEntry();
	this.superCall();

	this.tabIndex = -1;
	this._isFocused = false;

	this._focusClass = this.dataset.focusClass || "";
	this._lastElem = null; // last focused element

	this.onfocus = this._onFocus;
	this.onblur = this._onBlur;
	this.onkeydown = this._onKeyDown;

//	this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlFocusItem.prototype.attachedCallback = function attachedCallback () {
//	this.logEntry();
	this.superCall();
	if (this.id) {
		this.onControlEvent("focus", this._focus);
		this.onControlEvent("key:down", this._onKeyDown);
	}
//	this.logExit();
};

/**
 * @property focused
 */
Object.defineProperty(app.gui.controls.HtmlFocusItem.prototype, "focused", {
	get: function get () {
		return this._isFocused;
	}
});

/**
 * @method _focus
 */
app.gui.controls.HtmlFocusItem.prototype._focus = function _focus () {
	this.logEntry();
	this._lastElem = document.activeElement;
	this.focus();
	this.logExit();
};

/**
 * @method focusClass
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(app.gui.controls.HtmlFocusItem.prototype, 'focusClass',	{
	get: function () {
		return this._focusClass;
	},
	set: function (val) {
		this._focusClass = val;
	},
	toAttribute: function (val) {
		return val ? val.localName : '';
	},
	fromAttribute: function (val) {
		return val;
	}
});

/**
 * @method _onFocus
 */
app.gui.controls.HtmlFocusItem.prototype._onFocus = function _onFocus () {
	this.logEntry();
	this._isFocused = true;
	this.setAttribute("selected", "");
	if (this._focusClass) {
		this.classList.add(this._focusClass);
	}
	this.logExit();
};

/**
 * @method _onBlur
 */
app.gui.controls.HtmlFocusItem.prototype._onBlur = function _onBlur () {
	this.logEntry();
	this._isFocused = false;
	this.removeAttribute("selected");
	if (this._focusClass) {
		this.classList.remove(this._focusClass);
	}
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.HtmlFocusItem.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	switch (e.key) {
		case "Back":
			this.fireControlEvent("back", this);
			e.stopImmediatePropagation();
			break;
		case "ArrowDown":
			this.fireControlEvent("exit:down", this);
			e.stopImmediatePropagation();
			break;
		case "ArrowUp":
			this.fireControlEvent("exit:up", this);
			e.stopImmediatePropagation();
			break;
		case "ArrowLeft":
			this.fireControlEvent("exit:left", this);
			e.stopImmediatePropagation();
			break;
		case "ArrowRight":
			this.fireControlEvent("exit:right", this);
			e.stopImmediatePropagation();
			break;
		case "Ok":
		case "Enter":
			this.fireControlEvent("enter", this);
			e.stopImmediatePropagation();
			break;
		default:
			break;
	}
	this.logExit();
};

