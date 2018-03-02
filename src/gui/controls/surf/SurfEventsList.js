/**
 * @class app.gui.controls.SurfEventsList
 */

app.gui.controls.SurfEventsList = function SurfEventsList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SurfEventsList, app.gui.controls.HtmlFlexList);

/**
 * @method createdCallback
 */
app.gui.controls.SurfEventsList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this.animate = true;

	$util.ControlEvents.on("app-surf:surfScanChanList", "change", function (ctrl) {
		var selectedItem = ctrl.selectedItem,
			data = selectedItem ? selectedItem.itemData : null;
		if (data) {
			if (data.type === $util.constants.CHANNEL_TYPE.RADIO) {
				this._disable();
			} else {
				this._enable();
			}
		}
	}, this);

 	this._surfScanBar = document.querySelector('#surfScanBar');
 	this._surfScanProgListContLeft = this._surfScanBar.querySelector('#surfScanProgListContLeft');
 	this._surfScanProgListContRight = this._surfScanBar.querySelector('#surfScanProgListContRight');
 	this._pinDialog = document.querySelector('#dialogPinEntryH');

	this.logExit();
};


app.gui.controls.SurfEventsList.prototype._disable = function _disable() {
//	$util.Events.remove("surf:event:reset", this._backToNow, this);
//	$util.Events.remove("surf:event:next", this.selectNext, this);
//	$util.Events.remove("surf:event:previous", this.selectPrevious, this);
};

app.gui.controls.SurfEventsList.prototype._enable = function _enable() {
//	$util.Events.on("surf:event:reset", this._backToNow, this);
//	$util.Events.on("surf:event:next", this.selectNext, this);
//	$util.Events.on("surf:event:previous", this.selectPrevious, this);
};

/**
 * @method _onKeyDown
 */
app.gui.controls.SurfEventsList.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();

	switch (e.key) {
		case "Ok":
		case "Enter":
			var me = this;
			if (this.selectedItem.itemData.isEndCell === true) {
				console.log("endCell: TV guide");
                $util.Events.fire("app:navigate:to", "home-menu");
                $util.ControlEvents.fire("app-home-menu:portalMenu", "select", 1);

                $util.ControlEvents.fire("app-guide", "fetch", { "genre": "genre_all", "channel": this.selectedItem.itemData.channel, "startTime": this.selectedItem.itemData.startTime, "navFrom": "surf" });
                $util.Events.fire("app:navigate:to", "guide");
                e.stopImmediatePropagation();
			} else {
				if (this.selectedItem.itemData.isRadio) {
					$util.ControlEvents.fire("app-surf:surfScanChanList", "tune");
					setTimeout(function () {
						var isMaster = o5.platform.system.Preferences.get("/users/current/isMaster", true);
						if (!isMaster && (o5.platform.ca.ParentalControl.isChannelLocked(me.selectedItem.itemData.channel) || me.selectedItem.itemData.ratingBlocked === true)) {
							if (me._pinDialog.visible === false) {
								$util.ControlEvents.fire(":dialogPinEntryH", "show");
    							$util.ControlEvents.fire(":dialogPinEntryH", "focus", { "id": "surf" });
    						}
						} else {
							$util.ControlEvents.fire("app-surf:ctaSurfScan", "ctaFullDetails");
						}
					}, 500);
				} else if (this.selectedItem.itemData.isOnNow === true) {
					$util.ControlEvents.fire("app-surf:surfScanChanList", "tune");
					setTimeout(function () {
						var isMaster = o5.platform.system.Preferences.get("/users/current/isMaster", true);
						if (!isMaster && (o5.platform.ca.ParentalControl.isChannelLocked(me.selectedItem.itemData.channel) || me.selectedItem.itemData.ratingBlocked === true)) {
							if (me._pinDialog.visible === false) {
								$util.ControlEvents.fire(":dialogPinEntryH", "show");
    							$util.ControlEvents.fire(":dialogPinEntryH", "focus", { "id": "surf" });
    						}
						} else {
							$util.ControlEvents.fire("app-surf", "hide");
						}
					}, 500);
				} else {
					$util.ControlEvents.fire("app-surf:ctaSurfScan", "ctaFullDetails");
				}
            	e.stopImmediatePropagation();
			}
			break;
		case "ArrowLeft":
		case "ArrowRight":
			$util.ControlEvents.fire("app-surf:surfScanChanList", "hide");
			this.superCall(e);
			break;
		case "Record":
		case "Favorites":
			$util.ControlEvents.fire("app-surf", "favorite");
			e.stopImmediatePropagation();
			break;
		default:
			this.superCall(e);
			break;
	}

	this.logExit();
};



