const crypto = require('crypto');

module.exports = {
  hashingItterations: 1024,

  VerumHash: function(data) {
    const len = data.length;
    const buffer = Buffer.allocUnsafe(len * 4);
    let hash;

    for (let i = 0; i < this.hashingItterations; i++) {
      hash = crypto.createHash('sha3-256').update(data).digest();

      for (let j = 0; j < len; j++) {
        buffer[j * 4] = hash[j * 4];
        buffer[j * 4 + 1] = hash[j * 4 + 1];
        buffer[j * 4 + 2] = hash[j * 4 + 2];
        buffer[j * 4 + 3] = hash[j * 4 + 3];
      }

      data = Buffer.from(buffer);
    }

    return hash;
  },

  VerumVerify: function(hash, blockData, nonce) {
    const resultHash = this.VerumHash(Buffer.from(blockData + nonce), this.hashingItterations).toString('hex');
    return hash == resultHash ? true : false;
  }
}