/**
 * Provides logic for building the list of categories displayed in the zapper, guide and CatchUp.
 *
 * @class o5.platform.btv.ChannelCategories
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.ChannelCategories = new (function ChannelCategories () {
    this._CURRENT_CATEGORY = 'tv.currentCategory';
    this._currentPreferredCategory = null;
})();

/**
 * Enumeration of category types
 * @readonly
 * @property {String} CategoryType
 * @property {String} CategoryType.Radio radioChannels
 * @property {String} CategoryType.CatchUp catchupChannels
 * @property {String} CategoryType.Ott ottLiveChannels
 * @property {String} CategoryType.Broadcast broadcastChannels
 * @property {String} CategoryType.Terrestrial terrestrialChannels
 * @property {String} CategoryType.Gateway gatewayChannels
 * @property {String} CategoryType.Subscribed subscribedChannels
 * @property {String} CategoryType.All allChannels
 */
o5.platform.btv.ChannelCategories.CategoryType = {
    Radio: 'radioChannels',
    CatchUp: 'catchupChannels',
    Ott: 'ottLiveChannels',
    Broadcast: 'broadcastChannels',
    Terrestrial: 'terrestrialChannels',
    Gateway: 'gatewayChannels',
    Subscribed: 'subscribedChannels',
    All: 'allChannels'
};

/**
 * Called by o5.$.init2() when O5 starts up.
 * @method _init
 * @private
 */
o5.platform.btv.ChannelCategories._init = function _init () {
    var me = o5.platform.btv.ChannelCategories;
    me._currentPreferredCategory = o5.platform.system.Preferences.get(me._CURRENT_CATEGORY);
    if (!me._currentPreferredCategory) {
        me.setCurrentCategory(me.CategoryType.All);
    }
};

/**
 * @method initialise
 * @deprecated Unnecessary call, don't use
 */
o5.platform.btv.ChannelCategories.initialise = function initialise () {
    this.logDeprecated();
};

/**
 * Retrieves the available channel category list with get channels and get service id methods.
 * If genre list is available, it is also returned by this method.
 * @method getCategoryList
 * @param {Boolean} [showCatchUp=false] Set to true to query for catchup channels.
 * @return {Array.<Object>} List of available categories according to `CategoryType`.
 * Each element of this list is an object with the following attributes:
 *
 *        name {String} One of `CategoryType` types or genre name if available
 *        getChannels {Function} Function to retrieve the list of channels that belong to the category
 *        getServiceIds {Function} Function to retrieve the list of channel service id that belong to the category
 */
