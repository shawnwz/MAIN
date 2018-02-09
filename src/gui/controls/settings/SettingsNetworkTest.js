/**
 * Example markup:
 *
 *     <app-settings-network-test id="settingsNetworkTestView"></app-settings-network-test>
 *
 * @class app.gui.controls.SettingsNetworkTest
 * @extends o5.gui.controls.Control
 */

app.gui.controls.SettingsNetworkTest = function SettingsNetworkTest() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsNetworkTest, app.gui.controls.HtmlFocusItem);


/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsNetworkTest.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._testingModem = document.querySelector('#settingsNetworkTestTestingModem');
	this._testingFoxtel = document.querySelector('#settingsNetworkTestTestingFoxtel');
	this._failedModem = document.querySelector('#settingsNetworkTestFailModem');
	this._failedFoxtel = document.querySelector('#settingsNetworkTestFailFoxtel');
	this._successfulConnected = document.querySelector('#settingsNetworkTestConnected');
	this._registerEvents();
	this.logExit();
};

/**
 * @method _initializeUI
 * @private
 */
app.gui.controls.SettingsNetworkTest.prototype._initializeUI = function _initializeUI() {
    	this._testingModem.style.display = "block";
    	this._testingFoxtel.style.display = "none";
    	this._failedModem.style.display = "none";
    	this._failedFoxtel.style.display = "none";
    	this._successfulConnected.style.display = "none";
    	this.fireControlEvent("focus");
    	$util.Events.fire('settings:triggerNetwortTest');

};

/**
 * @method _updateModemUI
 * @private
 */
app.gui.controls.SettingsNetworkTest.prototype._updateModemUI = function _updateModemUI(data) {
    	this._testingModem.style.display = "none";
    	if (data.isSuccessful) {
    	    this._testingFoxtel.style.display = "block";
    	} else {
    	    this._failedModem.style.display = "block";
    	}
};

/**
 * @method _updateFoxtelUI
 * @private
 */
app.gui.controls.SettingsNetworkTest.prototype._updateFoxtelUI = function _updateFoxtelUI(data) {
    	this._testingModem.style.display = "none";
    	this._testingFoxtel.style.display = "none";
    	this._failedModem.style.display = "none";
    	if (data.isSuccessful) {
    	    this._successfulConnected.style.display = "block";
    	} else {
    	    this._failedFoxtel.style.display = "block";
    	}

};

/**
 * @method _registerEvents
 * @private
 */
app.gui.controls.SettingsNetworkTest.prototype._registerEvents = function _registerEvents() {
	this.logEntry();
	$util.Events.on("settings:startNetworkRequest", this._initializeUI, this);
	$util.Events.on("settings:updateModemUI", this._updateModemUI, this);
	$util.Events.on("settings:updateFoxtelUI", this._updateFoxtelUI, this);
	this.logExit();
};

app.gui.controls.SettingsNetworkTest.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	switch (e.key) {
        	case "Back":
        		break;
		default:
			this.superCall(e);
			break;
	}
	this.logExit();
};
