var express  = require('express');
var nmea     = require('nmea-0183');
var usergrid = require('usergrid');
var conf     = require('nconf');
var app      = express();

conf.argv()
    .env()
    .defaults({
        usergrid: {
            orgName: 'tcm2m',
            appName: 'sandbox',
            logging: true
        }
    });

app.use(express.logger('dev'));

app.configure('development', function() {
    app.use(express.errorHandler());
});

var client = new usergrid.client(conf.get('usergrid'));

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

    console.log('submitting location:');
    console.dir(loc);

    loc.save(function(err) {
        res.send(err ? 500 : 201);
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on ' + port);
});