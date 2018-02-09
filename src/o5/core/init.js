/**
 * O5.js initialization code
 *
 * @author lmayle
 * @ignore
 */

//code for NW
if (window.nw || window.nwDispatcher)
{
	if (!sessionStorage.o5jsLoaded)
	{
		sessionStorage.o5jsLoaded = true;

//		window.resizeBy(640 - window.innerWidth, 360 - window.innerHeight);
	//	window.resizeBy(864 - window.innerWidth, 486 - window.innerHeight);
	//	window.resizeBy(960 - window.innerWidth, 540 - window.innerHeight);
		window.resizeBy(1280 - window.innerWidth, 720 - window.innerHeight);
	//	window.resizeBy(1920 - window.innerWidth, 1080 - window.innerHeight);
	//	window.resizeBy(3840 - window.innerWidth, 2160 - window.innerHeight);

		require('nw.gui').Window.get().showDevTools();
	}

	document.documentElement.style.backgroundColor = "black";

	//To prevent NW from opening an error page and unload the app in case of errors
	process.on('uncaughtException', function (err)
	{
		return true;
	});
	
	process._fatalException = function (er)
	{
		return true;
	};
	
	window.addEventListener("blur", function (e)
	{
//		this.log(e.target.toString() + ' ' + document.hasFocus());
////		e.target.focus(); // this crashes nw, must check why
//		if(!document.hasFocus())
//		{
//			e.stopImmediatePropagation();
////			if(e.target !== this)
////				e.target.focus();
//
//			return true;
//		}
//		else
//		{
//
//		}
	}, true);
}

//Base namespaces
window.o5 			= new (function OpenTV5js () { })();

o5.env				= new (function O5jsEnv () { })();

o5.gui				= new (function O5jsGUI () { })();
o5.gui.controls		= new (function O5jsGUIControls () { })();
o5.gui.util			= new (function O5jsGUIUtils () { })();

o5.data				= new (function O5jsData () { })();

o5.platform			= new (function O5jsPlatform () { })();
o5.platform.btv		= new (function O5jsPlatformBTV () { })();
o5.platform.ca		= new (function O5jsPlatformCA () { })();
o5.platform.input	= new (function O5jsPlatformInput () { })();
o5.platform.media	= new (function O5jsPlatformMedia () { })();
o5.platform.output	= new (function O5jsPlatformOutput () { })();
o5.platform.system	= new (function O5jsPlatformSystem () { })();


o5.system			= new (function O5jsSystem () { })();


o5.$				= new (function O5Internals () { })();

o5.$.init2Callbacks = [];

if (document.currentScript.dataset.path)
{
	o5.$.pathToFW = document.currentScript.dataset.path;
}
else
{
	o5.$.pathToFW = document.currentScript.attributes.src.value;
	o5.$.pathToFW = o5.$.pathToFW.substr(0, o5.$.pathToFW.lastIndexOf('/') + 1);
}

o5.$.scriptDataset = document.currentScript.dataset;


//Second level init, to be called after all O5.js files are parsed and CCOM object is ready to use
o5.$.init2 = function init2 ()
{
//	this.log();

	var func;
	
	//eslint-disable-next-line no-cond-assign
	while (func = o5.$.init2Callbacks.shift())
	{
		func();
	}

	if (o5.$.scriptDataset.fpsMeter === 'enabled')
	{
		o5.gui.util.fpsMeter.start();
	}
};


if ('application/ccom_html' in navigator.mimeTypes)
{
	//eslint-disable-next-line no-console
	console.log("O5.js: CCOM NP plugin found");

	o5.$.CCOMNPAPI = true;
	
	window.CCOM = document.createElement('embed');
	window.CCOM.id = 'CCOMid';
	window.CCOM.type = 'application/ccom_html';
	window.CCOM.hidden = true;
	window.CCOM.width = "0";
	window.CCOM.height = "0";
}
else if (typeof webkitGetObjectFromPlugin === "function")
{
	//eslint-disable-next-line no-console
	console.log("O5.js: CCOM JS plugin found");

	o5.$.CCOMJSGlue = true;
	
	window.CCOM = webkitGetObjectFromPlugin("application/ccom_HTML");
}
else
{
	//eslint-disable-next-line no-console
	console.log("O5.js: CCOM plugin not found, using stubs");

	o5.$.CCOMStubs = true;
}

