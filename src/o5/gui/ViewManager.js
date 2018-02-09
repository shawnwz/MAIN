/**
 * View Manager is responsible for managing the application views
 * It...
 * -Manages the life cycle of the views
 * -Manages the internal context
 * -Set top and down references as needed
 * -Handles custom element registration as documents are loaded
 * -Sets inter-frame key handling to support application global key handling in the top frame
 * -Manages CSS files inclusion and dynamic changing if Automatic Style Management option is enabled
 *
 *
 * @class o5.gui.ViewManager
 * @singleton
 *
 * @author lmayle
 */

o5.gui.viewManager = o5.gui.ViewManager = new (function ViewManager ()
{
    this._viewWindows = [];
    this._activeView = null;
    
    // legacy stuff, to be removed
    this.currLoadingId = null;    // Context id that is currently getting loaded.
    this.activeResolution = null;
    this.contextGroupElem = null;
    this.status = null;
    this.contextList = [];
    this.preEmptiveContextList = [];
    this.activeContext = null;
    this.underlayContexts = [];
    this.previewContext = null;
    this.lastContext = null;
    this.watchDog = null;
    this.preEmptiveLoading = false;

    this.eventListeners = {};
    this.contextLoadingExpiryTime = 180000;
    this.reloadingContexts = false;
    this.lazyLoadCallBack = function _ () {};
    this.loadedContexts = [];
    this.contextLoadingCallback = function _ (/*inProgress*/) {};
    this.preCacheProgressCallback = null;
    this.loadedPreCachedContexts = 0;
    this.preCachedContexts = 0;
    this.currentLoaderFunc = null;
    this.loaderFuncCallback = [];

    if (o5.$.scriptDataset.appResolution)
    {
        var split = o5.$.scriptDataset.appResolution.split('x');

        this.activeResolution = {};
        this.activeResolution.height = parseInt(split[1]);
        this.activeResolution.width = parseInt(split[0]);
    }
    

//    if (window.nw || window.nwDispatcher)
//	    window.addEventListener('scroll', function (e) {
	//    	window.scrollTo(0,0);
//	    	if(e.target.scrollTop != 0)
//	    		e.target.scrollTop = 0;
//	    	if(e.target.scrollLeft != 0)
//	    		e.target.scrollLeft = 0;
//	    }, true);
})();

//o5.log.setAll(o5.gui.ViewManager, true);



/*
 * Public properties
 */
/**
 * Returns the currently active view, that is, the opened view which has focus.
 * @property {o5.gui.controls.View} activeView
 * @readonly
 */
Object.defineProperty(o5.gui.viewManager, "activeView", {
	get: function get () { return this._activeView.viewElement; }
});

/**
 * @property {String} defaultView
 */
