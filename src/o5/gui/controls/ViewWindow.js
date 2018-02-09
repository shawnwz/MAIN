/**
 * Window-like control that works as container for a application view
 * Once a view is registered, its parent View Window object is always there whether the View contents are loaded or not, whether the view is opened or closed
 *
 * @class o5.gui.controls.ViewWindow
 * @author lmayle
 * @extends o5.gui.controls.Control
 * @private
 */

o5.gui.controls.ViewWindow = function ViewWindow () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.ViewWindow);

//o5.log.setAll(o5.gui.controls.ViewWindow, true);

o5.gui.controls.ViewWindow.prototype.createdCallback = function createdCallback ()
{
	this.logEntry();

	this.superCall();

	this.loaded = false;

	this.tabIndex = -1;

	this.style.display = 'none';
//	this.style.opacity = '0';
	this.style.width = document.body.clientWidth + 'px';
	this.style.height = document.body.clientHeight + 'px';
	this.style.willChange = 'contents';

	this.onfocus = this._onFocus;
};

o5.gui.controls.ViewWindow.prototype._onFocus = function _onFocus (e)
{
	this.logEntry();

	if (this.viewElement)
	{
		e.preventDefault();
		e.stopImmediatePropagation();
		this.viewElement.focus();
	}
};


/*
 * Public properties
 */
o5.gui.controls.Control.definePropertyWithAttribute(o5.gui.controls.ViewWindow.prototype, 'src');



/*
 * Public methods
 */
/**
 * Opens the view, place it on top and give focus, loading the content if not already loaded
 */
o5.gui.controls.ViewWindow.prototype.open = function open ()
{
	this.logEntry(this.loaded);
	
	this.style.display = '';
//	this.style.opacity = '';

	if (!this.loaded && !this._xhttp)
	{
		this.load();
	}
	else
	{
		this._show(true);
	}
};

/**
 * Closes the view (display none on the window), unloading the contents if set or necessary
 */
o5.gui.controls.ViewWindow.prototype.close = function close ()
{
	this.logEntry(this.loaded);

	this.viewElement.hide();
	this.style.display = 'none';
//	this.style.opacity = 0;
	
	this.viewElement.removeAttribute('preview');
	
	this.viewElement.active = false;

	if (document.activeElement === this)
		o5.gui.ViewManager.resetFocus();
	
	if (this.viewElement.onhide)
		this.viewElement.onhide();
};

/**
 * Opens the view, do not give focus, loading the content if not already loaded
 */
o5.gui.controls.ViewWindow.prototype.preview = function preview ()
{
	this.logEntry(this.loaded);
	
	this.style.display = '';
//	this.style.opacity = 0.6;
	this.viewElement.show();

	if (!this.loaded && !this._xhttp)
	{
		this.load();
	}
	else
	{
		this._show(null, true);
	}
};



/*
 * Private properties
 */
/*
 * Private methods
 */
o5.gui.controls.ViewWindow.prototype._show = function _show (activate, preview)
{
	this.logEntry(this.loaded);

	if (this.viewElement)
	{
		if (this.viewElement.onshow)
			this.viewElement.onshow();
		
		if (activate)
		{
			this._activate();
		}
		
		if (preview)
			this.viewElement.setAttribute('preview', '');
		else
			this.viewElement.removeAttribute('preview');
		
//		this.style.opacity = '';
		this.style.display = '';
		this.viewElement.show();
	}
	
	o5.gui.ViewManager.activeViewWindow = this;
};

o5.gui.controls.ViewWindow.prototype._activate = function _activate ()
{
	this.logEntry(this.attributes.view.value);
	
	if (o5.gui.viewManager._activeView)
		o5.gui.viewManager._activeView._deactivate();
	
	o5.gui.viewManager._activeView = this;
	this.viewElement.active = true;
	
	var af = this.viewElement.querySelector('[autofocus]');
	
	if (af)
		af.focus();
	else
		this.viewElement.focus();
	
	if (this.viewElement.onactivate)
		this.viewElement.onactivate();
};

o5.gui.controls.ViewWindow.prototype._deactivate = function _deactivate ()
{
	this.logEntry(this.attributes.view.value);
	
	if (this.viewElement.ondeactivate)
		this.viewElement.ondeactivate();
	
	this.viewElement.active = false;
};




/**
 * Loads the view's contents from the actual html document
 * @private
 */
o5.gui.controls.ViewWindow.prototype.load = function load ()
{
	this.logEntry(this.loaded + " " + this.src);

	if (!this.loaded)
	{
		var viewWindow = this;

	    this._xhttp = new XMLHttpRequest();

	    this._xhttp.open("GET", this.src, true);

	    this._xhttp.responseType = "document";

	    this._xhttp.onload = function onload ()
	    {
	        if ((this.status === 200 || this.status === 0))
	        {
	        	viewWindow._onHTMLLoaded(this.responseXML);

	        }
 			else
	        {
	            //error occurred loading the file.
	            this.logError(String(this.status) + " --- " + this.responseText);
	        }
	    };

	    this._xhttp.send();
	}
};




/**
 * Loads the children of given HTML element into the target element
 * @method addHTMLToDOM
 * @private
 * @param {HTMLElement} HTMLToImport DOM element to be imported
 */
