"use strict";
var tcpIpconfigOptions = $service.settings.IpNetwork.getDhcpStatusOptions(),
	tcpIpUnknownText,
	tcpIpconfigIndex = 0,
	tcpIpDefaultValueForMenuItems = "0.0.0.0",
	//macAddress = o5.platform.system.Network.getMacAddress(),
	tcpIpMenuData = {},
	tcpIpIsDhcpOptionSelected,
	// eslint-disable-next-line no-unused-vars
	getIpconfigIndex = function () {
		tcpIpconfigOptions.some(function (element, index) {
			if (element.value === o5.platform.system.Preferences.get("settings.tcpIp.IpConfig")) {
				tcpIpconfigIndex = index;
				return true;
			}
		});
	},
	gettcpIpMenuData = function () {
		var ipInterface,
			ipAddress,
			subnetMask,
			gateway,
			dnsServers,
			primaryDns,
			secondaryDns,
			macAddress = $service.settings.IpNetwork.getMacAddress() || tcpIpUnknownText,
			_isDhcpEnabled = $service.settings.IpNetwork.isDhcpEnabled(),
			_isEthernetAvailable = o5.platform.system.Network.isEthernetAvailable();
		tcpIpMenuData = {};
		tcpIpIsDhcpOptionSelected = o5.platform.system.Preferences.get("settings.tcpIp.IpConfig");
		tcpIpUnknownText = $util.Translations.translate("unknown");
		if (tcpIpIsDhcpOptionSelected) {
			ipInterface = o5.platform.system.Network.getInterfaceByType(o5.platform.system.Network.InterfaceType.INTERFACE_TYPE_WIRED) || tcpIpUnknownText;
			ipAddress = o5.platform.system.Network.getIpAddress(ipInterface) || tcpIpUnknownText;
			subnetMask = o5.platform.system.Network.getSubnetMask(ipInterface) || tcpIpUnknownText;
			gateway = o5.platform.system.Network.getGateway(ipInterface) || tcpIpUnknownText;
			dnsServers = o5.platform.system.Network.getDnsServers(ipInterface) || tcpIpUnknownText;
			primaryDns = tcpIpUnknownText;
			secondaryDns = tcpIpUnknownText;
				if (dnsServers && dnsServers[0]) {
					primaryDns = dnsServers[0];
				}
				if (dnsServers && dnsServers[1]) {
					secondaryDns = dnsServers[1];
				}
			tcpIpMenuData = {
				isSelectable  : false,
				ipAddress     : ipAddress,
				subnetMask    : subnetMask,
				defaultGateway: gateway,
				primaryDns    : primaryDns,
				secondaryDns  : secondaryDns,
				macAddress    : macAddress
			};
			if (_isEthernetAvailable === false) {
				tcpIpMenuData = {
					isSelectable  : false,
					ipAddress     : tcpIpUnknownText,
					subnetMask    : tcpIpUnknownText,
					defaultGateway: tcpIpUnknownText,
					primaryDns    : tcpIpUnknownText,
					secondaryDns  : tcpIpUnknownText,
					macAddress    : macAddress
				};
			}
			if (_isDhcpEnabled === false && _isEthernetAvailable === true) {
				tcpIpMenuData = {
					isSelectable  : false,
					ipAddress     : tcpIpDefaultValueForMenuItems,
					subnetMask    : tcpIpDefaultValueForMenuItems,
					defaultGateway: tcpIpDefaultValueForMenuItems,
					primaryDns    : tcpIpDefaultValueForMenuItems,
					secondaryDns  : tcpIpDefaultValueForMenuItems,
					macAddress    : macAddress
				};
			}
		} else {
			tcpIpMenuData = {
				isSelectable  : true,
				ipAddress     : o5.platform.system.Preferences.get("settings.tcpIp.IpAddress") || $config.getConfigValue("settings.tcpIp.IpAddress"),
				subnetMask    : o5.platform.system.Preferences.get("settings.tcpIp.subnetMask") || $config.getConfigValue("settings.tcpIp.subnetMask"),
				defaultGateway: o5.platform.system.Preferences.get("settings.tcpIp.defaultGateway") || $config.getConfigValue("settings.tcpIp.defaultGateway"),
				primaryDns    : o5.platform.system.Preferences.get("settings.tcpIp.primaryDns") || $config.getConfigValue("settings.tcpIp.primaryDns"),
				secondaryDns  : o5.platform.system.Preferences.get("settings.tcpIp.secondaryDns") || $config.getConfigValue("settings.tcpIp.secondaryDns"),
				macAddress    : macAddress
			};
			if ((_isDhcpEnabled === true && _isEthernetAvailable === true) || (_isEthernetAvailable === false)) {
				tcpIpMenuData = {
					isSelectable  : true,
					ipAddress     : tcpIpDefaultValueForMenuItems,
					subnetMask    : tcpIpDefaultValueForMenuItems,
					defaultGateway: tcpIpDefaultValueForMenuItems,
					primaryDns    : tcpIpDefaultValueForMenuItems,
					secondaryDns  : tcpIpDefaultValueForMenuItems,
					macAddress    : macAddress
				};
			}
		}
	};

	
getIpconfigIndex();
gettcpIpMenuData();

app.screenConfig.settings.TCPIP = {
		defaultitem: {
			ipConfig: tcpIpconfigIndex
		},
		saveditem: {
			ipConfig: tcpIpconfigIndex
		},
		currentitem: {
			ipConfig: tcpIpconfigIndex
		},
		footerClassList: [],
		getMenu        : function getMenu() {
			getIpconfigIndex();
			gettcpIpMenuData();
			this.saveditem.ipConfig = tcpIpconfigIndex;
			return [
				{
					id  : "ipConfig",
	                text: $util.Translations.translate("settingsMenuTitleTcpIPConfig"),
					data: {
						type        : "settingsToggle",
						isSelectable: true,
						get         : function get() {
							return tcpIpconfigOptions;
						},
						getSelectedIndex: function getSelectedIndex() {
							return tcpIpconfigIndex;
						},
						events: []
					}
				},
				{
					id  : "ipAddress",
	                text: $util.Translations.translate("settingsMenuTcpIPAddress"),
					data: {
						type        : "settingsInputText",
						isSelectable: tcpIpMenuData.isSelectable,
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
						isSelectable: tcpIpMenuData.isSelectable,
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
						isSelectable: tcpIpMenuData.isSelectable,
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
						isSelectable: tcpIpMenuData.isSelectable,
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
						isSelectable: tcpIpMenuData.isSelectable,
						get         : function get() {
							return tcpIpMenuData.secondaryDns;
						}
					
					}
				},
				{
					id  : "MacAddress",
	                text: $util.Translations.translate("settingsMenuTcpIPMACAddress"),
					data: {
	                    type        : "settingsText",
						isSelectable: tcpIpMenuData.isSelectable,
						get         : function get() {
							return tcpIpMenuData.macAddress;
						}
					}
				}
			];
		}
};
