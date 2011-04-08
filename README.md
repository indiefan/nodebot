# Running Nodebot

In order to run Nodebot, you will need a working version of node.js

In the future, it may also be required to have a working version of npm
in order to install dependencies (as of now the only dependency is
included in the project as it is a fork of an existing npm module
node-irc). It's probably best to set them both up
at the same time. https://gist.github.com/579814

After you have node installed, simply:

* Update config.js with your settings
* [Optional] Add/Remove any plugins you want in `lib/plugins/`
* Run `node run.js`

#Plugins

The easiest way to control nodebot is to write a plugin. A plugin is an
encapsulated command for the bot to respond to. At present, the only
supported plugins are message responders, which respond to messages in
irc that match a given pattern, and these plugins consists of at
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

##Auto Load and Hot-Reloading
As of now, plugins auto-load from the 'lib/plugins' folder without you
needing to do anything. In the future auto-loading will be an option, as
well as explicitly stating the plugins to use. Also, there is a config
option `livePlugins` that, if true, will tell the bot to watch each plugin file and if it changes,
hot-reload the plugin without killing your bot. Use this with caution,
as it is prone to memory leaks if your plugin does a require of it's
own or sets up
some cyclical links.

#TODO

* Add Support for RPC and HTTP command plugins
* Add more plugins
* Add some basic plugin validation that ensures we get a String name,
   Regex regex, and Function callback
* Add built in list and man/help commands that list loaded plugins and
   that print help messages from plugins
* Add a concept of scope for plugins (public room, pm, nick mention,
   etc.)
* Implement strategy for handling subfolders inside of plugins
	directory (incase plugins are included as git submodules or
something along those lines) and ignoring non .js files
