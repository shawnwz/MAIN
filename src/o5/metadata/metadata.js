/**
 * @class o5.metadata
 * @singleton
 * @private Not for public use
 * @author lmayle
 */

o5.metadata = new (function O5jsMetadata () { })();
o5.metadata.classes = new (function O5jsMetadataClasses () { })();
o5.metadata.util = new (function O5jsMetadataUtil () { })();

o5.$.init2Callbacks.push(function()
{
	o5.metadata = new o5.metadata.classes.Metadata ();
});

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
