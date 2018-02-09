/**
 * The Device class provides methods for Set-Top Box management, such as accessing
 * specific hardware and software details, managing settings and resetting the system.
 *
 * @class o5.platform.system.Device
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.system.Device = new (function Device () {

    this._totalHardDriveSpace = 0;
    this._freeHardDriveSpace = 0;
    this._mediaDrive = "";
    this._diskSpaceInterval = null;
    this._getTotalPartitionSpaceCBLookup = {};
    this._getFreePartitionSpaceCBLookup = {};
    this._getAllConnectedMediaCBLookup = {};
    this._getAssociatedMediaCBLookup = {};

    this.MEDIA_LIST_PREF = "/system/opentv/mpm/mediaList";
    this.AUDIO_TYPE_PREF = "system/audioType";
    this.AUDIO_CHANNELS_PREF = "system/audioChannels";
    this.AUDIO_LANGUAGE_PREF = "/users/preferences/audioLanguage";
    this.SUBTITLE_LANGUAGE_PREF = "/users/preferences/subtitleLanguage";
    this.COUNTRY_CODE_PREF = "system/countryCode";
})();

/**
 * Enumeration of bus type
 * Possible values are `BUS_TYPE_UNKNOWN`, `BUS_TYPE_ATA`, `BUS_TYPE_USB`
 * @property {Number} MediumBusType
 */
o5.platform.system.Device.MediumBusType = {};

/**
 * Enumeration of medium event type
 * Possible values are `PLUGGED`, `UNPLUGGED`, `SAFESHUTDOWNCOMPLETE`, `MEDIUM_READY`, `MEDIUM_REJECTED`,
 * `MEDIUM_WAITING_FOR_EVENT`, `MEDIUM_NOT_RECOGNIZED`
 * @property {Number} MediumEventType
 */
o5.platform.system.Device.MediumEventType = {};

/**
 * Enumeration of partition status
 * Possible values are `INVALID`, `UNMOUNTING`, `UNMOUNT_FAILED`, `UNMOUNTED`, `BUSY`, `MOUNTED`,
 * `MOUNT_FAILED`, `FORMAT_REQUIRED`, `FSCK_STARTED`, `FORMAT_FAILED`, `NOT_IN_HOME_DOMAIN`
 * @property {Number} PartitionStatus
 */
o5.platform.system.Device.PartitionStatus = {};

/**
 * Event handler to fire callback functions
 * @method _fireCallback
 * @private
 * @param {Number} handle Handle
 * @param {Object} lookup Function table
 * @param {Boolean} param Value to send to callback to notify success or failed event notification
 */
o5.platform.system.Device._fireCallback = function _fireCallback (handle, lookup, param) {
    if (handle && lookup[handle]) {
        lookup[handle](handle, param);
        lookup[handle] = null;
        delete lookup[handle];
    }
};

o5.platform.system.Device._getTotalPartitionSpaceOKListener = function _getTotalPartitionSpaceOKListener (e) {
    var me = o5.platform.system.Device;
    me._totalHardDriveSpace = e.totalSpace;
    me._fireCallback(e.handle, me._getTotalPartitionSpaceCBLookup, e.totalSpace);
};

o5.platform.system.Device._getTotalPartitionSpaceFailedListener = function _getTotalPartitionSpaceFailedListener (e) {
    var me = o5.platform.system.Device;
    me._totalHardDriveSpace = 0;
    me._fireCallback(e.handle, me._getTotalPartitionSpaceCBLookup);
};

o5.platform.system.Device._getFreePartitionSpaceOKListener = function _getFreePartitionSpaceOKListener (e) {
    var me = o5.platform.system.Device;
    me._freeHardDriveSpace = e.freeSpace;
    me._fireCallback(e.handle, me._getFreePartitionSpaceCBLookup, e.freeSpace);
};

o5.platform.system.Device._getFreePartitionSpaceFailedListener = function _getFreePartitionSpaceFailedListener (e) {
    var me = o5.platform.system.Device;
    me._freeHardDriveSpace = 0;
    me._fireCallback(e.handle, me._getFreePartitionSpaceCBLookup);
};

