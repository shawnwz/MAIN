/**
 * This class is concerned with what types of Networks are available on the current system such as:
 *
 * - Ethernet Connection
 * - DVB-C
 * - DVB-S
 * - DVB-T
 *
 * It contains a listener that any class can call to register to a NetworkStateChange event and then runs a callback
 * so that an application can then handle when a network connection is made or disconnected
 *
 * @class o5.platform.system.Network
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.system.Network = new (function Network () {
    this._pingCallbackLookup = {};
})();

/**
 * Enumeration of network types. This can be changed by `configure` and `configureWifi`.
 * @property {String} NetworkType
 * @property {String} NetworkType.ETHERNET Default to "eth0"
 * @property {String} NetworkType.WIFI Default to "ra0"
 */
o5.platform.system.Network.NetworkType = {
    ETHERNET: "eth0",
    WIFI: "ra0"
};

/**
 * Enumeration of interface types
 * @readonly
 * @property {Number} InterfaceType
 * @property {Number} InterfaceType.INTERFACE_TYPE_BRIDGE 4
 * @property {Number} InterfaceType.INTERFACE_TYPE_DOCSIS 2
 * @property {Number} InterfaceType.INTERFACE_TYPE_VIRTUAL 3
 * @property {Number} InterfaceType.INTERFACE_TYPE_VLAN 5
 * @property {Number} InterfaceType.INTERFACE_TYPE_WIRED 0
 * @property {Number} InterfaceType.INTERFACE_TYPE_WIRELESS 1
 */
o5.platform.system.Network.InterfaceType = {};

/**
 * Event handler to fire callback functions
 * @method _fireCallback
 * @private
 * @param {Number} handle Handle
 * @param {Object} lookup Function table
 * @param {Boolean} param Value to send to callback to notify success or failed event notification
 */
o5.platform.system.Network._fireCallback = function _fireCallback (handle, lookup, param) {
    if (handle && lookup[handle]) {
        lookup[handle](param, handle);
        lookup[handle] = null;
        delete lookup[handle];
    }
};

o5.platform.system.Network._pingOKListener = function _pingOKListener (e) {
    var me = o5.platform.system.Network;
    me._fireCallback(e.handle, me._pingCallbackLookup, true);
};

o5.platform.system.Network._pingFailedListener = function _pingFailedListener (e) {
    var me = o5.platform.system.Network;
    me._fireCallback(e.handle, me._pingCallbackLookup, false);
};

/**
 * Returns the id of the interface identified by the interface name.
 * @method _getInterfaceIdUsingName
 * @private
 * @param {String} interfaceName Network type, which is one of the `NetworkType` enumeration.
 * @return {Number} Returns interface id or null if not found.
 */
o5.platform.system.Network._getInterfaceIdUsingName = function _getInterfaceIdUsingName (interfaceName) {
    var interfaces = CCOM.IpNetwork.interface,
        interfacesLength = interfaces.length,
        i;
    for (i = 0; i < interfacesLength; i++) {
        if (interfaces[i].name === interfaceName) {
            return interfaces[i].id;
        }
    }
    return null;
};

/**
 * Called by o5.$.init2() when O5 starts up.
 * @method _init
 * @private
 */
o5.platform.system.Network._init = function _init () {
    // Don't use 'this' as this is called by o5.$.init2()
    var me = o5.platform.system.Network;

    me.InterfaceType = {
        INTERFACE_TYPE_BRIDGE: CCOM.IpNetwork.INTERFACE_TYPE_BRIDGE,
        INTERFACE_TYPE_DOCSIS: CCOM.IpNetwork.INTERFACE_TYPE_DOCSIS,
        INTERFACE_TYPE_VIRTUAL: CCOM.IpNetwork.INTERFACE_TYPE_VIRTUAL,
        INTERFACE_TYPE_VLAN: CCOM.IpNetwork.INTERFACE_TYPE_VLAN,
        INTERFACE_TYPE_WIRED: CCOM.IpNetwork.INTERFACE_TYPE_WIRED,
        INTERFACE_TYPE_WIRELESS: CCOM.IpNetwork.INTERFACE_TYPE_WIRELESS
    };

    CCOM.IpNetwork.addEventListener('pingOK', me._pingOKListener);
    CCOM.IpNetwork.addEventListener('pingFailed', me._pingFailedListener);
};

