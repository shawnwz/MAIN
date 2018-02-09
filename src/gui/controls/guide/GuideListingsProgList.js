/**
* @class app.gui.controls.GuideListingsProgList
*/

app.gui.controls.GuideListingsProgList = function GuideListingsProgList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsProgList, app.gui.controls.HtmlFlexList);  // HtmlFlexList

/**
 * @method createdCallback
 */
app.gui.controls.GuideListingsProgList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this.orientation = "Vertical";
    this.animate = true;
    this.maxItems = 100;

    this._fetchedEvents = [];
    this._filteredEvents = [];
    this._filter = {};
    this._sortType = "";
    this._channel = {};

    this._isFetching = false;
    this._startTimeBefore = 0;
    this._endTimeAfter = 0;
    this._keepElemCount = 20;
    this._timeStep = 12 * 60 * 60 * 1000; //get 15 minutes events once
    this._oneDay = 24 * 3600 * 1000;
    this._currentDate = Date.now();
    this._currentLetter = "A";
    this._nbOnePage = 10;

    $util.Events.on("service:EPG:channel:updated", function (items) {
        this._channels = items;
        this._page = 0;
    }, this);
    this._progList = document.querySelector('#epgListingsProgList-List');
    this._epgListingsBg = document.querySelector('#epgListingsBg');
    this._dateList = document.querySelector('#epgListingsSortListDateList');
    this._letterList = document.querySelector('#epgListingsSortListLetterList');

    this.addEventListener("keydown", this._onKeyDown);

    /**
     * add Day Labels within the events array
     */
    this._addDayLabels = function (events, direction) {
        var i, len = events.length,
            time = len > 0 ? events[0].startTime : null;

        if (direction && len) {
            if (direction === "up") {
                if (!$util.DateTime.isSameDay(events[events.length - 1].startTime, this._data[0].startTime)) {
                    events.splice(events.length, 0, {
                        isDayMarker: true,
                        startTime  : events[events.length - 1].startTime,
                        isYesterday: events[events.length - 1].isYesterday,
                        isReverse  : events[events.length - 1].isReverse,
                        isToday    : events[events.length - 1].isToday,
                        isTomorrow : events[events.length - 1].isTomorrow
                    });
                }
            } else if (direction === "down") {
                if (!$util.DateTime.isSameDay(events[0].startTime, this._data[this._data.length - 1].startTime)) {
                    events.splice(0, 0, {
                        isDayMarker: true,
                        startTime  : events[0].startTime,
                        isYesterday: events[0].isYesterday,
                        isReverse  : events[0].isReverse,
                        isToday    : events[0].isToday,
                        isTomorrow : events[0].isTomorrow
                    });
                }
            }
        }

        for (i = 1; i < len; i++) {
            if (!$util.DateTime.isSameDay(time, events[i].startTime)) { // next day
                time = events[i].startTime;
                events.splice(i, 0, {
                    isDayMarker: true,
                    startTime  : events[i].startTime,
                    isYesterday: events[i].isYesterday,
                    isReverse  : events[i].isReverse,
                    isToday    : events[i].isToday,
                    isTomorrow : events[i].isTomorrow
                });
            } else {
                events[i].isDayMarker = false;
            }
        }
    };

    /**
     * add Alphabetic Labels within the events array
     */
    this._addAlphabeticLabels = function (events) {
        var i,
            len = events.length,
            letter = len > 0 ? events[0].title[0] : null;

        for (i = 1; i < len; i++) {
            if (letter !== events[i].title[0]) { // different alphabet
                letter = events[i].title[0];
                events.splice(i, 0, {
                    isAlphabeticMarker: true,
                    letter            : events[i].title[0]
                });
            } else {
                events[i].isAlphabeticMarker = false;
            }
        }
    };

    this._addEmptyLabels = function (events, count) {
        var i;
        for (i = 0; i < count; i++) {
            events.splice(i, 0, {
                isEmpty: true
            });
        }
    };

    this._sortByDate = function(a, b) {
        return (a.startTime - b.startTime);
    };

    this._sortByAlphabet = function(a, b) {
        if (a.title < b.title) {
            return -1;
        } else if (a.title > b.title) {
            return 1;
        }
        return 0;
    };

    this._isLetter = function (value) {
        var Regx = /^[A-Za-z]*$/;
        if (Regx.test(value)) {
            return true;
        }
        return false;
    };

    this._filterEvents = function(events) {
        var len = events.length,
            i;

        this._filteredEvents = [];
        for (i = 0; i < len; i++) {
            if (this._filter.isHD && !events[i].isHD) {
                continue;
            }
            if (this._filter.isCC && !events[i].isClosedCaptioned) {
                continue;
            }
            if ((this._filter.subGenre.toUpperCase() !== "ALL PROGRAMMES") && (events[i].genre.toUpperCase() !== this._filter.subGenre.toUpperCase())) {
                continue;
            }
            if (this._filter.genre.toUpperCase() !== "ALL PROGRAMMES") {
                if (!this._channel || !this._channel.serviceId || (this._channel.serviceId !== events[i].serviceId)) {
                    this._channel = $service.EPG.Channel.getByServiceId(events[i].serviceId);
                }
                if (this._channel.genres[0].toUpperCase() !== this._filter.genre.toUpperCase()) {
                    continue;
                }
            }
            if (this._sortType === "AtoZ" && !this._isLetter(events[i].title[0])) {
                continue;
            }
            this._filteredEvents.push(events[i]);
        }
        return this._filteredEvents;
    };

    this._setFilter = function (type, value) {
        switch (type) {
            case "genre":
                this._filter.genre = value;
                this._filter.subGenre = "All Programmes";
                break;
            case "subGenre":
                this._filter.subGenre = value;
                break;
            case "HD":
                this._filter.isHD = !(this._filter.isHD);
                break;
            case "CC":
                this._filter.isCC = !(this._filter.isCC);
                break;
            default:
                break;
        }
    };

    this.onControlEvent("pageUp", function() {
        this.logEntry();
        this.fireControlEvent("jump", this._nbOnePage * -1);
        this.logExit();
    });

    this.onControlEvent("pageDown", function() {
        this.logEntry();
        this.fireControlEvent("jump", this._nbOnePage);
        this.logExit();
    });

    this.onControlEvent("exit:up", function(ctrl) {
        this.logEntry();
        var i = 0,
            len = this._channels.length,
            promises = [],
            service,
            startTime = this._startTimeBefore,
            yesterdayTime = Date.now() - this._oneDay,
            me = this;

        if (this._sortType === "time") {
            if (this._isFetching || (this._startTimeBefore <= yesterdayTime)) {
                return;
            }

            if (len > 0) {
                this._isFetching = true;
            }
            this._startTimeBefore = this._startTimeBefore - this._timeStep;
            if (this._startTimeBefore < yesterdayTime) {
                this._startTimeBefore = yesterdayTime;
            }
            for (i = 0; i < 10; i++) {
                service = this._channels[i];
                if (service && service.serviceId) {
                    promises.push($service.EPG.Event.byTime(service, this._startTimeBefore, startTime, false).then(function(eventsBefore) {
                            return eventsBefore;
                    },
                    function() {
                        return [];
                    }));
                }
            }

            Promise.all(promises).then(function(data) {
                var channelsLen = 0,
                    k = 0,
                    j = 0,
                    index = ctrl.selectedItem.itemIndex,
                    events = [];

                channelsLen = data.length;
                for (k = 0; k < channelsLen; k++) {
                    if (data[k] && data[k].length > 0) {
                        events = events.concat(data[k]);
                    }
                }

                if (events && events.length > 0) {
                    if (index >= 0) {
                        for (j = index + me._keepElemCount; j < ctrl._itemNb - 1; j++) {
                            if (ctrl._data[j].startTime > ctrl._data[j - 1].startTime) {
                                me._endTimeAfter = ctrl._data[j + 1].startTime;
                                ctrl._elems.splice(j, ctrl._itemNb - j);
                                ctrl._data.splice(j, ctrl._itemNb - j);
                                ctrl._itemNb = j;
                                break;
                            }
                        }
                    }
                    if (me._sortType === "time") {
                        me.fireControlEvent("prepend", me._filterEvents(events.sort(me._sortByDate)));
                    } else if (me._sortType === "AtoZ") {
                        me.fireControlEvent("prepend", me._filterEvents(events.sort(me._sortByAlphabet)));
                    }
                }

                me._isFetching = false;
                events = [];
            });
        }
    });

    this.onControlEvent("exit:down", function(ctrl) {
        this.logEntry();
        var i = 0,
            len = this._channels.length,
            promises = [],
            service,
            startTime = this._endTimeAfter,
            futureTime = Date.now() + 14 * this._oneDay,
            me = this;

        if (this._sortType === "time") {
            if (this._isFetching || this._endTimeAfter >= futureTime) {
                return;
            }

            if (len > 0) {
                this._isFetching = true;
            }

            this._endTimeAfter = this._endTimeAfter + this._timeStep;
            if (this._endTimeAfter >= futureTime) {
                this._endTimeAfter = futureTime;
            }
            for (i = 0; i < 10; i++) {
                service = this._channels[i];
                if (service && service.serviceId) {
                    promises.push($service.EPG.Event.byTime(service, startTime, this._endTimeAfter, false).then(function(eventsAfter) {
                            return eventsAfter;
                    },
                    function() {
                        return [];
                    }));
                }
            }

            Promise.all(promises).then(function(data) {
                var channelsLen = 0,
                    k = 0,
                    j = 0,
                    index = ctrl.selectedItem.itemIndex,
                    events = [];

                channelsLen = data.length;
                for (k = 0; k < channelsLen; k++) {
                    if (data[k] && data[k].length > 0) {
                        events = events.concat(data[k]);
                    }
                }
                if (events && events.length > 0) {
                    if (index + 1 > me._keepElemCount) {
                        for (j = index + 1 - me._keepElemCount; j > 0; j--) {
                            if (ctrl._data[j - 1].startTime < ctrl._data[j].startTime) {
                                me._startTimeBefore = ctrl._data[j - 1].startTime;
                                ctrl._elems.splice(0, j);
                                ctrl._data.splice(0, j);
                                ctrl._itemNb -= j;
                                break;
                            }
                        }
                    }
                    if (me._sortType === "time") {
                        me.fireControlEvent("append", me._filterEvents(events.sort(me._sortByDate)));
                    } else if (me._sortType === "AtoZ") {
                        me.fireControlEvent("append", me._filterEvents(events.sort(me._sortByAlphabet)));
                    }
                }
                me._isFetching = false;
                events = [];
            });
        }
    });

    this.logExit();
};

