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
        },
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    args: ['-L'],
                    delayTime: 1
                }
            }
        }
    });

    grunt.registerTask('default', ['nodemon']);

    grunt.registerTask('generate-location', "Verilen referans noktasına yakın lokasyonlar üreterek Usergrid'e gönderir.", function() {
        var usergrid = require('usergrid');
        var conf     = require('nconf');
        var done     = this.async();

        conf.argv()
            .defaults(this.options());

        var client = new usergrid.client(conf.get('usergrid'));

        var i = 0;

        grunt.util.async.whilst(
            function() {
                return i < conf.get('times');
            },
            function(callback) {
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

                grunt.log.writeflags(location, 'submitting location');

                location.save(function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        conf.set('latitude', latitude);
                        conf.set('longitude', longitude);

                        setTimeout(callback, conf.get('interval'));
                    }

                    i++;
                });
            },
            function(err) {
                done(err);
            }
        );
    });

    grunt.loadNpmTasks('grunt-nodemon');
};