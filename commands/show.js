const { jira, formatIssue } = require('../jira')
const { users } = require('../config')

const statusesMapper = {
    'Backlog': ['backlog'],
    'In progress': ['progress', 'work', 'working', 'doing'],
    'Done': ['done', 'did', 'finished', 'closed']
}

const getParams = (msg) => {
    const params = {
        status: Object.keys(statusesMapper).find(status => statusesMapper[status].some(txt => msg.includes(txt))),
        createdDate: undefined,
        unresolved: false,
        user: undefined
    }

    const user = Object.keys(users).find(user => msg.includes(user))

    if (user) {
        params.user = users[user]
    }

    return params
}

const buildQuery = (params) => {
    console.log(params)
    let query = 'project = "GEOT"'

    if (params.status) {
        query += ` AND status = "${params.status}"`
    }

    if (params.user) {
        query += ` AND assignee = "${params.user}"`
    }

    query += ' ORDER BY issuetype ASC, createdDate DESC'
console.log(query)
    return query
}

module.exports = async function(msg) {
    const data = await jira.searchJira(buildQuery(getParams(msg)))
    let response = ''

    for (const issue of data.issues) {
        response += formatIssue(issue) + '\n'
    }


    return Promise.resolve(response)
}