o5.platform.system.Device._getAllConnectedMediaOKListener = function _getAllConnectedMediaOKListener (e) {
    var me = o5.platform.system.Device;
    me._fireCallback(e.handle, me._getAllConnectedMediaCBLookup, e.media);
};

o5.platform.system.Device._getAllConnectedMediaFailedListener = function _getAllConnectedMediaFailedListener (e) {
    var me = o5.platform.system.Device;
    me._fireCallback(e.handle, me._getAllConnectedMediaCBLookup);
};

o5.platform.system.Device._getAssociatedMediaOKListener = function _getAssociatedMediaOKListener (e) {
    var me = o5.platform.system.Device;
    me._fireCallback(e.handle, me._getAssociatedMediaCBLookup, e.media);
};

o5.platform.system.Device._getAssociatedMediaFailedListener = function _getAssociatedMediaFailedListener (e) {
    var me = o5.platform.system.Device;
    me._fireCallback(e.handle, me._getAssociatedMediaCBLookup);
};

/**
 * Called by o5.$.init2() when O5 starts up.
 * @method _init
 * @private
 */
o5.platform.system.Device._init = function _init () {
    // Don't use 'this' as this is called by o5.$.init2()
    var me = o5.platform.system.Device;

    me._mediaDrive = o5.platform.system.Preferences.get(me.MEDIA_LIST_PREF, true);

    CCOM.MediaLibrary.addEventListener("getTotalPartitionSpaceOK", me._getTotalPartitionSpaceOKListener);
    CCOM.MediaLibrary.addEventListener("getTotalPartitionSpaceFailed", me._getTotalPartitionSpaceFailedListener);
    CCOM.MediaLibrary.addEventListener("getFreePartitionSpaceOK", me._getFreePartitionSpaceOKListener);
    CCOM.MediaLibrary.addEventListener("getFreePartitionSpaceFailed", me._getFreePartitionSpaceFailedListener);

    CCOM.MediaLibrary.addEventListener("getAllConnectedMediaOK", me._getAllConnectedMediaOKListener);
    CCOM.MediaLibrary.addEventListener("getAllConnectedMediaFailed", me._getAllConnectedMediaFailedListener);
    CCOM.MediaLibrary.addEventListener("getAssociatedMediaOK", me._getAssociatedMediaOKListener);
    CCOM.MediaLibrary.addEventListener("getAssociatedMediaFailed", me._getAssociatedMediaFailedListener);

    me.MediumBusType = {
        BUS_TYPE_UNKNOWN: CCOM.MediaLibrary.BUS_TYPE_UNKNOWN,
        BUS_TYPE_ATA: CCOM.MediaLibrary.BUS_TYPE_ATA,
        BUS_TYPE_USB: CCOM.MediaLibrary.BUS_TYPE_USB
    };

    me.MediumEventType = {
        PLUGGED: CCOM.MediaLibrary.PLUGGED,
        UNPLUGGED: CCOM.MediaLibrary.UNPLUGGED,
        SAFESHUTDOWNCOMPLETE: CCOM.MediaLibrary.SAFESHUTDOWNCOMPLETE,
        MEDIUM_READY: CCOM.MediaLibrary.MEDIUM_READY,
        MEDIUM_REJECTED: CCOM.MediaLibrary.MEDIUM_REJECTED,
        MEDIUM_WAITING_FOR_EVENT: CCOM.MediaLibrary.MEDIUM_WAITING_FOR_EVENT,
        MEDIUM_NOT_RECOGNIZED: CCOM.MediaLibrary.MEDIUM_NOT_RECOGNIZED
    };

    me.PartitionStatus = {
        INVALID: CCOM.MediaLibrary.INVALID,
        UNMOUNTING: CCOM.MediaLibrary.UNMOUNTING,
        UNMOUNT_FAILED: CCOM.MediaLibrary.UNMOUNT_FAILED,
        UNMOUNTED: CCOM.MediaLibrary.UNMOUNTED,
        BUSY: CCOM.MediaLibrary.BUSY,
        MOUNTED: CCOM.MediaLibrary.MOUNTED,
        MOUNT_FAILED: CCOM.MediaLibrary.MOUNT_FAILED,
        FORMAT_REQUIRED: CCOM.MediaLibrary.FORMAT_REQUIRED,
        FSCK_STARTED: CCOM.MediaLibrary.FSCK_STARTED,
        FORMAT_FAILED: CCOM.MediaLibrary.FORMAT_FAILED,
        NOT_IN_HOME_DOMAIN: CCOM.MediaLibrary.NOT_IN_HOME_DOMAIN
    };
};

