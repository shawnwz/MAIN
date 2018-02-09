/**
 * @class app.gui.controls.PortalBreadcrumb
 */

app.gui.controls.PortalBreadcrumb = function PortalBreadcrumb() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.PortalBreadcrumb);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.PortalBreadcrumb.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this.onControlEvent("show", this._show, this);
	this.onControlEvent("hide", this._hide, this);
	this.onControlEvent("populate", this._populate, this);

	this._parent = document.querySelector('#homeMenu');

	this.logExit();
};

/**
 * @method _show
 * @private
 */
app.gui.controls.PortalBreadcrumb.prototype._show = function _show() {
	this.logEntry();
	this.classList.add("show");
	this._parent.classList.add("breadcrumb");
	this.logExit();
};

/**
 * @method _hide
 * @private
 */
app.gui.controls.PortalBreadcrumb.prototype._hide = function _hide() {
	this.logEntry();
	this.innerText = "";
	this.classList.remove("show");
	this._parent.classList.remove("breadcrumb");
	this.logExit();
};

/**
 * @method _populate
 * @private
 */
app.gui.controls.PortalBreadcrumb.prototype._populate = function _populate(text) {
	this.logEntry();
	this.innerText = text;
	this.logExit();
};
