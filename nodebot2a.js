var bot = require(__dirname + '/lib/nodebot');

var nodebot2a = new bot.Nodebot();
var bot = nodebot2a.bot;

nodebot2a.addMessageHandler(/goodbye/i, function(from, to, message) {
	bot.say(to, 'goodbye ' + from);
});

nodebot2a.addMessageHandler(/hello/i, function(from, to, message) {
	nodebot2a.say(to, 'Hello there ' + from);
});

nodebot2a.addMessageHandler(/dance/, function(from, to, message) {
	setTimeout(function () { nodebot2a.say(to, "\u0001ACTION dances: :D\\-<\u0001") }, 1000);
	setTimeout(function () { nodebot2a.say(to, "\u0001ACTION dances: :D|-<\u0001")  }, 2000);
	setTimeout(function () { nodebot2a.say(to, "\u0001ACTION dances: :D/-<\u0001")  }, 3000);
	setTimeout(function () { nodebot2a.say(to, "\u0001ACTION dances: :D|-<\u0001")  }, 4000);
});

nodebot2a.addMessageHandler(/nodebot2a\: leave/i, function(from, to, message) {
	var me = bot.nick;
	if (from == "indiefan2a") {
		console.log('Quitting...');
		nodebot2a.bot.disconnect("Fine. I'll leave.");
	} else {
		if (from != "indiefan2a") {
			bot.say(to, "You're not the boss of me, " + from);
		} else {
			console.log('FROM: ' + from + ', TO: ' + to + '. Did not match my nick: ' + me);
		}
	}
});