/**
 * @method init
 * @deprecated Unnecessary call, O5.js internally initialize this module.
 */
o5.platform.system.Device.init = function init () {
    this.logDeprecated();
};

/**
 * @method initialise
 * @deprecated Unnecessary call, O5.js internally initialize this module.
 */
o5.platform.system.Device.initialise = function initialise () {
    this.logDeprecated();
};

/**
 * Registers platform listeners
 * @method register
 * @deprecated Don't use this, does nothing
 */
o5.platform.system.Device.register = function register () {
    this.logDeprecated();
};

/**
 * Unregisters platform listeners
 * @method unregister
 * @deprecated Don't use this, does nothing
 */
o5.platform.system.Device.unregister = function unregister () {
    this.logDeprecated();
};

/**
 * Get mount point of a partition by reading from a configuration
 * @method getMountedPointForPartition
 * @param {String} partition Partition of a media drive
 * @return {String} Mount point
 */
o5.platform.system.Device.getMountedPointForPartition = function getMountedPointForPartition (partition) {
    var mountedPointPref = "/system/opentv/mpm/" + this._mediaDrive + "/" + partition + "/mountPoint";
    return o5.platform.system.Preferences.get(mountedPointPref, true);
};

/**
 * Querying for free disk space every 120 seconds
 * <pre>
 * [Performance Warning]
 * This method sets a repeat timer to query for free disk space every 120 seconds. This is highly
 * inefficient! Use fetchFreePartitionSpace() to query for disk space on a need to know basis.
 * </pre>
 * @method catchingDiskSpace
 */
o5.platform.system.Device.catchingDiskSpace = function catchingDiskSpace () {
    this.logEntry();
    if (!this._diskSpaceInterval)
        this._diskSpaceInterval = setInterval(this.getHardDiskFreeSpace, 120000);
};

/**
 * Cancels the repeat timer to query for free disk if catchingDiskSpace() was called prior.
 * @method clearDiskSpace
 */
o5.platform.system.Device.clearDiskSpace = function clearDiskSpace () {
    this.logEntry();
    if (this._diskSpaceInterval) {
        clearInterval(this._diskSpaceInterval);
        this._diskSpaceInterval = null;
    }
};

/**
 * Register to get the total recording space and the total review buffer space available on a
 * specified partition. The partition name need to be set by calling PVRManager.setPartitionName()
 * prior to calling this method. Call getTotalHardDriveSpace() few milliseconds later (race condition possible)
 * after calling this method to get the total recording space.
 * @method getHardDiskTotalSpace
 * @async
 * @deprecated Use fetchTotalPartitionSpace()
 * @return {Number} Returns the registered handle
 */
o5.platform.system.Device.getHardDiskTotalSpace = function getHardDiskTotalSpace () {
    this.logEntry();
    var handle,
        partitionName = o5.platform.btv.PVRManager.getPartitionName();
    if (typeof partitionName === "string") {
        handle = CCOM.MediaLibrary.getTotalPartitionSpace(partitionName);
    } else if (partitionName && partitionName instanceof Array && partitionName[0]) {
        handle = CCOM.MediaLibrary.getTotalPartitionSpace(partitionName[0]);
    }
    return handle;
};

/**
 * Register to get free space available on a specified partition. The partition name
 * need to be set by calling PVRManager.setPartitionName() prior to calling this method.
 * Call getFreeHardDriveSpace() few milliseconds later (race condition possible) after calling
 * this method to get the free space.
 * @method getHardDiskFreeSpace
 * @async
 * @deprecated Use fetchFreePartitionSpace()
 * @return {Number} Returns the registered handle
 */
