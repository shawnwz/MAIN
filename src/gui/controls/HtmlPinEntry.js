/**
 * @class app.gui.controls.HtmlPinEntry
 */

app.gui.controls.HtmlPinEntry = function HtmlPinEntry() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlPinEntry, app.gui.controls.HtmlFocusItem);

app.gui.controls.HtmlPinEntry.prototype.createdCallback = function createdCallback() {
//  this.logEntry();

  this.superCall();

  this._digitsNb = parseInt(this.dataset.digitsnb) || 4;
  this._pinDigitElem = [];
  this._data = "";

  this.hiddenClass = "pinEntry-hidden";

  this._fixed = this.classList.contains("pinEntry-correct");

  var i, len = this._digitsNb,
    wrapper, status;

  for (i = 0; i < len; i++) {
    wrapper = document.createElement("div");
    wrapper.className = "pinEntry pinDigit" + i;

    this._pinDigitElem[i] = document.createElement("span");
    this._pinDigitElem[i].className = "pinEntry-digit-" + i;

    status = document.createElement("div");
    status.className = "statusField";

    wrapper.appendChild(this._pinDigitElem[i]);
    wrapper.appendChild(status);
    this.appendChild(wrapper);
  }

//  this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlPinEntry.prototype.attachedCallback = function attachedCallback() {
//  this.logEntry();
  this.superCall();

  this.onControlEvent("correct", function() {
    this._fixed = true;
    this.classList.remove("pinEntry-clear");
    this.classList.remove("pinEntry-incorrect");
    this.classList.remove("pinEntry-hidden");
    this.classList.add("pinEntry-correct");
  });
  this.onControlEvent("incorrect", function() {
    this.classList.remove("pinEntry-clear");
    this.classList.add("pinEntry-incorrect");
    this.classList.remove("pinEntry-hidden");
    this.classList.remove("pinEntry-correct");
  });
  this.onControlEvent("blocked", function() {
    this._hide();
  });

  this.itemData = this.dataset.entry || ""; // prepopulate or blank

//  this.logExit();
};

/**
 * @method _clear
 */
app.gui.controls.HtmlPinEntry.prototype._clear = function _clear() {
  this.logEntry();
  this.itemData = "";
  this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.HtmlPinEntry.prototype._show = function _show() {
  this.logEntry();
  this.fireControlEvent("clear");
  this.superCall();
  this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.HtmlPinEntry.prototype._hide = function _hide() {
  this.logEntry();
  this.superCall();
  this.classList.remove("pinEntry-clear");
  this.classList.remove("pinEntry-incorrect");
  this.classList.add("pinEntry-hidden");
  this.classList.remove("pinEntry-correct");
  this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.HtmlPinEntry.prototype, "itemData", {
  get: function get() {
    return this._data;
  },
  set: function set(data) {
    if (this._data !== data) {
      this._data = data;

      var i, len = this._data.length;

      for (i = 0; i < len && i < this._digitsNb; i++) {
        this._pinDigitElem[i].textContent = "*";
      }
      for (i = len; i < this._digitsNb; i++) {
        this._pinDigitElem[i].textContent = "";
      }

      if (!this._fixed) {
        if (this.parentControl) {
          this.parentControl.fireControlEvent("change", this);
        }
        if (len < this._digitsNb) {
          this.classList.add("pinEntry-clear");
          this.classList.remove("pinEntry-incorrect");
          this.classList.remove("pinEntry-hidden");
          this.classList.remove("pinEntry-correct");
        }
      }
    }
  }
});

/**
 * @method _onKeyDown
 */
app.gui.controls.HtmlPinEntry.prototype._onKeyDown = function _onKeyDown(e) {
  this.logEntry();
  var pinEntry = this.itemData,
    len = pinEntry.length;

  if (this._fixed) {
    return; // dont handle any keys
  }

  switch (e.key) {
    case "Back":
      if (len > 0) { // some entries: clears
        this.fireControlEvent("clear");
        e.stopImmediatePropagation();
      }
      break;
    case "ArrowLeft":
      if (len > 0) {
        this.itemData = pinEntry.substring(0, len - 1);
      }
      e.stopImmediatePropagation();
      break;
    case "Ok":
    case "Enter":
      //this.parentControl.fireControlEvent("verify", this); Commented as fix for FAPUI-1719
      e.stopImmediatePropagation();
      break;
    default:
      if (e.key >= '0' && e.key <= '9') {
        if (this.classList.contains("pinEntry-incorrect")) { // reset
          pinEntry = "";
          len = 0;
        }
        if (len < this._digitsNb) {
          this.itemData = pinEntry + e.key;
          len++;
          if (this.parentControl && len === this._digitsNb) {
            this.parentControl.fireControlEvent("verify", this);
          }
        }
        e.stopImmediatePropagation();
      }
      break;
  }


  this.logExit();
};

