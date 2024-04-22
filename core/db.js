let JsonDB = require('node-json-db');

let blocksDb = new JsonDB("blockchain/blocks.json", true, true);
let peersDb = new JsonDB("blockchain/peers.json", true, true);

module.exports = {
  // Get all the saved peers
  getSavedPeers: function() {
    try {
      return peersDb.getData("/peers");
    } catch(e) {
      peersDb.push("/peers", []);
      return peersDb.getData("/peers");
    }

    /*{
      "peers": [
        { "ip": "192.168.0.1", "last_seed": "2023-04-18T14:25:36Z" },
        { "ip": "10.0.0.2", "last_seed": "2023-04-19T09:15:22Z" }
      ]
    } */
  },

  // Save or update a specific peer
  savePeer: function(ip, last_seen) {
    let resultSuccess = false;
    try {
      let peers = peersDb.getData("/peers");

      // Search if peer exists
      let foundId = -1;
      for(let i = 0; i < peers.length; i++) {
        if(peers[i].ip == ip) {
          foundId = i;
        }
      }

      // If peer id has been found 
      if(foundId == -1) {
        // Push into array
        peers.push({ ip, last_seen }); 
      } else {
        peers[foundId]['last_seen'] = last_seen;
      }

      // Save array
      peersDb.push("/peers", peers);

      // Return true success
      resultSuccess = true;
      return resultSuccess;
    } catch(e) {
      // Return false success
      return resultSuccess;
    }
  },
};