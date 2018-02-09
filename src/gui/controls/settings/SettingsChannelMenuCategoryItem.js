/**
 * @class app.gui.controls.SettingsChannelMenuCategoryItem
 * @extends o5.gui.controls.ListItem
 */

app.gui.controls.SettingsChannelMenuCategoryItem = function SettingsChannelMenuCategoryItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsChannelMenuCategoryItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsChannelMenuCategoryItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._focusClass = "listView-focused";
	this._selectedClass = "listView-selected";
	this._emptyClass = "unavailable";
    this._label = this.querySelector('.categoryItem');
	this.logExit();
};

/**
 * @property category
 * @public
 * @type {String} category
 */
Object.defineProperty(app.gui.controls.SettingsChannelMenuCategoryItem.prototype, "itemData", {
	get: function get() {
		return this._category;
	},
	set: function set(category) {
		this._category = $util.Translations.translate(category);
		this._label.innerHTML = $util.Translations.translate(category);
		this._label.dataset.i18n = category;
	}
});

/**
 * @method onSelect
 * @public
 */
app.gui.controls.SettingsChannelMenuCategoryItem.prototype._onSelect = function _onSelect() {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.fire("app-settings:" + this._parent.parentElement._channelList.id, "categoryChange", this._category);
	this.logExit();
};

/**
 * @method _onDeselect
 */
app.gui.controls.SettingsChannelMenuCategoryItem.prototype._onDefocus = function _onDefocus () {
    this.logEntry();
    if (this._focusClass) {
        this.classList.remove(this._focusClass);
    }
    if (this._selectedClass) {
    	this.classList.add(this._selectedClass);
    }
    this.logExit();
};


/**
 * @method _onDeselect
 */
app.gui.controls.SettingsChannelMenuCategoryItem.prototype._onfocus = function _onfocus () {
    this.logEntry();
    if (this._focusClass) {
        this.classList.add(this._focusClass);
    }
    if (this._selectedClass) {
    	this.classList.remove(this._selectedClass);
    }
    this.logExit();
};
