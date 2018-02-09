/**
 * @class app.gui.controls.HomeBreadcrumb
 */

app.gui.controls.HomeBreadcrumb = function HomeBreadcrumb() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HomeBreadcrumb);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.HomeBreadcrumb.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	/*
    <!-- #homeNavBreadcrumb: class helpers [showArrow]-->
    <div id="homeNavBreadcrumb" data-menu-breadcrumb="true" class="">
      <div id="homeNavBreadcrumbArrow"></div>
      <div id="homeNavBreadcrumbText" data-menu-breadcrumb-text="true"></div>
    </div>
	*/
	var div = this.ownerDocument.createElement("div");
	div.id = "homeNavBreadcrumbArrow";

	this._text = this.ownerDocument.createElement("div");
	this._text.id = "homeNavBreadcrumbText";
	this._text.dataset.menuBreadcrumbText = "true";

	this.appendChild(div);
	this.appendChild(this._text);

	this.onControlEvent("show", this._show);
	this.onControlEvent("hide", this._hide);
	this.onControlEvent("populate", this._populate);

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.HomeBreadcrumb.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	this.logExit();
};

/**
 * @method _show
 * @private
 */
app.gui.controls.HomeBreadcrumb.prototype._show = function _show() {
	this.logEntry();
	this.classList.add("showArrow");
	this.logExit();
};

/**
 * @method _hide
 * @private
 */
app.gui.controls.HomeBreadcrumb.prototype._hide = function _hide() {
	this.logEntry();
	this._text.textContent = "";
	this.classList.remove("showArrow");
	this.logExit();
};

/**
 * @method _populate
 * @private
 */
app.gui.controls.HomeBreadcrumb.prototype._populate = function _populate(text) {
	this.logEntry();
	this._text.textContent = text;
	this.logExit();
};
