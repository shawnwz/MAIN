/**
 * Control is the base class for all controls in the framework.
 * It defines common methods and properties for O5.js controls.
 * It inherits from HTMLElement as all o5.js controls are HTML5 Custom Elements.
 *
 * @class o5.gui.controls.Control
 * @extends HTMLElement
 *
 * @author lmayle
 */

o5.gui.controls.Control = class Control extends HTMLElement {
//	constructor () {
//		super();
//	}
};

/**
 * @method createdCallback
 * @private
 */
o5.gui.controls.Control.prototype.createdCallback = function createdCallback ()
{
	//must put this behind an option
//	o5.gui.controls.Control._instances.push(this);
	
	//special properties
	if (this._templatePropertiesWithDataAttribute)
	{
		for (var that = this.__proto__; that && that !== HTMLElement.prototype; that = that.__proto__)
		{
			var prop = Object.getOwnPropertyDescriptor(that, '_templatePropertiesWithDataAttribute');
			
			if (!prop || !prop.value)
				continue;
			
			prop.value.some(function (p)
			{
				if (!this[p.internalName] && p.options.querySelector)
				{
					this[p.internalName] = this.querySelector(p.options.querySelector);
					
					if (this[p.internalName] && this[p.internalName].content.childElementCount === 1 &&
						(this[p.internalName].content.firstElementChild.localName === p.options.template.tagName ||
							o5.gui.controls.Control.inheritsFrom(this[p.internalName].content.firstElementChild.localName, p.options.template.tagName)
						))
					{
						this[p.resolvedElementName] = this[p.internalName].content.firstElementChild;
					}
					else
					{
						this[p.resolvedElementName] = this.ownerDocument.createElement(p.options.template.tagName);
						
						if (this[p.internalName])
						{
							this[p.resolvedElementName].innerHTML = this[p.internalName].innerHTML;
						}
						else
						{
							this[p.internalName] = this[p.resolvedElementName];
						}
					}
					
					if(this[p.resolvedElementName].cloneNode !== Node.prototype.cloneNode)
					{
						this[p.resolvedElementName].cloneNode = Node.prototype.cloneNode
					}
					
//					return true;
				}
				
			}, this);
		}
	}
};




/*
 * Public properties
 */
/**
 * The ownerView read-only property returns the o5-view object which contains this control.
 * If this control is not inside an o5-view, the result is null.
 * @property {o5.gui.controls.View} ownerView
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Control.prototype, "ownerView", {
	get: function get ()
	{

		for (var parent = this.parentElement; parent; parent = parent.parentElement)
		{
			if (o5.gui.controls.View.prototype.isPrototypeOf(parent))
				return parent;
		}

		return null;
	}
});


/*
 * Public methods
 */
/**
 * @method updateLayout
 * Updates the internal layout, if needed.
 * Controls which does some layout in JavaScript, like o5.gui.controls.List, may require a forced layout update in some cases
 * 	since there is no general event from the browser for style changes
 * @async
 */
o5.gui.controls.Control.prototype.updateLayout = function updateLayout () { };

/**
 * @method fade
 */
o5.gui.controls.Control.prototype.fade = function fade (opacity)
{
	this.queueReflowSet(this._fadeSet, opacity);
};

/**
 * @method fadeIn
 */
o5.gui.controls.Control.prototype.fadeIn = function fadeIn ()
{
	this.queueReflowSet(this._fadeSet, 1);
};

/**
 * @method fadeOut
 */
o5.gui.controls.Control.prototype.fadeOut = function fadeOut ()
{
	this.queueReflowSet(this._fadeSet, 0);
};

/**
 * @method show
 */
o5.gui.controls.Control.prototype.show = function show ()
{
	this.logEntry();
	
	this.queueReflowSet(function ()
	{
		this.hidden = false;
	});
};

/**
 * @method hide
 */
