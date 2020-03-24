import { IJiraIssue, formatIssue } from '@libs/jira'
import config from 'config'

export function printIssues(
  issues: (IJiraIssue & { subtasks?: IJiraIssue[] })[],
  showAssign = true,
  printedIssuesLimit = 10,
  showParent = true,
): string {
  let result = ''

  for (const issue of issues.slice(0, printedIssuesLimit)) {
    result += `\n${formatIssue(issue, {
      showAssign,
      showParent,
      host: config.get<string>('JiraHost'),
    })}`

    if (issue.subtasks) {
      for (const subIssue of issue.subtasks) {
        result += `\n${formatIssue(subIssue, {
          showAssign,
          host: config.get<string>('JiraHost'),
          showParent: false,
          prefix: ' - ',
        })}`
      }
    }
  }

  return result
}
