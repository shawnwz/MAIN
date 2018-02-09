/**
 * @class app.gui.controls.SynopsisCastTableCell
 */

app.gui.controls.SynopsisCastTableCell = function SynopsisCastTableCell() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisCastTableCell, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 */
app.gui.controls.SynopsisCastTableCell.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	var tmpl = document.getElementById("synopsisCastCellTemplate");
	this.appendChild(tmpl.content.cloneNode(true));

  this._name = this.querySelector('.name');
  this._count = this.querySelector('.count');

	this._focusClass = "focused";
	
	this.logExit();
};

/**
 * @property itemData
 * @public
 */
Object.defineProperty(app.gui.controls.SynopsisCastTableCell.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;

		if (data) {
			this._name.textContent = data;
			this._count.textContent = "";
		}
	}
});


