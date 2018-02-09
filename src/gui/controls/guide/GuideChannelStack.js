/**
 * @class app.gui.controls.GuideChannelStackList
 */

app.gui.controls.GuideChannelStackList = function GuideChannelStackList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideChannelStackList, app.gui.controls.HtmlFlexList);

/**
 * @method createdCallback
 */
app.gui.controls.GuideChannelStackList.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this.animate = true;

	this.logExit();
};



/**
 * @class app.gui.controls.GuidePrevChannelStackList
 */
app.gui.controls.GuidePrevChannelStackList = function GuidePrevChannelStackList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuidePrevChannelStackList, app.gui.controls.GuideChannelStackList);

/**
 * @method createdCallback
 */
app.gui.controls.GuidePrevChannelStackList.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this._listElem.className = "prevChannelStack-list prevChannelStack-anim-normal";

	this._channels = [];

	$util.Events.on("service:EPG:channel:updated", function (items) {
		this._channels = items;
	}, this);

	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.GuidePrevChannelStackList.prototype._fetch = function _fetch (genre, index, event) {
	this.logEntry();
	var services = [];

	if (genre !== "genre_all") {
		services = this._channels.filter(function (service) {
			if (typeof service.genres === "string") {
				return (service.genres === genre);
			}
			return (service.genres && service.genres.contains(genre));
		});
	} else {
		services = this._channels;
	}
	this.fireControlEvent("populate", services, index, event);
	this.logExit();
};



/**
 * @class app.gui.controls.GuideNextChannelStackList
 */

app.gui.controls.GuideNextChannelStackList = function GuideNextChannelStackList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideNextChannelStackList, app.gui.controls.GuideChannelStackList);

/**
 * @method createdCallback
 */
app.gui.controls.GuideNextChannelStackList.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this._listElem.className = "nextChannelStack-list nextChannelStack-anim-normal";

	// the Next list follows the Prev list 1 index ahead
	$util.ControlEvents.on("app-guide:epgChannelViewChanListPrev", "populated", function (ctrl) {
		var index = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemIndex : -1;
		if (index !== -1) {
			index = ((index + 1) % ctrl._itemNb); // wrap it
			this.fireControlEvent("populate", ctrl.itemData, index);
		}
	}, this);

	// the Next list follows the Prev list 1 index ahead
	$util.ControlEvents.on("app-guide:epgChannelViewChanListPrev", "change", function (ctrl) {
		var index = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemIndex : -1;
		if (ctrl.selectedItem) {
			this._channel = ctrl.selectedItem.itemData;
		}
		if (index !== -1) {
			index = ((index + 1) % ctrl._itemNb); // wrap it
			this.fireControlEvent("select", index);
		}
		$util.ControlEvents.fire("app-guide:epgChannelStack", "change", ctrl);
	}, this);

	this.logExit();
};



/**
 * @class app.gui.controls.GuideNextChannelStackListItem
 */
app.gui.controls.GuideChannelStackListItem = function GuideChannelStackListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideChannelStackListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideChannelStackListItem.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
 	this._focusClass = 'focused';
	this.logExit();
};


/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.GuideChannelStackListItem.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;

		if (data) {
			switch ($config.getConfigValue("settings.tv.guide.channel.name.display")) {
				case "logo":
					if (data.logo && data.logo !== "" && data.logo !== "undefined") { //@hdk fix this! Other places wont check for the "undefined" string!
						this._name.style.display = "none";
						this._logo.style.backgroundImage = "url('" + data.logo + "')";
					} else {
						this._name.textContent = data.serviceName;
						this._logo.style.display = "none";
					}
					break;
				case "text":
					if (data.serviceName && data.serviceName !== "" && data.serviceName !== "undefined") { //@hdk fix this! Other places wont check for the "undefined" string!
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

			if (data.noChannelDecoration !== true) {
				if (data.isEntitled === false) {
					this.classList.add("locked");
				}
				if (data.isFavourite === true) {
					this.classList.add("favourite");
				}

				if (data.logicalChannelNum) {
					this._num.textContent = data.logicalChannelNum;
				} else if (data.mainChannelId) {
					this._num.textContent = data.mainChannelId;
				}
			}
		} else if (this._emptyClass) {
			this.classList.add(this._emptyClass);
		}
	}
});



/**
 * @class app.gui.controls.PrevChannelStackListItem
 */
app.gui.controls.GuidePrevChannelStackListItem = function GuidePrevChannelStackListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuidePrevChannelStackListItem, app.gui.controls.GuideChannelStackListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuidePrevChannelStackListItem.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
  this._num  = this.querySelector('.prevChannelStack-channelNum');
  this._logo = this.querySelector('.prevChannelStack-channelLogo');
  this._name = this.querySelector('.prevChannelStack-channelName');
	this.logExit();
};


/**
 * @class app.gui.controls.GuideNextChannelStackListItem
 */
app.gui.controls.GuideNextChannelStackListItem = function GuideNextChannelStackListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideNextChannelStackListItem, app.gui.controls.GuideChannelStackListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.GuideNextChannelStackListItem.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
  this._num  = this.querySelector('.nextChannelStack-channelNum');
  this._logo = this.querySelector('.nextChannelStack-channelLogo');
  this._name = this.querySelector('.nextChannelStack-channelName');
	this.logExit();
};