/**
 * Finds the first CCOM network interface object of the given network type.
 * @method getNetworkByType
 * @param {String} networkType Network type, which is one of the `NetworkType` enumeration.
 * @return {Object} Returns the network interface object or null if not found.
 * The object has the following attributes:
 *
 *        bridgeInterfaces {Array} Indicates the bridge interfaces list in this interface.
 *        dhcpEnabled {Boolean} Indicates whether the link is configured for DHCP.
 *        dhcpExpiry {Number} The expiry time of DHCP lease. If the DHCP mode is not used, this parameter is 0.
 *        gateway {String} The default gateway of the interface. If the interface does not have an IP address, this parameter is empty.
 *        id {Number} The ID of the interface to pass for setting functions.
 *        interfaceProtocol {Number} Specifies the protocol supported by the interface.
 *        ip {String} The IP address of the interface. If the interface does not have an IP address, this parameter is empty.
 *        ipv6 {String} Contains the IPv6 address list.
 *        ipv6AddressAssignMode {Number} Indicates IPv6 address assign mode.
 *        ipv6Gateway {String} Contains the IPv6 gateway list.
 *        ipv6LinkLocal {String} Specifies the IPv6 link local address.
 *        ipv6LocalLength {String} Gives the IPv6 link local prefix length.
 *        ipv6PrefixLength {String} Indicates IPv6 prefix length list.
 *        linkUp {Boolean} Indicates whether the link is up for the interface.
 *        mac {String} The MAC address of the interface.
 *        multicast {Number} Multicast
 *        name {String} Name of the interface, for example, eth0.
 *        netmask {String} The IP netmask address of the interface. If the interface does not have an IP address, this parameter will be 0.0.0.0 or empty.
 *        priority {Number} Indicates the priority of the interface.
 *        state {Number} Indicates on or off for the interface.
 *        type {Number} Type of interface, which is one of the `InterfaceType` enumeration.
 *        wolEnabled {Boolean} Specifies whether wake-on-LAN is enabled for this interface.
 */
o5.platform.system.Network.getNetworkByType = function getNetworkByType (networkType) {
    this.logEntry();
    var network = null,
        interfaces = CCOM.IpNetwork.interface,
        interfacesLength = interfaces.length,
        i;
    for (i = 0; i < interfacesLength; i++) {
        if (interfaces[i].name === networkType) {
            network = interfaces[i];
            break;
        }
    }
    this.logExit(network);
    return network;
};

/**
 * Finds first CCOM Interface of specified interface type
 * @method getInterfaceByType
 * @param {Number} interfaceType Interface type, which is one of the `InterfaceType` enumeration.
 * @return {Object} Returns the network interface object or null if not found. The returned object has the same
 * properties as returned object from `getNetworkByType`.
 */
o5.platform.system.Network.getInterfaceByType = function getInterfaceByType (interfaceType) {
    this.logEntry();
    var interfaceObj = null,
        interfaces = CCOM.IpNetwork.interface,
        interfacesLength = interfaces.length,
        i;
    for (i = 0; i < interfacesLength; i++) {
        if (interfaces[i].type === interfaceType) {
            interfaceObj = interfaces[i];
            break;
        }
    }
    this.logExit(interfaceObj);
    return interfaceObj;
};

/**
 * @method findNetworkByType
 * @deprecated Use getNetworkByType instead.
 * @removed
 */

/**
 * Checks if the given network type is available on the STB
 * @method isNetworkAvailable
 * @param {String} nType Network type, which is one of the `NetworkType` enumeration.
 * @return {Boolean} Returns true if network is available, otherwise false.
 */
o5.platform.system.Network.isNetworkAvailable = function isNetworkAvailable (nType) {
    this.logEntry();
    var isAvailable = false,
        net = this.getNetworkByType(nType);

    if (net && net.linkUp === true) {
        isAvailable = true;
    }
    this.logExit(String(isAvailable));
    return isAvailable;
};

