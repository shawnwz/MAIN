/**
 * @class app.gui.controls.SettingsConfigMenuRow
 * @extends o5.gui.controls.Control
 */

app.gui.controls.SettingsConfigMenuRow = function SettingsConfigMenuRow() {
	this._isVisible = true;
};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsConfigMenuRow);

/**
 * @property visible
 * @public
 * @type {Boolean}
 */
Object.defineProperty(app.gui.controls.SettingsConfigMenuRow.prototype, "visible", {
	get: function get() {
		return this._isVisible;
	},
	set: function set(visible) {
		this._isVisible = Boolean(visible);
		if (this._isVisible) {
			this.classList.remove("hidden");
		} else {
			this.classList.add("hidden");
		}
	}
});

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsConfigMenuRow.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._initProperties();
	this._settingText = this.ownerDocument.createElement("div");
	this._settingText.className = "settingsConfigRowText";
	this._settingComponents = this.ownerDocument.createElement("div");
	this._settingComponents.className = "settingsConfigRowComponents";
	this.appendChild(this._settingText);
	this.appendChild(this._settingComponents);
	this._createSettingComponents();
	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.SettingsConfigMenuRow.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	this.logExit();
};

/**
 * @method _initProperties
 * @private
 */
app.gui.controls.SettingsConfigMenuRow.prototype._initProperties = function _initProperties() {
	this.logEntry();
	this.tabIndex = -1;
	this.onkeydown = this._onKeyDown;
	this.onfocus = this._onFocus;
	this.onblur = this._onBlur;
	this.logExit();
};

/**
 * @method _createSettingComponents
 * @private
 */
app.gui.controls.SettingsConfigMenuRow.prototype._createSettingComponents = function _createSettingComponents() {
	this.logEntry();
	var componentsToCreate = [
		{
			name : "app-settings-text",
			class: "settingsText"
		},
		{
			name : "app-settings-toggle",
			class: "settingsToggle"
		}
	];
	componentsToCreate.forEach(this._createSettingComponent, this);
	this.logExit();
};

/**
 * @method _createSettingComponent
 * @private
 * @param {Object} componentToCreate
 */
app.gui.controls.SettingsConfigMenuRow.prototype._createSettingComponent = function _createSettingComponent(componentToCreate) {
	this.logEntry();
	var component = this.ownerDocument.createElement(componentToCreate.name);
	component.className = componentToCreate.class;
	this._settingComponents.appendChild(component);
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsConfigMenuRow.prototype._onKeyDown = function _onKeyDown() {
	this.logEntry();
	this.logExit();
};

/**
 * @method _onFocus
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsConfigMenuRow.prototype._onFocus = function _onFocus() {
	this.logEntry();
	this._activeComponent.focus();
	this.logExit();
};

/**
 * @method _onBlur
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsConfigMenuRow.prototype._onBlur = function _onBlur() {
	this.logEntry();
	this.logExit();
};

/**
 * @method update
 * @public
 * @param {Array} menuItem
 */
app.gui.controls.SettingsConfigMenuRow.prototype.update = function update(menuItem) {
	this.logEntry();
	if (menuItem) {
		this._settingText.textContent = menuItem.text;
		this.visible = true;
		[].forEach.call(this._settingComponents.children, function updateComponent(component) {
			this._updateActiveComponent(component, menuItem);
		}, this);
	} else {
		this.visible = false;
	}
	this.logExit();
};

/**
 * @method _updateActiveComponent
 * @private
 * @param {HTMLElement} component
 * @param {Object} menuItem
 */
app.gui.controls.SettingsConfigMenuRow.prototype._updateActiveComponent = function _updateActiveComponent(component, menuItem) {
	this.logEntry();
	if (component.className === menuItem.data.type) {
		this._activeComponent = component;
		component.visible = true;
		component.update(menuItem.data);
	} else {
		component.visible = false;
	}
	this.logExit();
};

/**
 * @method highlight
 * @public
 */
app.gui.controls.SettingsConfigMenuRow.prototype.highlight = function highlight() {
	this.logEntry();
	[].forEach.call(this._settingComponents.children, this._highlightComponent);
	this.logExit();
};

/**
 * @method _highlightComponent
 * @private
 * @param {HTMLElement} component
 */
app.gui.controls.SettingsConfigMenuRow.prototype._highlightComponent = function _highlightComponent(component) {
	this.logEntry();
	if (component.visible && component.highlight) {
		component.highlight();
	}
	this.logExit();
};

/**
 * @method unHighlight
 * @public
 */
app.gui.controls.SettingsConfigMenuRow.prototype.unHighlight = function unHighlight() {
	this.logEntry();
	this.logExit();
};

/**
 * @method undo
 * @private
 */
app.gui.controls.SettingsConfigMenuRow.prototype.undo = function undo() {
	[].filter.call(this._settingComponents.children, function (component) {
		return component.visible;
	}).forEach(this._undoComponent);
};

/**
 * @method _undoComponent
 * @private
 * @param {HTMLElement} component
 */
app.gui.controls.SettingsConfigMenuRow.prototype._undoComponent = function _undoComponent(component) {
	this.logEntry();
	component.undo();
	this.logExit();
};
