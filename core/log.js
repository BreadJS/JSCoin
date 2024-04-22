const chalk = require('chalk');

module.exports = {
  INFO_COLOR: "#76D7C4",
  WARN_COLOR: "#FFC300",
  ERR_COLOR: "#FF5733",
  CMD_COLOR: "#D2B4DE",

  TIMESTAMP_COLOR: "#85929E",
  
  getTime: function() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  },

  info: function(...msg) {
    console.log(`${chalk.hex(this.TIMESTAMP_COLOR)(`[${this.getTime()}]`)} ${chalk.hex(this.INFO_COLOR)('[INFO]')} ${msg}`);
  },
  
  warning: function(...msg) {
    console.log(`${chalk.hex(this.TIMESTAMP_COLOR)(`[${this.getTime()}]`)} ${chalk.hex(this.WARN_COLOR)('[WARN]')} ${msg}`);
  },
  
  error: function(...msg) {
    console.log(`${chalk.hex(this.TIMESTAMP_COLOR)(`[${this.getTime()}]`)} ${chalk.hex(this.ERR_COLOR)('[ERR]')} ${msg}`);
  },
  
  cmd: function(...msg) {
    console.log(`${chalk.hex(this.TIMESTAMP_COLOR)(`[${this.getTime()}]`)} ${chalk.hex(this.CMD_COLOR)('[CMD]')} ${msg}`);
  },
};