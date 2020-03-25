import { jira, sortData, mergeIssues } from '@libs/jira'

import { generateReport } from '../helpers/report'

export async function sprintCommand(msg: string): Promise<string> {
  const data = await jira.getAllSprints('2')
  const activeSprint = data.values.find((sprint: { state: string }) => sprint.state === 'active')

  if (!activeSprint) {
    return 'Sorry I could not find any active sprints'
  }

  if (msg.includes('add')) {
    return 'Sorry I do not know how to do it yet'
  }

  const issues = await jira.getBoardIssuesForSprint('2', activeSprint.id)
  const sorted = sortData(issues.issues)

  sorted.done = mergeIssues(sorted.done)
  sorted.indeterminate = mergeIssues(sorted.indeterminate)
  sorted.new = mergeIssues(sorted.new)

  return generateReport(sorted, true)
}