o5.platform.system.Device.getHardDiskFreeSpace = function getHardDiskFreeSpace () {
    this.logEntry();
    var handle,
        partitionName = o5.platform.btv.PVRManager.getPartitionName();
    if (typeof partitionName === "string") {
        handle = CCOM.MediaLibrary.getFreePartitionSpace(partitionName);
    } else if (partitionName && partitionName instanceof Array && partitionName[0]) {
        handle = CCOM.MediaLibrary.getFreePartitionSpace(partitionName[0]);
    }
    return handle;
};

/**
 * Fetch the total recording space and the total review buffer space available on the specified partition.
 * @method fetchTotalPartitionSpace
 * @async
 * @param {String} mountPoint Partition path or the mount point of a given disk.
 * @param {Function} callback Callback function to get total partition space.
 * @param {Number} callback.handle Handle that can be used to check against the returned value of
 * fetchTotalPartitionSpace.
 * @param {Number} callback.totalSpace Total space in bytes if successful, otherwise, undefined.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of
 * multiple calls.
 */
o5.platform.system.Device.fetchTotalPartitionSpace = function fetchTotalPartitionSpace (mountPoint, callback) {
    this.logEntry();
    var handle;
    if (mountPoint && callback) {
        handle = CCOM.MediaLibrary.getTotalPartitionSpace(mountPoint);
        this._getTotalPartitionSpaceCBLookup[handle] = callback;
    }
    return handle;
};

/**
 * Fetch the free recording space on the specified partition.
 * @method fetchFreePartitionSpace
 * @async
 * @param {String} mountPoint Partition path or the mount point of a given disk.
 * @param {Function} callback Callback function to get free partition space.
 * @param {Number} callback.handle Handle that can be used to check against the returned value of
 * fetchFreePartitionSpace.
 * @param {Number} callback.freeSpace Free space in bytes if successful, otherwise, undefined.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of
 * multiple calls.
 */
o5.platform.system.Device.fetchFreePartitionSpace = function fetchFreePartitionSpace (mountPoint, callback) {
    this.logEntry();
    var handle;
    if (mountPoint && callback) {
        handle = CCOM.MediaLibrary.getFreePartitionSpace(mountPoint);
        this._getFreePartitionSpaceCBLookup[handle] = callback;
    }
    return handle;
};

/**
 * Get information for all media that are plugged in and reports that in an array of MediumInfo.
 * The array will contain all media and all their partitions regardless of what type of file system each
 * partition has and whether the partition is mounted or not.
 * @method getAllConnectedMedia
 * @async
 * @param {Function} callback Callback function to receive media information.
 * @param {Number} callback.handle Handle that can be used to check against the returned value of getAllConnectedMedia.
 * @param {Array.<Object>} callback.mediumInfo An array of objects if successful, otherwise, undefined.
 *
 * @param {Number} callback.mediumInfo.busType One of o5.platform.system.Device.MediumBusType
 * @param {Number} callback.mediumInfo.lastEvent One of o5.platform.system.Device.MediumEventType
 * @param {String} callback.mediumInfo.mediumID Specifies the medium ID generated by MPM; this persists across reboots until one of its partitions is reformatted.
 * @param {String} callback.mediumInfo.mediumName Specifies the medium name assigned by UDEV; this does not persist across reboots.
 * @param {String} callback.mediumInfo.modelName Specifies the model name assigned by UDEV. This value will be the same across all the partitions of a disk.
 * @param {Number} callback.mediumInfo.removable Specifies whether the medium is removable (1=true, 0=false).
 * @param {String} callback.mediumInfo.serialShort Specifies the serial number of the medium.
 * @param {String} callback.mediumInfo.vendorName Specifies the vendor name assigned by UDEV. This value will be the same across all the partitions of a disk.
 * @param {Array.<Object>} callback.mediumInfo.partitionList An array of partition objects. This includes the partition information belonging to this medium.
 *
 * @param {String} callback.mediumInfo.partitionList.mountPoint This specifies the partition mount point if the partition is mounted.
 * @param {String} callback.mediumInfo.partitionList.partitionID This specifies the unique ID of the partition generated by MPM that persists across reboots.
 * @param {String} callback.mediumInfo.partitionList.partitionName This specifies the partition name given by UDEV.
 * @param {String} callback.mediumInfo.partitionList.status One of o5.platform.system.Device.PartitionStatus
 *
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.system.Device.getAllConnectedMedia = function getAllConnectedMedia (callback) {
    this.logEntry();
    var handle;
    if (callback) {
        handle = CCOM.MediaLibrary.getAllConnectedMedia();
        this._getAllConnectedMediaCBLookup[handle] = callback;
    }
    return handle;
};

/**
 * Get information for each medium that has SFS partitions found to be in the home domain.
 * A medium will not appear in this list until MEDIUM_READY is received for the medium.
 * @method getAssociatedMedia
 * @async
 * @param {Function} callback Callback function to receive media information.
 * @param {Number} callback.handle Handle that can be used to check against the returned value of getAssociatedMedia.
 * @param {Array.<Object>} callback.mediumInfo An array of objects if successful, otherwise, undefined.
 * See getAllConnectedMedia `mediumInfo` for details.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.system.Device.getAssociatedMedia = function getAssociatedMedia (callback) {
    this.logEntry();
    var handle;
    if (callback) {
        handle = CCOM.MediaLibrary.getAssociatedMedia();
        this._getAssociatedMediaCBLookup[handle] = callback;
    }
    return handle;
};

/**
 * @method getModel
 * @deprecated Don't use, does nothing
 */
