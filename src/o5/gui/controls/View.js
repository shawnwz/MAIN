/**
 * `<o5-view>` is a custom element that works as the controller for O5.js Views (Based on PAC pattern)
 *
 * Creates an element in markup for representing a view in O5.js application
 *
 * Example markup:
 *
 *     <o5-view id="myView">
 *         <!-- other components /-->
 *     </o5-view>
 *
 * @class o5.gui.controls.View
 * @author lmayle
 * @extends o5.gui.controls.Control
 */

o5.gui.controls.View = function View () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.View);

//o5.log.setAll(o5.gui.controls.View, true);

o5.gui.controls.View.prototype.createdCallback = function createdCallback ()
{
	this.logEntry();
	
	this.superCall();
	
	this.tabIndex = -1;
	
	if (this._useACLayers)
	{
		this.style.willChange = 'transform';
	}
	if (document.activeElement === this.parentElement)
	{
		this.focus();
	}
};


//o5.gui.controls.View.prototype._onActivate = function _onActivate() { };

//o5.gui.controls.View.prototype._onDeactivate = function _onDeactivate() { };

//o5.gui.controls.View.prototype._onActivate = function _onActivate() { };

//o5.gui.controls.View.prototype._onDeactivate = function _onDeactivate() { };


/*
 * Public properties
 */
o5.gui.controls.Control.defineBooleanPropertyWithAttribute(o5.gui.controls.View.prototype, 'preview');

o5.gui.controls.Control.defineBooleanPropertyWithAttribute(o5.gui.controls.View.prototype, 'active');

Object.defineProperty(o5.gui.controls.View.prototype, 'arguments', {
	get: function get ()
	{

		return this.parentElement._lastArguments || { };
	},
	enumerable: true
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
o5.gui.controls.View.prototype.show = function show ()
{
	this.logEntry();
	
	this.queueReflowSet(function ()
	{
		this.hidden = false;
	});
};
o5.gui.controls.View.prototype.hide = function hide ()
{
	this.logEntry();
	
	this.queueReflowSet(function ()
	{
		this.hidden = true;
	});
};