/**
 * Checks if all networks on the STB are available
 * @method isAvailable
 * @return {Boolean} Returns true if all network connections are available, otherwise false.
 */
o5.platform.system.Network.isAvailable = function isAvailable () {
    var i,
        isNetworkAvailable = false,
        interfaces = CCOM.IpNetwork.interface,
        interfacesLength = interfaces.length;

    for (i = 0; i < interfacesLength; i++) {
        isNetworkAvailable = interfaces[i].linkUp;
        if (!isNetworkAvailable) {
            break;
        }
    }

    return isNetworkAvailable;
};

/**
 * @method isDVBAvailable
 * @removed
 */

/**
 * Checks if Ethernet is currently available
 * @method isEthernetAvailable
 * @return {Boolean} Returns true if Ethernet is available, otherwise false.
 */
o5.platform.system.Network.isEthernetAvailable = function isEthernetAvailable () {
    return this.isNetworkAvailable(o5.platform.system.Network.NetworkType.ETHERNET);
};

/**
 * Checks if wireless is currently available
 * @method isWifiAvailable
 * @return {Boolean} Returns true if WiFi is available, otherwise false.
 */
o5.platform.system.Network.isWifiAvailable = function isWifiAvailable () {
    return this.isNetworkAvailable(o5.platform.system.Network.NetworkType.WIFI);
};

/**
 * Connects to the given address using AJAX. The successCallback is called only when the webpage
 * is done loading (readyState==4) and with OK status (status==200).
 * @method connectToAddress
 * @param {String} address The URL to connect to
 * @param {Function} [successCallback] The method to call upon successful connection
 * @param {Function} [failureCallback] The method to call upon failing connection
 * @param {Number} [readyStateTimeoutTimeMS=10000] Time in milliseconds to wait for ready state.
 * This parameter is only used when sync=false.
 * @param {Boolean} [sync=false] True for synchronous call and false for asynchronous call
 */
o5.platform.system.Network.connectToAddress =
function connectToAddress (address, successCallback, failureCallback, readyStateTimeoutTimeMS, sync) {
    this.logEntry();
    var xmlhttp = new XMLHttpRequest(),
        async = (sync === true) ? false : true;

    readyStateTimeoutTimeMS = readyStateTimeoutTimeMS || 10000;

    if (!successCallback) {
        successCallback = function () {};
    }
    if (!failureCallback) {
        failureCallback = function () {};
    }

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 1) {

        } else if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                successCallback();
            } else {
                this.logError("Failed to connect to " + address + ", xmlhttp.error=" + xmlhttp.statusText);
                failureCallback();
            }
        }
    };

    if (async) {
        xmlhttp.ontimeout = function () {
            this.logError("Failed to connect, timed out after " + readyStateTimeoutTimeMS + " ms");
            failureCallback();
        };
        xmlhttp.timeout = readyStateTimeoutTimeMS;
    }

    xmlhttp.open("GET", address, async);
    xmlhttp.send();

    this.logExit();
};

/**
 * @method testConnectionToInternet
 * @removed
 */

/**
 * @method testConnectionToInternetWithDNS
 * @removed
 */

/**
 * Gets the MAC address of the device. If "use.real.mac" is set to false in ConfigManager,
 * it queries ConfigManager for MAC address. Otherwise, it queries CCOM for MAC address.
 * @method getMacAddress
 * @return {String} MAC address in the format of 00-00-00-00-00-00 or null if not found
 */
o5.platform.system.Network.getMacAddress = function getMacAddress () {
    this.logEntry();
    var macAddress = null;

    if (o5.platform.system.Preferences.get("use.real.mac") === 'false') {
        macAddress = o5.platform.system.Preferences.get("hard.coded.mac") || null;
        if (macAddress) {
            macAddress = macAddress.replace(/:/g, "-");
            macAddress = macAddress.replace(/\n/g, "");
        }
    } else {
        macAddress = this.getRealMacAddress();
    }
    this.logExit(macAddress || null);
    return macAddress || null;
};

/**
 * Gets the MAC address of the device by querying CCOM
 * @method getRealMacAddress
 * @return {String} MAC address in the format of 00-00-00-00-00-00 or null if not found
 */
