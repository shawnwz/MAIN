/**
 * @class app.gui.controls.PlayerBanner
 */

app.gui.controls.PlayerBanner = function PlayerBanner () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.PlayerBanner, app.gui.controls.HtmlItem);

app.gui.controls.PlayerBanner.prototype.createdCallback = function createdCallback () {
//	this.logEntry();
	this.superCall();

    this._player = document.querySelector('#videoView').videoPlayer;
	this._title = this.querySelector("#playerTitle");
	this._barStartTime = this.querySelector("#playerBarStartTime");
	this._barEndTime = this.querySelector("#playerBarEndTime");
	this._barFill = this.querySelector("#playerBarFill");
	this._barPointer = this.querySelector("#playerBarPointer");


	this._getContentLengthText = function (contentLength) {
        var hours = "0" + Math.floor(contentLength / (60 * 60)),
            mins = Math.floor(Math.round(contentLength - (hours * 60 * 60)) / 60),
            secs = Math.floor(Math.round(contentLength - ((hours * 60 * 60) + (mins * 60))));

        if (mins === 60) {
            hours++;
            mins = 0;
        }
        if (mins < 10) {
            mins = "0" + mins;
        }
        if (secs === 60) {
            mins++;
            secs = 0;
        }
        if (secs < 10) {
            secs = "0" + secs;
        }
        return hours + ":" + mins + ":" + secs;
    };

//	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.PlayerBanner.prototype._fetch = function _fetch (data) {
	this.logEntry();

	var now = Date.now(),
		duration = 600 * 1000,
		ev = {}, //@hdk get real data for current live event
		pb = {}; //@hdk get real data for current playback

    if (data.contentType) { //if it is a vod content
        ev.title = data.title;
        duration = data.duration;
        ev.start = 0;
        ev.duration = this._player.duration; //temp use duration from video tag, will use asset duration when use real he content
        ev.end = ev.start + ev.duration;
        ev.progStartDateText = this._getContentLengthText(this._player.currentTime);
        ev.progEndDateText = this._getContentLengthText(ev.end);
        pb.start = 0;
        pb.end = duration;
        pb.current = this._player.currentTime;
        pb.contentLength = this._player.currentTime - pb.start;
    } else { //use fake data for event RB playback here, to be modified when to integration
        ev.title = data.title;
        ev.start = now - (now % duration) - 120 * 1000;
        ev.duration = (duration + 2 * 120 * 1000);
        ev.end = ev.start + ev.duration;
        ev.progStartDateText = $util.DateTime.timeText(ev.start);
        ev.progEndDateText = $util.DateTime.timeText(ev.end);

        pb.start = ev.start + 180 * 1000; // tuned 3 mins after ev start
        pb.end = now;
        pb.contentLength = now - pb.start;
        pb.current = pb.contentLength - 60 * 1000; // 1 min behind live
	}
	this.fireControlEvent("populate", { pb: pb, ev: ev });

	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.PlayerBanner.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;

		if (data.pb && data.pb.contentLength > 0) {
			var left = 0,
				right = data.pb.current,
				pos = right;


			if (data.ev.start > 0 && data.ev.end > 0) { //RB

				if (data.pb.start > data.ev.start) { // event start missed: move the start of the bar to the left
					left = Math.floor((100 * (data.pb.start - data.ev.start)) / data.ev.duration);
				}
				if (data.ev.end > data.pb.end) { // event end is not yet in the pb: move the end of the bar to the right
					right = Math.floor((100 * (data.ev.end - data.pb.end)) / data.ev.duration);
				}

				// where are we in the event?
				pos = Math.floor((100 * (data.pb.current - (data.ev.start - data.pb.start))) / data.ev.duration);

                this._barStartTime.textContent = data.ev.progStartDateText.slice(0, -2);
                this._barStartTime.setAttribute("x-meridiem", data.ev.progStartDateText.slice(-2));
                this._barEndTime.textContent = data.ev.progEndDateText.slice(0, -2);
                this._barEndTime.setAttribute("x-meridiem", data.ev.progEndDateText.slice(-2));

			} else if (data.ev.start === 0) { //vod content
                right = Math.floor(100 * (data.ev.end - right) / data.ev.duration);
				pos = 100 - right;
                this._barStartTime.textContent = data.ev.progStartDateText;
                this._barStartTime.setAttribute("x-meridiem", "");
                this._barEndTime.textContent = data.ev.progEndDateText;
                this._barEndTime.setAttribute("x-meridiem", "");
			}



			if (data.ev.title) {
				this._title.textContent = data.ev.title;
			} else {
				this._title.textContent = "Unknown Event";
			}

			this._barFill.style.left = left + "%";
			this._barFill.style.width = (100 - left - right) + "%";
			this._barPointer.style.left = pos + "%";

		} else if (this._emptyClass) {
			this.classList.add(this._emptyClass);
		}
	}
});
