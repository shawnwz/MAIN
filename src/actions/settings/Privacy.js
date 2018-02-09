/**
 * @class Privacy
 */
$actions.settings.Privacy = (function Privacy() {

	/**
	 * @method setContentRecommendations
	 * @private
	 * @param {Boolean} value
	 */
	function setContentRecommendations(value) {
		return $config.saveConfigValue("settings.privacy.content.recommendations", value);
	}

	/**
	 * @method setSuggestions
	 * @private
	 * @param {Boolean} value
	 */
	function setSuggestions(value) {
		return $config.saveConfigValue("settings.privacy.suggestions", value);
	}

	/**
	 * @method savePrivacyItems
	 * @private
	 * @param {Boolean} value
	 */
	function savePrivacyItems(saveitems) {
		setSuggestions(saveitems.settingsPrivacySuggestions);
		setContentRecommendations(saveitems.settingsPrivacyRecommendations);
	}

	/* Public API */
	return {

		/**
		 * @method init
		 * @public
		 */
		init: function () {
			$util.Events.on("settings:privacy:contentRecommendations", setContentRecommendations);
			$util.Events.on("settings:privacy:suggestions", setSuggestions);
			$util.Events.on("settings:privacy:undoChanges", savePrivacyItems);
			$util.Events.on("settings:privacy:resetDefaults", savePrivacyItems);
		}
	};
}());
