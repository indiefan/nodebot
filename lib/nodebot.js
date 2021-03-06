exports.Nodebot = Nodebot;

var sys = require('sys');
var irc = require(__dirname + '/node-irc/lib/irc');
var fs = require('fs');

Nodebot.prototype = irc.Client.prototype;
Nodebot.prototype.constructor = Nodebot;

function Nodebot() {
	var self = this;
	var options = fs.readFileSync(__dirname + '/config.js', 'utf8');
	self.options = JSON.parse(options);

	self.messageHandlers = [];
	self.privateMessageHandlers = [];
	self.plugins = [];

	irc.Client.prototype.constructor.call(this, self.options.server, self.options.nick, self.options);

	self.addListener('error', function(message) {
		sys.puts('ERROR: ' + message.command + ': ' + message.args.join(' '));
	});

	self.addListener('message#blah', function (from, message) {
		sys.puts('<' + from + '> ' + message);
	});

	self.addListener('message', function (from, to, message) {
		sys.puts(from + ' => ' + to + ': ' + message);


		if ( to.match(/^[#&]/) ) {
			// Channel message, loop through our handlers
			for (var i = 0; i < self.messageHandlers.length; i++) {
				var handler = self.messageHandlers[i];
				if (message.match(handler.regex)) {
					if ((handler.hasOwnProperty('ownerOnly')) && handler.ownerOnly && from != self.options.owner) {
						self.say(to, "You're not the boss of me, " + from);
					} else {
						handler.callback(from, to, message, self);
					}
				}
			}
		}
		else {
			// Private message, loop through our handlers
			for (var i = 0; i < self.privateMessageHandlers.length; i++) {
				var handler = self.privateMessageHandlers[i];
				if (message.match(handler.regex)) {
					if ((handler.hasOwnProperty('ownerOnly')) && handler.ownerOnly && from != self.options.owner) {
						self.say(to, "You're not the boss of me, " + from);
					} else {
						handler.callback(from, to, message, self);
					}
				}
			}
		}
	});

	self.addListener('pm', function(nick, message) {
		sys.puts('Got private message from ' + nick + ': ' + message);
	});

	self.addListener('join', function(channel, who) {
		sys.puts(who + ' has joined ' + channel);
	});

	self.addListener('part', function(channel, who, reason) {
		sys.puts(who + ' has left ' + channel + ': ' + reason);
	});

	self.addListener('kick', function(channel, who, by, reason) {
		sys.puts(who + ' was kicked from ' + channel + ' by ' + by + ': ' + reason);
	});

	self.addMessageHandler = function (handler) {
		self.messageHandlers.push(handler);
	};

	self.addPrivateMessageHandler = function (handler) {
		self.privateMessageHandlers.push(handler);
	};

	self.removeMessageHandler = function(name) {
		for (var i = 0; i < self.messageHandlers.length; i++) {
			var handler = self.messageHandlers[i];
			if (handler.name == name) {
				self.messageHandlers.splice(i, 1);
				return true;
			}
		}

		return false;
	};

	self.addPlugin = function(filename, plugin) {
		if (typeof self.plugins[filename] === 'undefined')
			self.plugins[filename] = {};
		self.plugins[filename].plugin = plugin;
		self.plugins[filename].mtime = null;
		// TODO: Handle different plugin types (RPC, HTTP, Message, etc)
		self.addMessageHandler(plugin);
	};

	self.removePlugin = function(filename, plugin) {
		delete self.plugins[filename].plugin;

		self.removeMessageHandler(plugin.name);
	}

	self.report = function(text) {
		console.log(text);
		self.say(self.options.owner, text);
	};

	self.loadPlugin = function(filename) {
		try {
			var plugin = require(filename);
			var command = new plugin.Command();
			self.addPlugin(filename, command);
			if (self.options.livePlugins && !(command.forceCache)) {
				self.watch(filename);
			}
			self.report("Plugin loaded successfully: " + filename);
		} catch (err) {
			self.report("There was a problem loading the plugin: " + filename);
		}
	};

	self.reloadPlugin = function(filename) {
		self.report("Reloading the plugin: " + filename);
		
		// First unload the plugin
		delete require.cache[filename];

		try {
			var plugin = require(filename);
			var command = new plugin.Command();
			self.removePlugin(filename, command);
			self.addPlugin(filename, command);
			self.report("Plugin reloaded successfully: " + filename);
		} catch (err) {
			self.report("There was a problem reloading the plugin: " + filename);
		}
	};

	self.watch = function(filename) {
		fs.watchFile(filename, function(curr, prev) {
			if (curr.mtime.toString() != prev.mtime.toString()) {
				self.report("New mtime: " + curr.mtime.toString() + ", Old mtime: " + prev.mtime.toString());
				// Reload the plugin
				self.reloadPlugin(filename);
				self.plugins[filename].mtime = curr.mtime;
			}
		});
	}

	self.loadPlugins = function(dir) {
		if (typeof dir == "undefined") {
			var dir = '/plugins';
		}
		fs.readdir(__dirname + dir, function(err, files) {
			if (err) return;
			for(var i = 0; i < files.length; i++) {
				file = files[i];
				if (file.indexOf(".js") != -1) {
					var filename = __dirname + dir + '/' + file;
					self.loadPlugin(filename);
				} else {
					self.loadPlugins(dir + "/" + file);
				}
			}
		});

	};
	self.loadPlugins();
};