/**
 * @method _onFocus
 */
app.gui.controls.GuideListingsProgList.prototype._onFocus = function _onFocus () {
    this.logEntry();
    var cellElems = this._progList.getElementsByClassName("programmeList-cell"),
        i = 0,
        len = 0;

    this.superCall();
    $util.ControlEvents.fire("app-guide:ctaGuide", "fetch", this._selectedItem._data);
    this._selectedItem.classList.add("focused");

    if (cellElems && cellElems.length > 0) {
        len = cellElems.length;
        for (i = 0; i < len; i++) {
            cellElems[i].classList.remove("programmeList-cell-blur");
            cellElems[i].classList.add("programmeList-cell-focus");
        }
    }

    this.logExit();
};

/**
 * @method _onBlur
 */
app.gui.controls.GuideListingsProgList.prototype._onBlur = function _onBlur () {
    this.logEntry();
    var cellElems = this._progList.getElementsByClassName("programmeList-cell"),
        i = 0,
        len = 0;

    this.superCall();
    this._selectedItem.classList.remove("focused");

    if (cellElems && cellElems.length > 0) {
        len = cellElems.length;
        for (i = 0; i < len; i++) {
            cellElems[i].classList.remove("programmeList-cell-focus");
            cellElems[i].classList.add("programmeList-cell-blur");
        }
    }

    this.logExit();
};

