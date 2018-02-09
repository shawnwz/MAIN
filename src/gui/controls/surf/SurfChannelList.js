/**
 * @class app.gui.controls.SurfChannelList
 */

app.gui.controls.SurfChannelList = function SurfChannelList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SurfChannelList, app.gui.controls.HtmlFlexList);

/**
 * @method createdCallback
 */
app.gui.controls.SurfChannelList.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this.animate = true;

	this._listElem.className = "surfScanChannelStack-list surfScanChannelStack-anim-fast";
	this._viewWindow = this._listElem;

	this._channels = [];
	this._service = null;
	this._favoriteMode = false;
	
	this._hiddenClass = "channelStack-anim-fadeOut";

	this.onControlEvent("tune", function () {
        $util.ControlEvents.fire("app-video", "setSrc", this.selectedItem.itemData);
	});

//	$util.Events.on("service:MDS:channel:fetch", this._clear, this);

	$util.Events.on("service:EPG:channel:updated", function (channels) {
		if (this._favoriteMode === false) {
			this._channels = channels;
		} else {
			this._channels = [];
		    var favoriteChannelList = o5.platform.btv.Favourites.getAllFavouriteChannels();
		    favoriteChannelList.forEach(function (item) {
			    this._channels = this._channels.concat(item.getChannels());
		    });
		}
	}, this);

	this.onControlEvent("favourite", function (favouriteMode) {
    	this._favoriteMode = favouriteMode;
	});
    // update current channel when channel changed, event no AV stream played in this channel.
    $util.ControlEvents.on("app-video", "channelChanged", function (data) {
    	this._service = data;
    }, this);
	this._getChannelIndex = function (serviceId) {
		for (var i = 0, len = this._channels.length; i < len; i++) {
			if (this._channels[i].serviceId === serviceId) {
				return i;
			}
		}
		return -1;
	};
	this.logExit();
};

/**
 * @method _fetch
 * @param {Object} channels - ommit to refetch
 */
app.gui.controls.SurfChannelList.prototype._fetch = function _fetch (channels) {
	this.logEntry();
	
	if (channels) {
		this._channels = channels;
	}

	var service,
	    index,
	    i,
	    len = 0,
	    favoriteChannels = [],
	    favoriteChannelList;

	if (this._favoriteMode === true) {
		this._channels.forEach(function (item) {
			item.favorite = true;
		});
	} else {
		this._channels.forEach(function (item) {
			item.favorite = false;
		});
		
		favoriteChannelList = o5.platform.btv.Favourites.getAllFavouriteChannels();
		favoriteChannelList.forEach(function (item) {
			favoriteChannels = favoriteChannels.concat(item.getChannels());
		});
		len = favoriteChannels.length;

		if (len !== 0) {
			this._channels.forEach(function (item) {
				for (i = 0; i < len; i++) {
					if (item.logicalChannelNum === favoriteChannels[i].logicalChannelNum) {
						item.favorite = true;
						break;
					}
				}
		    });
		}
	}

    service = this._service;
	index = service && service.serviceId ? this._getChannelIndex(service.serviceId) : -1;
	this.fireControlEvent("populate", this._channels, index !== -1 ? index : 0);
	this.logExit();
};

/**
 * @method _selectChannel
 * @param {Object} channel
 */
app.gui.controls.SurfChannelList.prototype._select = function _select (service) {
	this.logEntry();
	var index = service && service.serviceId ? this._getChannelIndex(service.serviceId) : 0;
	this.fireControlEvent("populate", this._channels, index);
	this.superCall(index);
	this.logExit();
};




/**
 * @class app.gui.controls.SurfChannelListItem
 */

app.gui.controls.SurfChannelListItem = function SurfChannelListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SurfChannelListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SurfChannelListItem.prototype.createdCallback = function createdCallback () {
//	this.logEntry();
	this.superCall();

  this._name = this.querySelector('.surfScanChannelStack-channelName');
  this._logo = this.querySelector('.surfScanChannelStack-channelLogo');
  this._favorite = this.querySelector('.surfScanChannelStack-channelFavorite');

//	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SurfChannelListItem.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;
		switch ($config.getConfigValue("settings.tv.guide.channel.name.display")) {
			case "logo":
				if (data.logo && data.logo !== "" && data.logo !== "undefined") { //@hdk fix this! Other places wont check for the "undefined" string!
	  				this._logo.style.backgroundImage = "url('" + data.logo + "')";
				} else if (data.serviceName && data.serviceName !== "") {
	  				this._name.textContent = data.serviceName;
				} else if (data.logicalChannelNum && data.logicalChannelNum !== "") {
	  				this._name.textContent = data.logicalChannelNum;
				}
				break;
			case "text":
				if (data.serviceName && data.serviceName !== "" && data.serviceName !== "undefined") { //@hdk fix this! Other places wont check for the "undefined" string!
	  				this._name.textContent = data.serviceName;
				} else if (data.logo && data.logo !== "") {
	  				this._logo.style.backgroundImage = "url('" + data.logo + "')";
				} else if (data.logicalChannelNum && data.logicalChannelNum !== "") {
	  				this._name.textContent = data.logicalChannelNum;
				}
				break;
			default:
				break;
		}
		if (data.favorite) {
			this._favorite.classList.add("surfScanChannelStack-channelFavorite");
		} else {
			this._favorite.classList.remove("surfScanChannelStack-channelFavorite");
		}
	}
});

