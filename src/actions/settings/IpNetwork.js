/**
 * @class IpNetwork
 */
$actions.settings.IpNetwork = (function IpNetwork() {

	/**
	 * @method setDhcpStatus
	 * @private
	 * @param {Boolean} enabling
	 */
	function setDhcpStatus(enabling) {
		var wiredInterface,
			ip4Addr,
			ip6Addr,
			subnet,
			gateway,
			dnsServers,
			returnStatus;
		if (enabling === true) {
				wiredInterface = o5.platform.system.Network.getInterfaceByType(o5.platform.system.Network.InterfaceType.INTERFACE_TYPE_WIRED);
				o5.platform.system.Network.enableDHCP(wiredInterface);
				returnStatus = true;
		} else if (enabling === false) {
				ip4Addr = o5.platform.system.Preferences.get("settings.tcpIp.IpAddress");
				ip6Addr = null;
				subnet = o5.platform.system.Preferences.get("settings.tcpIp.subnetMask");
				gateway = o5.platform.system.Preferences.get("settings.tcpIp.defaultGateway");
				dnsServers = o5.platform.system.Preferences.get("settings.tcpIp.primaryDns");
				o5.platform.system.Network.disableDHCP(ip4Addr, ip6Addr, subnet, gateway, dnsServers);
				returnStatus = true;
		} else {
			returnStatus = false;
		}
		return returnStatus;
	}

	/**
	 * @method setDownloadBufferSize
	 * @private
	 * @param {Boolean} bufferSize
	 */
	function setDownloadBufferSize(bufferSize) {
		// TODO FP1-151 Internet Connection - Download Control
		// More logic to be added
		return $config.saveConfigValue("settings.ipnetwork.download.buffer.size", bufferSize);
	}

	/**
	 * @method setBandwidthQuality
	 * @private
	 * @param {Boolean} bwQuality
	 */
	function setBandwidthQuality(bwQuality) {
		// TODO FP1-151 Internet Connection - Download Control
		// More logic to be added
		return $config.saveConfigValue("settings.ipnetwork.bandwidth.quality", bwQuality);
	}

	/**
	 * @method saveDownloadControlItems
	 * @private
	 * @param {Boolean} value
	 */
	function saveDownloadControlItems(saveitems) {
		setDownloadBufferSize(saveitems.settingsMenuDownloadControlDownloadBufferSize);
		setBandwidthQuality(saveitems.settingsMenuDownloadControlBandwidthQuality);
	}

	/* Public API */
	return {

		/**
		 * @method init
		 * @public
		 */
		init: function () {
			o5.platform.system.Network.StateChange.registerListener();
			$util.Events.on("setDhcpStatus", setDhcpStatus);
			$util.Events.on("settings:downloadControl:setDownloadBufferSize", setDownloadBufferSize);
			$util.Events.on("settings:downloadControl:setBandwidthQuality", setBandwidthQuality);
			$util.Events.on("settings:downloadControl:undoChanges", saveDownloadControlItems);
			$util.Events.on("settings:downloadControl:resetDefaults", saveDownloadControlItems);
		}
	};
}());
