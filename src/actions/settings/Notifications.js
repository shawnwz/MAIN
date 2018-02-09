/**
 * @class Notifications
 */
$actions.settings.Notifications = (function Notifications() {

	/**
	 * @method setReminderAdvancedTime
	 * @private
	 * @param {Int} timeInSeconds
	 * @return {Boolean}
	 */
	function setReminderAdvancedTime(value) {
		// TODO: FP1-171 - viewerPeriod is readonly, requires reboot/reinit. Current set preference call returns CCOM error.
		//return o5.platform.system.Preferences.set("/system/opentv/scheduler/JobTaskManager/viewerPeriod", timeInSeconds, true);
		return $config.saveConfigValue("settings.notifications.reminder.advanced.time", value);
		
	}

	/**
	 * @method setIpVideoUsageWarning
	 * @private
	 * @param {Boolean} onOff
	 * @return {Boolean}
	 */
	function setIpVideoUsageWarning(value) {
		return $config.saveConfigValue("settings.notifications.ip.video.usage.warning.enable", value);
	}

	/**
	 * @method setBannerTimeout
	 * @private
	 * @param {Int} timeInSeconds
	 * @return {Boolean}
	 */
	function setBannerTimeout(value) {
		return $config.saveConfigValue("settings.notifications.banner.timeout", value);
	}

	/**
	 * @method setHdcpWarningSettings
	 * @private
	 * @param {String} value
	 * @return {Boolean}
	 */
	function setHdcpWarningSettings(value) {
		return $config.saveConfigValue("settings.notifications.hdcp.warning.settings", value);
	}

	/**
	 * @method setDeleteConfirmation
	 * @private
	 * @param {String} value
	 * @return {Boolean}
	 */
	function setDeleteConfirmation(value) {
		return $config.saveConfigValue("settings.notifications.delete.confirmation", value);
	}

	/**
	 * @method saveNotificationItems
	 * @private
	 * @param {String} value
	 * @return {Boolean}
	 */
	function saveNotificationItems(saveitems) {
		setReminderAdvancedTime(saveitems.settingsNoticationsReminder);
		setDeleteConfirmation(saveitems.settingsNoticationsDelete);
		setIpVideoUsageWarning(saveitems.settingsNoticationsIpVideo);
		setBannerTimeout(saveitems.settingsNoticationsBannner);
		setHdcpWarningSettings(saveitems.settingsNoticationsHDCP);
	}

	/* Public API */
	return {

		/**
		 * @method init
		 * @public
		 */
		init: function () {
			$util.Events.on("settings:notifications:setReminderAdvancedTime", setReminderAdvancedTime);
			$util.Events.on("settings:notifications:setIpVideoUsageWarning", setIpVideoUsageWarning);
			$util.Events.on("settings:notifications:setBannerTimeout", setBannerTimeout);
			$util.Events.on("settings:notifications:setHdcpWarningSettings", setHdcpWarningSettings);
			$util.Events.on("settings:notifications:setDeleteConfirmationOptions", setDeleteConfirmation);
			$util.Events.on("settings:notifications:undoChanges", saveNotificationItems);
			$util.Events.on("settings:notifications:resetDefaults", saveNotificationItems);
		}
	};
}());