o5.platform.system.Network.getRealMacAddress = function getRealMacAddress () {
    this.logEntry();
    var macAddress = null,
        ethernet = null,
        wifi = null;
    if (this.isEthernetAvailable()) {
        ethernet = this.getNetworkByType(o5.platform.system.Network.NetworkType.ETHERNET);
        macAddress = ethernet.mac || null;
    } else if (this.isWifiAvailable()) {
        wifi = this.getNetworkByType(o5.platform.system.Network.NetworkType.WIFI);
        macAddress = wifi.mac || null;
    }
    if (macAddress) {
        macAddress = macAddress.replace(/:/g, "-");
        macAddress = macAddress.replace(/\n/g, "");
    }
    this.logExit(macAddress || null);
    return macAddress || null;
};

/**
 * Checks if Ethernet DHCP server is enabled or disabled
 * @method isDhcpEnabled
 * @return {Boolean} Returns true if Ethernet DHCP server in the cable modem is enabled,
 * otherwise false.
 */
o5.platform.system.Network.isDhcpEnabled = function isDhcpEnabled () {
    this.logEntry();
    var ethernet = this.getNetworkByType(o5.platform.system.Network.NetworkType.ETHERNET);
    if (ethernet) {
        this.logExit("ethernet.dhcpEnabled");
        return ethernet.dhcpEnabled;
    }
    this.logExit("ethernet not enabled");
    return false;
};

/**
 * @method getDhcp
 * @removed
 */

/**
 * Disables DHCP on the Ethernet network for IPv4 and sets the network settings to the
 * supplied parameters
 * @method disableDHCP
 * @async
 * @param {String} ip4Addr IPv4 address
 * @param {String} ip6Addr Unused parameter
 * @param {String} subnet Subnet
 * @param {String} gateway Gateway
 * @param {Array.<String>} dnsServers DNS servers in an array of strings
 */
o5.platform.system.Network.disableDHCP = function disableDHCP (ip4Addr, ip6Addr, subnet, gateway, dnsServers) {
    this.logEntry();

    var ethernetType = this.isEthernetAvailable() ? o5.platform.system.Network.NetworkType.ETHERNET : o5.platform.system.Network.NetworkType.WIFI,
        id = this._getInterfaceIdUsingName(ethernetType),
        gateway_path,
        ipv4_path,
        netmask_path,
        dns_path;

    CCOM.IpNetwork.setInterfaceState(id, 1);    //CCOM.IpNetwork.INTERFACE_STATE_OFF = 1

    ipv4_path = "/network/ipconfig/interfaces/interface" + id + "/ipv4";
    CCOM.ConfigManager.setValue(ipv4_path, ip4Addr);

    netmask_path = "/network/ipconfig/interfaces/interface" + id + "/netmask";
    CCOM.ConfigManager.setValue(netmask_path, subnet);

    gateway_path = "/network/ipconfig/interfaces/interface" + id + "/gateway";
    CCOM.ConfigManager.setValue(gateway_path, gateway);

    dns_path = "/network/ipconfig/interfaces/interface" + id + "/dns";
    CCOM.ConfigManager.setValue(dns_path, dnsServers);

    setTimeout(function () {
         CCOM.IpNetwork.setInterfaceState(id, 0);   //CCOM.IpNetwork.INTERFACE_STATE_ON = 0
    }, 2500);

    this.logExit();
};

/**
 * Disables DHCP on the Ethernet network for IPv6 and sets the network settings to the
 * supplied parameters
 * @method disableDHCPv6
 * @async
 * @param {String} ip6Addr IPv6 address
 * @param {String} ipv6Length IPv6 length
 * @param {String} ipv6Gateway Gateway
 * @param {Array.<String>} [ipv6dns] DNS server in an array of strings
 */
