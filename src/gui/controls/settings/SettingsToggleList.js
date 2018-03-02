/**
 * @class app.gui.controls.SettingsToggleList
 */

app.gui.controls.SettingsToggleList = function SettingsToggleList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsToggleList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 */
app.gui.controls.SettingsToggleList.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._wrapped = true;
	this._deafultIndex = 0;
	this._savedIndex = 0;
	this._visibleClass = "show";
	this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.SettingsToggleList.prototype.attachedCallback = function attachedCallback() {
    this.logEntry();
    this.superCall();
    // $util.ControlEvents.on("app-settings:ctaSettingsMenu", "ctaUndoChanges", function() {
    	// this.fireControlEvent("select", this._savedIndex);
    // });
    // $util.ControlEvents.on("app-settings:ctaSettingsMenu", "ctaResetDefaults", function() {
    	// this.fireControlEvent("select", this._deafultIndex);
    // });
    this.logExit();
};

/**
 * @method _populate
 * simply populate the DOM with all items
 */
app.gui.controls.SettingsToggleList.prototype._populate = function _populate(arr, savedIndex, deafultIndex) {
    this.logEntry();
    this.superCall(arr, savedIndex);
    this._savedIndex = savedIndex;
    this._defaultIndex = deafultIndex || 0;
    this.logExit();
};

/**
 * @method _change
 */
app.gui.controls.SettingsToggleList.prototype._change = function _change() {
	this.logEntry();
	var selectedItem = this.selectedItem;
	  //data = selectedItem ? selectedItem.itemData : null;

	if (selectedItem) {
		this.style.webkitTransform = "translate(-" + selectedItem.startPos + "px, 0px)";
	} else {
		this.style.webkitTransform = "translate(0px, 0px)";
	}
	this.logExit();
};


/**
 * @class app.gui.controls.SettingsToggleListItem
 */

app.gui.controls.SettingsToggleListItem = function SettingsToggleListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsToggleListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsToggleListItem.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._text = this.querySelector('span');
	this.logExit();
};


/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SettingsToggleListItem.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;

		if (data && data.text) { // must have at least this
			this.innerHTML = $util.Translations.translate(data.text);
			this.dataset.i18n = data.text;
		} else if (this._emptyClass) {
			this.classList.add(this._emptyClass);
		}
	}
});

