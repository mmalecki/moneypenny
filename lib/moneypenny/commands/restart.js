module.exports = function () {
  return function (from, to, command) {
    var re = /^(please )?(restart|reboot)/,
        match = command.match(re);

    if (match) {
      process.exit();
      return true;
    }
  };
};
