const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  users: {
    marduk: 'admin',
    ra8ga: 'rafal.furmaga',
  },
  workflow: {
    '711': {
      // backlog
      '721': {
        // select for development
        '731': {
          // open the issue
          '4': {
            // in progress
            '5': null,
            '2': null,
          },
          '5': {
            // resolved
            '701': null, // close
            '3': null, // reopen
            '711': null,
          },
          '2': {
            // closed
            '711': null,
          },
        },
      },
    },
  },
  statusToTransition: {
    Backlog: '711',
    'In progress': '4',
    Done: '5',
  },
  statusToStatusCategory: {
    Backlog: 'new',
    'Selected for Development': 'new',
    Open: 'new',
    'In progress': 'indeterminate',
    Done: 'done',
  },
  issueTypes: {
    bug: 10004,
    story: 10001,
    epic: 10000,
    task: 10002,
    subtask: 10003,
  },
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
