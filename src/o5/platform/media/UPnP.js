/**
 * The media module is responsible for display of media from differing devices
 *
 * A utility class that will discover and browse any content that is publicly visible on UPnP
 * devices that are connected to the local network.
 *
 * @singleton
 * @class o5.platform.media.UPnP
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

/**
 * singleton constructor
 */
o5.platform.media.UPnP = new (function UPnP () {
    this._getContentsCallback = function () {};
    this._getDevicesOkCallback = null;
    this._searchContentsCallback = null;
    this._currentDevice = null;
    this._devices = []; // List of devices
    this._sortCapabilityLength = 0;
})();

/**
 * Enumeration of media file types
 * @readonly
 * @property {Number} fileTypes
 * @property {Number} fileTypes.AUDIO 1
 * @property {Number} fileTypes.IMAGE 2
 * @property {Number} fileTypes.VIDEO 3
 * @property {Number} fileTypes.FOLDER 4
 * @property {Number} fileTypes.FILE 5
 * @property {Number} fileTypes.UNKNOWN 6
 */
o5.platform.media.UPnP.fileTypes = {
    AUDIO: 1,
    IMAGE: 2,
    VIDEO: 3,
    FOLDER: 4,
    FILE: 5,
    UNKNOWN: 6
};

/**
 * This method identifies and categorizes the files and directories that have been detected
 * on a local UPnP device.
 * @method processContentResults
 * @param {Array.<Object>} results The files and directories that have been discovered on a UPnP device.
 * The object of the array: Pass the event.content array of the browseContainerOK or searchContainerOK event of CCOM.HomeNetworking.
 * See OK EVENT of CCOM.HomeNetworking.searchContainer and the result contains an array of strings and variants as described in the HNContent type.
 * For more details of this object's structure, refer to HNContent.
 * @return {Array.<Object>} The results array that was passed into the method with an additional "fileType"
 * property attached to each result object in the results array.
 *
 *        fileType {Number} The file type. See o5.platform.media.UPnP.fileTypes.
 */
o5.platform.media.UPnP.processContentResults = function processContentResults (results) {
    this.logEntry();
    var contentItem = null,
        i,
        numberOfResults = results.length || -1,
        processedResults = [],
        fileTypes = o5.platform.media.UPnP.fileTypes;

    if (!CCOM.HomeNetworking) {
        return [];
    }

    for (i = 0; i < numberOfResults; i++) {
        contentItem = results[i];
        if (contentItem && contentItem.objectType === CCOM.HomeNetworking.HN_CONTENT_TYPE_CONTAINER) {
            contentItem.fileType = fileTypes.FOLDER;
        } else if (contentItem && contentItem.objectType === CCOM.HomeNetworking.HN_CONTENT_TYPE_ITEM &&
                    contentItem.resource.length) {
            if (contentItem.resource[0].protocolInfo.indexOf("http-get:*:image/") > -1) {
                contentItem.fileType = fileTypes.IMAGE;
                contentItem.resourceUrl = contentItem.resource[0].uri.replace("dlna://", "http://");
            } else if (contentItem.resource[0].protocolInfo.indexOf("http-get:*:audio/") > -1) {
                contentItem.fileType = fileTypes.AUDIO;
                contentItem.resourceUrl = contentItem.resource[0].uri;
            } else if (contentItem.resource[0].protocolInfo.indexOf("http-get:*:video/") > -1) {
                contentItem.fileType = fileTypes.VIDEO;
                contentItem.resourceUrl = contentItem.resource[0].uri;
            } else {
                continue;
            }
        }
        this.logDebug("contentItem[" + i + "] type=" + contentItem.fileType + " url=" + contentItem.resourceUrl);
        processedResults.push(contentItem);
    }
    this.logExit();
    return processedResults;
};

/**
 * Called once browsing the local network for visible UPnP devices has ended.
 * This method is for callback events of the browse operation, getRootContentsForDevice and
 * getContentsForFolder methods. The browse operation method succeeded.
 * @method _browseComplete
 * @private
 * @param {Object} e Object containing properties relevant to the outcome of the browse operation.
 */
