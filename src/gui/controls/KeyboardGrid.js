/**
 * @class app.gui.controls.KeyboardGrid
 */

app.gui.controls.KeyboardGrid = function KeyboardGrid () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.KeyboardGrid, app.gui.controls.HtmlGrid);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.KeyboardGrid.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._keyType = "abc";
    this._focusClass = "focused";

    this._keyArrays = {
        "abc": [ [ { type: 'text', value: 'a' }, { type: 'text', value: 'b' }, { type: 'text', value: 'c' }, { type: 'text', value: 'd' }, { type: 'text', value: 'e' } ],
                 [ { type: 'text', value: 'f' }, { type: 'text', value: 'g' }, { type: 'text', value: 'h' }, { type: 'text', value: 'i' }, { type: 'text', value: 'j' } ],
                 [ { type: 'text', value: 'k' }, { type: 'text', value: 'l' }, { type: 'text', value: 'm' }, { type: 'text', value: 'n' }, { type: 'text', value: 'o' } ],
                 [ { type: 'text', value: 'p' }, { type: 'text', value: 'q' }, { type: 'text', value: 'r' }, { type: 'text', value: 's' }, { type: 'text', value: 't' } ],
                 [ { type: 'text', value: 'u' }, { type: 'text', value: 'v' }, { type: 'text', value: 'w' }, { type: 'text', value: 'x' }, { type: 'text', value: 'y' } ],
                 [ { type: 'text', value: 'z' }, { type: 'caps', value: 'CAPS' }, { type: 'space', value: '\xA0' } ],
                 [ { type: 'numbers', value: '.?123' }, { type: 'arrowLeft', value: '' }, { type: 'arrowRight', value: '' }, { type: 'delete', value: '' } ],
                 [{ type: 'done', value: 'DONE' }]
                ],

        "ABC": [ [ { type: 'text', value: 'A' }, { type: 'text', value: 'B' }, { type: 'text', value: 'C' }, { type: 'text', value: 'D' }, { type: 'text', value: 'E' } ],
                 [ { type: 'text', value: 'F' }, { type: 'text', value: 'G' }, { type: 'text', value: 'H' }, { type: 'text', value: 'I' }, { type: 'text', value: 'J' } ],
                 [ { type: 'text', value: 'K' }, { type: 'text', value: 'L' }, { type: 'text', value: 'M' }, { type: 'text', value: 'N' }, { type: 'text', value: 'O' } ],
                 [ { type: 'text', value: 'P' }, { type: 'text', value: 'Q' }, { type: 'text', value: 'R' }, { type: 'text', value: 'S' }, { type: 'text', value: 'T' } ],
                 [ { type: 'text', value: 'U' }, { type: 'text', value: 'V' }, { type: 'text', value: 'W' }, { type: 'text', value: 'X' }, { type: 'text', value: 'Y' } ],
                 [ { type: 'text', value: 'Z' }, { type: 'caps', value: 'CAPS' }, { type: 'space', value: '\xA0' } ],
                 [ { type: 'numbers', value: '.?123' }, { type: 'arrowLeft', value: '' }, { type: 'arrowRight', value: '' }, { type: 'delete', value: '' } ],
                 [{ type: 'done', value: 'DONE' }]
                ],
        "123": [ [ { type: 'text', value: '1' }, { type: 'text', value: '2' }, { type: 'text', value: '3' }, { type: 'text', value: '4' }, { type: 'text', value: '5' } ],
                 [ { type: 'text', value: '6' }, { type: 'text', value: '7' }, { type: 'text', value: '8' }, { type: 'text', value: '9' }, { type: 'text', value: '0' } ],
                 [ { type: 'text', value: '(' }, { type: 'text', value: ')' }, { type: 'text', value: '$' }, { type: 'text', value: '&' }, { type: 'text', value: '@' } ],
                 [ { type: 'text', value: '-' }, { type: 'text', value: '/' }, { type: 'text', value: ':' }, { type: 'text', value: ';' }, { type: 'text', value: '.' } ],
                 [ { type: 'text', value: ',' }, { type: 'text', value: '?' }, { type: 'text', value: '!' }, { type: 'text', value: "'" } ],
                 [ { type: 'letters', value: 'abc' }, { type: 'space', value: '\xA0' } ],
                 [ { type: 'symbols', value: '#+=' }, { type: 'arrowLeft', value: '' }, { type: 'arrowRight', value: '' }, { type: 'delete', value: '' } ],
                 [{ type: 'done', value: 'DONE' }]
                ],
        "#+=": [ [ { type: 'text', value: '[' }, { type: 'text', value: ']' }, { type: 'text', value: '{' }, { type: 'text', value: '}' }, { type: 'text', value: "'\'" } ],
                 [ { type: 'text', value: '#' }, { type: 'text', value: '%' }, { type: 'text', value: '$' }, { type: 'text', value: '+' }, { type: 'text', value: '=' } ],
                 [ { type: 'text', value: '(' }, { type: 'text', value: ')' }, { type: 'text', value: '<' }, { type: 'text', value: '>' }, { type: 'text', value: '|' } ],
                 [ { type: 'text', value: '^' }, { type: 'text', value: '*' }, { type: 'text', value: '`' }, { type: 'text', value: '~' }, { type: 'text', value: '_' } ],
                 [ { type: 'letters', value: 'abc' }, { type: 'space', value: '\xA0' } ],
                 [ { type: 'numbers', value: '.?123' }, { type: 'arrowLeft', value: '' }, { type: 'arrowRight', value: '' }, { type: 'delete', value: '' } ],
                 [{ type: 'done', value: 'DONE' }]
                ]
    };
    this.onControlEvent("back", function() {
        $util.ControlEvents.fire(":keyboardBg", "hide");
    });
    this.logExit();
};

