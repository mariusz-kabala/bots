const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  users: {},
  RCHost: process.env.RC_HOST,
  RCUser: process.env.RC_USER,
  RCPass: process.env.RC_PASS,
  RCBotname: '@jira',
  RCSSL: process.env.RC_SSL,
  RCRooms: process.env.RC_ROOMS,
  JiraProtocol: process.env.JIRA_PROTOCOL || 'https',
  JiraHost: process.env.JIRA_HOST,
  JiraUsername: process.env.JIRA_USERNAME,
  JiraPassword: process.env.JIRA_PASSWORD,
  JiraAPIVersion: process.env.JIRA_API_VERSION || '2',
  JiraStrictSSL: true,
}
