# Running Nodebot2a

In order to run Nodebot2a, you will need a working version of node.js

In the future, it may also be required to have a working version of npm
in order to install dependencies (as of now the only dependency is
included in the project as it is a fork of an existing npm module
node-irc). It's probably best to set them both up
at the same time. https://gist.github.com/579814

After you have node installed, simply run `node nodebot2a.js` and watch
the magic.

#TODO

1. Add in code to watch plugins for updates (and watch folder if
   possible for new plugins)
2. Separate out inline config options in lib/nodebot.js into a config
   file for better management
3. Add more commands
