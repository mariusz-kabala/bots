import { ISSUE_TYPES, jira } from '@libs/jira'
import { IRCUser } from '@libs/types'
import config from 'config'

export function getTicketSummary(msg: string, issueType: ISSUE_TYPES) {
  let delimiter = ['-', ':'].find(d => msg.includes(d))

  if (!delimiter && msg.includes(issueType)) {
    delimiter = issueType
  } else {
    delimiter = ['ticket', 'create', 'add'].find(d => msg.includes(d))
  }

  if (!delimiter && !msg.includes(issueType)) {
    return msg
  }

  const msgArr = msg.split(delimiter as string)

  msgArr.shift()

  let result = msgArr.join(delimiter).trim()

  if ([','].includes(result.slice(-1))) {
    result = result.substr(0, result.length - 1)
  }

  return result
}

export async function createCommand(msg: string, author: IRCUser): Promise<string> {
  let msgToProcess = msg
  let issueType = [
    ISSUE_TYPES.bug,
    ISSUE_TYPES.epic,
    ISSUE_TYPES.story,
    ISSUE_TYPES.task,
    ISSUE_TYPES.subtask,
  ].find(type => msgToProcess.includes(type))

  if (!issueType) {
    issueType = ISSUE_TYPES.task
  }

  if (issueType === ISSUE_TYPES.subtask) {
    return 'sorry, currently I don\'t know how to create a subtask'
  }

  const users = config.get<{ [key: string]: string }>('users')
  const issueTypes: {
    [key in ISSUE_TYPES]: number
  } = config.get('issueTypes')
  let RCUser = Object.keys(users).find(user => msgToProcess.includes(user))

  if (!RCUser) {
    RCUser = author.username
  }

  const user = users[RCUser] // map from RCUser to JIRAUser

  msgToProcess = msgToProcess.replace(new RegExp(`assign.*?${RCUser}`, 'gi'), '')

  const summary = getTicketSummary(msgToProcess, issueType)

  try {
    const newIssue = await jira.addNewIssue({
      fields: {
        project: {
          key: 'GEOT',
        },
        summary,
        issuetype: {
          id: issueTypes[issueType],
        },
        assignee: {
          name: user,
        },
      },
    })
    const host = config.get<string>('JiraHost')

    return `created: ${host}/browse/${newIssue.key}`
  } catch {
    return `error occurred. I was not able to create a new ${issueType}`
  }
}
