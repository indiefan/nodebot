/**
 * Nodebot plugin to report the weather forecast
 */
function Command() {
	var self = this;
	self.name = "Weather";
	self.regex=/weather/i;
	self.callback = function(from, to, message, nodebot) {
		nodebot.say(to, "I'm still figuring out this weather noise.");
	};
};

exports.Command = Command;