o5.platform.system.Network.disableDHCPv6 = function disableDHCPv6 (ip6Addr, ipv6Length, ipv6Gateway, ipv6dns) {
    var ethernetType = this.isEthernetAvailable() ? o5.platform.system.Network.NetworkType.ETHERNET : o5.platform.system.Network.NetworkType.WIFI,
        id = this._getInterfaceIdUsingName(ethernetType),
        ipv6_path,
        ipv6Length_path,
        ipv6Gateway_path,
        ipv6dns_path;

    CCOM.IpNetwork.setInterfaceState(id, 1);    //CCOM.IpNetwork.INTERFACE_STATE_OFF = 1

    ipv6_path = "/network/ipconfig/interfaces/interface" + id + "/ipv6";
    CCOM.ConfigManager.setValue(ipv6_path, ip6Addr);

    ipv6Length_path = "/network/ipconfig/interfaces/interface" + id + "/ipv6Length";
    CCOM.ConfigManager.setValue(ipv6Length_path, ipv6Length);

    ipv6Gateway_path = "/network/ipconfig/interfaces/interface" + id + "/ipv6Gateway";
    CCOM.ConfigManager.setValue(ipv6Gateway_path, ipv6Gateway);

    if (ipv6dns) {
        ipv6dns_path = "/network/ipconfig/interfaces/interface" + id + "/ipv6dns";
        CCOM.ConfigManager.setValue(ipv6dns_path, ipv6dns);
    }
    setTimeout(function () {
         CCOM.IpNetwork.setInterfaceState(id, 0);   //CCOM.IpNetwork.INTERFACE_STATE_ON = 0
    }, 2500);
};

/**
 * Enables DHCP and causes a lease refresh
 * @method enableDHCP
 * @param {Object} currentInterface Interface object returned from `getInterfaceByType` to
 * enable DHCP for that interface
 */
o5.platform.system.Network.enableDHCP = function enableDHCP (currentInterface) {
    this.logEntry();
    if (currentInterface && currentInterface.name) {
        var id = this._getInterfaceIdUsingName(currentInterface.name),
            ipv4_path,
            netmask_path,
            gateway_path;

        CCOM.IpNetwork.setInterfaceState(id, 1);    //CCOM.IpNetwork.INTERFACE_STATE_OFF = 1

        ipv4_path = "/network/ipconfig/interfaces/interface" + id + "/ipv4";
        CCOM.ConfigManager.setValue(ipv4_path, "dhcp");

        netmask_path = "/network/ipconfig/interfaces/interface" + id + "/netmask";
        CCOM.ConfigManager.setValue(netmask_path, "dhcp");

        gateway_path = "/network/ipconfig/interfaces/interface" + id + "/gateway";
        CCOM.ConfigManager.setValue(gateway_path, "dhcp");

        setTimeout(function () {
             CCOM.IpNetwork.setInterfaceState(id, 0);   //CCOM.IpNetwork.INTERFACE_STATE_ON = 0
        }, 2500);
    }
    this.logExit();
};

/**
 * @method setIpv6Address
 * @removed
 */

/**
 * Gets the supported protocol for the given interface as configured
 * @method getSupportedProtocol
 * @param {Object} networkInterface Network interface object as returned from `getNetworkByType`
 * @return {String} Returns protocol (ipv4, ipv6) or null if not found
 */
o5.platform.system.Network.getSupportedProtocol = function getSupportedProtocol (networkInterface)
{
    this.logEntry();

    if (networkInterface) {
        var returnValue = CCOM.ConfigManager.getValue("/network/ipconfig/interfaces/interface" + networkInterface.id + "/protocol");
        if (returnValue !== undefined && !returnValue.error) {
            this.logExit(returnValue.keyValue);
            return returnValue.keyValue;
        }
    }

    this.logExit("Returned null");
    return null;
};

/**
 * Gets the IP address from the given network interface. If networkInterface and networkType are
 * undefined, it gets the IP address from the first network interface it finds.
 * @method getIpAddress
 * @param {Object} [networkInterface] Network interface object as returned from `getNetworkByType`
 * @param {String} [networkType] Network type which is one of the `NetworkType` enumeration.
 * networkType is used only if networkInterface is undefined or null.
 * @return {String} Returns the IP address or null if not found
 */