/**
 * @method _change
 */

app.gui.controls.GuideListingsProgList.prototype._change = function _change (ctrl) {
    this.logEntry();
    if (ctrl && ctrl.selectedItem) {
        // trigger update earlier, so it only has to add to the array and not the DOM
        var index = ctrl.selectedItem.itemIndex,
            data = ctrl.selectedItem._data,
            dataDateList = this._dateList._data,
            dataLetterList = this._letterList._data,
            startTime = data.startTime,
            i = 0,
            j = 0,
            len = 0,
            sortListIndex;

        if (data && data.isEmpty) {
            this.superCall();
            return;
        }

        if (this._sortType === "time") {
            if (!$util.DateTime.isSameDay(this._currentDate, startTime)) {
                if (data.isYesterday) {
                    $util.ControlEvents.fire("app-guide:epgListingsSortListDateList", "select", 0);
                } else if (data.isToday) {
                    $util.ControlEvents.fire("app-guide:epgListingsSortListDateList", "select", 1);
                } else {
                    sortListIndex = this._dateList.selectedItem.itemIndex;
                    len = dataDateList.length;
                    for (i = 2; i < dataDateList.length; i++) {
                        if (dataDateList[i] === $util.DateTime.dayText(new Date(startTime))) {
                            if (sortListIndex > i) {
                                for (j = 0; j < sortListIndex - i; j++) {
                                    $util.ControlEvents.fire("app-guide:epgListingsSortListDateList", "previous");
                                }
                            } else {
                                for (j = 0; j < i - sortListIndex; j++) {
                                    $util.ControlEvents.fire("app-guide:epgListingsSortListDateList", "next");
                                }
                            }
                            break;
                        }
                    }
                }
                this._currentDate = startTime;
            }
        } else if (this._sortType === "AtoZ") {
            if (this._currentLetter !== ctrl.selectedItem._data.title[0]) {
                len = dataLetterList.length;
                sortListIndex = this._letterList.selectedItem.itemIndex;
                for (i = 0; i < len; i++) {
                    if (dataLetterList[i] === ctrl.selectedItem._data.title[0].toUpperCase()) {
                        if (sortListIndex > i) {
                            for (j = 0; j < sortListIndex - i; j++) {
                                $util.ControlEvents.fire("app-guide:epgListingsSortListLetterList", "previous");
                            }
                        } else {
                            for (j = 0; j < i - sortListIndex; j++) {
                                $util.ControlEvents.fire("app-guide:epgListingsSortListLetterList", "next");
                            }
                        }
                        this._currentLetter = ctrl.selectedItem._data.title[0].toUpperCase();
                        break;
                    }
                }
            }
        }

        if (index === 0) {
            this.fireControlEvent("exit:up", ctrl);
        } else if (index === this._itemNb - 1) {
            this.fireControlEvent("exit:down", ctrl);
        }

        $util.ControlEvents.fire("app-guide:ctaGuide", "fetch", data);
    }
    this.superCall();
    this.logExit();
};

