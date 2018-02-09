/**
 * @class app.gui.controls.DialogSubGenre
 */

app.gui.controls.DialogSubGenre = function DialogSubGenre () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogSubGenre, app.gui.controls.HtmlDialogContainer);

/**
 * @method createdCallback
 */
app.gui.controls.DialogSubGenre.prototype.createdCallback = function createdCallback () {
//	this.logEntry();
	this.superCall();

//  this._fill = this.querySelector('#volumeBarFill');
	
//	this.logExit();
};

/**
 * @method _store
 */
app.gui.controls.DialogSubGenre.prototype._store = function _store () {
	this.logEntry();
	console.log("dialog settings not stored");
	this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.DialogSubGenre.prototype._populate = function _populate (list) {
    this.logEntry();
    this.superCall();
    $util.ControlEvents.fire(":dialogSubGenreList", "populate", list);
    this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.DialogSubGenre.prototype._focus = function _focus () {
    this.logEntry();
    $util.ControlEvents.fire(":dialogSubGenreList", "focus");
    this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.DialogSubGenre.prototype._show = function _show () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.DialogSubGenre.prototype._hide = function _hide () {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.DialogSubGenre.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();

	switch (e.key) {
		default:
			this.superCall(e);
			break;
	}

	this.logExit();
};

/**
 * @class app.gui.controls.DialogSubGenreList
 */

app.gui.controls.DialogSubGenreList = function DialogSubGenreList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogSubGenreList, app.gui.controls.HtmlFlexList);  // HtmlFlexList

/**
 * @method createdCallback
 */
app.gui.controls.DialogSubGenreList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this.orientation = "Vertical";
    this.animate = true;
    this._keyArrays = { // Value of Genre:SubGenre will be moved as a global definition
    	"Entertainment"     : [ "All Programmes", "Action&Thriller", "Adventure", "Comedy", "Mystery&Horror", "Drama", "Educational", "Light Entertainment", "Lifestyle", "Reality", "Arts", "Sci-Fi&Fantasy", "War&Western", "Talk Shows", "Special Events", "Other" ],
		"Movies"            : [ "All Programmes", "Action&Adventure", "Animation", "Documentaries", "Drama", "Erotic", "Sci-Fi&Fantasy", "World Cinema", "Horror", "Musical&Dance", "Thriller&Suspense", "Romance", "War,Western&History", "Mystery&Crime", "Comedy", "Kids&Family", "Other" ],
        "Sport"             : [ "All Programmes", "AFL", "Track&Pool", "Court Sports", "Boxing&Wrestling", "Cricket", "Baseball", "Extreme Sports", "Winter Sports", "Golf", "Racing", "News&Variety", "Rugby League", "Football&Soccer", "Special", "Other" ],
        "News&Documentaries": [ "All Programmes", "Business&Finance", "International", "Local", "Panel, Talk&Interview", "Public Affairs&Political", "Weather&Information", "Sports", "Biography", "People&Culture", "History", "Science&Technology", "Natural World", "Travel&Adventure", "Other" ],
        "Kids&Family"       : [ "All Programmes", "Adventure&Action", "Animation&Cartoon", "Comedy", "Drama", "Educational", "Fantasy", "Game Show", "Movies", "Musical", "Pre-school", "Sport", "Science", "Technology", "Reality", "Other" ],
        "Music&Radio"       : [ "All Programmes", "Favourites", "Classical&Opera", "Country", "Dance&Techno", "Reality&Fact", "Jazz&Blues", "Pop", "Live&Request", "Rap&Hip Hop", "Rock", "Soul&R&B", "Radio", "Specials", "Other" ],
        "Special Interest"  : [ "All Programmes", "Religion", "Foreign Language", "Adult", "Shopping", "Help", "Other" ]
	};
    this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.DialogSubGenreList.prototype._populate = function _populate (term) {
    this.logEntry();
    var arr = this._keyArrays[term];

    this.superCall(arr, 0);
    this.logExit();
};

/**
 * @method attachedCallback
 * @public
 */
app.gui.controls.DialogSubGenreList.prototype.attachedCallback = function attachedCallback () {
    this.logEntry();
    this.superCall();
    this.onControlEvent("enter", function (ctrl) {
        var genre = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData : null;

        if (genre) {
            $util.ControlEvents.fire(":subGenreDialog", "hide");
            $util.ControlEvents.fire("app-guide:epgListingsSubGenreFilter", "reset", genre);
            $util.ControlEvents.fire("app-guide:epgListingsSubGenreFilter", "focus");
            $util.ControlEvents.fire("app-guide:epgListingsProgList-List", "fetch", "filter", "subGenre", genre);
        }
    });
    this.onControlEvent("back", function (ctrl) {
        var genre = ctrl && ctrl.selectedItem ? ctrl.selectedItem.itemData : null;

        if (genre) {
            $util.ControlEvents.fire(":subGenreDialog", "hide");
            $util.ControlEvents.fire("app-guide:epgListingsSubGenreFilter", "focus");
        }
    });
    this.logExit();
};

/**
 * @class app.gui.controls.DialogSubGenreListItem
 */
app.gui.controls.DialogSubGenreListItem = function DialogSubGenreListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogSubGenreListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.DialogSubGenreListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    this._focusClass = "listView-focused";
    this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.DialogSubGenreListItem.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        this._data = data;

        if (data) {
            this.textContent = data;

        } else {
            this.textContent = "";
            this.classList.add("dialogSubGenreList-empty");
        }
    }
});
