/**
 * Example markup:
 *
 *     <app-settings-scan id="settingsScan"></app-settings-scan>
 *
 * @class app.gui.controls.SettingsScan
 * @extends o5.gui.controls.Control
 */

app.gui.controls.SettingsScan = function SettingsScan() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsScan, app.gui.controls.HtmlFocusItem);


/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsScan.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._initProperties();
	this._setKeyActions();
	this._createChildren();
	this._setChildIds();
	this._appendChildren();
	this._scanningText.innerHTML = $util.Translations.translate("installerScanDialogTitle");
	this._scanningText.dataset.i18n = "installerScanDialogTitle";
	this._registerEvents();
	this._footer = document.querySelector("#callToAction");
	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.SettingsScan.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	this.superCall();
	this._scanCompleteMenu.setSelectedCallback(this._scanCompleteSelectedCallback.bind(this));
	this.logExit();
};

/**
 * @method _scanCompleteSelectedCallback
 * @private
 * @param {Object} selectedItem
 */
app.gui.controls.SettingsScan.prototype._scanCompleteSelectedCallback = function _scanCompleteSelectedCallback(selectedItem) {
	this.logEntry();
	$util.Events.fireAll(selectedItem.events);
	this.logExit();
};

/**
 * @method _createChildren
 * @private
 */
app.gui.controls.SettingsScan.prototype._createChildren = function _createChildren() {
	this._progressBar = this.ownerDocument.createElement("app-progress-bar");
	this._scanningText = this.ownerDocument.createElement("div");
	this._progressText = this.ownerDocument.createElement("div");
	this._scanResultText = this.ownerDocument.createElement("div");
	this._scanResultDetails = this.ownerDocument.createElement("div");
	this._scanResultDetailsText = this.ownerDocument.createElement("span");
	this._scanResultDetailsNumber = this.ownerDocument.createElement("span");
	this._scanCompleteMenu = this.ownerDocument.createElement("app-grid-menu");
	this._scanCompleteMenu.dataset.cols = 1;
	this._scanCompleteMenu.dataset.rows = 2;
};

/**
 * @method _setChildIds
 * @private
 */
app.gui.controls.SettingsScan.prototype._setChildIds = function _setChildIds() {
	this._scanningText.id = "settingsScanStatusText";
	this._progressText.id = "settingsScanProgressText";
	this._scanResultText.id = "settingsScanResultText";
	this._scanResultDetails.id = "settingsScanResultDetails";
	this._scanResultDetailsText.id = "settingsScanResultDetailsText";
	this._scanResultDetailsNumber.id = "settingsScanResultDetailsNumber";
	this._scanCompleteMenu.id = "settingsScanCompleteMenu";
	this._scanCompleteMenu.className = "settingsGrid scanCompleteGrid";
};

/**
 * @method _appendChildren
 * @private
 */
app.gui.controls.SettingsScan.prototype._appendChildren = function _appendChildren() {
	this.appendChild(this._progressBar);
	this.appendChild(this._scanningText);
	this.appendChild(this._progressText);
	this.appendChild(this._scanResultText);
	this.appendChild(this._scanResultDetails);
	this.appendChild(this._scanCompleteMenu);
	this._scanResultDetails.appendChild(this._scanResultDetailsNumber);
	this._scanResultDetails.appendChild(this._scanResultDetailsText);
};

/**
 * @method _initProperties
 * @private
 */
app.gui.controls.SettingsScan.prototype._initProperties = function _initProperties() {
	this.logEntry();
	this._isScanning = false;
	this._totalServicesFoundCount = 0;
	this._scanError = false;
	this._networkType = -1;
	this._networkServicesCount = [];
	this.logExit();
};

/**
 * @method _setKeyActions
 * @private
 */
app.gui.controls.SettingsScan.prototype._setKeyActions = function _setKeyActions() {
	this.logEntry();
	var me = this;
	this._keyActions = {
		"Back": function () {
			if (me._isScanning) {
				me.cancelScan();
			}
		}
	};
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsScan.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	var handled = false;
	if (this._keyActions[e.key]) {
		handled = this._keyActions[e.key]();
	}
	if (handled) {
		e.stopImmediatePropagation();
	}
	this.logExit();
};

