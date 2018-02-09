/**
 * Manages the list of favorite folders and their associated channels created by the user.
 * Contains methods to store these value in local database
 *
 * @class o5.platform.btv.Favourites
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.Favourites = new (function Favourites () {
    this._setFavoriteListCallbackLookup = {};
    this._removeFavoriteListCallbackLookup = {};
})();

/**
 * Event handler to fire callback functions
 * @method _fireCallback
 * @private
 * @param {Number} handle Handle
 * @param {Object} lookup Function table
 * @param {Boolean} param Value to send to callback to notify success or failed event notification
 */
o5.platform.btv.Favourites._fireCallback = function _fireCallback (handle, lookup, param) {
    if (handle && lookup[handle]) {
        lookup[handle](param, handle);
        lookup[handle] = null;
        delete lookup[handle];
    }
};

o5.platform.btv.Favourites._setFavoriteListOKListener = function _setFavoriteListOKListener (e) {
    var me = o5.platform.btv.Favourites;
    me._fireCallback(e.handle, me._setFavoriteListCallbackLookup, true);
};

o5.platform.btv.Favourites._setFavoriteListFailedListener = function _setFavoriteListFailedListener (e) {
    var me = o5.platform.btv.Favourites;
    me._fireCallback(e.handle, me._setFavoriteListCallbackLookup, false);
};

o5.platform.btv.Favourites._removeFavoriteListOKListener = function _removeFavoriteListOKListener (e) {
    var me = o5.platform.btv.Favourites;
    me._fireCallback(e.handle, me._removeFavoriteListCallbackLookup, true);
};

o5.platform.btv.Favourites._removeFavoriteListFailedListener = function _removeFavoriteListFailedListener (e) {
    var me = o5.platform.btv.Favourites;
    me._fireCallback(e.handle, me._removeFavoriteListCallbackLookup, false);
};

/**
 * Called by o5.$.init2() when O5 starts up.
 * @method _init
 * @private
 */
o5.platform.btv.Favourites._init = function _init () {
    // Don't use 'this' as this is called by o5.$.init2()
    var me = o5.platform.btv.Favourites;
    CCOM.EPG.addEventListener("setFavoriteListOK", me._setFavoriteListOKListener, false);
    CCOM.EPG.addEventListener("setFavoriteListFailed", me._setFavoriteListFailedListener, false);
    CCOM.EPG.addEventListener("removeFavoriteListOK", me._removeFavoriteListOKListener, false);
    CCOM.EPG.addEventListener("removeFavoriteListFailed", me._removeFavoriteListFailedListener, false);
};

/**
 * @method init
 * @deprecated Unnecessary call, don't use
 */
o5.platform.btv.Favourites.init = function init () {
    this.logDeprecated();
};

/**
 * Checks if the given folder already exists
 * @method folderExists
 * @param {String} folderName Folder name to check
 * @return {Boolean} True if folder exists, false otherwise
 */
