const JiraAPI = require('jira-client');
const { link } = require('./markdown')

const host = 'geotags.atlassian.net'

const jira = new JiraAPI({
    protocol: 'https',
    host,
    username: 'mariusz@kabala.waw.pl',
    password: 'ooGaueR81BNaranx7bBA862A',
    apiVersion: '2',
    strictSSL: true
});

const formatIssue = (issue, showAssign = false) => {
    let formatted = ''
    const parent = issue.fields.parent
    
    if (parent) {
      formatted += `[${link(`${host}/${parent.key}`, parent.key)}] __${[parent.fields.summary]}__\n  - `
    }
  
    formatted += `[${link(`${host}/${issue.key}`, issue.key)}] ${issue.fields.summary}`
  
    if (showAssign) {
      const assigned = issue.fields.assignee
      formatted += ` (${assigned.key} ${assigned.displayName})`
    }
  
    return formatted
}

module.exports = { jira, formatIssue }