/**
 * @method _onFocus
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsScan.prototype._onFocus = function _onFocus() {
	this.logEntry();
	this.logExit();
};

/**
 * @method _onBlur
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsScan.prototype._onBlur = function _onBlur() {
	this.logEntry();
	this.logExit();
};

/**
 * @method _updateProgress
 * @private
 * @return {Number} percent
 */
app.gui.controls.SettingsScan.prototype._updateProgress = function _updateProgress(percent) {
	this.logEntry();
	this._progressBar.updateProgress(percent);
	this._progressText.textContent = percent + "%";
	this.logExit();
};

/**
 * @method startScan
 * @public
 */
app.gui.controls.SettingsScan.prototype.startScan = function startScan() {
    var footerData = {};
	this.logEntry();
	this._hideResults();
	this._showProgress();
	this._scanError = false;
	this._totalServicesFoundCount = 0;
	this._updateProgress(0);
	footerData.id = this.id;
	footerData.screen = "startScan";
    $util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", footerData);
	//this._footer.classList = [];
	//this._footer.classList.add("ctaCancel");
	o5.gui.ViewManager.stopTimeOut();
	document.querySelector("#ctaCancel").children[1].innerHTML = $util.Translations.translate(document.querySelector("#ctaCancel").children[1].attributes.getNamedItem("data-i18n").value);
	$util.Events.fire("settings:scan:scan");
	this._isScanning = true;
	this._focus();
	this.logExit();
};

/**
 * @method cancelScan
 * @public
 */
app.gui.controls.SettingsScan.prototype.cancelScan = function cancelScan() {
	this.logEntry();
	$util.Events.fire("settings:scan:cancel");
	this._finishScanning();
	this.logExit();
};

/**
 * @method _scanCompleted
 * @private
 */
app.gui.controls.SettingsScan.prototype._scanCompleted = function _scanCompleted() {
	this.logEntry();
	this._updateProgress(100);
	this._finishScanning();
	this.logExit();
};

/**
 * @method _scanFailed
 * @private
 */
app.gui.controls.SettingsScan.prototype._scanFailed = function _scanFailed() {
	this.logEntry();
	this._scanError = true;
	this._finishScanning();
	this.logExit();
};

/**
 * @method _scanProgress
 * @private
 * @param {Object} progressInfo
 */
app.gui.controls.SettingsScan.prototype._scanProgress = function _scanProgress(progressInfo) {
	this.logEntry();
	this._updateProgress(progressInfo.percentComplete || 0);
	if (this._networkType !== progressInfo.type) {
		this._networkType = progressInfo.type;
		this._networkServicesCount.push(progressInfo.totalServices || 0);
	} else {
		var len = this._networkServicesCount.length;
		this._networkServicesCount[len - 1] = progressInfo.totalServices || 0;
	}
	this.logExit();
};

/**
 * @method _finishScanning
 * @private
 */
app.gui.controls.SettingsScan.prototype._finishScanning = function _finishScanning() {
	var i, footerData = {};
	this.logEntry();

	for (i = 0; i < this._networkServicesCount.length; i++) {
		this._totalServicesFoundCount = this._totalServicesFoundCount + this._networkServicesCount[i];
	}
	o5.platform.system.Preferences.set($util.constants.TERRESTRIAL_CHANNEL_TUNED_NO, this._totalServicesFoundCount.toString());
	$util.Events.fire("settings:scan:updateScanStatus");
	footerData.id = this.id;
	footerData.screen = "finishScan";
    $util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", footerData);
	this._footer.classList = [];
	//this._footer.classList.add("ctaClose");
	this._isScanning = false;
	this._hideProgress();
	this._setResults();
	this._showResults();
	o5.gui.ViewManager.kickTimeOut();
	$util.Events.fire("settings:scan:enableAutomatic");
	this._totalServicesFoundCount = 0;
	this._networkType = -1;
	this._networkServicesCount = [];
	this.logExit();
};

/**
 * @method _registerEvents
 * @private
 */
