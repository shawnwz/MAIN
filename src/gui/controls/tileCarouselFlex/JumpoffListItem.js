/**
 * @class app.gui.controls.JumpoffListItem
 */

app.gui.controls.JumpoffListItem = function JumpoffListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.JumpoffListItem, o5.gui.controls.ListItem);

app.gui.controls.JumpoffListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this.className = "jumpoff-item";

	this._data = {};

	this.logExit();
};

/**
 * @property asset
 * @public
 * @type {Object} asset
 */
Object.defineProperty(app.gui.controls.JumpoffListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;
		
		if (data) {
			this.textContent = data.displayName;
		}
	}
});

/**
 * @method _onSelect
 * @private
 * @param {Object} e
 */
app.gui.controls.JumpoffListItem.prototype._onSelect = function _onSelect() {
	this.logEntry();
	var parent = this.parentControl;
	if (parent) {
		parent.fireControlEvent("change", parent);
	}
	this.logExit();
};

