/**
 * O5.js GUI utilities
 *
 * @author lmayle
 * @ignore
 */

o5.gui.util = {};

//o5.gui.util.redPill = function ()
//{
//	var foundRules = 0;
//	var deletedRules = 0;
//	
//	var sheets = [].slice.call(document.styleSheets);
//	
//	var data = {};
//	data.sheets = [].slice.call(document.styleSheets);
//	data.baseDir = document.baseURI.substr(0, document.baseURI.lastIndexOf('/') + 1);
//	o5.gui.util._parseAllRules(data);
//
//	for (var i = 0; i < data.allRules.length - 1; i++)
//	{
//		if (data.allRules[i].selector == data.allRules[i + 1].selector &&
//			data.allRules[i].rule.cssText == data.allRules[i + 1].rule.cssText)
//		{
//			data.allRules[i].rule.selectorText = 'delete-me';
//		}
//	}
//	
//	for (var item, i = 0; (item = data.allRules[i]) !== undefined; i++)
//	{
//		if (item.hits.length === 0)
//		{
//			item.rule.selectorText = 'delete-me';
//		}
//	}
//	
//	for (var item, i = 0; (item = data.allRules[i]) !== undefined; i++)
//	{
//		for (var selectors = item.selectors, selector, j = 0; (selector = selectors[j]) !== undefined; j++)
//		{
//			if(selector.selectivity <= 0.5)
//				item.rule.selectorText = 'delete-me';
//		}
//	}
//	
//	// delete all marked rules
//	for (var sheet, i = 0; (sheet = data.sheets[i]) !== undefined; i++)
//	{
//		if (sheet.title === 'O5.js')
//		{
//			continue;
//		}
//
//		for (var rule, j = 0; (rule = sheet.rules[j]) !== undefined; j++)
//		{
//			foundRules++;
//
//			if (!rule.style)
//				continue;
//
//			if (rule.selectorText != 'delete-me')
//				continue;
//
//			sheet.deleteRule(j);
//			deletedRules++;
//			
//			j--;
//		}
//	}
//	
//	var data = {};
//	data.sheets = [].slice.call(document.styleSheets);
//	data.baseDir = document.baseURI.substr(0, document.baseURI.lastIndexOf('/') + 1);
//	o5.gui.util._parseAllRules(data);
//	
//	for (var item, i = 0; (item = data.allRules[i]) !== undefined; i++)
//	{
//		if (Object.keys(item.selectors).length === 1 && item.hits.length === 0)
//		{
////			this.logWarning('unused rule\n' + item.rule.cssText + '\nin file ' + item.cssFile);
//		}
//	}
//	
//	this.log('Found ' + foundRules + ' rules');
//	this.log('Deleted ' + deletedRules + ' rules');
//};


o5.$.StringDictionary = function StringDictionary ()
{
	var ret = Object.create(null);
	
	Object.defineProperty(ret, '_append', { value: function (selector, rule)
	{
//		if(!selector)
//			debugger;
		
		var p = Object.getOwnPropertyDescriptor (this, selector);
		
		if(p)
			p.value.push(rule);
		else
			Object.defineProperty(this, selector, { value: [ rule ], enumerable: true });
	}});
	
	/*Object.defineProperty(ret, '_getRuleObject', { value: function (selector)
		{
			if(!selector)
				debugger;
			
			var p = Object.getOwnPropertyDescriptor (this, selector);
			
			if(p)
				return p.value.push(rule);
		}});*/
	
	return ret;
};

