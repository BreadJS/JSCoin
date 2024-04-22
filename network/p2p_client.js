const socketIOClient = require('socket.io-client');

const config = require('./../core/config');
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
      // Check node id
      let nodeIdValid = this.checkNodeIdToOwn(data.peerId, socket);

      // If node id is valid
      if(nodeIdValid) {
        console.log(data.networkHeight);
        console.log(data.nodeHeight);
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