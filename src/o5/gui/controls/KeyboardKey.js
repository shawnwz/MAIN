/**
 * The KeyboardKey control is used by o5.gui.controls.Keyboard. Each key on the keyboard is of o5.gui.controls.KeyboardKey type.
 * 
 * @class o5.gui.controls.KeyboardKey
 * @extends o5.gui.controls.FlexGridCell
 *
 * @author kshipra
 */

o5.gui.controls.KeyboardKey = function KeyboardKey () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.KeyboardKey, o5.gui.controls.FlexGridCell);

//o5.gui.controls.KeyboardKey.prototype.createdCallback = function createdCallback()
//{
//	this.superCall();
//};


/*
 * Public properties
 */

/**
 * Gets or sets the value of each keyboard key.
 * 
 * @property value
 * @type {String}
 */
Object.defineProperty(o5.gui.controls.KeyboardKey.prototype, 'value', {
	get: function () {

		return this._value;
	},
	set: function (val) {

		this._value = val;
		
		this.dataset.keyValue = val;
	},
	enumerable: true
});


///**
// * Gets or sets the textContent attribute of each keyboard key.
// * 
// * @property displayValue
// * @type {String}
// */
//Object.defineProperty(o5.gui.controls.KeyboardKey.prototype, 'displayValue', {
//	get: function () {
//
//		return this.textContent;
//	},
//	set: function (val) {
//
////		this.textContent = val;
//	},
//	enumerable: true
//});


/*
 * Public methods
 */



/*
 * Private properties
 */



/*
 * Private methods
 */
