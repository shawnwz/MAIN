"use strict";
app.screenConfig.settings.NETWORKSETTINGS = {
	component      : "settingsConfig",
    text           : "settingsMenuTitleNetworkSettings",
	footerClassList: [ "ctaClose", "ctaTCPIPSettings", "ctaRenewDHCP" ],
	getMenu        : function getMenu() {
		var connectionStatus = $service.settings.IpNetwork.getNetworkConnectionStatus(),
			ipInterface = o5.platform.system.Network.getInterfaceByType(connectionStatus.interfaceType),
			ipAddress = o5.platform.system.Network.getIpAddress(ipInterface),
			subnetMask = o5.platform.system.Network.getSubnetMask(ipInterface),
			gateway = o5.platform.system.Network.getGateway(ipInterface),
			macAddress = o5.platform.system.Network.getRealMacAddress(),
			dnsServers = o5.platform.system.Network.getDnsServers(ipInterface),
			wifiNetworkNamemenuItem = "",
			networkSettingsDetails = [];
			if (macAddress) { // formatting CCOM format- 20-D5-BF-C4-97-54 and UI display format- 20:D5:BF:C4:97:54
				macAddress = macAddress.split('-').join(':');
			}
			networkSettingsDetails = [
			{
				id  : "settingsMenuNetworkSettingsInterfaceStatus",
                text: "settingsNetworkDetailsStatus",
				data: {
                    type: "settingsText",
					get : function get() {
						return {
                            text: (connectionStatus.isConnected === true) ? "settingsEthernetConnected" : "[Disconnected]"
                            //text: "settingsEthernetConnected" // WIP
						};
					},
					events: []
				}
			},

			/* need to cross verify for the requirement
			{
				id  : "settingsMenuNetworkSettingsDhcpStatus",
                text: "settingsMenuTitleTcpIPConfig",
				data: {
					type: "settingsToggle",
					get : function get() {
						return $service.settings.IpNetwork.getDhcpStatusOptions();
					},
					getSelectedIndex: function getSelectedIndex() {
						return (o5.platform.system.Network.isDhcpEnabled()) ? 0 : 1;
					},
					events: [
						{
							name: "settings:networkSettings:setDhcpStatus"
						}
					]
				}
			},
			// If the toggling between manual and dhcp is required, then use the above object which is commented and remove the below object
			{
				id  : "settingsMenuNetworkSettingsDhcpStatus",
                text: "settingsMenuTitleTcpIPConfig",
				data: {
                    type: "settingsText",
					get : function get() {
						return {
                            text: (connectionStatus.isConnected === true) ? "TCPIP_DHCP" : "unknown"
						};
					},
					events: []
				}
			},
			*/
			{
				id  : "settingsMenuNetworkSettingsIpAddress",
                text: "settingsNetworkDetailsIPAddress",
				data: {
                    type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
                            text : (connectionStatus.isConnected && ipAddress) ? ipAddress : "unknown",
							value: ipAddress
						};
					},
					events: []
				}
			},
			{
				id  : "settingsMenuNetworkSettingsSubnetMask",
                text: "settingsNetworkDetailsSubnetMask",
				data: {
                    type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
                            text : (connectionStatus.isConnected && subnetMask) ? subnetMask : "unknown",
							value: subnetMask
						};
					},
					events: []
				}
			},
			{
				id  : "settingsMenuNetworkSettingsDefaultGateway",
                text: "settingsNetworkDetailsDefaultGateway",
				data: {
                    type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
                            text : (connectionStatus.isConnected && gateway) ? gateway : "unknown",
							value: gateway
						};
					},
					events: []
				}
			},
			{
				id  : "settingsMenuNetworkSettingsPrimaryDNS",
                text: "settingsNetworkDetailsPrimaryDNS",
				data: {
                    type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
                            text : (connectionStatus.isConnected && dnsServers[0]) ? dnsServers[0] : "unknown",
							value: dnsServers[0]
						};
					},
					events: []
				}
			},
			{
				id  : "settingsMenuNetworkSettingsSecondaryDNS",
                text: "settingsNetworkDetailsSecondaryDNS",
				data: {
                    type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
                            text : (connectionStatus.isConnected && dnsServers[1]) ? dnsServers[1] : "unknown",
							value: dnsServers[1]
						};
					},
					events: []
				}
			},
			{
				id  : "settingsMenuNetworkSettingsMacAddress",
                text: "settingsNetworkDetailsMACAddress",
				data: {
                    type      : "settingsText",
					isEditable: false,
					get       : function get() {
						return {
                            text : (macAddress === undefined) ? "unknown" : macAddress,
							value: macAddress
						};
					},
					events: []
				}
			}
		];
		//If ethernet connection is not available and wifi conncetion available and status is connected, then only display the wifi network name.
		// This should be re-worked during the implementation of Wi-Fi network details implementation.
		if (connectionStatus.networkType === o5.platform.system.Network.NetworkType.WIFI && connectionStatus.isConnected) {
			wifiNetworkNamemenuItem = {
				id  : "settingsMenuNetworkSettingsWifiNetwork",
                text: "settingsNetworkDetailsWifiNetwork",
				data: {
                    type: "settingsText",
					get : function get() {
						return {
                            text: (connectionStatus.isConnected === true && connectionStatus.networkType === o5.platform.system.Network.NetworkType.WIFI) ? "settingsEthernetConnected" : "[Disconnected]" // WIP
						};
					},
					events: []
				}
			};
			networkSettingsDetails = networkSettingsDetails.push(wifiNetworkNamemenuItem);
		}
		return networkSettingsDetails;
	}
};
