/**
 * @class app.gui.controls.HtmlInputTextBox
 */

app.gui.controls.HtmlInputTextBox = function HtmlInputTextBox() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HtmlInputTextBox, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 */
app.gui.controls.HtmlInputTextBox.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
    this._data = "";
    this._isMasked = true;
    this._maskChar = "*";

    this._getNodeIndex = function(s) {
        var sel = s || window.getSelection(),
        	nodeIndex,
        	validNodes;
		validNodes = Array.prototype.slice.call(sel.focusNode.parentElement.childNodes).filter(function (node) { return node.length; });
		nodeIndex = validNodes.indexOf(sel.focusNode) + sel.extentOffset;
        return nodeIndex;
    };

    this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.HtmlInputTextBox.prototype.attachedCallback = function attachedCallback() {
    this.logEntry();
    this.superCall();
    if (this.id) {
        this.onControlEvent("insertChar", this._insertChar);
        this.onControlEvent("removeChar", this._removeChar);
        this.onControlEvent("moveCaretLeft", this._moveCaretLeft);
        this.onControlEvent("moveCaretRight", this._moveCaretRight);
        this.onControlEvent("mask", this._mask);
    }
    this.logExit();
};

/**
 * @method _clear
 */
app.gui.controls.HtmlInputTextBox.prototype._clear = function _clear() {
    this.superCall();
    this._isMasked = true;
    this._data = "";
};

/**
 * @method _mask
 */
app.gui.controls.HtmlInputTextBox.prototype._mask = function _mask(isMasked) {
    this._isMasked = isMasked;
    this.fireControlEvent("populate", this._data);
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.HtmlInputTextBox.prototype, "itemData", {
    get: function get() {
        return this._data;
    },
    set: function set(data) {
        this._data = data || "";

        var value = this._isMasked ? Array(data.length + 1).join(this._maskChar) : data,
            i, len = value.length,
            sel, range, node;

        this.innerHTML = "";

        sel = window.getSelection();
        sel.collapseToEnd();

        range = sel.getRangeAt(0);
        range.deleteContents();

        for (i = 0; i < len; i++) {
            node = this.ownerDocument.createTextNode(value[i]);
            range.collapse(false);
            range.insertNode(node);
            sel.collapse(node, 1);
        }
    }
});

/**
 * @method _insertChar
 */
app.gui.controls.HtmlInputTextBox.prototype._insertChar = function _insertChar(c) {

    var sel = window.getSelection(),
        range = sel.getRangeAt(0),
        n = this._getNodeIndex(sel),
        node = this.ownerDocument.createTextNode(this._isMasked ? this._maskChar : c);

    range.insertNode(node);
    sel.collapse(node, 1);

    this._data = this._data.insertAt(n, c);
    console.log(n, this._data);

    return true;
};

/**
 * @method _removeChar
 */
app.gui.controls.HtmlInputTextBox.prototype._removeChar = function _removeChar() {

    if (this._data.length === 0) {
        return false;
    }

    var sel = window.getSelection(),
        range = sel.getRangeAt(0),
        n = this._getNodeIndex(sel),
        node;

    if (range.collapsed === true) {
        range.setStart(range.endContainer, 0);
    }

    range.deleteContents();
    this._data = this._data.removeAt(n - 1);

    console.log(n, this._data);

    if (this._data.length === 0) {
        // nothing left
        this.innerHTML = "";
        this._data = "";
        sel.collapseToEnd();
    } else {
        // something left
        node = range.endContainer.previousSibling;

        if (node) {
            if (node.length === 0) { // move to previous range
                this._moveCaretLeft();
            } else { // caret after previous sibling
                sel.collapse(node, 1);
            }
        } else { // caret before first one
            sel.collapse(this.childNodes[0], 0);
        }
    }

    return true;
};

/**
 * @method _moveCaretLeft
 */
app.gui.controls.HtmlInputTextBox.prototype._moveCaretLeft = function _moveCaretLeft() {

    if (this._data.length === 0) {
        return false;
    }

    var sel = window.getSelection(),
        node,
        handled = false;

    if (sel.focusNode === null) {
        return false;
    }

    if (sel.focusOffset > 0) {
        sel.collapse(sel.focusNode, sel.focusOffset - 1);
        handled = true;
    } else if (sel.focusNode.previousSibling !== null) {
        node = sel.focusNode;
        while (node.previousSibling !== null) {
            node = node.previousSibling;
            if (node.length > 0) {
                sel.collapse(node, node.length);
                handled = true;
                break;
            }
        }
    }
    return handled;
};

/**
 * @method _moveCaretRight
 */
app.gui.controls.HtmlInputTextBox.prototype._moveCaretRight = function _moveCaretRight() {
    var sel = window.getSelection(),
        node,
        handled = false;

    if (sel.focusNode === null) {
        return false;
    }

    if (sel.focusOffset < sel.focusNode.length) {
        // not at the end: just move
        sel.collapse(sel.focusNode, sel.focusOffset + 1);
        handled = true;
    } else {
        node = sel.focusNode;
        while (node.nextSibling !== null) {
            node = node.nextSibling;
            if (node.length > 0) {
                sel.collapse(node, 1);
                handled = true;
                break;
            }
        }
    }

    return handled;
};

/**
 * @method _onKeyDown
 */
app.gui.controls.HtmlInputTextBox.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false;

    // TODO: hdk: add key handling here if there is no HTML keyboard. Or when we enter T9 chars

    switch (e.key) {
        case "Back":
          // this.fireControlEvent("removeChar", this);
          break;

        case "ArrowLeft":
          // this.fireControlEvent("moveCaretLeft", this);
          break;

        case "ArrowRight":
          // this.fireControlEvent("moveCaretRight", this);
          break;

        case "Ok":
        case "Enter":
          // this.fireControlEvent("enter", this);
          // handled = true;
          break;

        default:
          // this.fireControlEvent("insertChar", this);
          break;
    }

    if (handled === true) {
        e.stopImmediatePropagation();
        e.preventDefault();
    }

    this.logExit(handled);
    return handled;
};