if (!o5.$.CCOMStubs)
{
	o5.$.loadtrycount = 0;
	o5.$.tryLoad = function tryLoad ()
	{
		if (document.querySelector("[o5js]") && document.querySelector("[o5js]").filesCounter)
		{
			o5.$.loadtrycount++;

			if (o5.$.loadtrycount > 1000)
			{
				throw 'O5.js failed to load, unable to launch app';
			}

			setTimeout(o5.$.tryLoad, 100);
			return;
		}
		
		//CCOM needs some time to be usable, no event for this, keep trying until it works
		if (o5.$.CCOMNPAPI && !window.CCOM.Application)
		{
			o5.$.loadtrycount++;

			if (o5.$.loadtrycount > 20)
			{
				throw 'CCOM failed to load, unable to launch app';
			}

			setTimeout(o5.$.tryLoad, 100);
			return;
		}

		o5.$.init2();
		
		if (o5.$.onappload)
		{
			setTimeout(o5.$.onappload);
		}
		
		if (o5.$.scriptDataset.appLaunch)
		{
			setTimeout(o5.$.scriptDataset.appLaunch);
		}
	};

	//presence of body means this script is inserted in the body or it was declared as async/defer
	if (document.body)
	{
		o5.$.onappload = document.body.onload;
		document.body.onload = '';
		
		if (o5.$.CCOMNPAPI)
		{
			 document.body.insertBefore(window.CCOM, document.body.firstElementChild);
		}
		
//		o5.$.tryLoad();
		//temporary workaround for some Q4 regression where webkit crashes if we try to access CCOM too quickly
		setTimeout(o5.$.tryLoad, 3000);
	}
	else
	{
		document.addEventListener("DOMContentLoaded", function DOMContentLoaded (/*event*/)
		{
			o5.$.onappload = document.body.onload;
			document.body.onload = '';

			if (o5.$.CCOMNPAPI)
			{
				document.body.insertBefore(window.CCOM, document.body.firstElementChild);
			}

			o5.$.tryLoad();
		});
	}
}
else
{
	o5.$.tryLoad = function tryLoad ()
	{
		if (document.querySelector("[o5js]") && document.querySelector("[o5js]").filesCounter)
		{
			o5.$.loadtrycount++;

			if (o5.$.loadtrycount > 1000)
			{
				throw 'O5.js failed to load, unable to launch app';
			}

			setTimeout(o5.$.tryLoad, 100);
			return;
		}

		if (o5.$.scriptDataset.stubsData &&
			document.getElementById('o5-stubs-data') &&
			document.getElementById('o5-stubs-data').failed)
		{
			//eslint-disable-next-line no-console
			console.error("O5.js: Could not load custom stubs data, using default");
		}
			
		if (!(CCOM.stubs.stbData && CCOM.stubs.stbData.loaded))
		{
			o5.$.loadtrycount++;

			if (o5.$.loadtrycount > 20)
			{
				throw 'CCOM stb data failed to load completely, unable to launch app';
			}

			setTimeout(o5.$.tryLoad, 100);
			return;
		}

		o5.$.init2();
		
		if (o5.$.onappload)
		{
			setTimeout(o5.$.onappload);
		}
		
		if (o5.$.scriptDataset.appLaunch)
		{
 			setTimeout(o5.$.scriptDataset.appLaunch);
		}
	};

	//presence of body means this script is inserted in the body or it was declared as async/defer
	if (document.body)
	{
		o5.$.onappload = document.body.onload;
		document.body.onload = '';
		
		if (document.currentScript.dataset.stubsData)
		{
			o5.$.stubsDataScript = document.createElement('SCRIPT');
			
			o5.$.stubsDataScript.src = document.currentScript.dataset.stubsData;
			o5.$.stubsDataScript.onerror = 'this.failed = true;';
			o5.$.stubsDataScript.async = false;
			o5.$.stubsDataScript.id = 'o5-stubs-data';
			
			document.head.appendChild(o5.$.stubsDataScript);
		}
		
		o5.$.tryLoad();
	}
	else
	{
		if (document.currentScript.dataset.stubsData)
		{
			document.write('<script type="text/javascript" src="' + document.currentScript.dataset.stubsData + '" \
				onerror="this.failed = true;" \
				id=o5-stubs-data defer></script>');
		}

		document.addEventListener("DOMContentLoaded", function DOMContentLoaded (/*event*/)
		{
			o5.$.onappload = document.body.onload;
			document.body.onload = '';

			o5.$.tryLoad();
		});
	}
}
