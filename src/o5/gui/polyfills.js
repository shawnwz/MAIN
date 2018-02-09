/**
 * O5.js GUI utilities
 *
 * @author lmayle
 * @ignore
 */


o5.$.initGUIPolyfills = function initGUIPolyfills (window, document)
{
	// polyfill for otvwebkit 11 which is missing these properties in template content
	if(!document.createElement('template').content.children)
	{
		Object.defineProperties(window.DocumentFragment.prototype, {
			childElementCount : {
				get : function() {
				    var count = 0;
				    
				    for (var node = this.firstChild; node; node = node.nextSibling)
				    	if(node.nodeType === 1)
				    		count++;
				    
				    return count;
				}
			},
			children : {
				get : function() {
					var arr = [];
				
					for (var node = this.firstChild; node; node = node.nextSibling)
						if (node.nodeType === 1)
							arr.push(node);
				
					return arr;
				}
			},
			firstElementChild : {
				get : function() {
					for (var node = this.firstChild; node; node = node.nextSibling)
						if (node.nodeType === 1)
							return node;
					
					return null;
				}
			},
			lastElementChild : {
				get : function() {
					for (var node = this.lastChild; node; node = node.previousSibling)
						if (node.nodeType === 1)
							return node;
					
					return null;
				}
			},
			nextElementSibling : {
				get : function() {
				    return null;
				}
			},
			previousElementSibling : {
				get : function() {
					return null;
				}
			}
		});
		
		Object.defineProperties(window.Document.prototype, {
			childElementCount : {
				get : function() {
				    var count = 0;
				    
				    for (var node = this.firstChild; node; node = node.nextSibling)
				    	if(node.nodeType === 1)
				    		count++;
				    
				    return count;
				}
			},
			children : {
				get : function() {
					var arr = [];
				
					for (var node = this.firstChild; node; node = node.nextSibling)
						if (node.nodeType === 1)
							arr.push(node);
				
					return arr;
				}
			},
			firstElementChild : {
				get : function() {
					for (var node = this.firstChild; node; node = node.nextSibling)
						if (node.nodeType === 1)
							return node;
					
					return null;
				}
			},
			lastElementChild : {
				get : function() {
					for (var node = this.lastChild; node; node = node.previousSibling)
						if (node.nodeType === 1)
							return node;
					
					return null;
				}
			},
			nextElementSibling : {
				get : function() {
				    return null;
				}
			},
			previousElementSibling : {
				get : function() {
					return null;
				}
			}
		});
	}
	
	// partial polyfill for willChange CSS
	if(document.createElement('div').style.willChange === undefined)
	{
		Object.defineProperty(window.CSSStyleDeclaration.prototype, "willChange", {
			get: function get () {
	
				return this._willChange || '';
			},
			set: function set (val) {
				
				this._willChange = val;
				
				if(val === 'contents' || val === 'transform')
				{
					this.webkitBackfaceVisibility = 'hidden';
					this.webkitPerspective = '1000';
				}
				else
				{
					this.webkitBackfaceVisibility = '';
					this.webkitPerspective = '';
				}
			}
		});
	}
};

o5.$.initGUIPolyfills(window, document);
