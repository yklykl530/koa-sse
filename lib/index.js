const SSE = require('./sse');
const Stream = require('stream');
const DEFAULT_OPTS = {
    maxClients: 10000,
    pingInterval: 60000,
    closeEvent: 'close',
    debug: false
}
/**
 * koa sse middleware
 * @param {Object} opts
 * @param {Number} opts.maxClients max client number, default is 10000
 * @param {Number} opts.pingInterval heartbeat sending interval time(ms), default 60s
 * @param {String} opts.closeEvent if not provide end([data]), send default close event to client, default event name is "close"
 * @param {String} opts.matchQuery when set matchQuery, only has query (whatever the value) , sse will create
 */
module.exports = function sse (opts = {}) {
    opts = Object.assign({}, DEFAULT_OPTS, opts);
    const ssePool = [];
    
    if(opts.pingInterval) {
        let interval = setInterval(() => {
            let ts = +new Date;
            if (ssePool.length > 0) {
                ssePool.forEach(s => s.send(':'));
                if(opts.debug) {
                    console.log('SSE run ping: for ' + ssePool.length + ' clients');
                }
            }
        }, opts.pingInterval);
    }

    return async function sse (ctx, next) {
        if (ctx.res.headersSent) {
            if (!(ctx.sse instanceof SSE)) {
                console.error('SSE response header has been send, Unable to create the sse response');
            }
            return await next();
        }
        if (ssePool.length >= opts.maxClients) {
            console.error('SSE sse client number more than the maximum, Unable to create the sse response');
            return await next();
        }
        if (opts.matchQuery && typeof ctx.query[opts.matchQuery] === 'undefined') {
            return await next();
        }
        let sse = new SSE(ctx);
        ssePool.push(sse);
        sse.on('close', function() {
            ssePool.splice(ssePool.indexOf(sse), 1);
        });
        ctx.sse = ctx.response.sse = sse;
        await next();
        // if (!ctx.sse) {
        //     ssePool.splice(ssePool.indexOf(sse), 1);
        //     sse.destroy();
        //     return;
        // }
        if (!ctx.body) {
            ctx.body = ctx.sse;
        } else if (ctx.body instanceof Stream) {
            if (ctx.body.writable) {
                ctx.body = ctx.body.pipe(ctx.sse);
            }
        } else {
            if (!ctx.sse.ended) {
                ctx.sse.send(ctx.body);
            }
            ctx.body = sse;
        }
    }
}