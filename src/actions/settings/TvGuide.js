/**
 * @class TvGuide
 */
$actions.settings.TvGuide = (function TvGuide() {

	/**
	 * @method setBackgroundVision
	 * @private
	 * @param {} value
	 */
	function setBackgroundVision(value) {
		return $config.saveConfigValue("settings.tv.guide.background.vision", value);
	}

    /**
     * @method setPipAudio
     * @private
     * @param {} value
     */
    function setPipAudio(value) {
        return $config.saveConfigValue("settings.tv.guide.pip.audio", value);
    }

   	/**
	 * @method setBackgroundAudio
	 * @private
	 * @param {} value
	 */
	function setBackgroundAudio(value) {
		return $config.saveConfigValue("settings.tv.guide.background.audio", value);
	}

    /**
     * @method setPipSurfAndScan
     * @private
     * @param {} value
     */
    function setPipSurfAndScan(value) {
        return $config.saveConfigValue("settings.tv.guide.pip.scan", value);
    }

	/**
	 * @method setChannelNameDisplay
	 * @private
	 * @param {} value
	 */
	function setChannelNameDisplay(value) {
		return $config.saveConfigValue("settings.tv.guide.channel.name.display", value);
	}

	/**
	 * @method setNowAndNext
	 * @private
	 * @param {} value
	 */
	function setNowAndNext(value) {
		return $config.saveConfigValue("settings.tv.guide.now.and.next", value);
	}

	/**
	 * @method setOutOfStandby
	 * @private
	 * @param {} value
	 */
	function setOutOfStandby(value) {
		return $config.saveConfigValue("settings.tv.guide.out.of.standby", value);
	}

	/**
	 * @method setInstantRewind
	 * @private
	 * @param {} value
	 */
	function setInstantRewind(value) {
		return $config.saveConfigValue("settings.tv.guide.instant.rewind", value);
	}

	/**
	 * @method setEnergySavingMode
	 * @private
	 * @param {} value
	 */
	function setEnergySavingMode(value) {
		return $config.saveConfigValue("settings.tv.guide.engery.saving.mode", value);
	}

	/**
	 * @method saveTvItems
	 * @private
	 * @param {Enum} saveitems
	 * @return {Boolean}
	 */
	function saveTvItems(saveitems) {
		setBackgroundVision(saveitems.settingsMenuTvGuideBackgroundVision);
		setPipAudio(saveitems.settingsMenuTvGuidePipAudio);
		setBackgroundAudio(saveitems.settingsMenuTvGuideBackgroundAudio);
        setPipSurfAndScan(saveitems.settingsMenuTvGuidePipSurfAndScan);
		setChannelNameDisplay(saveitems.settingsMenuTvGuideChannelNameDisplay);
        setNowAndNext(saveitems.settingsMenuTvGuideNowAndNext);
		setOutOfStandby(saveitems.settingsMenuTvGuideOutOfStandby);
		setInstantRewind(saveitems.settingsMenuTvGuideInstantRewind);
		setEnergySavingMode(saveitems.settingsMenuTvGuideEnergySavingMode);
	}

	/* Public API */
	return {

		/**
		 * @method init
		 * @public
		 */
		init: function () {
			$util.Events.on("settings:tv:backgroundVision", setBackgroundVision);
			$util.Events.on("settings:tv:pipAudio", setPipAudio);
			$util.Events.on("settings:tv:backgroundAudio", setBackgroundAudio);
			$util.Events.on("settings:tv:pipSurfAndScan", setPipSurfAndScan);
			$util.Events.on("settings:tv:channelNameDisplay", setChannelNameDisplay);
			$util.Events.on("settings:tv:nowAndNext", setNowAndNext);
			$util.Events.on("settings:tv:outOfStandby", setOutOfStandby);
			$util.Events.on("settings:tv:instantRewind", setInstantRewind);
			$util.Events.on("settings:tv:energySavingMode", setEnergySavingMode);
			$util.Events.on("settings:tv:undoChanges", saveTvItems);
			$util.Events.on("settings:tv:resetDefaults", saveTvItems);
		}
	};
}());
