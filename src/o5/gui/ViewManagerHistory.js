/**
 * @class o5.gui.ViewManagerHistory
 * @singleton
 *
 * @author lmayle
 */

o5.gui.viewManager.history = new (function ViewManagerHistory ()
{
	this._entries = [];
})();

//o5.log.setAll(o5.gui.viewManager.history, true);



/*
 * Public properties
 */
/**
 * @property {String} defaultView
 */
Object.defineProperty(o5.gui.viewManager.history, "length", {
	get: function get () {
		this.logEntry(this._entries.length);
		
		return this._entries.length;
	},
	enumerable: true
});

Object.defineProperty(o5.gui.viewManager.history, "current", {
	get: function get () {
		this.logEntry(this._entries.length);
		
		return this._entries.length;
	},
	enumerable: true
});



/*
 * Public methods
 */
/**
 * Registers a new View 
 * 
 * @method registerView
 * @param {String} id The unique identifier of this view
 * @param {String} src The path to the HTML file used to initialize the View Object
 * @param {o5.gui.ViewManager.CacheStrategy} [cacheStrategy=o5.gui.ViewManager.CacheStrategy.onDemand] Option specifying the cache strategy for this view
 */
o5.gui.viewManager.history._pushOpenView = function _pushOpenView (id, view)
{
	this.logEntry();
	
	var item = new o5.gui.viewManager.history.HistoryItem(id, view);
	item._action = 'open';
	
	this._entries.push(item);
};

o5.gui.viewManager.history._pushPreviewView = function _pushPreviewView (id, view)
{
	this.logEntry();
	
	var item = new o5.gui.viewManager.history.HistoryItem(id, view);
	item._action = 'preview';
	
	this._entries.push(item);
};

o5.gui.viewManager.history._pushNavigateToView = function _pushNavigateToView (id, view)
{
	this.logEntry();
	
	var item = new o5.gui.viewManager.history.HistoryItem(id, view);
	item._action = 'navigate';
	
	this._entries.push(item);
};




/*
 * Private properties
 */

/*
 * Private methods
 */






/**
 * @class
 * @static
 */
o5.gui.viewManager.history.HistoryItem = function ViewManagerHistoryItem (id, view)
{
	this._viewId = id;
	this._view = view;
};


/**
 * @property
 */
Object.defineProperty(o5.gui.viewManager.history.HistoryItem, "viewId", {
	get: function get () {
		this.logEntry(this._viewId);
		
		return this._viewId;
	},
	enumerable: true
});

