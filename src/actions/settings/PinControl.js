/**
 * @class PinControl
 */
$actions.settings.PinControl = (function PinControl() {

	/**
	 * @method setPinControlPurchase
	 * @private
	 * @param {Boolean} value
	 */
	function setPinControlPurchase(value) {
		return $config.saveConfigValue("settings.pinControl.purchase", value);
	}

	/**
	 * @method setPinControlKeptProgrammes
	 * @private
	 * @param {Boolean} value
	 */
	function setPinControlKeptProgrammes(value) {
		return $config.saveConfigValue("settings.pinControl.keptProgrammes", value);
	}

	/**
	 * @method setPinControlIpVideo
	 * @private
	 * @param {Boolean} value
	 */
	function setPinControlIpVideo(value) {
		return $config.saveConfigValue("settings.pinControl.ipVideo", value);
	}

	/**
	 * @method savePinControlItems
	 * @private
	 * @param {Boolean} value
	 */
	function savePinControlItems(saveItems) {
		setPinControlPurchase(saveItems.settingsPinToPurchase);
		setPinControlKeptProgrammes(saveItems.settingsPinProtectProgrames);
		setPinControlIpVideo(saveItems.settingsPinForIPVideo);
	}

	/* Public API */
	return {

		/**
		 * @method init
		 * @public
		 */
		init: function () {
			$util.Events.on("settings:pinControl:purchase", setPinControlPurchase);
			$util.Events.on("settings:pinControl:keptProgrammes", setPinControlKeptProgrammes);
			$util.Events.on("settings:pinControl:ipVideo", setPinControlIpVideo);
			$util.Events.on("settings:pinControl:undoChanges", savePinControlItems);
			$util.Events.on("settings:pinControl:resetDefaults", savePinControlItems);
		}
	};
}());
