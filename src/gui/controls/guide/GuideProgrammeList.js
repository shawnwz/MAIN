/**
 * @class app.gui.controls.GuideProgrammeList
 */

app.gui.controls.GuideProgrammeList = function GuideProgrammeList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideProgrammeList, app.gui.controls.HtmlFlexList);

/**
 * @method createdCallback
 */
app.gui.controls.GuideProgrammeList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this.animate = true;
	this.minItems = 8;
	this.maxItems = 40;

	this._listElem.className = "progList-list progList-anim-normal";

	this._service = null;
  	this._progList = document.querySelector('#epgChannelViewProgList');
  	this._noProgCell = document.querySelector('#epgChannelViewNoProgCell');
  	this._pinDialog = document.querySelector('#dialogPinEntryH');

	// fetch events when Prev list changes
	$util.ControlEvents.on("app-guide:epgChannelViewChanListPrev", "populated", function (ctrl, event) {
		var service = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData : null,
			ev = this.selectedItem ? this.selectedItem.itemData : null,
			time = ev ? (ev.isOnNow ? null : ev.startTime) : null; // take start time of selected event if it is not "on now"
		if (service) {
			this.fireControlEvent("fetch", service, time, event);
		}
	}, this);
	$util.ControlEvents.on("app-guide:epgChannelViewChanListPrev", "change", function (ctrl, event) {
		var service = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData : null,
			ev = this.selectedItem ? this.selectedItem.itemData : null,
			time = ev ? (ev.isOnNow ? null : ev.startTime) : null; // take start time of selected event if it is not "on now"
		if (service) {
			this.fireControlEvent("fetch", service, time, event);
		}
	}, this);

	// clear events if we refetch channels
	$util.ControlEvents.on("app-guide:epgChannelViewChanListPrev", "fetch", function() {
		this.fireControlEvent("clear");
	}, this);

	$util.ControlEvents.on("app-guide:epgChannelViewChanListPrev", "exit:up", function() {
		this._scrollbarType = "";
		this.fireControlEvent("previous");
	}, this);
	$util.ControlEvents.on("app-guide:epgChannelViewChanListPrev", "exit:down", function() {
		this._scrollbarType = "";
		this.fireControlEvent("next");
	}, this);

	$util.ControlEvents.on("app-guide:epgChannelViewChanListPrev", "enter", function() {
		var channelToTune = $service.EPG.Channel.getByServiceId(this._service.serviceId),
			selectedEvent = this.selectedItem ? this.selectedItem.itemData : null,
			me = this;

		if (this._data.length === 0 || selectedEvent.isRadio || selectedEvent.isOnNow === true) {
			$util.ControlEvents.fire("app-video", "setSrc", channelToTune);
            $util.Events.fire("app:navigate:to", "surf");
            setTimeout(function () {
            	//var isMaster = o5.platform.system.Preferences.get("/users/current/isMaster", true);
				if (o5.platform.ca.ParentalControl.isChannelLocked(me._service.serviceId) || selectedEvent.ratingBlocked === true) {
            		if (me._pinDialog.visible === false) {
            			$util.ControlEvents.fire(":dialogPinEntryH", "show");
						$util.ControlEvents.fire(":dialogPinEntryH", "focus", { "id": "surf" });
					}
        		}
			}, 500);
		} else {
			$util.ControlEvents.fire("app-guide:epgChannelProgList", "ctaFullDetails");
		}
	}, this);

	this.onControlEvent("change", function(ctrl) {
		if (ctrl && ctrl.selectedItem) {
			// trigger update earlier, so it only has to add to the array and not the DOM
			var index = ctrl.selectedItem.itemIndex;
			if (index <= 3) {
				this.fireControlEvent("exit:up", ctrl);
			} else if (index >= (this._itemNb - 3)) {
				this.fireControlEvent("exit:down", ctrl);
			}
            $util.ControlEvents.fire("app-guide:ctaGuide", "fetch", ctrl.selectedItem._data);
            $util.ControlEvents.fire("app-guide:epgChannelViewChanListPrev", "updateEvent", ctrl);
		}
	});

	this.onControlEvent("exit:up", function(ctrl) {
		var data = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData : null,
			start,
			me = this;
		if (data && this._service.serviceId === data.serviceId) {
			start = data.startTime;
			$service.EPG.Event.byCount(this._service, start, -10, false).then(function(events) {
					me.fireControlEvent("prepend", events);
				});
		}
	});
	this.onControlEvent("exit:down", function(ctrl) {
		var data = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData : null,
			end,
			me = this;
		if (data && this._service.serviceId === data.serviceId) {
			end = data.endTime;
			$service.EPG.Event.byCount(this._service, end, 10, false).then(function(events) {
					me.fireControlEvent("append", events);
				});
		}
	});

	$util.ControlEvents.on("app-guide:epgChannelProgList", "ctaFullDetails", function () {
        if (this._selectedItem._data) {
            this._focusedElem = document.activeElement;
            $util.ControlEvents.fire("app-synopsis", "fetch", this._selectedItem._data);
            $util.Events.fire("app:navigate:to", "synopsis");
        }
        $util.ControlEvents.fire("app-surf:ctaSurfScan", "swap", "ctaFullDetails", "ctaInfo");
	}, this);

	$util.ControlEvents.on("app-guide:ctaGuide", "ctaPageUpDown", function(key) {
		this._scrollbarType = "page";
		switch (key) {
			case "ChannelDown":
				this.fireControlEvent("next");
				break;
			case "ChannelUp":
				this.fireControlEvent("previous");
				break;
			default:
				break;
		}
	}, this);
	
	/**
	 * add Day Labels within the events array
	 */
	this._addDayLabels = function (events) {
		var i, len = events.length,
			time = len > 0 ? events[0].startTime : null;
		for (i = 1; i < len; i++) {
			if (!$util.DateTime.isSameDay(time, events[i].startTime)) { // next day
				events.splice(i, 0, {
					isDayMarker: true,
					startTime  : events[i].startTime,
					isYesterday: events[i].isYesterday,
					isReverse  : events[i].isReverse,
					isToday    : events[i].isToday,
					isTomorrow : events[i].isTomorrow
				});
				time = events[i].startTime;
			} else {
				events[i].isDayMarker = false;
			}
		}
	};

	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.GuideProgrammeList.prototype._fetch = function _fetch(service, time, event) {
	this.logEntry();
	var me = this,
		i = 0,
		oneDay = 24 * 3600 * 1000,
		fetchTime = time || Date.now();

	this._service = service;

 	if (service) {
		$service.EPG.Event.byCount(service, fetchTime, -5, false).then(function(eventsBefore) {
			for (i = eventsBefore.length - 1; i >= 0; i--) {
				if (eventsBefore[i].endTime <= Date.now() - oneDay) {
					eventsBefore.splice(i, 1);
				}
			}
			$service.EPG.Event.byCount(service, fetchTime, 15, false).then(function(eventsAfter) {
				for (i = eventsAfter.length - 1; i >= 0; i--) {
					if (eventsAfter[i].startTime >= Date.now() + 14 * oneDay) {
						eventsAfter.splice(i, 1);
					}
				}
				eventsBefore.push.apply(eventsBefore, eventsAfter);
				me.fireControlEvent("populate", eventsBefore, time, event);
			});
		});
	}
	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.GuideProgrammeList.prototype._populate = function _populate(events, time, event) {
	this.logEntry();
	var index = -1,
		keys,
		i = 0,
		length = 0,
		actualTime = time;

	if (!events || events.length === 0) { // no events
		this._noProgCell.classList.remove("hide");
		this._progList.classList.add("hide");
	} else { // some events: look for "now" event for focus
		if (!actualTime) { // have no time: try to find an "isOnNow" event
			index = events.findIndex(function(ev) {
				return (ev.isOnNow === true);
			});
			actualTime = Date.now(); // in case it fails to find an "isOnNow" event, use "now" time below
		}
		if (event === undefined) { // select the one starting closest to "time"
			keys = Object.keys(events);
			index = keys.reduce(function(p, c) {
				return (Math.abs(events[c].startTime - actualTime) < Math.abs(events[p].startTime - actualTime) ? Number(c) : p);
			}, 0);
		} else {
			length = events.length;
			for (i = 0; i < length; i++) {
				if (events[i].id === event.id) {
					index = i;
					break;
				}
			}
		}

		this._addDayLabels(events);

		this._noProgCell.classList.add("hide");
		this._progList.classList.remove("hide");
		this.superCall(events, index);
	}

	this.logExit();
};

/**
 * @method _append
 */
app.gui.controls.GuideProgrammeList.prototype._prepend = function _prepend(events) {
	this.logEntry();
	this._addDayLabels(events);
	this.superCall(events);
	this.logExit();
};

/**
 * @method _append
 */
app.gui.controls.GuideProgrammeList.prototype._append = function _append(events) {
	this.logEntry();
	this._addDayLabels(events);
	this.superCall(events);
	this.logExit();
};


/**
 * @class app.gui.controls.GuideProgrammeListItem
 */
app.gui.controls.GuideProgrammeListItem = function GuideProgrammeListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideProgrammeListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 */
app.gui.controls.GuideProgrammeListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

  this._time  = this.querySelector('.cellTime');
  this._title = this.querySelector('.cellTitle');
  this._icons = this.querySelector('.progListIcons');

 	this._focusClass = 'focused';
	this._emptyClass = 'progList-empty';

	this.logExit();
};