o5.platform.media.UPnP._browseComplete = function _browseComplete (e) {
    var me = o5.platform.media.UPnP;
    me.logEntry();
    if (me._getContentsCallback) {
        me._getContentsCallback(me.processContentResults(e.content));
    }
    me.logExit();
};

/**
 * Called once browsing the local network for visible UPnP devices has failed.
 * This method is for callback events of the browse operation, getRootContentsForDevice and
 * getContentsForFolder methods. The browse operation method failed.
 * @method _browseContainerFailed
 * @private
 * @param {Object} e Object containing properties relevant to the outcome of the browse operation.
 */
o5.platform.media.UPnP._browseContainerFailed = function _browseContainerFailed (e) {
    var me = o5.platform.media.UPnP;
    me.logEntry();
    if (me._getContentsCallback) {
        me._getContentsCallback(false);
    }
    me.logExit();
};

/**
 * This method is for callback events of the getSortCapability method. The getSortCapability method succeeded.
 * @method _getSortCapabilities
 * @private
 * @param {Object} e Object containing properties relevant to the outcome of the getSortCapability operation.
 */
o5.platform.media.UPnP._getSortCapabilities = function _getSortCapabilities (e) {
    var me = o5.platform.media.UPnP;
    me.logDebug("start and end");
    me._sortCapabilityLength = e.sortCapabilities.length;
};

/**
 * This method is for callback events of the getSortCapability method. The getSortCapability method failed.
 * @method _getSortCapabilitiesFailed
 * @private
 * @param {Object} e Object containing properties relevant to the outcome of the getSortCapability operation.
 */
o5.platform.media.UPnP._getSortCapabilitiesFailed = function _getSortCapabilitiesFailed (e) {
    var me = o5.platform.media.UPnP;
    me.logDebug("start and end");
};

/**
 * Begins the discovery for UPnP devices on the local network.
 * @method _startDeviceDiscovery
 * @async
 * @private
 */
o5.platform.media.UPnP._startDeviceDiscovery = function _startDeviceDiscovery () {
    var me = o5.platform.media.UPnP;
    me.logEntry();
    if (CCOM.HomeNetworking) {
        CCOM.HomeNetworking.getDevices();
    }
    me.logExit();
};

/**
 * This method is for callback events of the searchContainer method. The searchContainer method succeeded.
 * @method _searchContainerOK
 * @private
 * @param {Object} e Object containing properties relevant to the outcome of the searchContainer operation.
 */
o5.platform.media.UPnP._searchContainerOK = function _searchContainerOK (e) {
    var me = o5.platform.media.UPnP;
    me.logEntry();
    if (me._searchContentsCallback) {
        me._searchContentsCallback(me.processContentResults(e.content));
    }
    me.logExit();
};

/**
 * This method is for callback events of the searchContainer method. The searchContainer method failed.
 * @method _searchContainerFailed
 * @private
 * @param {Object} e Object containing properties relevant to the outcome of the searchContainer operation.
 */
o5.platform.media.UPnP._searchContainerFailed = function _searchContainerFailed (e) {
    var me = o5.platform.media.UPnP;
    me.logEntry();
    if (me._searchContentsCallback) {
        me._searchContentsCallback(false);
    }
    me.logExit();
};

/**
 * This method is the callback of successful _startDeviceDiscovery(). It gets the list of DLNA
 * media servers and DLNA media renderers after the discovery on the local network.
 * @method _getDeviceOkHandler
 * @private
 * @param {Object} e Object containing properties relevant to the successful outcome of
 * _startDeviceDiscovery() operation.
 */
o5.platform.media.UPnP._getDeviceOkHandler = function _getDeviceOkHandler (e) {
    var me = o5.platform.media.UPnP;
    me.logEntry();
    me._devices = e.devices;
    me.logDebug("_devices.length=" + me._devices.length);

    // for Debugging
    /* if (me._devices.length) {
        for (var i = 0; i < me._devices.length; i++) {
            me.logDebug("_devices.["+ i +"].udh=" + me._devices[i].udn);
        }
    }*/

    if (me._getDevicesOkCallback) {
        me._getDevicesOkCallback(me._devices);
        me._getDevicesOkCallback = null;
    }
    me.logExit();
};

/**
 * This method is the callback of failed _startDeviceDiscovery().
 * @method _getDeviceFailedHandler
 * @private
 * @param {Object} e Object containing properties relevant to the failed outcome of
 * _startDeviceDiscovery() operation.
 */
