var usergrid = require('usergrid');

var client = new usergrid.client({
    URI: 'http://usergridstack.dnsdynamic.com:8080',
    orgName: 'deneme',
    appName: 'sandbox',
    logging: true
});

var sessionId = Math.ceil(Math.random() * 10000);

var referencePoint = {
    latitude: 40.79234133,
    longitude: 29.46821250
};

setInterval(function() {
    var latitude, longitude;

    if (Math.random() > 0.5) {
        latitude = referencePoint.latitude + Math.random() * 0.0001;
        longitude = referencePoint.longitude + Math.random() * 0.0001;
    } else {
        latitude = referencePoint.latitude - Math.random() * 0.0001;
        longitude = referencePoint.longitude - Math.random() * 0.0001;
    }

    var location = new usergrid.entity({
        client: client,
        data: {
            type: 'locations',
            session_id: sessionId,
            latitude: latitude,
            longitude: longitude
        }
    });

    console.log(location.serialize());

    location.save(function (err) {
        console.log(err ? 'Error' : '');

        if (!err) {
            referencePoint = {
                latitude: latitude,
                longitude: longitude
            };
        }
    });
}, 10000);