o5.gui.controls.Control.prototype.hide = function hide ()
{
	this.logEntry();
	
	this.queueReflowSet(function ()
	{
		this.hidden = true;
	});
};

/**
 * @method blur
 */
o5.gui.controls.Control.prototype.blur = function blur ()
{
	this.logEntry();
	
	if (this.ownerView)
		this.ownerView.focus();
	else
		this.superCall();
};

/*
 * Private properties
 */



/*
 * Private methods
 */
/**
 * @method attributeChangedCallback
 * @param {String} name Name of the attribute which changed
 * @param {String} oldValue Previous value, can be null
 * @param {String} newValue New value, can be null
 * @private
 */
o5.gui.controls.Control.prototype.attributeChangedCallback = function attributeChangedCallback (name, oldValue, newValue)
{
//	this.logEntry();
	
	// this code needs performance improvements
	
	//only custom attributes are handled by this code at the moment
	if (name.indexOf("-") === -1)
		return;
	
	//special properties
	if (this._propertiesWithDataAttribute)
	{
		for (var that = this.__proto__; that && that !== HTMLElement.prototype; that = that.__proto__)
		{
			var prop = Object.getOwnPropertyDescriptor(that, '_propertiesWithDataAttribute');
			
			if (!prop || !prop.value)
				continue;
			
			if (prop.value.some(function (p)
			{
				if (p.attributeName !== name)
					return false;
				
				if (newValue !== p.options.toAttribute.call(this, this[p.propertyName]))
				{
					if (p.options.set)
					{
						p.options.set.call(this, newValue);
					}
					else
					{
						this[p.internalName] = newValue;
					}
				}
				
				return true;
				
			}, this))
				return;
		}
	}
	
	if (this._booleanPropertiesWithDataAttribute)
	{
		for (var that = this.__proto__; that && that !== HTMLElement.prototype; that = that.__proto__)
		{
			var prop = Object.getOwnPropertyDescriptor(that, '_booleanPropertiesWithDataAttribute');
			
			if (!prop || !prop.value)
				continue;
			
			if (prop.value.some(function (p)
			{
				if (p.attributeName !== name)
					return false;
				
				if (p.options.set)
				{
					p.options.set.call(this, this.dataset[p.propertyName] !== undefined);
				}
				else
				{
					this[p.internalName] = this.dataset[p.propertyName] !== undefined;
				}
				
				return true;
				
			}, this))
				return;
		}
	}

	if (this._templatePropertiesWithDataAttribute)
	{
		for (var that = this.__proto__; that && that !== HTMLElement.prototype; that = that.__proto__)
		{
			var prop = Object.getOwnPropertyDescriptor(that, '_templatePropertiesWithDataAttribute');
			
			if (!prop || !prop.value)
				continue;
			
			if (prop.value.some(function (tag)
			{
				if (tag.attributeName !== name)
					return false;
				
				if (this[tag.resolvedElementName] && this[tag.resolvedElementName].localName === newValue)
					return true;
				
	    		this[tag.internalName] = this.ownerDocument.createElement("template");
	    		this[tag.internalName].setAttribute('name', name);
	    		this[tag.resolvedElementName] = this[tag.internalName].content.ownerDocument.createElement(newValue);
	    		this[tag.internalName].content.appendChild(this[tag.resolvedElementName]);
	    		this.appendChild(this[tag.internalName]);
	    		
	    		return true;

			}, this))
				return;
		}
	}
};


o5.gui.controls.Control._controls = [];

o5.gui.controls.Control._instances = [];

o5.gui.controls.Control.listUnusedPrototypes = function listUnusedControls ()
{
	for (var c in o5.gui.controls.Control._controls)
    {
        var proto = o5.gui.controls.Control._controls[c].ctor.prototype;

    	var found = false;

        for (var i in o5.gui.controls.Control._instances)
        {
        	var inst = o5.gui.controls.Control._instances[i];

        	//eslint-disable-next-line no-cond-assign
        	if (found = proto.isPrototypeOf(inst))
        	{
        		break;
        	}
        }

    	if (!found)
    	{
    		this.log("no instance of " + (proto.constructor.name ? proto.constructor.name : proto._name));
    	}
    }
};

