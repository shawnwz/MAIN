/**
 * @class app.gui.controls.htmlTabGroup
 */
app.gui.controls.HtmlTabGroup = function HtmlTabGroup () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlTabGroup, app.gui.controls.HtmlFocusItem);  // HtmlFocusList?

/**
 * @method createdCallback
 */
app.gui.controls.HtmlTabGroup.prototype.createdCallback = function createdCallback () {
  this.superCall();

  this._elems = []; // the DOM elements
  this._selectedItem = undefined;

  var children = this.querySelectorAll("app-html-tab"),
    i, len = children.length;

  for (i = 0; i < len; i++) {
    if (children[i]) {
      this._elems.push(children[i]);
    }
  }
  this._itemNb = this._elems.length; // total number of elements in the list

  this._getTab = function (id) {
    var tab = null;

    if (id === "defaultTab" && this.defaultTab) {
      tab = this.defaultTab;
    } else if (id === "activeTab" && this._selectedItem) {
      tab = this._selectedItem;
    } else if (typeof id === "string") {
      // tab = this.querySelector(':scope > app-html-tab[id="' + id + '"]');
      i = this._elems.findIndex(function (elem) {
          return (id && elem.id === id) || (elem.dataset.selector === id);
      });
      tab = this._elems[i];
    } else if (typeof id === "number") {
      tab = this._elems[id];
    }
    return tab;
  };
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlTabGroup.prototype.attachedCallback = function attachedCallback () {
  this.superCall();
  if (this.id) {
    this.onControlEvent("select", this._select);
  }
};

///**
// * Returns the currently active tab, that is, the opened tab which has focus.
// */
//Object.defineProperty(app.gui.controls.HtmlTabGroup, "activeTab", {
//  get: function get () {
//    return this._selectedItem.tabElement;
//  }
//});

/**
 * @property {String} defaultTab
 */
Object.defineProperty(app.gui.controls.HtmlTabGroup, "defaultTab", {
  get: function get () {
    return this._defaultTab.attributes['tab'].value;
  },
  set: function set (id) {
    var tab = this._getTab(id);
    if (tab) {
      this._defaultTab = tab;
    }
  }
});

/**
 * @method _select
 * Select to the given tab, closing all open tabs
 */
app.gui.controls.HtmlTabGroup.prototype._select = function _select(id, args) {
  var i,
    tab = this._getTab(id);

  if (tab) {
    for (i = 0; i < this._elems.length; i++) {
      if (this._elems[i] !== tab && this._elems[i].visible) {
        this._elems[i].fireControlEvent("hide");
      }
    }

    tab._lastArguments = args;
    tab.fireControlEvent("show");
    this._selectedItem = tab;
  }
};

/**
 * @method _focus
 */
app.gui.controls.HtmlTabGroup.prototype._focus = function _focus() {
  this.superCall();

  var tab = this._selectedItem;
  if (tab) {
    tab.fireControlEvent("focus");
  }
};

//app.gui.controls.HtmlTabGroup.prototype.resetFocus = function resetFocus () {
//  var tab;
//
//  for (tab = this.lastElementChild; tab; tab = tab.previousElementSibling) {
//
//    if (!tab.style.display && !tab.style.opacity) {
//      if (tab.tabElement) {
//        tab.tabElement.focus();
//      } else {
//        tab.focus();
//      }
//      break;
//    }
//  }
//};


