module.exports = function () {
  return function (from, to, command) {
    var re = /^(please )?(join|go to|listen to) #(.+)/,
        match = command.match(re);

    if (match) {
      this.irc.join('#' + match[2]);
      return true;
    }
  };
};
