"use strict";

const endOfStream = require("end-of-stream");

module.exports = function congestion(opts) {
  let inflightReqs = 0;
  opts = opts || {};
  const error = opts.error || false;

  function handler() {
    inflightReqs--;
    /** Handle edge case */
    if (error && inflightReqs < 0) {
      throw new Error(
        `Inflight Requests is below minimum threshold - ${inflightReqs}`
      );
    }
  }

  return function(response) {
    inflightReqs++;

    endOfStream(response, handler);

    return inflightReqs;
  };
};
