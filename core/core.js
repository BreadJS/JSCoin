const log = require('./log');
const config = require('./config');

const chalk = require('chalk');
const readline = require('readline');
const args = require('args-parser')(process.argv);

const readInput = readline.createInterface({
  input: process.stdin
});

module.exports = {
  // Get version in readable format
  formattedVersion: function() {
    const versionString = config.VERSION.toString();

    const major = versionString.charAt(0);
    const minor = versionString.charAt(1);
    const patch = versionString.charAt(2);
    
    return `${major}.${minor}.${patch}`;
  },

  // Shutdown handler
  shutdownApplication: function() {
    // Logger
    log.cmd(`Stopping ${config.NAME} v${this.formattedVersion()}...`);

    // Exit application
    process.exit(0);
  },

  // Core functions to startup with
  startup: function() {
    // Handle SIGINT and SIGTERM signals
    process.on('SIGINT', this.shutdownApplication.bind(this));
    process.on('SIGTERM', this.shutdownApplication.bind(this));
  },

  // Handeling commands in terminal
  commandHandler: function() {
    readInput.on('line', (input) => {
      input = input.trim().toLowerCase();

      if (input === 'exit') {
        this.shutdownApplication();
      } else if (input === 'help') {
        log.cmd(`These are usable commands:`);
        log.cmd();
        log.cmd(`${chalk.white('GENERAL')}`);
        log.cmd(`  status`);
        log.cmd(`  exit`);
      } else {
        log.cmd(`'${input}' is not a valid command. Type 'help' to see available commands`);
      }
    });
  },
  
  // Arguments handler
  argumentsHandler: function() {
    return new Promise((resolve, reject) => {
      let i = 0;
      for (const arg in args) {
        // P2P Port
        if(arg == "p2p-port") {
          let p2pPort = args[arg];
          let validPort = false;

          // If port is valid, set the port
          if(!isNaN(p2pPort)) {
            if(p2pPort > 0 && p2pPort < (65535 + 1)) {
              config.P2P_PORT = p2pPort;
              validPort = true;
            }
          }

          // If port is invalid, log and exit
          if(!validPort) {
            log.error(`'${arg}' does not use a valid port number`);
            process.exit();
          }
        }

        // RPC Port
        if(arg == "rpc-port") {
          let rpcPort = args[arg];
          let validPort = false;

          // If port is valid, set the port
          if(!isNaN(rpcPort)) {
            if(rpcPort > 0 && rpcPort < (65535 + 1)) {
              config.RPC_PORT = rpcPort;
              validPort = true;
            }
          }

          // If port is invalid, log and exit
          if(!validPort) {
            log.error(`'${arg}' does not use a valid port number`);
            process.exit();
          }
        }

        // Check if P2P & RPC port is the same
        if(config.P2P_PORT == config.RPC_PORT) {
          log.error('It is not allowed to use the same port for RPC and P2P');
          process.exit();
        }

        // If last item reached return promise
        if(Object.keys(args).length == i+1) {
          resolve();
        }

        // Add 1 to counter
        i++;
      }
      
      // If there are no arguments
      if(Object.keys(args).length == 0) {
        resolve();
      }
    });
  },

  // Convert hash to KH/MH/GH/etc.
  formatHashrate: function(hashrate){
    let i = 0;
    let byteUnits = [' H', ' KH', ' MH', ' GH', ' TH', ' PH', ' EH', ' ZH', ' YH' ];
    while (hashrate > 1000){
      hashrate = hashrate / 1000;
      i++;
    }
    return hashrate.toFixed(i == 0 ? 0 : 2).toLocaleString('en-US', {maximumFractionDigits: 4}) + byteUnits[i];
  },

  // Verify if string is a valid hex
  isValidHex: function(string) {
    // Regular expression to match hexadecimal characters
    const hexRegex = /^[0-9a-fA-F]+$/;

    // Test if the string contains only valid hexadecimal characters
    return hexRegex.test(string);
}
};