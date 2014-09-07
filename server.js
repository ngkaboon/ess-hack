var pathbase = '/hint/es/v2/ac/en_SG/';

var options = {
  host: 'suggest.expedia.com',
  path: pathbase
};

var fs=require('fs');

// Load the http module to create an http server.
var http = require('http');
var str;
var req_done=false;

callback = function(resp) {
  str = '';
  req_done=false;
  console.log("nothing2");
  
  resp.on('data', function (chunk) {
    str += chunk;
  });

  resp.on('end', function () {
    console.log("nothing");
    cb(str);
  });
}

relay = function(opt, cb) {
    req = http.request(opt,  function(resp) {
        str = '';
        resp.on('data', function (chunk) {
            str += chunk;
        });

        resp.on('end', function () {
            cb(str);
        });});

    req.end();
}

var server = http.createServer(function (request, response) {
    // console.log(request.url);
    if (request.url.substring(0,5) == '/json') {
        options["path"] = pathbase + request.url.substring(5);
        relay(options, function (s) {
            response.writeHead(200, {"Content-Type": "application/json"});  
            var str = s.substring(1,s.length-1);
            response.end(str);});
    }   
    else {
        fn = request.url.substring(1);
        response.writeHead(200, {"Content-Type": "text/html"});  
        fs.readFile(fn, function (err, data) {
            if (err) {
                response.end();
            }
            else {
                response.end(data);
            }
        });
    }
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");
