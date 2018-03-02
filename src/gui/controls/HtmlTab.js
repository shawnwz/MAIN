/**
 * @class app.gui.controls.HtmlTab
 */
app.gui.controls.HtmlTab = function HtmlTab () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlTab, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 */
app.gui.controls.HtmlTab.prototype.createdCallback = function createdCallback () {
    this.superCall();

    this._isLoaded = false;
    this._elem = null;

    this.style.willChange = 'contents';

    this._parent = this.parentControl; // the tabGroup containing this item
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlTab.prototype.attachedCallback = function attachedCallback () {
  this.superCall();

    // load the tab's contents from the actual html document
  if (!this._isLoaded) {
    var me = this;

    this._xhttp = new XMLHttpRequest();
    this._xhttp.open("GET", this.dataset.src, true);
    this._xhttp.responseType = "document";

    this._xhttp.onload = function onload () {
      if ((this.status === 200 || this.status === 0)) {
        me._onHTMLLoaded(this.responseXML);
      } else {
        this.logError(String(this.status) + " --- " + this.responseText);
      }
    };
    this._xhttp.send();
  }
};

/**
 * @method _onFocus
 */
app.gui.controls.HtmlTab.prototype._onFocus = function _onFocus (e) {
    this.superCall();

    if (this._elem) {
        e.preventDefault();
        e.stopImmediatePropagation();
        this._elem.focus();
    }
};

/**
 * @method _show
 */
app.gui.controls.HtmlTab.prototype._show = function _show () {
  this.superCall();

  if (this._elem)    {
    var elem = this._elem.querySelector('[autofocus]');
    if (elem) {
        elem.focus();
    }

    if (this._elem.onshow) {
        this._elem.onshow();
    }
  }
};

/**
 * @method _hide
 */
app.gui.controls.HtmlTab.prototype._hide = function _hide () {
  this.superCall();

  if (document.activeElement === this) {
    this._parent.resetFocus();
  }

  if (this._elem)    {
    if (this._elem.onhide) {
      this._elem.onhide();
    }
  }
};

/**
 * @method addHTMLToDOM
 * Loads the children of given HTML element into the target element
 */
app.gui.controls.HtmlTab.prototype.addHTMLToDOM = function addHTMLToDOM (HTMLToImport) {
  var o = HTMLToImport && HTMLToImport.firstElementChild;

  if (o) {
    do {
      this.appendChild(o);
      o = HTMLToImport.firstElementChild;
    }
    while (o);
  }
};

/**
 * Sequentially processes all sibling of the element passed into the function via 'element' argument
 * For every <script> and <link> tag, will create corresponding objects and add them into document.head
 * synchronously. The <script> tags containing 'async' attribute will loaded asynchronously.
 * @method _processHeadElement
 * @private
 * @param {HTMLElement} doc The source document for this tab
 * @param {HTMLElement} element The element to process
 */
app.gui.controls.HtmlTab.prototype._processHeadElement = function _processHeadElement (doc, element) {
    var onLoadedAndContinue = function onLoadedAndContinue (e) {
        if (e.target._callback) {
            e.target._callback();
        }
        if (element.nextElementSibling) {
            this._processHeadElement(doc, element.nextElementSibling);
        } else {
            this._onHTMLLoaded2(doc);
        }
    }.bind(this);

    var onLoadErrorAndContinue = function onLoadErrorAndContinue (/* errUrl */) {
        if (element.nextElementSibling) {
            this._processHeadElement(doc, element.nextElementSibling);
        } else {
            this._onHTMLLoaded2(doc);
        }
    };

    switch (element.tagName) {
        case "LINK":
            var linkObj = element.cloneNode(true);

            linkObj.href = element.href; //this prevents resetting path to relative after insertion
            linkObj.dataset.tab = this.id; //id may not be set, could do this differently
            linkObj.onload = onLoadedAndContinue.bind(this);
            linkObj.onerror = onLoadErrorAndContinue.bind(this, element.href);

            if (linkObj.rel === 'stylesheet') {
                linkObj._callback = function () {
                    o5.gui._cssExt.processStyleSheet(this.sheet);
                };
            }

            document.head.appendChild(linkObj);
            break;

        case "SCRIPT":
            var scriptObj = document.createElement("script");

            scriptObj.src = element.src;
            scriptObj.dataset.tab = this.id;//id may not be set, could do this differently

            if (element.async) {
                scriptObj.async = element.async;
                document.head.appendChild(scriptObj);
                onLoadedAndContinue.bind(this)();
            } else {
                scriptObj.onload = onLoadedAndContinue.bind(this);
                scriptObj.onerror = onLoadErrorAndContinue.bind(this, element.src);
                document.head.appendChild(scriptObj);
            }
            break;

        default:
            if (element.nextElementSibling) {
                this._processHeadElement(doc, element.nextElementSibling);
            } else {
                this._onHTMLLoaded2(doc);
            }
            break;
    }
};

/**
 * Imports <script> and <link> tags from an element into <head> element of the DOM
 * @method addStyleSheetsAndScripts
 * @private
 * @param {HTMLElement} tab Tab element that will contain imported HTML of the Tab
 * @param {HTMLElement} importHead document.head element
 * @param {Function...} callback callback to be called when all <script> and <link> tags are loaded
 *                      except for the <script> tag using 'async' attribute
 */
app.gui.controls.HtmlTab.prototype._onHTMLLoaded = function _onHTMLLoaded (doc) {
    if (doc.head.firstElementChild) {
        this._processHeadElement(doc, doc.head.firstElementChild);
    } else {
        this._onHTMLLoaded2(doc);
    }
};

app.gui.controls.HtmlTab.prototype._onHTMLLoaded2 = function _onHTMLLoaded2 (doc) {
    if (doc.body.firstElementChild) {
        if (!o5.gui.controls.Control._controls.some((function (control) {
            if (doc.body.firstElementChild.localName === control.tagName) {
                this.addHTMLToDOM(doc.body);
                this._isLoaded = true;
                this._elem = this.firstElementChild;
                return true;
            }
        }).bind(this))) {
            //did not find a custom tab, import body as is
            this.addHTMLToDOM(doc.body);
        }
    }

    this._elem.tab = this;

    setTimeout((function () {
        // execute 'onload' for this tab
        if (doc.body.attributes.onload) {
            setTimeout(doc.body.attributes.onload.value, 1);
        }
        if (this._elem.onload) {
            this._elem.onload();
        }
        this._hide(); // hide after load
    }).bind(this), 1);

    if (document.activeElement === this) {
        this._elem.focus();
    }
};


