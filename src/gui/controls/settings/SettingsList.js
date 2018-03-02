/**
 * @class app.gui.controls.SettingsList
 */

app.gui.controls.SettingsList = function SettingsList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsList, app.gui.controls.HtmlScrollList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsList.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
	this.isScrStateDefault = true;
    this._wrapped = true;
    this.orientation = "vertical";

    this._config = this.dataset.config || null;
    this._configObj = null;

    this.onControlEvent("enter", function(list) {
        var selectedItem = list ? list.selectedItem : null,
            data = selectedItem ? selectedItem.itemData : null;
        if (data) {
            if (data.button) {
                // enter new screen
                //this.fireControlEvent("populate");
            }
        }
    });
  $util.Translations.update(this);
    this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SettingsList.prototype._fetch = function _fetch() {
    this.logEntry();
    var objs = this._config ? this._config.split('.') : [],
      configObj = null,
      footer = null,
      arr,
      footerData = {};

    this.fireControlEvent("clear");

    footer = document.querySelector("#ctaSettingsMenu");
   // footer.classList = [];

    objs.forEach(function(obj) {
        if (configObj) { // concat with previous
            if (configObj[obj]) {
                configObj = configObj[obj];
            }
        } else if (window[obj]) { // first one
            configObj = window[obj];
        }
    });
    if (configObj && configObj.getMenu) {
        footerData.id = this.id;
        $util.ControlEvents.fire("app-settings:ctaSettingsMenu", "fetch", footerData);
        arr = configObj.getMenu();
        this._configObj = configObj;
        this.fireControlEvent("populate", arr);

        if (this.isScrStateDefault && footer._hasId("ctaResetDefaults")) {
        	footer._remove("ctaResetDefaults");
        }
    }
    this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.SettingsList.prototype._populate = function _populate(arr) {
    this.logEntry();
	var tempDefaultValues,
	tempCurrentValues,
	objKey;
    this.superCall(arr);
    this.fireControlEvent("select", 0);
    this.isScrStateDefault = true;
	tempDefaultValues = this._configObj ? this._configObj.defaultitem : {};
	tempCurrentValues = this._configObj ? this._configObj.saveditem : {};
    for (objKey in tempDefaultValues) {
    	 if (tempDefaultValues.hasOwnProperty(objKey)) {
	        if (!(tempDefaultValues[objKey] === tempCurrentValues[objKey])) {
	        	this.isScrStateDefault = false;
	        	break;
	        }
	    }
    }
    this.logExit();
};

/**
 * @method _select
 * @public
 */
app.gui.controls.SettingsList.prototype._select = function _select(item) {
    this.logEntry();

    if (typeof item === "string") { // or move this to HtmlFocusList?
      var elem = this.querySelector("app-settings-list-item[data-id=" + item + "]");
      if (elem) {
          this.selectedItem = elem.itemIndex;
      } else {
        this.superCall(item);
      }
    } else {
        this.superCall(item);
    }

    this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.SettingsList.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false,
        child;

    switch (e.key) {
        case "ArrowRight":
            if (this.selectedItem) {
                if (this.selectedItem && this.selectedItem._data.data.type === "settingsNumericInput") {
                    child = this.selectedItem.querySelector("app-settings-numeric-input");
                    if (child) { // pass on the key
                        child.onkeydown(e, this.selectedItem.itemData.data.get());
                    }
                } else {
                    child = this.selectedItem.querySelector("app-settings-toggle-list");
                    if (child) { // pass on the key
                        child.onkeydown(e);
                        if (this._configObj) {
                            this._configObj.currentitem[child.id.toString().slice(0, -("Action".length))] = child.selectedItem._data.value;
                        }
                    }
                }
            }
            handled = true;
            break;

        case "ArrowLeft":
            if (this.selectedItem) {
                if (this.selectedItem && this.selectedItem._data.data.type === "settingsNumericInput") {
                    child = this.selectedItem.querySelector("app-settings-numeric-input");
                    if (child) { // pass on the key
                        child.onkeydown(e, this.selectedItem.itemData.data.get());
                    }
                } else {
                    child = this.selectedItem.querySelector("app-settings-toggle-list");
                    if (child) { // pass on the key
                        child.onkeydown(e);
                        if (this._configObj) {
                            this._configObj.currentitem[child.id.toString().slice(0, -("Action".length))] = child.selectedItem._data.value;
                        }
                    }
                }

            }
            handled = true;
            break;

        case "Enter":
            if (this.selectedItem) {
                child = this.selectedItem.querySelector("app-settings-button");
                if (child) { // pass on the key
                    child.onkeydown(e);
                }
            }
            handled = true;
            break;

        case "Red":
                this._footer = document.querySelector("#ctaSettingsMenu");
                if (this._footer._hasId("ctaResetDefaults")) {
                    $util.Events.fire(this._configObj.resetDefaults, this._configObj.defaultitem);
                    this._footer._remove("ctaResetDefaults");
                    this.fireControlEvent("populate", this._configObj.getMenu());
                    handled = true;
                } else if (this._footer._hasId("ctaUndoChanges")) {
                    $util.Events.fire(this._configObj.undoChanges, this._configObj.saveditem);
                    this.fireControlEvent("populate", this._configObj.getMenu());
                    this._footer._remove("ctaUndoChanges");
                    if (!this.isScrStateDefault) {
                    	this._footer._add("ctaResetDefaults");
                    }
                    handled = true;
                } else {
                    handled = this.superCall(e);
                }
                break;
         case "Green":
                    handled = this.superCall(e);
                break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "0":
        case ".":
          if (this.selectedItem && this.selectedItem._data.data.type === "settingsNumericInput") {
                child = this.selectedItem.querySelector("app-settings-numeric-input");
                if (child) { // pass on the key
                        child.onkeydown(e, this.selectedItem.itemData.data.get());
                    }
                handled = true;
            }
            break;
        case "ArrowUp":
        case "ArrowDown":
        if (this.selectedItem && this.selectedItem._data.data.type === "settingsNumericInput") {
                child = this.selectedItem.querySelector("app-settings-numeric-input");
                if (child) { // pass on the key
                        child.onkeydown(e, this.selectedItem.itemData.data.get());
                    }
                //handled = true;
            }
            handled = this.superCall(e);
            break;
        default:
            handled = this.superCall(e);
            break;
    }
    if (handled === true) {
        e.stopImmediatePropagation();
    }
    this.logExit();
};

o5.gui.controls.Control.definePropertyWithDataAttribute(app.gui.controls.SettingsList.prototype, 'type',  {
  get: function () {
    return "List";
  }
});


/**
 * @class app.gui.controls.SettingsListItem
 */

app.gui.controls.SettingsListItem = function SettingsListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SettingsListItem.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
    this._focusClass = "focused";
    this._label = this.querySelector('.settingsListLabel');
    this._value = this.querySelector('.settingsListValue');
    this.logExit();
};