o5.gui.util._parseAllRules = function (data)
{
	data.allRules = [];
	data.rulesId = new o5.$.StringDictionary();
	data.rulesClass = new o5.$.StringDictionary();
	data.rulesTag = new o5.$.StringDictionary();
	data.rulesFocus = new o5.$.StringDictionary();
	data.rulesUniversal = new o5.$.StringDictionary();

	var parser = new o5.$.parserlib.css.Parser();
	
	for (var sheet, i = 0; (sheet = data.sheets[i]) !== undefined; i++)
	{
		if (sheet.title === 'O5.js')
		{
			continue;
		}

		for (var rules = sheet.rules, rule, j = 0; (rule = rules[j]) !== undefined; j++)
		{
			if (!rule.style)
			{
				continue;
			}

			if (!rule.selectorText)
			{
				continue;
			}

			var item = {
					cssFile: sheet.href ? sheet.href.substr(sheet.href.indexOf(data.baseDir) + data.baseDir.length) : 'inline',
					selector: rule.selectorText,
					hits: [],
					selectors: {},
					rule: rule,
					sheet: sheet,
					stats: {
						selectorTypes: {}
					},
					parsed: {},
					options: []
			};

			item.hits = data.doc.querySelectorAll(rule.selectorText);

			parser.parse(rule.cssText);
			item.selectors = parser.rules[0].selectors;
			item.declarations = parser.rules[0].declarations;
			
			item.stats.numberOfHits = item.hits.length;
			item.stats.numberOfSelectors = item.selectors.length;
			
			item.stats.selectorTypes.and = rule.selectorText.indexOf(',') !== -1;
			item.stats.selectorTypes.child = rule.selectorText.indexOf('>') !== -1;
			item.stats.selectorTypes.all = rule.selectorText.indexOf('*') !== -1;
			item.stats.selectorTypes.id = rule.selectorText.indexOf('#') !== -1;
			item.stats.selectorTypes.class = rule.selectorText.indexOf('.') !== -1;
			item.stats.selectorTypes.pseudo = rule.selectorText.indexOf(':') !== -1;
			
			item.analyzed = false;
			item.analyzedSelectors = 0;
			
			item.selectors.forEach(function (s) {
				
				var lastPart = s.parts[s.parts.length - 1];
				var lastMod = lastPart.modifiers.length ? lastPart.modifiers[lastPart.modifiers.length - 1] : null;
				
				s.hits = data.doc.querySelectorAll(s.text);
				s.keyHits = data.doc.querySelectorAll(lastPart.text);
				
				if(s.keyHits.length === 0)
					s.efficiency = NaN;
				else
					s.efficiency = (s.hits.length / s.keyHits.length) * 100;
				
//				if(s.selectivity <= 0.8)
//					debugger;
				
				if(lastPart instanceof o5.$.parserlib.css.SelectorPart)
				{
					if(lastPart.id)
					{
						data.rulesId._append(lastPart.id, item);
						item.analyzedSelectors++;
						return;
					}
					if(lastPart.className)
					{
						data.rulesClass._append(lastPart.className, item);
						item.analyzedSelectors++;
						return;
					}
					if(lastPart.tagName)
					{
						data.rulesTag._append(lastPart.tagName, item);
						item.analyzedSelectors++;
						return;
					}
					
					if(lastPart.elementName === '*')
					{
						data.rulesUniversal._append(s.text, item);
						item.analyzedSelectors++;
						return;
					}
					
					if(lastMod)
					{
						if(lastMod.type === 'not')
						{
							data.rulesUniversal._append(s.text, item);
							item.analyzedSelectors++;
							return;
						}
					}
				}
				
				
			});
			
			if(item.analyzedSelectors === item.selectors.length)
				item.analyzed = true;
			
//			if(!item.analyzed)
//				debugger;

			for (var l = 0, prop; (prop = rule.style[l]) !== ''; l++)
			{
				item.options.push({
					property: prop,
					value: rule.style.getPropertyValue(prop),
					priority: rule.style.getPropertyPriority(prop)
					});
			}

			data.allRules.push(item);
		}
	}

	data.allRules.sort(function (a, b) {
		if (a.selector && b.selector)
		{
			return a.selector.localeCompare(b.selector);
		}
		else
		{
			return !a.selector;
		}
	});
	
	for (var i = 0; i < data.allRules.length - 1; i++)
	{
		if (data.allRules[i].selector === data.allRules[i + 1].selector &&
			data.allRules[i].rule.cssText === data.allRules[i + 1].rule.cssText)
		{
			data.allRules[i].duplicated = true;
		}
	}
};

o5.gui.util._checkEmptyRules = function (data)
{
	for (var item, i = 0; (item = data.allRules[i]) !== undefined; i++)
	{
		if (item.rule.style.length === 0)
		{
			data.issuesEmptySelectors++;
			this.logError('rule with no options\n' + item.rule.cssText + '\nin file ' + item.cssFile);
		}
	}
};

o5.gui.util._checkMultipleSelectors = function (data)
{
	for (var i = 0; i < data.allRules.length - 1; i++)
	{
		if (data.allRules[i].selector === data.allRules[i + 1].selector)
		{
			data.issuesMultipleSelectors++;
			this.logError('multiple rules with the same selector\n' +
					data.allRules[i].rule.cssText + '\nin file ' + data.allRules[i].cssFile + '\nand\n' +
					data.allRules[i + 1].rule.cssText + '\nin file ' + data.allRules[i + 1].cssFile);
		}
	}
};