o5.platform.system.Network.getIpAddress = function getIpAddress (networkInterface, networkType) {
    this.logEntry();

    if (networkInterface) {
        this.logExit(networkInterface.ip);
        return networkInterface.ip;
    } else {
        var interfaces = CCOM.IpNetwork.interface,
            interfacesLength = interfaces.length,
            i;

        if (networkType) {
            for (i = 0; i < interfacesLength; i++) {
                if (interfaces[i].name === networkType) {
                    return interfaces[i].ip;
                }
            }
        } else {
            for (i = 0; i < interfacesLength; i++) {
                if (interfaces[i].ip && interfaces[i].type !== this.InterfaceType.INTERFACE_TYPE_VIRTUAL) {
                    this.logExit(interfaces[i].ip);
                    return interfaces[i].ip;
                }
            }
        }
    }

    this.logExit("Returned null");
    return null;
};

/**
 * Gets the IPv6 address from the given network interface. If network interface is not given, it gets
 * the IPv6 address from the first network interface it finds.
 * @method getIpV6Address
 * @param {Object} [networkInterface] Network interface object as returned from `getNetworkByType`
 * @return {String} Returns the IPv6 address or null if not found
 */
o5.platform.system.Network.getIpV6Address = function getIpV6Address (networkInterface) {
    if (networkInterface) {
        return networkInterface.ipv6;
    } else {
        var interfaces = CCOM.IpNetwork.interface,
            interfacesLength = interfaces.length,
            i;
        for (i = 0; i < interfacesLength; i++) {
            if (interfaces[i].ipv6 && interfaces[i].type !== this.InterfaceType.INTERFACE_TYPE_VIRTUAL) {
                return interfaces[i].ipv6;
            }
        }
    }
    return null;
};

/**
 * Gets the subnet mask from the given network interface.
 * @method getSubnetMask
 * @param {Object} [networkInterface] Network interface object as returned from `getNetworkByType`
 * @param {String} [networkType] Network type which is one of the `NetworkType` enumeration.
 * networkType is used only if networkInterface is undefined or null.
 * @return {String} Returns the subnet mask of the network interface or null if not found
 */
o5.platform.system.Network.getSubnetMask = function getSubnetMask (networkInterface, networkType) {
    if (networkInterface) {
        return networkInterface.netmask;
    } else if (networkType) {
        var ethernet = this.getNetworkByType(networkType);
        return ethernet.netmask || null;
    }

    return null;
};

/**
 * Gets the IPv6 prefix length from the given network interface.
 * @method getSubnetPrefixLength
 * @param {Object} networkInterface Network interface object as returned from `getNetworkByType`
 * @return {String} Returns the IPv6 prefix length of the network interface or null if not found
 */
o5.platform.system.Network.getSubnetPrefixLength = function getSubnetPrefixLength (networkInterface) {
    if (networkInterface) {
        return networkInterface.ipv6PrefixLength;
    }
    return null;
};

/**
 * Gets a list of DNS servers
 * @method getDnsServers
 * @return {Array} Returns an array of DNS servers or null if not found
 */
o5.platform.system.Network.getDnsServers = function getDnsServers () {
    this.logEntry();
    var dnsServers = CCOM.IpNetwork.dns;
    return dnsServers || null;
};

/**
 * Gets the default gateway from the given network interface. If network interface is not given, it gets
 * the default gateway from the first network interface it finds.
 * @method getGateway
 * @param {Object} [networkInterface] Network interface object as returned from `getNetworkByType`
 * @return {String} Returns the default gateway or null if not found
 */
o5.platform.system.Network.getGateway = function getGateway (networkInterface) {
    this.logEntry();
    if (networkInterface) {
        return networkInterface.gateway;
    } else {
        var interfaces = CCOM.IpNetwork.interface,
            interfacesLength = interfaces.length,
            i;
        for (i = 0; i < interfacesLength; i++) {
            if (interfaces[i].ip) {
                return interfaces[i].gateway;
            }
        }
    }
    return null;
};

/**
 * Gets the IPv6 gateway from the given network interface. If network interface is not given, it gets
 * the IPv6 gateway from the first network interface it finds.
 * @method getIpv6Gateway
 * @param {Object} [networkInterface] Network interface object as returned from `getNetworkByType`
 * @return {String} Returns the IPv6 gateway or null if not found
 */