/**
 * @class app.gui.controls.SurfEventsListItem
 */

app.gui.controls.SurfEventsListItem = function SurfEventsListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SurfEventsListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SurfEventsListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this._focusClass = "focused";

  this._time = this.querySelector('.surfScanStartTimeText');
  this._ampm = this.querySelector('.surfScanStartTimeAmPm');
  this._title = this.querySelector('.surfScanProgTitle');
  this._description = this.querySelector('.surfScanProgDescription');
//  this._subTitle = this.querySelector('.surfScanProgTitle');
  this._icons = this.querySelector('.surfScanIcons');
//  this._timeShift = this.querySelector('.surfScanProgTitle');
  this._label = this.querySelector('.surfScanDayLabel');

	this.logExit();
};


/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.SurfEventsListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		var icons = "",
		    key = null,
		    channel = null;
		this._data = data;

		if (data) {
			if (data.dataset) {
				// eslint-disable-next-line guard-for-in
				for (key in data.dataset) {
					this.dataset[key] = data.dataset[key];
				}
			}

			data._class.forEach(function(c) {
				this.classList.add(c);
			}, this);

			if (data.isRadio === true) {
				if (data.eventId) {
				    channel = o5.platform.btv.EPG.getChannelByEventId(data.eventId);
				}
				if (channel && channel.name) {
					this._title.textContent = channel.name;
				} else {
					this._title.textContent = "";
				}
				if (channel && channel.genres && channel.genres.length > 0) { // show the short description
					this._description.textContent = channel.genres[0];
				} else {
					this._description.textContent = "";
				}
			} else {
				if (data.isYesterday === true) {
					this._label.innerHTML = "Yesterday";
				} else if (data.isToday === true) {
					this._label.innerHTML = "Today";
				} else if (data.isTomorrow === true) {
					this._label.innerHTML = "Tomorrow";
				}

				if (data.progStartDateText) {
					this._ampm.textContent = data.progStartDateText.slice(-2);
					this._time.textContent = data.progStartDateText.slice(0, -2);
				} else {
					this._time.textContent = "";
					this._ampm.textContent = "";
				}

				if (data.title) {
					this._title.textContent = data.title;
				} else {
					this._title.textContent = "";
				}
				if (data.rating) {
					this._description.textContent = "(" + data.rating + ")";
				} else {
					this._description.textContent = "";
				}

				if (data.unsubscribed === true) { //data structure not clear: for program is not accessible
					this._focusClass = "";
					this.classList.add("disabledItem");
				}
				if (!data.isCatchUp && data.isReverse && !data.isStartOver) {
					this.classList.add("pastEvent-unavailable");
				}

				if (data.isClosedCaptioned === true) {
					icons += "<span class='iconCC'>CC</span>";
				}
				if (data.isEntitled === false) { // data structure not clear
					icons += "<span class='iconLocked'></span>";
				}
				if (data.isSeriesLinked === true) { // if (recordingAction && recordingAction.isSeriesLinked) //data structure not clear
					icons += "<span class='iconSeriesLinkList'></span>";
				}
				if (data.isRecord === true) {
					icons += "<span class='iconRecord'>R</span>";
				}
				this._icons.innerHTML = "<div>" + icons + "</div>";
			}
		} else {
			this.classList.add(this._emptyClass);
		}
	}
});
