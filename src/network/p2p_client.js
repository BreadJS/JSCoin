const socketIOClient = require('socket.io-client');
const chalk = require('chalk');

const config = require('./../../core/config');
const core = require('./../../core/core');
const log = require('./../../core/log');
const p2p = require('./p2p');

module.exports = {
  connectToNode: function(address) {
    const socket = socketIOClient(`http://${address}`);

    // Connected to a node
    socket.on('connect', () => {
      // Add this connection to array
      p2p.outgoingNodes.push(socket);

      // Request peer id from node
      socket.emit('getNodeInfo');

      // Connection log
      if(core.showConnections) {
        log.info(`${chalk.hex('#E0A2F3')('[CONN]')} ${chalk.hex('#BFF3A2')('[OUT]')} ${chalk.grey(`[${address}]`)} Connected to node`);
      }
    });

    // Disconnected from a node
    socket.on('disconnect', () => {
      const index = p2p.outgoingNodes.indexOf(socket);
      if (index !== -1) {
        p2p.outgoingNodes.splice(index, 1);
      }
    });

    // Get the node information
    socket.on('getNodeInfo', (data) => {
      // Socket index
      let socketIndex = p2p.getConnectionIndex(p2p.outgoingNodes, socket);

      // Check node id
      let nodeIdValid = this.checkNodeIdToOwn(data.peerId, socket);

      // If node id is valid
      if(nodeIdValid) {
        // Get node information
        p2p.outgoingNodes[socketIndex].nodeId = data.nodeId;
        
        // Connection log
        if(core.showConnections) {
          log.info(`${chalk.hex('#E0A2F3')('[CONN]')} ${chalk.hex('#BFF3A2')('[OUT]')} ${chalk.grey(`[${address}]`)} Node identified as: ${chalk.bold(p2p.outgoingNodes[socketIndex].nodeId)}`);
        }
      }
    });
  },

  connectToSeedNodes: function() {
    // Loop over seed nodes and connect to it
    for(let i = 0; i < config.SEED_NODES.length; i++) {
      this.connectToNode(config.SEED_NODES[i]);
    }
  },

  // Check if node has same node id as this node
  checkNodeIdToOwn: function(id, socket) {
    if(id == p2p.currentNodeId) {
      // Disconnect from node
      socket.disconnect();

      // Return false
      return false;
    } else {
      // Return true
      return true;
    }
  }
};