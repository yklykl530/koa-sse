koa-sse-stream
===
> koa sse（server side event） middleware , use stream programming model

<a href="https://communityinviter.com/apps/koa-js/koajs" rel="KoaJs Slack Community">![KoaJs Slack](https://img.shields.io/badge/Koa.Js-Slack%20Channel-Slack.svg?longCache=true&style=for-the-badge)</a>

Install
---
> npm install --save koa-sse-stream

Usage
---
```js
const Koa = require('koa');
const compress = require('koa-compress');
const sse = require('koa-sse-stream');


const app = new Koa();
// !!attention : if you use compress, sse must use after compress 
app.use(compress())

/**
 * koa sse middleware
 * @param {Object} opts
 * @param {Number} opts.maxClients max client number, default is 10000
 * @param {Number} opts.pingInterval heartbeat sending interval time(ms), default 60s
 * @param {String} opts.closeEvent if not provide end([data]), send default close event to client, default event name is "close"
 * @param {String} opts.matchQuery when set matchQuery, only has query (whatever the value) , sse will create
 */
app.use(sse({
    maxClients: 5000,
    pingInterval: 30000
}));

app.use(async (ctx) => {
    // ctx.sse is a writable stream and has extra method 'send'
    ctx.sse.send('a notice');
    ctx.sse.end();
});
```

ctx.sse
---
a writable stream 
> ctx.sse.send(data)
```js
/**
 * 
 * @param {String} data sse data to send, if it's a string, an anonymous event will be sent.
 * @param {Object} data sse send object mode
 * @param {Object|String} data.data data to send, if it's object, it will be converted to json
 * @param {String} data.event sse event name
 * @param {Number} data.id sse event id
 * @param {Number} data.retry sse retry times
 * @param {*} encoding not use
 * @param {function} callback same as the write method callback
 */
send(data, encoding, callback)
```
>ctx.sse.end(data)
```js
/**
 * 
 * @param {String} data sse data to send, if it's a string, an anonymous event will be sent.
 * @param {Object} data sse send object mode
 * @param {Object|String} data.data data to send, if it's object, it will be converted to json
 * @param {String} data.event sse event name
 * @param {Number} data.id sse event id
 * @param {Number} data.retry sse retry times
 * @param {*} encoding not use
 * @param {function} callback same as the write method callback
 */
end(data, encoding, callback)
```

Attention !!!
------
if you use compress, sse must use after compress 
