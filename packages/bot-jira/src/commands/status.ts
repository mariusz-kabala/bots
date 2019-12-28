import { IJQLParams, buildQuery, TIME_FIELDS, jira, IJiraIssue, formatIssue } from '@libs/jira'
import { logger } from '@libs/logger'
import config from 'config'

type sortedIssues = {
  new: IJiraIssue[]
  indeterminate: IJiraIssue[]
  done: IJiraIssue[]
}

function sortData(issues: IJiraIssue[]): sortedIssues {
  const results: sortedIssues = {
    new: [],
    indeterminate: [],
    done: [],
  }

  for (const issue of issues) {
    const status = issue.fields.status.statusCategory.key

    if (results[status]) {
      results[status].push(issue)
    }
  }

  return results
}

function printIssues(issues: IJiraIssue[], showAssign = true): string {
  let result = ''

  for (const issue of issues) {
    result += `${formatIssue(issue, {
      showAssign,
      host: config.get<string>('JiraHost'),
    })}\n`
  }

  return result
}

async function getTicekts(time: string, msg: string): Promise<string> {
  const users = config.get<{ [key: string]: string }>('users')
  const params: IJQLParams = {
    project: 'GEOT',
    unresolved: true,
    [TIME_FIELDS.updated]: time,
  }

  const user = Object.keys(users).find(user => msg.includes(user))
  let showAssign = true

  if (user) {
    params.user = users[user]
    showAssign = false
  }

  logger.log({
    level: 'info',
    message: `JIRA query params: ${JSON.stringify(params)}`,
  })

  const data = await jira.searchJira(buildQuery(params))
  const sorted = sortData(data.issues)
  const total = sorted.done.length + sorted.indeterminate.length + sorted.new.length
  let message = ''

  if (sorted.indeterminate.length > 0) {
    message += `:watch: *IN PROGRESS* (${sorted.indeterminate.length} / ${total})\n${printIssues(
      sorted.indeterminate,
      showAssign,
    )}\n`
  }

  if (sorted.new.length > 0) {
    message += `:new: *NEW* (${sorted.new.length} / ${total})\n${printIssues(sorted.new, showAssign)}\n`
  }

  if (sorted.done.length > 0) {
    message += `:man_cartwheeling: *DONE* (${sorted.done.length} / ${total})\n${printIssues(sorted.done, showAssign)}`
  }

  if (message !== '') {
    message += '\n'
  }

  if (sorted.new.length === 0) {
    message += `No *new* tickets\n`
  }

  if (sorted.indeterminate.length === 0) {
    message += 'No tickets *in progress*\n'
  }

  if (sorted.done.length === 0) {
    message += 'Nothing was *done*\n'
  }

  return message.substr(0, message.length - 1)
}

export function statusCommand(msg: string): Promise<string> {
  if (msg.includes('yesterday')) {
    return getTicekts('-2d', msg)
  }

  if (msg.includes('week')) {
    return getTicekts('-1w', msg)
  }

  if (msg.includes('month')) {
    return getTicekts('-4w', msg)
  }

  return getTicekts('-1d', msg)
}
