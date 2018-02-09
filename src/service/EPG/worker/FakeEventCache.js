/**
 * @class EventCache
 * FakeEventCache - fake version of EventCache for development
 */

var cache = {},
	eventIdSeed = 0,
	FAKE_INFO = {
		TITLE_ARRAY: [
			"Nine Afternoon News",
			"ABC News: Early Edition",
			"Secrets of the Irish Landscape",
			"Seinfeld",
			"Pointless",
			"The People's Court",
			"The Chase Australia",
			"TEN Eyewitness News First at Five",
			"Better Homes and Gardens",
			"American Dad!",
			"Friends",
			"Only Fools and Horses",
			"Jonathan Creek",
			"Kingdom",
			"Silent Witness",
			"Nashville",
			"Scrubs",
			"Sex and the City",
			"Ballers",
			"30 Rock",
			"Ice Loves Coco",
			"How Do I Look?",
			"Say Yes To The Dress Atlanta",
			"Homes Under the Hammer",
			"Food Safari",
			"My Big Fat Fabulous Life",
			"Are You The One?",
			"Battlestar Galactica",
			"Later... With Jools Holland",
			"Storage Wars",
			"Curious George",
			"60 Minute Makeover",
			"Ben 10: Omniverse",
			"Monster Moves",
			"Go Lingo",
			"Rock Legends",
			"Movies Preview",
			"The Dr. Oz Show",
			"Who Do You Think You Are?",
			"CSI: Crime Scene Investigation",
			"Malcolm in the Middle",
			"Flog It!",
			"Bonanza",
			"WWE Smackdown",
			"Law & Order: SVU",
			"White Collar",
			"The Leftovers",
			"Law & Order",
			"Criminal Minds",
			"The Inbetweeners",
			"Defiance",
			"It Works Cleaning Solutions",
			"Eagle Eyes",
			"Come Dine With Me Couples",
			"24 Hours in Emergency",
			"My Giant Life",
			"That's Amazing",
			"Blokesworld",
			"Movies Preview",
			"The Blessed Life",
			"300: Rise of an Empire",
			"Quiz Show",
			"March of the Penguins",
			"Stranded In Paradise",
			"Bird on a Wire",
			"D3: The Mighty Ducks",
			"The Game",
			"Prisoners",
			"Ride Along",
			"Ghost in the Machine",
			"D2: The Mighty Ducks",
			"The Curse of Frankenstein",
			"The Noble Family",
			"Live: Golf: Euro PGA: Hong Kong Open R2",
			"Home Run",
			"Best of 2015: Premiers Best",
			"Live: Motorsport: MotoGP Free Practice",
			"Building Jerusalem",
			"Live: Cricket: Test: SRI v WI 2nd Test",
			"Bionicle: The Legend Reborn",
			"Rugby, Cricket",
			"Motorsport: Supercars Life",
			"Eurosportnews",
			"NFL Live",
			"ESPN First Take",
			"Live: Cycling Track",
			"Live: Sky Racing 1 Raceday",
			"Live: Sky Racing 2 Raceday",
			"Live: Sky Thoroughbred Central Raceday",
			"Coming Soon",
			"The Friday Show",
			"Met Central",
			"On the Record",
			"CNN Newsroom",
			"Business View",
			"Naked and Afraid XL",
			"Great Mysteries and Myths",
			"Cold Case Files",
			"Dragons' Den",
			"Drugs Inc.: The Inside Man",
			"Beyond Magic With DMC",
			"Shark Men",
			"Street Outlaws",
			"Bad Dog!",
			"The Last Alaskans",
			"ABC News with Grandstand",
			"Britain's Underworld",
			"Europe Squawk Box",
			"Dirty Great Machines",
			"Idris Elba: King of Speed",
			"BBC World News",
			"Countdown",
			"Al Jazeera World",
			"News Update",
			"The Road of Discovery",
			"NewsLine",
			"Global Financial Crisis",
			"Headline News",
			"Bella and the Bulldogs",
			"ALVINNN!!! And The Chipmunks",
			"Best Friends Whenever",
			"Nina and the Neurons",
			"The Tom and Jerry Show",
			"Kirby Buckets",
			"Miles From Tomorrowland",
			"Dick 'n' Dom Go Wild!",
			"Adventure Time",
			"Roy",
			"10 Most Requested",
			"Today's Freshest Hits",
			"Top 100: Greatest Songs Of All Time",
			"Feel Good Friday On Smooth",
			"MTV Official Countdown: Top 30",
			"Hot, Fresh 'N' New!",
			"Super Country Hits",
			"More than 30 Ad-free audio channels",
			"L'eredita",
		],
		SHORT_DESC: "Short Description",
		LONG_DESC: "Long description that has more words for title",
		AGE_RATING_ARRAY: ["G", "PG", "M", "MA15+", "R18+", "X18+"]
	},
	MINUTE_IN_MS = 60 * 1000;

