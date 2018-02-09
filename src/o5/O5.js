/**
 * O5.js main entry point
 *
 * @author lmayle
 * @ignore
 */

if (!(window.self !== window.top && window.top.o5)) // top window, load the framework
{
	(function _o5jsload ()
	{
		document.currentScript.setAttribute('o5js', '');
		document.currentScript.filesCounter = 0;
		
		var path = document.currentScript.attributes.src.value;

		path = path.substr(0, path.lastIndexOf('/') + 1);

		var files;

		var xmlhttp = new XMLHttpRequest();

		xmlhttp.open("GET", path + 'files.json', false);
		xmlhttp.overrideMimeType('application/json');
		xmlhttp.send();

		if (xmlhttp.readyState === 4)
		{
			files = JSON.parse(xmlhttp.response);
		}
		else
		{
			throw "Can't load O5.js files";
		}
		
		var loadJSFile = function loadJSFile (src, async)
		{
			if (document.readyState == 'loading')
			{
				var insertion = '<script type="text/javascript" src="' + path + src + '" ';

				if (src.indexOf('init.js') !== -1)
				{
					insertion += 'data-path="' + path + '" ';
					
					for (var i = 0; i < document.currentScript.attributes.length; i++)
					{
						if (document.currentScript.attributes[i].name.substr(0, 5) === 'data-')
						{
							insertion += document.currentScript.attributes[i].name + '="' + document.currentScript.attributes[i].value + '" ';
						}
					}
				}
				
				insertion += 'onload="document.querySelector(\'[o5js]\').fileLoaded.call(this, event);" ';

				insertion += '></script>';
				
				document.write(insertion);
			}
			else
			{
				var script = document.createElement('SCRIPT');
				
				script.src = path + src;
				script.onload = function() { this.parentNode.removeChild(this); };
				script.onload = document.querySelector("[o5js]").fileLoaded;
				script.async = false;
				
				if (src.indexOf('init.js') !== -1)
				{
					script.dataset.path = path;
					
					var keys = Object.keys(document.currentScript.dataset);
					for (var i = 0; i < keys.length; i++)
					{
						script.dataset[keys[i]] = document.currentScript.dataset[keys[i]];
					}
				}
				
				document.head.appendChild(script);
			}
		};
		
		var loadModuleFiles = function loadModuleFiles (module)
		{
			var m = files.modules.filter(function _ (i) { return i.name === module; })[0];
			
			m.sources.forEach(function _ (i) {
				loadJSFile(i);
				document.currentScript.filesCounter++;
			});
		};
		
		
		document.currentScript.fileLoaded = function fileLoaded (e)
		{
			document.querySelector("[o5js]").filesCounter--;
			
			this.parentNode.removeChild(this);
			
			if(document.querySelector("[o5js]").filesCounter === 0)
			{
//				setTimeout(o5.$.init2, 100);
			}
		};

		loadModuleFiles('core');
		loadModuleFiles('debug');
		loadModuleFiles('platform');
		loadModuleFiles('gui');

		if (document.currentScript.dataset.legacySupport === 'enabled')
		{
			console.log("O5.js: There is no legacy JSFW support with O5.js 3.X");
		}

		// Leave this for last, embed elements can only be loaded in the body...
		// so CCOM NPAPI will never be ready before this script is parsed if it is included in the head
		// For consistency, do the same with the stubs
		if ('application/ccom_html' in navigator.mimeTypes || typeof webkitGetObjectFromPlugin == "function")
		{
			// console.log("O5.js: CCOM plugin found");
		}
		else
		{
			// console.log("O5.js: Loading CCOM stubs");
			loadModuleFiles('ccom_stubs');
		}
	})();
}
else
{
	// Ignore, child frames does not needs this file
}
