/**
 * @class app.gui.controls.SettingsChannelMenu
 * @extends o5.gui.controls.Control
 */

app.gui.controls.SettingsChannelMenu = function SettingsChannelMenu() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsChannelMenu, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsChannelMenu.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._categoryList = this.querySelector("app-settings-category-list");
	this._channelList = this.querySelector("app-settings-channel-list");
	this._config = this.dataset.config || null;
    this._configObj = null;
	this.onkeydown = this._onKeyDown;
	this.onfocus = this._onFocus;
	this.onblur = this._onBlur;
	this._channelData = null;
	this.logExit();
};

app.gui.controls.SettingsChannelMenu.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.on("app-settings:" + this._channelList.id, "exit:left", function () {
		var data = {};
		data.id = this._categoryList.id;
	  	this._channelList.fireControlEvent("defocus");
      	this._categoryList.fireControlEvent("focus");
      	$util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", data);
    }, this);
    $util.ControlEvents.on("app-settings:" + this._categoryList.id, "exit:right", function () {
    	if (this._channelList._itemNb > 0) {
    		this._categoryList.fireControlEvent("defocus");
        	this._channelList.fireControlEvent("focus");
    	}
    }, this);

     $util.ControlEvents.on([ "app-settings:" + this._categoryList.id, "app-settings:" + this._channelList.id ], "back", function () {
    	this._handleBackKey();
    }, this);
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SettingsChannelMenu.prototype._fetch = function _fetch() {
    this.logEntry();
    var objs = this._config ? this._config.split('.') : [],
      configObj = null,
      footer = null,
      arr;

  //  this.fireControlEvent("clear");

    footer = document.querySelector("#callToAction");
    footer.classList = [];

    objs.forEach(function(obj) {
        if (configObj) { // concat with previous
            if (configObj[obj]) {
                configObj = configObj[obj];
            }
        } else if (window[obj]) { // first one
            configObj = window[obj];
        }
    });
    if (configObj && configObj.getMenu) {
        arr = configObj.getMenu();
        this.setData(arr);
        this._configObj = configObj;
        if (this._configObj.footerClassList) {
            this._configObj.footerClassList.forEach(function(e) {
                footer.classList.add(e);
            });
        }
    }
    this.logExit();
};

/**
 * @method _toggleBlocking
 * @private
 */
app.gui.controls.SettingsChannelMenu.prototype._toggleBlocking = function _toggleBlocking(channel) {
	// TODO: Move to channel list
	this.logEntry();
	this._channel = channel;

	// TODO: need to make the CCOM calls to block the channel here

	this.logExit();
};


/**
 * @method _handleBackKey
 * @private
 */
app.gui.controls.SettingsChannelMenu.prototype._handleBackKey = function _handleBackKey () {
	this.logEntry();

	if ($util.ScreenHistoryManager.isScrHistoryAvaliable()) {
        $util.Events.fire("scr:back");
    } else {
        $util.Events.fire("app:navigate:back");
        if ($config.getConfigValue("settings.view.theme") === "Rel6") {
    		$util.ControlEvents.fire("app-home-menu:homeNavMenu", "enter", document.activeElement);
    	} else {
    		$util.ControlEvents.fire("app-home-menu:portalMenu", "enter", document.activeElement);
    	}
	}
	this.logExit();
};

app.gui.controls.SettingsChannelMenu.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	var handled = false,
		me = this,
		data = {};
	switch (e.key) {
		case "Red":
		if (this.id === "favScreen") {
			$service.settings.FavouriteService.removeAllFavouriteChannel(function(result) {
				if (result) {
					$util.ControlEvents.fire("app-settings:" + me._channelList.id, "populate", me._channelData);
					if (me._categoryList.focused) {
						data.id = me._categoryList.id;
						me._channelList.fireControlEvent("defocus");
						$util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", data);
					}
				}
			});
		} else if (this.id === "blockScreen") {
			$service.settings.ChannelBlocking.unblockAllChannel();
			$util.ControlEvents.fire("app-settings:" + this._channelList.id, "populate", this._channelData);
			if (this._categoryList.focused) {
				data.id = this._categoryList.id;
				this._channelList.fireControlEvent("defocus");
				$util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", data);
			}
		}
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

app.gui.controls.SettingsChannelMenu.prototype.setData = function setData(menuData) {
	var categoryData = menuData[0].data.get(),
		me = this;
	this._channelData = menuData[1].data.get();

	$util.ControlEvents.fire("app-settings:" + this._channelList.id, "populate", this._channelData);
	$util.ControlEvents.fire("app-settings:" + this._categoryList.id, "populate", categoryData);
	setTimeout(function() {
	 			me._channelList.fireControlEvent("focus");
	 			me._channelList.fireControlEvent("select", 0);
	 		}, 1);
};

app.gui.controls.SettingsChannelMenu.prototype.resetSelection = function resetSelection() {
	// TODO : reset the selection here
};
