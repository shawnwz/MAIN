/**
 * The DigitalClock control of O5JS is used to display current time. The control will pick up the 
 * system time and display it. It will use the display format if provided, otherwise use 'hh:mm:ss' format. 
 * 
 * Example Markup for DigitalClock is: 
 * 
 * 	<o5-digital-clock></o5-digital-clock>
 * 
 * Check below code snippet to see O5JS DigitalClock functionality  
 * 
 * 	@example
 * 		<o5-digital-clock style="background-color: black; color:red"></o5-digital-clock> 
 * 		 
 * @class o5.gui.controls.DigitalClock
 * @extends o5.gui.controls.Control
 *
 * @author lmayle
 */

o5.gui.controls.DigitalClock = function DigitalClock () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.DigitalClock);

o5.gui.controls.DigitalClock.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
	
	if (this.dataset.format)	this.format 	= this.dataset.format;				else this.format 	= "hh:mm:ss";
	if (this.dataset.frequency)	this.frequency 	= parseInt(this.dataset.frequency);	else this.frequency = 1000;
	
	this._refresh();
	this._refreshInterval = this.ownerDocument.defaultView.setInterval(this._refresh.bind(this), this.frequency);
};

o5.gui.controls.DigitalClock.prototype._refresh = function _refresh ()
{
	var textContent = (new Date()).format(this.format);
	
	if (textContent != this._lastTextValue)
	{
		this._lastTextValue = textContent;
	
		this.innerHTML = textContent;
	}
};
