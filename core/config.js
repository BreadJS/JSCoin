module.exports = {
  NAME: "Verum",                            // Coin name
  TICKER: "VRM",                            // Coin ticker
  DECIMALS: 8,                              // Coin decimals
  DIFFICULTY_TARGET: 10,                    // Difficulty target and block time
  ALGORITHM: "SHA256",                      // Network version
  VERSION: 100,

  MAX_SUPPLY: 2000000000000000,             // 20,000,000 - Value should be in atomic units
  PREMINE_AMOUNT: 20000000000000,           // 200,000 - Value should be in atomic units
  PREMINE_ADDRESS: "",                      // This is the premine wallet address
  BLOCK_REWARD: 100000000,                  // 1.00000000 - Value should be in  atomic units
  HALVING_INTERVAL: 200000,                 // 200,000 every blocks

  GENESIS_BLOCK_TIMESTAMP: 17144872260000,
  GENESIS_BLOCK_HASH: "021feb0a08e8c50c808ea92fb9febd586271060099856814f85dfb6d08df34a7",
  GENESIS_BLOCK_MESSAGE: "The only limit is yourself! ^-^",
  
  TX_MINIMUM_TRANSACTION_FEE: 100,          // 0.00000100 - Value should be in  atomic units
  TX_MEMPOOL_SIZE_LIMIT: 10000,             // 10,000 TXs in mempool
  TX_CONFIRMATION_THRESHOLD: 10,            // 10 Confirmations until unlocked
  TX_COINBASE_CONFIRMATION_THRESHOLD: 10,   // 10 Confirmations until unlocked
  MAX_BLOCK_TXS: 100,                       // Maximum of 100 TXs in a block

  // Network ID
  NETWORK_ID: [0x00, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x90],

  P2P_PORT: 24000,                          // P2P Port
  RPC_PORT: 24001,                          // RPC Port
  WALLET_PORT: 24002,                       // Wallet API Port

  SEED_NODES: [
    "127.0.0.1:24000",
    "127.0.0.1:24100"
  ]
};