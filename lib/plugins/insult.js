/**
 * Nodebot plugin to randomly generate insult
 */
function Command() {
	this.name = "Insult";
	this.description = "Randomly insult someone.";
	this.man = "Usage: `insult [user]`";
	this.regex = /nodebot2a\: (insult)|(reprimand) \w*/;
	this.callback = function(from, to, message, bot) {
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

		function inArray(needle, haystack) {
			var length = haystack.length;
			for(var i = 0; i < length; i++) {
				if(haystack[i] == needle) return true;
			}
			return false;
		}
	};
};

exports.Command = Command;