o5.gui.controls.ViewWindow.prototype.addHTMLToDOM = function addHTMLToDOM (HTMLToImport)
{
    var o = HTMLToImport && HTMLToImport.firstElementChild;

    if (o)
	{
        do
        {
            this.appendChild(o);
            o = HTMLToImport.firstElementChild;
        }
        while (o);
    }
};

/**
 * Sequentially processes all sibling of the element passed into the function via 'element' argument
 * For every <script> and <link> tag, will create corresponding objects and add them into document.head
 * synchronously. The <script> tags containing 'async' attribute will loaded asynchronously.
 * @method _processHeadElement
 * @private
 * @param {HTMLElement} doc The source document for this view
 * @param {HTMLElement} element The element to process
 */
o5.gui.controls.ViewWindow.prototype._processHeadElement = function _processHeadElement (doc, element)
{
    this.logEntry();

    var onLoadedAndContinue = function onLoadedAndContinue (e)
    {
        this.logEntry();
        
        if (e.target._callback)
        	e.target._callback();

        if (element.nextElementSibling)
            this._processHeadElement(doc, element.nextElementSibling);
        else
        	this._onHTMLLoaded2(doc);

    }.bind(this);

    var onLoadErrorAndContinue = function onLoadErrorAndContinue (errUrl)
    {
//        logError("Failed to load file: " + errUrl);

        if (element.nextElementSibling)
        	this._processHeadElement(doc, element.nextElementSibling);
        else
        	this._onHTMLLoaded2(doc);
    };

    switch (element.tagName)
    {
    case "LINK":
        this.logDebug("appending <link href='" + element.href + "'>");

        var linkObj = element.cloneNode(true);

        linkObj.href = element.href; //this prevents resetting path to relative after insertion
        linkObj.dataset.view = this.id; //id may not be set, could do this differently
        linkObj.onload = onLoadedAndContinue.bind(this);
        linkObj.onerror = onLoadErrorAndContinue.bind(this, element.href);
        
        if (linkObj.rel === 'stylesheet')
        {
	        linkObj._callback = function ()
			{
	        	
	        	o5.gui._cssExt.processStyleSheet(this.sheet);

	        };
        }

        document.head.appendChild(linkObj);

        return;

    case "SCRIPT":
        this.logDebug("appending <script src='" + element.src + "'>");

        var scriptObj = document.createElement("script");

        scriptObj.src = element.src;
        scriptObj.dataset.view = this.id;//id may not be set, could do this differently

        if (element.async)
		{
            scriptObj.async = element.async;
            document.head.appendChild(scriptObj);
            onLoadedAndContinue.bind(this)();
        }
        else
		{
            scriptObj.onload = onLoadedAndContinue.bind(this);
            scriptObj.onerror = onLoadErrorAndContinue.bind(this, element.src);
            document.head.appendChild(scriptObj);
        }

        return;
    }

    if (element.nextElementSibling)
        this._processHeadElement(doc, element.nextElementSibling);
    else
    	this._onHTMLLoaded2(doc);
};

/**
 * Imports <script> and <link> tags from an element into <head> element of the DOM
 * @method addStyleSheetsAndScripts
 * @private
 * @param {HTMLElement} view View element that will contain imported HTML of the View
 * @param {HTMLElement} importHead document.head element
 * @param {Function...} callback callback to be called when all <script> and <link> tags are loaded
 *                      except for the <script> tag using 'async' attribute
 */

o5.gui.controls.ViewWindow.prototype._onHTMLLoaded = function _onHTMLLoaded (doc)
{
//    o5.gui.controls.ViewWindow.prototype.addStyleSheetsAndScripts(viewWindow, doc.head, this._onHTMLLoaded2.bind(this, viewWindow, doc));

    this.logEntry();

    if (doc.head.firstElementChild)
    {
        this._processHeadElement(doc, doc.head.firstElementChild);
    }
    else
    {
    	this._onHTMLLoaded2(doc);
    }
};

o5.gui.controls.ViewWindow.prototype._onHTMLLoaded2 = function _onHTMLLoaded2 (doc)
{
	if (doc.body.firstElementChild)
	{
		if (!o5.gui.controls.Control._controls.some((function (control)
		{

			if (doc.body.firstElementChild.localName === control.tagName)
			{
				//found a custom view, clone it

				this.addHTMLToDOM(doc.body);
				this.loaded = true;
				this.viewElement = this.firstElementChild;

				return true;
			}
		}).bind(this)))
		{
			//did not find a custom view, import body as is
			this.addHTMLToDOM(doc.body);
		}
	}

	this.viewElement.viewWindow = this;
	this.viewElement.hide();
	
	setTimeout((function ()
	{
	    // execute 'onload' for this view
	    if (doc.body.attributes.onload)
	    {
	    	setTimeout(doc.body.attributes.onload.value, 1);
	    }
	    
	    if (this.viewElement.onload)
	    	this.viewElement.onload();
		
	    if (!this.style.display && !this.style.opacity)
	    	this._show(true);
	    
	}).bind(this), 1);

	if (document.activeElement === this)
	{
		this.viewElement.focus();
		o5.gui.viewManager._activeView = this;
		
		this.viewElement.active = true;
	}
};

