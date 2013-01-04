var twilio = require('twilio');

module.exports = function (config) {
  var twilioClient = twilio(config.twilio.sid, config.twilio.authToken),
      people = config.people;

  return function (from, to, command) {
    var self = this,
        re = /text (\w+) (.+)/i,
        match = command.match(re),
        number;

    if (match) {
      number = people[match[1]];

      if (!number) {
        self.irc.say(to, from + ': sorry, I don\'t know this person.');
        return true;
      }

      twilioClient.sendSms({
        to: number,
        from: config.twilio.number,
        body: from + ' asked to tell you: ' + match[2]
      }, function (err, responseData) {
        if (err) {
          console.dir(err);
          return self.irc.say(to, from + ': sorry, I wasn\'t able to text him (' + err.message + ').');
        }

        self.irc.say(to, from + ': I texted ' + match[1] + '.');
      });
      return true;
    }
  };
};