//temporary placement to reduce overhead
if (o5.$.scriptDataset.guiAnimations !== 'disabled')
{
	o5.gui.controls.Control.prototype._animate = true;
}


o5.gui.controls.Control.prototype._animationDurationMS = 250;

o5.gui.controls.Control.prototype._useACLayers = true;

o5.gui.controls.Control.prototype._useTransitions = true;


o5.gui.controls.Control.prototype._templatePropertiesWithDataAttribute = null;

o5.gui.controls.Control.prototype._booleanPropertiesWithDataAttribute = null;

//o5.gui.controls.Control.prototype.attributeChangedCallback = function attributeChangedCallback ()
//{
//}


/**
 * This method is used to register all custom elements to the current document
 * @method registerElements
 * @param {HTMLDocument} doc Document on which to register the custom elements
 * @ignore
 */
o5.gui.controls.registerElements = function registerElements (doc)
{
	if (!doc.__o5ControlsSet)
	{
		doc.__o5ControlsSet = new Set();
	}
	
    for (var idx in o5.gui.controls.Control._controls)
    {
        var el = o5.gui.controls.Control._controls[idx];

//        if (el.registered)
//            continue;

//        el.registered = true;
        
        if (!doc.__o5ControlsSet.has(el))
        {
        	doc.registerElement(el.tagName, { prototype: el.ctor.prototype });
        	doc.__o5ControlsSet.add(el);
        }
    }
};

/**
 * Registers a given Control as a Custom Element to be used with O5.js
 * The name of the element will start with given prefix followed by the name of the Object's constructor converted to HTML identifier format
 * @method registerAppControl
 * @param {Object} control The object which prototype will be used by the registered element
 * @param {Object} [base] Existing control which this control extends from, use null for default
 * @param {String} [tagNamePrefix] The prefix used for the HTML tag name of the registered element, use null for default (app)
 * @param {Boolean} [copyCSS] Copy existing CSS rules from the base Control and apply to this application control
 * @static
 */
o5.gui.controls.Control.registerAppControl = function registerAppControl (control, base, tagNamePrefix, copyCSS)
{
	if (!tagNamePrefix)
	{
		tagNamePrefix = 'app';
	}

	this.registerControl(control, base, tagNamePrefix, copyCSS);

	//temporary code to support legacy gui objects, otherwise registration could be done immediately inside registerControl
	o5.gui.controls.registerElements(document);
};

/**
 * Registers a given Control as a Custom Element to be used with O5.js
 * The name of the element will start with given prefix followed by the name of the Object's constructor converted to HTML identifier format
 * @method registerO5Control
 * @param {Object} control The object which prototype will be used by the registered element
 * @param {Object} [base] Existing control which this control extends from
 * @static
 * @private
 */
o5.gui.controls.Control.registerO5Control = function registerO5Control (control, base)
{
	this.registerControl(control, base, 'o5');

	//temporary code to support legacy gui objects, otherwise registration could be done immediately inside registerControl
	o5.gui.controls.registerElements(document);
};

/**
 * Registers a given Control as a Custom Element to be used with O5.js
 * The name of the element will start with given prefix followed by the name of the Object's constructor converted to HTML identifier format
 * @method registerControl
 * @param {Object} control The object which prototype will be used by the registered element
 * @param {Object} [base] Existing control which this control extends from, all controls must inherit from o5.gui.controls.Control or one of its sub classes
 * @param {String} [tagNamePrefix] The prefix used for HTML tag name of the registered element
 * @param {Boolean} [copyCSS] If set to true, existing CSS rules from the base element will be cloned for the new element
 * @static
 * @private
 */