Object.defineProperty(o5.gui.viewManager, "defaultView", {
	get: function get () {
		return this._defaultView.attributes['view'].value;
	},
	set: function set (val) {
		
		var vw = this.contextGroupElem.querySelector(':scope > o5-view-window[view="' + val + '"]');
	
		if(!vw)
			return;
		
		this._defaultView = vw;
	}
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
o5.gui.ViewManager.registerView = function registerView (id, src, cacheStrategy)
{
	this.logEntry();
	
	this._ensureViewGroup();
	
	var viewWindow = document.createElement('o5-view-window');
	
	viewWindow.setAttribute('view', id);
	viewWindow.src = src;
	viewWindow.cacheStrategy = cacheStrategy || o5.gui.ViewManager.CacheStrategy.onDemand;
	viewWindow.viewElement = null;
	
	this.contextGroupElem.appendChild(viewWindow);
	
	this._viewWindows.push(viewWindow);
	
	if (viewWindow.cacheStrategy === o5.gui.ViewManager.CacheStrategy.alwaysLoaded)
	{
		viewWindow.load();
	}
};


/**
 * Opens the given view
 * 
 * @method open
 * @param {String} id The unique identifier of this view
 */
o5.gui.ViewManager.open = function open (id, arguments)
{
	this.logEntry();
	
	var vw = this.contextGroupElem.querySelector(':scope > o5-view-window[view="' + id + '"]');
	
	if(!vw)
		return;
	
	this.history._pushOpenView(id, vw);
	
	vw._lastArguments = arguments;
	
	vw.open();
};

/**
 * Closes the given view if not the default view
 * 
 * @method close
 * @param {String} id The unique identifier of this view
 */
o5.gui.ViewManager.close = function close (id)
{
	this.logEntry();
	
	var vw = this.contextGroupElem.querySelector(':scope > o5-view-window[view="' + id + '"]');
	
	if(!vw)
		return;
	
	vw.close();
};

/**
 * Opens the given view in preview mode
 * 
 * @method preview
 * @param {String} id The unique identifier of this view
 */
o5.gui.ViewManager.preview = function preview (id, arguments)
{
	this.logEntry();
	
	var vw = this.contextGroupElem.querySelector(':scope > o5-view-window[view="' + id + '"]');
	
	if(!vw)
		return;
	
	this.history._pushPreviewView(id, vw);
	
	vw._lastArguments = arguments;
	
	vw.preview();
};

/**
 * Navigates to the given view, closing the currently active view if not the default
 * 
 * @method navigateTo
 * @param {String} id The unique identifier of this view
 */
o5.gui.ViewManager.navigateTo = function navigateTo (id, arguments)
{
	this.logEntry();
	
	var vw = this.contextGroupElem.querySelector(':scope > o5-view-window[view="' + id + '"]');
	
	if(!vw)
		return;
	
	var ow = this._openWindows;
	
	for (var i = 0; i < ow.length; i++)
	{
		if(ow[i] != vw && ow[i] != this._defaultView)
			ow[i].close();
	}
	
	this.history._pushNavigateToView(id, vw);
	
	vw._lastArguments = arguments;
	
	vw.open();
};

/**
 * Navigates to the default view if not already on the default view, closing the currently active view
 * 
 * @method navigateTo
 */
o5.gui.ViewManager.navigateToDefault = function navigateToDefault ()
{
	this.logEntry();
	
	if(this.defaultView)
		this.navigateTo(this.defaultView);
};





/*
 * Private properties
 */
Object.defineProperty(o5.gui.viewManager, '_openWindows', {
	get: function get () {
		
		var ret = [];
		
		for (var i = 0; i < this._viewWindows.length; i++)
		{
			if(!this._viewWindows[i].style.display)
				ret.push(this._viewWindows[i]);
		}
		
		return ret;
	}
});

/*
 * Private methods
 */












/**
 * @class
 * @static
 */
o5.gui.ViewManager.CacheStrategy = {};

/**
 * Loads the view immediately and keep it always loaded
 * @property
 */
o5.gui.ViewManager.CacheStrategy.alwaysLoaded = 'always';

/**
 * Loads and unloads when needed
 * @property
 */
o5.gui.ViewManager.CacheStrategy.onDemand = 'demand';



/**
 * Ensures the existence of '_contextGroup_' element to be used as parent for all views
 * @method _ensureViewGroup
 * @ignore
 */
o5.gui.ViewManager._ensureViewGroup = function _ensureViewGroup ()
{
    if (!this.contextGroupElem)
    {
        this.contextGroupElem = document.getElementById("_contextGroup_");
        
        if (this.contextGroupElem)
        {
            return; // already exists
        }

        // Create _contextGroup_
        var contextGroup = document.createElement("o5-panel");
        contextGroup.id = "_contextGroup_";
        
        document.body.appendChild(contextGroup);
        this.logDebug("Adding _contextGroup_ element to " + document.body);
        this.contextGroupElem = contextGroup;
    }
};



o5.gui.ViewManager.resetFocus = function resetFocus ()
{
	this.logEntry();
	
	for (var vw = this.contextGroupElem.lastElementChild; vw; vw = vw.previousElementSibling)
	{
		if (!vw.style.display && !vw.style.opacity)
		{
			if(vw.viewElement)
				vw.viewElement.focus();
			else
				vw.focus();
			
			break;
		}
	}
};


o5.gui.ViewManager.deleteView = function deleteView (view)
{
	this.logEntry();
	
	var v = this.contextGroupElem.querySelector(':scope > o5-view-window[view="' + view + '"]');
	
	if(!v)
		return;
	
	if(v.viewElement.onunload)
		v.viewElement.onunload();
	
	this.contextGroupElem.removeChild(v);
};






