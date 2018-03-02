/* Implementation of the Guide View, which acts as the view controller */

app.views.Guide = function Guide () {};
o5.gui.controls.Control.registerAppControl(app.views.Guide, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.Guide.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this._epg = this.querySelector('#epg');
    this._epgGenreMenu = this.querySelector('#epgGenreMenu');
    this._epgViewChannelsCont = this.querySelector('#epgViewChannelsCont');
    this._epgViewsBg = this.querySelector('#epgViewsBg');
    this._epgChannelView = this.querySelector('#epgChannelView');
    this._epgListingsView = this.querySelector('#epgListingsView');
    this._epgDate = this.querySelector('#epgDate');

    this._epgListingsGenreFilter = this.querySelector('#epgListingsGenreFilter');
    this._epgListingsSubGenreFilter = this.querySelector('#epgListingsSubGenreFilter');
    this._epgListingsShowOnlyBtnCc = this.querySelector('#epgListingsShowOnlyBtnCc');
    this._epgListingsShowOnlyBtnHd = this.querySelector('#epgListingsShowOnlyBtnHd');

    this._reverseGrid = this.querySelector('#epgViewReverseCont');
    this._nownextGrid = this.querySelector('#epgViewNowNext');
    this._futureGrid = this.querySelector('#epgViewFuture');
    this._viewSlider = this.querySelector('#epgViewsSlider');
    this._nnfSlider = this.querySelector('#epgViewNowNextFutureSlider');

    this._pinDialog = document.querySelector('#dialogPinEntryH');

    this._genre = "";
    this._startTime = undefined;
    this._startChannel = "";
    this._navFromSurf = false;
    this._BgSolid = this.querySelector('#BgSolid');
    this._favdialog = document.querySelector('#dialogGenericErrorH');
    this._pressFav = false;

    $util.ControlEvents.on("app-guide", "sortListings", function () {
        this._epgGenreMenu.innerHTML = "PROGRAMME LISTINGS";
        this._epgViewsBg.classList.add("oxygen-transition-none-hide");
        this._epgChannelView.classList.add("oxygen-transition-none-hide");
        this._epg.classList.remove("channelView");
        this._epg.classList.add("listingsView");
        this._epgListingsView.className = "oxygen-transition-fade-prepareDisplay oxygen-transition-fade-bringIn";
        $util.ControlEvents.fire("app-guide:epgListingsGenreFilter", "reset", "All programmes");
        $util.ControlEvents.fire("app-guide:epgListingsSubGenreFilter", "hide");
        this._epgListingsView.classList.add("time");
        this._epgListingsShowOnlyBtnCc.classList.remove("checked");
        this._epgListingsShowOnlyBtnHd.classList.remove("checked");
    }, this);

    $util.ControlEvents.on([
            "app-guide:epgListingsProgList-List",
            "app-guide:epgListingsSortListDateList",
            "app-guide:epgListingsSortListLetterList",
            "app-guide:epgListingsGenreFilter",
            "app-guide:epgListingsSubGenreFilter",
            "app-guide:epgListingsSortTime",
            "app-guide:epgListingsSortString",
            "app-guide:epgListingsShowOnlyBtnCc",
            "app-guide:epgListingsShowOnlyBtnHd"
        ], "back", function () {
        $util.Events.fire("app:navigate:back");
        if ($config.getConfigValue("settings.view.theme") === "Rel6") {
            $util.ControlEvents.fire("app-home:homeNavMenu", "enter", document.activeElement);
        } else {
            $util.ControlEvents.fire("app-home:portalMenu", "enter", document.activeElement);
        }
    }, this);

    $util.ControlEvents.on([
            "app-guide:epgListingsGenreFilter",
            "app-guide:epgListingsSubGenreFilter",
            "app-guide:epgListingsSortTime",
            "app-guide:epgListingsShowOnlyBtnCc",
            "app-guide:epgListingsShowOnlyBtnHd"
        ], "exit:left", function () {
        $util.ControlEvents.fire("app-guide:epgListingsProgList-List", "focus");
    }, this);

    $util.ControlEvents.on("app-guide:epgListingsProgList-List", "populated", function () {
        $util.ControlEvents.fire("app-guide:epgListingsProgList-List", "focus");
    }, this);

    $util.ControlEvents.on("app-guide:epgListingsProgList-List", "exit:left", function () {
        if (this._epgListingsView.classList.contains("time")) {
            $util.ControlEvents.fire("app-guide:epgListingsSortListDateList", "focus");
        } else {
            $util.ControlEvents.fire("app-guide:epgListingsSortListLetterList", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsProgList-List", "exit:right", function () {
        $util.ControlEvents.fire("app-guide:epgListingsGenreFilter", "focus");
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsProgList-List", "enter", function () {
        var channelToTune;
        if (this._event.isOnNow) {
            channelToTune = $service.EPG.Channel.getByServiceId(this._event.serviceId);
            if (channelToTune) {
                $util.ControlEvents.fire("app-video", "setSrc", channelToTune);
                $util.Events.fire("app:navigate:to", "surf");
            }
        } else {
            $util.ControlEvents.fire("app-guide:ctaGuide", "ctaFullDetails");
        }
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsGenreFilter", "enter", function () {
        $util.ControlEvents.fire(":genreDialog", "show");
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsSubGenreFilter", "enter", function () {
        $util.ControlEvents.fire(":subGenreDialog", "show", this._epgListingsGenreFilter.innerText);
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsSubGenreFilter", "exit:up", function () {
        $util.ControlEvents.fire("app-guide:epgListingsGenreFilter", "focus");
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsSubGenreFilter", "exit:down", function () {
        $util.ControlEvents.fire("app-guide:epgListingsSortTime", "focus");
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsGenreFilter", "exit:down", function () {
        if (this._epgListingsSubGenreFilter.visible) {
            $util.ControlEvents.fire("app-guide:epgListingsSubGenreFilter", "focus");
        } else {
            $util.ControlEvents.fire("app-guide:epgListingsSortTime", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsSortTime", "exit:right", function () {
        $util.ControlEvents.fire("app-guide:epgListingsSortString", "focus");
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsSortString", "exit:left", function () {
        $util.ControlEvents.fire("app-guide:epgListingsSortTime", "focus");
    }, this);
    $util.ControlEvents.on([
            "app-guide:epgListingsSortTime",
            "app-guide:epgListingsSortString"
        ], "exit:up", function () {
        if (this._epgListingsSubGenreFilter.visible) {
            $util.ControlEvents.fire("app-guide:epgListingsSubGenreFilter", "focus");
        } else {
            $util.ControlEvents.fire("app-guide:epgListingsGenreFilter", "focus");
        }
    }, this);
    $util.ControlEvents.on([
            "app-guide:epgListingsSortTime",
            "app-guide:epgListingsSortString"
        ], "exit:down", function () {
        $util.ControlEvents.fire("app-guide:epgListingsShowOnlyBtnCc", "focus");
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsSortTime", "enter", function () {
        if (!this._epgListingsView.classList.contains("time")) {
            this._epgListingsView.classList.remove("AtoZ");
            this._epgListingsView.classList.add("time");
            $util.ControlEvents.fire("app-guide:epgListingsProgList-List", "fetch", "sortBy", "time");
            //need add repopulate programme list here!
        }
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsSortString", "enter", function () {
        if (!this._epgListingsView.classList.contains("AtoZ")) {
            this._epgListingsView.classList.remove("time");
            this._epgListingsView.classList.add("AtoZ");
            $util.ControlEvents.fire("app-guide:epgListingsProgList-List", "fetch", "sortBy", "AtoZ");
            $util.ControlEvents.fire("app-guide:epgListingsSortListLetterList", "populate");
            //need add repopulate programme list here!
        }
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsShowOnlyBtnCc", "exit:down", function () {
        $util.ControlEvents.fire("app-guide:epgListingsShowOnlyBtnHd", "focus");
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsShowOnlyBtnCc", "exit:up", function () {
        if (this._epgListingsView.classList.contains("time")) {
            $util.ControlEvents.fire("app-guide:epgListingsSortTime", "focus");
        } else {
            $util.ControlEvents.fire("app-guide:epgListingsSortString", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsShowOnlyBtnHd", "exit:up", function () {
        $util.ControlEvents.fire("app-guide:epgListingsShowOnlyBtnCc", "focus");
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsShowOnlyBtnHd", "enter", function () {
        $util.ControlEvents.fire("app-guide:epgListingsShowOnlyBtnHd", "toggle");
        $util.ControlEvents.fire("app-guide:epgListingsProgList-List", "fetch", "filter", "HD");
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsShowOnlyBtnCc", "enter", function () {
        $util.ControlEvents.fire("app-guide:epgListingsShowOnlyBtnCc", "toggle");
        $util.ControlEvents.fire("app-guide:epgListingsProgList-List", "fetch", "filter", "CC");
    }, this);
    $util.ControlEvents.on([
            "app-guide:epgListingsSortListDateList",
            "app-guide:epgListingsSortListLetterList"
        ], "exit:right", function () {
        $util.ControlEvents.fire("app-guide:epgListingsProgList-List", "focus");
    }, this);
    $util.ControlEvents.on("app-guide", "fetch", function (data) {
        var tempGenre;
        if (data) {
            tempGenre  = $util.Translations.translate(data.genre);
            this._genre = data.genre;
            this._startTime = data.startTime;
            this._startChannel = data.channel;
            if (data.navFrom && data.navFrom === "surf") {
                this._navFromSurf = true;
            }
        } else {
            tempGenre  = $util.Translations.translate("genre_all");
            this._genre = "genre_all";
            this._startTime = 0;
            this._navFromSurf = false;
        }
        this._focusedElem = null;
        this._epgGenreMenu.innerHTML = tempGenre;
        if (data) {
            this._epgGenreMenu.dataset.i18n = data.genre;
        } else {
            this._epgGenreMenu.dataset.i18n = "genre_all";
        }
        this._epgListingsView.classList.add("oxygen-transition-none-hide");
        this._epgChannelView.classList.add("oxygen-transition-none-hide");
        this._epg.classList.remove("listingsView");
        this._epg.classList.remove("channelView");
        this._epg.classList.add("gridView");
        this._epgViewsBg.className = "oxygen-transition-fade-prepareDisplay oxygen-transition-fade-bringIn";
        $util.ControlEvents.fire("app-guide", "clear");
        if (!this._startTime) { //as default, go to the "NO NOW / ON NEXT" page
            $util.ControlEvents.fire("app-guide", "nowNextGrid");
        }
        if (this._startChannel) {
            //select page first, then channel list can just populated the required channels
            $util.ControlEvents.fire("app-guide:epgChannelStack", "selectPage", this._startChannel);
        }
        $util.ControlEvents.fire("app-guide:epgChannelStack", "fetch", this._genre);
    }, this);
    $util.ControlEvents.on("app-guide", "clear", function () {
        $util.ControlEvents.fire("app-guide:epgChannelStack", "clear", true);
        $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "clear");
        $util.ControlEvents.fire("app-guide:nowNextGrid", "clear");
        $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "clear");
    }, this);
    $util.ControlEvents.on("app-guide", "reverseGrid", function () {
//      this._reverseGrid.style.webkitTransform = "translateX(0px)";
        this._reverseGrid.classList.remove("hide");
        this._viewSlider.className = "reverse";
        this._nnfSlider.className = "nowNext";
        this._epgViewsBg.className = "later";
        this._futureGrid.classList.add("hide");
        this._nownextGrid.classList.add("hide");
        this._epgDate.className = "dateRight";
    }, this);
    $util.ControlEvents.on("app-guide", "nowNextGrid", function () {
//      this._nownextGrid.style.webkitTransform = "translateX(0px)";
        this._nownextGrid.classList.remove("hide");
        this._viewSlider.className = "nowNextFuture";
        this._nnfSlider.className = "nowNext";
        this._epgViewsBg.className = "earlier later";
        this._futureGrid.classList.add("hide");
        this._reverseGrid.classList.add("hide");
        this._epgDate.className = "dateLeft";

        $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "reset");
        $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "reset");
        $util.ControlEvents.fire("app-guide", "date", Date.now());

        if (this._channels) {
            //$util.ControlEvents.fire("app-guide:nowNextGrid", "fetch", this._channels);
        }
    }, this);
    $util.ControlEvents.on("app-guide", "futureGrid", function () {
//      this._futureGrid.style.webkitTransform = "translateX(0px)";
        this._futureGrid.classList.remove("hide");
        this._viewSlider.className = "nowNextFuture";
        this._nnfSlider.className = "future";
        this._epgViewsBg.className = "earlier";
        this._reverseGrid.classList.add("hide");
        this._nownextGrid.classList.add("hide");
        this._epgDate.className = "dateLeft";
    }, this);

    $util.ControlEvents.on("app-guide", "date", function (time) {
        if ($util.DateTime.isToday(time)) {
            this._epgDate.innerHTML = $util.Translations.translate("epgToday");
            this._epgDate.dataset.i18n = "epgToday";
        } else if ($util.DateTime.isTomorrow(time)) {
            this._epgDate.innerHTML = $util.Translations.translate("epgTomorrow");
            this._epgDate.dataset.i18n = "epgTomorrow";
        } else if ($util.DateTime.isYesterday(time)) {
            this._epgDate.innerHTML = $util.Translations.translate("epgYesterday");
            this._epgDate.dataset.i18n = "epgYesterday";
        } else {
            this._epgDate.innerHTML = $util.DateTime.dayText(time);
        }
    }, this);

    $util.ControlEvents.on("app-guide", "dialog", function() {
        var _dialog = {};

        //TBD The message says "There is no programme"? we can have the same message and later change if required.
        //if (this._genre === "Favourites") {
        //} else {
        //}

        _dialog = {
            title    : $util.Translations.translate("F0241Title"),
            text     : $util.Translations.translate("F0241Description"),
            subText  : "",
            errorCode: ""
        };

        $util.ControlEvents.fire(":dialogGenericErrorH", "show", _dialog);
        $util.ControlEvents.fire(":dialogGenericErrorH", "focus");

    }, this);

    $util.ControlEvents.on("app-guide", "navigate:to", function(data) {
        if (this._channels.length > 0) {
            $util.Events.fire("app:navigate:to", data);
        } else {
            $util.ControlEvents.fire("app-guide", "dialog");
        }
    }, this);

    $util.ControlEvents.on("app-guide", "startLoading", function() {
        var me = this;
        clearTimeout(this._spinnerTimer);
        if (!this._epgViewsBg.classList.contains("loading")) {
        this._spinnerTimer = setTimeout(function () {
            me._epgViewsBg.classList.add("loading");
        }, 500);
        }
    }, this);

    $util.ControlEvents.on("app-guide", "stopLoading", function() {
        clearTimeout(this._spinnerTimer);
        this._epgViewsBg.classList.remove("loading");
    }, this);

    $util.ControlEvents.on("app-guide:epgChannelStack", "populated", function (ctrl) {
        var me = this;
        this._channels = ctrl.itemData;
        $util.ControlEvents.fire("app-guide", "startLoading");

        this._epgViewChannelsCont.style.height = (ctrl.itemNb * 55) + "px";
        if (!this._startTime) {
            if (!$config.getConfigValue("settings.tv.guide.now.and.next")) {
                if (!this._event.startTime || this._event.startTime > Date.now()) {
                    $util.ControlEvents.fire("app-guide", "futureGrid");
                    $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "fetch", this._channels);
                    $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "fetch", this._channels);
                    setTimeout(function () {
                        if (me.starguide && me._colIndex !== -1) {
                            me.starguide = false;
                            $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "select", me._rowIndex, me._colIndex);
                        } else {
                            $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "select", me._rowIndex, 3); // select one after next //@ "middle" instead? since 3 might not exist?
                        }
                        $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "focus");
                    }, 100);
                } else {
                    $util.ControlEvents.fire("app-guide", "reverseGrid");
                    $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "fetch", this._channels);
                    $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "fetch", this._channels);
                    setTimeout(function () {
                        if (me.starguide && me._colIndex !== -1) {
                            me.starguide = false;
                            $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "select", me._rowIndex, me._colIndex);
                        } else {
                            $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "select", me._rowIndex, 3); // select one after next //@ "middle" instead? since 3 might not exist?
                        }
                        $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "focus");
                    }, 100);
                }
            } else {
                this.starguide = false;
                $util.ControlEvents.fire("app-guide:nowNextGrid", "clear");
                $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "clear");
                $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "clear");
                $util.ControlEvents.fire("app-guide:nowNextGrid", "fetch", this._channels);
            }
        } else {
            this.starguide = false;
            if (this._startTime > Date.now()) {
                $util.ControlEvents.fire("app-guide", "futureGrid");
                $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "reset");
                $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "reset");
                $util.ControlEvents.fire("app-guide", "date", Date.now());
            } else {
                $util.ControlEvents.fire("app-guide", "reverseGrid");
                $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "reset");
                $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "reset");
                $util.ControlEvents.fire("app-guide", "date", Date.now());
            }
            $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "fetch", this._channels);
            $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "fetch", this._channels);
        }

        if (this._startChannel) {
            $util.ControlEvents.fire("app-guide:epgChannelStack", "selectChannel", this._startChannel);
        }
        if ($config.getConfigValue("settings.tv.guide.background.vision")) {
            this._BgSolid.hidden = true;
        } else {
            this._BgSolid.hidden = false;
        }
        if (!$config.getConfigValue("settings.tv.guide.background.audio")) {
            o5.platform.system.Device.setMuteAudio();
        }
    }, this);

    $util.ControlEvents.on("app-guide:futureEpgEventsInner", "exit:left", function() {
        $util.ControlEvents.fire("app-guide:nowNextGrid", "fetch", this._channels);
    }, this);

    $util.ControlEvents.on("app-guide:futureEpgEventsInner", "populated", function () {
        if (this._navFromSurf && this._startTime && this._startTime > Date.now()) {
            this._navFromSurf = false;
            $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "select", this._rowIndex, 2);
            $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "focus");
            $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "scrollToTime", this._startTime);
        }
    }, this);
    $util.ControlEvents.on("app-guide:epgChannelStack", "change", function (ctrl) {
        var selectedItem = ctrl ? ctrl.selectedItem : null;

        if (selectedItem) {
            this._rowIndex = selectedItem.itemIndex;
            this._channel = selectedItem.itemData;
        } else {
            this._rowIndex = 0;
            this._colIndex = -1;
            this._colIndexNowNext = 0;
            this._channel = {};
        }
    }, this);

    $util.ControlEvents.on("app-guide:nowNextGrid", "populated", function () {
        $util.ControlEvents.fire("app-guide:nowNextGrid", "focus");
        $util.ControlEvents.fire("app-guide:nowNextGrid", "select", this._rowIndex, this._colIndexNowNext); // select now event

        if (!this._startTime) {
            $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "fetch", this._channels);
            $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "fetch", this._channels);
        }
    }, this);
    $util.ControlEvents.on(
            "app-guide:nowNextGrid", "change", function (ctrl) {
        var selectedItem = ctrl ? ctrl.selectedItem : null,
            row = selectedItem ? selectedItem.itemRowIndex : 0,
            data = selectedItem ? selectedItem.itemData : null;
            this._colIndexNowNext = selectedItem ? selectedItem.itemColIndex : -1;

        $util.ControlEvents.fire("app-guide:epgChannelStack", "select", row);
        if (this._synopsisVisible && data) {
            $util.ControlEvents.fire("app-guide:epgMiniSynopsis", "populate", data);
        }
        this._event = data;
        $util.ControlEvents.fire("app-guide:ctaGuide", "fetch", data);
    }, this);
    $util.ControlEvents.on([
            "app-guide:reverseEpgEventsInner",
            "app-guide:futureEpgEventsInner"
        ], "change", function (ctrl) {
        var selectedItem = ctrl ? ctrl.selectedItem : null,
            row = selectedItem ? selectedItem.itemRowIndex : 0,
            data = selectedItem ? selectedItem.itemData : null;
            this._colIndex = selectedItem ? selectedItem.itemColIndex : -1;

        $util.ControlEvents.fire("app-guide:epgChannelStack", "select", row);
        if (this._synopsisVisible && data) {
            $util.ControlEvents.fire("app-guide:epgMiniSynopsis", "populate", data);
        }
        this._event = data;
        $util.ControlEvents.fire("app-guide:ctaGuide", "fetch", data, ctrl);
    }, this);
    $util.ControlEvents.on("app-guide:epgListingsProgList-List", "change", function (ctrl) {
        var selectedItem = ctrl ? ctrl.selectedItem : null,
            data = selectedItem ? selectedItem.itemData : null;
        this._event = data;
    }, this);
    $util.ControlEvents.on([
            "app-guide:reverseEpgEventsInner",
            "app-guide:futureEpgEventsInner"
        ], "populated", function (ctrl) {
        clearTimeout(this._spinnerTimer);
        //$util.ControlEvents.fire("app-guide", "date", ctrl.gridStart);
        if (ctrl.focused) {
            if (this._colIndex === -1) {
                ctrl.fireControlEvent("select", this._rowIndex, "middle");
            } else {
                ctrl.fireControlEvent("select", this._rowIndex, this._colIndex);
            }
        }
    }, this);
    $util.ControlEvents.on([
            "app-guide:reverseEpgEventsInner",
            "app-guide:futureEpgEventsInner"
        ], "updated", function (ctrl) {
        $util.ControlEvents.fire("app-guide", "date", ctrl.gridStart);
    }, this);

    $util.ControlEvents.on("app-guide:ctaGuide", "ctaFullDetails", function () {
        // bring up full synopsis
        if (this._event) {
            this._focusedElem = document.activeElement;
            $util.ControlEvents.fire("app-synopsis", "fetch", this._event);
            $util.Events.fire("app:navigate:to", "synopsis");
        }
    }, this);
    $util.ControlEvents.on([
            "app-guide:reverseEpgEventsInner",
            "app-guide:nowNextGrid",
            "app-guide:futureEpgEventsInner"
        ], "enter", function () {
        var channelToTune,
            me = this;

        if (this._event) {
            if (this._event.isRadio || this._event.isOnNow === true) {
                channelToTune = $service.EPG.Channel.getByServiceId(this._channel.serviceId);
                $util.ControlEvents.fire("app-video", "setSrc", channelToTune);
                $util.Events.fire("app:navigate:to", "surf");
                setTimeout(function () {
                    var isMaster = o5.platform.system.Preferences.get("/users/current/isMaster", true);
                    if (!isMaster && (o5.platform.ca.ParentalControl.isChannelLocked(me._channel.serviceId) || me._event.ratingBlocked === true)) {
                        if (me._pinDialog.visible === false) {
                            $util.ControlEvents.fire(":dialogPinEntryH", "show");
                            $util.ControlEvents.fire(":dialogPinEntryH", "focus", { "id": "surf" });
                        }
                    }
                }, 500);
            } else {
                $util.ControlEvents.fire("app-guide:ctaGuide", "ctaFullDetails");
            }
        }
    }, this);
    $util.ControlEvents.on("app-guide:ctaGuide", "ctaInfo", function () {
        // bring up mini synospis
        //@hdk Only if Channel View is not active! Otherwise bring up full synopsis
        if (this._epg.classList.contains("channelView")) {
            $util.ControlEvents.fire("app-guide:epgChannelProgList", "ctaFullDetails");
        } else if (this._epg.classList.contains("listingsView")) {
            $util.ControlEvents.fire("app-guide:ctaGuide", "ctaFullDetails");
        } else {
            this._showMiniSynopsis();
        }
    }, this);
    $util.ControlEvents.on([
            "app-guide:reverseEpgEventsInner",
            "app-guide:nowNextGrid",
            "app-guide:futureEpgEventsInner"
        ], "back", function () {
            if (this._synopsisVisible) { // hide minisynospis
                $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "clear");
                $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "clear");
                this._hideMiniSynopsis();
            } else { // cleanup and exit
                $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "clear");
                $util.ControlEvents.fire("app-guide:nowNextGrid", "clear");
                $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "clear");
                $util.Events.fire("app:navigate:back");
                if ($config.getConfigValue("settings.view.theme") === "Rel6") {
                    $util.ControlEvents.fire("app-home:homeNavMenu", "enter", document.activeElement);
                } else {
                    $util.ControlEvents.fire("app-home:portalMenu", "enter", document.activeElement);
                }
            }
    }, this);

    $util.ControlEvents.on("app-guide:ctaGuide", "ctaChannelView", function () {
        this._focusedElem = document.activeElement; // for when we come back
         var index = this._event ? o5.platform.btv.EPG.getAllChannels().indexOf($service.EPG.Channel.getByServiceId(this._channel.serviceId)) : 0;
        if (this._synopsisVisible) { // hide minisynospis
            this._hideMiniSynopsis();
        }

        this._epg.classList.add("channelView");
        this._epg.classList.remove("gridView");
        this._epgChannelView.className = "oxygen-transition-fade-prepareDisplay oxygen-transition-fade-bringIn";
        this._epgViewsBg.classList.add("oxygen-transition-none-hide");

        $util.ControlEvents.fire("app-guide:epgChannelViewChanListPrev", "fetch", this._genre, index, this._event);
        // epgChannelViewChanListNext is fetched when epgChannelViewChanListPrev is "populated"
    }, this);
    $util.ControlEvents.on("app-guide:epgChannelViewChanListPrev", "populated", function () {
        $util.ControlEvents.fire("app-guide:epgChannelViewChanListPrev", "focus");
    }, this);
    $util.ControlEvents.on("app-guide:epgChannelViewChanListPrev", "back", function () {
        this._epg.classList.remove("channelView");
        this._epg.classList.add("gridView");
        this._epgChannelView.className = "oxygen-transition-none-bringOut oxygen-transition-none-hide";
        this._epgViewsBg.classList.remove("oxygen-transition-none-hide");
        $util.ControlEvents.fire("app-guide:ctaGuide", "swap", "ctaGridView", "ctaChannelView");
        this._startChannel = this._channel.mainChannelId || this._channel.serviceId;
        $util.ControlEvents.fire("app-guide:epgChannelStack", "selectPage", this._channel.mainChannelId || this._channel.serviceId);
        $util.ControlEvents.fire("app-guide:epgChannelStack", "fetch", this._genre);
        if (this._focusedElem) {
            this._focusedElem.focus();
        } else {
            $util.ControlEvents.fire("app-guide", "nowNextGrid");
            $util.ControlEvents.fire("app-guide:nowNextGrid", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-guide:epgChannelViewChanListPrev", "updateEvent", function (ctrl) {
        this._event = ctrl.selectedItem._data;
    }, this);

    $util.ControlEvents.on("app-guide:ctaGuide", "ctaGridView", function () {
        $util.ControlEvents.fire("app-guide:epgChannelViewChanListPrev", "back");
    }, this);
    $util.ControlEvents.on("app-guide:reverseEpgEventsInner", "exit:right", function () {
        var fastmode = [].slice.call(arguments, 1);
        clearTimeout(this._spinnerTimer);
        if (!$config.getConfigValue("settings.tv.guide.now.and.next")) {
            $util.ControlEvents.fire("app-guide", "futureGrid");
            $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "select", this._rowIndex, 3); // select one after next //@ "middle" instead? since 3 might not exist?
            $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "focus");
        } else {
            $util.ControlEvents.fire("app-guide", "nowNextGrid");
            if (fastmode[0] === true) {
                $util.ControlEvents.fire("app-guide:nowNextGrid", "select", this._rowIndex, 1); // select next event
            } else {
                $util.ControlEvents.fire("app-guide:nowNextGrid", "select", this._rowIndex, 0); // select now event
            }
            $util.ControlEvents.fire("app-guide:nowNextGrid", "focus");
        }
    }, this);
    $util.ControlEvents.on("app-guide:futureEpgEventsInner", "exit:left", function () {
        var fastmode = [].slice.call(arguments, 1);
        clearTimeout(this._spinnerTimer);
        if (!$config.getConfigValue("settings.tv.guide.now.and.next")) {
            $util.ControlEvents.fire("app-guide", "reverseGrid");
            $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "select", this._rowIndex, -2); // select previous event //@ "middle" instead? since -2 might not exist?
            $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "focus");
        } else {
            $util.ControlEvents.fire("app-guide", "nowNextGrid");
            if (fastmode[0] === true) {
                $util.ControlEvents.fire("app-guide:nowNextGrid", "select", this._rowIndex, 0); // select now event
            } else {
                $util.ControlEvents.fire("app-guide:nowNextGrid", "select", this._rowIndex, 1); // select next event
            }
            $util.ControlEvents.fire("app-guide:nowNextGrid", "focus");
        }
    }, this);

    $util.ControlEvents.on("app-guide:nowNextGrid", "exit:left", function () {
        $util.ControlEvents.fire("app-guide", "reverseGrid");
        $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "select", this._rowIndex, -2); // select previous event //@ "middle" instead? since -2 might not exist?
        $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "focus");
    }, this);
    $util.ControlEvents.on("app-guide:nowNextGrid", "exit:right", function () {
        $util.ControlEvents.fire("app-guide", "futureGrid");
        $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "select", this._rowIndex, 3); // select one after next //@ "middle" instead? since 3 might not exist?
        $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "focus");
    }, this);
    $util.Events.on("channelEntry:tune", function (channel) {
        this.logEntry();
        var index = o5.platform.btv.EPG.getAllChannels().indexOf($service.EPG.Channel.getByServiceId(channel.serviceId)),
            toTune = true;
        if (this._epg.classList.contains("channelView")) {
            if (this._genre === "genre_Favourites" && !$service.settings.FavouriteService.isChannleFavourite(channel)) {
                toTune = false;
            }
            if (this._channel.serviceId === channel.serviceId) {
                toTune = false;
            }
            if (toTune) {
                $util.ControlEvents.fire("app-guide:epgChannelViewChanListPrev", "fetch", this._genre, index);
                $util.ControlEvents.fire("app-video", "setSrc", channel);
            }
        } else {
            if (this._genre === "genre_Favourites" && !$service.settings.FavouriteService.isChannleFavourite(channel)) {
                toTune = false;
            }
            if (this._channel.serviceId === channel.serviceId) {
                toTune = false;
            }
            if (toTune) {
                $util.ControlEvents.fire("app-guide:epgChannelStack", "selectPage", channel.mainChannelId || channel.serviceId, this._genre);
                $util.ControlEvents.fire("app-guide:epgChannelStack", "fetch", this._genre);
                $util.ControlEvents.fire("app-guide:epgChannelStack", "selectChannel", channel.mainChannelId || channel.serviceId, this._genre);
                $util.ControlEvents.fire("app-video", "setSrc", channel);
            }
        }
    }, this);

    $util.ControlEvents.on("app-guide:ctaGuide", "ctaSkip24H", function(key) {
        if (!$config.getConfigValue("settings.tv.guide.now.and.next")) {
            $util.ControlEvents.fire("app-guide:guidegrid", "ctaSkip24H", key);
        } else {
            $util.ControlEvents.fire("app-guide:nowNextGrid", "ctaSkip24H", key);
        }
    }, this);

    $util.ControlEvents.on("app-guide:ctaGuide", "ctaStar", function(key) {
        if (key === "Star" || key === "Favorites" || key === "Record") {
            $util.ControlEvents.fire("app-guide:epgChannelStack", "getGenreChannel", "genre_Favourites");
        }
    }, this);
    $util.ControlEvents.on("app-guide", "favdialog", function(action) {
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

    $util.ControlEvents.on("app-guide", "genreFavourites", function (length) {
        if (length > 0) {
            if (!$config.getConfigValue("settings.tv.guide.now.and.next")) {
                $util.ControlEvents.fire("app-guide:guidegrid", "ctaStar");
            } else {
                $util.ControlEvents.fire("app-guide:nowNextGrid", "ctaStar");
            }
        } else if (this._favdialog.visible === false) {
            this._focusedElem = document.activeElement; // for when we come back
            $util.ControlEvents.fire("app-guide", "favdialog", "show");
        } else {
            $util.ControlEvents.fire("app-guide", "favdialog", "jumpToSettingAndHide");
        }

    }, this);

    $util.ControlEvents.on("app-guide", "getFavourites", function() {
        if (this._pressFav === false) {
            $util.ControlEvents.fire("app-guide:epgChannelStack", "getGenreChannel", "genre_Favourites");
        }
        this._pressFav = false;
    }, this);
    $util.ControlEvents.on("app-guide", "noselectChannel", function() {
        if (!$config.getConfigValue("settings.tv.guide.now.and.next")) {
            $util.ControlEvents.fire("app-guide:guidegrid", "noselectChannel");
        } else {
            $util.ControlEvents.fire("app-guide:nowNextGrid", "noselectChannel");
        }
    }, this);
    $util.ControlEvents.on("app-guide:nowNextGrid", "noChannel", function () {
        this._colIndexNowNext = 0;
    }, this);
    $util.ControlEvents.on("app-guide", "starChannel", function () {
        this.starguide = true;
    }, this);

    this._focusedElem = null; // focused element
    this._spinnerTimer = null;
    this._rowIndex = 0; // selected row
    this._colIndex = -1;
    this._colIndexNowNext = 0;
    this._channel = {}; // selected channel
    this._event = {}; // selected event
    this._synopsisVisible = undefined;

    this.onkeydown = this._onKeyDown;
    this.onfocus = this._onFocus;
    this.onblur = this._onBlur;
    this.onload = this._onLoad;
    this.onshow = this._onShow;
    this.onhide = this._onHide;
    this.starguide = false;

    this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.Guide.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    $util.Events.fire("app:view:attached", "guide");
    this.logExit();
};

/**
 * @method _onLoad
 * @private
 */
app.views.Guide.prototype._onLoad = function _onLoad () {
    this.logEntry();
    this._loaded = true;
    this.logExit();
};

/**
 * @method _onFocus
 */
app.views.Guide.prototype._onFocus = function _onFocus () {
    this.logEntry();
    if (this._focusedElem) {
        this._focusedElem.focus();
    } else {
        $util.ControlEvents.fire("app-guide:nowNextGrid", "focus");
    }
    if (this._epg.classList.contains("channelView")) {
        $util.ControlEvents.fire("app-guide:epgChannelViewChanListPrev", "focus");
    }
    if (!$config.getConfigValue("settings.tv.guide.background.audio")) {
        o5.platform.system.Device.setMuteAudio();
    }
    this.logExit();
};

/**
 * @method _onBlur
 */
app.views.Guide.prototype._onBlur = function _onBlur () {
    this.logEntry();
    this.logExit();
};

/**
 * @method _onShow
 */
app.views.Guide.prototype._onShow = function _onShow () {
    this.logEntry();
    $util.ControlEvents.fire("app-guide:epgClock", "show");
    this.logExit();
};

/**
 * @method _onHide
 */
app.views.Guide.prototype._onHide = function _onHide () {
    this.logEntry();
//  $util.ControlEvents.fire("app-guide", "clear"); //@hdk When to clear? cant do this! we have nothing visble when we come back from synopsis!
    $util.ControlEvents.fire("app-guide:epgClock", "hide");
    if (this._favdialog.visible === true) {
        $util.ControlEvents.fire(":dialogGenericErrorH", "hide");
    }
    this._event = {};
    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.views.Guide.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false;

    if (handled === true) {
        e.stopImmediatePropagation();
        e.preventDefault();
    } else {
        if (e.key === "Star" || e.key === "Favorites" || e.key === "Record") {
            this._pressFav = true;
        }
        $util.ControlEvents.fire("app-guide:ctaGuide", "key:down", e);
    }
    this.logExit();
};

/**
 * _hideMiniSynopsis
 */
app.views.Guide.prototype._hideMiniSynopsis = function _hideMiniSynopsis () {

    $util.ControlEvents.fire("app-guide:epgPip", "hide");
    $util.ControlEvents.fire("app-guide:epgMiniSynopsis", "hide");
    $util.ControlEvents.fire("app-guide:epgChannelStack", "page:size", 10);

    $util.ControlEvents.fire("app-guide:ctaGuide", "swap", "ctaFullDetails", "ctaInfo");

    this._synopsisVisible = false;
};

/**
 * _showMiniSynopsis
 */
app.views.Guide.prototype._showMiniSynopsis = function _showMiniSynopsis () {

    var channel = this._channel;

    if (channel && channel.type === $util.constants.CHANNEL_TYPE.VIDEO) { // show it if its a tv channel

        $util.ControlEvents.fire("app-guide:epgPip", "show"); //@hdk _handlePIPDisplay(channel);
        $util.ControlEvents.fire("app-guide:epgMiniSynopsis", "reset");
        $util.ControlEvents.fire("app-guide:epgMiniSynopsis", "show");
        $util.ControlEvents.fire("app-guide:reverseEpgEventsInner", "clear");
        $util.ControlEvents.fire("app-guide:futureEpgEventsInner", "clear");
        $util.ControlEvents.fire("app-guide:epgChannelStack", "page:size", 6);

        $util.ControlEvents.fire("app-guide:ctaGuide", "swap", "ctaInfo", "ctaFullDetails");

        this._synopsisVisible = true;
    }
};

app.views.Guide.prototype._displayReminderDialog = function _displayReminderDialog (event) {
        var dialog = {
            title    : "Reminder",
            text     : event.title,
            subText  : "Press select to watch",
            errorCode: ""
        };

        $util.ControlEvents.fire(":dialogGenericErrorH", "show", dialog, function () {
            $util.ControlEvents.fire("app-video", "setSrc", $service.EPG.Channel.getByServiceId(event.serviceId));
            $util.Events.fire("app:navigate:to", "surf");
        });
        $util.ControlEvents.fire(":dialogGenericErrorH", "focus");
};
