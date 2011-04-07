/**
 * Nodebot plugin to be friendly
 */
function Command() {
	this.name = "Salutations";
	this.regex = /hello/i;
	this.callback = function(from, to, message, bot) {
		bot.say(to, 'Hello there ' + from);
	}
};

exports.Command = Command;
