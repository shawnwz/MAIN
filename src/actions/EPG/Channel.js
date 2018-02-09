$actions.EPG.Channel = (function Channel() {

	/**
	 * @method block
	 * @param  {Object} service
	 */
	function block(service) {
		// TODO - FP1-142 - block service using CCOM.UserAuth.addRestrictedChannel
		this._userAuth = CCOM.UserAuth;

		service.blocked = true;
	}

	/**
	 * @method unblock
	 * @param {Object} service
	 */
	function unblock(service) {
		// TODO - FP1-142 - unblock service using CCOM.UserAuth.addRestrictedChannel
		service.blocked = false;
	}

	/**
	 * @method toggleBlock
	 * @param {Object} service
	 */
	function toggleBlock(service) {
		service.blocked = !service.blocked;
		console.warn("Blocked status changed:" + JSON.stringify(service, null, 2));
		// TODO - FP1-142 - block/unblock service using CCOM.UserAuth.addRestrictedChannel
		var masterPin = "1234"; // TODO: Huw - Temp only - Where should this be pulled from?
		if (service.blocked) {
		// TODO - FP1-142 - Huw -change this call to the o5 version (currently throws an error)
			CCOM.UserAuth.addRestrictedChannel(masterPin, service.serviceId);
		} else {
			// TODO - FP1-142 - Huw -change this call to the o5 version (currently throws an error)
			CCOM.UserAuth.removeRestrictedChannel(masterPin, service.serviceId);
		}
	}

	/**
	 * @method init
	 */
	function init() {
		$util.Events.on("app:EPG:channel:block", block);
		$util.Events.on("app:EPG:channel:unblock", unblock);
		$util.Events.on("app:EPG:channel:toggleBlock", toggleBlock);
	}

	return {
		init: init
	};

}());
