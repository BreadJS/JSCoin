const hashing = require('./hashing');
const core = require('./../core/core');

module.exports = {
  currentHashrate: 0,
  
  mineBlock: function (blockData, target) {
    return new Promise((resolve, reject) => {
      let nonce = 0;
      let nonceBeforeCalc = 0;
      let startTime = Date.now();
      let hash;
      let intervalId;

      // Function to calculate and log hashes per second
      function calculateHashRate() {
        module.exports.currentHashrate = ((nonce - nonceBeforeCalc) * hashing.hashingItterations);
        nonceBeforeCalc = nonce;
      }

      // Start the interval to check the hashrate every second
      intervalId = setInterval(calculateHashRate, 1000);

      // Function to asynchronously mine blocks
      function mineAsync() {
        hash = hashing.VerumHash(Buffer.from(blockData + nonce));

        // If block has been found
        if (Buffer.compare(hash, Buffer.from(target, 'hex')) <= 0) {
          // Stop the interval when block is found
          clearInterval(intervalId);

          // Return the data
          resolve({
            hash: hash.toString('hex'),
            nonce,
            time: Date.now() - startTime
          });
        } else {
          nonce++;
          // Schedule the next iteration of mining after a short delay
          setTimeout(mineAsync, 0);
        }
      }

      // Start the asynchronous mining process
      mineAsync();
    });
  },

  verifyBlock: function (hash, blockData, nonce) {
    return hashing.VerumVerify(hash, blockData, nonce);
  }
};