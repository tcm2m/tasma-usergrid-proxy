module.exports = function(grunt) {
    grunt.initConfig({
        'generate-location': {
            options: {
                sessionId: Math.ceil(Math.random() * 10000),
                latitude: 40.79234133,
                longitude: 29.46821250,
                times: 10,
                interval: 10000,
                usergrid: {
                    orgName: 'tcm2m',
                    appName: 'sandbox',
                    logging: true
                }
            }
        }
    });

    grunt.registerTask('default', ['generate-location']);

    grunt.registerTask('generate-location', "Verilen referans noktasına yakın lokasyonlar üreterek Usergrid'e gönderir.", function() {
        var usergrid = require('usergrid');
        var conf     = require('nconf');
        var done     = this.async();

        conf.argv()
            .defaults(this.options());

        var client = new usergrid.client(conf.get('usergrid'));

        var i = 1;

        var interval = setInterval(function() {
            var latitude, longitude;

            if (Math.random() > 0.5) {
                latitude = conf.get('latitude') + Math.random() * 0.0001;
                longitude = conf.get('longitude') + Math.random() * 0.0001;
            } else {
                latitude = conf.get('latitude') - Math.random() * 0.0001;
                longitude = conf.get('longitude') - Math.random() * 0.0001;
            }

            var location = new usergrid.entity({
                client: client,
                data: {
                    type: 'locations',
                    session_id: conf.get('sessionId'),
                    latitude: latitude,
                    longitude: longitude
                }
            });

            grunt.log.writeflags(location.serialize(), 'submitting location');

            location.save(function(err) {
                if (err) {
                    grunt.log.error(err);
                } else {
                    conf.set('latitude', latitude);
                    conf.set('longitude', longitude);
                }
            });

            i++;

            if (i > conf.get('times')) {
                clearInterval(interval);

                done();
            }
        }, conf.get('interval'));
    });

};