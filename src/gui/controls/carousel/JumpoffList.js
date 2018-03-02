/**
 * @class app.gui.controls.JumpoffList
 */

app.gui.controls.JumpoffList = function JumpoffList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.JumpoffList, app.gui.controls.HtmlFocusList);

app.gui.controls.JumpoffList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    /*
        <app-jumpoff-list id="jumpListHome" class="jumpoff-list" data-orientation="horizontal" data-feature="home">
            <template>
                <app-jumpoff-list-item class="jumpoff-item"></app-jumpoff-list-item>
            </template>
        </app-jumpoff-list>
    */
    this.itemTemplate = "app-jumpoff-list-item";
    this.className = "jumpoff-list";

    this.animate = true;
    this.orientation = "Horizontal";
    this._wrapped = false;

    this._delayChange = 250;

    this._hiddenClass = "hideJumpList";

    this.logExit();
};

app.gui.controls.JumpoffList.prototype._fetch = function _fetch (node) {
    this.logEntry();
    this.superCall();

    var me = this;
    $service.MDS.Node.screenNode(node).then(function(/* data */) {

        var nodeId, nthNode, arr = [];

        if (!node._hasJumpOffs) { // no jumpoffs: pass in the whole node
            arr.push(node);
            me.parentElement.classList.add("noJumpList");
        } else if (node._subNodes && node._subNodesNb > 0) { // jumpoffs and subNodes: pass in each individual subnode as a jumpoff
            me.parentElement.classList.remove("noJumpList");
            for (nodeId in node._subNodes) {
                if (node._subNodes[nodeId]) {
                    nthNode = node._subNodes[nodeId];
                    arr.push(nthNode);
                }
            }
        }

        me.fireControlEvent("populate", arr);
    });
    this.logExit();
};


/**
 * @class app.gui.controls.JumpoffListItem
 */
app.gui.controls.JumpoffListItem = function JumpoffListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.JumpoffListItem, app.gui.controls.HtmlListItem);

app.gui.controls.JumpoffListItem.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
    this.className = "jumpoff-item";
    this._data = {};
    this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.JumpoffListItem.prototype, "itemData", {
    get: function get() {
        return this._data;
    },
    set: function set(data) {
        this._data = data;

        if (data) {
            this.textContent = data.displayName;
        }
    }
});
