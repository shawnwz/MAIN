"use strict";

$service.SDP.FoxtelSignon = (function FoxtelSignon() {
	var isSignedOn = false;
	var authToken = null;
	var cdsn = $config.getConfigValue("network.server.qsp.CDSN");

	/**
	 * @method _signon
	 */
	function _signon() {
		var postData = "arg0="+cdsn;
		$service.SDP.Base.request("signonService", "signonByCASN", postData).then(function(data) {
							isSignedOn = true;

							if (data && data.token) {
								authToken = data.token;
								console.log("Signon success. Token:"+authToken);
							}
						}, 
						function (data) { 
							console.log("Failed to signon");
						});
	}

	function _isSignedOn() {
		return isSignedOn;
	}
	
	function getAuthToken() {
	    return authToken;
	}

    return {
        signon: _signon,
        isSignedOn: _isSignedOn,
        getAuthToken: getAuthToken
    };
}());




