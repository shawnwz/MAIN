/**
 * @class ViewRestrictions
 */
$actions.settings.ViewRestrictions = (function ViewRestrictions() {

	/**
	 * @method setPinEntryForProgramClassifieds
	 * @private
	 * @param {Boolean} value
	 */
	function setPinEntryForClassifiedProgram(value) {
		return $config.saveConfigValue("settings.viewrestrictions.pin.entry.for.classified.program", value);
	}

	/**
	 * @method setHideInfoPostersForClassifiedProgram
	 * @private
	 * @param {Boolean} value
	 */
	function setHideInfoPostersForClassifiedProgram(value) {
		return $config.saveConfigValue("settings.viewrestrictions.hide.info.posters.for.classified.program", value);
	}

	/**
	 * @method setPinEntryForNonClassifiedProgram
	 * @private
	 * @param {Boolean} value
	 */
	function setPinEntryForNonClassifiedProgram(value) {
		return $config.saveConfigValue("settings.viewrestrictions.pin.entry.for.non.classified.program", value);
	}

	/**
	 * @method savePrivacyItems
	 * @private
	 * @param {Boolean} value
	 */
	function saveViewRestrictionsItems(saveitems) {
		setPinEntryForClassifiedProgram(saveitems.settingsPinEntryForClassifiedProgram);
		setHideInfoPostersForClassifiedProgram(saveitems.settingsHideInfoPostersForClassifiedProgram);
		setPinEntryForNonClassifiedProgram(saveitems.settingsPinEntryForNonClassifiedProgram);
	}

	/* Public API */
	return {

		/**
		 * @method init
		 * @public
		 */
		init: function () {
			$util.Events.on("settings:viewrestrictions:pinentryclassifiedprogram", setPinEntryForClassifiedProgram);
			$util.Events.on("settings:viewrestrictions:hideinfopostersclassifiedprogram", setHideInfoPostersForClassifiedProgram);
			$util.Events.on("settings:viewrestrictions:pinentrynonclassifiedprogram", setPinEntryForNonClassifiedProgram);
			$util.Events.on("settings:viewrestrictions:undoChanges", saveViewRestrictionsItems);
			$util.Events.on("settings:viewrestrictions:resetDefaults", saveViewRestrictionsItems);
		}
	};
}());