/**
 * @method _populate
 * @keyType
 */
app.gui.controls.KeyboardGrid.prototype._populate = function _populate(keyType) {
    this.logEntry();
    var arr = (keyType && this._keyArrays[keyType]) ? this._keyArrays[keyType] : this._keyArrays[this._keyType];
    if (arr && arr.length > 0) {
        this.superCall(arr);
    }
    this._keyType = keyType || "abc";
    if (this._keyType === "#+=") {
        this.classList.add("SpacialCharKeyboard");
    } else {
        this.classList.remove("SpacialCharKeyboard");
    }
    this.logExit();
};

/**
 * @property keyType
 * @public
 */
Object.defineProperty(app.gui.controls.KeyboardGrid.prototype, "keyType", {
    get: function get() {
        return this._keyType;
    }
});

/**
 * @method _onKeyDown
 */
app.gui.controls.KeyboardGrid.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    if (e.key >= "0" && e.key <= "9") {
        // TODO
        //this.fireControlEvent("number:up", e);
        e.stopImmediatePropagation();
    }
    this.superCall(e);
    this.logExit();
};


/**
 * @class app.gui.controls.KeyboardGridCell
 */
app.gui.controls.KeyboardGridCell = function KeyboardGridCell() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.KeyboardGridCell, app.gui.controls.HtmlGridItem);

/**
 * @method createdCallback
 */
app.gui.controls.KeyboardGridCell.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
    this._textData = this.querySelector(".cellText");
    this._focusClass = "control-textbox-keyboard-key-highlight";
    this.logExit();
};

/**
 * @property itemData
 * @public
 */
Object.defineProperty(app.gui.controls.KeyboardGridCell.prototype, "itemData", {
    get: function get() {
        return this._data;
    },
    set: function set(data) {
        this._data = data;
        if (data.type === "space" || data.type === "arrowLeft" || data.type === "arrowRight" || data.type === "delete") {
            this.classList.add("control-textbox-keyboard-key-operator");
            this._textData.className += " " + data.type;
        } else if (data.type === "caps" || data.type === "numbers" || data.type === "done" || data.type === "letters" || data.type === "symbols") {
            this.classList.add("control-textbox-keyboard-key-operator");
            this._textData.className += " " + data.type;
            this._textData.textContent = data.value;
        } else if (data.type === "text") {
            this._textData.textContent = data.value;
        }
        var style = window.getComputedStyle(this);
        this._data.start = this.offsetLeft;
        this._data.end = this._data.start + (this.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight));
    }
});

