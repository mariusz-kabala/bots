const JiraAPI = require('jira-client')

const jira = new JiraAPI({
  protocol: 'https',
  host: 'geotags.atlassian.net',
  username: 'mariusz@kabala.waw.pl',
  password: 'ooGaueR81BNaranx7bBA862A',
  apiVersion: '2',
  strictSSL: true,
})

async function logIssueName(issueNumber) {
  try {
    const issue = await jira.findIssue(issueNumber)
    console.log(`Status: ${issue.fields.status.name}`)
  } catch (err) {
    //console.error(err);
  }
}

async function getBoard(boardId) {
  try {
    const board = await jira.getBoard(boardId)
    console.log(board)
  } catch (err) {
    // todo
    console.log(err)
  }
}

async function getProject(projectId) {
  try {
    const project = await jira.getProject(projectId)
    console.log(project)
  } catch (err) {
    // todo
  }
}

async function getUsersIssues(user) {}

async function start() {
  // logIssueName('GEOT-13')
  // getBoard(1)
  // getProject('GEOT')
  // const res = await jira.getUsersIssues('mariusz@kabala.waw.pl')
  // for (const issue of res.issues) {
  //     console.log(issue.fields.status)
  //     break
  // }
  const results = {}

  const formatIssue = (issue, showAssign = false) => {
    let formatted = ''
    const parent = issue.fields.parent

    if (parent) {
      formatted += `- [${parent.key}]`
    }

    formatted += `[${issue.key}] ${issue.fields.summary}`

    if (showAssign) {
      const assigned = issue.fields.assignee
      formatted += ` (${assigned.key} ${assigned.displayName})`
    }

    return formatted
  }

  // created recently
  // const query = 'project = "GEOT" AND resolution = Unresolved AND createdDate > -4d ORDER BY priority DESC, issuetype ASC'
  // in progress
  const query = 'project = "GEOT" AND status = "In Progress" ORDER BY createdDate DESC, issuetype ASC'

  const res = await jira.searchJira(query)
  for (const issue of res.issues) {
    console.log(formatIssue(issue, true))
    // console.log(issue.key + ' ' + issue.fields.summary)
    // console.log(issue.fields.parent)
  }
  //console.log(JSON.stringify(res.issues))
}

start()
