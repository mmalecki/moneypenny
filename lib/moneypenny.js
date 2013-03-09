var fs = require('fs'),
    path = require('path'),
    module_ = require('module'),
    ircb = require('ircb');

var Moneypenny = function (options) {
  var nick = options.nick || 'moneypenny';

  this.irc = ircb({
    host: options.host || 'irc.freenode.org',
    secure: typeof options.secure === 'undefined' ? true : options.secure,
    username: options.username || 'moneypenny',
    realName: options.realName || 'moneypenny',
    password: options.password,
    nick: nick,
    channels: options.channels
  });

  this.config = options.config;

  this.irc.on('message', this._onMessage.bind(this));

  this.loadCommands();
};

Moneypenny.prototype._onMessage = function (from, to, text) {
  var self = this,
      re = new RegExp('^' + self.irc.nick + '[,:]?(.+)$'),
      match = re.exec(text),
      command;

  if (match) {
    command = match[1].trim();

    if (!self.dispatch(from, to, command)) {
      self.irc.say(to, from + ': sorry, I don\'t know what to do about that.');
    }
  }
};

Moneypenny.prototype.dispatch = function (from, to, command) {
  var fun, i;

  for (i = 0; i < this.commands.length; i++) {
    fun = this.commands[i];

    if (fun.call(this, from, to, command)) {
      return true;
    }
  }
  return false;
};

Moneypenny.prototype.loadCommands = function () {
  var self = this,
      basePath = path.join(__dirname, 'moneypenny', 'commands');

  module_._cache = {};

  this.commands = fs.readdirSync(basePath).filter(function (file) {
    return file.substr(-3) === '.js';
  }).map(function (file) {
    return require(path.join(basePath + '/' + file))(
      self.config[file.substr(0, file.length - 3)]
    );
  });
};

module.exports = function (options) {
  return new Moneypenny(options);
};
