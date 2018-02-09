/**
 * @class app.gui.controls.GuideChannelList
 */

app.gui.controls.GuideChannelList = function GuideChannelList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideChannelList, app.gui.controls.HtmlPagedList);

/**
 * @method createdCallback
 */
app.gui.controls.GuideChannelList.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this._maxItemNb = 10;
	this._minItemNb = 10;
	this._cyclic = true;

	$util.Events.on("service:MDS:channel:fetch", function () {
		// dont use this here, use the EPG:channel service instead
	}, this);
	$util.Events.on("service:EPG:channel:updated", function (items) {
		this._channels = items;
		this._favChannels = [];
		this._page = 0;
	}, this);

	$util.ControlEvents.on("app-guide:nowNextGrid", "exit:up", function () {
		this.fireControlEvent("page:previous");
		this.fireControlEvent("select", this._maxItemNb - 1);
	}, this);
	$util.ControlEvents.on("app-guide:nowNextGrid", "exit:down", function () {
		this.fireControlEvent("page:next");
		this.fireControlEvent("select", 0);
	}, this);
	this.onControlEvent("selectChannel", function (channel, genre) {
 		var channelIndex;

 		if (genre === "genre_Favourites") {
 			channelIndex = this._favChannels.findIndex(function (element) {
				return element.mainChannelId === channel || element.serviceId === channel;
			});
 		} else {
 			channelIndex = this._channels.findIndex(function (element) {
				return element.mainChannelId === channel || element.serviceId === channel;
			});
 		}
 		if (channelIndex >= 0) {
 			this.fireControlEvent("select", channelIndex % this._maxItemNb);
 		}
	});
 	this.onControlEvent("selectPage", function (channel, genre) {
 		//set the pageIndex before fetch data, then can just populated the required channels
 		var channelIndex, pageIndex, channelList;

 		if (genre === "genre_Favourites") {
 			channelList = this._favChannels;
 		} else {
 			channelList = this._channels;
 		}

 		channelIndex = channelList.findIndex(function (element) {
			return element.mainChannelId === channel || element.serviceId === channel;
		});
 		if (channelIndex >= 0) {
 			pageIndex = Math.trunc(channelIndex / this._maxItemNb);
 			if (pageIndex >= 0 && pageIndex <= Math.ceil(channelList.length / this._maxItemNb)) {
 				this._pagesNb = Math.ceil(channelList.length / this._maxItemNb);
 				this._pageIndex = pageIndex;
 			}
 		}
 	}, this);
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.GuideChannelList.prototype._fetch = function _fetch (genre) {
	this.logEntry();
	var filtered = [],
	    favouriteChannels = [];
	
	if (genre !== "genre_all" && genre !== "genre_Favourites") {
		filtered = this._channels.filter(function (channel) {
			if (typeof channel.genres === "string") {
				return (channel.genres === genre);
			}
			return (channel.genres && channel.genres.contains(genre));
		});
	} else if (genre === "genre_Favourites") {
		favouriteChannels = o5.platform.btv.Favourites.getAllFavouriteChannels();
		favouriteChannels.forEach(function (item) {
			filtered = filtered.concat(item.getChannels());
		});
		this._favChannels = filtered;
	} else {
	    filtered = this._channels;
	}
	

	this.fireControlEvent("populate", filtered);

	this.logExit();
};



/**
 * @class app.gui.controls.GuideChannelListItem
 */

app.gui.controls.GuideChannelListItem = function GuideChannelListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideChannelListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideChannelListItem.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this._floatItem = true;

  this._num  = this.querySelector('.epgChannelStack-channelNum');
  this._logo = this.querySelector('.epgChannelStack-channelLogo');
  this._name = this.querySelector('.epgChannelStack-channelName');

	this._emptyClass = "epgChannelStack-empty";
	this._focusClass = "epgChannelStack-focused";

	this.logExit();
};


/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.GuideChannelListItem.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;

		if (data && (data.mainChannelId || data.broadcastServiceId)) { // must have at least this
			switch ($config.getConfigValue("settings.tv.guide.channel.name.display")) {
				case "logo":
					if (data.logo && data.logo !== "" && data.logo !== "undefined") {
						this._name.style.display = "none";
						this._logo.style.backgroundImage = "url('" + data.logo + "')";
					} else {
						this._name.textContent = data.serviceName;
						this._logo.style.display = "none";
					}
					break;
				case "text":
					if (data.serviceName && data.serviceName !== "" && data.serviceName !== "undefined") {
						this._name.textContent = data.serviceName;
						this._logo.style.display = "none";
					} else {
						this._name.style.display = "none";
						this._logo.style.backgroundImage = "url('" + data.logo + "')";
					}
					break;
				default:
					break;
			}
			if (data.logicalChannelNum && data.logicalChannelNum !== "") {
				this._num.textContent = data.logicalChannelNum;
			} else {
				this._num.textContent = data.mainChannelId || data.broadcastServiceId;
			}
		} else if (this._emptyClass) {
			this.classList.add(this._emptyClass);
		}
	}
});

