
/**
 * @class app.gui.controls.SettingsCategoryList
 * @extends app.gui.controls.HtmlFocusList
 * @author spandey
 */
app.gui.controls.SettingsWifiMenuList = function SettingsWifiMenuList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsWifiMenuList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsWifiMenuList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._config = this.dataset.config || null;
    this._configObj = null;
    this.orientation = "vertical";
    this.onControlEvent("defocus", this._defocus);
	this.onControlEvent("focussed", this._focussed);
	this.logExit();
};

/**
 * @method _categorychoose
 * @private
*/
app.gui.controls.SettingsWifiMenuList.prototype._defocus = function _defocus() {
	this.logEntry();
    if (this._selectedItem) {
        this._selectedItem._onDefocus();
     }
     
	this.logExit();
};


/**
 * @method _categorychoose
 * @private
*/
app.gui.controls.SettingsWifiMenuList.prototype._focussed = function _focussed() {
	this.logEntry();
    if (this._selectedItem) {
        this._selectedItem._onfocus();
     }
	this.logExit();
};

/**
 * @method _populate
 * @private
 */
app.gui.controls.SettingsWifiMenuList.prototype._populate = function _populate(categoryData) {
  this.logEntry();
  this.superCall(categoryData);
  this.logExit();
};

/**
 * @class app.gui.controls.SettingsWifiCell
 */

app.gui.controls.SettingsWifiMenuListItem = function SettingsWifiMenuListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsWifiMenuListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 */
app.gui.controls.SettingsWifiMenuListItem.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._focusClass = "listView-focused";
	this._selectedClass = "listView-selected";
	this._emptyClass = "unavailable";
	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SettingsWifiMenuListItem.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;

		if (data) {
			this.innerHTML = $util.Translations.translate(data.text);
			this.dataset.i18n = data.text;
		} else {
			this.textContent = "";
		}
	}
});

/**
 * @method _onDeselect
 */
app.gui.controls.SettingsWifiMenuListItem.prototype._onDefocus = function _onDefocus () {
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
app.gui.controls.SettingsWifiMenuListItem.prototype._onfocus = function _onfocus () {
    this.logEntry();
    if (this._focusClass) {
        this.classList.add(this._focusClass);
    }
    if (this._selectedClass) {
    	this.classList.remove(this._selectedClass);
    }
    this.logExit();
};

/**
 * @method onSelect
 * @public
 */
app.gui.controls.SettingsWifiMenuListItem.prototype._onSelect = function _onSelect() {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.fire("app-settings:wifiScreen", "wifiMenuOptionChange", this._data.id);
	this.logExit();
};