o5.gui.controls.Control.registerControl = function registerControl (control, base, tagNamePrefix, copyCSS)
{
	var name = control.name ? control.name : control.prototype._name;

	if (!o5.gui.controls.Control.isPrototypeOf(control))
	{
		if (!base)
		{
			base = o5.gui.controls.Control;
		}
	}
	else
	{
		base = control.__proto__;
	}

	control.tagName = tagNamePrefix + '-' + name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	control.__superclass__ = base;

	o5.gui.controls.Control._controls.push({
		name: name,
		ctor: control,
		tagName: control.tagName
	});

	var prot = control.prototype;

	if (prot.__proto__ !== base.prototype)
	{
		while (prot.__proto__ !== Object.prototype && prot.__proto__ !== o5.gui.controls.Control.prototype)
		{
			prot = prot.__proto__;
		}
	
		prot.__proto__ = base.prototype;
	}

	if (copyCSS)
	{
		if (base.tagName)
		{
			var sheets = [].slice.call(document.styleSheets);

			for (var items = sheets, item, i = 0; (item = items[i]) !== undefined; i++)
			{
				for (var items2 = item.rules, item2, j = 0; (item2 = items2[j]) !== undefined; j++)
				{
					if (item2.selectorText && item2.selectorText.indexOf(base.tagName) !== -1)
					{
						item.insertRule(item2.cssText.replace(base.tagName, control.tagName), item.rules.length);
					}
				}
			}
		}
	}
};


/**
 * The super attribute mimics the base behavior of the ES6 super keyword,
 * returning the prototype up in the chain from the caller method.
 *
 * Attention, it caches the [[HomeObject]] reference, so it doesn't support
 * having the same Function Object assigned to multiple prototypes.
 * @property {Object prototype} super
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Control.prototype, "super", {
	get: function get ()
	{
		var caller = get.caller;
		var name = caller.name;

		if (!name)
		{
			throw "Caller method must be named";
		}

		if (caller.__homeObject__)
		{
			return caller.__homeObject__.prototype.__proto__;
		}

		for (var proto = this; proto; proto = proto.__proto__)
		{
			if (proto.hasOwnProperty(name) && proto[name] === caller)
			{
				caller.__homeObject__ = proto.constructor;

				return proto.__proto__;
			}
		}

		return null;
	}
});

/**
 * The superCall attribute mimics the superCall behavior of the ES6 super keyword,
 * returning a bind on the method up in the chain from the caller method.
 *
 * Attention, it caches the [[HomeObject]] reference, so it doesn't support
 * having the same Function Object assigned to multiple prototypes
 * or changes to prototype chain afterwards.
 * @property {Function} superCall
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Control.prototype, "superCall", {
	get: function get ()
	{
		var caller = get.caller;

		if (caller.__homeObject__)
		{
			if (!caller.__superCall__)
			{
				caller.__superCall__ = caller.__homeObject__.prototype.__proto__[caller.name];
			}
			
			return caller.__superCall__.bind(this);
		}
		else
		{
			var name = caller.name;
			var proto = null;

			if (!name)
			{
				throw new TypeError('Caller function must be named');
			}

			for (proto = this; proto; proto = proto.__proto__)
			{
				if (proto.hasOwnProperty(name) && proto[name] === caller)
				{
					caller.__homeObject__ = proto.constructor;

					proto = proto.__proto__;
					
					caller.__superCall__ = proto[name];

					return caller.__superCall__.bind(this);
				}
			}
			
			throw new TypeError('Cannot find base function for superCall');
		}

		//return null;
	}
});



/**
 * Parent Control of this Control or null if this is a top level Control
 * @property {o5.gui.controls.Control} parentControl
 * @readonly
 */
Object.defineProperty(o5.gui.controls.Control.prototype, "parentControl", {
	get: function get ()
	{
		for (var parent = this.parentElement; parent; parent = parent.parentElement)
		{
			if (o5.gui.controls.Control.prototype.isPrototypeOf(parent))
				return parent;
		}

		return null;
	}
});


