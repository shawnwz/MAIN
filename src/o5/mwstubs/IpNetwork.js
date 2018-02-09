/**
 * Stub for IpNetwork: CCOM.IpNetwork, for managing IP networks
 * This singleton object has been added since OTV v5.0.0
 * @ignore
 */
CCOM.IpNetwork = new (function IpNetwork ()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.IpNetwork";
	this._id = CCOM.stubs.uuid();
	// events
	this._EVENT_ON_PING_STATUS = "onPingStatus";
	this._EVENT_ON_STATUS_CHANGED = "onStatusChanged";
	this._EVENT_ON_LINK_UP = "onLinkUp"; //otv:deprecated="5.1.3"
	this._EVENT_ON_LINK_DOWN = "onLinkDown"; //otv:deprecated="5.1.3"
	this._EVENT_ON_IP_RECEIVED = "onIpReceived";//otv:deprecated="5.1.3"
	this._EVENT_ON_IP_LOST = "onIpLost";  //otv:deprecated="5.1.3"
	this._EVENT_ON_INTERFACE_REMOVED = "onInterfaceRemoved"; //otv:deprecated="5.1.3"
	this._EVENT_ON_INTERFACE_ADDED = "onInterfaceAdded"; //otv:deprecated="5.1.3"
	this._EVENT_ON_SIGNAL_LOST = "onSignalLost"; //otv:deprecated="5.1.3"
	this._EVENT_ON_SIGNAL_LOW = "onSignalLow";  //otv:deprecated="5.1.3"
	this._EVENT_ON_SIGNAL_OK = "onSignalOK";    //otv:deprecated="5.1.3"
	this._EVENT_ON_DNS_CHANGED = "onDnsChanged";  //otv:deprecated="5.1.3"
	this._EVENT_ON_IPV6_ADDRESS_CHANGE = "onIpv6AddressChange"; //otv:deprecated="5.1.3"
	
	// event from methods
	this._EVENT_CONNECT_TO_WIRELESS_NETWORK_FAILED = "connectToWirelessNetworkFailed";
	this._EVENT_CONNECT_TO_WIRELESS_NETWORK_OK = "connectToWirelessNetworkOK";
	this._EVENT_DISCONNECT_FROM_WIRELESS_NETWORK_FAILED ="disconnectFromWirelessNetworkFailed";
	this._EVENT_DISCONNECT_FROM_WIRELESS_NETWORK_OK ="disconnectFromWirelessNetworkOK";
	this._EVENT_GET_INTERFACE_STATE_OK = "getInterfaceStateOK";
	this._EVENT_GET_INTERFACE_STATE_FAILED = "getInterfaceStateFailed";
	this._EVENT_PING_FAILED = "pingFailed";
	this._EVENT_PING_OK = "pingOK";
	this._EVENT_SCAN_FOR_WIRELESS_NETWORKS_FAILED = "scanForWirelessNetworksFailed";
	this._EVENT_SCAN_FOR_WIRELESS_NETWORKS_OK = "scanForWirelessNetworksOK";
	this._EVENT_SET_INTERFACE_STATE_OK = "setInterfaceStateOK";
	this._EVENT_SET_INTERFACE_STATE_FAILED = "setInterfaceStateFailed";
	this._EVENT_SET_IP_ADDRESS_OK = "setIpAddressOK";            //otv:deprecated="5.1.3"
	this._EVENT_SET_IP_ADDRESS_FAILED = "setIpAddressFailed";    //otv:deprecated="5.1.3"
	this._EVENT_SET_IP_ADDRESS_AND_GATEWAY_OK = "setIpAddressAndGatewayOK"; //otv:deprecated="5.1.3"
	this._EVENT_SET_IP_ADDRESS_AND_GATEWAY_FAILED = "setIpAddressAndGatewayFailed"; //otv:deprecated="5.1.3"
	this._EVENT_CONTROL_INTERFACE_OK = "controlInterfaceOK";            //otv:deprecated="5.1.3"
	this._EVENT_CONTROL_INTERFACE_FAILED = "controlInterfaceFailed";    //otv:deprecated="5.1.3"
	this._EVENT_CONNECT_TO_WPS_NETWORK_OK = "connectToWpsNetworkOK";    //otv:deprecated="5.1.3"
	this._EVENT_CONNECT_TO_WPS_NETWORK_FAILED = "connectToWpsNetworkFailed";  //otv:deprecated="5.1.3"
	this._EVENT_GET_INTERFACE_CONFIG_OK = "getInterfaceConfigOK";            //otv:deprecated="5.1.3"
	this._EVENT_GET_INTERFACE_CONFIG_FAILED = "getInterfaceConfigFailed";   //otv:deprecated="5.1.3"
	this._EVENT_SET_INTERFACE_CONFIG_OK = "setInterfaceConfigOK";           //otv:deprecated="5.1.3"
	this._EVENT_SET_INTERFACE_CONFIG_FAILED = "setInterfaceConfigFailed";   //otv:deprecated="5.1.3"
	this._EVENT_GET_IPV6_INTERFACE_CONFIG_OK = "getIpv6InterfaceConfigOK";  //otv:deprecated="5.1.3"
	this._EVENT_GET_IPV6_INTERFACE_CONFIG_FAILED = "getIpv6InterfaceConfigFailed"; //otv:deprecated="5.1.3"
	this._EVENT_SET_IPV6_INTERFACE_CONFIG_OK = "setIpv6InterfaceConfigOK";          //otv:deprecated="5.1.3"
	this._EVENT_SET_IPV6_INTERFACE_CONFIG_FAILED = "setIpv6InterfaceConfigFailed";  //otv:deprecated="5.1.3"
	this._EVENT_GET_WIRELESS_CONFIG_OK = "getWirelessConfigOK";             //otv:deprecated="5.1.3"
	this._EVENT_GET_WIRELESS_CONFIG_FAILED = "getWirelessConfigFailed";    //otv:deprecated="5.1.3"
	this._EVENT_SET_WIRELESS_CONFIG_OK = "setWirelessConfigOK";          //otv:deprecated="5.1.3"
	this._EVENT_SET_WIRELESS_CONFIG_FAILED = "setWirelessConfigFailed";  //otv:deprecated="5.1.3"
	this._EVENT_SET_WAKE_ON_LAN_OK = "setWakeOnLanOK";             //otv:deprecated="5.1.3"
	this._EVENT_SET_WAKE_ON_LAN_FAILED = "setWakeOnLanFailed";  //otv:deprecated="5.1.3"
	this._EVENT_REFRESH_DEVICE_INFO_OK = "refreshDeviceInfoOK"; //otv:deprecated="5.1.3"
	this._EVENT_REFRESH_DEVICE_INFO_FAILED = "refreshDeviceInfoFailed"; //otv:deprecated="5.1.3"
	this._EVENT_SET_INTERFACE_DNS_OK = "setInterfaceDnsOK";     //otv:deprecated="5.1.3"
	this._EVENT_SET_INTERFACE_DNS_FAILED = "setInterfaceDnsFailed";  //otv:deprecated="5.1.3"
	this._EVENT_SET_INTERFACE_IPV6_DNS_OK = "setInterfaceIpv6DnsOK";  //otv:deprecated="5.1.3"
	this._EVENT_SET_INTERFACE_IPV6_DNS_FAILED = "setInterfaceIpv6DnsFailed";  //otv:deprecated="5.1.3"
	this._EVENT_RESET_DEFAULT_OK = "resetDefaultOK";         //otv:deprecated="5.1.3"
	this._EVENT_RESET_DEFAULT_FAILED = "resetDefaultFailed"; //otv:deprecated="5.1.3"
	this._EVENT_GET_GATEWAY_IDENTITY_FAILED = "getGatewayIdentityFailed";
	this._EVENT_GET_ACS_URL_FAILED = "getAcsUrlFailed";
	this._EVENT_GET_PROVISIONING_CODE_FAILED = "getProvisioningCodeFailed";
	this._EVENT_REDISCOVER_ACS_URL_FAILED = "rediscoverAcsUrlFailed";
	this._EVENT_GET_IPV6_GATEWAY_IDENTITY_FAILED = "getIpv6GatewayIdentityFailed";
	this._EVENT_GET_IPV6_ACS_URL_FAILED = "getIpv6AcsUrlFailed";
	this._EVENT_GET_IPV6_PROVISIONING_CODE_FAILED = "getIpv6ProvisioningCodeFailed";
	this._EVENT_REDISCOVER_IPV6_ACS_URL_FAILED = "rediscoverIpv6AcsUrlFailed";
	this._supportedEvents = [
		this._EVENT_ON_PING_STATUS,
		this._EVENT_ON_STATUS_CHANGED,
		this._EVENT_ON_LINK_UP, //otv:deprecated="5.1.3"
		this._EVENT_ON_LINK_DOWN, //otv:deprecated="5.1.3"
		this._EVENT_ON_IP_RECEIVED, //otv:deprecated="5.1.3"
		this._EVENT_ON_IP_LOST, //otv:deprecated="5.1.3"
        this._EVENT_ON_INTERFACE_REMOVED, //otv:deprecated="5.1.3"
        this._EVENT_ON_INTERFACE_ADDED, //otv:deprecated="5.1.3"
        this._EVENT_ON_SIGNAL_LOST, //otv:deprecated="5.1.3"
        this._EVENT_ON_SIGNAL_LOW, //otv:deprecated="5.1.3"
        this._EVENT_ON_SIGNAL_OK, //otv:deprecated="5.1.3"
        this._EVENT_ON_DNS_CHANGED, //otv:deprecated="5.1.3"
        this._EVENT_ON_IPV6_ADDRESS_CHANGE, //otv:deprecated="5.1.3"
		this._EVENT_CONNECT_TO_WIRELESS_NETWORK_FAILED,
		this._EVENT_CONNECT_TO_WIRELESS_NETWORK_OK,
		this._EVENT_DISCONNECT_FROM_WIRELESS_NETWORK_FAILED,
		this._EVENT_DISCONNECT_FROM_WIRELESS_NETWORK_OK,
		this._EVENT_GET_INTERFACE_STATE_OK,
		this._EVENT_GET_INTERFACE_STATE_FAILED,
		this._EVENT_PING_FAILED,
		this._EVENT_PING_OK,
		this._EVENT_SCAN_FOR_WIRELESS_NETWORKS_FAILED,
		this._EVENT_SCAN_FOR_WIRELESS_NETWORKS_OK,
		this._EVENT_SET_INTERFACE_STATE_OK,
		this._EVENT_SET_INTERFACE_STATE_FAILED,
		this._EVENT_SET_IP_ADDRESS_OK,     //otv:deprecated="5.1.3"
		this._EVENT_SET_IP_ADDRESS_FAILED,  //otv:deprecated="5.1.3"
		this._EVENT_SET_IP_ADDRESS_AND_GATEWAY_OK, //otv:deprecated="5.1.3"
		this._EVENT_SET_IP_ADDRESS_AND_GATEWAY_FAILED, //otv:deprecated="5.1.3"
		this._EVENT_CONTROL_INTERFACE_OK, //otv:deprecated="5.1.3"
		this._EVENT_CONTROL_INTERFACE_FAILED, //otv:deprecated="5.1.3"
		this._EVENT_CONNECT_TO_WPS_NETWORK_OK, //otv:deprecated="5.1.3"
		this._EVENT_CONNECT_TO_WPS_NETWORK_FAILED, //otv:deprecated="5.1.3"
		this._EVENT_GET_INTERFACE_CONFIG_OK, //otv:deprecated="5.1.3"
		this._EVENT_GET_INTERFACE_CONFIG_FAILED, //otv:deprecated="5.1.3"
		this._EVENT_SET_INTERFACE_CONFIG_OK, //otv:deprecated="5.1.3"
		this._EVENT_SET_INTERFACE_CONFIG_FAILED, //otv:deprecated="5.1.3"
		this._EVENT_GET_IPV6_INTERFACE_CONFIG_OK, //otv:deprecated="5.1.3"
		this._EVENT_GET_IPV6_INTERFACE_CONFIG_FAILED, //otv:deprecated="5.1.3"
		this._EVENT_SET_IPV6_INTERFACE_CONFIG_OK, //otv:deprecated="5.1.3"
		this._EVENT_SET_IPV6_INTERFACE_CONFIG_FAILED, //otv:deprecated="5.1.3"
		this._EVENT_GET_WIRELESS_CONFIG_OK,  //otv:deprecated="5.1.3"
		this._EVENT_GET_WIRELESS_CONFIG_FAILED, //otv:deprecated="5.1.3"
		this._EVENT_SET_WIRELESS_CONFIG_OK, //otv:deprecated="5.1.3"
		this._EVENT_SET_WIRELESS_CONFIG_FAILED, //otv:deprecated="5.1.3"
		this._EVENT_SET_WAKE_ON_LAN_OK, //otv:deprecated="5.1.3"
        this._EVENT_SET_WAKE_ON_LAN_FAILED, //otv:deprecated="5.1.3"
        this._EVENT_REFRESH_DEVICE_INFO_OK, //otv:deprecated="5.1.3"
        this._EVENT_REFRESH_DEVICE_INFO_FAILED, //otv:deprecated="5.1.3"
        this._EVENT_SET_INTERFACE_DNS_OK, //otv:deprecated="5.1.3"
        this._EVENT_SET_INTERFACE_DNS_FAILED, //otv:deprecated="5.1.3"
        this._EVENT_SET_INTERFACE_IPV6_DNS_OK, //otv:deprecated="5.1.3"
        this._EVENT_SET_INTERFACE_IPV6_DNS_FAILED, //otv:deprecated="5.1.3"
        this._EVENT_RESET_DEFAULT_OK, //otv:deprecated="5.1.3"
        this._EVENT_RESET_DEFAULT_FAILED, //otv:deprecated="5.1.3"
	 	this._EVENT_GET_GATEWAY_IDENTITY_FAILED,
        this._EVENT_GET_ACS_URL_FAILED,
        this._EVENT_GET_PROVISIONING_CODE_FAILED,
        this._EVENT_REDISCOVER_ACS_URL_FAILED,
        this._EVENT_GET_IPV6_GATEWAY_IDENTITY_FAILED,
        this._EVENT_GET_IPV6_ACS_URL_FAILED,
        this._EVENT_GET_IPV6_PROVISIONING_CODE_FAILED,
        this._EVENT_REDISCOVER_IPV6_ACS_URL_FAILED
	];

	this._DOMAIN = "com.opentv.IpNetwork";
	

	//WirelessEncryption
	this.ENCRYPT_DEFAULT = 0;
	this.ENCRYPT_WEP = 1;
	this.ENCRYPT_TKIP = 2;
	this.ENCRYPT_AES = 3;
	this.ENCRYPT_TKIPAES = 4;
	this.ENCRYPT_PBC_ENROLLEE = 5;
	this.ENCRYPT_PBC_REGISTRAR = 6;
	this.ENCRYPT_PIN_ENROLLEE = 7;
	this.ENCRYPT_PIN_REGISTRAR = 8;
	this.ENCRYPT_NONE = 9;
	//WirelessSecurity
	this.WEP = 0;
	this.WPA = 1;
	this.WPA2 = 2;
	this.OPEN = 3;
	//  WPS= 4,
	// already WPS present under WirelessApConnType
	 //InterfaceType
	this.INTERFACE_TYPE_WIRED = 0;
	this.INTERFACE_TYPE_WIRELESS = 1;
	this.INTERFACE_TYPE_DOCSIS = 2;
	this.INTERFACE_TYPE_VIRTUAL = 3;
	this.INTERFACE_TYPE_BRIDGE = 4;
	this.INTERFACE_TYPE_VLAN = 5;
	//InterfaceState
	this.INTERFACE_STATE_ON = 0;
	this.INTERFACE_STATE_OFF = 1;
	this.INTERFACE_STATE_DISABLE = 2;
	//WirelessProtocol
	this.A = 1;
	this.B = 2;
	this.G = 4;
	this.N = 8;
	//DslModemMode
	this.BRIDGING = 0;
	
	//DslModemProtocol
	
	this.PPPOA = 1;
	//WirelessApFrequency
	//this.2400MHZ= 0;
	//this.5000MHZ= 1;
	//WirelessApConnType
	this.MANUAL = 0;
	this.WPS = 1;
	//DeviceType
	
	//InterfaceProtocol
	this.IPV4 = 0;
	this.IPV6 = 1;
	this.BOTH = 2;
	//AddressAssignMode
	this.STATELESS = 0;
	this.STATELFUL = 1;
	this.DHCPV6 = 2;
	this.STATIC = 3;
	// StatusChangedType
	this.INTERFACE_ADDED = 0;
	this.INTERFACE_REMOVED = 1;
	this.LINK_UP = 2;
	this.LINK_DOWN = 3;
	this.IPV4_LOST = 4;
	this.IPV4_RECEIVED = 5;
	this.IPV6_CHANGED = 6;
	this.DNS_CHANGED = 7;
	this.MULTICAST_INTERFACE_REMOVED = 8;
	this.MULTICAST_INTERFACE_GAINED = 9;
	this.SIGNAL_LOST = 10;
	this.SIGNAL_OK = 11;
	this.SIGNAL_LOW = 12;

	//Methods
	this.setInterfaceState = function(id, state)
	{
		var hd1 = CCOM.stubs.getHandle();

		if (id < this.interface.length)
		{
			if ((this.INTERFACE_STATE_OFF === state) || (state === this.INTERFACE_STATE_ON))
			{

				this.interface[id].state = state;
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_INTERFACE_STATE_OK, {
					target : this,
					handle : hd1
				});
				return hd1;
			}
			else
			{
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_INTERFACE_STATE_FAILED, {
					target : this,
					handle : hd1,
					error : {
						domain : this._DOMAIN,
						name : "setInterfaceStateError",
						message : "Cannot set interface state."
					}
				});
			}
		}
		else
		{
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_INTERFACE_STATE_FAILED, {
				target : this,
				handle : hd1,
				error : {
					domain : this._DOMAIN,
					name : "WrongID",
					message : "Wrong ID number input"
				}
			});
		}
		return hd1;
	};
	this.getInterfaceState = function(id)
	{
		if (id < this.interface.length)
		{
			return this.interface[id].state;
		}
		else
		{
			this.logInfo("Wrong ID number input");
			return {
				error : {
					domain : this._DOMAIN,
					name : "WrongID",
					message : "Wrong ID number input"
				}
			};
		}
	};
	this.connectToWirelessNetwork = function(id, ssid, security, key, encryptMode)
	{
		var hd1 = CCOM.stubs.getHandle();

		for (var i = 0; i < this.wireless.length; i++)
		{
			if (id < this.interface.length)
			{
				if (ssid == this.wirelessDetails[i].ssid && security == this.wirelessDetails[i].security
						&& key == this.wirelessDetails[i].key && encryptMode == this.wirelessDetails[i].encryptMode)
				{
					CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CONNECT_TO_WIRELESS_NETWORK_OK, {
						target : this,
						handle : hd1,
						details : this.wirelessDetails
					});
					return hd1;
				}

			}
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CONNECT_TO_WIRELESS_NETWORK_FAILED, {
			target : this,
			handle : hd1,
			error : {
				domain : this._DOMAIN,
				name : "WrongID",
				message : "Wrong ID number input"
			}
		});
		return hd1;
	};

	this.disconnectFromWirelessNetwork = function(id){
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : this._DOMAIN,
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.ping = function(id, ipAddress, parameters)
	{
		var hdl = CCOM.stubs.getHandle();
		var _ipAddress = "192.168.1.1";
		var _parameters = {
			count : 5,
			interval : 1,
			packetSize : 64,
			timeout : 10
		};

		if (id < this.interface.length)
		{
			if (ipAddress == _ipAddress && parameters == _parameters)
			{
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_PING_OK, {
					target : this,
					handle : hdl
				});
				return hdl;
			}
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_PING_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				name : "invalidIpAddress",
				message : "Invalid IP address."
			}
		});
		return hdl;
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_PING_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				name : "invalidParams",
				message : "Parameter errors."
			}
		});
		return hdl;
	};
	this.scanForWirelessNetworks = function(id)
	{
		var hdl = CCOM.stubs.getHandle();
		var netLen = this.wirelessDetails.length;

		for (var i = 0; i < netLen; i++)
		{
			if (id < this.interface.length)
			{
				if (this.wireless)
				{
					//console.log("Info get " + " ssid: " + wireless[i].ssid + " quality: " + wireless[i].quality + " security: " + wireless[i].security + " encryp_mode: " + wireless[i].encryp_mode + " protocol: " + wireless[i].protocol, true);
					CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SCAN_FOR_WIRELESS_NETWORKS_OK, {
						target : this,
						handle : hdl,
						networks : this.wirelessDetails
					});
					return hdl;
				}
			}
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SCAN_FOR_WIRELESS_NETWORKS_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				name : "wrongID",
				message : "error"
			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.setIpAddress = function(id, ip, netmask, gateway)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_IP_ADDRESS_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.setIpAddressAndGateway = function(id, ip, netmask, gateway)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_IP_ADDRESS_AND_GATEWAY_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.controlInterface = function(id, state)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CONTROL_INTERFACE_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.connectToWpsNetwork = function(id, mode)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CONNECT_TO_WPS_NETWORK_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.getInterfaceConfig = function(id)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_INTERFACE_CONFIG_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.setInterfaceConfig = function(id, ip, netmask, gateway)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_INTERFACE_CONFIG_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.getIpv6InterfaceConfig = function(id)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_IPV6_INTERFACE_CONFIG_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.setIpv6InterfaceConfig = function(id, ip, prefixLength)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_IPV6_INTERFACE_CONFIG_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.getWirelessConfig = function(id)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_WIRELESS_CONFIG_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.setWirelessConfig = function(id, details)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_WIRELESS_CONFIG_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.setWakeOnLan = function(id, enable)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_WAKE_ON_LAN_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.refreshDeviceInfo = function(id)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REFRESH_DEVICE_INFO_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.setInterfaceDns = function(id, dnsList)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_INTERFACE_DNS_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.setInterfaceIpv6Dns = function(id, dnsList)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_INTERFACE_IPV6_DNS_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	//otv:deprecated="5.1.3"
	this.resetDefault = function()
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_RESET_DEFAULT_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : this._DOMAIN,
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	
	this.getGatewayIdentity = function(){
		this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_GATEWAY_IDENTITY_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: _DOMAIN,
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
  };
       
    this.getIpv6AcsUrl = function(){
    	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE,  this._EVENT_GET_IPV6_ACS_URL_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: this._DOMAIN,
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
  };

    this.getAcsUrl = function(){
    	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE,  this._EVENT_GET_ACS_URL_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: this._DOMAIN,
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
  };
          
    this.getProvisioningCode = function(){
    	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_PROVISIONING_CODE_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: this._DOMAIN,
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
  };
     
    this.rediscoverAcsUrl = function(){
    	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REDISCOVER_ACS_URL_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: this._DOMAIN,
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
  };
    
    this.getIpv6GatewayIdentity = function(){
    	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE,this._EVENT_GET_IPV6_GATEWAY_IDENTITY_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: this._DOMAIN,
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
  };
        
    this.getIpv6ProvisioningCode = function(){
    	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE,  this._EVENT_GET_IPV6_PROVISIONING_CODE_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: this._DOMAIN,
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
  };
          
    this.rediscoverIpv6AcsUrl=function(){
    	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE,this._EVENT_REDISCOVER_IPV6_ACS_URL_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: this._DOMAIN,
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
  };

	this.addEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.addEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};
	this.removeEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.removeEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};

	/*
	 * properties
	 */

	Object.defineProperty(this, 'dns', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.ipNetwork) ? CCOM.stubs.stbData.ipNetwork.dns : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'gateway', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.ipNetwork) ? CCOM.stubs.stbData.ipNetwork.gateway : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'interface', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.ipNetwork) ? CCOM.stubs.stbData.ipNetwork.interface : null;
		},
		enumerable: true
		
	});

	Object.defineProperty(this, 'wireless', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.ipNetwork) ? CCOM.stubs.stbData.ipNetwork.wireless : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'cableModem', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.ipNetwork) ? CCOM.stubs.stbData.ipNetwork.cableModem : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'dslModem', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.ipNetwork) ? CCOM.stubs.stbData.ipNetwork.dslModem : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'revision', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.ipNetwork) ? CCOM.stubs.stbData.ipNetwork.revision : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'wirelessAp', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.ipNetwork) ? CCOM.stubs.stbData.ipNetwork.wirelessAp : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'wirelessDetails', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.ipNetwork) ? CCOM.stubs.stbData.ipNetwork.wirelessDetails : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'deviceTypes', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.ipNetwork) ? CCOM.stubs.stbData.ipNetwork.deviceTypes : null;
		},
		enumerable: true
	});

})();
