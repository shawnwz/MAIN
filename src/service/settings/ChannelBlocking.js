/**
 * @class $service.settings.ChannelBlocking
 */
"use strict";

$service.settings.ChannelBlocking = (function ChannelBlocking() {
    var blockedChannelList = [];

    function callbackUnblockAllChannels(isModified) {
        this.logDebug("callback _removeAllRestrictedChannels isModified=" + isModified);


       /* if (isModified === true) {
            this._cachedParsedRestrictedChannels(parsedData);
            this._cleanupTimeWindows(masterPin, null);
        }
        callback(isModified);*/
    }
    return {

        /**
         * @method init
         * @public
         */
        init: function init() {
            var key,
            	blockedChannelListFromMW = o5.platform.ca.ParentalControl.getRestrictedServices();
	        if (blockedChannelListFromMW && blockedChannelListFromMW !== null) {
				for (key in blockedChannelListFromMW) {
					if (blockedChannelListFromMW.hasOwnProperty(key)) {
						blockedChannelList.push(blockedChannelListFromMW[key]);
					}
				}
			}
        },

        /**
         * @method blockChannel
         * @public
         * @return {Object}
         */
        blockChannel: function blockChannel(channel) {
			blockedChannelList.push(channel.serviceId);
            return o5.platform.ca.ParentalControl.addRestrictedChannel(o5.platform.ca.PINHandler.getMasterPin(), channel.serviceId);
        },

        /**
         * @method unblockChannel
         * @public
         * @return {Object}
         */
        unblockChannel: function unblockChannel(channel) {
            var i,
                len = blockedChannelList.length;
            for (i = 0; i < len; i++) {
                if (blockedChannelList[i] === channel.serviceId) {
                    blockedChannelList.splice(i, 1);
                    break;
                }
            }
            return o5.platform.ca.ParentalControl.removeRestrictedChannel(o5.platform.ca.PINHandler.getMasterPin(), channel.serviceId);
        },

        /**
         * @method unblockAllChannel
         * @public
         * @return {Object}
         */
        unblockAllChannel: function unblockAllChannel() {
            blockedChannelList = [];
            return o5.platform.ca.ParentalControl.removeAllRestrictedChannels(o5.platform.ca.PINHandler.getMasterPin(), callbackUnblockAllChannels);
        },

        /**
         * @method getAllBlockedChannels
         * @public
         * @return {Object}
         */
        getAllBlockedChannels: function getAllBlockedChannels() {
            return blockedChannelList;

        },

        /**
         * @method isAnyBlockedChannelsAvaliable
         * @public
         * @return {Object}
         */

        isAnyBlockedChannelsAvaliable: function isAnyBlockedChannelsAvaliable() {
            return (blockedChannelList.length > 0 > 0);

        },

        /**
         * @method isChannelBlocked
         * @public
         * @return {Object}
         */
        isChannelLocked: function isChannelBlocked(channel) {
            var i,
				len = blockedChannelList.length;
            for (i = 0; i < len; i++) {
                if (blockedChannelList[i] === channel.serviceId) {
					return true;
				}
            }
            return false;
        }

    };
}());

