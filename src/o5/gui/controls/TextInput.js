/**
 * The TextInput control extends {@link o5.gui.controls.Label} control.
 * 
 * Example markup for TextInput control is:
 * 
 * 		<o5-text-input></o5-text-input>		
 *
 * Check below example of TextInput control.
 * 
 *     @example
 *     <o5-text-input style="width: 400px; height: 30px; margin: 10px 5px 0px 10px; border:1px solid black; background-color: #e6e6e6;"></o5-text-input>
 * 
 * @class o5.gui.controls.TextInput
 * @extends o5.gui.controls.Label
 *
 * @author lmayle
 */

o5.gui.controls.TextInput = function TextInput () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.TextInput, o5.gui.controls.Label);

o5.gui.controls.TextInput.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
	
	this._inputElement = this.ownerDocument.createElement('input');
	this._inputElement.style.cssText = 'width: 100%; \
		height: 100%; \
		padding: 0; \
		border: none; \
		background-color: transparent; \
		font: inherit; \
		position: absolute; ';
	this._inputElement.disabled = true;
	this.appendChild(this._inputElement);
};


/*
 * Public properties
 */
/**
 * Gets or sets the value of the input control.
 * @property value
 * @type {String}
 */
Object.defineProperty(o5.gui.controls.TextInput.prototype, 'value', {
	get: function get ()
	{
		return this._inputElement.value;
	},
	set: function set (val)
	{

		this._inputElement.value = val;
	},
	enumerable: true
});


/**
 * Gets or sets the type of the input control. The type of input control can be 
 * `text`, `password`, `email`, `url`, etc. Default type of input control is `text`.
 * @property type
 * @type {String}
 */
Object.defineProperty(o5.gui.controls.TextInput.prototype, 'type', {
	get: function get ()
	{

		return this._inputElement.type;
	},
	set: function set (val)
	{

		this._inputElement.type = val;
	},
	enumerable: true
});


/**
 * Gets or sets the placeholder of input control. The placeholder gives short message describing the expected value in the input control.
 * @property placeholder
 * @type {String}
 */
Object.defineProperty(o5.gui.controls.TextInput.prototype, 'placeholder', {
	get: function get ()
	{
		return this._inputElement.placeholder;
	},
	set: function set (val)
	{
		this._inputElement.placeholder = val;
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
