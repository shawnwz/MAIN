/**
 * MenuItem used by Menu Controls that expect an update() function
 *
 * @class app.gui.controls.MenuItem
 * @extends o5.gui.controls.Control
 */

app.gui.controls.MenuItem = function MenuItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.MenuItem, o5.gui.controls.MenuItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.MenuItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method update
 * @public
 * @param {Object} data
 */
app.gui.controls.MenuItem.prototype.update = function update(data) {
	this.logEntry();
	if (data) {
		this.textContent = data.text;
		this.classList.remove("hidden");
	} else {
		this.textContent = "";
		this.classList.add("hidden");
	}
	this.logExit();
};

/**
 * @method highlight
 * @public
 */
app.gui.controls.MenuItem.prototype.highlight = function highlight() {
	this.logEntry();
	this.setAttribute("selected", "");
	this.logExit();
};

/**
 * @method unHighlight
 * @public
 */
app.gui.controls.MenuItem.prototype.unHighlight = function unHighlight() {
	this.logEntry();
	this.removeAttribute("selected");
	this.logExit();
};
