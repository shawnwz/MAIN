"use strict";

$service.SDP.Base = (function Base() {
	$service.SDP.config = {
		base_url : $config.getConfigValue("network.server.qsp.url") + $config.getConfigValue("network.server.qsp.path"),
		timeout : $config.getConfigValue("network.server.mds.timeout") * 1000
	};

	function _request(service, method, postData) {

		if (!postData) {
			console.log("Error: not valid SDP request\n");
			return;
		}
		var url = $service.SDP.config.base_url+"/"+service+"/"+method;

		return $util.fetch(url, $service.SDP.config.timeout, postData);
	}

	/**
	 * @method init
	 */
	function _init() {
		$service.SDP.FoxtelSignon.signon();
	}

    return {
        init: _init,
        request: _request
    };
}());
