/**
 * Nodebot plugin to dynamically load plugins
 */
function Command() {
	var self = this;
	self.name = "Load";
	self.regex=/load \w*/i;
	self.ownerOnly = true;
	self.callback = function(from, to, message, nodebot) {
		var request = message.split(" ", 2);
		var plugin = request[1];

		var filename = __dirname + '/' + plugin + '.js';
		nodebot.loadPlugin(filename);
	};
};

exports.Command = Command;
