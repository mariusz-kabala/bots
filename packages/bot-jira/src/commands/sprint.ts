import { jira, sortData, mergeIssues } from '@libs/jira'
import { generateReport } from '../helpers/report'

export async function sprintCommand(msg: string): Promise<string> {
  const data = await jira.getAllSprints('2')
  console.log(data)
  console.log(msg)

  const issues = await jira.getBoardIssuesForSprint('2', '1')
  const sorted = sortData(issues.issues)

  sorted.done = mergeIssues(sorted.done)
  sorted.indeterminate = mergeIssues(sorted.indeterminate)
  sorted.new = mergeIssues(sorted.new)

  return generateReport(sorted)
}