/**
 * @method getFakeEvent
 */
function getFakeEvent(serviceId, startTime, endTime) {
	var fakeEvent = {};
	eventIdSeed++;

	fakeEvent.eventId = eventIdSeed;
	fakeEvent.serviceId = serviceId;
	fakeEvent.startTime = startTime;
	fakeEvent.endTime = endTime;
	fakeEvent.title = FAKE_INFO.TITLE_ARRAY[eventIdSeed % FAKE_INFO.TITLE_ARRAY.length] + " " + eventIdSeed;
	fakeEvent.shortDesc = FAKE_INFO.SHORT_DESC + " " + eventIdSeed;
	fakeEvent.longDesc = FAKE_INFO.LONG_DESC + " " + eventIdSeed;
	fakeEvent.parentalRating = FAKE_INFO.AGE_RATING_ARRAY[eventIdSeed % FAKE_INFO.AGE_RATING_ARRAY.length];
	// fakeEvent.seriesId;
	fakeEvent.seasonId = eventIdSeed % 6;
	fakeEvent.episodeId = eventIdSeed % 24;
	fakeEvent.startover = eventIdSeed % 4 === 1;
	// fakeEvent.seriesName;
	// fakeEvent.sourceId;
	// fakeEvent.definition;
	return fakeEvent;
}

/**
 * @method round
 * @param  {Number} time - time to round
 * @param  {Number} minutes - number of minutes to round to
 * @return {Number} roundedTime - time rounded to nearest x minutes
 */
function round(time, minutes) {
	var minsInMs = minutes * MINUTE_IN_MS;
	return (Math.round(time / minsInMs)) * minsInMs;
}

/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {int} a random integer
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @method clearCache
 */
function clearCache() {
	cache = {};
}

/**
 * @method cacheEvents
 */
function cacheEvents(config) {
	var channels = config.channels,
		baseStartTime = round(Date.now() - (240 * MINUTE_IN_MS), 15),
		baseEndTime = baseStartTime + (24 * 60 * MINUTE_IN_MS);

	clearCache();

	channels.forEach(function (serviceId) {
		var startTime = baseStartTime,
			endTime,
			channelCache = [];

		while (startTime < baseEndTime) {
			endTime = startTime + round(getRandomInt(15, 120) * MINUTE_IN_MS, 15);
			channelCache.push(getFakeEvent(serviceId, startTime, endTime));
			startTime = endTime;
		}
		cache[serviceId] = channelCache;
	});

	self.postMessage({
		cmd: "cache:done",
		cache: cache
	}); // for debug
}

/**
 * @method getWindow
 */
function getWindow(config) {
	var events = {},
		channels = config.channels,
		startTime = config.startTime,
		endTime = config.endTime;

	channels.forEach(function (serviceId) {
		var channelEvents = cache[serviceId].filter(function (event) {
			return (event.startTime < endTime && event.endTime >= startTime);
		});
		events[serviceId] = channelEvents;
	});

	self.postMessage({
		cmd: "window:done",
		events: events
	});
}

/**
 * @method getCountWindow
 */
function getCountWindow(config) {
	var events = {},
		channels = config.channels,
		time = config.time,
		countAfter = config.countAfter || 0,
		countBefore = config.countBefore || 0;

	channels.forEach(function (serviceId) {
		var startIndex,
			endIndex,
			channelEvents;

		cache[serviceId].some(function (event, index) {
			if (event.startTime < time && event.endTime >= time) {
				startIndex = index - countBefore;
				endIndex = index + countAfter;
				return true;
			}
		});

		channelEvents = cache[serviceId].filter(function (event, index) {
			return index >= startIndex && index <= endIndex;
		});
		events[serviceId] = channelEvents;
	});

	self.postMessage({
		cmd: "countwindow:done",
		events: events
	});
}

/**
 * @method messageReceived
 */
function messageReceived(e) {
	var cmd = e.data.cmd,
		config = e.data.config;

	switch (cmd) {
		case "cache":
			cacheEvents(config);
			break;
		case "window:get":
			getWindow(config);
			break;
		case "countwindow:get":
			getCountWindow(config);
			break;
	}

	// self.postMessage({cmd: "TestReceived", desc: "Over and out"});
}

self.addEventListener("message", messageReceived);
