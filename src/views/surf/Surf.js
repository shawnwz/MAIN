/* Implementation of the Main View, which act as the view controller */

app.views.Surf = function Surf () {};
o5.gui.controls.Control.registerAppControl(app.views.Surf, o5.gui.controls.View, null, true);


/**
 * @method createdCallback
 * @private
 */
app.views.Surf.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this._channels = $service.EPG.Channel.get();
	this._timeoutTimer = null;
	this._event = null;
	this._service = null;
	this._favoriteMode = false;

	this.onkeydown = this._onKeyDown;
	this.onload = this._onLoad;
	this.onshow = this._onShow;
	this.onhide = this._onHide;
	this.onfocus = this._onFocus;
	this.onblur = this._onBlur;
	this._currentContent = null;
	this._fetchTimeout = 0;

	// this._channelStack = this.querySelector('app-surf-channel-list');
	this._surfScanMiniSynopsis = this.querySelector('app-surf-mini-synopsis');
	this._dialog = document.querySelector('#dialogGenericErrorH');
	this._audioCCOptiondialog = document.querySelector('#audioAndCCOptionsDialog');
	this._surfScanChannelList = document.querySelector('app-surf-channel-list');

	$util.Events.on("service:EPG:channel:updated", function (channels) {
		this._channels = channels;
		$util.ControlEvents.fire("app-surf:surfScanChanList", "fetch", this._channels);
	}, this);
    $util.ControlEvents.on("app-video", "setSrc", this._show, this);
    // update current channel when channel changed, event no AV stream played in this channel.
    $util.ControlEvents.on("app-video", "channelChanged", function (data) {
    	this._currentContent = data;
	}, this);


	$util.ControlEvents.on("app-surf", "hide", this._hide, this);
	$util.ControlEvents.on("app-surf", "show", this._show, this);

	$util.ControlEvents.on("app-surf", "dialog", function(action) {
		var _dialog = {};

		_dialog = {
			title    : $util.Translations.translate("F0124Title"),
			text     : $util.Translations.translate("F0124Description"),
			subText  : "",
			errorCode: ""
		};

		if (action === "show") {
			$util.ControlEvents.fire(":dialogGenericErrorH", "show", _dialog);
		} else {
			$util.Events.fire("app:navigate:to", "settings");
			$util.ControlEvents.fire("app-settings", "fetch", { "id": "settingsFavChannelsView", "title": "Favourite Channels" });
			$util.ControlEvents.fire("app-settings:favScreen", "fetch");
		}
	}, this);

	$util.ControlEvents.on("app-surf", "favorite", function () {
		var updatedChannels = null,
		    favoriteChannels = [],
		    favoriteChannelList = o5.platform.btv.Favourites.getAllFavouriteChannels();
		
		favoriteChannelList.forEach(function (item) {
			favoriteChannels = favoriteChannels.concat(item.getChannels());
		});
		
		if (favoriteChannels.length === 0) {
			if (this._dialog.visible === false) {
				$util.ControlEvents.fire("app-surf", "dialog", "show");
			} else {
				$util.ControlEvents.fire("app-surf", "dialog", "jumpToSettingAndHide");
			}
		} else {
			if (this._surfScanChannelList.visible === false) {
				this._favoriteMode = true;
			} else {
				this._favoriteMode = !this._favoriteMode; //toggle
			}

			updatedChannels = this._favoriteMode ? favoriteChannels : this._channels;
			$util.ControlEvents.fire("app-surf:surfScanChanList", "favourite", this._favoriteMode);
			$util.ControlEvents.fire("app-surf:surfScanChanList", "fetch", updatedChannels);
		}
		$util.ControlEvents.fire("app-surf:surfScanChanList", "show");
	}, this);

	$util.ControlEvents.on("app-surf", "fetch", function (service) {
		// we fetch one set of events from the past to the future and divide them over then past and future event lists
		if (this._service && this._service.serviceId === service.serviceId) {
			var now = Date.now(),
			    start = now,
			    end = now;
			if (service.type === $util.constants.CHANNEL_TYPE.VIDEO) {
				start = now - (12 * 3600 * 1000);
				end = now + (24 * 3600 * 1000);
			}
			$service.EPG.Event.byTime(service, start, end, true).then(function (data) {
					$util.ControlEvents.fire("app-surf:surfPastEventsList", "populate", data);
					$util.ControlEvents.fire("app-surf:surfFutureEventsList", "populate", data);
				});
		}
	}, this);

	$util.Events.on("channelEntry:tune", function (channel) {
		$util.ControlEvents.fire("app-surf:surfScanChanList", "select", channel);
	}, this);

	$util.ControlEvents.on("app-surf:ctaSurfScan", "ctaFullDetails", function () {
		if (this._event) {
			$util.ControlEvents.fire("app-surf", "hide");
			$util.ControlEvents.fire("app-synopsis", "fetch", this._event);
			$util.Events.fire("app:navigate:to", "synopsis");
		}
		$util.ControlEvents.fire("app-surf:ctaSurfScan", "swap", "ctaFullDetails", "ctaInfo");
	}, this);
	$util.ControlEvents.on("app-surf:ctaSurfScan", "ctaInfo", function () {
		$util.ControlEvents.fire("app-surf:surfScanMiniSynopsis", "show");
		$util.ControlEvents.fire("app-surf:ctaSurfScan", "swap", "ctaInfo", "ctaFullDetails");
	}, this);
    $util.ControlEvents.on("app-surf:ctaSurfScan", "ctaOptions", function () {
        if (this._currentContent) {
            $util.ControlEvents.fire(":audioAndCCOptionsDialog", "show", this._currentContent);
            $util.ControlEvents.fire(":audioAndCCOptionsDialog", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-surf:ctaSurfScan", "ctaStartOver", function () {
        if (this._event) {
        	//TODO: need SO uri in the event data.
        	//$util.ControlEvents.fire("app-video", "setSrc", this._event);
        }
    }, this);
	$util.ControlEvents.on("app-surf:ctaSurfScan", "ctaUpDown", function () {
		// this._channelBrowse();
	}, this);

	$util.ControlEvents.on([
			"app-surf:surfPastEventsList",
			"app-surf:surfFutureEventsList"
		], "exit:up",
		function () {
			$util.ControlEvents.fire("app-surf:surfScanChanList", "next", false);
			$util.ControlEvents.fire("app-surf:surfScanChanList", "show");
		}, this);
	$util.ControlEvents.on([
			"app-surf:surfPastEventsList",
			"app-surf:surfFutureEventsList"
		], "exit:down",
		function () {
			$util.ControlEvents.fire("app-surf:surfScanChanList", "previous", false);
			$util.ControlEvents.fire("app-surf:surfScanChanList", "show");
		}, this);

	$util.ControlEvents.on([
			"app-surf:surfPastEventsList",
			"app-surf:surfFutureEventsList"
		], "change",
		function (ctrl) {
			var selectedItem = ctrl ? ctrl.selectedItem : null,
				data = selectedItem ? selectedItem.itemData : null;

			this._event = data;
			$util.ControlEvents.fire("app-surf:ctaSurfScan", "fetch", data);
		}, this);

	$util.ControlEvents.on([
			"app-surf:surfPastEventsList",
			"app-surf:surfFutureEventsList"
		], "back",
		function () {
			if (this._surfScanMiniSynopsis.visible) {
				$util.ControlEvents.fire("app-surf:surfScanMiniSynopsis", "hide");
			} else {
				$util.ControlEvents.fire("app-surf", "hide");
			}
		}, this);

	$util.ControlEvents.on("app-surf:surfScanChanList", "change", function (ctrl) {
		var selectedItem = ctrl ? ctrl.selectedItem : null,
			data = selectedItem ? selectedItem.itemData : null;

		if (data) {
			this._service = data;
			clearTimeout(this._fetchTimeout);
			this._fetchTimeout = setTimeout(function () {
			$util.ControlEvents.fire("app-surf", "fetch", data);
			$util.ControlEvents.fire("app-surf:surfFutureEventsList", "focus"); // reset focus back to future
			}, 500);
		}
	}, this);

	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.Surf.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();
	$util.Events.fire("service:MDS:channel:fetch");
	$util.Events.fire("app:view:attached", "surf");
	this.logExit();
};

/**
 * @method _onLoad
 * @private
 */
app.views.Surf.prototype._onLoad = function _onLoad () {
	this.logEntry();
	this.logExit();
};

/**
 * @method _onFocus
 */
app.views.Surf.prototype._onFocus = function _onFocus () {
	this.logEntry();
	$util.ControlEvents.fire("app-surf:surfFutureEventsList", "focus");
	this.logExit();
};

/**
 * @method _onBlur
 */
app.views.Surf.prototype._onBlur = function _onBlur () {
	this.logEntry();
	this.logExit();
};

/**
 * @method _onShow
 * @private
 */
app.views.Surf.prototype._onShow = function _onShow () {
	this.logEntry();
	$util.ControlEvents.fire("app-surf:surfScanChanList", "fetch"); // fetch with previous channels
    $util.ControlEvents.fire("app-surf:surfScanChanList", "select", this._currentContent);
	$util.Events.fire("clock:show");
	$util.ControlEvents.fire("app-surf:surfScanChanList", "hide");

////	$util.ControlEvents.fire("app-surf:surfScanChanList", "change");
//	$util.Events.fire("app:navigate:to:default");

	this._show();


	this.logExit();
};

/**
 * @method _onHide
 * @private
 */
app.views.Surf.prototype._onHide = function _onHide () {
	this.logEntry();
	$util.Events.fire("clock:hide");
	clearTimeout(this._timeoutTimer);

	$util.ControlEvents.fire("app-surf:surfScanMiniSynopsis", "hide");

	this.removeEventListener("webkitTransitionEnd", this._transitionHideEnd);

	if (this._dialog.visible === true) {
		$util.ControlEvents.fire(":dialogGenericErrorH", "hide");
	}
	if (this._audioCCOptiondialog.visible === true) {
		$util.ControlEvents.fire(":audioAndCCOptionsDialog", "hide");
	}
	
	if (this._favoriteMode === true) {
		this._favoriteMode = false;
	    $util.ControlEvents.fire("app-surf:surfScanChanList", "favourite", false);
	    $util.ControlEvents.fire("app-surf:surfScanChanList", "fetch", this._channels);
	}
	

	this.logExit();
};

/**
 * @method _hide
 * @private
 */
app.views.Surf.prototype._hide = function _hide () {
	this.logEntry();
    $util.Events.fire("app:navigate:to:default");
	this.logExit();
};

/**
 * @method _show
 * @private
 */
app.views.Surf.prototype._show = function _show () {
	this.logEntry();
	this.logExit();
};

/**
 * @method _timeoutReset
 * @private
 */
app.views.Surf.prototype._timeoutReset = function _timeoutReset () {
	this.logEntry();
	clearTimeout(this._timeoutTimer);
	this._timeoutTimer = setTimeout(
		this._timeoutTrigger,
		$config.getConfigValue("settings.notifications.banner.timeout") * 1000
	);
	this.logExit();
};

/**
 * @method _timeoutTrigger
 * @private
 */
app.views.Surf.prototype._timeoutTrigger = function _timeoutTrigger () {
	this.logEntry();
	// TODO: Make this a back() call instead of navigateToDefault
	$util.Events.fire("app:navigate:to:default");
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.views.Surf.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	var handled = false;

	this._timeoutReset();

	switch (e.key) {
		case "Surf":
			if (this._surfScanMiniSynopsis.visible) {
				$util.ControlEvents.fire("app-surf:surfScanMiniSynopsis", "hide");
			} else {
				$util.ControlEvents.fire("app-surf", "hide");
			}
			handled = true;
			break;
		case "ChannelUp":
			$util.ControlEvents.fire("app-surf:surfScanChanList", "show");
			$util.ControlEvents.fire("app-surf:surfScanChanList", "next", false);
			$util.ControlEvents.fire("app-surf:surfScanChanList", "tune");
			handled = true;
			break;
		case "ChannelDown":
			$util.ControlEvents.fire("app-surf:surfScanChanList", "show");
			$util.ControlEvents.fire("app-surf:surfScanChanList", "previous", false);
			$util.ControlEvents.fire("app-surf:surfScanChanList", "tune");
			handled = true;
			break;
		case "Ok":
		case "Enter":
			$util.ControlEvents.fire("app-surf:surfScanChanList", "show");
			$util.ControlEvents.fire("app-surf:surfScanChanList", "tune");
			handled = true;
			break;
		default:
			break;
	}

	if (handled === true) {
		e.stopImmediatePropagation();
		e.preventDefault();
	} else {
		$util.ControlEvents.fire("app-surf:ctaSurfScan", "key:down", e);
	}

	this.logExit();
};

