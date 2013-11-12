module.exports = function () {
  return function (from, to, command) {
    var re = /^((what('s| is) your )?(up time|uptime)|how long have you been up for)(\?)?/i;
    var match = command.match(re);
    var uptime, hours, minutes, r;

    if (match) {
      uptime = process.uptime();
      hours = Math.floor(uptime / 3600);
      uptime -= hours * 3600;

      minutes = Math.floor(uptime / 60);
      uptime -= minutes * 60;
      console.log(uptime, hours, minutes);

      r = from + ': I\'ve been up for ' +
          (hours ? hours + ' h ' : '') +
          (minutes ? minutes + ' m ' : '') +
          uptime + ' s';

      this.irc.say(to, r);
      return true;
    }
  };
};
