/**
 * Enhanced Image control, works like a HTMLImage with additional features.
 * This custom element uses more resources than the plain `<img>`, so only use this for its additional features.
 * 
 * Example markup for Image is:
 * 
 * 	<o5-image></o5-image>
 * 
 *  Check below example of O5JS Image control
 *  
 *     @example
 *     	<div style="position: relative; height: 80px; width: 100%; ">
 *
 *		 <o5-image src="examples/img/4.png" style="position: relative; left: 0px; top: 0px; "></o5-image>
 *
 *		 <o5-image src="examples/img/4.png" style="position: relative; left: 100px; top: 0px; width: 50px;"></o5-image>
 *
 *		 <o5-image src="examples/img/4.png" style="position: relative; left: 200px; top: 0px; height: 50px;"></o5-image>
 *
 *		 <o5-image src="examples/img/4.png" style="position: relative; left: 300px; top: 0px; width: 50px; height: 50px;"></o5-image>
 *
 *		 <o5-image src="examples/img/4.png" style="position: relative; left: 400px; top: 0px; width: 50px; height: 50px; object-fit: contain; "></o5-image>
 *
 *		</div>
 *
 * @class o5.gui.controls.Image
 * @extends o5.gui.controls.Control
 *
 * @author lmayle
 *
 * @constructor
 */

o5.gui.controls.Image = function Image () { };
o5.gui.controls.Control.registerO5Control(o5.gui.controls.Image);

//o5.log.setAll(o5.gui.controls.Image, true);

o5.gui.controls.Image.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
	
	this.activeImage = '';

	if (this.attributes.src)
	{
		if (this.setUrl)
		{
			this.setUrl(this.attributes.src.value);
		}
		else
		{
			this.src = this.attributes.src.value;
		}
	}
	
	if (this.attributes['default-src'])
	{
		this.defaultSrc = this.attributes['default-src'].value;
	}
	
	if (this.attributes['alt-src'])
	{
		this.altSrc = this.attributes['alt-src'].value;
	}
	
	if (this.attributes['alt-html'])
	{
		this.altHTML = this.attributes['alt-html'].value;
	}
	
	if (this.attributes['alt'])
	{
		this.alt = this.attributes['alt'].value;
	}
};



/*
 * Public properties
 */
/**
 * The image URL.
 * Using this will override any CSS content:url applied to the element as this is used internally by o5-image.
 * @property {String} src
 */
