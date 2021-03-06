var koa = require('koa');
var app = koa();

// x-response-time

app.name="age-mapper";

app.use(function *(next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    this.set('X-Response-Time', ms + 'ms');
});

// logger
app.use(function *(next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

// response
app.use(function *(){
    this.response.send('trippin balls');
});


console.log('Listening');
app.listen(3000);