/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.GuideProgrammeListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;

/*
              <div class="cellTime"></div>
              <div class="cellTitle"></div>
              <div class="progListIcons">
                <span class="progListIcon iconRecord">R</span>
                <span class="progListIcon iconRecordPlus30">R+</span>
                <span class="progListIcon iconSeriesLinkList"></span>
                <span class="progListIcon iconPlay"></span>
                <span class="progListIcon iconCC">cc</span>
              </div>
*/
		if (data) {
			var text = "";
				//dataReady = false;
			if (data.isDayMarker === true) {

				if (data.isYesterday === true) {
					this.classList.add("back");
					text = "Yesterday";
				} else if (data.isToday === true) {
					text = "Today";
				} else if (data.isTomorrow === true) {
					this.classList.add("forward");
					text = "Tomorrow";
				} else {
					this.classList.add(data.isReverse === true ? "back" : "forward");
					text = $util.DateTime.dateText(data.startTime);
				}

				this.innerHTML = '<span class="dayLabelUpArrow iconThinArrowUp"></span>' +
												 '<span class="dayLabelDownArrow iconThinArrowDown"></span>' +
												 '<span class="dayLabelDate">' + text + '</span>';

				this.classList.remove("progList-cell");
				this.classList.add("dayLabel");
				this.classList.add(this._emptyClass); // not selectable

			} else {
				if (data.isOnNow === true) {
					this._time.textContent = "On Now";
				} else if (data.progStartDateText) {
					this._time.textContent = data.progStartDateText;
				}
				if (data.title) {
					this._title.textContent = data.title;
				}

				if (!data.isCatchUp && data.isReverse && !data.isStartOver) {
				    this.classList.add("unavailable");
			    }
				
				if (data.isClosedCaptioned !== undefined && data.isClosedCaptioned === true) { // if (item.closedCaptionsAvailable  && _mediaPlayer.areSubtitlesEnabled()) {
					this.classList.add("eventCC");
				}
				if ((data.isCatchUp === true || data.isStartOver === true) && (data.isOnNow === true || data.isReverse === true)) {
					this.classList.add("eventPlay");
				}
			}
		} else if (this._emptyClass) {
			this.classList.add(this._emptyClass);
		}
	}
});

