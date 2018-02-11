/**
 * @class $service.settings.FavouriteService
 */
"use strict";

$service.settings.FavouriteService = (function FavouriteService() {
	var folderName = "Defualt",
		MAX_FAV_CHANNEL = 20,
		favoriteChannelList = [];
	
		/**
		 * @method addFavouriteChannel
		 * @public
		 * @return {Object}
		 */
		function addFavouriteChannel(channel, callback) {
			var len = favoriteChannelList.length;
			if (len < MAX_FAV_CHANNEL) {
				o5.platform.btv.Favourites.addFavouriteChannel(channel, folderName, function(result) {
					if (result) {
						favoriteChannelList.push(channel);
					}
					callback(result);
				});
			}

		}

		/**
		 * @method removeFavouriteChannel
		 * @public
		 * @return {Object}
		 */
		function removeAllFavouriteChannel(callback) {
			o5.platform.btv.Favourites.deleteFavouriteFolder(folderName, function(result) {
				if (result) {
					favoriteChannelList = [];
				}
				callback(result);
			});
			
		}

		/**
		 * @method removeFavouriteChannel
		 * @public
		 * @return {Object}
		 */
		function removeFavouriteChannel(channel, callback) {
			var i,
				len = favoriteChannelList.length;
			if (len === 1) {
				removeAllFavouriteChannel(callback);
			} else {
				o5.platform.btv.Favourites.removeFavouriteChannel(channel, folderName, function(result) {
				if (result) {
					for (i = 0; i < len; i++) {
						if (favoriteChannelList[i].serviceId === channel.serviceId) {
							favoriteChannelList.splice(i, 1);
							break;
						}
					}
				}
					callback(result);
				});
			}
		}

		function isAnyFavouriteAvaliable() {
			return favoriteChannelList.length > 0;
		}

		function isChannleFavourite(channel) {
			var i,
				len = favoriteChannelList.length;
			if (channel && channel.serviceId) {
				for (i = 0; i < len; i++) {
					if (favoriteChannelList[i].serviceId === channel.serviceId) {
						return true;
					}
				}
			}
			return false;
		}

		/**
		 * @method init
		 * @public
		 * @return {Object}
		 */
		function init() {
		 favoriteChannelList = o5.platform.btv.Favourites.getFavouriteChannels(folderName);
		}

	return {
		addFavouriteChannel      : addFavouriteChannel,
		removeFavouriteChannel   : removeFavouriteChannel,
		removeAllFavouriteChannel: removeAllFavouriteChannel,
		isChannleFavourite       : isChannleFavourite,
		isAnyFavouriteAvaliable  : isAnyFavouriteAvaliable,
		init                     : init
		};
}());