o5.platform.media.UPnP._getDeviceFailedHandler = function _getDeviceFailedHandler (e) {
    var me = o5.platform.media.UPnP;
    me.logDebug("_startDeviceDiscovery() get device failed!");
};

/**
 * Creates event listeners that listen for events that are fired when UPnP devices are discovered on the local
 * network and when UPnP devices are disconnected from the local network.
 * from the local network.
 * @method addEventListeners
 */
o5.platform.media.UPnP.addEventListeners = function addEventListeners () {
    this.logEntry();
    if (CCOM.HomeNetworking) {
        CCOM.HomeNetworking.addEventListener('searchContainerOK', this._searchContainerOK, false);
        CCOM.HomeNetworking.addEventListener('searchContainerFailed', this._searchContainerFailed, false);
        CCOM.HomeNetworking.addEventListener("getDevicesOK", this._getDeviceOkHandler, false);
        CCOM.HomeNetworking.addEventListener("getDevicesFailed", this._getDeviceFailedHandler, false);
        // When devices are found or lost, call _startDeviceDiscovery() to update the device list.
        CCOM.HomeNetworking.addEventListener('onDeviceFound', this._startDeviceDiscovery, false);
        CCOM.HomeNetworking.addEventListener('onDeviceLost', this._startDeviceDiscovery, false);

        CCOM.HomeNetworking.addEventListener('browseContainerOK', this._browseComplete, false);
        CCOM.HomeNetworking.addEventListener('browseContainerFailed', this._browseContainerFailed, false);
        CCOM.HomeNetworking.addEventListener('getSortCapabilitiesOK', this._getSortCapabilities, false);
        CCOM.HomeNetworking.addEventListener('getSortCapabilitiesFailed', this._getSortCapabilitiesFailed, false);
    }
    this.logExit();
};

/**
 * Removes event listeners that listen for events that are fired when UPnP devices are discovered on the local
 * network and when UPnP devices are disconnected from the local network.
 * from the local network.
 * @method removeEventListener
 */
o5.platform.media.UPnP.removeEventListener = function removeEventListener () {
    this.logEntry();
    if (CCOM.HomeNetworking) {
        CCOM.HomeNetworking.removeEventListener('searchContainerOK', this._searchContainerOK, false);
        CCOM.HomeNetworking.removeEventListener('searchContainerFailed', this._searchContainerFailed, false);
        CCOM.HomeNetworking.removeEventListener("getDevicesOK", this._getDeviceOkHandler, false);
        CCOM.HomeNetworking.removeEventListener("getDevicesFailed", this._getDeviceFailedHandler, false);
        CCOM.HomeNetworking.removeEventListener('onDeviceFound', this._startDeviceDiscovery, false);
        CCOM.HomeNetworking.removeEventListener('onDeviceLost', this._startDeviceDiscovery, false);
        CCOM.HomeNetworking.removeEventListener('browseContainerOK', this._browseComplete, false);
        CCOM.HomeNetworking.removeEventListener('browseContainerFailed', this._browseContainerFailed, false);
        CCOM.HomeNetworking.removeEventListener('getSortCapabilitiesOK', this._getSortCapabilities, false);
        CCOM.HomeNetworking.removeEventListener('getSortCapabilitiesFailed', this._getSortCapabilitiesFailed, false);
    }
    this.logExit();
};

/**
 * Initialization method that begins the discovery of UPnP devices on the local network.
 * @method init
 */
o5.platform.media.UPnP.init = function init () {
    this.logEntry();
    this._startDeviceDiscovery();
    this.addEventListeners();
    this.logExit();
};

/**
 * Initialization method that begins the discovery of UPnP devices on the local network.
 * @method initialize
 * @deprecated use init()
 */
o5.platform.media.UPnP.initialise = function initialise () {
    this.logDeprecated();

    this.init();
};

