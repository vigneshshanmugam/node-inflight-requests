# node-inflight-requests

Measure the number of inflight requests at any single time in your Node.js server.

### Install

```
npm install node-inflight-requests
```

### Usage

```js
const http = require("http");
const congestion = require("node-inflight-requests")({ error: false });
const server = http.createServer(serve);

function serve(req, res) {
  const inflightReqs = congestion(res);

  console.log("No of requests in flight", inflightReqs);

  if (inflightReqs > 100) {
    res.statusCode = 503; // Service Unavailable
    res.setHeader("Retry-After", 10);
  }

  res.end();
}
```
