/**
 * @class AV
 */
$actions.settings.AV = (function AV() {

	var AUTO = "auto";

	/**
	 * @method setResolution
	 * @private
	 * @param {Enum} resolution
	 * @return {Boolean}
	 */
	function setResolution(resolution) {
		if (resolution === AUTO) {
			var hdmiCapList = CCOM.System.hdmiVideoFormat,
                closestPower = Math.pow(2, Math.ceil(Math.log(hdmiCapList) / Math.log(2))),
                hdmiCap = (closestPower > hdmiCapList) ? closestPower / 2 : closestPower;

			// FP1-157 Advanced Settings - Picture Settings
			o5.platform.system.Preferences.set("/users/preferences/autoResolution", true, true);
			o5.platform.output.AV.setResolution(hdmiCap);
			return;
		}

		/*	this.HDMI_VIDEO_FORMAT_480I = 1;
			this.HDMI_VIDEO_FORMAT_480P = 2;
			this.HDMI_VIDEO_FORMAT_576I = 4;
			this.HDMI_VIDEO_FORMAT_576P = 8;
			this.HDMI_VIDEO_FORMAT_720P = 16;
			this.HDMI_VIDEO_FORMAT_1080I = 32;
			this.HDMI_VIDEO_FORMAT_1080P = 64;
			this.HDMI_VIDEO_FORMAT_2160P = 128;
			this.HDMI_VIDEO_FORMAT_4320P = 256;*/

		o5.platform.system.Preferences.set("/users/preferences/autoResolution", false, true);
		return o5.platform.output.AV.setResolution(resolution);
	}

	/**
	 * @method setAspectMode
	 * @private
	 * @param {Enum} aspectMode
	 * @return {Boolean}
	 */
	function setAspectMode(aspectMode) {
		return o5.platform.output.AV.setHDVideoAspectMode(aspectMode);
	}

	/**
	 * @method setTheme
	 * @private
	 * @param {Enum} resolution
	 * @return {Boolean}
	 */
	function setTheme(theme) {
		return $config.saveConfigValue("settings.view.theme", theme);
	}

	/**
	 * @method savePictureItems
	 * @private
	 * @param {Enum} saveitems
	 * @return {Boolean}
	 */
	function savePictureItems(saveitems) {
		setResolution(saveitems.settingsMenuPictureHDOutput);
		setAspectMode(saveitems.settingsMenuPicture43);
	}

	/**
	 * @method setSpdifOutput
	 * @private
	 * @param {Enum} Audio Format, see o5.platform.output.AV.AudioType
	 * @return {Boolean}
	 */
	function setSpdifOutput(audioFormat) {
		return o5.platform.system.Preferences.set("/system/devices/audmgr/spdifFormat", audioFormat, true);
	}

	/**
	 * @method setSpdifDelay
	 * @private
	 * @param {Int} delay in MS
	 * @return {Boolean}
	 */
	function setSpdifDelay(delayInMs) {
		return o5.platform.output.AV.setAudioDelay(delayInMs);
	}

	/**
	 * @method setSpdifAttenuation
	 * @private
	 */
	function setSpdifAttenuation(value) {
		// TODO: FP1-158 Advanced Settings - Audio & Language
		return o5.platform.system.Preferences.set("/system/devices/audmgr/pcmAttenuation", value, true);
	}

	/**
	 * @method setHdmiOutput
	 * @private
	 * @param {Enum} Audio Format, see o5.platform.output.AV.AudioType
	 * @return {Boolean}
	 */
	function setHdmiOutput(audioFormat) {
		return o5.platform.output.AV.setAudioType(audioFormat);
	}

	/**
	 * @method setPreferredLanguage
	 * @private
	 * @param {String} 3 letters language code
	 * @return {Boolean}
	 */
	function setPreferredLanguage(lang) {
		return o5.platform.system.Device.setPreferredLanguages([lang]);
	}

	/**
	 * @method saveAudioItems
	 * @private
	 * @param {Enum} saveitems
	 * @return {Boolean}
	 */
	function saveAudioItems(saveitems) {
		setSpdifOutput(saveitems.settingsMenuAudioLanguageSpdifOutput);
		setSpdifDelay(saveitems.settingsMenuAudioLanguageSpdifDelay);
		setSpdifAttenuation(saveitems.settingsMenuAudioLanguageSpdifAttenuation);
		setHdmiOutput(saveitems.settingsMenuAudioLanguageHdmiOutput);
		setPreferredLanguage(saveitems.settingsMenuAudioLanguagePreferredLanguage);
	}

	/* Public API */
	return {

		/**
		 * @method init
		 * @public
		 */
		init: function () {
			$util.Events.on("settings:av:setResolution", setResolution); // handle business logic here
			$util.Events.on("settings:av:setHDVideoAspectMode", setAspectMode);
			$util.Events.on("settings:av:spdifOutput", setSpdifOutput);
			$util.Events.on("settings:av:spdifDelay", setSpdifDelay);
			$util.Events.on("settings:av:spdifAttenuation", setSpdifAttenuation);
			$util.Events.on("settings:av:hdmiOutput", setHdmiOutput);
			$util.Events.on("settings:av:preferredLanguage", setPreferredLanguage);
			$util.Events.on("settings:av:setTheme", setTheme);
			$util.Events.on("settings:picture:undoChanges", savePictureItems);
			$util.Events.on("settings:picture:resetDefaults", savePictureItems);
			$util.Events.on("settings:audio:undoChanges", saveAudioItems);
			$util.Events.on("settings:audio:resetDefaults", saveAudioItems);
		}

	};
}());