o5.platform.system.Device.getModel = function getModel () {
    this.logDeprecated();
};

/**
 * Gets software version
 * @method getSoftwareVersion
 * @return {String} Returns software version if found, otherwise returns "Unknown".
 */
o5.platform.system.Device.getSoftwareVersion = function getSoftwareVersion () {
    var version = CCOM.System.softwareVersion;
    if (version) {
        return version;
    } else {
        return "Unknown";
    }
};

/**
 * Gets hardware version
 * @method getHardwareVersion
 * @return {String} Returns hardware version if found, otherwise returns "Unknown".
 */
o5.platform.system.Device.getHardwareVersion = function getHardwareVersion () {
    var version = CCOM.System.hardwareVersion;
    if (version) {
        return version;
    } else {
        return "Unknown";
    }
};

/**
 * Gets bootloader version
 * @method getBootloaderVersion
 * @return {String} Returns boot loader version if found, otherwise returns "Unknown".
 */
o5.platform.system.Device.getBootloaderVersion = function getBootloaderVersion () {
    var version = CCOM.System.bootloaderVersion;
    if (version) {
        return version;
    } else {
        return "Unknown";
    }
};

/**
 * Gets firmware version
 * @method getFirmwareVersion
 * @return {String} Returns firmware version if found, otherwise returns "Unknown".
 */
o5.platform.system.Device.getFirmwareVersion = function getFirmwareVersion () {
    var version = CCOM.System.firmwareVersion;
    if (version) {
        return version;
    } else {
        return "Unknown";
    }
};

/**
 * @method getOsVersion
 * @deprecated Don't use, does nothing
 */
o5.platform.system.Device.getOsVersion = function getOsVersion () {
    this.logDeprecated();
};

/**
 * Gets serial number of the device
 * @method getSerialNumber
 * @return {Number|String} Returns serial number if found, otherwise returns "Unknown".
 */
o5.platform.system.Device.getSerialNumber = function getSerialNumber () {
    var mocaObj = CCOM.System.getMocaInstances(),
        mocaInfo;

    if (mocaObj && mocaObj.instance && mocaObj.error === undefined) {
        mocaInfo = CCOM.System.getMocaInfo(Number(mocaObj.instance));
        if (mocaInfo && mocaInfo.serialNum) {
            return mocaInfo.serialNum;
        }
    } else if (mocaObj.error) {
        this.logError("error: " + mocaObj.error.name);
    }

    return "Unknown";
};