o5.gui.util._checkEffectiveRules = function (data)
{
	for (var item, i = 0; (item = data.allRules[i]) !== undefined; i++)
	{
		if (Object.keys(item.selectors).length === 1 && item.hits.length === 0)
		{
			this.logWarning('unused rule\n' + item.rule.cssText + '\nin file ' + item.cssFile);
			data.issuesUnusedRules++;
		}

		item.selectors.forEach(function (selector) {

			var hits = selector.hits;

			if (hits.length === 0)
			{
				data.issuesUnusedRules++;
			}

			var classSelector = selector.text[0] === '.';

			if (hits.length && classSelector)
			{
				var lastTag = hits[0].locaName;
				var singleTag = true;

				for (var h = 1; h < hits.length; h++)
				{
					if (lastTag !== hits[h].locaName)
					{
						singleTag = false;
					}
				}

				if (singleTag)
				{
					data.issuesClassRuleUsedByOnlyOneElementType++;
				}
			}
		});

		//the following section takes a long time to execute, disable this if not needed
		if (true)
		if (!item.duplicated)
		{
			var unusedProperties = item.unusedProperties = [];
	
			if (item.hits.length > 0)
			{
				for (var hit, j = 0; (hit = item.hits[j]) !== undefined; j++)
				{
					var cst1 = window.getComputedStyle(hit).cssText;
	
					for (var option, o = 0; (option = item.options[o]) !== undefined; o++)
					{
						item.rule.style.setProperty(option.property, '', '');
	
						var cst2 = window.getComputedStyle(hit).cssText;
	
						if (cst2 === cst1)
						{
							unusedProperties.push(option.property + ': ' + option.value);
						}
	
						item.rule.style.setProperty(option.property, option.value, option.priority);
					}
				}
			}
	
			if (unusedProperties.length > 0)
			{
				unusedProperties = unusedProperties.sort().reduce(function (a, b) { if (b !== a[0]) a.unshift(b); return a; }, []);
	
				data.issuesUneededProperty += unusedProperties.length;
				
				if(true)
				{
					var result = 'Rule\n' + item.rule.cssText + '\nin file ' + item.cssFile +
							'\nseems to have the following properties which makes no difference:';
		
					for (var option, o = 0; (option = unusedProperties[o]) !== undefined; o++)
					{
						result += '\n' + option;
					}
		
					this.logWarning(result);
				}
			}
		}
	}
};

o5.gui.util._checkCostlyRules = function _checkCostlyRules(data)
{
	var universal = Object.keys(data.rulesUniversal);
	
	for (var item, i = 0; (item = universal[i]) !== undefined; i++)
	{
		data.issuesUniversalRules++;
		
		this.logError('Universal key selector used by rule(s) \n' + item/* + '\nin file ' + item.cssFile*/);
	}
	
	for (var item, i = 0; (item = data.allRules[i]) !== undefined; i++)
	{
		for (var selectors = item.selectors, selector, j = 0; (selector = selectors[j]) !== undefined; j++)
		{
			if(selector.efficiency <= 10)
			{
				data.issuesLowEfficiencySelectors++;
				
				this.logError('Key selector used by rule(s) \n' + selector.text + '\n' +
					'has very low (' + Math.round(selector.efficiency) + '%) efficiency, ' + selector.keyHits.length + ' key hits vs ' + selector.hits.length + ' effective hits'/* + '\nin file ' + item.cssFile*/);
			} else if(selector.efficiency <= 30)
			{
				data.issuesLowEfficiencySelectors++;
				
				this.logWarning('Key selector used by rule(s) \n' + selector.text + '\n' +
					'has low (' + Math.round(selector.efficiency) + '%) efficiency, ' + selector.keyHits.length + ' key hits vs ' + selector.hits.length + ' effective hits'/* + '\nin file ' + item.cssFile*/);
			}
		}
	}
};