// eslint-disable-next-line valid-jsdoc, not to document the return value, this is for legacy support only
/**
 * Moves the Control to the new location, with animation if enabled/supported
 * @method move
 * @param {Number} newX the new x coordinate
 * @param {Number} newY the new y coordinate
 */
o5.gui.controls.Control.prototype.move = function move (newX, newY)
{
	this._newX = newX;
	this._newY = newY;

	if (this._animate && (this._animationDurationMS > 0) && this.offsetParent)
	{
		this.queueReflowPrep(this._movePrep, { newX: newX, newY: newY });
	}
	else
	{
		this.queueReflowSet(this._moveEnd);
	}

	//for legacy support, remove later
	return this;
};

o5.gui.controls.Control._reflowPrep = [];
o5.gui.controls.Control._reflowSet = [];
o5.gui.controls.Control._reflowPost = [];
o5.gui.controls.Control._reflowClean = [];
o5.gui.controls.Control._animFrame = null;

//warning, this function is called bound to Control constructor object for performance reasons
o5.gui.controls.Control._reflowStep = function ()
{
	var item;

	//eslint-disable-next-line no-cond-assign
	while (item = this._reflowClean.shift())
//	for(var i = 0, arr = this._reflowClean; i < arr.length; i++)
//	var arr = this._reflowClean, i = arr.length; while(i--)
//	for (var i = 0, item; item = this._reflowClean[i]; ++i)
	{
//		var item = arr[i];
		item.callback.call(item.target, item.tag);
	}
//	this._reflowClean.length = 0;

	//eslint-disable-next-line no-cond-assign
	while (item = this._reflowPrep.shift())
//	for(var i = 0, arr = this._reflowPrep; i < arr.length; i++)
//	var arr = this._reflowPrep, i = arr.length; while(i--)
//	for (var i = 0, item; item = this._reflowPrep[i]; ++i)
	{
//		var item = arr[i];
		item.callback.call(item.target, item.tag);
	}
//	this._reflowPrep.length = 0;

	//eslint-disable-next-line no-cond-assign
	while (item = this._reflowSet.shift())
//	for(var i = 0, arr = this._reflowSet; i < arr.length; i++)
//	var arr = this._reflowSet, i = arr.length; while(i--)
//	for (var i = 0, item; item = this._reflowSet[i]; ++i)
	{
//		var item = arr[i];
		item.callback.call(item.target, item.tag);
	}
//	this._reflowSet.length = 0;

	//eslint-disable-next-line no-cond-assign
	while (item = this._reflowPost.shift())
//	for(var i = 0, arr = this._reflowPost; i < arr.length; i++)
//	var arr = this._reflowPost, i = arr.length; while(i--)
//	for (var i = 0, item; item = this._reflowPost[i]; ++i)
	{
//		var item = arr[i];
		item.callback.call(item.target, item.tag);
	}
//	this._reflowPost.length = 0;
	
	//if there are newly inserted requests, request frame again
	if (this._reflowSet.length || this._reflowPrep.length || this._reflowPost.length || this._reflowClean.length)
	{
		this._animFrame = window.requestAnimationFrame(this._reflowStep.bind(this));
	}
	else
	{
		this._animFrame = null;
	}
};

o5.gui.controls.Control.prototype.queueReflowPrep = function queueReflowPrep (callback, tag)
{
//	o5.gui.controls.Control._reflowPrep[o5.gui.controls.Control._reflowPrep.length] = { target: this, callback: callback, tag: tag };
	o5.gui.controls.Control._reflowPrep.push({ target: this, callback: callback, tag: tag });

	if (!o5.gui.controls.Control._animFrame)
		o5.gui.controls.Control._animFrame = window.requestAnimationFrame(o5.gui.controls.Control._reflowStep.bind(o5.gui.controls.Control));
};