/**
 * Gets SCART port number of the device
 * @method getScartNumber
 * @return {Number|String} Returns SCART number if found, otherwise returns "Unknown".
 */
o5.platform.system.Device.getScartNumber = function getScartNumber () {
    var number = CCOM.System.scartNumber;
    if (number !== undefined) {
        return number.toString();
    } else {
        return "Unknown";
    }
};

/**
 * Gets manufacturer name
 * @method getManufacturer
 * @return {String} Returns manufacturer version if found, otherwise returns "Unknown".
 */
o5.platform.system.Device.getManufacturer = function getManufacturer () {
    var version = CCOM.System.manufacturer;
    if (version) {
        return version;
    } else {
        return "Unknown";
    }
};

/**
 * Returns a string containing the current preferred audio type
 * @method getPreferredAudioType
 * @return {String} Returns the audio type if found, otherwise returns undefined.
 */
o5.platform.system.Device.getPreferredAudioType = function getPreferredAudioType () {
    return o5.platform.system.Preferences.get(this.AUDIO_TYPE_PREF);
};

/**
 * Returns an object containing the current preferred audio channels
 * @method getPreferredAudioChannels
 * @return {Object} Returns the audio channels object if found, otherwise returns null.
 */
o5.platform.system.Device.getPreferredAudioChannels = function getPreferredAudioChannels () {
    return o5.platform.system.Preferences.getPreferenceObject(this.AUDIO_CHANNELS_PREF);
};

/**
 * Returns an array of ISO639-2 compatible (3-character) strings of the
 * preferred languages
 * @method getPreferredLanguages
 * @deprecated Use getPreferredAudioLanguage() instead
 * @return {String} Returns the preferred audio language if found, otherwise returns undefined.
 */
o5.platform.system.Device.getPreferredLanguages = function getPreferredLanguages () {
    return o5.platform.system.Device.getPreferredAudioLanguage();
};

/**
 * Returns a string containing the current preferred audio language
 * @method getPreferredAudioLanguage
 * @return {String} Returns the preferred audio language if found, otherwise returns undefined.
 */
o5.platform.system.Device.getPreferredAudioLanguage = function getPreferredAudioLanguage () {
    return o5.platform.system.Preferences.get(this.AUDIO_LANGUAGE_PREF, true);
};

/**
 * Returns a string containing the current preferred subtitle language
 * @method getPreferredSubtitleLanguage
 * @return {String} Returns the preferred subtitle language if found, otherwise returns undefined.
 */
o5.platform.system.Device.getPreferredSubtitleLanguage = function getPreferredSubtitleLanguage () {
    return o5.platform.system.Preferences.get(this.SUBTITLE_LANGUAGE_PREF, true);
};

/**
 * Returns a string that represents the country code
 * @method getCountryCode
 * @return {String} Returns the country code if found, otherwise returns undefined.
 */
o5.platform.system.Device.getCountryCode = function getCountryCode () {
    this.logEntry();
    return o5.platform.system.Preferences.get(this.COUNTRY_CODE_PREF);
};

/**
 * Returns the total amount of hard drive space in bytes
 * @method getTotalHardDriveSpace
 * @deprecated Use fetchTotalPartitionSpace() instead because this method might return incorrect number.
 * @return {Number} Returns total hard drive space in bytes
 */
o5.platform.system.Device.getTotalHardDriveSpace = function getTotalHardDriveSpace () {
    this.logEntry();
    return this._totalHardDriveSpace;
};

/**
 * Returns the amount of free space on the hard drive in bytes
 * @method getFreeHardDriveSpace
 * @deprecated Use fetchFreePartitionSpace() instead because this method might return incorrect number.
 * @return {Number} Returns total free hard drive space in bytes
 */
o5.platform.system.Device.getFreeHardDriveSpace = function getFreeHardDriveSpace () {
    this.logEntry();
    return this._freeHardDriveSpace;
};

/**
 * Returns the current global volume that the audio output is set to
 * @method getVolume
 * @return {Number} Returns the current global volume number
 */
