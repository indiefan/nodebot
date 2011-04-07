/**
 * Nodebot plugin to url encode a string
 */
function Command() {
	this.name = "URL Encode";
	this.regex = /escape .*/;
	this.callback = function(from, to, message, bot) {
		var theString = message.substring(7);
		var encoded = encodeURIComponent(theString);

		bot.say(to, from + ': "' + theString + '" url encoded is "' + encoded + '"');
	}
};

exports.Command = Command;
