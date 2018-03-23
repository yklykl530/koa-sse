

const Koa = require('koa');
const koaSse = require('./index');
const cors = require('@koa/cors');

const app = new Koa();
app.use(cors());
app.use(koaSse());

app.use(async (ctx) => {
    let n = 0;
    let interval = setInterval(() => {
        ctx.sse.send((new Date()).toString());
        n++;
        if (n >= 5) {
            ctx.sse.end();
            clearInterval(interval)
        }
    }, 1000);
    ctx.sse.on('close', (...args) => {
        clearInterval(interval)
    });
})


app.listen(9099);