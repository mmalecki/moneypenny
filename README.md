# moneypenny

The IRC bot James Bond would have wanted.

## Installation

```sh
git clone https://github.com/mmalecki/moneypenny.git
cd moneypenny
npm install
```

## Configuration
Moneypenny needs a config file in `./config.json` to run. For example:

```json
{
  "config": {
    "text": {
      "twilio": {
        "sid": "<twillio sid>",
        "authToken": "<twillio auth token>",
        "number": "<twillio number>"
      },
      "people": {
        "you": "+123456789"
      }
    }
  },
  "channels": ["#node.js"],
  "password": "<password>",
  "nick": "moneypenny"
}
```