o5.gui.controls.Control.prototype.queueReflowSet = function queueReflowSet (callback, tag)
{
//	o5.gui.controls.Control._reflowSet[o5.gui.controls.Control._reflowSet.length] = { target: this, callback: callback, tag: tag };
	o5.gui.controls.Control._reflowSet.push({ target: this, callback: callback, tag: tag });

	if (!o5.gui.controls.Control._animFrame)
		o5.gui.controls.Control._animFrame = window.requestAnimationFrame(o5.gui.controls.Control._reflowStep.bind(o5.gui.controls.Control));
};

o5.gui.controls.Control.prototype.queueReflowPost = function queueReflowPost (callback, tag)
{
//	o5.gui.controls.Control._reflowPost[o5.gui.controls.Control._reflowSet.length] = { target: this, callback: callback, tag: tag };
	o5.gui.controls.Control._reflowPost.push({ target: this, callback: callback, tag: tag });

	if (!o5.gui.controls.Control._animFrame)
		o5.gui.controls.Control._animFrame = window.requestAnimationFrame(o5.gui.controls.Control._reflowStep.bind(o5.gui.controls.Control));
};

o5.gui.controls.Control.prototype.queueReflowClean = function queueReflowClean (callback, tag)
{
//	o5.gui.controls.Control._reflowClean[o5.gui.controls.Control._reflowClean.length] = { target: this, callback: callback, tag: tag };
	o5.gui.controls.Control._reflowClean.push({ target: this, callback: callback, tag: tag });

	if (!o5.gui.controls.Control._animFrame)
		o5.gui.controls.Control._animFrame = window.requestAnimationFrame(o5.gui.controls.Control._reflowStep.bind(o5.gui.controls.Control));
};

o5.gui.controls.Control.prototype._movePrep = function _movePrep (tag)
{
	var dx = tag.newX - this.offsetLeft;
	var dy = tag.newY - this.offsetTop;

	if (dx || dy || this._animCss)
	{
		this._animCss = 'transition: -webkit-transform ' + this._animationDurationMS + 'ms; ' +
			'-webkit-transform: translate3d(' + dx + 'px, ' + dy + 'px, 0)';

		this.addEventListener("webkitTransitionEnd", this._transitionEnd);

		this.queueReflowSet(this._moveSet);
	}
	else
	{
		this.queueReflowClean(this._moveEnd);
	}
};

o5.gui.controls.Control.prototype._moveSet = function _moveSet (tag)
{
	this.style.cssText += this._animCss;
};

o5.gui.controls.Control.prototype._moveEnd = function _moveEnd (tag)
{
	this._animCss = '';

	this.style.cssText += '-webkit-transform: translateZ(0); -webkit-transition: initial; ' +
		'left: ' + this._newX + 'px; top: ' + this._newY + 'px; ';

	if (this._moveAnim && this._moveAnim._animatedCallback)
	{
		this._moveAnim._animatedCallback();
	}
};

o5.gui.controls.Control.prototype._transitionEnd = function (e)
{
	if (e && e.target !== this)
		return;
	
	if (e && e.propertyName !== 'transform')
		return;
	
	this.queueReflowClean(this._moveEnd);

	this.removeEventListener("webkitTransitionEnd", this._transitionEnd);
};

o5.gui.controls.Control.prototype._fadeSet = function _fadeSet (opacity)
{
	this.style.opacity = opacity;

	if (this._animate && (this._animationDurationMS > 0) /*&& this.offsetParent*/)
	{
		this.style.cssText += '-webkit-transition: opacity ' + this._animationDurationMS + 'ms; opacity: ' + opacity + ';';

		//needs improvements, we really only need one listener for all anims
		this.addEventListener("webkitTransitionEnd", this._fadeEnd);
	}
	else
	{
		this._fadeEnd();
	}
};

