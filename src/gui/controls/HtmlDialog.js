/**
 * @class app.gui.controls.HtmlDialog
 */

app.gui.controls.HtmlDialog = function HtmlDialog () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlDialog, app.gui.controls.HtmlFocusItem);

app.gui.controls.HtmlDialog.prototype.createdCallback = function createdCallback () {
//  this.logEntry();
  this.superCall();

  this._timeOut = null;
  this._dialogContainer = null;

  this._visibleClass = "show-dialog";
//  this._overlayClass = "overlay";

//  this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlDialog.prototype.attachedCallback = function attachedCallback () {
//  this.logEntry();
  this.superCall();
  if (this.id) {
    this.onControlEvent("store", this._store);
  }
//  this.logExit();
};

/**
 * @method _store
 */
app.gui.controls.HtmlDialog.prototype._store = function _store () {
  this.logEntry();
  if (this._dialogContainer) {
    this._dialogContainer.fireControlEvent("store");
  }
  this.logExit();
};

/**
 * @method _clear
 */
app.gui.controls.HtmlDialog.prototype._clear = function _clear () {
  this.logEntry();
  if (this._dialogContainer) {
    this._dialogContainer.remove();
    this._dialogContainer = null;
  }
  this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.HtmlDialog.prototype._show = function _show (list, callback) { //'list' parameter is for some dynamic content in dialog
  this.logEntry();
//  this._timeOut = setTimeout(this._onTimeOut, 3000);
  this.fireControlEvent("clear");

  this._dialogContainer = this.newItem();
  this._dialogContainer.style.display = "block";

  this.appendChild(this._dialogContainer);

  var me = this;
  setTimeout(function () { // give it some time for the controls to attach
        me.parentElement.classList.add("show");
    me._dialogContainer.fireControlEvent("populate", list, callback);
    me._dialogContainer.fireControlEvent("focus");
  }, 50);

  this.superCall();
  this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.HtmlDialog.prototype._hide = function _hide () {
  this.logEntry();
  clearTimeout(this._timeOut);
  this.parentElement.classList.remove("show");
  this._dialogContainer.fireControlEvent("hide");
  this.fireControlEvent("clear");
  this.superCall();
  if (this._lastElem) { // reset focus
    this._lastElem.focus();
  }
  this.logExit();
};

/**
 * @property itemTemplate
 */
o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(app.gui.controls.HtmlDialog.prototype, 'itemTemplate',  {
  template     : app.gui.controls.HtmlDialogContainer,
  querySelector: ':scope template'
});

/**
 * @method _onKeyDown
 */
app.gui.controls.HtmlDialog.prototype._onKeyDown = function _onKeyDown (e) {
  this.logEntry();
  var handled = false;

  clearTimeout(this._timeOut);
  this._timeOut = setTimeout(this._onTimeOut, 3000); // kick on each keypress

  switch (e.key) {
    case "Back":
    case "Exit":
      this.fireControlEvent("hide");
      handled = true;
      break;

    case "Ok":
    case "Enter":
      this.fireControlEvent("store");
      this.fireControlEvent("hide");
      handled = true;
      break;

	case "Guide":
	case "Settings":
	case "Home":
	case "Menu":
	case "Active":
	case "Search":
    case "Help":
	case "ThemeSwap":
	case "Power":
    case "Surf":
    case "Foxtel":
    case "DVR":
	   this.fireControlEvent("hide");
	   break;
    default:
      break;
  }

  if (handled === true) {
    e.stopImmediatePropagation();
  }
  this.logExit();
};

///**
// * @class app.gui.controls.HtmlDialogBody
// */
//
//app.gui.controls.HtmlDialogBody = function HtmlDialogBody() {};
//o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlDialogBody);
//
//app.gui.controls.HtmlDialogBody.prototype.createdCallback = function createdCallback() {
////  this.logEntry();
//  this.superCall();
//
//  var wrapElem = this.ownerDocument.createElement("div");
//  wrapElem.className = "dialogTitleWrap";
//
//  this._titleElem = this.ownerDocument.createElement("div");
//  this._titleElem.className = "dialogTitle";
//  wrapElem.appendChild(this._titleElem);
//
//  this._textElem = this.ownerDocument.createElement("div");
//  this._textElem.className = "dialogText";
//  wrapElem.appendChild(this._textElem);
//
//  this.appendChild(wrapElem);
//
//  this._listElem = this.ownerDocument.createElement("div");
//  this._listElem.className = "list";
//  this.appendChild(this._listElem);
//
//  this._titleElem.dataset.i18n = this.dataset.i18n;
//
////  this.logExit();
//};
//
///**
// * @class app.gui.controls.HtmlDialogCta
// */
//
//app.gui.controls.HtmlDialogCta = function HtmlDialogCta() {};
//o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlDialogCta);
//
//app.gui.controls.HtmlDialogCta.prototype.createdCallback = function createdCallback() {
////  this.logEntry();
//  this.superCall();
///*
//  <div class="dialogCta">
//    <span>
//      <span class="btnBack"></span>
//      <span data-i18n="callToActionExit"></span>
//    </span>
//    <span id="otherTimesRecord">
//      <span class="btnRecord"></span>
//      <span data-i18n="callToActionRecord"></span>
//    </span>
//  </div>
//*/
//  var wrapElem = this.ownerDocument.createElement("div");
//  wrapElem.className = "dialogCta";
//
//
////  this.logExit();
//};
//
