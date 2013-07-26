var request = require('request');

function pad(n) {
  return n < 10 ? ('0' + n.toString()) : n.toString();
}

function timeToString(d) {
  return [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
}

function getTime(location, callback) {
  function onGeocode(err, res, body) {
    if (err) {
      return callback(err);
    }

    if (res.statusCode !== 200) {
      return callback(new Error(res.statusCode + ' returned while geocoding'));
    }

    body = body.results;
    if (!body.length) {
      return callback(new Error('No such location found'));
    }

    body = body[0].geometry.location;

    var timestamp = Math.floor((new Date()).getTime() / 1000),
        url = 'https://maps.googleapis.com/maps/api/timezone/json?location=' +
              body.lat.toString() + ',' + body.lng.toString() + '&timestamp=' +
              timestamp + '&sensor=false';

    request({
      url: url,
      json: true
    }, onTimezone);
  }

  function onTimezone(err, res, body) {
    if (err) {
      return callback(err);
    }

    if (res.statusCode !== 200) {
      return callback(new Error(res.statusCode + ' returned while getting timezone data'));
    }

    if (body.status !== 'OK') {
      return callback(new Error(body.status + ' status returned'));
    }

    var time = new Date().getTime();
    time += (body.rawOffset * 1000) +
            (body.dstOffset * 1000) +
            (new Date().getTimezoneOffset() * 60 * 1000);

    return callback(null, new Date(time));
  }

  var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' +
            location.replace(/ /g, '+') + '&sensor=false';

  request({
    url: url,
    json: true
  }, onGeocode);
}

module.exports = function () {
  return function (from, to, command) {
    var self = this,
        re = /^what time is it in ([^\?]+)(\?)?/i,
        match = command.match(re);

    if (match) {
      getTime(match[1], function (err, time) {
        if (err) {
          return self.irc.say(to, from + ': sorry, I wasn\'t able to do that (' + err.message + ')');
        }

        self.irc.say(to, from + ': time in ' + match[1] + ' is ' + timeToString(time));
      });

      return true;
    }
  };
};
