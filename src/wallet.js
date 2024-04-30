const crypto = require('crypto');
const secp256k1 = require('secp256k1');

const core = require('./../core/core');

module.exports = {
  // Generate a random wallet address
  generateWallet: function() {
    // Generate a new private key
    const privateKey = crypto.randomBytes(32);

    // Derive the public key from the private key
    const ecdh = crypto.createECDH('secp256k1');
    ecdh.setPrivateKey(privateKey);
    const publicKey = ecdh.getPublicKey('hex');

    // Derive the address from the public key (this is just a simple example)
    const address = crypto.createHash('sha256').update(publicKey, 'hex').digest('hex');

    // Return generated wallet
    return {
      privateKey: privateKey.toString('hex'),
      publicKey,
      address: `0x${address}`
    };
  },

  // Generate a wallet address with a specific prefix (this can take some time)
  generateVanity: function(prefix) {
    let vanityCounter = 0;

    // Check if prefix is a valid hex
    if(!core.isValidHex(prefix)) {
      return {
        privateKey: null,
        publicKey: null,
        address: null,
        counter: null,
        error: "Prefix is not a valid hex"
      };
    }

    // Generate wallets until prefix is met
    while (true) {
      // Generate wallet
      let wallet = this.generateWallet();

      // Add wallet generation counter
      vanityCounter++;

      // Check if the address starts with the specified prefix
      if (wallet.address.startsWith(`0x${prefix.toLowerCase()}`)) {
        return {
          privateKey: wallet.privateKey,
          publicKey: wallet.publicKey,
          address: wallet.address,
          counter: vanityCounter
        };
      }
    }
  },

  // Import your wallet address with a private key
  importWallet: function(privateKey) {
    try {
      // Convert the private key from hexadecimal string to a Buffer
      const privateKeyBuffer = Buffer.from(privateKey, 'hex');

      // Derive the public key from the private key
      const ecdh = crypto.createECDH('secp256k1');
      ecdh.setPrivateKey(privateKeyBuffer);
      const publicKey = ecdh.getPublicKey('hex');
      const address = crypto.createHash('sha256').update(publicKey, 'hex').digest('hex');

      // Return privateKey, publicKey and address
      return {
        privateKey,
        publicKey,
        address: `0x${address}`
      };
    } catch(e) {
      // Return error
      return {
        privateKey: null,
        publicKey: null,
        address: null,
        error: "This is not a valid private key"
      };
    }
  }
};
