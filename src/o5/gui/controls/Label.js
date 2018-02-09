/**
 * Enhanced Label control, works like a HTMLSpan with additional features
 * 
 * Example markup for Label control is:
 * 
 * 	<o5-label></o5-label>
 * 
 * See below example of O5JS Label control.
 * 
 *     @example
 *     <o5-label id="eventlabel" style="background-color: #00aa00;">O5JS Label 1 ...</o5-label><br>
 *     <o5-label id="mylabel" style="background-color: #ffaa00;">O5JS Label 2 ...</o5-label><br>
 *     <o5-label id="jslabel" style="background-color: #ffaaff;">O5JS Label 3 ...</o5-label>
 *
 * For more details check Label example on [Getting Started Guide](#!/jsduck/examples).
 * 
 * @class o5.gui.controls.Label
 * @extends o5.gui.controls.Control
 *
 * @author lmayle
 */

o5.gui.controls.Label = function Label () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.Label);

o5.gui.controls.Label.prototype.createdCallback = function createdCallback ()
{
	this.superCall();

    //legacy stuff, to be removed
	this._innerElement = this;
    this._text = "";
    this._textOverflow = "none";
    this._alignment = o5.gui.controls.Label.ALIGN_LEFT;
};
