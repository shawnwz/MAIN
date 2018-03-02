/**
 * @class app.gui.controls.HomeGridCell
 */

app.gui.controls.HomeGridCell = function HomeGridCell () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HomeGridCell, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 */
app.gui.controls.HomeGridCell.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "focused";
    this._emptyClass = "unavailable";
    this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.HomeGridCell.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        var html = "";
        this._data = data;

        if (data) {
            if (data.key) {
                this.dataset.key = data.key;
                // html = "<span>" + data.key + ". </span>"; // use key symbols like star for Favourites
            }
            html += '<span data-i18n="' + data.name + '">' + $util.Translations.translate(data.name) + '</span>';
            this.innerHTML = html;
        } else {
            this.textContent = "";
        }
    }
});

