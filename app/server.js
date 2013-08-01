var express = require('express');
var nmea = require('nmea-0183');
var usergrid = require('usergrid');
var app = express();

app.use(express.logger());

app.configure('development', function() {
    app.use(express.errorHandler());
});

var client = new usergrid.client({
    orgName: 'tcm2m',
    appName: 'sandbox',
    logging: true
});

app.get('/', function(req, res) {
    res.send('Tasma Usergrid Proxy Server');
});

app.get('/locations', function(req, res) {
    req.connection.setTimeout(10000);

    var gpsData = nmea.parse(req.query.gps_data);

    var loc = new usergrid.entity({
        client: client,
        data: {
            type: 'locations',
            session_id: req.query.session_id,
            latitude: gpsData.latitude,
            longitude: gpsData.longitude
        }
    });

    loc.save(function(err) {
        res.send(err ? 500 : 201);
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on ' + port);
});