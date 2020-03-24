import { IJiraIssue, sortedIssues } from './types'

export function sortData(issues: IJiraIssue[]): sortedIssues {
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