o5.platform.system.Network.getIpv6Gateway = function getIpv6Gateway (networkInterface) {
    if (networkInterface) {
        return networkInterface.gateway;
    } else {
        var interfaces = CCOM.IpNetwork.interface,
            interfacesLength = interfaces.length,
            i;
        for (i = 0; i < interfacesLength; i++) {
            if (interfaces[i].ipv6) {
                return interfaces[i].ipv6Gateway;
            }
        }
    }
    return null;
};

/**
 * @method ping
 * @async
 * @deprecated Does not work, use pingAddress instead
 * @param {String} address The IP address or the DNS name of the resource to ping
 * @param {Function} successCallback The function that will be invoked if the ping is successful
 * @param {Function} failureCallback The function that will be invoked if the ping fails
 */
o5.platform.system.Network.ping = function ping (address, successCallback, failureCallback) {
    this.logEntry();
    if (address) {
        CCOM.IpNetwork.addEventListener('pingOK', successCallback);
        CCOM.IpNetwork.addEventListener('pingFailed', failureCallback);
        CCOM.IpNetwork.ping(address);
    }
    this.logExit();
};

/**
 * Ping the given address using the given network interface.
 * @method pingAddress
 * @async
 * @param {String} address The IP address to ping. Domain name is not allowed.
 * @param {Function} callback Callback function to be invoked for successful or failure ping
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @param {Object} [networkInterface] Network interface object as returned from `getNetworkByType`.
 * The default interface is ETHERNET.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.system.Network.pingAddress = function pingAddress (address, callback, networkInterface) {
    this.logEntry();
    var handle = null;
    if (address && callback) {
        if (!networkInterface) {
            networkInterface = this.getNetworkByType(this.NetworkType.ETHERNET);
        }
        handle = CCOM.IpNetwork.ping(networkInterface.id, address, null);
        if (handle) {
            this._pingCallbackLookup[handle] = callback;
        }
    }
    this.logExit();
    return handle;
};

/**
 * @method refreshNetworksCache
 * @removed
 */

/**
 * Sets NetworkType.ETHERNET string name to ethernet
 * @method configure
 * @param {String} ethernet Ethernet name
 */
o5.platform.system.Network.configure = function configure (ethernet) {
    this.NetworkType.ETHERNET = ethernet;
};

/**
 * Sets NetworkType.WIFI string name to WiFi
 * @method configureWifi
 * @param {String} wifi WiFi name
 */
o5.platform.system.Network.configureWifi = function configureWifi (wifi) {
    this.NetworkType.WIFI = wifi;
};

/**
 * Register callback for onStatusChanged event
 * @method registerOnStatusChangedListener
 * @param {Function} callback Callback to receive event
 * @param {Number} callback.eventType Event type
 * @param {Object} callback.interface Object containing the interface details
 */
o5.platform.system.Network.registerOnStatusChangedListener = function registerOnStatusChangedListener (callback) {
    CCOM.IpNetwork.addEventListener("onStatusChanged", callback);
};

/**
 * Unregister callback for onIpReceived event
 * @method unregisterOnStatusChangedListener
 * @param {Function} callback Callback to unregister event
 */
o5.platform.system.Network.unregisterOnStatusChangedListener = function unregisterOnStatusChangedListener (callback) {
    CCOM.IpNetwork.removeEventListener("onStatusChanged", callback);
};

/**
 * Class to deal with state changes on the network
 *
 * @class o5.platform.system.Network.StateChange
 * @singleton
 * @requires o5.platform.system.Network
 */
o5.platform.system.Network.StateChange = new (function StateChange () {
    this._registered = false;
    this._onStatusChangedHandler = null;
    this._ethUpCallBack = null;
    this._ethDownCallBack = null;
    this._ipReceivedCallBack = null;
    this._wifiUpCallBack = null;
    this._wifiDownCallBack = null;
})();

/**
 * Event handler for when there is a state change in the network
 * @method _onStatusChangedHandler
 * @private
 * @param {Object} e The event that is fired
 */
