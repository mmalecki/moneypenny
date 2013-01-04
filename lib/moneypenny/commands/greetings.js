var greetings = [
  'hello!',
  'hi!',
  'hey!',
  'nice to see you!',
  'great to see you!',
  'good morning!'
];

module.exports = function () {
  return function (from, to, command) {
    var re = /(hello|heya?|good morning|hi|welcome|sup)/i,
        greet;

    if (command.match(re)) {
      greet = greetings[Math.floor(Math.random() * greetings.length)];
      this.irc.say(to, from + ': ' + greet);
      return true;
    }
  };
};
