const config = require('../core/config');
const mining = require('./mining');

module.exports = {
  geneisBlock: function() {
    return {
      hash: config.GENESIS_BLOCK_HASH,
      previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      blockVersion: 1,
      nonce: 0,
      timstamp: config.GENESIS_BLOCK_TIMESTAMP,
      difficulty: 0,
      extraData: config.GENESIS_BLOCK_MESSAGE,
      transactions: [
        {
          from: "COINBASE",
          to: config.PREMINE_ADDRESS,
          amount: config.PREMINE_AMOUNT,
          type: 0,
          signature: ""
        }
      ],
      transactionMerkleHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      unspentUTOX: []
    }
  },

  generateGenesisTx: async function() {
    let blockData = module.exports.geneisBlock();
    delete blockData.hash;

    let mine = await mining.mineBlock(blockData, "0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    let verification = mining.verifyBlock(mine.hash, blockData, mine.nonce);

    // Check if block is valid
    if(verification) {
      console.log(`Your genesis transaction is '${mine.hash}'`);
      console.log(`Please put this in 'core/config.js' in the variable 'GENESIS_BLOCK_HASH'`);
    } else {
      console.log('Could not create genesis transaction');
    }
  }
}