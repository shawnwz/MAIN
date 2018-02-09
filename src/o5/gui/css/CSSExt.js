/**
 * Utilities for O5.js custom variables and @apply
 *
 * @author lmayle
 * @ignore
 */

o5.gui._cssExt = new (function O5JSCSSExtensions ()
{
	if(o5.$.scriptDataset.cssVarsPolyfill === 'enabled' &&
	   !(window.CSS && CSS.supports && CSS.supports('box-shadow', '0 0 0 var(--foo)')))
	{
		this.useCSSVarsPolyfill = true;
	}
	
	if(o5.$.scriptDataset.cssApplyPolyfill === 'enabled' &&
	   !(window.CSS && CSS.supports && CSS.supports('box-shadow', '0 0 0 var(--foo)')))
	{
		this.useCSSVarsPolyfill = true;
	}

}) ();


o5.gui._cssExt.processStyleSheet = function processStyleSheet (sheet)
{
	if(!sheet.href)
		return;
	
    var xhr = new XMLHttpRequest();

    xhr.open("GET", sheet.href, false);

    xhr.send();
    
    var sheet1 = sheet;
    
    var rulesin = [];
    
	var result = null;
	
	while (result = o5.gui._cssExt.rgxRules.exec(xhr.responseText))
	{
		var rule = {
				selectorText: result[1],
				styleText: result[2]
		};
		
		rulesin.push(rule);
		
		if(rule.selectorText === ':root')
	    {
	    	var result = null;
	    	
	    	while (result = o5.gui._cssExt.rgxVarDeclaration.exec(rule.styleText))
	    	{
	    		if(result[3])
	    		{
	    			var styleText = result[3];
	    			
	    			var props = o5.gui._cssExt.sets[result[1].trim()] = Object.create(null);
	    			
	    	    	while (result = o5.gui._cssExt.rgxSimpleProperties.exec(styleText))
	    	    	{
	    	    		props[result[1].trim()] = result[2].trim();
	    	    	}
	    		}
	    		else if(this.useCSSVarsPolyfill)
	    		{
	    			o5.gui._cssExt.vars[result[1].trim()] = result[2].trim();
	    		}
	    	}
	    }
	}
    
	for (var rulein, i = 0; (rulein = rulesin[i]) !== undefined; i++)
	{
    	var result = null;
    	
    	if(this.useCSSVarsPolyfill)
    	{
    		while (result = o5.gui._cssExt.rgxVarUsage.exec(rulein.styleText))
	    	{
	    		var ruleout = sheet1.rules[i];
	    		
	    		if(ruleout.selectorText !== rulein.selectorText)
	    			continue;
	    		
	    		ruleout.style[result[1]] = o5.gui._cssExt.vars[result[2]];
	    	}
    	}
    	
    	while (result = o5.gui._cssExt.rgxApply.exec(rulein.styleText))
    	{
    		var ruleout = sheet1.rules[i];
    		
    		if(ruleout.selectorText !== rulein.selectorText)
    			continue;
    		
    		var props = o5.gui._cssExt.sets[result[1].trim()];
    		
    		for (var p in props)
    		{
    			ruleout.style[p] = props[p];
    		}
    	}
	}
};


o5.gui._cssExt.vars = Object.create(null);

o5.gui._cssExt.sets = Object.create(null);


o5.gui._cssExt.rgxRules = /^\s*(.*?)\s*{\s*([\S\s]*?)\s*}[^;]*?/gm;

o5.gui._cssExt.rgxSimpleProperties = /^([^:]+?):([^\r\n;]+)(?:[;\n]|$)/gm;

//o5.gui._cssExt.rgxVarDeclaration = /^\s*--([^;{}]*?):([^{};]*?|\s*{[\S\s]*?})(?:[;\n]|$)/gm;
o5.gui._cssExt.rgxVarDeclaration = /^\s*--([^;{}]*?):(?:([^{};]*?)|\s*{([\S\s]*?)})(?:[;\n]|$)/gm;
//o5.gui._cssExt.rgxVarDeclaration = /(?:^[^;\-\s}]+)?--([^;{}]*?):([^{};]*?)(?:[;\n]|$)/gm;

o5.gui._cssExt.rgxApply = /@apply\s+--([^;]+);/gm;

/*
p {
	color: var(--selected-text-color);
	font-size: 24px;
	background-color: var(--bg-color);
}
 */
o5.gui._cssExt.rgxVarUsage = /([\w-]+)[ \t]*:[ \t]*var\(--([\w-]+)\s*[:,;)]/gim;

