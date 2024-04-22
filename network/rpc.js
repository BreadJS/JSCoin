const express = require('express');

const log = require('../core/log');
const config = require('../core/config');
const core = require('../core/core');
const p2p = require('./p2p');

const app = express();

module.exports = {
  // Start the RPC server
  createListener: function() {
    // Start listening
    app.listen(config.RPC_PORT, () => {
      log.info(`RPC Server is listening on 0.0.0.0:${config.RPC_PORT}`);
    });

    // Handle all routes
    this.handleRequests();
  },

  handleRequests: function() {
    app.get('/info', this.info);

    // When route is not found
    app.use((req, res) => {
      res.json({
        "success": false,
        "code": -1,
        "message": "This is not a valid request"
      });
    });
  },

  info: function(req, res) {
    res.json({
      "success": true,
      "message": {
        "name": config.NAME,
        "ticker": config.TICKER,
        "decimals": config.DECIMALS,
        "difficulty_target": config.DIFFICULTY_TARGET,
        "algorithm": config.ALGORITHM,
        "version": config.VERSION,
        "version_formatted": core.formattedVersion(),
        "max_supply": config.MAX_SUPPLY / (10**config.DECIMALS),
        "block_reward": config.BLOCK_REWARD / (10**config.DECIMALS),
        "minimum_transaction_fee": config.TX_MINIMUM_TRANSACTION_FEE / (10**config.DECIMALS),
        "tx_confirmation_threshold": config.TX_CONFIRMATION_THRESHOLD,
        "network_id": config.NETWORK_ID,
        "peer_id": p2p.currentNodeId
      }
    });
  },
};