o5.gui.util.checkCSSPerformanceIssues = function (doc)
{
	var data = {};
	
	if(!doc)
		doc = document;
	
	data.doc = doc;
	
	data.sheets = [].slice.call(doc.styleSheets);

	data.allRules = [];

	data.baseDir = doc.baseURI.substr(0, doc.baseURI.lastIndexOf('/') + 1);

	data.issuesEmptySelectors = 0;
	data.issuesMultipleSelectors = 0;
	data.issuesUnusedRules = 0;
	data.issuesClassRuleUsedByOnlyOneElementType = 0;
	data.issuesUneededProperty = 0;
	data.issuesUniversalRules = 0;
	data.issuesLowEfficiencySelectors = 0;

	o5.gui.util._parseAllRules(data);
	o5.gui.util._checkEmptyRules(data);
	o5.gui.util._checkMultipleSelectors(data);
	o5.gui.util._checkEffectiveRules(data);
	o5.gui.util._checkCostlyRules(data);
	
	this.log('Found ' + data.allRules.length + ' rules');

	this.log('Found ' + data.issuesEmptySelectors + ' rules with no options');
	this.log('Found ' + data.issuesMultipleSelectors + ' cases of multiple rules with the same selector');

	this.log('Found ' + data.issuesUnusedRules + ' unused rules');
	this.log('Found ' + data.issuesClassRuleUsedByOnlyOneElementType + ' rules with class selector used by only one element type');
	
	this.log('Found ' + data.issuesEmptySelectors + ' rules with no options');

	this.log('Found ' + data.issuesUniversalRules + ' rules with universal key selectors');
	this.log('Found ' + data.issuesLowEfficiencySelectors + ' rules with inefficient key selectors');
};

o5.gui.util.checkDOMPerformanceIssues = function (doc)
{
	if(!doc)
		doc = document;

	var baseDir = doc.baseURI.substr(0, doc.baseURI.lastIndexOf('/') + 1);
	
	var elements = 0;
	var elementsInTheFlow = 0;

	var issuesOfCSSPropertiesDefinedInMultipleRules = 0;

	var issuesWithSize = 0;
	var issuesSingleChildElement = 0;

	var issuesPropertiesWithImportant = 0;


	function getElementPath (el)
	{
		var path = '';

		for (; el.localName !== 'html'; el = el.parentElement)
		{
			path = (el.id ? el.localName + '#' + el.id : el.localName) + path;

			if (el.localName !== 'body')
			{
				path = '>' + path;
			}
		}

		return path;
	}

	function checkElement (el)
	{
		elements++;

		var path = getElementPath(el);

		if (el.offsetParent)
		{
			elementsInTheFlow++;

			if (el.offsetWidth === 0 || el.offsetHeight === 0)
			{
				issuesWithSize++;
				this.logError('element with no width and/or height ' + path);
			}
		}
		else
		{
//			this.logWarning('element with display:none ' + path);
		}

		if (el.children.length === 1 &&
//				el.localName.indexOf('o5-') === 0 &&
				el.localName !== 'o5-image' &&
				el.localName !== 'o5-video' &&
				el.localName !== 'o5-list' &&
				el.localName !== 'o5-number-entry' &&
				el.localName !== 'o5-octet-entry' &&
				el.localName !== 'o5-text-area' &&
				el.localName !== 'o5-progress-bar')
		{
			issuesSingleChildElement++;
			this.logWarning('element with only one child element ' + path);
		}

		var setProps = new Map();

		for (var r = 0, rule, rules = window.getMatchedCSSRules(el); (rule = rules[r]) !== undefined; r++)
		{
			for (var l = 0, prop; (prop = rule.style[l]) !== ''; l++)
			{
				var value = rule.style.getPropertyValue(prop);
				var priority = rule.style.getPropertyPriority(prop);

				var setProp = setProps.get(prop);

				if (!setProp)
				{
					setProp = {
							name: prop,
							rules: []
					};
					setProps.set(prop, setProp);
				}

				setProp.rules.push(rule);

				if (priority)
				{
					issuesPropertiesWithImportant++;
				}
			}
		}

		setProps.forEach(function (p) {

			if (p.rules.length > 1)
			{
				issuesOfCSSPropertiesDefinedInMultipleRules++;
				this.logWarning('element ' + path + ' has CSS property ' + p.name + ' defined in multiple rules');
			}
		});
	}
	
	function checkChildren (elp)
	{
		for (var el = elp.firstElementChild; el; el = el.nextElementSibling)
		{
			checkElement(el);

			checkChildren(el);
		}
	}

	checkChildren(doc.body);

	this.log('Found ' + elements + ' elements');
	this.log('Found ' + elementsInTheFlow + ' elements in the flow');

	this.log('Found ' + issuesWithSize + ' elements with no width and/or height');
	this.log('Found ' + issuesSingleChildElement + ' elements with only one child element');

	this.log('Found ' + issuesPropertiesWithImportant + ' cases of CSS properties with important');

	this.log('Found ' + issuesOfCSSPropertiesDefinedInMultipleRules + ' cases of CSS properties with multiple definitions for a given element');
};

