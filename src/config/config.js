// eslint-disable-next-line no-global-assign, no-native-reassign
$config = (function () {

	var defaultSettings = {
	};

	/**
	 * Returns a config object value from the Config list for
	 * a given key
	 * @method getConfigValue
	 * @returns {String}
	 */
	function getConfigValue(key) {
		var configItem = defaultSettings[key];
		if (configItem) {
			return configItem.value;
		}
		return null;
	}

	/**
	 * Adds default settings
	 *
	 * @method addDefaultSettings
	 * @param {Object} settings - Settings to be added to defaultSettings
	 */
	function addDefaultSettings(settings) {
		var settingKey;
		for (settingKey in settings) {
			if (settings.hasOwnProperty(settingKey)) {
				defaultSettings[settingKey] = settings[settingKey];
			}
		}
	}

	/**
	 * Saves a config object value from the Config list for
	 * a given key
	 * @method getConfigValue
	 * @returns {String}
	 */
	function saveConfigValue(key, value) {
		defaultSettings[key].value = value;
		o5.platform.system.Preferences.set(key, value);
//		$util.Events.fire("app:config:change:"+key, value);
	}

	/**
	 * Processes all the configuration settings and persists them to preferences
	 * @method initialise
	 */
	function init() {
		var configItemKey,
			currentVal;

		for (configItemKey in defaultSettings) {
			if (!defaultSettings.dontPersist && defaultSettings.hasOwnProperty(configItemKey)) {
				if (defaultSettings[configItemKey].override) {
					saveConfigValue(configItemKey, defaultSettings[configItemKey].value);
				} else {
					currentVal = o5.platform.system.Preferences.get(configItemKey);
					if (currentVal === undefined || currentVal === "") {
						saveConfigValue(configItemKey, defaultSettings[configItemKey].value);
					} else {
						defaultSettings[configItemKey].value = currentVal;
					}
				}
			}
		}
	}

	return {
		getConfigValue    : getConfigValue,
		saveConfigValue   : saveConfigValue,
		addDefaultSettings: addDefaultSettings,
		init              : init
	};
}());
