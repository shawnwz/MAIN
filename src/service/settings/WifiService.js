/**
 * @class $service.settings.WifiService
 * @ author Siddharth
 */
"use strict";

$service.settings.WifiService = (function WifiService() {
	var scanStarted = false,
		wifiInterface = null,
		wifilist = [],
		scanStatusCb = function() {};

	/**
     * This callback invoked if the wifi scan is failed. Reset the data list.
     * @method wifiScanFailureCallBack
     * @param {Object} e Failure status
     */
	function wifiScanFailureCallBack() {
		console.log("wifiScanFailure");
		scanStarted = false;
		scanStatusCb(wifilist);
	}

	/**
     * Get the wireless interface and start the scan.
     * @method scan
     * @param {Function} statusCb scan status callback function.
     * @return {void}
     */
    function scanWirelessNetwork(statusCb) {
        if (!scanStarted) {
        	scanStatusCb = statusCb || function() {};
        	if (wifiInterface) {
            	scanStarted = true;
            	CCOM.IpNetwork.scanForWirelessNetworks(wifiInterface.id);
        	} else {
        		// push dummy data temporary need to remove when wifi start working
        		var tempArr = app.screenConfig.settings.WIFI_OPTIONS.getMenu();
        		wifilist = tempArr[1].data.get();
        		wifiScanFailureCallBack();
        	}
          
        }
    }

	/**
     * To get connected network ssid.
     * @method getConnectedSsid
     * @return {String}
     */
	function getConnectedSsid() {
		return "sid";
	}

	/**
     * This callback invoked if the wifi scan is success.
     * @method wifiScanSuccessCallBack
     * @param {Object} e access point information(ssid, security, etc)
     * @return {void}
     */
	function wifiScanSuccessCallBack(e) {
		if ((e) && (e.networks)) {
            var ssidConnected = getConnectedSsid(),
            	networks = e.networks || null,
            	networkLength = networks ? networks.length : 0,
            	selectedNtw = [],
            	network,
				i;
			wifilist = [];
            for (i = 0; i < networkLength; ++i) {
            		network = networks[i];
                   if (ssidConnected === network.ssid) {
                        selectedNtw.push(network);
                    } else {
                       	wifilist.push(network);
                    }
                }
           
           // wifilist.sort(this.sortByNwQualityCb);
            wifilist = selectedNtw.concat(wifilist);
            scanStatusCb(wifilist);
            scanStarted = false;
          }
	}

	/**
     * This callback invoked if the wifi scan is failed. Reset the data list.
     * @method wifiScanFailureCallBack
     * @param {Object} e Failure status
     */
	function getAvalibaleWifiNetork (callback) {
		scanWirelessNetwork(callback);
	}

	/**
     * Register scan ok, scan failed, connect ok and connect failed event listener callback.
     * @method registerListners
     * @return {void}
     */
	function registerListners() {
		CCOM.IpNetwork.addEventListener("scanForWirelessNetworksOK", wifiScanSuccessCallBack);
        CCOM.IpNetwork.addEventListener("scanForWirelessNetworksFailed", wifiScanFailureCallBack);
       // CCOM.IpNetwork.addEventListener("connectToWirelessNetworkOK", this.connectOkCb.bind(this));
        //CCOM.IpNetwork.addEventListener("connectToWirelessNetworkFailed", this.connectFailCb.bind(this));
        //CCOM.IpNetwork.addEventListener("disconnectFromWirelessNetworkOK", this.disconnectOkCb.bind(this));
        //CCOM.IpNetwork.addEventListener("disconnectFromWirelessNetworkFailed", this.disconnectFailCb.bind(this));
	}

	/**
     * To get wifi interface.
     * @method getwifiInterFace
     * @return {Object}
     */
	function getwifiInterFace() {
		var interfaceObj = null,
        	allIPInterface = CCOM.IpNetwork.interface,
        	interfaceLength = allIPInterface.length,
        	ipinterface,
       		i = 0;
        for (i = 0; i < interfaceLength; ++i) {
            ipinterface = allIPInterface[i];
            if (ipinterface.type === CCOM.IpNetwork.INTERFACE_TYPE_WIRELESS) {
                interfaceObj = ipinterface;
                o5.platform.system.Network.configureWifi(interfaceObj.name);
                break;
            }
        }
        return interfaceObj;
	}

	/**
     * To Initilaize wifi service.
     * @method init
     * @return {void}
     */
	function init () {
		 wifiInterface = getwifiInterFace();
     	 registerListners();
        //getConnectedDetails();
	}

	return {
		init                  : init,
		getAvalibaleWifiNetork: getAvalibaleWifiNetork
		};
}());
