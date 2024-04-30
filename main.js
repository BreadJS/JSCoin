const config = require('./core/config');
const core = require('./core/core');
const db = require('./core/db');
const log = require('./core/log');

const p2p = require('./src/network/p2p');
const p2p_client = require('./src/network/p2p_client');
const rpc = require('./src/network/rpc');

console.clear();

(async() => {
  console.clear();
  log.info(`Starting ${config.NAME} v${core.formattedVersion()}...`);

  // Startup
  core.startup();
  core.commandHandler();
  await core.argumentsHandler();

  // Initialize Database
  db.initDatabase();

  // Starting RPC and P2P listeners
  p2p.createListener();
  p2p.eventHandler();
  rpc.createListener();

  // Connect to seed nodes
  p2p_client.connectToSeedNodes();

  // Check genesis block
  db.checkGenesis();


})();