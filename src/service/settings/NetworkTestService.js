/**
 * @class $service.settings.NetworkTestService
 * @ author AshwaniKumar
 */
"use strict";

$service.settings.NetworkTestService = (function NetworkTestService() {

        function getSDPAuthToken() {
            return $service.SDP.FoxtelSignon.getAuthToken();
        }

        function triggerNetwortTest() {
            var postDataForGetDeviceByCASN = {
        	    "arg0": $util.constants.PRODUCTION_CDSN,
        	    "token": getSDPAuthToken()
            },
            postDataForChannelService = {
        	    "token": getSDPAuthToken()
            };
            $service.SDP.Base.request("deviceService", "getDeviceByCASN", postDataForGetDeviceByCASN).then(function() {
        	$util.Events.fire('settings:updateModemUI', { "isSuccessful": true });
        	$service.SDP.Base.request("channelService", "getAllAuthorizedCCLSForDevice", postDataForChannelService).then(function() {
        	    $util.Events.fire('settings:updateFoxtelUI', { "isSuccessful": true });
        	}, function() {
        	    $util.Events.fire('settings:updateFoxtelUI', { "isSuccessful": false });
        	});
            }, function() {
        	$util.Events.fire('settings:updateModemUI', { "isSuccessful": false });
            });
        }

        /**
        * Register requesting SDP.
        * @method registerListners
        * @return {void}
        */
	function registerListners() {
	    $util.Events.on('settings:triggerNetwortTest', triggerNetwortTest);
	}


	/**
     * To Initilaize NetworkTestService service.
     * @method init
     * @return {void}
     */
	function init () {
	    registerListners();
	}

	return {
	    init: init
	};
}());