/**
 * @property selectable
 */
Object.defineProperty(app.gui.controls.SettingsListItem.prototype, "selectable", {
    get: function get () {
        if (this.classList.length === 0) {
            return true;
        } else if (this._hiddenClass && this.classList.contains(this._hiddenClass)) {
            return false;
        } else if (this._emptyClass && this.classList.contains(this._emptyClass)) {
            return false;
        }
        if (this.classList.contains("unselectable")) {
            return false;
        }
        return true;
    }
});

/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.SettingsListItem.prototype, "itemData", {
    get: function get() {
        return this._data;
    },
    set: function set(data) {
        this._data = data;
        var tmpl, item = null;

        if (data) {
            if (data.text) {
              this._label.innerHTML = $util.Translations.translate(data.text);
              this._label.dataset.i18n = data.text;
            } else {
                this._label.textContent = "";
            }

            tmpl = document.getElementById(data.data.type + "Template");
            if (tmpl) {
                this._value.appendChild(tmpl.content.cloneNode(true));
            }

            if (data.data.type !== "settingsToggle") {
                this.classList.add("noArrows");// only toggle has arrows
            }
            if (data.data.isSelectable === false) {
                this.classList.add("unselectable");
            }
            if (data.data.isTitle === true) {
              this.classList.add("settingsSubTitleLeft");
            }
            if (data.data.isFooter === true) {
              this.classList.add("settingsFooter");
            }
            if (data.data.type === "settingsToggle") {
                item = this.querySelector("app-settings-toggle-list");
            } else if (data.data.type === "settingsButton") {
                item = this.querySelector("app-settings-button");
            } else if (data.data.type === "settingsText") {
                item = this.querySelector("app-settings-text");
              this._value.innerHTML = $util.Translations.translate(data.data.get().text);
              this._value.dataset.i18n = data.data.get().text;
            } else if (data.data.type === "settingsNumericInput") {
                item = this.querySelector("app-settings-numeric-input");
            }

            if (item) {
                item.id = data.id + "Action";

                setTimeout(function() { // give it some time to attach
                    if (item.fireControlEvent) {
                        item.fireControlEvent("show");
                       // item.fireControlEvent("populate", data.data.get(), data.data.getSelectedIndex());
                        if (data.data.type === "settingsNumericInput") {
                           item.fireControlEvent("populate", data);
                        } else if (data.data.type === "settingsToggle") {
                           item.fireControlEvent("populate", data.data.get(), data.data.getSelectedIndex());
                        }
                        if (data.data.events) { // register for change after populate so we only get notified when it actually changes
                            item.onControlEvent("change", function(list) {
                                var selectedItem = list ? list.selectedItem : null,
                                    itemData = selectedItem ? selectedItem.itemData : null;
                                    if (itemData) {
                                        this.ownerDocument.activeElement._configObj.currentitem[data.id] = itemData.value;
                                    }
                                    this._footer = document.querySelector("#ctaSettingsMenu");
                                    if (this._footer._hasId("ctaResetDefaults")) {
                                        this._footer = document.querySelector("#ctaSettingsMenu");
                                        this._footer._remove("ctaResetDefaults");
                                    //document.querySelector("#ctaUndoChanges").children[1].innerHTML = $util.Translations.translate(document.querySelector("#ctaUndoChanges").children[1].attributes.getNamedItem("data-i18n").value);
                                }
                                this._footer._add("ctaUndoChanges");
                                if (itemData) {
                                        data.data.events.forEach(function(ev) {
                                        console.log(ev.name, itemData.value);
                                        $util.Events.fire(ev.name, itemData.value);
                                    });
                                }

                            });
                        }
                    }
                }, 100);
            }

            this.dataset.id = data.id;
        } else {
            this._label.textContent = "item" + this.itemIndex;
            this.dataset.id = "id" + this.itemIndex;
        }
    }
});

/**
 * @method onSelect
 * @public
 */
app.gui.controls.SettingsListItem.prototype._onSelect = function _onSelect() {
    this.logEntry();
    this.superCall();
    var control = this.querySelector('div.control');
    if (control) {
        control.classList.add("control-focused");
    }
    this.logExit();
};

/**
 * @method _onDeselect
 */
app.gui.controls.SettingsListItem.prototype._onDeselect = function _onDeselect() {
    this.logEntry();
    this.superCall();
    var control = this.querySelector('div.control');
    if (control) {
        control.classList.remove("control-focused");
    }
    this.logExit();
};
