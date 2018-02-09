/**
 * @class Blocking
 */
$actions.settings.ChannelBlocking = (function ChannelBlocking() {
    // Huw - TODO: setChannelBlocked, setChannelUnblocked

	/* Public API */
	return {

		/**
		 * @method init
		 * @public
		 */
		init: function () {

		    /*$util.Events.on("settings:blocking:block", blockChannel);
            $util.Events.on("settings:blocking:unblock", setPipAudio);
            $util.Events.on("settings:blocking:unblockall", setBackgroundAudio);
            $util.Events.on("settings:blocking:reachedmax", setPipSurfAndScan);
            $util.Events.on("settings:blocking:channelNameDisplay", setChannelNameDisplay);
            $util.Events.on("settings:blocking:nowAndNext", setNowAndNext);
            $util.Events.on("settings:blocking:outOfStandby", setOutOfStandby);
            $util.Events.on("settings:blocking:instantRewind", setInstantRewind);
            $util.Events.on("settings:blocking:energySavingMode", setEnergySavingMode);
            $util.Events.on("settings:blocking:undoChanges", saveTvItems);
            $util.Events.on("settings:blocking:resetDefaults", saveTvItems);*/
           o5.platform.ca.ParentalControl.initialise();
           o5.platform.ca.ParentalControl.enableAuthentication();
           o5.platform.ca.ParentalControl.setPolicyModifier([{ type: o5.platform.ca.ParentalControl.PolicyModifiers.CHANNEL_CHANGE, data: "" }]);
           //Invoking init of ChannelBlacing service class gave empty data from parentalControl class.
           //Hence adding timeout of 5sec to call init. Fix for FAPUI-684
           setTimeout(function() {
				$service.settings.ChannelBlocking.init();
			}, 5000);
		}
	};
}());
