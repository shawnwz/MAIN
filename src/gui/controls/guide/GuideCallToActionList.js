
/**
 * @class app.gui.controls.GuideCallToActionList
 */

app.gui.controls.GuideCallToActionList = function GuideCallToActionList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GuideCallToActionList, app.gui.controls.CallToActionList);

/**
 * @method createdCallback
 */
app.gui.controls.GuideCallToActionList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._epg = document.querySelector('#epg');
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.GuideCallToActionList.prototype._fetch = function _fetch(programme) {
	this.logEntry();
	var items = [],
		synopsisVisible,
		channelViewVisible,
		listingsViewVisible,
		gridViewVisible;

	if (programme) {
		synopsisVisible = this._epg.classList.contains("mainViewSynopsis");
		channelViewVisible = this._epg.classList.contains("channelView");
		listingsViewVisible = this._epg.classList.contains("listingsView");
		gridViewVisible = this._epg.classList.contains("gridView");
		if (synopsisVisible) {
			items.push("ctaFullDetails");
		} else {
			items.push("ctaInfo");
		}

		if (channelViewVisible) {
			items.push("ctaGridView");
		} else if (!listingsViewVisible) {
            items.push("ctaChannelView");
		}

		/*
		if (programme.isInFuture === true) {
			if (o5.platform.btv.Reminders.isReminderSetForEventId(programme.eventId)) {
				items.push("ctaRemoveReminder");
			} else {
				items.push("ctaSetReminder");
			}
		}
		*/
		
		//items.push("ctaRecord");

		
		if (gridViewVisible) {
		    if (programme.isReverse === true && (new Date().getTime() - programme.progStartDate) >= 27 * 3600 * 1000) {
			    items.push("ctaFfwdSkip");
		    } else if (programme.isInFuture === true && (programme.progEndDate - new Date().getTime()) >= 14 * 24 * 3600 * 1000) {
			    items.push("ctaRwdSkip");
		    } else {
			    items.push("ctaSkip24H");
		    }
		}

		if (programme.isMovie !== true) {
			if (programme.isOnNow === true && programme.isStartOver === true) {
				items.push("ctaStartOver");
			} else if (programme.isReverse === true && programme.isCatchUp === true) {
				items.push("ctaWatchNow");
			}
		}
	}

    items.push("ctaPageUpDown");
    if (!channelViewVisible) {
    	items.push("ctaStar");
    }
	this.fireControlEvent("populate", items);
	this.fireControlEvent("show");

	this.logExit();
};