o5.gui.controls.Control.prototype._fadeEnd = function _fadeEnd (e)
{
	if (e && e.target !== this)
		return;
	
	if (e && e.propertyName !== 'opacity')
		return;
	
	if (this._fadeAnim && this._fadeAnim._animatedCallback)
	{
		setTimeout(this._fadeAnim._animatedCallback, 1);
	}

	this.removeEventListener("webkitTransitionEnd", this._fadeEnd);
};




o5.gui.controls.Control.inheritsFrom = function inheritsFrom (subclassTagName, baseclassTagName)
{
	// this code needs performance improvements
	
	var s = this._controls.filter(function _ (i) { return i.tagName === subclassTagName; })[0];
	var b = this._controls.filter(function _ (i) { return i.tagName === baseclassTagName; })[0];
	
	if (!s || !b)
		return false;
	
	s = s.ctor;
	b = b.ctor;
	
	return b.prototype.isPrototypeOf(s.prototype);
};




o5.gui.controls.Control.O5HTMLCollection = function O5HTMLCollection (parent, array)
{
	this._array = array;
};

Object.defineProperty(o5.gui.controls.Control.O5HTMLCollection.prototype, 'length', {
	get: function get ()
	{
        return this._array.length;
    }
});

o5.gui.controls.Control.O5HTMLCollection.prototype.item = function item (i)
{
    return null;
};

o5.gui.controls.Control.O5HTMLCollection.prototype.namedItem = function namedItem (name)
{
	return null;
};



o5.gui.controls.Control.definePropertyWithAttribute = function definePropertyWithAttribute (proto, name, options)
{
	options = options || {};

	var tag = {
		propertyName: name,
		internalName: '_' + name,
		attributeName: name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
		options: options
	};

	if (!options.toAttribute)
	{
		options.toAttribute = function toAttribute (val)
		{
			return val.toString();
		};
	}

	if (!options.fromAttribute)
	{
		options.fromAttribute = function fromAttribute (val)
		{
			return val;
		};
	}

	Object.defineProperty(proto, name, {
		get: function get ()
		{
			if (tag.options.get)
			{
				return tag.options.get.call(this);
			}
			else
			{
				return this[tag.internalName];
			}

		},
		set: function set (val)
		{
			if (tag.options.set)
			{
				tag.options.set.call(this, val);
			}
			else
			{
				this[tag.internalName] = val;
			}

			if (this[tag.internalName] != undefined)
				this.setAttribute(tag.attributeName, tag.options.toAttribute.call(this, this[tag.internalName]));
			else
				this.setAttribute(tag.attributeName, tag.options.toAttribute.call(this, tag.options.get.call(this, val)));
		},
		enumerable: true,
		configurable: false
	});
};

o5.gui.controls.Control.definePropertyWithDataAttribute = function definePropertyWithDataAttribute (proto, name, options)
{
	options = options || {};

	var tag = {
		propertyName: name,
		internalName: '_' + name,
		attributeName: 'data-' + name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
		options: options
	};
	
	if (!proto.hasOwnProperty('_propertiesWithDataAttribute'))
		proto._propertiesWithDataAttribute = [];
		
	proto._propertiesWithDataAttribute.push(tag);

	if (!options.toAttribute)
	{
		options.toAttribute = function toAttribute (val)
		{
			return val.toString();
		};
	}

	if (!options.fromAttribute)
	{
		options.fromAttribute = function fromAttribute (val)
		{
			return val;
		};
	}

	Object.defineProperty(proto, name, {
		get: function get ()
		{
			var ret;

			if (tag.options.get)
			{
				ret = tag.options.get.call(this);
			}
			else
			{
				ret = this[tag.internalName];
			}

			return ret;
		},
		set: function set (val)
		{
			if (tag.options.set)
			{
				tag.options.set.call(this, val);
			}
			else
			{
				this[tag.internalName] = val;
			}

			
			if (this[tag.internalName] != undefined)
				this.dataset[tag.propertyName] = tag.options.toAttribute.call(this, this[tag.internalName]);
			else
				this.dataset[tag.propertyName] = tag.options.toAttribute.call(this, tag.options.get.call(this, val));
		},
		enumerable: true,
		configurable: false
	});
};



