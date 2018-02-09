/**
 * QRCode are used  to allow high-speed component scanning. They provides a way to access a website more quickly than by manually entering a URL.
 * Example Markup for QR Code is: 
 * 
 * 	<o5-qrcode></o5-qrcode>
 *
 * Check below code snippet to see QRCode functionality  
 * 
 * 	@example
 * 		<!DOCTYPE html>
 *		<html>
 * 		<head>
 *			<script type='text/javascript' src='O5.js/O5.js' data-app-resolution='1280x720' data-gui-animationsa='disabled'></script>
 *			<style type="text/css">
 *				body { margin: 0; background-color: grey; width: 500px; font-size: 20px; }
 *				h3 { margin-left:50px;}
 *			</style> 
 *			<script>
 *				function load()
 *				{
 *			 		var qr = document.getElementById('code');
 *					qr.text="https://dtv.nagra.com/"; 
 *				}
 *			</script>
 *		</head>
 *
 *		<body onload='load()'>
 *			<h3> QR codes for URL - <a href="https://dtv.nagra.com/">https://dtv.nagra.com/</a></h3>
 *			<o5-qrcode id="code"></o5-qrcode>
 *		</body>
 *		</html>
 *
 * If there is no css styling applied to QRCode, default styling is applied. These default css style values are:
 * 
 * width		: 100,
 * 
 * height		: 100,
 *
 * colorDark : "#000000",
 * 
 * colorLight : "#ffffff",
 * 
 * 
 * The CSS styling (height, width, color, backgroung-color) to QRCode is done by using 4 proprties of QRCode i.e. height, width, colorDark, colorLight respectively. 
 * 
 * Also inline css can be applied to QRCode. For Example, 
 * 
 * 		<o5-qrcode id="code" style="width:200px; height:200px; color:pink; background-color:green;"></o5-qrcode>
 * 
 * The default correctLevel value for QRCode is QRCode.CorrectLevel.H i.e. 2.
 *
 * @class o5.gui.controls.QRCode
 * @extends o5.gui.controls.Control
 *
 * @author lmayle
 *
 * @constructor
 */
o5.gui.controls.QRCode = function QRCode () { };
o5.gui.controls.Control.registerO5Control(o5.gui.controls.QRCode);

o5.gui.controls.QRCode.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
	this._qrcode = new QRCode(this, {
		render		: "table",
		width		: 100,
		height		: 100,
		colorDark : "#000000",
		colorLight : "#ffffff",
		correctLevel : QRCode.CorrectLevel.H
	});
};

/*
 * Public properties
 */
/**
 * Gets or sets the text for QRCode. The text string can be any URL oe text message.
 * @property text
 * @type {String}
 */
Object.defineProperty(o5.gui.controls.QRCode.prototype, "text", {
	get: function () {
		return this._qrcode.text;
	},
	set: function (val) {
		this.value = val;
		this._qrcode.clear();
		
		if(this._qrcode._el.style.color != "")
			this._qrcode._htOption.colorDark = this._qrcode._el.style.color;
		if(this._qrcode._el.style.backgroundColor != "")
			this._qrcode._htOption.colorLight = this._qrcode._el.style.backgroundColor;
		if(this._qrcode._el.style.height != "")
			this._qrcode._oDrawing._htOption.height = Number(this._qrcode._el.style.height.match(/\d+/g));
		if(this._qrcode._el.style.width != "")
			this._qrcode._oDrawing._htOption.width = Number(this._qrcode._el.style.width.match(/\d+/g));
		
		this._qrcode.makeCode(val);		
	}
}, {
	writable: true
});

/**
 * Gets or sets the height of QRCode.
 * @property height
 * @type {String}
 */
Object.defineProperty(o5.gui.controls.QRCode.prototype, "height", {
	get: function () {
		return this._qrcode.height;
	},
	set: function (val) {
		this._qrcode._oDrawing._htOption.height = val;
		this._qrcode.makeCode(this.value);
	}
}, {
	writable: true
});

/**
 * Gets or sets the width of QRCode .
 * @property width
 * @type {String}
 */
Object.defineProperty(o5.gui.controls.QRCode.prototype, "width", {
	get: function () {
		return this._qrcode.width;
	},
	set: function (val) {
		this._qrcode._htOption.width = val;
		this._qrcode.makeCode(this.value);
	}
}, {
	writable: true
});

/**
 * Gets or sets the color of QRCode.
 * @property colorDark
 * @type {String}
 */
Object.defineProperty(o5.gui.controls.QRCode.prototype, "colorDark", {
	get: function () {
		return this._qrcode.colorDark;
	},
	set: function (val) {
		this._qrcode._htOption.colorDark = val;
		this._qrcode.makeCode(this.value);
	}
}, {
	writable: true
});

/**
 * Gets or sets the background color of QRCode.
 * @property colorLight
 * @type {String}
 */
Object.defineProperty(o5.gui.controls.QRCode.prototype, "colorLight", {
	get: function () {
		return this._qrcode.colorLight;
	},
	set: function (val) {
		this._qrcode._htOption.colorLight  = val;
		this._qrcode.makeCode(this.value);
	}
}, {
	writable: true
});

/**
 * Gets or sets the correctLevel for drawing QRCode. The default correctLevel value is QRCode.CorrectLevel.H
 * 
 * The possible values for correctLevel are [L|M|Q|H]
 * 
 * CorrectLevel={L:1,M:0,Q:3,H:2}
 * 
 * Level - 
 * 
 *  L - 7% damage
 *  
 *  M - 15% damage
 *  
 *  Q - 25% damage
 *  
 *  H - 30% damage
 *  
 * The correctLevel value of QRCode is set by assigning the corresponding digit of the expected correctLevel. For example, qrcode.correctLevel = 3;
 * 
 * @property correctLevel
 * @type {String}
 */
Object.defineProperty(o5.gui.controls.QRCode.prototype, "correctLevel", {
	get: function () {
		return this._qrcode.correctLevel;
	},
	set: function (val) {
		this._qrcode._htOption.correctLevel = val;
		this._qrcode.makeCode(this.value);
	}
}, {
	writable: true
});

