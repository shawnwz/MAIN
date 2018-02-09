/**
 * O5.js GUI FPS Meter
 *
 * @author lmayle
 * @ignore
 */


o5.gui.util.fpsMeter = new (function fpsMeter ()
{
	
}) ();


o5.gui.util.fpsMeter.start = function start ()
{
	this._lastTime = performance.now();
	this._interval = 100;
	this._displayUpdateCoef = 10;
	this._displayUpdateCount = 0;
	this._intervalStart = this._lastTime;
	this._frames = 0;
	this._precision = 1 / 60 * 1000;
	
	this._historyLength = 3;
	
	this._historyLength = this._historyLength * (1000 / this._interval)
	this._history = new Array(this._historyLength);
	this._historyElements = [];
	
	this._panel = document.createElement('div');
	this._panel.style.cssText = 'position: fixed; left: 10px; top: 10px; width: 120px; height: 60px; overflow: hidden; z-index: 100; \
		background-color: black; outline: dimgray solid 2px; -webkit-transform: translateZ(0); color: gainsboro; text-align: right; font-family: monospace; ';
	document.body.appendChild(this._panel);
	
	for(var i = 0; i < this._historyLength; i++)
	{
		el = document.createElement('div');
		this._historyElements.push(el);
		this._panel.appendChild(el);
		el.style.cssText = 'position: absolute; bottom: -2px; width: 4px; height: 2px; overflow: hidden; z-index: 100; \
			background-color: lime; -webkit-transform: translateZ(0); ';
		el.style.left = (i * 4) + 'px';
	}
	
//	this._dot = this._panel.appendChild(document.createElement('div'));
//	this._dot.style.cssText = 'position: absolute; left: 0px; top: 0px; width: 10px; height: 10px; overflow: hidden; z-index: 200; \
//		background-color: red; -webkit-transform: translateZ(0); opacitya: 0.1; -webkit-animation: o5-scrolling-label-animation 1s linear infinite; ';
//	
	this._avg = this._panel.appendChild(document.createElement('div'));
	this._avg.textContent = 'avg';
	this._avg.style.cssText = 'position: absolute; left: 4px; top: 20px; z-index: 300; width: 60px; font-size: 15px; ';
	
	this._low = this._panel.appendChild(document.createElement('div'));
	this._low.textContent = 'low';
	this._low.style.cssText = 'position: absolute; left: 4px; top: 40px; z-index: 300; width: 60px; font-size: 15px; ';
	
	requestAnimationFrame(this._tick.bind(this));
};

o5.gui.util.fpsMeter._tick = function _tick (time)
{
	if(!time)
		time = performance.now();
	
	this._frames++;

	if(time - this._intervalStart >= this._interval - this._precision / 2)
	{
		this._history.shift();
		this._history.push(Math.round(this._frames * (1000 / this._interval)));
		
//		if(this._frames != 6)
//		{
//			console.log(1);
//		}
		
		if(this._displayUpdateCount == 0)
		{
//			console.log(time + ' ' + this._intervalStart + ' ' + (time - this._intervalStart) + ' ' + this._frames);
//			console.log(Math.round((time - this._intervalStart) / this._precision) + ' ' + Math.round(this._interval / this._precision));
			
			var low = null;
			var avg = null
			
			for(var i = 0; i < this._historyLength; i++)
			{
				var el = this._historyElements[i];
				var pos = 'translate3d(0px, ' + (-this._history[i]) + 'px, 0px)';
				
				if(i >= 20)
				{
					if(low == null || low > this._history[i])
						low = this._history[i];

					if(avg == null)
						avg = this._history[i];
					else
						avg += this._history[i];
				}
				
				if(el.style.webkitTransform != pos)
					el.style.webkitTransform = pos;
			}
			
			avg /= this._displayUpdateCoef;
			this._avg.textContent = Math.round(avg) + ' \u00D8fps';
			this._low.textContent = low + ' \u005efps';
		}
		this._displayUpdateCount++;
		this._displayUpdateCount = this._displayUpdateCount % this._displayUpdateCoef;
		
		this._frames = 0;
		this._intervalStart = time;
	}
	
	this._lastTime = time;
	
	requestAnimationFrame(this._tick.bind(this));
};








