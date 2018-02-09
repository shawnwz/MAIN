/**
 * @class app.gui.controls.HomeGridCell
 */

app.gui.controls.HomeGridCell = function HomeGridCell () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HomeGridCell, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 */
app.gui.controls.HomeGridCell.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._focusClass = "focused";
	this._emptyClass = "unavailable";
	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.HomeGridCell.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;
		
		if (data) {
			this.innerHTML = $util.Translations.translate(data.name);
			this.dataset.i18n = data.name;
		} else {
			this.textContent = "";
		}
	}
});

