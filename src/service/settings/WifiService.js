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
     * @method scanWirelessNetwork
     * @param {Function} statusCb scan status callback function.
     * @return {void}
     */
    function scanWirelessNetwork(statusCb) {
        if (!scanStarted) {
        	wifilist = [];
        	scanStatusCb = statusCb || function() {};
        	if (wifiInterface) {
            	scanStarted = true;
            	CCOM.IpNetwork.scanForWirelessNetworks(wifiInterface.id);
        	} else {
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
		return o5.platform.system.Preferences.get($util.constants.WIFI_CONFIG_PATH.SSID, true);
	}

	/**
     * This callback invoked if the wifi scan is success.
     * @method wifiScanSuccessCallBack
     * @param {Object} e access point information(ssid, security, etc)
     * @return {void}
     */
	function wifiScanSuccessCallBack(e) {
		if ((e) && (e.networks)) {
           	wifilist = e.networks;
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
     * To .
     * @method saveWifiDetails
     */
	function saveWifiDetails(data) {
		if (data) {
			o5.platform.system.Preferences.set($util.constants.WIFI_CONFIG_PATH.SSID, data.ssid, true);
			o5.platform.system.Preferences.set($util.constants.WIFI_CONFIG_PATH.SECURITY, data.security, true);
			o5.platform.system.Preferences.set($util.constants.WIFI_CONFIG_PATH.KEY, data.key, true);
			o5.platform.system.Preferences.set($util.constants.WIFI_CONFIG_PATH.ENCRYPTION, data.encryptMode, true);
		}
	}

	/**
     * To .
     * @method wifiConnectSuccessCallback
     * @return {Object}
     */
	function wifiConnectSuccessCallback(e) {
		 saveWifiDetails(e.details);
		 $util.Events.fire("wifiConnectSuccess", e.details);
		 
	}

	/**
     * To .
     * @method wifiConnectFailureCallBack
     * @return {Object}
     */
	function wifiConnectFailureCallBack(e) {
		 $util.Events.fire("wifiConnectFailure", e.error);
	}

	/**
     * To coonect wifi interface.
     * @method conncetToWifi
     * @return {Object}
     */
	function conncetToWifi(wifiObject, key) {
		if (wifiObject.security === $util.constants.SECURITY_TYPE.OPEN) {
			CCOM.IpNetwork.connectToWirelessNetwork(wifiInterface.id, wifiObject.ssid, wifiObject.security, wifiObject.key, wifiObject.encryptMode);
		} else {
			CCOM.IpNetwork.connectToWirelessNetwork(wifiInterface.id, wifiObject.ssid, wifiObject.security, key, wifiObject.encryptMode);
		}
		
	}

	/**
     * Register scan ok, scan failed, connect ok and connect failed event listener callback.
     * @method registerListners
     * @return {void}
     */
	function registerListners() {
		CCOM.IpNetwork.addEventListener("scanForWirelessNetworksOK", wifiScanSuccessCallBack);
        CCOM.IpNetwork.addEventListener("scanForWirelessNetworksFailed", wifiScanFailureCallBack);
        CCOM.IpNetwork.addEventListener("connectToWirelessNetworkOK", wifiConnectSuccessCallback);
        CCOM.IpNetwork.addEventListener("connectToWirelessNetworkFailed", wifiConnectFailureCallBack);
        //CCOM.IpNetwork.addEventListener("disconnectFromWirelessNetworkOK", this.disconnectOkCb.bind(this));
        //CCOM.IpNetwork.addEventListener("disconnectFromWirelessNetworkFailed", this.disconnectFailCb.bind(this));
	}

	/**
     * To Initilaize wifi service.
     * @method init
     * @return {void}
     */
	function init () {
		 wifiInterface = getwifiInterFace();
		 $util.Events.on("connectToWifi", conncetToWifi);
		 $util.Events.on("scanWifi", getAvalibaleWifiNetork);
     	 registerListners();
	}

	return {
		init                  : init,
		getAvalibaleWifiNetork: getAvalibaleWifiNetork,
		getConnectedSsid      : getConnectedSsid,
		conncetToWifi         : conncetToWifi
		};
}());