o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute = function defineTemplatePropertyWithDataAttribute (proto, name, options)
{
	options = options || {};

	var tag = {
		propertyName: name,
		internalName: '_' + name,
		resolvedElementName: '_' + name + 'Resolved',
		attributeName: 'data-' + name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
		options: options
	};
	
	if (!proto.hasOwnProperty('_templatePropertiesWithDataAttribute'))
		proto._templatePropertiesWithDataAttribute = [];
		
	proto._templatePropertiesWithDataAttribute.push(tag);

	if (!options.toAttribute)
	{
		options.toAttribute = function toAttribute (val)
		{
			return val.localName;
		};
	}

	if (!options.fromAttribute)
	{
		options.fromAttribute = function fromAttribute (val)
		{
			return val;
		};
	}

	Object.defineProperty(proto, name, {
		get: function get ()
		{
			return this[tag.resolvedElementName].localName;
		},
		set: function set (val)
		{
			if (tag.options.set)
			{
				tag.options.set.call(this, val);
			}
			else
			{
		    	if (typeof val === 'string')
		    	{
		    		this[tag.internalName] = this.ownerDocument.createElement("template");
		    		this[tag.internalName].setAttribute('name', name);
		    		this[tag.resolvedElementName] = this[tag.internalName].content.ownerDocument.createElement(val);
		    		this[tag.internalName].content.appendChild(this[tag.resolvedElementName]);
		    		this.appendChild(this[tag.internalName]);
		    	}
			}

			this.dataset[tag.propertyName] = tag.options.toAttribute.call(this, this[tag.resolvedElementName]);
		},
		enumerable: true,
		configurable: false
	});
};

o5.gui.controls.Control.defineBooleanPropertyWithAttribute = function defineBooleanPropertyWithAttribute (proto, name, options)
{
	options = options || {};

	var tag = {
		propertyName: name,
		internalName: '_' + name,
		attributeName: name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
		options: options
	};
	
	if (!proto.hasOwnProperty('_booleanPropertiesWithAttribute'))
		proto._booleanPropertiesWithAttribute = [];
		
	proto._booleanPropertiesWithAttribute.push(tag);

	Object.defineProperty(proto, name, {
		get: function get ()
		{
			var ret = this[tag.internalName];

			return ret;
		},
		set: function set (val)
		{
			if (tag.options.set)
			{
				tag.options.set.call(this, val);
			}
			else
			{
				this[tag.internalName] = val;
			}
			
			if (val)
				this.setAttribute(tag.attributeName, '');
			else
				this.removeAttribute(tag.attributeName);
		},
		enumerable: true,
		configurable: false
	});
};


o5.gui.controls.Control.defineBooleanPropertyWithDataAttribute = function defineBooleanPropertyWithDataAttribute (proto, name, options)
{
	options = options || {};

	var tag = {
		propertyName: name,
		internalName: '_' + name,
		attributeName: 'data-' + name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
		options: options
	};
	
	if (!proto.hasOwnProperty('_booleanPropertiesWithDataAttribute'))
		proto._booleanPropertiesWithDataAttribute = [];
		
	proto._booleanPropertiesWithDataAttribute.push(tag);

	Object.defineProperty(proto, name, {
		get: function get ()
		{
			var ret = this[tag.internalName];

			return ret;
		},
		set: function set (val)
		{
			if (tag.options.set)
			{
				tag.options.set.call(this, val);
			}
			else
			{
				if (val)
					this.setAttribute(tag.attributeName, '');
				else
					this.removeAttribute(tag.attributeName);
				
				this[tag.internalName] = val;
			}
		},
		enumerable: true,
		configurable: false
	});
};




/**
 * @class
 */
o5.gui.controls.Control.Transition = function Transition ()
{
	
};

