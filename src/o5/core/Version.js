/**
 * @class o5.version
 * @singleton
 * @author lmayle
 */

o5.version = new (function O5Version ()
{
	this.major = 3;
	this.minor = 0;
	this.build = 0;
	this.changeList = 0000000;

	this.engineering = true;

	this.toString = function toString ()
	{
		return (this.major + '.' + this.minor + '.' + this.build) + (this.engineering ? 'e CL#' + this.changeList : '');
	};

})();

//eslint-disable-next-line no-console
console.log("### Loading OpenTV 5 Javascript Framework " + o5.version);