Object.defineProperty(o5.gui.controls.Image.prototype, "src", {
	get: function get ()
	{
		return this._src ? this._src : '';
	},
	set: function set (val)
	{
		this.logEntry();
		
		this._src = val;
		
		if (this._srcIMG)
		{
			this._srcIMG.onerror = null;
			this._srcIMG.tag = null;
			delete this._srcIMG;
		}
		
		if (this._mediaFragmentImage)
		{
			this.removeChild(this._mediaFragmentImage);
			delete this._mediaFragmentImage;
		}
		if (this._mediaFragment)
		{
			delete this._mediaFragment;
		}
		
		if (this._src)
		{
			if (this._src.startsWith('http'))
			{
		        var xywhRegEx = /[#&\?]xywh\=(pixel\:|percent\:)?(\d+),(\d+),(\d+),(\d+)/;
		        
		        var match = xywhRegEx.exec(this._src);
		        
		        if (match)
		        {
		        	this._mediaFragment = {
	        			unit: (match[1] ? match[1] : 'pixel:'),
	        			x: match[2],
	        			y: match[3],
	        			w: match[4],
	        			h: match[5]
		        	};
		        }
		        
		        this._srcIMG = this.ownerDocument.createElement('img');
		        this._srcIMG.onload = this._srcLoaded;
		        this._srcIMG.onerror = this._srcFailed;
		        this._srcIMG.tag = this;
		        this._srcIMG.src = this._src;
			}
			else
			{
				this.activeImage = 'src';
				this.style.content = 'url("' + this._src + '")';
			}
		}
		else
		{
			this.activeImage = '';
			this.style.content = '';
		}
	}
});


/**
 * Default image URL, this image will be shown immediately and the regular image will be shown when available.
 * Using this will override any CSS content:url applied to the element as this is used internally by o5-image.
 * @property {String} defaultSrc
 */
Object.defineProperty(o5.gui.controls.Image.prototype, "defaultSrc", {
	get: function get ()
	{
		
		return this._defaultSrc ? this._defaultSrc : '';
	},
	set: function set (val)
	{
		this._defaultSrc = val;
		
		if (!this.activeImage)
		{
			this.style.content = 'url("' + this._defaultSrc + '")';
		
			this.activeImage = 'default';
		}
	}
});

/**
 * Alternate image URL, this image will be shown in case the primary image set with src attribute fails to load for any reason.
 * This will not work if the image is set using CSS content:url.
 * @property {String} altSrc
 */
Object.defineProperty(o5.gui.controls.Image.prototype, "altSrc", {
	get: function get ()
	{
		return this._altSrc ? this._altSrc : '';
	},
	set: function set (val)
	{
		this._altSrc = val;
		
		if (this._altSrc)
		{
		}
		else
		{
			delete this._altSrcXHR;
			
			this.queueReflowSet(function ()
			{
				this.activeImage = '';
				this.style.content = '';
			});
		}
	}
});



/**
 * Optional retry timeout in milliseconds in case the "src" image fails to download for any reason.
 * Set it to null to not retry.
 * @property {Number} [retry=null]
 */
Object.defineProperty(o5.gui.controls.Image.prototype, 'retry', {
	get: function () {
		return this._retry || 1;
	},
	set: function (val) {
		this._retry = val;
	},
	enumerable: true
});



/**
 * Optional limit to retries, if o5.gui.controls.Image.retry is not null.
 * Set it to null to keep trying to download the image until it succeededs.
 * @property {Number} [retryLimit=null]
 */
Object.defineProperty(o5.gui.controls.Image.prototype, 'retryLimit', {
	get: function () {
		return this._retryLimit || 2;
	},
	set: function (val) {
		this._retryLimit = val;
	},
	enumerable: true
});



/**
 * Alternate HTML content used when the image is not available, its value will be assigned to the innerHTML property in such cases.
 * This will not work if the image is set using CSS content:url.
 * @property {String} altHTML
 */
Object.defineProperty(o5.gui.controls.Image.prototype, "altHTML", {
	get: function () {
		
		return this._altHTML ? this._altHTML : '';
	},
	set: function (val) {
		
		if(val)
		{
			this._altHTML = val;
		}
		else
		{
			delete this._altHTML;
		}
	}
});


/**
 * Alternate text content used when the image is not available, its value will be assigned to the textContent property in such cases.
 * This will not work if the image is set using CSS content:url.
 * @property {String} alt
 */
Object.defineProperty(o5.gui.controls.Image.prototype, "alt", {
	get: function () {
		
		return this._alt ? this._alt : '';
	},
	set: function (val) {
		
		if(val)
		{
			this._alt = val;
		}
		else
		{
			delete this._alt;
		}
	}
});


/*
 * Public methods
 */



/*
 * Private properties
 */



/*
 * Private methods
 */
//attention, this function is called bound to the img object
o5.gui.controls.Image.prototype._srcLoaded = function _srcLoaded (e)
{
	if(!this.tag)
		return;

	if (this.tag._mediaFragment)
	{
		if (this.tag._mediaFragmentImage)
		{
			this.tag.removeChild(this.tag._mediaFragmentImage);
			delete this.tag._mediaFragmentImage;
		}
		
		this.tag.style.content = '';
		
		this.tag._mediaFragmentImage = this.tag.ownerDocument.createElement('div');
		
		this.tag.appendChild(this.tag._mediaFragmentImage);
		
	    if (this.tag._mediaFragment.unit === 'pixel:')
	    {
			this.tag._mediaFragmentImage.style.width = this.tag._mediaFragment.w + 'px';
			this.tag._mediaFragmentImage.style.height = this.tag._mediaFragment.h + 'px';
			this.tag._mediaFragmentImage.style.backgroundPosition = (-this.tag._mediaFragment.x) + 'px ' + (-this.tag._mediaFragment.y) + 'px';
	    }
	    else
	    {
			this.tag._mediaFragmentImage.style.width = (this.naturalWidth * this.tag._mediaFragment.w / 100) + 'px';
			this.tag._mediaFragmentImage.style.height = (this.naturalHeight * this.tag._mediaFragment.h / 100) + 'px';
			this.tag._mediaFragmentImage.style.backgroundPosition =
				(-this.naturalWidth * this.tag._mediaFragment.x / 100) + 'px ' + (-this.naturalHeight * this.tag._mediaFragment.y / 100) + 'px';
		}
		
		this.tag._mediaFragmentImage.style.backgroundImage = 'url("' + this.tag._src + '")';
		this.tag._mediaFragmentImage.style.backgroundRepeat = 'no-repeat';
	}
	else
	{
		this.tag.style.content = 'url("' + this.tag._src + '")';
	}
	
	this.tag.activeImage = 'src';
	delete this._retryCount;
};

//attention, this function is called bound to the img object
o5.gui.controls.Image.prototype._srcFailed = function _srcFailed (e)
{
	if(!this.tag)
		return;
	
	if(this.tag._altHTML)
	{
		this.tag.innerHTML = this.tag._altHTML;
	}
	
	if(this.tag._alt)
	{
		this.tag.textContent = this.tag._alt;
	}
	
	if(this.tag._altSrc)
	{
        this.tag._altSrcIMG = this.tag.ownerDocument.createElement('img');
        this.tag._altSrcIMG.onload = this.tag._altSrcLoaded;
        this.tag._altSrcIMG.tag = this.tag;
        this.tag._altSrcIMG.src = this.tag._altSrc;
	}
	else if(!this.tag._defaultSrc)
	{
		this.tag.style.content = '';
	}
	
	if(this.tag.retry != null)
	{
		var timeout = this.tag.retry;
		
		if(this._retryCount)
		{
			timeout = Math.round((Math.random() + 1) * timeout * Math.pow(2, this._retryCount++));
			timeout = Math.min(timeout, 60 * 60 * 1000);
		}
		else
		{
			this._retryCount = 1;
		}
		
		if(!(this.tag.retryLimit && this._retryCount >= this.tag.retryLimit))
		{
			setTimeout(function(){
				this.tag._srcIMG.src = this.tag._src;
			}.bind(this), timeout);
		}
	}
};

//attention, this function is called bound to the img object
o5.gui.controls.Image.prototype._altSrcLoaded = function _altSrcLoaded (e)
{
	this.tag.style.content = 'url("' + this.tag._altSrc + '")';
	
	this.tag.activeImage = 'alt';
};




