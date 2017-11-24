# Bunyan stream for Telegram

Bunyan stream for sending log messages via Telegram's bot.

# Usage

```js
import bunyan from 'bunyan';
import BTS from 'bunyan-telegram-stream';

const chat_id = ...;
const options = {};
const log = bunyan.createLogger({
    name: 'appname',
    streams: [{
        stream: new BTS('bot token', chat_id, options),
        level: bunyan.ERROR,
        type: 'raw',
    }],
});

log.error('terrible error');
```
