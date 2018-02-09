/**
 * Example markup:
 *
 *     <app-settings-licences id="settingsInfoContent"></app-settings-scan>
 *
 * @class app.gui.controls.SettingsLicences
 * @extends o5.gui.controls.Control
 */

app.gui.controls.SettingsLicences = function SettingsLicences() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsLicences, app.gui.controls.HtmlFocusItem);


/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsLicences.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	$util.Events.on("settings:fetchLicences", this._fetchLincences, this);
	this._licenceContainer = this.querySelector("#LicenceText");
	this.logExit();
};


/**
 * @method _fetchLincences
 * @private
 */
app.gui.controls.SettingsLicences.prototype._fetchLincences = function _fetchLincences() {
	this.logEntry();
	var licencesText = $service.settings.Licences.getfoxtelLicences();
	this._licenceContainer.innerHTML = licencesText;
	this._focus();
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsLicences.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	switch (e.key) {
		case "Back":
			this.fireControlEvent("back", this);
			break;
		default:
			break;
		}
	this.logExit();
};