o5.platform.btv.ChannelCategories.getCategoryList = function getCategoryList (showCatchUp) {
    var i,
        result = [],
        genreList = o5.platform.btv.EPG.getStoredGenreList();

    for (i = 0; i < genreList.length; i++) {
        if (genreList[i].userByte) {
            result.unshift({
                name: genreList[i].userByte,
                getChannels: function () {
                    return o5.platform.btv.EPG.getChannelsByGenre(this.name);
                },
                getServiceIds: function () {
                    return o5.platform.btv.EPG.getGenreServiceIdArraySortedByLCN(this.name);
                },
                isGenre: true
            });
        }
    }

    if (showCatchUp && o5.platform.btv.EPG.getCatchupChannels().length) {
        result.unshift({
            name: this.CategoryType.CatchUp,
            getChannels: function () {
                return o5.platform.btv.EPG.getCatchupChannels();
            },
            getServiceIds: function () {
                return o5.platform.btv.EPG.getCatchupServiceIdArray();
            }
        });
    }

    if (o5.platform.btv.EPG.getRadioChannels().length) {
        result.unshift({
            name: this.CategoryType.Radio,
            getChannels: function () {
                return o5.platform.btv.EPG.getRadioChannelsOrderedByChannelNumber();
            },
            getServiceIds: function () {
                return o5.platform.btv.EPG.getRadioServiceIdArraySortedByLCN();
            }
        });
    }

    if (o5.platform.btv.EPG.getDVBChannels().length) {
        result.unshift({
            name: this.CategoryType.Broadcast,
            getChannels: function () {
                return o5.platform.btv.EPG.getDVBChannelsOrderedByChannelNumber();
            },
            getServiceIds: function () {
                return o5.platform.btv.EPG.getDVBServiceIdArraySortedByLCN();
            }
        });
    }

    if (o5.platform.btv.EPG.getISDBChannels().length) {
        result.unshift({
            name: this.CategoryType.Terrestrial,
            getChannels: function () {
                return o5.platform.btv.EPG.getISDBChannelsOrderedByChannelNumber();
            },
            getServiceIds: function () {
                return o5.platform.btv.EPG.getISDBServiceIdArraySortedByLCN();
            }
        });
    }

    if (o5.platform.btv.EPG.getGatewayChannels().length) {
        result.unshift({
            name: this.CategoryType.Gateway,
            getChannels: function () {
                return o5.platform.btv.EPG.getGatewayChannelsOrderedByChannelNumber();
            },
            getServiceIds: function () {
                return o5.platform.btv.EPG.getGatewayServiceIdArraySortedByLCN();
            }
        });
    }

    if (o5.platform.btv.EPG.getIPChannels().length) {
        result.unshift({
            name: this.CategoryType.Ott,
            getChannels: function () {
                return o5.platform.btv.EPG.getIPChannelsOrderedByChannelNumber();
            },
            getServiceIds: function () {
                return o5.platform.btv.EPG.getIPServiceIdArraySortedByLCN();
            }
        });
    }

    if (o5.platform.btv.EPG.getSubscribedChannels().length) {
        result.unshift({
            name: this.CategoryType.Subscribed,
            getChannels: function () {
                return o5.platform.btv.EPG.getSubscribedChannelsOrderedByChannelNumber();
            },
            getServiceIds: function () {
                return o5.platform.btv.EPG.getSubscribedServiceIdArraySortedByLCN();
            }
        });
    }

    if (o5.platform.btv.EPG.getAllChannels().length) {
        result.unshift({
            name: this.CategoryType.All,
            getChannels: function () {
                return o5.platform.btv.EPG.getAllChannelsOrderedByChannelNumber();
            },
            getServiceIds: function () {
                return o5.platform.btv.EPG.getServiceIdArraySortedByLCN();
            }
        });
    }
    this.logInfo("getCategoryList(): result.length = " + result.length);
    // for (i = 0; i < result.length; i++) {
    //     this.logInfo("  --> [" + i + "] " + result[i].name);
    // }

    return result;
};

/**
 * Retrieves the named category.
 *
 * @method getCategoryByName
 * @param {String} categoryName Category that we're interested in
 * @return {Object} Category object matching the name. See `getCategoryList` for description of the object
 */
o5.platform.btv.ChannelCategories.getCategoryByName = function getCategoryByName (categoryName) {
    var categoryList = this.getCategoryList(),
        numCategories,
        category,
        retCategory = null,
        i;
    if (categoryName) {
        for (i = 0, numCategories = categoryList.length; i < numCategories; i++) {
            category = categoryList[i];
            if (category && category.name && category.name === categoryName) {
                retCategory = category;
                break;
            }
        }
    }
    return retCategory;
};

/**
 * Retrieves the channels within the named category.
 *
 * @method getChannelsFromCategory
 * @param {String} categoryName Category that we're interested in
 * @return {Array} List of channels in the specified category
 */
o5.platform.btv.ChannelCategories.getChannelsFromCategory = function getChannelsFromCategory (categoryName) {
    var category = this.getCategoryByName(categoryName),
        channelList = category ? category.getChannels() : [];
    return channelList;
};

