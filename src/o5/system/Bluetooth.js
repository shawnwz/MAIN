/**
 * @private Not for public use yet
 * @class o5.system.bluetooth
 * @singleton
 * @author lmayle
 */

o5.system.bluetooth = new class Bluetooth extends o5.EventTarget
{
	constructor()
	{
		super();
		
		this._batteryMonitorDelay = 60000;
		this._batteryMonitorNotificationThreshold = 30;
		this._batteryMonitorPreviousLevel = 100;
		this._batteryMonitorInterval = setInterval(this._batteryMonitor.bind(this), this._batteryMonitorDelay);

		//todo: CCOM BT initialization code
	}
	
	


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
	_batteryMonitor()
	{
		let batteryLevel = null;
		
		//todo: code to poll for RCU device and battery level
		
		if ((batteryLevel != null) &&
			(batteryLevel != this._batteryMonitorPreviousLevel))
		{
			this._batteryMonitorPreviousLevel = batteryLevel;
			
			if (batteryLevel < this._batteryMonitorNotificationThreshold)
			{
				this.dispatchEvent(new Event('lowbattery'));
			}
		}
	}
}();


/*
 * Events
 */
/**
 * Fired when the battery level changes and is bellow the low level threshold
 * 
 * Example :
 * 
 *  	o5.system.bluetooth.addEventListener('lowbattery', function (){ console.log('battery is low'); });
 * 
 * @event lowbattery
 */
