var usergrid = require('usergrid');
var argv = require('optimist').argv;

var options = {
    sessionId: argv.session || Math.ceil(Math.random() * 10000),
    referencePoint: {
        latitude: argv.lat || 40.79234133,
        longitude: argv.lon || 29.46821250
    },
    times: argv.times || 10,
    interval: argv.interval || 10000
};

console.log("\nrunning with options:\n\n", options);

var client = new usergrid.client({
    URI: 'http://usergridstack.dnsdynamic.com:8080',
    orgName: 'deneme',
    appName: 'sandbox',
    logging: true
});

var i = 1;

var interval = setInterval(function() {
    var latitude, longitude;

    if (Math.random() > 0.5) {
        latitude = options.referencePoint.latitude + Math.random() * 0.0001;
        longitude = options.referencePoint.longitude + Math.random() * 0.0001;
    } else {
        latitude = options.referencePoint.latitude - Math.random() * 0.0001;
        longitude = options.referencePoint.longitude - Math.random() * 0.0001;
    }

    var location = new usergrid.entity({
        client: client,
        data: {
            type: 'locations',
            session_id: options.sessionId,
            latitude: latitude,
            longitude: longitude
        }
    });

    console.log(location.serialize());

    location.save(function (err) {
        console.log(err ? 'Error' : '');

        if (!err) {
            options.referencePoint = {
                latitude: latitude,
                longitude: longitude
            };
        }
    });

    i++;

    if (i > options.times) {
        clearInterval(interval);
    }
}, options.interval);