/**
 * @class app.gui.controls.HtmlList
 *
 * Fixed HTML List with appending/prepending of elements, no selection, no focus, no scrolling
 */

app.gui.controls.HtmlList = function HtmlList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlList, app.gui.controls.HtmlItem);

/**
 * @method createdCallback
 */
app.gui.controls.HtmlList.prototype.createdCallback = function createdCallback () {
  this.logEntry();
  this.superCall();

  // direction of list "Horizontal" or "Vertical"
  this._orientation = "Horizontal";

  // min number of cells added to DOM, if 'undefined': none could be added to the DOM, if there are less items empty cells are added
  this._minItemNb = 0; // 0 is no minimimum

  // the max number of item we keep in memory (limits the size of this._data when we append or prepend)
  this._maxItemNb = 0; // 0 is no maximum

  this._viewWindow = this; // the window of all visible elements

  this._listElem = this.querySelector("#" + this.id + "-List");

  if (this._listElem === null) { // only append if not yet created
    this._listElem = this.ownerDocument.createElement("div"); // the element which contains the cells
    this.appendChild(this._listElem);
  }

  // private variables
  this._itemNb = 0; // total number of elements in the list
  this._data = []; // the data behind the elements (all items)
  this._elems = []; // the DOM elements

  this._delayChange = 0; // time in ms to delay the changed notification, 0 = no delay
  this._delayChangeTimer = null;

  /**
   * prepend an element with given index to the DOM
   * pos is start of element we place this before (end of added element)
   */
  this._prependItem = function (index, pos) {
    var elem = this._elems[index],
      actualPos = pos;

    if (elem) {
      if (!elem.parentElement) { // not yet in DOM: prepend it
        this._listElem.insertBefore(elem, this._listElem.firstChild);
      }
      elem.itemData = this._data[index];

      if (typeof actualPos === "number") {
        actualPos -= elem.outerSize;
        elem.startPos = actualPos;
      }
    }
    return actualPos;
  };

  /**
   * append an element with given index to the DOM
   * pos is end of element we place this after (start of added element)
   */
  this._appendItem = function (index, pos) {
    var elem = this._elems[index],
      actualPos = pos;
    if (elem) {
      if (!elem.parentElement) { // not yet in DOM: append it
        this._listElem.appendChild(elem);
      }
      elem.itemData = this._data[index];

      if (typeof actualPos === "number") {
        elem.startPos = actualPos;
        actualPos += elem.outerSize;
      }
    }
    return actualPos;
  };

  this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlList.prototype.attachedCallback = function attachedCallback () {
  this.logEntry();
  this.superCall();
  if (this.id) {
    this._listElem.id = this.id + "-List";

    this.onControlEvent("append", this._append);
    this.onControlEvent("prepend", this._prepend);
  }
  this.logExit();
};

/**
 * @method _clear
 */
app.gui.controls.HtmlList.prototype._clear = function _clear () {
  this.logEntry();
  this._itemNb = 0;
  this._selectedItem = null;
  this._data = [];
  this._elems = [];
  this._listElem.innerHTML = "";
  this.logExit();
};

/**
 * @method _sort
 * sort the list in a specific order
 */
app.gui.controls.HtmlList.prototype._sort = function _sort () {
  this.logEntry();
  // implement as required
  this.logExit();
};

/**
 * @method _populate
 * simply populate the DOM with all items
 */
app.gui.controls.HtmlList.prototype._populate = function _populate (data) {
  this.logEntry();

  var i, end = 0, elem,
    len = data.length;

  this.fireControlEvent("clear");

  this._itemNb = len; // dont include the empty cells if we have a higher _minItemNb
  this._data = data;

  this._sort(); // sort the data if required

  // check min and max number of items
  for (i = len; i < this._minItemNb; i++) {
    this._data[i] = null;
  }
  if (this._maxItemNb > 0) {
    this._data.splice(this._maxItemNb);
  }

  // add all elements in the DOM (incl empty ones)
  len = data.length;

  for (i = 0; i < len; i++) {
    elem = this.newItem();
    elem.dataset.index = i;
    this._elems[i] = elem;
    end = this._appendItem(i, end);
  }

  this.logExit();
};

/**
 * @method _prepend
 * prepend current elements with given elements
 */
app.gui.controls.HtmlList.prototype._prepend = function _prepend (data) {
  this.logEntry();
  this._data.unshift.apply(this._data, data);
  this._populate(this._data);
  this.logExit();
};

/**
 * @method _append
 * append current elements with given elements
 */
app.gui.controls.HtmlList.prototype._append = function _append (data) {
  this.logEntry();
  this._data.push.apply(this._data, data);
  this._populate(this._data);
  this.logExit();
};

/**
 * @property itemTemplate
 */
o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(app.gui.controls.HtmlList.prototype, 'itemTemplate',  {
  template     : app.gui.controls.HtmlListItem,
  querySelector: ':scope template'
});

/**
 * Gets or sets the orientation of the list.
 *
 * Options are:
 *      'Horizontal' [Default]
 *      'Vertical'
 *
 *     <html-list data-orientation="Horizontal"></html-list>
 *
 * @property orientation
 * @type {String}
 */
o5.gui.controls.Control.definePropertyWithDataAttribute(app.gui.controls.HtmlList.prototype, 'orientation', {
  get: function () {
    return this._orientation;
  },
  set: function (val) {
      if (typeof val === 'string') {
        this._orientation = (val.toLowerCase() === "vertical" ? 'Vertical' : 'Horizontal');

        if (this._orientation === 'Vertical') {
          //this._listElem.style.display = '-webkit-flex';
          //this._listElem.style.webkitFlexDirection = 'column';
          //this._listElem.style.width = '100%';
          //this._listElem.style.height = '';
        } else {
          //this._listElem.style.display = '-webkit-inline-flex';
          //this._listElem.style.webkitFlexDirection = '';
          //this._listElem.style.width = '';
          //this._listElem.style.height = '100%';
        }
      }
  },
  toAttribute: function () {
    return this._orientation;
  },
  fromAttribute: function () {
    return this._orientation;
  }
});

/**
 * @property itemData - current items in the list
 */
Object.defineProperty(app.gui.controls.HtmlList.prototype, "itemData", {
  get: function get () {
    return this._data;
  },
  set: function (data) {
    this._populate(data);
  }
});

/**
 * @property itemNb
 * how many items in the list?
 */
Object.defineProperty(app.gui.controls.HtmlList.prototype, "itemNb", {
  get: function get () {
    return this._itemNb;
  }
});

/**
 * @property itemNb
 * set minimum number of items in the list. If we try to populate with less, empty ones are added
 */
Object.defineProperty(app.gui.controls.HtmlList.prototype, "minItems", {
  get: function () {
    return this._minItemNb;
  },
  set: function (val) {
    this._minItemNb = Number(val);
  }
});

/**
 * @property itemNb
 * set maximum number of items in the list. If we try to populate with more, the number is cut
 */
Object.defineProperty(app.gui.controls.HtmlList.prototype, "maxItems", {
  get: function () {
    return this._maxItemNb;
  },
  set: function (val) {
    this._maxItemNb = Number(val);
  }
});
