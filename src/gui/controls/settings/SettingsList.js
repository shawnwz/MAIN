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
            } else {
                // store all values and go back
                this.fireControlEvent("back");
            }
        }
    });
	$util.Translations.update(this);
    this.logExit();
};

/**
 * @method _onFocus
 * @private
 */
app.gui.controls.SettingsList.prototype._onFocus = function _onFocus() {
    this.logEntry();
    this.superCall();
    this.logExit();
};

/**
 * @method _onBlur
 * @private
 */
app.gui.controls.SettingsList.prototype._onBlur = function _onBlur() {
    this.logEntry();
    this.superCall();
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
      arr;

    this.fireControlEvent("clear");

    footer = document.querySelector("#callToAction");
    footer.classList = [];

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
        arr = configObj.getMenu();
        this.fireControlEvent("populate", arr);
        this._configObj = configObj;
        if (this._configObj.footerClassList) {
            this._configObj.footerClassList.forEach(function(e) {
                footer.classList.add(e);
                document.querySelector("#" + e).children[1].innerHTML = $util.Translations.translate(document.querySelector("#" + e).children[1].attributes.getNamedItem("data-i18n").value);
            });
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
    this.superCall(arr);
    this.fireControlEvent("select", 0);
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
 * @method _change
 */
app.gui.controls.SettingsList.prototype._change = function _change(list) {
    this.logEntry();
    this.superCall(list);
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
                child = this.selectedItem.querySelector("app-settings-toggle-list");
                if (child) { // pass on the key
                    child.onkeydown(e);
                    if (this._configObj) {
                        this._configObj.currentitem[child.id.toString().slice(0, -("Action".length))] = child.selectedItem._data.value;
                    }
                }
            }
            handled = true;
            break;

        case "ArrowLeft":
            if (this.selectedItem) {
                child = this.selectedItem.querySelector("app-settings-toggle-list");
                if (child) { // pass on the key
                    child.onkeydown(e);
                    if (this._configObj) {
                        this._configObj.currentitem[child.id.toString().slice(0, -("Action".length))] = child.selectedItem._data.value;
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
                this._footer = document.querySelector("#callToAction");
                if (this._footer.classList.contains("ctaResetDefaults")) {
                    $util.Events.fire(this._configObj.resetDefaults, this._configObj.defaultitem);
                    this._footer.classList.remove("ctaResetDefaults");
                    this.fireControlEvent("populate", this._configObj.getMenu());
                    handled = true;
                } else if (this._footer.classList.contains("ctaUndoChanges")) {
                    $util.Events.fire(this._configObj.undoChanges, this._configObj.saveditem);
                    this._footer.classList.remove("ctaUndoChanges");
                    this._footer.classList.add("ctaResetDefaults");
                    this.fireControlEvent("populate", this._configObj.getMenu());
                    handled = true;
                } else if (this._footer.classList.contains("ctaTCPIPSettings")) {
					$util.ControlEvents.fire(":tcpIPConfigDialog", "show");
					setTimeout(function() {
						$util.ControlEvents.fire(":tcpIPConfigDialog", "setIndex", 0);
					}, 70);

	                handled = true;
                } else {
                    handled = this.superCall(e);
                }
                break;
         case "Green":
                this._footer = document.querySelector("#callToAction");
                if (this._footer.classList.contains("ctaRenewDHCP")) { //under-Implementation. helps to generate dynamic ip to enable the testing on STB
					$util.Events.fire("setDhcpStatus", true);
					$util.ControlEvents.fire("app-settings:settingsDHCPRenewal", "show", $util.constants.INTERNET_STATUS_OVERLAY_dISPLAY_MODE.DHCP);
                    handled = true;
               } else {
                    handled = this.superCall(e);
                }
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

o5.gui.controls.Control.definePropertyWithDataAttribute(app.gui.controls.SettingsList.prototype, 'type',	{
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
            }

            if (item) {
                item.id = data.id + "Action";

                setTimeout(function() { // give it some time to attach
                    if (item.fireControlEvent) {
                        item.fireControlEvent("show");
                        item.fireControlEvent("populate", data.data.get(), data.data.getSelectedIndex());

                        if (data.data.events) { // register for change after populate so we only get notified when it actually changes
                            item.onControlEvent("change", function(list) {
                                var selectedItem = list ? list.selectedItem : null,
                                    itemData = selectedItem ? selectedItem.itemData : null;
                                    this.ownerDocument.activeElement._configObj.currentitem[data.id] = itemData.value;
                                    if (this.ownerDocument.activeElement._configObj.footerClassList.indexOf("ctaResetDefaults") !== -1) {
                                    this._footer = document.querySelector("#callToAction");
                                    this._footer.classList.remove("ctaResetDefaults");
                                    this._footer.classList.add("ctaUndoChanges");
                                    document.querySelector("#ctaUndoChanges").children[1].innerHTML = $util.Translations.translate(document.querySelector("#ctaUndoChanges").children[1].attributes.getNamedItem("data-i18n").value);
                                }
                                data.data.events.forEach(function(ev) {
                                    console.log(ev.name, itemData.value);
                                    $util.Events.fire(ev.name, itemData.value);
                                });
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