// Disable ESLint complexity because this API may be refactored in the future to simplify various callbacks
// eslint-disable-next-line complexity
o5.platform.system.Network.StateChange._onStatusChangedHandler = function _onStatusChangedHandler (e) {
    var me = o5.platform.system.Network.StateChange;
    me.logEntry();
    if (e.eventType === CCOM.IpNetwork.IPV4_RECEIVED ||
        e.eventType === CCOM.IpNetwork.IPV6_CHANGED ||
        e.eventType === CCOM.IpNetwork.MULTICAST_INTERFACE_GAINED) {
        if (me._ipReceivedCallBack) {
            me._ipReceivedCallBack();
        }
    }

    if (e.eventType === CCOM.IpNetwork.LINK_DOWN ||
        e.eventType === CCOM.IpNetwork.SIGNAL_LOST) {
        if (e.interface.name === o5.platform.system.Network.NetworkType.ETHERNET) {
            if (me._ethDownCallBack) {
                me._ethDownCallBack();
            }
        } else if (me._wifiDownCallBack) {
            me._wifiDownCallBack();
        }
    }

    if (e.eventType === CCOM.IpNetwork.LINK_UP ||
        e.eventType === CCOM.IpNetwork.SIGNAL_OK) {
        if (e.interface.name === o5.platform.system.Network.NetworkType.ETHERNET) {
            if (me._ethUpCallBack) {
                me._ethUpCallBack();
            }
        } else if (me._wifiUpCallBack) {
            me._wifiUpCallBack();
        }
    }
    me.logExit();
};

/**
 * Set the callback for when Ethernet is available
 * @method setEthUpCallBack
 * @param {Function} callback Callback function to be invoked when there is a network state change
 * and Ethernet link is up.
 */
o5.platform.system.Network.StateChange.setEthUpCallBack = function setEthUpCallBack (callback) {
    this.logEntry();
    this._ethUpCallBack = callback;
};

/**
 * Sets the callback for when Ethernet is no longer available
 * @method setEthDownCallBack
 * @param {Function} callback Callback function to be invoked when there is a network state change
 * and Ethernet link is down.
 */
o5.platform.system.Network.StateChange.setEthDownCallBack = function setEthDownCallBack (callback) {
    this.logEntry();
    this._ethDownCallBack = callback;
};

/**
 * Sets the callback for when IP received
 * @method setIpReceivedCallBack
 * @param {Function} callback The callback function
 */
o5.platform.system.Network.StateChange.setIpReceivedCallBack = function setIpReceivedCallBack (callback) {
    this.logEntry();
    this._ipReceivedCallBack = callback;
};

/**
 * Sets the callback for when WiFi becomes available
 * @method setWifiUpCallBack
 * @param {Function} callback Callback function to be invoked when there is a network state change
 * and WiFi link is up.
 */
o5.platform.system.Network.StateChange.setWifiUpCallBack = function setWifiUpCallBack (callback) {
    this.logEntry();
    this._wifiUpCallBack = callback;
};

/**
 * Sets the callback for when WiFi is no longer available
 * @method setWifiDownCallBack
 * @param {Function} callback Callback function to be invoked when there is a network state change
 * and WiFi link is down.
 */
o5.platform.system.Network.StateChange.setWifiDownCallBack = function setWifiDownCallBack (callback) {
    this.logEntry();
    this._wifiDownCallBack = callback;
};

/**
 * Registers the NetworkStateChange event listener
 * @method registerListener
 */
o5.platform.system.Network.StateChange.registerListener = function registerListener () {
    this.logEntry();
    if (!this._registered) {
        CCOM.IpNetwork.addEventListener("onStatusChanged", this._onStatusChangedHandler);
        this._registered = true;
    }
};

/**
 * Unregisters (removes) the NetworkStateChange event listener
 * @method unRegisterListener
 */
o5.platform.system.Network.StateChange.unRegisterListener = function unRegisterListener () {
    if (this._registered) {
        CCOM.IpNetwork.removeEventListener("onStatusChanged", this._onStatusChangedHandler);
        this._registered = false;
    }
};

// Add _init() to array for o5.$.init2() to call when O5 starts up.
o5.$.init2Callbacks.push(o5.platform.system.Network._init);

// uncomment to turn debugging on for Network object
//o5.log.setAll(o5.platform.system.Network, true);
//o5.log.setAll(o5.platform.system.Network.StateChange, true);