/**
 * Check for the existence of a channel given serviceId and category
 * @method checkChannelInCategory
 * @param {String} serviceId Service id
 * @param {String} categoryName Category name
 * @return {Boolean} Returns true if channel exists, otherwise false
 */
// Disable ESLint complexity because this API may be refactored in the future to remove several category types
// eslint-disable-next-line complexity
o5.platform.btv.ChannelCategories.checkChannelInCategory = function checkChannelInCategory (serviceId, categoryName) {
    var channel = o5.platform.btv.EPG.getChannelByServiceId(serviceId),
        catchupChannels,
        subscribedChannels;

    if (channel === undefined) {
        return false;
    }

    switch (categoryName) {
        case this.CategoryType.Radio:
            if (channel.serviceType === o5.data.EPGService.SERVICE_TYPE.RADIO) {
                return true;
            }
            break;

        case this.CategoryType.CatchUp:
            catchupChannels = o5.platform.btv.EPG.getCatchupServiceIdTable();
            if (catchupChannels[serviceId]) {
                return true;
            }
            break;

        case this.CategoryType.Ott:
            if ((channel.uri) && (channel.uri.substring(0, 7) === 'http://')) {
                return true;
            }
            break;

        case this.CategoryType.Broadcast:
            if ((channel.uri) && (channel.uri.substring(0, 6) === 'dvb://' || (channel.uri.substring(0, 5) === 'tv://' && channel.uri.indexOf("isdbt") <= -1))) {
                return true;
            }
            break;

        case this.CategoryType.Terrestrial:
            if ((channel.uri) && (channel.uri.indexOf("isdbt") > -1)) {
                return true;
            }
            break;

        case this.CategoryType.Gateway:
            if ((channel.uri) && (channel.uri.substring(0, 7) === 'dlna://')) {
                return true;
            }
            break;

        case this.CategoryType.Subscribed:
            subscribedChannels = o5.platform.btv.EPG.getSubscribedChannelsOrderedByServiceId();
            if (subscribedChannels[serviceId] !== undefined) {
                return true;
            }
            break;

        case this.CategoryType.All:
            // Since channel is found, it must be true
            return true;

        default:
            // o5.platform.btv.EPG.getChannelsByGenre(categoryName)
            this.logWarning("Unexpected or unknown categoryName " + categoryName + ", genre name?");
            break;
    }
    return false;
};

/**
 * @method getAllChannels
 * @removed
 */

/**
 * Returns the current category name that the application
 * should use to render the service list.
 *
 * Note: this could be the name of a favorite folder also
 * @method getCurrentCategory
 * @return {String} Current category
 */
o5.platform.btv.ChannelCategories.getCurrentCategory = function getCurrentCategory () {
    return this._currentPreferredCategory;
};

/**
 * Sets the current category name that the application
 * should use to draw the service list.
 *
 * Note: this could be the name of a favorite folder also
 * @method setCurrentCategory
 * @param {String} categoryName Category name
 * @return {Boolean} True if the value was set successfully, false otherwise.
 */
o5.platform.btv.ChannelCategories.setCurrentCategory = function setCurrentCategory (categoryName) {
    this._currentPreferredCategory = categoryName;
    return o5.platform.system.Preferences.set(this._CURRENT_CATEGORY, categoryName);
};

/**
 * Resets the current category back to all channels
 * @method resetCurrentCategory
 * @return {Boolean} True if the value was set successfully, false otherwise.
 */
o5.platform.btv.ChannelCategories.resetCurrentCategory = function resetCurrentCategory () {
    this._currentPreferredCategory = this.CategoryType.All;
    return o5.platform.system.Preferences.set(this._CURRENT_CATEGORY, this.CategoryType.All);
};


// Add _init() to array for o5.$.init2() to call when O5 starts up.
o5.$.init2Callbacks.push(o5.platform.btv.ChannelCategories._init);

// uncomment to turn debugging on for ChannelCategories object
//o5.log.setAll(o5.platform.btv.ChannelCategories, true);