/**
 * @method _fetch
 */

app.gui.controls.GuideListingsProgList.prototype._fetch = function _fetch (type, attribute, value) {
    this.logEntry();
        var me = this,
            service,
            i,
            promises = [],
            //len = this._channels.length,
            startTime = Date.now();

        if (!this._channels || !this._channels.length) {
            $util.ControlEvents.fire("app-guide:epgListingsSortListDateList", "focus");
            return;
        }

        this._fetchedEvents = [];

        if (type === "init") {
            this._sortType = "time";
            this._progList.classList.add("hide");
            this._currentDate = Date.now();
            this._currentLetter = "A";
            this._filter = {
                genre   : "ALL PROGRAMMES",
                subGenre: "ALL PROGRAMMES",
                isCC    : false,
                isHD    : false
            };
        } else if (type === "sort") {
            if (this._sortType === "time") {
                startTime = new Date(Date.now() + (attribute - 1) * this._oneDay).setHours(0, 0, 0, 0);
                if ($util.DateTime.isSameDay(this._currentDate, startTime)) {
                    return;
                }
                if ((attribute === "0") && (startTime < Date.now() - this._oneDay)) {
                    startTime = Date.now() - this._oneDay;
                }
                this._currentDate = startTime;
            } else {
                this._currentLetter = this._letterList._data[attribute];
            }
        } else if (type === "sortBy") {
            this._sortType = attribute;
        } else if (type === "filter") {
            this._setFilter(attribute, value);
        }

        if (type !== "sort") {
            if (this._sortType === "time") {
                this._currentDate = Date.now();
                $util.ControlEvents.fire("app-guide:epgListingsSortListDateList", "select", 1);
            } else if (this._sortType === "AtoZ") {
                $util.ControlEvents.fire("app-guide:epgListingsSortListLetterList", "select", 0);
            }
        }

        this._epgListingsBg.classList.add("loading");
        this._isFetching = true;

        if (this._sortType === "time") {
            this._startTimeBefore = startTime;
            this._endTimeAfter = startTime + this._timeStep;

            for (i = 0; i < 10; i++) {
                service = this._channels[i];
                if (service && service.serviceId) {
                    promises.push($service.EPG.Event.byTime(service, startTime, this._endTimeAfter, false).then(function(eventsAfter) {
                            return eventsAfter;
                        },
                        function() {
                            return [];
                        }));
                }
            }
        } else {
            for (i = 0; i < 1; i++) {
                service = this._channels[i];
                if (service && service.serviceId) {
                    promises.push($service.EPG.Event.byTime(service, Date.now() - this._oneDay, Date.now() + 14 * this._oneDay, false).then(function(data) {
                            return data;
                        },
                        function() {
                            return [];
                        }));
                }
            }
        }

        Promise.all(promises).then(function(data) {
            var channelsLen = 0,
                k = 0;

            me._isFetching = false;
            me._epgListingsBg.classList.remove("loading");
            channelsLen = data.length;
            for (k = 0; k < channelsLen; k++) {
                if (data[k] && data[k].length > 0) {
                    me._fetchedEvents = me._fetchedEvents.concat(data[k]);
                }
            }

            if (me._fetchedEvents && me._fetchedEvents.length > 0) {
                if (me._sortType === "time") {
                    me._filterEvents(me._fetchedEvents.sort(me._sortByDate));
                } else if (me._sortType === "AtoZ") {
                    me._filterEvents(me._fetchedEvents.sort(me._sortByAlphabet));
                }
            }

            me.fireControlEvent("populate", type, attribute);
        });

    this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.GuideListingsProgList.prototype._populate = function _populate () {
    this.logEntry();
    var sortedEvents = [];

    sortedEvents = sortedEvents.concat(this._filteredEvents);

    if (!sortedEvents || sortedEvents.length === 0) { // no events
        this._addEmptyLabels(sortedEvents, this._nbOnePage);
    } else if (this._sortType === "time") {
        this._addDayLabels(sortedEvents);
        if (sortedEvents[0].isDayMarker === true) {
            sortedEvents.shift();
        }
    } else if (this._sortType === "AtoZ") {
        this._addAlphabeticLabels(sortedEvents);
    }

    this._progList.classList.remove("hide");
    this.superCall(sortedEvents, 0);

    sortedEvents = [];
    this.logExit();
};

/**
 * @method _append
 */
app.gui.controls.GuideListingsProgList.prototype._prepend = function _prepend(events) {
    this.logEntry();
    if (this._sortType === "time") {
        this._addDayLabels(events, "up");
    }
    this.superCall(events);
    this.logExit();
};

/**
 * @method _append
 */
app.gui.controls.GuideListingsProgList.prototype._append = function _append(events) {
    this.logEntry();
    if (this._sortType === "time") {
        this._addDayLabels(events, "down");
    }
    this.superCall(events);
    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.GuideListingsProgList.prototype._onKeyDown = function _onKeyDown(e) {
    this.logEntry();
    switch (e.key) {
        case "ChannelDown":
            this.fireControlEvent("pageDown");
            e.stopImmediatePropagation();
            break;
        case "ChannelUp":
            this.fireControlEvent("pageUp");
            e.stopImmediatePropagation();
            break;
        default:
            this.superCall(e);
            break;
    }
    this.logExit();
};

/**
 * @class app.gui.controls.GuideListingsProgListItem
 */
app.gui.controls.GuideListingsProgListItem = function GuideListingsProgListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideListingsProgListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 */
app.gui.controls.GuideListingsProgListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this._time  = this.querySelector('.cellTime');
    this._title = this.querySelector('.cellTitle');
    this._day = this.querySelector('.date');
    this._dayTime = this.querySelector('.time');
    this._icons = this.querySelector('.icons');
    this._chann = this.querySelector('.chanColumn');

    this._focusClass = 'focused';
    this._emptyClass = 'progList-empty';

    this.logExit();
};

/**
 * @method _onBlur
 */
app.gui.controls.GuideListingsProgListItem.prototype._onBlur = function _onBlur () {
    this.logEntry();
    this.superCall();
    this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.GuideListingsProgListItem.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        this._data = data;
        if (!this._channel || !this._channel.serviceId || (this._channel.serviceId !== data.serviceId)) {
            this._channel = $service.EPG.Channel.getByServiceId(data.serviceId) || $service.EPG.Channel.getByServiceId(data.channel);
        }
        if (data) {
            var text = "",
                i = 0;
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
                    '<span class="programmeList-label dayLabelDate">' + text + '</span>';

                this.classList.remove("programmeList-cell");
                this.classList.add("programmeList-label");
                this.classList.add(this._emptyClass); // not selectable
            } else if (data.isAlphabeticMarker === true) {
                text = data.letter;

				 this.innerHTML = '<span class="dayLabelUpArrow iconThinArrowUp"></span>' +
                    '<span class="dayLabelDownArrow iconThinArrowDown"></span>' +
                    '<span class="programmeList-label dayLabelDate">' + text + '</span>';

                this.classList.remove("programmeList-cell");
                this.classList.add("programmeList-label");
                this.classList.add(this._emptyClass); // not selectable
            } else if (data.isEmpty) {
                for (i = 0; i < this.childElementCount; i++) {
                    this.removeChild(this.firstElementChild);
                }
                this.classList.add("programmeList-cell-focus");
            } else {
                this.classList.add("programmeList-cell-focus");
                if (data.progStartDateText) {
                    this._time.textContent = data.progStartDateText;
                    this._dayTime.textContent = data.progStartDateText;
                    this._day.textContent = $util.DateTime.dayText(data.progStartDate);
                }
                if (data.title) {
                    this._title.textContent = data.title;
                }
                if (this._channel) {
                    if (this._channel.logicalChannelNum) {
                        this._chann.textContent = this._channel.logicalChannelNum;
                    }
                    if (this._channel.logo) {
                        this._chann.style.backgroundImage = "url(" + this._channel.logo + ")";
                    }
                }

                if (data.isClosedCaptioned === true) {
                   this.classList.add("eventCC");
                }
                if (data.isSeriesLinked === true) {
                    this.classList.add("eventSLink");
                }
                if (data.isRecord === true) {
                    this.classList.add("eventRecord");
                }
                if (data.isMovie !== true) {
                    if ((data.isStartOver === true && data.isOnNow) ||
                       (data.isCatchUp === true && data.isReverse)) {
                            this.classList.add("eventPlay");
                    }
                }
            }
        } else if (this._emptyClass) {
            this.classList.add(this._emptyClass);
        }
    }
});
