

const Koa = require('koa');
const koaSse = require('./index');
const cors = require('@koa/cors');

const app = new Koa();
app.use(cors());
app.use(koaSse());

app.use(async (ctx) => {
    let n = 0;
    let interval = setInterval(() => {
        let date = (new Date()).toString();
        ctx.sse.send(date);
        console.log('send Date : ' + date);
        n++;
        if (n >= 10) {
            console.log('send manual close');
            ctx.sse.sendEnd();
        }
    }, 1000);
    ctx.sse.on('close', (...args) => {
        console.log('clear interval')
        clearInterval(interval)
    });
})


app.listen(9099);