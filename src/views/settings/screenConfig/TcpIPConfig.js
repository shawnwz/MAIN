"use strict";
var ipconfigOptions = $service.settings.IpNetwork.getDhcpStatusOptions(),
	notAvailableText,
	ipconfigIndex = 0,
	//macAddress = o5.platform.system.Network.getMacAddress(),
	tcpIpMenuData = {},
	isSelectable = false,
	isDhcpOptionSelected,
	// eslint-disable-next-line no-unused-vars
	ipconfigValue = 0,
	getIpconfigIndex = function () {
		ipconfigOptions.some(function (element, index) {
			if (element.value === o5.platform.system.Preferences.get("settings.tcpIp.IpConfig")) {
				ipconfigIndex = index;
				ipconfigValue = element.value;
				return true;
			}
		});
	},
	gettcpIpMenuData = function () {
		tcpIpMenuData = {};
		isDhcpOptionSelected = o5.platform.system.Preferences.get("settings.tcpIp.IpConfig");
		notAvailableText = $util.Translations.translate("notAvailable");
		if (isDhcpOptionSelected) {
			var ipInterface = o5.platform.system.Network.getInterfaceByType(o5.platform.system.Network.InterfaceType.INTERFACE_TYPE_WIRED) || notAvailableText,
				ipAddress = o5.platform.system.Network.getIpAddress(ipInterface) || notAvailableText,
				subnetMask = o5.platform.system.Network.getSubnetMask(ipInterface) || notAvailableText,
				gateway = o5.platform.system.Network.getGateway(ipInterface) || notAvailableText,
				//macAddress = o5.platform.system.Network.getMacAddress(),
				dnsServers = o5.platform.system.Network.getDnsServers(ipInterface) || notAvailableText,
				primaryDns = notAvailableText,
				secondaryDns = notAvailableText;
				if (dnsServers && dnsServers[0]) {
					primaryDns = dnsServers[0];
				}
				if (dnsServers && dnsServers[1]) {
					secondaryDns = dnsServers[1];
				}
				isSelectable = false;
			tcpIpMenuData = {
				ipAddress     : ipAddress,
				subnetMask    : subnetMask,
				defaultGateway: gateway,
				primaryDns    : primaryDns,
				secondaryDns  : secondaryDns
			};
		} else {
				isSelectable = true;
			tcpIpMenuData = {
				ipAddress     : o5.platform.system.Preferences.get("settings.tcpIp.IpAddress") || $config.getConfigValue("settings.tcpIp.IpAddress"),
				subnetMask    : o5.platform.system.Preferences.get("settings.tcpIp.subnetMask") || $config.getConfigValue("settings.tcpIp.subnetMask"),
				defaultGateway: o5.platform.system.Preferences.get("settings.tcpIp.defaultGateway") || $config.getConfigValue("settings.tcpIp.defaultGateway"),
				primaryDns    : o5.platform.system.Preferences.get("settings.tcpIp.primaryDns") || $config.getConfigValue("settings.tcpIp.primaryDns"),
				secondaryDns  : o5.platform.system.Preferences.get("settings.tcpIp.secondaryDns") || $config.getConfigValue("settings.tcpIp.secondaryDns")
			};
		}
	};

	
getIpconfigIndex();
gettcpIpMenuData();

app.screenConfig.settings.TCPIP = {
		defaultitem: {
			ipConfig: ipconfigIndex
		},
		saveditem: {
			ipConfig: ipconfigIndex
		},
		currentitem: {
			ipConfig: ipconfigIndex
		},
		footerClassList: [],
		getMenu        : function getMenu() {
			getIpconfigIndex();
			gettcpIpMenuData();
			this.saveditem.ipConfig = ipconfigIndex;
			return [
				{
					id  : "ipConfig",
	                text: $util.Translations.translate("settingsMenuTitleTcpIPConfig"),
					data: {
						type        : "settingsToggle",
						isSelectable: true,
						get         : function get() {
							return ipconfigOptions;
						},
						getSelectedIndex: function getSelectedIndex() {
							return ipconfigIndex;
						},
						events: []
					}
				},
				{
					id  : "ipAddress",
	                text: $util.Translations.translate("settingsMenuTcpIPAddress"),
					data: {
						type        : "settingsInputText",
						isSelectable: isSelectable,
						get         : function get() {
							
							return tcpIpMenuData.ipAddress;
						}
					
					}
				},
				{
					id  : "subnetMask",
	                text: $util.Translations.translate("settingsMenuTcpIPSubnet"),
					data: {
						type        : "settingsInputText",
						isSelectable: isSelectable,
						get         : function get() {
							return tcpIpMenuData.subnetMask;
						}
					
					}
				},
				{
					id  : "defaultGateway",
	                text: $util.Translations.translate("settingsMenuTcpIPGateway"),
					data: {
						type        : "settingsInputText",
						isSelectable: isSelectable,
						get         : function get() {
							return tcpIpMenuData.defaultGateway;
						}
					
					}
				},
				{
					id  : "primaryDns",
	                text: $util.Translations.translate("settingsMenuTcpIPPrimaryDNS"),
					data: {
						type        : "settingsInputText",
						isSelectable: isSelectable,
						get         : function get() {
							return tcpIpMenuData.primaryDns;
						}
					
					}
				},
				{
					id  : "secondaryDns",
	                text: $util.Translations.translate("settingsMenuTcpIPSecondaryDNS"),
					data: {
						type        : "settingsInputText",
						isSelectable: isSelectable,
						get         : function get() {
							return tcpIpMenuData.secondaryDns;
						}
					
					}
				}
				// {
					// id  : "MacAddress",
	                // text: "Mac Address",
					// data: {
	                    // type      : "settingsText",
						// isSelectable: false,
						// get       : function get() {
							// return {
	                            // text : (macAddress === undefined) ? "unknown" : macAddress,
								// value: macAddress
							// };
						// },
						// events: []
					// }
				// }
			];
		}
};
