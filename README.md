# Running Nodebot

In order to run Nodebot, you will need a working version of node.js

In the future, it may also be required to have a working version of npm
in order to install dependencies (as of now the only dependency is
included in the project as it is a fork of an existing npm module
node-irc). It's probably best to set them both up
at the same time. https://gist.github.com/579814

After you have node installed, simply:

* Update config.js with your settings
* [Optional] Add/Remove and plugins you want in `lib/plugins/`
* Run `node run.js`

#Plugins

The easiest way to control nodebot is to write a plugin. A plugin is an
encapsulated command for the bot to respond to, which consists of at
least three things:

1. name - The name of the plugin
2. regex - The regex applied to messages to capture and execute this
   command
3. callback - The code to execute for this command

I've included a few example plugins with this repository to give you an
idea of the syntax for plugins. The simplest of which is as follows:

	/**
	 * Nodebot plugin to be friendly
	 */
	function Command() {
		this.name = "Salutations";
		this.regex = /hello/i;
		this.callback = function(from, to, message, bot) {
			bot.say(to, 'Hello to you too, ' + from);
		}
	};

	exports.Command = Command;

As of now, plugins auto-load from the 'lib/plugins' folder without you
needing to do anything. In the future auto-loading will be an option, as
well as explicitly stating the plugins to use. Also, there is a config
option `livePlugins` that will watch each plugin file and if it changes,
hot-reload the plugin without killing your bot. Use this with caution,
as it is prone to memory leaks if your plugin does a require of it's
own or sets up
some cyclical links.

#TODO

1. Add Support for RPC and HTTP command plugins
2. Add "Owner" config option and bot property
3. Add Command to load new module dynamically
4. Add more plugins
5. Add option for plugins to not auto-load from the plugins folder
