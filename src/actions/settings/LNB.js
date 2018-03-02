/**
 * @class LNB
 */
$actions.settings.LNB = (function LNB() {

	/**
	 * @method setPowerSupply
	 * @private
	 * @param {Boolean} value
	 */
	function setPowerSupply(value) {
		return $config.saveConfigValue("settings.installer.lnb.power", value);
	}

	/**
	 * @method setFrequencyCommand
	 * @private
	 * @param {Boolean} value
	 */
	function setFrequencyCommand(value) {
		return $config.saveConfigValue("settings.installer.lnb.frequencyCommand", value);
	}

    /**
     * @method setFrequencyCommand
     * @private
     * @param {Boolean} value
     */
    function setHighBandLowFrequency(value) {
        return $config.saveConfigValue("settings.installer.lnb.highBandLowFrequency", value);
    }

	/**
	 * @method saveLNBItems
	 * @private
	 * @param {Boolean} value
	 */
	function saveLNBItems(saveitems) {
		setFrequencyCommand(saveitems.settingsLNBFrequencyCommand);
		setPowerSupply(saveitems.settingsLNBPowerSupply);
		setHighBandLowFrequency(saveitems.settingsLNBHighBandLowFrequency);
	}

	/* Public API */
	return {

		/**
		 * @method init
		 * @public
		 */
		init: function () {
			$util.Events.on("settings:lnb:powerSupply", setPowerSupply);
			$util.Events.on("settings:lnb:frequencyCommand", setFrequencyCommand);
			$util.Events.on("settings:lnb:highBandLowFrequency", setHighBandLowFrequency);
			$util.Events.on("settings:lnb:undoChanges", saveLNBItems);
			$util.Events.on("settings:lnb:resetDefaults", saveLNBItems);
		}
	};
}());
