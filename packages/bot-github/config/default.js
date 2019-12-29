const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  RCHost: process.env.RC_HOST,
  RCUser: process.env.RC_USER,
  RCPass: process.env.RC_PASS,
  RCBotname: '@github',
  RCSSL: process.env.RC_SSL,
  RCRooms: process.env.RC_ROOMS,
}
