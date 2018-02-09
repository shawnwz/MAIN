/**
 * @class app.gui.controls.SettingsCategoryList
 * @extends o5.gui.controls.List
 */

app.gui.controls.SettingsCategoryList = function SettingsCategoryList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsCategoryList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsCategoryList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
    this.orientation = "vertical";
	this.onControlEvent("defocus", this._defocus);
	this.onControlEvent("focussed", this._focussed);
	this.logExit();
};

/**
 * @method _categorychoose
 * @private
*/
app.gui.controls.SettingsCategoryList.prototype._defocus = function _defocus() {
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
app.gui.controls.SettingsCategoryList.prototype._focussed = function _focussed() {
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
app.gui.controls.SettingsCategoryList.prototype._populate = function _populate(categoryData) {
  this.logEntry();
  this.superCall(categoryData);
  this.fireControlEvent("defocus");
  this.logExit();
};


/**
 * @property categoryList
 * @public
 * @type {String} category
 */
Object.defineProperty(app.gui.controls.SettingsCategoryList.prototype, "categoryList", {
// TODO: What functionality is needed here?
	get: function get() {
		return this._categoryList;
	},
	set: function set() {
//		this._category = category;
//		this.innerText = category;
	}
});

