/**
 * @class app.gui.controls.Keyboard
 */

app.gui.controls.Keyboard = function Keyboard() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.Keyboard, app.gui.controls.HtmlFocusItem);


/**
 * @method createdCallback
 */
app.gui.controls.Keyboard.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
    this._keyBoardTitle = this.querySelector("#keyboardTitle");
    this._keyBoardGrid = this.querySelector("app-keyboard-grid");
    this._keyInputBox = this.querySelector("#foxtelKeyboardInput");
    this._passwordCtaText = this.querySelector("#ctaShowPassword .btnText");
    this._keyboardInstruction = this.querySelector("#keyboardInstruction");
    this._keyboardCta = this.querySelector("#keyboardCta");
    this._isCapsEnable = false;
    $util.Translations.update();
    this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.Keyboard.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    this.superCall();

    $util.ControlEvents.on(":keyboardGrid", "enter", function (list) {
        var selectedItem = list ? list.selectedItem : null,
            data = selectedItem ? selectedItem.itemData : null,
            keytype;
        if (data) {
            switch (data.type) {
                case "text":
                case "space":
                    this._keyInputBox.fireControlEvent("insertChar", data.value);
                    break;
                case "caps":
                    if (this._keyBoardGrid.keyType === "abc") {
                        keytype = "ABC";
                        this._isCapsEnable = true;
                    } else if (this._keyBoardGrid.keyType === "ABC") {
                        keytype = "abc";
                        this._isCapsEnable = false;
                    }
                    if (keytype) {
                        this._keyBoardGrid.fireControlEvent("populate", keytype);
                        this._keyBoardGrid.fireControlEvent("select", 5, 1);
                    }
                    break;
                case "numbers":
                    this._keyBoardGrid.fireControlEvent("populate", "123");
                    this._keyBoardGrid.fireControlEvent("select", 6, 0);
                break;
                case "letters":
                    keytype = (this._isCapsEnable) ? "ABC" : "abc";
                    this._keyBoardGrid.fireControlEvent("populate", keytype);
                    this._keyBoardGrid.fireControlEvent("select", 5, 0);
                    break;
                case "symbols":
                    this._keyBoardGrid.fireControlEvent("populate", "#+=");
                    this._keyBoardGrid.fireControlEvent("select", 5, 0);
                    break;
                case "arrowLeft":
                    this._keyInputBox.fireControlEvent("moveCaretLeft");
                    break;
                case "arrowRight":
                    this._keyInputBox.fireControlEvent("moveCaretRight");
                    break;
                case "delete":
                    this._keyInputBox.fireControlEvent("removeChar");
                    break;
                case "done":
                    $util.Events.fire("keyboard:done", this._keyInputBox.itemData);
                    this.fireControlEvent("hide");
                    break;
                default:
                    break;
            }
        }
    }, this);

    this.logExit();
};

/**
 * @method _populate
 * @private
 * @ configData {Object} to configure keyboard
 */

app.gui.controls.Keyboard.prototype._populate = function _populate(configData) {
    this.logEntry();
    this.superCall();
    if (configData) {
        if (configData.title) {
            this._keyBoardTitle.textContent = $util.Translations.translate(configData.title);
            this._keyBoardTitle.dataset.i18n = configData.title;
        }
        if (configData.instruction) {
            this._keyboardInstruction.textContent = $util.Translations.translate(configData.instruction);
            this._keyboardInstruction.dataset.i18n = configData.instruction;
        }
        if (configData.ctaClass) {
            this._keyboardCta.className = configData.ctaClass;
        }
    }
    this._keyBoardGrid.fireControlEvent("populate");
    this.logExit();
};

/**
 * @method _hide
 * @private
 */
app.gui.controls.Keyboard.prototype._hide = function _hide() {
    this.logEntry();
    this.superCall();
    if (this._lastElem) { // reset focus
        this._lastElem.focus();
    }
    this._keyInputBox.fireControlEvent("clear");
    if (this._passwordCtaText.dataset.i18n === "callToActionHidePassword") {
        this._passwordCtaText.dataset.i18n = "callToActionShowPassword";
        this._passwordCtaText.innerHTML = $util.Translations.translate("callToActionShowPassword");
    }
    this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.Keyboard.prototype._focus = function _focus () {
    this.logEntry();
    this.superCall();
    this._keyBoardGrid.fireControlEvent("select", 0, 0);
    this._keyInputBox.fireControlEvent("focus");
    this.logExit();
};

/**
 * @method _togglePassword
 */
app.gui.controls.Keyboard.prototype._togglePassword = function _togglePassword () {
    if (this._passwordCtaText.dataset.i18n === "callToActionHidePassword") {
        this._passwordCtaText.dataset.i18n = "callToActionShowPassword";
        this._passwordCtaText.innerHTML = $util.Translations.translate("callToActionShowPassword");
        this._keyInputBox.fireControlEvent("mask", true);
    } else if (this._passwordCtaText.dataset.i18n === "callToActionShowPassword") {
        this._passwordCtaText.dataset.i18n = "callToActionHidePassword";
        this._passwordCtaText.innerHTML = $util.Translations.translate("callToActionHidePassword");
        this._keyInputBox.fireControlEvent("mask", false);
    }
};

/**
 * @method _toggleKeyboard
 */
app.gui.controls.Keyboard.prototype._toggleKeyboard = function _toggleKeyboard () {
    var keyboardType = this._keyBoardGrid.keyType,
        keyType;
    switch (keyboardType) {
        case "ABC":
             this._keyBoardGrid.fireControlEvent("populate", "123");
             this._keyBoardGrid.fireControlEvent("select", 0, 0);
            break;
        case "abc":
            this._keyBoardGrid.fireControlEvent("populate", "123");
            this._keyBoardGrid.fireControlEvent("select", 0, 0);
            break;
        case "123":
            this._keyBoardGrid.fireControlEvent("populate", "#+=");
            this._keyBoardGrid.fireControlEvent("select", 0, 0);
            break;
        case "#+=":
            keyType = (this._isCapsEnable) ? "ABC" : "abc";
            this._keyBoardGrid.fireControlEvent("populate", keyType);
            this._keyBoardGrid.fireControlEvent("select", 0, 0);
            break;
        default:
            break;
    }
};

/**
 * @method _onKeyDown
 */
app.gui.controls.Keyboard.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    switch (e.key) {
        case "Back":
            this.fireControlEvent("hide");
            e.stopImmediatePropagation();
            break;
        case "ArrowDown":
        case "ArrowUp":
        case "ArrowLeft":
        case "ArrowRight":
        case "Ok":
        case "Enter":
            this._keyBoardGrid._onKeyDown(e);
            break;
        case "Green":
            this._togglePassword();
            break;
        case "Blue":
            this._toggleKeyboard();
            break;
        case "Yellow":
            this._keyInputBox.fireControlEvent("removeChar");
            break;
        default:
            break;
    }
    this.logExit();
};