o5.platform.btv.Favourites.folderExists = function folderExists (folderName) {
    var i,
        favFolders;
    if (folderName) {
        favFolders = this.getFavouriteFolders();
        for (i = favFolders.length - 1; i >= 0; i--) {
            if (favFolders[i] === folderName) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Retrieves a list of the user's favorite folders.
 * @method getFavouriteFolders
 * @return {Array.<String>} A list of the user's favorite folders.
 */
o5.platform.btv.Favourites.getFavouriteFolders = function getFavouriteFolders () {
    var favList = CCOM.EPG.getFavoriteLists();
    return (favList && favList.length !== 0) ? favList : [];
};

/**
 * Retrieves a complete list of user's favorite channels, grouped by the favorite folder name.
 * @method getAllFavouriteChannels
 * @return {Array.<Object>} An array of favorite folder objects containing folder name, get channel method,
 * and get service ids method. If there are no favorite folder, then an empty array is returned.
 * Each element of this list is an object with the following attributes:
 *
 *        name {String} Favorite folder name
 *        getChannels {Function} Function to retrieve the list of channels that belong to this folder
 *        getServiceIds {Function} Function to retrieve the list of channel service id that belong to this folder
 */
o5.platform.btv.Favourites.getAllFavouriteChannels = function getAllFavouriteChannels () {
    var i,
        favName,
        favFolders = this.getFavouriteFolders(),
        result = [];

    for (i = 0; i < favFolders.length; i++) {
        favName = favFolders[i];
        result.push({
            name: favName,
            getChannels: function () {
                return o5.platform.btv.Favourites.getFavouriteChannels(this.name);
            },
            getServiceIds: function () {
                return o5.platform.btv.Favourites.getFavouriteServiceIds(this.name);
            }
        });
    }

    return result;
};

/**
 * Returns an array of service ids for the given favorite folder name
 * @method getFavouriteServiceIds
 * @param {String} folderName Folder name to search for service ids
 * @return {Array.<String>} An array of service ids
 */
o5.platform.btv.Favourites.getFavouriteServiceIds = function getFavouriteServiceIds (folderName) {
    var i,
        properties = "serviceId",
        resultSet,
        serviceList,
        numServices,
        serviceIdList = [];

    resultSet = CCOM.EPG.getServicesRSByFavoriteList(properties, folderName);

    if (resultSet && resultSet.error === undefined) {
        serviceList = resultSet.getNext(999);
        resultSet.reset();
        resultSet = null;

        numServices = serviceList ? serviceList.length : 0;
        for (i = 0; i < numServices; i++) {
            serviceIdList[i] = serviceList[i].serviceId;
        }
    } else {
        resultSet.reset();
    }

    return serviceIdList;
};

/**
 * Same as getFavouriteServiceIds()
 * @method getFavouriteChannelServiceIds
 * @deprecated use getFavouriteServiceIds
 * @param {String} folderName Folder name to search for service ids
 * @return {Array.<String>} An array of service ids
 */
o5.platform.btv.Favourites.getFavouriteChannelServiceIds = function getFavouriteChannelServiceIds (folderName) {
    this.logDeprecated();
    return this.getFavouriteServiceIds(folderName);
};

/**
 * Retrieves the user's favorite channels from a specific favorites folder.
 * @method getFavouriteChannels
 * @param {String} folderName Folder name to retrieve favorite
 * @return {Array.<Object>} An array of channels within the specified folderName.
 * Empty array is returned if not found.
 */
o5.platform.btv.Favourites.getFavouriteChannels = function getFavouriteChannels (folderName) {
    var i,
        favouriteChannels = [],
        serviceIdList,
        properties = "serviceId",
        resultSet,
        numServices,
        channel;

    resultSet = CCOM.EPG.getServicesRSByFavoriteList(properties, folderName);

    if (resultSet && resultSet.error === undefined) {
        serviceIdList = resultSet.getNext(999);
        resultSet.reset();
        resultSet = null;
        numServices = serviceIdList ? serviceIdList.length : 0;
        for (i = 0; i < numServices; i++) {
            channel = o5.platform.btv.EPG.getChannelByServiceId(serviceIdList[i].serviceId);
            favouriteChannels.push(channel || {
                serviceId: serviceIdList[i].serviceId
            });
        }
    } else {
        resultSet.reset();
    }

    return favouriteChannels;
};

/**
 * Check if the specified service id exist in the specified favorites folder.
 * @method checkFavouriteChannelServiceIds
 * @param {String} folderName Folder name to search
 * @param {String} serviceId Service id to search
 * @return {Boolean} Returns true if the service id exist in the folder, otherwise false.
 */
o5.platform.btv.Favourites.checkFavouriteChannelServiceIds = function checkFavouriteChannelServiceIds (folderName, serviceId) {
    var i,
        serviceIdList,
        properties = "serviceId",
        resultSet,
        numServices;

    resultSet = CCOM.EPG.getServicesRSByFavoriteList(properties, folderName);

    if (resultSet && resultSet.error === undefined) {
        serviceIdList = resultSet.getNext(999);
        resultSet.reset();
        resultSet = null;
        numServices = serviceIdList ? serviceIdList.length : 0;
        for (i = 0; i < numServices; i++) {
            if (serviceIdList[i].serviceId === serviceId) {
                return true;
            }
        }
    } else {
        resultSet.reset();
    }

    return false;
};

/**
 * @method addFavouriteFolder
 * @deprecated Don't use, does nothing
 * @param {String} folderName Folder name
 * @return {Boolean} Always returns true
 */
o5.platform.btv.Favourites.addFavouriteFolder = function addFavouriteFolder (folderName) {
    this.logDeprecated();
    return true;
};

/**
 * Saves the user's favorite channels to persistent memory.
 * @method setFavouriteServiceIds
 * @async
 * @param {String} folderName Folder name to save
 * @param {Array.<String>} serviceIdList An array of service ids to be saved
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure
 * @param {Number} callback.handle Handle that can be used to check against the returned value
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.Favourites.setFavouriteServiceIds = function setFavouriteServiceIds (folderName, serviceIdList, callback) {
    var i,
        handle;

    if (folderName && serviceIdList && serviceIdList.length) {
        handle = CCOM.EPG.setFavoriteList(folderName, serviceIdList);
        if (handle && callback) {
            this._setFavoriteListCallbackLookup[handle] = callback;
        }
    }
    return handle;
};

/**
 * @method setFavouriteChannels
 * @async
 * @deprecated use setFavouriteServiceIds
 * @param {String} folderName Folder name to save
 * @param {Array.<String>} serviceIdList An array of service ids to be saved
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure
 * @param {Number} callback.handle Handle that can be used to check against the returned value
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.Favourites.setFavouriteChannels = function setFavouriteChannels (folderName, serviceIdList, callback) {
    this.logDeprecated();
    return this.setFavouriteServiceIds(folderName, serviceIdList, callback);
};

/**
 * @method setFavouriteFolders
 * @async
 * @deprecated use setFavouriteServiceIds
 * @param {String} folderName Folder name to save
 * @param {Array.<String>} serviceIdList An array of service ids to be saved
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure
 * @param {Number} callback.handle Handle that can be used to check against the returned value
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.Favourites.setFavouriteFolders = function setFavouriteFolders (folderName, serviceIdList, callback) {
    this.logDeprecated();
    return this.setFavouriteServiceIds(folderName, serviceIdList, callback);
};

/**
 * @method setFavouriteChannelsToServiceIds
 * @async
 * @deprecated use setFavouriteServiceIds
 * @param {String} folderName Folder name to save
 * @param {Array.<String>} serviceIdList An array of service ids to be saved
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure
 * @param {Number} callback.handle Handle that can be used to check against the returned value
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.Favourites.setFavouriteChannelsToServiceIds = function setFavouriteChannelsToServiceIds (folderName, serviceIdList, callback) {
    this.logDeprecated();
    return this.setFavouriteServiceIds(folderName, serviceIdList, callback);
};

/**
 * Determines whether or not the user has created any favorites.
 * @method userHasFavourites
 * @removed
 */

/**
 * Adds a channel to the specified favorite folder.
 * @method addFavouriteChannel
 * @async
 * @param {Object} channel EPG service object that is to be added
 * @param {String} channel.serviceId Service id, this property must exist
 * @param {String} folderName Favorite folder to which the channel is to be added
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure
 * @param {Number} callback.handle Handle that can be used to check against the returned value
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls
 */
o5.platform.btv.Favourites.addFavouriteChannel = function addFavouriteChannel (channel, folderName, callback) {
    var i,
        handle,
        favChannels,
        serviceIdList = [];

    if (channel && channel.serviceId && folderName) {
        favChannels = this.getFavouriteChannels(folderName);
        favChannels.push(channel);
        for (i = 0; i < favChannels.length; i++) {
            serviceIdList.push(favChannels[i].serviceId);
        }
        handle = this.setFavouriteServiceIds(folderName, serviceIdList, callback);
    }
    return handle;
};

/**
 * Removes a channel from a specified favorite folder.
 * @method removeFavouriteChannel
 * @async
 * @param {Object} channel EPG service object that's to be removed from favorites
 * @param {String} channel.serviceId Service id, this property must exist
 * @param {String} folderName Favorites folder from which channel is to be removed
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure
 * @param {Number} callback.handle Handle that can be used to check against the returned value
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls
 */
o5.platform.btv.Favourites.removeFavouriteChannel = function removeFavouriteChannel (channel, folderName, callback) {
    var i,
        handle,
        serviceIdList = [];

    if (channel && channel.serviceId && this.folderExists(folderName)) {
        serviceIdList = this.getFavouriteServiceIds(folderName);
        for (i = 0; i < serviceIdList.length; i++) {
            if (serviceIdList[i] === channel.serviceId) {
                serviceIdList.splice(i, 1);
                handle = this.setFavouriteServiceIds(folderName, serviceIdList, callback);
                return handle;
            }
        }
    }
    return handle;
};

/**
 * Renames a favorite folder while keeping its favorite channels
 * @method renameFavouriteFolder
 * @async
 * @param {String} currentFolderName Current folder name to be renamed
 * @param {String} newFolderName New folder name
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure
 * @param {Number} callback.handle Handle that can be used to check against the returned value
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls
 */
o5.platform.btv.Favourites.renameFavouriteFolder = function renameFavouriteFolder (currentFolderName, newFolderName, callback) {
    var handle,
        serviceIdList = this.getFavouriteServiceIds(currentFolderName);

    if (serviceIdList && serviceIdList.length) {
        this.deleteFavouriteFolder(currentFolderName);
        handle = this.setFavouriteServiceIds(newFolderName, serviceIdList, callback);
        return handle;
    }
    return handle;
};

/**
 * Deletes the specified favorite folder
 * @method deleteFavouriteFolder
 * @async
 * @param {String} folderName Folder name to delete
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure
 * @param {Number} callback.handle Handle that can be used to check against the returned value
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls
 */
o5.platform.btv.Favourites.deleteFavouriteFolder = function deleteFavouriteFolder (folderName, callback) {
    var handle;

    if (folderName) {
        handle = CCOM.EPG.removeFavoriteList(folderName);
        if (handle && callback) {
            this._removeFavoriteListCallbackLookup[handle] = callback;
        }
    }
    return handle;
};

/**
 * Removes all favorites folders
 * @method deleteAll
 * @async
 */
o5.platform.btv.Favourites.deleteAll = function deleteAll () {
    var i,
        favFolders = this.getFavouriteFolders();

    for (i = favFolders.length - 1; i >= 0; i--) {
        this.deleteFavouriteFolder(favFolders[i]);
    }
};


// Add _init() to array for o5.$.init2() to call when O5 starts up.
o5.$.init2Callbacks.push(o5.platform.btv.Favourites._init);

// uncomment to turn debugging on for Favorites object
// o5.log.setAll(o5.platform.btv.Favourites, true);
