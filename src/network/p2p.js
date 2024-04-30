const http = require('http');
const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const chalk = require('chalk');

const log = require('../../core/log');
const config = require('../../core/config');
const core = require('../../core/core');

const server = http.createServer();
const io = socketIO(server);

module.exports = {
  currentNodeId: "",
  outgoingNodes: [],
  incomingNodes: [],

  // Create a unique peer id
  createUniqueId: function() {
    this.currentNodeId = uuidv4();
    return this.currentNodeId;
  },

  // Start the P2P server
  createListener: function() {
    // Create a unique peer id
    log.info(`Created a unique peer ID (${this.createUniqueId()})`);

    // Start listening
    server.listen(config.P2P_PORT, () => {
      log.info(`P2P Server is listening on 0.0.0.0:${config.P2P_PORT}`);
    });
  },

  eventHandler: function() {
    io.on('connection', (socket) => {
      // Add this connection to array
      this.incomingNodes.push(socket);
      
      // Connection log
      if(core.showConnections) {
        let address = core.ipv4Regex(socket.handshake.address).address;
        log.info(`${chalk.hex('#E0A2F3')('[CONN]')} ${chalk.hex('#BFF3A2')('[IN]')} ${chalk.grey(`[${address}]`)} node has been connected`);
      }

      // Disconnected from a node
      socket.on('disconnect', () => {
        const index = this.incomingNodes.indexOf(socket);
        if (index !== -1) {
          this.incomingNodes.splice(index, 1);
        }
      });

      // Give node information
      socket.on('getNodeInfo', () => {
        socket.emit('getNodeInfo', {
          peerId: this.currentNodeId,
          networkHeight: 0,
          nodeHeight: 0,
        });
      });
    });
  }
};