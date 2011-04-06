var bot = require(__dirname + '/lib/nodebot');

var nodebot2a = new bot.Nodebot();
var bot = nodebot2a.bot;

nodebot2a.addMessageHandler(/goodbye/i, function(from, to, message) {
	bot.say(to, 'goodbye ' + from);
});

nodebot2a.addMessageHandler(/hello/i, function(from, to, message) {
	bot.say(to, 'Hello there ' + from);
});

nodebot2a.addMessageHandler(/dance/, function(from, to, message) {
	setTimeout(function () { bot.say(to, "\u0001ACTION dances: :D\\-<\u0001") }, 1000);
	setTimeout(function () { bot.say(to, "\u0001ACTION dances: :D|-<\u0001")  }, 2000);
	setTimeout(function () { bot.say(to, "\u0001ACTION dances: :D/-<\u0001")  }, 3000);
	setTimeout(function () { bot.say(to, "\u0001ACTION dances: :D|-<\u0001")  }, 4000);
});

nodebot2a.addMessageHandler(/nodebot2a\: leave/i, function(from, to, message) {
	var me = bot.nick;
	if (from == "indiefan2a") {
		console.log('Quitting...');
		bot.disconnect("Fine. I'll leave.");
	} else {
		if (from != "indiefan2a") {
			bot.say(to, "You're not the boss of me, " + from);
		} else {
			console.log('FROM: ' + from + ', TO: ' + to + '. Did not match my nick: ' + me);
		}
	}
});

nodebot2a.addMessageHandler(/nodebot2a\: (insult)|(reprimand) \w*/, function(from, to, message) {
	var adverbs = [
		"incredibly",
		"unusually",
		"especially",
		"extraordinarily"
	];

	var adjectives = [
		"obnoxious",
		"loud",
		"ugly",
		"ridiculous"
	];

	var nouns = [
		"jerk",
		"douche",
		"asshole"
	];

	var request = message.split(" ");
	var insultee = request[2];
	if (insultee == "me") {
		insultee = from;
	}
	
	var rand1 = Math.floor(Math.random()*adverbs.length);
	var rand2 = Math.floor(Math.random()*adjectives.length);
	var rand3 = Math.floor(Math.random()*nouns.length);

	var adverb = adverbs[rand1];
	var adjective = adjectives[rand2];
	var noun = nouns[rand3];

	var article = 'a';
	var vowels = ['a', 'e', 'i', 'o', 'u'];
	if (inArray(adverb.substring(0,1), vowels)) {
		article = 'an';
	}

	bot.say(to, insultee + ': You are ' + article + ' ' + adverb + ' ' + adjective + ' ' + noun);
});


//==========================================================================
// Utility Methods
//==========================================================================

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

