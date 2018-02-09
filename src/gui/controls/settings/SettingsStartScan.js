/**
 * Example markup:
 *
 *     <app-settings-start-scan id="settingsScanStart"></app-settings-start-scan>
 *
 * @class app.gui.controls.SettingsScan
 * @extends o5.gui.controls.Control
 */

app.gui.controls.SettingsStartScan = function SettingsStartScan() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsStartScan, app.gui.controls.HtmlItem);


/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsStartScan.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this._createChildren();
	this._setChildIds();
	this._appendChildren();
	this._registerEvents();
	this._scanningStatusText.innerHTML =  $util.Translations.translate("noChannelTuned");
	this._scanningStatusText.dataset.i18n = "";
	this.logExit();
};

/**
 * @method _createChildren
 * @private
 */
app.gui.controls.SettingsStartScan.prototype._createChildren = function _createChildren() {
	this._scanningStatusText = this.ownerDocument.createElement("div");
};

/**
 * @method _setChildIds
 * @private
 */
app.gui.controls.SettingsStartScan.prototype._setChildIds = function _setChildIds() {
	this._scanningStatusText.id = "fullScanStatusPreText";
};

/**
 * @method _appendChildren
 * @private
 */
app.gui.controls.SettingsStartScan.prototype._appendChildren = function _setChildIds() {
	this.appendChild(this._scanningStatusText);
};

/**
 * @method _updateStatus
 * @private
 */
app.gui.controls.SettingsStartScan.prototype._updateStatus = function _updateStatus() {
	var noOfChannelTuned = Number(o5.platform.system.Preferences.get($util.constants.TERRESTRIAL_CHANNEL_TUNED_NO));
	if (noOfChannelTuned) {
		this._scanningStatusText.innerHTML = noOfChannelTuned + $util.Translations.translate("alreadyTunedChannels");
	}
};

/**
 * @method _registerEvents
 * @private
 */
app.gui.controls.SettingsStartScan.prototype._registerEvents = function _registerEvents() {
	this.logEntry();
	$util.Events.on("settings:scan:updateScanStatus", this._updateStatus, this);
	this.logExit();
};

/**
 * @method _unregisterEvents
 * @private
 */
app.gui.controls.SettingsStartScan.prototype._unregisterEvents = function _unregisterEvents() {
	this.logEntry();
	$util.Events.remove("settings:scan:updateScanStatus", this._updateStatus, this);
	this.logExit();
};
