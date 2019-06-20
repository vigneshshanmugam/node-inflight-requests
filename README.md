# node-inflight-requests

Measure the number of inflight requests at any given time in your Node.js server.

### Why?

When the application is under extreme load (DDOS) and lots of services are involved in serving the page requests, It becomes quite difficult to avoid the cascading service failures. As a result, the request queue grows so will latency until all the requests starts timing out and system will ultimately run our of memory and crash.

By analysing the concurrency(number of requests an application can service at any given time) limit of the application through performance and load testing, We can configure the fixed limit on the application level and reject the queued requests.

There are also other patterns like using eventloop as a tipping point for dropping requests. Combining both of these techniques, We can tune the application in much better way.

### Install

```
npm install node-inflight-requests
```

### Usage

```js
const http = require("http");
const congestion = require("node-inflight-requests")();

const server = http.createServer(serve);

function serve(req, res) {
  const inflightReqs = congestion(res);

  console.log("No of requests in flight", inflightReqs);

  reportMetrics(inflightReqs);
  // 100 -denotes the limit the system can handle at any given time
  if (inflightReqs > 100) {
    res.statusCode = 503; // Service Unavailable
    res.setHeader("Retry-After", 10);
  }

  res.end();
}
```

### License

The MIT License (MIT)

Copyright (c) 2019 [Vignesh Shanmugam](https://vigneshh.in)
