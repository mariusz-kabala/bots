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

function printIssues(issues: IJiraIssue[], showAssign = true, printedIssuesLimit = 10): string {
  let result = ''

  for (const issue of issues.slice(0, printedIssuesLimit)) {
    result += `${formatIssue(issue, {
      showAssign,
      host: config.get<string>('JiraHost'),
    })}\n`
  }

  return result
}

async function getTicekts(msg: string, time?: string): Promise<string> {
  const users = config.get<{ [key: string]: string }>('users')
  const params: IJQLParams = {
    project: 'GEOT',
    unresolved: true,
  }
  const printedIssuesLimit = 10
  const printedIssuesLimitMsg = `\n__Only last ${printedIssuesLimit} issues have been printed__\n\n`

  if (time) {
    params[TIME_FIELDS.updated] = time
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
      printedIssuesLimit,
    )}\n`

    if (sorted.indeterminate.length > printedIssuesLimit) {
      message += printedIssuesLimitMsg
    }
  }

  if (sorted.new.length > 0) {
    message += `:new: *NEW* (${sorted.new.length} / ${total})\n${printIssues(
      sorted.new,
      showAssign,
      printedIssuesLimit,
    )}\n`

    if (sorted.new.length > printedIssuesLimit) {
      message += printedIssuesLimitMsg
    }
  }

  if (sorted.done.length > 0) {
    message += `:man_cartwheeling: *DONE* (${sorted.done.length} / ${total})\n${printIssues(
      sorted.done,
      showAssign,
      printedIssuesLimit,
    )}`

    if (sorted.done.length > printedIssuesLimit) {
      message += printedIssuesLimitMsg
    }
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
    return getTicekts(msg, '-2d')
  }

  if (msg.includes('week')) {
    return getTicekts(msg, '-1w')
  }

  if (msg.includes('month')) {
    return getTicekts(msg, '-4w')
  }

  if (msg.includes('day')) {
    return getTicekts(msg, '-1d')
  }

  return getTicekts(msg)
}