app.gui.controls.SettingsScan.prototype._registerEvents = function _registerEvents() {
	this.logEntry();
	$util.Events.on("settings:scan:complete", this._scanCompleted, this);
	$util.Events.on("settings:scan:failed", this._scanFailed, this);
	$util.Events.on("settings:scan:progress", this._scanProgress, this);
	$util.Events.on("settings:scan:reset", this._reset, this);
	$util.Events.on("settings:scan:rescan", this.startScan, this);
	$util.Events.on("settings:startScan", this.startScan, this);
	this.logExit();
};

/**
 * @method _unregisterEvents
 * @private
 */
app.gui.controls.SettingsScan.prototype._unregisterEvents = function _unregisterEvents() {
	this.logEntry();
	$util.Events.remove("settings:scan:complete", this._scanCompleted, this);
	$util.Events.remove("settings:scan:failed", this._scanFailed, this);
	$util.Events.remove("settings:scan:progress", this._scanProgress, this);
	$util.Events.remove("settings:scan:reset", this._reset, this);
	$util.Events.remove("settings:scan:rescan", this.startScan, this);
	this.logExit();
};

/**
 * @method _setResults
 * @private
 */
app.gui.controls.SettingsScan.prototype._setResults = function _setResults() {
	this._scanResultText.innerHTML = (this._scanError) ? "Scan Failed" : $util.Translations.translate("settingsMenuScanResultsSuccess");
	this._scanResultText.dataset.i18n = "settingsMenuScanResultsSuccess";
	this._scanResultDetailsNumber.textContent = this._totalServicesFoundCount + " ";
	this._scanResultDetailsText.innerHTML = $util.Translations.translate("settingsMenuScanChannelCount");
	this._scanResultDetailsText.dataset.i18n = "settingsMenuScanChannelCount";
	this._setScanCompleteMenuItems();
};

/**
 * @method _hideResults
 * @private
 */
app.gui.controls.SettingsScan.prototype._hideResults = function _hideResults() {
	this._scanResultText.classList.add("hidden");
	this._scanResultDetails.classList.add("hidden");
	this._scanCompleteMenu.classList.add("hidden");
};

/**
 * @method _showResults
 * @private
 */
app.gui.controls.SettingsScan.prototype._showResults = function _showResults() {
	this._scanResultText.classList.remove("hidden");
	this._scanResultDetails.classList.remove("hidden");
	this._scanCompleteMenu.classList.remove("hidden");
	this._scanCompleteMenu.focus();
};

/**
 * @method _hideProgress
 * @private
 */
app.gui.controls.SettingsScan.prototype._hideProgress = function _hideProgress() {
	this._progressBar.classList.add("hidden");
	this._scanningText.classList.add("hidden");
	this._progressText.classList.add("hidden");
};

/**
 * @method _showProgress
 * @private
 */
app.gui.controls.SettingsScan.prototype._showProgress = function _showProgress() {
	this._progressBar.classList.remove("hidden");
	this._scanningText.classList.remove("hidden");
	this._progressText.classList.remove("hidden");
};

/**
 * @method _setScanCompleteMenuItems
 * @private
 */
app.gui.controls.SettingsScan.prototype._setScanCompleteMenuItems = function _setScanCompleteMenuItems() {
	this.logEntry();
	var scanCompleteMenuItems = $util.Screens.getScreen(app.screenConfig.settings, "SCAN_COMPLETE").getMenu().map(function (item) {
			return {
				id    : item.id,
				text  : item.text,
				events: item.events
			};
		}, this);
	this._scanCompleteMenu.setData(scanCompleteMenuItems);
	this.logExit();
};

/**
 * @method _reset
 * @private
 */
app.gui.controls.SettingsScan.prototype._reset = function _reset() {
	this.logEntry();
	this._hideResults();
	this._scanResultText.textContent = "";
	this._scanResultDetailsNumber.textContent = "";
	this._scanResultDetailsText.textContent = "";
	this._scanCompleteMenu.highlightItem(0, 0);
	this._updateProgress(0);
	this._showProgress();
	this.logExit();
};
