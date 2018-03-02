/**
 * @class app.gui.controls.SettingsNumericInput
 */

app.gui.controls.SettingsNumericInput = function SettingsNumericInput () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsNumericInput, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 */
app.gui.controls.SettingsNumericInput.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._visibleClass = "show";
    this._inputText = this.querySelector(".inputText");
    this._isEditable = true;
    this._isInEditMode = false;
    this._data = null;
    this._defaultValue = "0";
    this.logExit();
    };

/**
 * @method createdCallback
 */
app.gui.controls.SettingsNumericInput.prototype._populate = function _populate(data) {
    this.logEntry();
    this.itemData = data;
    this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SettingsNumericInput.prototype, "isEditable", {
    get: function get () {
        return this._isEditable;
    },
    set: function set (isEdit) {
        this._isEditable = isEdit;
    }
});

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SettingsNumericInput.prototype, "itemData", {
    get: function get() {
        return this._data;
    },
    set: function set(data) {
        this._data = data;
        this._inputText.textContent = data.data.get();
    }
});

/**
 * @method createdCallback
 */
app.gui.controls.SettingsNumericInput.prototype._setData = function _setData(data) {
    this.logEntry();
    this._data = data;
    this.logExit();
};

/**
 * @method _editText
 */
app.gui.controls.SettingsNumericInput.prototype._editText = function _editText(str) {
    this.logEntry();

    /*if (this._isDataLimitReached()) { // if data limit is reached, then clear the text so that user can enter the data again.
        this._clearText();
    }*/
    var me = this;
    if (this._isInEditMode) {
        if (str === "-1") {
            this._inputText.textContent = this._inputText.textContent.substr(0, this._inputText.textContent.length - 1);
        } else if (this._inputText.textContent.length < this._data.data.textLength) {
            if (str === '.') {
                    if (this._data.data.dotAt === this._inputText.textContent.length + 1) {
                        this._inputText.textContent = this._inputText.textContent + str;
                    }
            } else {
                this._inputText.textContent = this._inputText.textContent + str;
                if (this._data.data.dotAt === this._inputText.textContent.length + 1) {
                    this._inputText.textContent = this._inputText.textContent + ".";
                }
            }

        }
        this._data.data.events.forEach(function(ev) {
                                        //console.log(ev.name, itemData.value);
                                        $util.Events.fire(ev.name, me._inputText.textContent);
                                    });
    }
    this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.SettingsNumericInput.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var isHandle = false;

    switch (e.key) {
        case "Back":
            break;
        case "Ok":
        case "Enter":
        case "ArrowDown":
        case "ArrowUp":
           this._isInEditMode = false;
            break;
        case "ArrowRight":
            if (this._isInEditMode === false) {
                this._inputText.textContent = "";
                this._isInEditMode = true;
                this.fireControlEvent("change", this);
            }
            this._editText(".");
            isHandle = true;
            break;
        case "ArrowLeft":
            if (this._isInEditMode === false) {
                this._inputText.textContent = "";
                this._isInEditMode = true;
                this.fireControlEvent("change", this);
            }
            this._editText("-1");
            isHandle = true;
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
            if (this._isInEditMode === false) {
                this._inputText.textContent = "";
                this._isInEditMode = true;
                this.fireControlEvent("change", this);
            }
            this._editText(e.key);
            isHandle = true;
            break;
        default:
            break;
    }
    return isHandle;
};
