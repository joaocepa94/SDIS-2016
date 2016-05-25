const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const CorsHeaders = require('hapi-cors-headers');

const server = new Hapi.Server();

server.connection({
    port: 3000
});

server.register([
    Inert,
    Vision,
    {
        'register': require('hapi-swagger'),
        'options': {
    		info: {
            	'title': 'Test API Documentation',
            	'version': require('./package').version,
        	}
    	} 
    }], 
    (err) => {
        server.start( (err) => {
           if (err) {
                console.log(err);
            } else {
                console.log('Server running at:', server.info.uri);
            }
        });
    });

server.ext('onPreResponse', CorsHeaders);
require('./routes')(server);
