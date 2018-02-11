/**
 * @class app.gui.controls.SettingsChannelMenuCategory
 * @extends o5.gui.controls.ListItem
 */

app.gui.controls.SettingsChannelMenuChannelItem = function SettingsChannelMenuChannelItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsChannelMenuChannelItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsChannelMenuChannelItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._icon = this.querySelector('.icon');
	this._channelNumber = this.querySelector('.channelNumber');
	this._channelName = this.querySelector('.channelName');
	this._focusClass = "listView-focused";
	this._isFav = false;
	this._blocked = false;
	this._type = "";
	this.logExit();
};

/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.SettingsChannelMenuChannelItem.prototype, "itemData", {
	get: function get() {
		return this._channel;
	},
	set: function set(channel) {
		var isChannelFav = false,
			isChannelBloacked = false;
		this._channel = channel;
		this._channelName.innerText = (channel && channel.serviceName) ? channel.serviceName : "";
		this._channelNumber.innerText = (channel && channel.logicalChannelNum) ? channel.logicalChannelNum : "";
		if (this._channel && this._channel.serviceId) {
			if (this._type === "FAV_ITEM") {
				isChannelFav = $service.settings.FavouriteService.isChannleFavourite(this._channel);
				if (isChannelFav) {
					this.classList.add("fav");
					this._isFav = true;
				} else {
					this.classList.remove("fav");
					this._isFav = false;
				}
			} else if (this._type === "CHANNEL_BLOCKED_ITEM") {
				  isChannelBloacked = $service.settings.ChannelBlocking.isChannelLocked(this._channel);
				  if (isChannelBloacked) {
					this.classList.add("blocked");
					this._blocked = true;
				} else {
					this.classList.remove("blocked");
					this._blocked = false;
				}
			}
		}
	}
});

/**
 * @property type
 * @public
 * @type {Object} channel
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(app.gui.controls.SettingsChannelMenuChannelItem.prototype, 'type', {
	get: function () {
		return this._type;
	},
	set: function (val) {
		this._type = val;
	},
	toAttribute: function (val) {
		return val ? val.localName : '';
	},
	fromAttribute: function (val) {
		return val;
	}
});

/**
 * @property blocked
 * @public
 * @type {Boolean} blocked
 */
Object.defineProperty(app.gui.controls.SettingsChannelMenuChannelItem.prototype, "blocked", {
	get: function get() {
		return this._blocked;
	},
	set: function set(isBlocked) {
		if (isBlocked) {
			this.classList.add("blocked");
			$service.settings.ChannelBlocking.blockChannel(this._channel);
		} else {
			this.classList.remove("blocked");
			 $service.settings.ChannelBlocking.unblockChannel(this._channel);
		}
		this._blocked = isBlocked;
	}
});


/**
 * @property blocked
 * @public
 * @type {Boolean} blocked
 */
Object.defineProperty(app.gui.controls.SettingsChannelMenuChannelItem.prototype, "favourite", {
	get: function get() {
		return this._isFav;
	},
	set: function set(isFavourite) {
		var me = this;
		if (isFavourite) {
			$service.settings.FavouriteService.addFavouriteChannel(this._channel, function(result) {
	   			if (result) {
	   				me.classList.add("fav");
	   				me._isFav = true;
	   				$util.ControlEvents.fire("app-settings:" + me.parentElement.parentElement.id, "updateFooter");
	   			} else {
	   				me._isFav = false;
	   			}
	   		});
		} else {
			$service.settings.FavouriteService.removeFavouriteChannel(this._channel, function(result) {
				if (result) {
					me.classList.remove("fav");
					me._isFav = false;
					$util.ControlEvents.fire("app-settings:" + me.parentElement.parentElement.id, "updateFooter");
				}
			});
		}
		
	}
});

/**
 * @method onSelect
 * @public
 */
app.gui.controls.SettingsChannelMenuChannelItem.prototype._onSelect = function _onSelect() {
	this.logEntry();
	this.superCall();
	if (this.parentElement && this.parentElement.parentElement) {
		$util.ControlEvents.fire("app-settings:" + this.parentElement.parentElement.id, "channelChanged", this._channel);
	}
	this.logExit();
};




/**
 * @method onSelect
 * @public
 */
app.gui.controls.SettingsChannelMenuChannelItem.prototype._toggleFav = function _toggleFav() {
	this.logEntry();
	if (this.favourite) {
		this.favourite = false;
   } else {
		this.favourite = true;
   }
	this.logExit();
};


/**
 * @method onSelect
 * @public
 */
app.gui.controls.SettingsChannelMenuChannelItem.prototype._toggleBlocked = function _toggleBlocked() {
	this.logEntry();
	if (this.blocked) {
		this.blocked = false;
   } else {
		this.blocked = true;
   }
	this.logExit();
};

/**
 * @method _onDefocus
 */
app.gui.controls.SettingsChannelMenuChannelItem.prototype._onDefocus = function _onDefocus () {
    this.logEntry();
    if (this._focusClass) {
        this.classList.remove(this._focusClass);
    }
    this.logExit();
};
