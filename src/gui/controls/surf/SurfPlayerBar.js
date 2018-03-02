/**
 * @class app.gui.controls.SurfPlayerBar
 */

app.gui.controls.SurfPlayerBar = function SurfPlayerBar() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SurfPlayerBar, app.gui.controls.HtmlItem);

app.gui.controls.SurfPlayerBar.prototype.createdCallback = function createdCallback() {
//  this.logEntry();
  this.superCall();

  this._title = this.querySelector(".title");
  this._status = this.querySelector("#surfScanPlayerStatus");
  this._barFill = this.querySelector("#surfScanFill");
  this._barPointer = this.querySelector("#surfScanPlayIndicator");
  this._currentContent = null;

    $util.ControlEvents.on("app-video", "channelChanged", function(data) {
        this._currentContent = data;
    }, this);
//  $util.ControlEvents.on("app-surf:surfFutureEventsList", "show", function (ctrl) {
//    this.fireControlEvent("hide");
//  }, this);
//  $util.ControlEvents.on("app-surf:surfFutureEventsList", "hide", function (ctrl) {
//    this.fireControlEvent("show");
//  }, this);

//  this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SurfPlayerBar.prototype._fetch = function _fetch() {
  var me = this,
    service,
    fetchTime = Date.now();

  service = this._currentContent;

  if (service) {
    $service.EPG.Event.byCount(service, fetchTime, 1, true)
      .then(function(ev) {
        me.fireControlEvent("populate", ev[0] || null);
      });
  }
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SurfPlayerBar.prototype, "itemData", {
  get: function get() {
    return this._data;
  },
  set: function set(data) {
    this._data = data;

    this._title.textContent = data.title;

    if (data.pb && data.pb.contentLength > 0) {
//      var left = 0,
//        right = 0,
//        pos = 0;
//
//      if (data.ev.start > 0 && data.ev.end > 0) {
//
//        if (data.pb.start > data.ev.start) { // event start missed: move the start of the bar to the left
//          left = Math.floor((100 * (data.pb.start - data.ev.start)) / data.ev.duration);
//        }
//        if (data.ev.end > data.pb.end) { // event end is not yet in the pb: move the end of the bar to the right
//          right = Math.floor((100 * (data.ev.end - data.pb.end)) / data.ev.duration);
//        }
//
//        // where are we in the event?
//        pos = Math.floor((100 * (data.pb.current - (data.ev.start - data.pb.start))) / data.ev.duration);
//
//        this._barStartTime.textContent = data.ev.progStartDateText.slice(0,-2);
//        this._barStartTime.setAttribute("x-meridiem", data.ev.progStartDateText.slice(-2));
//
//        this._barEndTime.textContent = data.ev.progEndDateText.slice(0,-2);
//        this._barEndTime.setAttribute("x-meridiem", data.ev.progEndDateText.slice(-2));
//      }
//
//      if (data.ev.title) {
//        this._title.textContent = data.ev.title;
//      } else {
//        this._title.textContent = "Unknown Event";
//      }
//
//      this._barFill.style.left = left+"%";
//      this._barFill.style.width = (100-left-right)+"%";
//      this._barPointer.style.left = pos+"%";

    } else if (this._emptyClass) {
      this.classList.add(this._emptyClass);
    }
  }
});
