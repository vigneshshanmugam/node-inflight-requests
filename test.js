const http = require("http");
const assert = require("assert");
const congestion = require("./index")();

let port;
let inflight;
let server;

describe("Test congestion", () => {
  beforeEach(done => {
    server = http.createServer((req, res) => {
      inflight = congestion(res);
      setTimeout(() => {
        res.end();
      }, 20);
    });

    server.listen(0, () => {
      port = server.address().port;
      done();
    });
  });

  afterEach(done => {
    server.close(() => {
      done();
    });
  });

  it("measure no of inflight req", done => {
    const url = `http://127.0.0.1:${port}`;

    Array(2)
      .fill(url)
      .map(u => {
        http.get(u).end();
      });

    setTimeout(() => {
      assert.equal(inflight, 2);
      done();
    }, 10);
  });

  it("increment and decrement inflight", done => {
    const url = `http://127.0.0.1:${port}`;

    const reqs = Array(2)
      .fill(url)
      .map(u => {
        const req = http.get(u);
        req.end();
        return req;
      });

    reqs[0].abort();

    setTimeout(() => {
      assert.equal(inflight, 1);
      done();
    }, 10);
  });
});
