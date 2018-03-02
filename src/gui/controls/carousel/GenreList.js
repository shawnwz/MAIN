/**
 * @class app.gui.controls.GenreList
 */

app.gui.controls.GenreList = function GenreList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GenreList, app.gui.controls.HtmlScrollList);

app.gui.controls.GenreList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    /*
        <app-genre-list id="jumpListHome" class="jumpoff-list" data-orientation="horizontal" data-feature="home">
            <template>
                <app-genre-list-item class="genre-item"></app-genre-list-item>
            </template>
        </app-genre-list>
    */
    this.itemTemplate = "app-genre-list-item";
    this.className = "genre-list";

    this.animate = true;
    this.orientation = "Horizontal";
    this._wrapped = false;

    this.logExit();
};

/**
 * @method attachedCallback
 */
app.gui.controls.GenreList.prototype.attachedCallback = function attachedCallback () {
    this.superCall();
    this.parentElement.style.width = "7000px";
};


app.gui.controls.GenreList.prototype._fetch = function _fetch (node) {
    this.logEntry();
    this.superCall();

    var nodeId, nthNode, arr = [];

    this.fireControlEvent("clear");
/* disabled
    if (node._collections && node._collections.length > 0) { // add each collection as a genre
        for (nodeId in node._collections) {
            if (node._collections[nodeId]) {
                nthNode = node._collections[nodeId];
                arr.push(nthNode);
            }
        }
    }
*/
    if (node._subNodes && node._subNodesNb > 0) { // add each subnode as a genre
        for (nodeId in node._subNodes) {
            if (node._subNodes[nodeId]) {
                nthNode = node._subNodes[nodeId];
                arr.push(nthNode);
            }
        }
    }

    this.fireControlEvent("populate", arr);

    this.logExit();
};

/**
 * @class app.gui.controls.GenreListItem
 */

app.gui.controls.GenreListItem = function GenreListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.GenreListItem, app.gui.controls.HtmlListItem);

app.gui.controls.GenreListItem.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
    this.className = "genre-item";
    this._data = {};
    this.logExit();
};

Object.defineProperty(app.gui.controls.GenreListItem.prototype, "itemData", {
    get: function get() {
        return this._data;
    },
    set: function set(data) {
        this._data = data;
        var colours = [ "#FFFFFF", "#FFFF00", "#C0C0C0", "#00FF00", "#00FFFF", "#008080", "#000080" ],
            colour = colours[this.itemIndex % colours.length]; // colours[Math.floor(Math.random() * colours.length)];

        if (data) {
            this.textContent = data.displayName;
            this.style.color = colour;
        }
    }
});