/**
 * Retrieves the root level directories and any root-level content published by a UPnP device.
 * @method getRootContentsForDevice
 * @async
 * @param {Object} device The UPnP device from which the root-level content should be retrieved.
 * @param {Function} callback Callback to be executed upon retrieving the root-level content from a UPnP device.
 * @param {Array.<Object>} callback.content The files and directories that have been discovered on a UPnP device.
 * The object of the array: Pass the event.content array of the browseContainerOK event of CCOM.HomeNetworking.
 * See OK EVENT of CCOM.HomeNetworking.searchContainer and the result contains an array of strings and variants as described in the HNContent type.
 * For more details of this object's structure, refer to HNContent.
 * @param {String} sortCriteria Use "" for no sorting. For more detailed sorting, consult the UPnP Content
 * Directory Specification. If not set, value is set to "".
 */
o5.platform.media.UPnP.getRootContentsForDevice = function getRootContentsForDevice (device, callback, sortCriteria) {
    this.logEntry();
    this._currentDevice = device;
    sortCriteria = sortCriteria || "";
    this._getContentsCallback = callback;
    if (CCOM.HomeNetworking) {
        CCOM.HomeNetworking.addEventListener('browseContainerOK', this._browseComplete, false);
        CCOM.HomeNetworking.addEventListener('browseContainerFailed', this._browseContainerFailed, false);
        CCOM.HomeNetworking.browseContainer(device.udn, "0", sortCriteria, "*", 0, 30);
    }
    this.logExit();
};

/**
 * Retrieves the contents of a directory located on a UPnP device.
 * @method getContentsForFolder
 * @async
 * @param {Object} folder The directory that is to be explored.
 * @param {String} folder.id Container id.
 * @param {Function} callback Callback to be executed upon retrieving the contents of the specified directory.
 * @param {Array.<Object>} callback.content The files and directories that have been discovered on a UPnP device.
 * The object of the array: Pass the event.content array of the browseContainerOK event of CCOM.HomeNetworking.
 * See OK EVENT of CCOM.HomeNetworking.searchContainer and the result contains an array of strings and variants as described in the HNContent type.
 * For more details of this object's structure, refer to HNContent.
 * @param {Number} [startIndex=0] Used to get the complete listing of a container when the result count is greater
 * than the hnMaxBrowse property.
 * @param {Number} [numberOfItems=30] Used to limit the number of results for any given browse request. The complete
 * listing can be retrieved with multiple browse requests and changing the startIndex.
 * @param {String} [filter="*"] Unused parameter. This method always filter by * or no filter at all.
 * @param {String} [sortCriteria=""] Use "" for no sorting. For more detailed sorting, consult the UPnP Content
 * Directory Specification.
 */
o5.platform.media.UPnP.getContentsForFolder =
function getContentsForFolder (folder, callback, startIndex, numberOfItems, filter, sortCriteria) {
    this.logEntry();
    startIndex = startIndex || 0;
    numberOfItems = numberOfItems || 30;
    sortCriteria = sortCriteria || "";
    //noinspection JSUnusedAssignment
    filter = filter || "*";
    this._getContentsCallback = callback;
    if (CCOM.HomeNetworking) {
        CCOM.HomeNetworking.browseContainer(this._currentDevice.udn, folder.id, sortCriteria, "*",
            startIndex, numberOfItems);
    }
    this.logExit();
};

/**
 * Search a content of a directory located on a UPnP device.
 * @method searchContainer
 * @async
 * @param {Object} folder The directory that is to be explored.
 * @param {String} folder.id Container id.
 * @param {Function} callback Callback to be executed upon retrieving the contents of the specified directory.
 * @param {Array.<Object>} callback.content The files and directories that have been discovered on a UPnP device.
 * The object of the array: Pass the event.content array of the searchContainerOK event of CCOM.HomeNetworking.
 * See OK EVENT of CCOM.HomeNetworking.searchContainer and the result contains an array of strings and variants as described in the HNContent type.
 * For more details of this object's structure, refer to HNContent.
 * @param {String} searchCriteria Use "" for no searching. For more detailed searching, consult the UPnP Content
 * Directory Specification.
 * @param {String} [sortCriteria=""] Use "" for no sorting. For more detailed sorting, consult the UPnP Content
 *  Directory Specification.
 * @param {String} [filter="*"] Use "*" for all parameters. For more detailed filtering, consult the UPnP Content
 * Directory Specification.
 * @param {Number} [startIndex=0] Used as the zero-based starting offset to enumerate children under the container.
 * @param {Number} [numberOfItems=100] Used to limit the number of results for any given search request. The complete
 * listing can be retrieved with multiple search requests and changing the startIndex.
 */
