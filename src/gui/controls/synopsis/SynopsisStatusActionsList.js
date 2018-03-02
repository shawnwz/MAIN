/**
 * @class app.gui.controls.SynopsisStatusActionsList
 */

app.gui.controls.SynopsisStatusActionsList = function SynopsisStatusActionsList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisStatusActionsList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 */
app.gui.controls.SynopsisStatusActionsList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    //this.fireControlEvent("debug", true, 'background: blue; color: yellow;');

    this.orientation = "Vertical";
    this.focusClass = "focused";
    this._currentContent = null;

    this.onControlEvent("enter", function (ctrl) {
        var option = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData : null;

        if (option.status === "statusPlay") {
            //this._currentContent.uri = "http://10.12.130.249/share/dash-yt-content/car-20120827-160.mp4"; //Just for testing, there should be a uri in editorial data.
            this._currentContent.uri = "http://test-allformats-vod3.content.foxtel.com.au/store2/nagra_test/ON305331/ON305331_mpd.ism/playlist.mpd";
            $util.ControlEvents.fire("app-video", "setSrc", this._currentContent);
        }
        //TODO: add other real options (reminder, record, watchLive, rent) here!!
    });

    this.logExit();
};

/**
 * @method populate
 * @param {Object}[] editorials
 */
app.gui.controls.SynopsisStatusActionsList.prototype._populate = function _populate (editorial) {
    this.logEntry();
    var data = [],
        i,
        dataReady = false;

    this.fireControlEvent("clear");
    if (editorial) {
        this._currentContent = editorial; //this._currentContent was stored to be used in player
        if (editorial.multipleVersions && editorial.multipleVersions.length > 0) {
            // eslint-disable-next-line guard-for-in
            for (i in editorial.multipleVersions) {
                if (editorial.multipleVersions[i].definition && editorial.multipleVersions[i].definition.toUpperCase() === "HD") {
                    data.push({
                        text: $util.Translations.translate("purchaseOptionRentHD") + ' $' + editorial.multipleVersions[i].price,
                        status: "statusPlay" });
                } else {
                    data.push({
                        text: $util.Translations.translate("purchaseOptionRentSD") + ' $' + editorial.multipleVersions[i].price,
                        status: "statusPlay" });
                }
            }
        } else if (editorial.price && editorial.price !== 0) {
                if (editorial.definition && editorial.definition.toUpperCase() === "HD") {
                    data.push({
                        text: $util.Translations.translate("purchaseOptionRentHD") + ' $' + (editorial.price).toFixed(2),
                        status: "statusPlay" });
                } else {
                    data.push({
                        text: $util.Translations.translate("purchaseOptionRentSD") + ' $' + (editorial.price).toFixed(2),
                        status: "statusPlay" });
                }
        } else if (editorial.recordingData && editorial.url) {
                data.push({ text: $util.Translations.translate("synopsisPlayRecording"), status: "statusPlay" });
        } else if (editorial.url && editorial.url.length > 0 && !editorial.recordingData) {
                data.push({ text: $util.Translations.translate("callToActionPlayNow"), status: "statusPlay" });
        } else {
            data.push({ text: $util.Translations.translate("synopsisWatchOnDemand"), status: "statusPlay" });
        }

        if (editorial.isOnNow === true) {
            data.push({ text: $util.Translations.translate("synopsisWatchLiveAction"), status: "statusOnNow", progress: editorial.progress });
        }
        if (dataReady) { // (editorial.trailerId && editorial.contentType === "MOVIE" && editorial.price !== 0)
            data.push({ text: $util.Translations.translate("synopsisWatchTrailerAction"), status: "statusWatchTrailer" });
        }
        if (dataReady) {
            data.push({ text: $util.Translations.translate("synopsisRecordAction"), status: "statusRecorded" });
        }
        if (dataReady) {
            data.push({ text: $util.Translations.translate("callToActionKeep"), status: "statusKeep" });
        }
        if (dataReady) {
            data.push({ text: $util.Translations.translate("synopsisLocked"), status: "statusLocked" });
        }
        if (editorial.recordingData && editorial.recordingData.isScheduled && !editorial.url) {
            data.push({ text: $util.Translations.translate("synopsisStatusScheduled"), status: "statusScheduled" });
        }
        if (dataReady) {
            data.push({ text: $util.Translations.translate("synopsisScheduledPlus"), status: "statusScheduledPlus" });
        }
        if (dataReady) {
            data.push({ text: $util.Translations.translate("synopsisError"), status: "statusError" });
        }
        if (dataReady) { // is reminder set?
            data.push({ text: $util.Translations.translate("synopsisStatusReminder"), status: "statusReminder" });
        }
        if (editorial.isInFuture === true) {
            if (dataReady) { // already sceduled to remind
                data.push({ text: $util.Translations.translate("synopsisRemoveReminderAction") });
            } else if (editorial.serviceLongName !== "MAI" && editorial.serviceLongName !== "MAH") { //don't show the set reminder for main events as observed
                data.push({ text: $util.Translations.translate("synopsisSetReminderAction") });
            }
        }
        if (editorial.isOnNow === true || editorial.isInFuture === true) {
            if (dataReady) { // already sceduled to record
                data.push({ text: $util.Translations.translate("synopsisRecordOptionsAction") });
            } else {
                data.push({ text: $util.Translations.translate("synopsisRecordAction") });
            }
        }
    }

    this.superCall(data, 0);
    this.logExit();
};




/**
 * @class app.gui.controls.SynopsisStatusActionsListItem
 */

app.gui.controls.SynopsisStatusActionsListItem = function SynopsisStatusActionsListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisStatusActionsListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SynopsisStatusActionsListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this._data = null;

    this.className = "synopsisActions-row";

  this._title = this.querySelector('.synopsisActions-item .title');
    this._buffer = this.querySelector('.synopsisActions-item .buffer');
    this._status = this.querySelector('.synopsisActions-item .icon span');

    this.logExit();
};

Object.defineProperty(app.gui.controls.SynopsisStatusActionsListItem.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        this._data = data;

        if (data) {
            this._title.textContent = data.text;

            if (data.status) {
                this._status.className = data.status;
            }

            if (data.progress) {
                this._buffer.style.width = data.progress + "%";
            } else {
                this._buffer.style.width = "0";
            }
        }
    }
});
