exports.Nodebot = Nodebot;

var sys = require('sys');
var irc = require(__dirname + '/node-irc/lib/irc');
var fs = require('fs');

function Nodebot() {
	var self = this;
	var options = fs.readFileSync(__dirname + '/config.js', 'utf8');
	self.options = JSON.parse(options);

	self.messageHandlers = [];
	self.privateMessageHandlers = [];

	self.bot = new irc.Client('irc.freenode.net', 'nodebot2a', self.options);

	self.bot.addListener('error', function(message) {
		sys.puts('ERROR: ' + message.command + ': ' + message.args.join(' '));
	});

	self.bot.addListener('message#blah', function (from, message) {
		sys.puts('<' + from + '> ' + message);
	});

	self.bot.addListener('message', function (from, to, message) {
		sys.puts(from + ' => ' + to + ': ' + message);


		if ( to.match(/^[#&]/) ) {
			// Channel message, loop through our handlers
			for (var i = 0; i < self.messageHandlers.length; i++) {
				var handler = self.messageHandlers[i];
				if (message.match(handler.regex)) {
					sys.puts('We have a handler for this.');
					handler.callback(from, to, message, self.bot);
				}
			}
		}
		else {
			// Private message, loop through our handlers
			for (var i = 0; i < self.privateMessageHandlers.length; i++) {
				var handler = self.privateMessageHandlers[i];
				if (message.match(handler.regex)) {
					sys.puts('We have a private message handler for this.');
					handler.callback(from, to, message, self.bot);
				}
			}
		}
	});

	self.bot.addListener('pm', function(nick, message) {
		sys.puts('Got private message from ' + nick + ': ' + message);
	});

	self.bot.addListener('join', function(channel, who) {
		sys.puts(who + ' has joined ' + channel);
	});

	self.bot.addListener('part', function(channel, who, reason) {
		sys.puts(who + ' has left ' + channel + ': ' + reason);
	});

	self.bot.addListener('kick', function(channel, who, by, reason) {
		sys.puts(who + ' was kicked from ' + channel + ' by ' + by + ': ' + reason);
	});

	self.addMessageHandler = function (regex, callback) {
		self.messageHandlers.push({'regex': regex, 'callback': callback});
	};

	self.addPrivateMessageHandler = function (regex, callback) {
		self.privateMessageHandlers.push({'regex': regex, 'callback': callback});
	};

	self.say = function(target, text) {
		self.bot.say(target, text);
	};

	self.loadPlugins = function() {
		fs.readdir(__dirname + '/plugins', function(err, files) {
			if (err) throw err;
			for(var i = 0; i < files.length; i++) {
				file = files[i];
				var plugin = require(__dirname + '/plugins/' + file);
				var command = new plugin.Command();
				self.addMessageHandler(command.regex, command.callback);
			}
		});
	};
	self.loadPlugins();
}
