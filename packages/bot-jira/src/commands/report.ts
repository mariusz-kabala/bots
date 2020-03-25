import { IJQLParams, ISSUE_STATUS, jira, buildQuery, mergeIssues } from '@libs/jira'

import { printIssues } from '../helpers/printIssues'

export async function reportCommand(): Promise<string> {
  const doneTicketsQuery: IJQLParams = {
    project: 'GEOT',
    status: [ISSUE_STATUS.done, ISSUE_STATUS.closed],
    updated: 'yesterday',
  }

  const newTicketsQuery: IJQLParams = {
    project: 'GEOT',
    status: [ISSUE_STATUS.open, ISSUE_STATUS.selectForDevelopment],
    updated: 'yesterday',
  }

  const inProgressTicketsQuery: IJQLParams = {
    project: 'GEOT',
    status: ISSUE_STATUS.inProgress,
  }

  const backlogTicketsQuery: IJQLParams = {
    project: 'GEOT',
    status: ISSUE_STATUS.backlog,
  }

  const done = await jira.searchJira(buildQuery(doneTicketsQuery))
  const newTickets = await jira.searchJira(buildQuery(newTicketsQuery))
  const inProgress = await jira.searchJira(buildQuery(inProgressTicketsQuery))
  const backlog = await jira.searchJira(buildQuery(backlogTicketsQuery))

  let response = '*Daily JIRA status:*\n\n :man_cartwheeling: *DONE yesterday:* '
  response += printIssues(mergeIssues(done.issues), true, 25, true)
  response += '\n\n:hatching_chick: *NEW tickets from yesterday:* '
  response += printIssues(mergeIssues(newTickets.issues), true, 25, true)
  response += '\n\n:snail: *Tickets currently in progress:* '
  response += printIssues(mergeIssues(inProgress.issues), true, 25, true)
  response += `\n\n and we have *${backlog.issues.length}* tickets in backlog`

  return response
}