o5.platform.system.Device.getVolume = function getVolume () {
    return Number(CCOM.System.volume);
};

/**
 * Sets the global audio volume level. A value of 0 is mute.
 * @method setVolume
 * @param {Number} volume Volume number to set to, must be >= 0.
 */
o5.platform.system.Device.setVolume = function setVolume (volume) {
    volume = Number(volume);
    if (volume >= 0) {
        CCOM.System.volume = parseInt(volume, 10);
    }
};

/**
 * Gets the mute state
 * @method getMuteState
 * @return {Boolean} Returns true if mute, otherwise false.
 */
o5.platform.system.Device.getMuteState = function getMuteState () {
    return CCOM.System.muteAudio;
};

/**
 * Mutes the audio
 * @method setMuteAudio
 */
o5.platform.system.Device.setMuteAudio = function setMuteAudio () {
    CCOM.System.muteAudio = true;
};

/**
 * Unmutes the audio
 * @method setUnmuteAudio
 */
o5.platform.system.Device.setUnmuteAudio = function setUnmuteAudio () {
    CCOM.System.muteAudio = false;
};

/**
 * Sets the current preferred audio type
 * @method setPreferredAudioType
 * @param {string} audioType Audio type
 * @return {Boolean} Returns true if the value was set successfully, otherwise false.
 */
o5.platform.system.Device.setPreferredAudioType = function setPreferredAudioType (audioType) {
    return o5.platform.system.Preferences.set(this.AUDIO_TYPE_PREF, audioType);
};

/**
 * Sets the current preferred audio channels
 * @method setPreferredAudioChannels
 * @param {Object} channels Audio channel
 * @return {Boolean} Returns true if the value was set successfully, otherwise false.
 */
o5.platform.system.Device.setPreferredAudioChannels = function setPreferredAudioChannels (channels) {
    return o5.platform.system.Preferences.setPreferenceObject(this.AUDIO_CHANNELS_PREF, channels);
};

/**
 * Sets the preferred audio language
 * @method setPreferredLanguages
 * @deprecated Use setPreferredAudioLanguage() instead
 * @param {Array} langs An array of strings representing the preferred audio Languages.
 * Only the first element is used.
 * @return {Boolean} Returns true if the value was set successfully, otherwise false.
 */
o5.platform.system.Device.setPreferredLanguages = function setPreferredLanguages (langs) {
    return o5.platform.system.Device.setPreferredAudioLanguage(langs[0]);
};

/**
 * Sets the preferred audio language
 * @method setPreferredAudioLanguage
 * @param {String} lang A string representing the preferred audio Language.
 * @return {Boolean} Returns true if the value was set successfully, otherwise false.
 */
o5.platform.system.Device.setPreferredAudioLanguage = function setPreferredAudioLanguage (lang) {
    return o5.platform.system.Preferences.set(this.AUDIO_LANGUAGE_PREF, lang, true);
};

/**
 * Sets the preferred subtitle language
 * @method setPreferredSubtitleLanguage
 * @param {String} lang A string representing the preferred subtitle Language.
 * @return {Boolean} Returns true if the value was set successfully, otherwise false.
 */
o5.platform.system.Device.setPreferredSubtitleLanguage = function setPreferredSubtitleLanguage (lang) {
    return o5.platform.system.Preferences.set(this.SUBTITLE_LANGUAGE_PREF, lang, true);
};

/**
 * Sets the country code
 * @method setCountryCode
 * @param {String} isoCode Country code
 * @return {Boolean} Returns true if the value was set successfully, otherwise false.
 */
o5.platform.system.Device.setCountryCode = function setCountryCode (isoCode) {
    return o5.platform.system.Preferences.set(this.COUNTRY_CODE_PREF, isoCode);
};

/**
 * Deletes the specified preferences
 * @method deletePrefs
 * @param {Array} prefsToDelete An array of preference keys
 * @param {Boolean} [absolute=false] True if preference keys are absolute paths
 * @return {Boolean} Returns true if all specified preferences are deleted, otherwise false.
 */
