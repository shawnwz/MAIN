/**
 * @class app.gui.controls.SettingsChannelList
 * @extends o5.gui.controls.List
 */

app.gui.controls.SettingsChannelList = function SettingsChannelList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsChannelList, app.gui.controls.HtmlFlexList);

/**
 * @method createdCallback
 * @private
 */

app.gui.controls.SettingsChannelList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
  	this.orientation = "vertical";
 	this.animate = false;
	// this._wrapped = true;
	this._selectedChannel = null;
	this._isFooterUpdateRequired = true;
	$util.ControlEvents.on("app-settings:" + this.id, "categoryChange", this._categorychange, this);
	$util.ControlEvents.on("app-settings:" + this.id, "channelChanged", this._channelChanged, this);
	$util.ControlEvents.on("app-settings:" + this.id, "updateFooter", this._updateFooter, this);
	this.onControlEvent("focussed", this._focussed);
	this.onControlEvent("defocus", this._defocus);
	this._minItemNb = 7;
	this.logExit();
};

/**
 * @method _categorychoose
 * @private
*/
app.gui.controls.SettingsChannelList.prototype._categorychange = function _categorychange(category) {
	this.logEntry();
	if (this._category !== category) {
		this._category = category;
		$util.ControlEvents.fire("app-settings:" + this.id, "populate");
		this.fireControlEvent("defocus");
	}
	this.logExit();
};

/**
 * @method _categorychoose
 * @private
*/
app.gui.controls.SettingsChannelList.prototype._focussed = function _focussed() {
	this.logEntry();
    if (this._selectedItem) {
    	this._isFooterUpdateRequired = true;
        this._selectedItem._onSelect();
     }
	this.logExit();
};

/**
 * @method _categorychoose
 * @private
*/
app.gui.controls.SettingsChannelList.prototype._defocus = function _defocus() {
	this.logEntry();
    if (this._selectedItem) {
        this._selectedItem._onDefocus();
        this._isFooterUpdateRequired = false;
     }
	this.logExit();
};

app.gui.controls.SettingsChannelList.prototype._updateFooter  = function _updateFooter() {
	if (this._isFooterUpdateRequired) {
		var data = {};
		data.id = this.id;
		data.channel = this._selectedChannel;
		$util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", data);
	}
};

/**
 * @method _categoryChanged
 * @private
*/
app.gui.controls.SettingsChannelList.prototype._channelChanged = function _channelChanged(channel) {
	this.logEntry();
	this._selectedChannel = channel;
	this._updateFooter();
	this.logExit();
};


app.gui.controls.SettingsChannelList.prototype._populate = function _populate(channelData) {
	this.logEntry();
	this._scrollbarType = "item";
	var catChannelList = [],
		channels = channelData,
		selectedGenre,
		noGenre = $util.Translations.translate($util.constants.CHANNEL_CATEGORIES[0]);
	if (!this._channelData) {
		this._channelData = channels;
	} else {
		channels = this._channelData;
	}
	if (channelData) {
		this._isFooterUpdateRequired = true;
	} else {
		this._isFooterUpdateRequired = false;
	}
	//this.deleteAllItems();

	if (!this._category) {
		// Default to first category on initial call
		this._category = noGenre;
	}

	selectedGenre = this._category;
	if (selectedGenre === noGenre) {
		catChannelList = channels;
	} else {
		catChannelList = channels.filter(function (channel) {
		if (channel.genres && (channel.genres.indexOf(selectedGenre)) >= 0) {
			return true;
		}
		return false;
		});
	}
  	this.superCall(catChannelList);
  	if (catChannelList.length > 0) {
  	    this._scrollBarElem.classList.remove("hide");
  	    this._scrollBarElem.classList.add("show");
  	} else {
  	    this._scrollBarElem.classList.remove("show");
  	    this._scrollBarElem.classList.add("hide");
  	}
    this.logExit();
};

app.gui.controls.SettingsChannelList.prototype._toggleFavorite = function _toggleFavorite() {
	this._selectedItem._toggleFav();
};

app.gui.controls.SettingsChannelList.prototype._toggleBlocked = function _toggleBlocked() {
	this._selectedItem._toggleBlocked();
	this._updateFooter();
};

app.gui.controls.SettingsChannelList.prototype._isAnyFavoriteAvaliable = function _isAnyFavoriteAvaliable() {
	return true;
};

app.gui.controls.SettingsChannelList.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	var handled = false;
	this._scrollbarType = "item";
	switch (e.key) {
		case "Ok":
		case "Enter":
			if (this.id === "settingsBlockedChannelsList") {
				this._toggleBlocked();
			}
			handled = true;
			break;
		case "Yellow":
			if (this.id === "settingsFavChannelsList") {
				this._toggleFavorite();
			}
			handled = true;
			break;
		case "ChannelDown":
			this.fireControlEvent("jump", 6);
			handled = true;
			break;
		case "ChannelUp":
			this.fireControlEvent("jump", -6);
			handled = true;
			break;
		default:
			break;
	}
	if (handled === true) {
		e.stopImmediatePropagation();
	} else {
		this.superCall(e);
	}

	this.logExit();
};

/**
 * @property ChannelList
 * @public
 * @type {String} Channel
 */
Object.defineProperty(app.gui.controls.SettingsChannelList.prototype, "ChannelList", {
// TODO: What functionality is needed here?
	get: function get() {
		return this._ChannelList;
	},
	set: function set() {
//		this._Channel = Channel;
//		this.innerText = Channel;
	}
});
