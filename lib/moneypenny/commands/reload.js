module.exports = function () {
  return function (from, to, command) {
    var match = command.match(/(reload|upgrade)/);

    if (match) {
      this.irc.say(to, from + ': attempting to reload commands...');
      this.loadCommands();
      this.irc.say(to, from + ': commands reloaded (' + this.commands.length + ' commands loaded).');
      return true;
    }
  };
};