o5.platform.system.Device.deletePrefs = function deletePrefs (prefsToDelete, absolute) {
    var isDeleteSuccess = true, //will be true if ALL preferences have been deleted
        numberOfPreferences = prefsToDelete.length,
        i;
    for (i = 0; i < numberOfPreferences; i++) {
        if (!o5.platform.system.Preferences.deletePreference(prefsToDelete[i], absolute)) {
            isDeleteSuccess = false;
        }
    }
    return isDeleteSuccess;
};

/**
 * Reboots the device
 * @method reboot
 * @param {Boolean} [forceReboot=false] True to force reboot immediately or false for safe reboot.
 * @return {Boolean} Returns true if reboot is successful, otherwise false.
 */
o5.platform.system.Device.reboot = function reboot (forceReboot) {
    var _forceReboot = forceReboot || false,
        res = CCOM.Pwrmgr.userReboot(_forceReboot);

    return (res < 0) ? false : true;
};

/**
 * Performs a factory reset based on the policies specified in the configuration database.
 * @method doFactoryReset
 * @async
 * @param {Function} [callback] Callback function to notify success or failure of factory reset
 * @param {Boolean} callback.result True if successful or false for failure
 * @param {Boolean} [isForce=true] Unused variable
 */
o5.platform.system.Device.doFactoryReset = function doFactoryReset (callback, isForce) {
    this.logEntry("doFactoryReset");
    var factoryResetListener;
    if (isForce !== false) {
        isForce = true;
    }
    if (!callback) {
        callback = function (isSuccess) {};
    }
    // This handler is called for only failure, because STB reboots immediately after calling CCOM.ControlCenter.Settings.factoryReset().
    factoryResetListener = function (e) {
        CCOM.ControlCenter.Settings.removeEventListener("factoryResetOK", factoryResetListener);
        CCOM.ControlCenter.Settings.removeEventListener("factoryResetFailed", factoryResetListener);
        if (e.error) {
            this.logError("factoryReset failed with error.name = " + e.error.name + " - error.message = " + e.error.message);
            callback(false);
            return;
        } else {
            callback(true);
            return;
        }
    }.bind(this);

    if (CCOM.ControlCenter) {
        CCOM.ControlCenter.Settings.addEventListener("factoryResetOK", factoryResetListener);
        CCOM.ControlCenter.Settings.addEventListener("factoryResetFailed", factoryResetListener);
        this.logDebug("CCOM.ControlCenter.Settings.factoryReset()");
        CCOM.ControlCenter.Settings.factoryReset();
    } else {
        this.logError("No CCOM.ControlCenter");
        callback(false);
        return;
    }
    this.logExit("doFactoryReset");
};

/**
 * Determines if a hard drive is available.
 * @method isHardDriveAvailable
 * @return {Boolean} True if hard drive is available
 */
o5.platform.system.Device.isHardDriveAvailable = function isHardDriveAvailable () {
    var mediaDriveList = o5.platform.system.Preferences.get(this.MEDIA_LIST_PREF, true),
        rootPath = "/system/opentv/mpm/",
        i,
        diskStatusPath,
        diskStatus;

    // Also check the disk status to ensure HDD is mounted
    if (mediaDriveList) {
        for (i = 0; i < mediaDriveList.length; i++) {
            diskStatusPath = rootPath + mediaDriveList[i] + "/" + mediaDriveList[i] + "1/status";

            diskStatus = o5.platform.system.Preferences.get(diskStatusPath, true);
            if (diskStatus === this.PartitionStatus.MOUNTED) // MOUNTED == 7
                return true;
        }
    }

    return false;
};

/**
 * Sets the partitions that are queried for free space
 * @method setDiskPartitions
 * @deprecated Don't use this, does nothing
 * @param {Array} partitions Unused variable
 */
o5.platform.system.Device.setDiskPartitions = function setDiskPartitions (partitions) {
    this.logDeprecated();
};

// Add _init() to array for o5.$.init2() to call when O5 starts up.
o5.$.init2Callbacks.push(o5.platform.system.Device._init);

// uncomment to turn debugging on for Device object
// o5.log.setAll(o5.platform.system.Device, true);
