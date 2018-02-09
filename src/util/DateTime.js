/**
 * @class DateTime
 */
$util.DateTime = (function () {
	"use strict";

	function _getFormattedDate(ts) {
		var date = new Date(ts),
			d = date.getDate(),
			m = date.getMonth() + 1,
			y = date.getFullYear();

		return date.getTime() > 0 ? { day: d, month: m, year: y } : null;
	}

	return {

		// e.g. Monday - 09 November
		dateText: function (ts) {
			var weekDay = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
				months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
				date = new Date(ts),
				dy = date.getDay(),
				d = date.getDate(),
				m = date.getMonth();

			return weekDay[dy] + ' - ' + d + ' ' + months[m];
		},

		// e.g. Mon 13 Apr
		dateTextShort: function (ts) {
			var weekDay = [ "Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat" ],
				months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ],
				date = new Date(ts),
				dy = date.getDay(),
				d = date.getDate(),
				m = date.getMonth();

			return weekDay[dy] + ' ' + d + ' ' + months[m];
		},

		// e.g. Mon
		weekDayTextShort: function (ts) {
			var weekDay = [ "Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat" ],
				date = new Date(ts),
				dy = date.getDay();

			return weekDay[dy];
		},

		// e.g. Mon 09
		dayText: function (ts) {
			var weekDay = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
				date = new Date(ts),
				dy = date.getDay(),
				d = date.getDate(),
				text = "";

			if (d < 10) {
				text = weekDay[dy] + ' 0' + d;
			} else {
				text = weekDay[dy] + ' ' + d;
			}
			return text;
		},

		// e.g. 11:08AM
		timeText: function (ts) {
			var time = ts,
				obj;
			if (typeof time === "string") {
				time = parseInt(time, 10);
			}
			obj = this.timeObject(time);
			if (obj && obj.mins < 10) {
				obj.mins = "0" + obj.mins;
			}
			return obj ? (obj.hours + ":" + obj.mins + obj.meridiem) : "";
		},

		// e.g. { "hours": 11, "mins": 8, "meridiem": "AM"}
		timeObject: function (ts) {
			var date = new Date(ts),
				hours = date.getHours(),
				mins = date.getMinutes(),
				ampm = "AM";

			if (hours > 11) {
				hours -= 12; // convert 24 to 12 hr
				ampm = "PM";
			} else {
				ampm = "AM";
			}
			if (hours === 0) {
				hours = 12; // noon or midnight
			}
			return { "hours": hours, "mins": mins, "meridiem": ampm };
		},

		isSameDay: function (ts1, ts2) {
			var date1 = _getFormattedDate(ts1),
				date2 = _getFormattedDate(ts2);

			return (date1 !== null &&
							date2 !== null &&
							date1.day   === date2.day &&
							date1.month === date2.month &&
							date1.year  === date2.year);
		},

		isYesterday: function (ts) {
			return this.isSameDay(ts, new Date(Date.now() - 86400000).getTime());
		},

		isToday: function (ts) {
			return this.isSameDay(ts, Date.now());
		},

		isTomorrow: function (ts) {
			return this.isSameDay(ts, new Date(Date.now() + 86400000).getTime());
		}

	};
}());
