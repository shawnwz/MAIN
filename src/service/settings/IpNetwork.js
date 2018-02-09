/**
 * @class $service.settings.IpNetwork
 */
"use strict";

$service.settings.IpNetwork = (function IpNetwork() {
    return {

        /**
         * @method getDhcpStatusOptions
         * @public
         * @return {Object}
         */
        getDhcpStatusOptions: function getDhcpStatusOptions() {
            return [
                {
                    id   : "dhcpStatusEnabled",
                    value: true,
                    text : "TCPIP_DHCP"
                },
                {
                    id   : "dhcpStatusDisabled",
                    value: false,
                    text : "TCPIP_Manual"
                }
            ];
        },

        /**
         * @method getDownloadBufferSizeOptions
         * @public
         * @return {Object}
         */
        getDownloadBufferSizeOptions: function getDownloadBufferSizeOptions() {
            return [
                {
                    id   : "downloadBufferSizeAuto",
                    value: "auto",
                    text : "settingsDownloadControlAuto"
                },
                {
                    id   : "downloadBufferSizeSmall",
                    value: "small",
                    text : "settingsDownloadControlSmall"
                },
                {
                    id   : "downloadBufferSizeMedium",
                    value: "medium",
                    text : "settingsDownloadControlMedium"
                },
                {
                    id   : "downloadBufferSizeLarge",
                    value: "large",
                    text : "settingsDownloadControlLarge"
                }
            ];
        },

        /**
         * @method getBandwidthQualityOptions
         * @public
         * @return {Object}
         */
        getBandwidthQualityOptions: function getBandwidthQualityOptions() {
            return [
                {
                    id   : "bandwidthQualityBest",
                    value: "best",
                    text : "settingsDownloadControlBest"
                },
                {
                    id   : "bandwidthQualityLow",
                    value: "low",
                    text : "settingsDownloadControlLow"
                }
            ];
        },


		/**
		 * @method isDhcpEnabled
		 * @private
		 * @param {Boolean} returns true if DHCP is enabled, Otherwise false.
		 */
		isDhcpEnabled: function isDhcpEnabled () {
			return o5.platform.system.Network.isDhcpEnabled();
		},

        /**
         * @method getNetworkConnectionStatus
         * @public
         * @return {Object}
         */
        getNetworkConnectionStatus: function getNetworkConnectionStatus() {
            var isEthernetNetAvailable = o5.platform.system.Network.isEthernetAvailable(),
                isWifiAvailable = o5.platform.system.Network.isEthernetAvailable(),
                connectionStatusObject = {};
                if (isEthernetNetAvailable) {
                    connectionStatusObject = {
                        isConnected  : true,
                        networkType  : o5.platform.system.Network.NetworkType.ETHERNET,
                        interfaceType: o5.platform.system.Network.InterfaceType.INTERFACE_TYPE_WIRED
                    };
                } else if (isWifiAvailable) {
                    connectionStatusObject = {
                            isConnected  : true,
                            networkType  : o5.platform.system.Network.NetworkType.WIFI,
                            interfaceType: o5.platform.system.Network.InterfaceType.INTERFACE_TYPE_WIRELESS
                        };
                } else {
                    connectionStatusObject = {
                        isConnected  : false,
                        networkType  : "Unknown", // no need to worry about network type as its not needed.
                        interfaceType: "unknown"
                    };
                }
            return connectionStatusObject;
        }
    };
}());