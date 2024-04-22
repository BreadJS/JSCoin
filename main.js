const config = require('./core/config');
const core = require('./core/core');
const db = require('./core/db');
const log = require('./core/log');

const p2p = require('./network/p2p');
const p2p_client = require('./network/p2p_client');
const rpc = require('./network/rpc');

console.clear();

(async() => {
  log.info(`Starting ${config.NAME} v${core.formattedVersion()}...`);

  // Startup
  core.startup();
  core.commandHandler();
  await core.argumentsHandler();

  // Starting RPC and P2P listeners
  p2p.createListener();
  p2p.eventHandler();
  rpc.createListener();

  // Connect to seed nodes
  p2p_client.connectToSeedNodes();
})();