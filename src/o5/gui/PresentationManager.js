/**
 * PresentationManager provides functionality to dynamically modify the layout and styling of the UI.
 *
 * @class o5.gui.PresentationManager
 * @singleton
 *
 * @author lmayle
 */

o5.gui.presentationManager = new (function PresentationManager ()
{
	document.documentElement.style.width = window.innerWidth + 'px';
	document.documentElement.style.height = window.innerHeight + 'px';
	
	var sheets = [].slice.call(document.styleSheets);
   
	for (var item, i = 0; (item = sheets[i]) !== undefined; i++)
	{
		o5.gui._cssExt.processStyleSheet(item);
	}
	
}) ();


/*
 * Public properties
 */
/*
 * Public methods
 */
/*
 * Private properties
 */


/*
 * Private methods
 */
o5.gui.presentationManager._onWindowResize = function _onWindowResize ()
{
	this.logEntry (window.innerWidth + 'x' + window.innerHeight);
	
	var split = o5.$.scriptDataset.appResolution.split('x');
	
	var ratio1 = parseInt(split[0]) / parseInt(split[1]);
	var ratio2 = window.innerWidth / window.innerHeight;
	var diff = ratio1 - ratio2;
	
	var zoom = 1;
	
	if (diff <= -0.001)
	{
		zoom = window.innerHeight / parseInt(split[1]);
	}
	else
	{
		zoom = window.innerWidth / parseInt(split[0]);
	}
		
	if (Math.abs(1 - zoom) > 0.001)
	{
		window.top.document.documentElement.style.zoom = zoom;
	}
	else
	{
		window.top.document.documentElement.style.zoom = '';
	}
	
	document.documentElement.style.width = parseInt(split[0]) + 'px';
	document.documentElement.style.height = parseInt(split[1]) + 'px';
	
	if (document.body)
	{
		document.body.style.width = parseInt(split[0]) + 'px';
		document.body.style.height = parseInt(split[1]) + 'px';
	}
	else // body not loaded yet, try again, better than adding event listener just for this case
	{
		setTimeout(o5.gui.presentationManager._onWindowResize, 100);
	}
};


o5.gui.presentationManager._setDefaultCSS = function _setDefaultCSS (doc)
{
	var embeddedCSS = null;
	
	if (embeddedCSS)
	{
		var css = doc.createElement('style');
		css.type = 'text/css';
		css.title = 'O5.js';
		css.textContent = embeddedCSS;
		
		doc.head.insertBefore(css, doc.head.firstElementChild);
	}
	else
	{
	    var link = document.createElement('link');
	    link.href = o5.$.pathToFW + "gui/css/default.css";
	    link.rel = 'stylesheet';
	    link.title = 'O5.js';
	    
	    doc.head.insertBefore(link, doc.head.firstElementChild);
	}
};



/**
* Sets the locale of the PresentationManager.
* Note that this is not related to the locale of the Language module.
* @method setLocale
* @param {String} newLocale The new locale.
*/
o5.gui.presentationManager.setLocale = function (/*newLocale*/)
{
};

/**
* Returns the current locale of the PresentationManager.
* Note that this is not related to the locale of the Language module.
* @method getLocale
* @return {String} The current locale.
*/
o5.gui.presentationManager.getLocale = function ()
{
	return null;
};

/**
* Sets the skin of the PresentationManager.
* @method setSkin
* @param {String} newSkin The new skin.
*/
o5.gui.presentationManager.setSkin = function (/*newSkin*/)
{
};

/**
* Returns the skin of the PresentationManager.
* @method getSkin
* @return {String} The current skin.
*/
o5.gui.presentationManager.getSkin = function ()
{
	return null;
};


// initialization logic
if (o5.$.scriptDataset.appResolution)
{
	o5.gui.presentationManager._onWindowResize();
	
	window.addEventListener('resize', o5.gui.presentationManager._onWindowResize);
}

o5.gui.presentationManager._setDefaultCSS(document);