o5.platform.media.UPnP.searchContainer =
function searchContainer (folder, callback, searchCriteria, sortCriteria, filter, startIndex, numberOfItems) {
    this.logEntry();
    startIndex = startIndex || 0;
    numberOfItems = numberOfItems || 100;
    sortCriteria = sortCriteria || "";
    this._searchContentsCallback = callback;
    filter = filter || "*";
    if (CCOM.HomeNetworking) {
        CCOM.HomeNetworking.searchContainer(this._currentDevice.udn, folder.id, searchCriteria, sortCriteria,
            filter, startIndex, numberOfItems);
    }
    this.logExit();
};

/**
 * Returns an array of visible UPnP devices that are accessible on the local network.
 * @method getDevices
 * @return {Array} All visible UPnP devices that have been detected on the local network.
 */
o5.platform.media.UPnP.getDevices = function getDevices () {
    this.logDebug("start and end");
    return this._devices;
};

/**
 * Registers the device lost callback
 * @method registerDeviceLostListener
 * @param {Function} listener Callback to be executed when a device is lost from network
 * @param {Object} listener.event The event object is passed from onDeviceLost of CCOM.HomeNetworking.
 * For more details of this object's structure, refer to document of CCOM.HomeNetworking.
 */
o5.platform.media.UPnP.registerDeviceLostListener = function registerDeviceLostListener (listener) {
    this.logDebug("start and end");
    if (CCOM.HomeNetworking) {
        CCOM.HomeNetworking.addEventListener('onDeviceLost', listener, false);
    }
};

/**
 * Appends callback with deviceOkCallback - will be called at the end of device found functionality
 * @method appendGetDevicesOkCallback
 * @param {Function} callback Callback to be executed with the device list found callback
 * @param {Array} callback.devices The devices object is passed from event.devices object of the getDevicesOK event of CCOM.HomeNetworking.
 * The result contains an array of strings and variants as described in the HNDevice type.
 * For more details of this array and object structure, refer to document of CCOM.HomeNetworking and HNDevice.
 */
o5.platform.media.UPnP.appendGetDevicesOkCallback = function appendGetDevicesOkCallback (callback) {
    this.logDebug("start and end");
    this._getDevicesOkCallback = callback;
};

/**
 * Returns the current device being browsed
 * @method getCurrentDevice
 * @return {Object} The UPnP device: the data of current device
 */
o5.platform.media.UPnP.getCurrentDevice = function getCurrentDevice () {
    this.logDebug("start and end");
    return this._currentDevice;
};

/**
 * Sets the current Device
 * @method setCurrentDevice
 * @param {Object} device The UPnP device: the data of current device
 */
o5.platform.media.UPnP.setCurrentDevice = function setCurrentDevice (device) {
    this.logDebug("start and end");
    this._currentDevice = device;
};

/**
 * getSortCapability
 * @method getSortCapability
 * @async
 * @param {String} deviceUdn Device UCH

 */
o5.platform.media.UPnP.getSortCapability = function getSortCapability (deviceUdn) {
    this.logDebug("start and end");
    if (CCOM.HomeNetworking) {
        CCOM.HomeNetworking.getSortCapabilities(deviceUdn);
    }
};

/**
 * Gets the sort capabilities of a discovered device on the network.
 * @method checkSortCapability
 * @return {Boolean} Returns true if device is discovered, otherwise false.
 */
o5.platform.media.UPnP.checkSortCapability = function checkSortCapability () {
    this.logDebug("start and end");
    return this._sortCapabilityLength > 0;
};

/**
 * Registers a callback function to be invoked when the specified event is fired
 * @method addEventListener
 * @chainable
 * @removed
 * @param {String} event the name of the event to listen for
 * @param {Function} callback the function to be invoked
 */

/**
 * Removes a previously registered event listener identified by the given
 * name and callback
 * @method removeEventListener
 * @removed
 * @param {String} event the name of the event you are interested in listening to
 * @param {Function} callback the function to execute when the event is fired
 */

// uncomment to turn debugging on for UPnP object
// o5.log.setAll(o5.platform.media.UPnP, true);
