/**
 * @class Channel
 * @service
 */
"use strict";

$service.EPG.Channel = (function Channel() {
	var _channelCache,
		_channels = [],
		_initialised = false;

	/**
	 * @method postMessage
	 */
	function receiveMessage(cmd, data) {
		// console.log("Channel > Receiving message");
		// console.log(JSON.stringify(e.data, null, 2));

		switch (cmd) {
			case "COMMAND":
				break;
		}
	}
	/**
	 * @method get
	 */
	function get() {
		return  _channels;
	}

	/**
	 * Useful for map functions
	 *
	 * @method getServiceId
	 * @return serviceId
	 */
	function getServiceId(channel) {
		return channel.serviceId;
	}

	/**
	 * @method getByServiceId
	 * @public
	 * @param {String} serviceId
	 * @return {EPGService}
	 */
	function getByServiceId(serviceId) {
		return _channels.filter(function (channel) {
			return channel.serviceId === serviceId;
		})[0];
	}

	/**
	 * @method getPreviousByServiceId
	 * @public
	 * @param {EPGService} service
	 * @return {EPGService}
	 */
	function getPreviousService(service) {
		var index = _channels.indexOf(service);
		index = (index + _channels.length - 1) % _channels.length;
		return _channels[index];
	}

	/**
	 * @method getNextByServiceId
	 * @public
	 * @param {EPGService} service
	 * @return {EPGService}
	 */
	function getNextService(service) {
		var index = _channels.indexOf(service);
		index = (index + _channels.length + 1) % _channels.length;
		return _channels[index];
	}

	/**
	 * @method cache
	 * @param  {Object} [] channels
	 */
	function cache(channels) {
		// TODO: FP1-202 - Reinstate cacheChannels when de-duping and channel intelligence is added
		_channelCache.sendMessage(
			"cache", {"channels": channels}
		);
	}

	/**
	 * @method addExtraChannels
	 * TODO: FP1-202 - Delete when MDS Channels are reintegrated
	 */
	function addExtraChannels() {
		while (_channels.length !== 0 && _channels.length < 9) {
			_channels = _channels.concat(_channels);
		}
	}

	/**
	 * @method siChannelsUpdated
	 */
	function siChannelsUpdated() {
		_channels = o5.platform.btv.EPG.getAllChannels();
		addExtraChannels();
		// TODO: Cache channels
		// cache(_channels);
	}

	/**
	 * @method svlChannelsUpdated
	 */
	function svlChannelsUpdated() {
		// TODO: FP1-202 - Ask user to rescan if not as part of regular chanels scan
		// TODO: FP1-202 - May need to trigger an MDS update ? or fetch from MDS Service if (disabled for demo)
	}

	/**
	 * @method scanComplete
	 *
	 * Scan complete in settings/first time install
	 * We should refresh our channels
	 */
	function scanComplete() {
		o5.platform.btv.EPG.refresh();
		// TODO: FP1-202 - May need to trigger an MDS update ? or fetch from MDS Service if (disabled for demo)
		mdsChannelsUpdated([]);  // TODO: refresh MDS channels when re-instated after demo
	}

	/**
	 * @method scanFailed
	 *
	 * Scan failed in settings/first time install
	 */
	function scanFailed () {
		var lastTunedServiceId, channelToTune;
		lastTunedServiceId = o5.platform.system.Preferences.get("tv.currentServiceId");
        channelToTune = $service.EPG.Channel.getByServiceId(lastTunedServiceId) || $service.EPG.Channel.get()[0];
        if (channelToTune) {
            $util.ControlEvents.fire("app-video", "setSrc", channelToTune, true);
        }
	}

	/**
	 * @method sortByLcn
	 * @param {Object} chanA
	 * @param {Object} chanB
	 */
	function sortByLcn(chanA, chanB) {
		return chanA.logicalChannelNum - chanB.logicalChannelNum;
	}

	/**
	 * @method mdsChannelsUpdated
	 * @param  {Object}[] channels
	 */
	function mdsChannelsUpdated(channels) {
		o5.platform.btv.EPG.refresh();

		_channels.sort(sortByLcn);

		$util.Events.fire("service:EPG:channel:updated", _channels);
		if (!_initialised && _channels.length) {
			//TODO: This needs rethinking, need to retune if previous channel is unavailable or was not set
			// _initialised = true; //
            $util.ControlEvents.fire("app-video", "setSrc", _channels[0]);
		}

		// TODO: FP1-142 - Add code to retrieve blocked/unblocked
		// status of channels and augment channel lineup
	}

	/**
	 * @method setUpWorker
	 */
	function setUpWorker() {
		_channelCache = new $util.WebWorker("./service/EPG/worker/ChannelCache.js");
		_channelCache.receiveMessage = receiveMessage;
	}

	/**
	 * @method init
	 */
	function init() {
		// setUpWorker();
		o5.platform.btv.EPG.init();

		$util.Events.on("service:EPG:channel:get", get, this);
		$util.Events.on("service:MDS:channel:fetched", mdsChannelsUpdated, this);
		$util.Events.on("settings:scan:complete", scanComplete, this);
		$util.Events.on("settings:scan:failed", scanFailed, this);
		o5.platform.btv.EPG.registerSvlUpdateCallback(svlChannelsUpdated, this);
		o5.platform.btv.EPG.registerRefreshCallback(siChannelsUpdated, this);
	}

	return {
		init: init,
		get: get,
		getServiceId: getServiceId,
		getNextService: getNextService,
		getPreviousService: getPreviousService,
		getByServiceId: getByServiceId
	};
}());
