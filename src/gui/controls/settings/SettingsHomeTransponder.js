/**
 * Example markup:
 *
 *     <app-settings-home-transponder id="settingsHomeTransponder"></app-settings-home-transponder>
 *
 * @class app.gui.controls.SettingsHomeTransponder
 * @extends o5.gui.controls.Control
 */

app.gui.controls.SettingsHomeTransponder = function SettingsHomeTransponder() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsHomeTransponder, app.gui.controls.HtmlItem);


/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsHomeTransponder.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this._isSignalAvalaible = false;
	this.superCall();
	this._list = this.querySelector("app-settings-list");
	this.logExit();
};


app.gui.controls.SettingsHomeTransponder.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	this.superCall();
	var me = this;
	$util.ControlEvents.on("app-settings:" + this._list.id, "back", function () {
		me._handleBackKey();
	});
	this.logExit();
};

/**
 * @method _show
 * @private
 */
app.gui.controls.SettingsHomeTransponder.prototype._show = function _show() {
	this.logEntry();
	this.superCall();
	this._registerEvents();
	this.logExit();
};


/**
 * @method _hide
 * @private
 */
app.gui.controls.SettingsHomeTransponder.prototype._hide = function _hide() {
	this.logEntry();
	this.superCall();
	this._unregisterEvents();
	this.logExit();
};

/**
 * @method _signalLostListner
 * @private
 */
app.gui.controls.SettingsHomeTransponder.prototype._signalLostListner = function _signalLostListner() {
	this.logEntry();
	 var _dialog = {
	        title    : $util.Translations.translate("F0100Title"),
	        text     : $util.Translations.translate("F0100Description"),
	        subText  : "",
	        errorCode: "F0100"
		 };
	 this._isSignalAvalaible = true;
	 $util.ControlEvents.fire(":dialogNoSignal", "show", _dialog);
	 $util.ControlEvents.fire(":dialogNoSignal", "focus");
	this.logExit();
};

/**
 * @method _singalGainListner
 * @private
 */
app.gui.controls.SettingsHomeTransponder.prototype._singalGainListner = function _singalGainListner() {
	this.logEntry();
	if (this._isSignalAvalaible) {
		this._isSignalAvalaible = false;
		$util.ControlEvents.fire(":dialogGenericErrorH", "hide");
	}
	this.logExit();
};

/**
 * @method _registerEvents
 * @private
 */
app.gui.controls.SettingsHomeTransponder.prototype._registerEvents = function _registerEvents() {
	this.logEntry();
	var tuner = $service.tuner.Signal.getTuner();
	tuner.registerQosDegradedListener(this._signalLostListner);
	tuner.registerQosImprovedListener(this._singalGainListner);
	this.logExit();
};

/**
 * @method _registerEvents
 * @private
 */
app.gui.controls.SettingsHomeTransponder.prototype._handleBackKey = function _handleBackKey() {
	this.logEntry();
	this.fireControlEvent("hide");
	var me = this,
	isDialogDisplays = false;
	setTimeout(function() {
		if (!me._isSignalAvalaible) {
		 var _dialog = {
	        title    : $util.Translations.translate("F1013Title"),
	        text     : $util.Translations.translate("F1013Description") + "77%", // just temp change
	        errorCode: "F1013"
		 };
		isDialogDisplays = true;
	 	$util.ControlEvents.fire(":dialogAcquiringDialogs", "show", _dialog);
	 	$util.ControlEvents.fire(":dialogAcquiringDialogs", "focus");
	}
	}, 100);
	setTimeout(function() {
		if (isDialogDisplays) {
			$util.ControlEvents.fire(":dialogAcquiringDialogs", "hide");
		}
	}, 10100);
	this.logExit();
};

/**
 * @method _unregisterEvents
 * @private
 */
app.gui.controls.SettingsHomeTransponder.prototype._unregisterEvents = function _unregisterEvents() {
	this.logEntry();
	var tuner = $service.tuner.Signal.getTuner();
	tuner.unregisterQosDegradedListener(this._signalLostListner);
	tuner.unregisterQosImprovedListener(this._singalGainListner);
	this.logExit();
};
