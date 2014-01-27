var http = require('http');

module.exports = function(app) {

    app.get('/elfinder/*', function(req, res){
        console.log(req.method);
        req.on('data', function (chunk) {
            reqChunks.push(chunk);
        });

        req.on('end', function () {
            console.log(req.method);
            redirectUrl(req, res);
        });
    });

    app.get('/connector.js', function(req, res){
        console.log("elFinder = " + JSON.stringify(req.query));

        req.on('data', function (chunk) {
            reqChunks.push(chunk);
        });

        req.on('end', function () {
            console.log(req.method);
            if (req.user) {
                var id = req.user.id;
            }
            redirectUrl(req, res);
        });
    });

    app.post('/connector.js', function(req, res){
        req.on('data', function (chunk) {
            if (req.reqChunks === undefined) {
                req.reqChunks = [];
            }
            req.reqChunks.push(chunk);
        });

        req.on('end', function () {
            console.log(req.method);
            redirectUrl(req, res);
        });
    });

    function redirectUrl(request, response) {

        var user_id = -1;

        if (request.user && request.user.id) {
            user_id = request.user.id;
        } else {
            response.write('{"error" : ["errSessionExpires"]}', 'utf8');
            response.end();
            return;
        }

        request.headers.host = 'localhost:8080';
        request.headers.origin = 'http://localhost:8080';
        request.headers.referer = 'http://localhost:8080/elfinder/elfinder.src.html';

        delete request.headers['cookie'];

        console.log('HEADERS: ' + JSON.stringify(request.headers));

        var options = {
            host: 'localhost',
            port: 8080,
            path: request.url,
            method: request.method,
            headers: request.headers
        };

        // The "URL" option in elFinder connector must be disabled => all must be handled by connector:
        // 1. to prevent real file path from being shown
        // 2. for security reasons, to prevent change elFinder "root" in the url
        if (options.path.startsWith('/connector.js')) {
            options.path = options.path.replace('/connector.js', '/elfinder/php/connector.php');
            if (options.path.indexOf('user_id=') == -1) {
                if (request.method == 'GET') {
                    if (options.path.indexOf('?') == -1)
                        options.path += '?user_id=' + user_id;
                    else
                        options.path += '&user_id=' + user_id;
                } else
                if (request.method == 'POST') {
                    options.path += '?user_id=' + user_id; //!!!
                }
            } else {
                response.write('For the security reasons, user_id param is not allowed!', 'utf8');
                response.end();
                return;
            }
        } else {
            response.write('For the security reasons, direct access is not allowed!', 'utf8');
            response.end();
            return;
        }

        console.log('options.path: ' + options.path);

        var proxyReq = http.request(options, function(proxyRes) {
            console.log('STATUS: ' + proxyRes.statusCode);
            console.log('HEADERS: ' + JSON.stringify(proxyRes.headers));

            //proxyRes.setEncoding('utf8');

            // Proxy the headers
            response.writeHead(proxyRes.statusCode, proxyRes.headers);

            // Proxy the response
            proxyRes.on('data', function (chunk) {
                //response.write(chunk, 'binary');
                if (proxyRes.resChunks === undefined) {
                    proxyRes.resChunks = [];
                }
                proxyRes.resChunks.push(chunk);
            });
            proxyRes.on('error', function(e){
                console.log('error: ' + e.message);
            });
            proxyRes.on('end', function(){
                if (proxyRes.resChunks !== undefined) {
                    proxyRes.resChunks.forEach(function (chunk) {
                        response.write(chunk, 'binary');
                    });
                }
                response.end();
                if (proxyRes.resChunks !== undefined) {
                    proxyRes.resChunks.length= 0;
                }
            });
        });

        proxyReq.on('error', function (e) {
            console.log('error: ' + e.message);
        });

        // tcp/ip send headers
        proxyReq.end();

        if (request.method == 'POST') {
            if (request.reqChunks !== undefined) {
                request.reqChunks.forEach(function(chunk) {
                    proxyReq.write(chunk, 'binary');
                });
            }
            // tcp/ip send body
            proxyReq.end();
            if (request.reqChunks !== undefined) {
                request.reqChunks.length= 0;
            }
        }
    }

    if (!String.prototype.startsWith) {
        Object.defineProperty(String.prototype, 'startsWith', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (searchString, position) {
                position = position || 0;
                return this.indexOf(searchString, position) === position;
            }
        });
    }
};
