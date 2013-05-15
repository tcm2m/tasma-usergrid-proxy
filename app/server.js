var express = require('express');
var app = express();

app.use(express.logger());

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', function(request, response) {
    response.send('Tasma Usergrid Proxy Server');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on ' + port);
});