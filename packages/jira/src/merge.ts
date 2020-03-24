import { IJiraIssue } from './types'

export function mergeIssues(issues: IJiraIssue[]) {
  const results: (IJiraIssue & { subtasks?: IJiraIssue[] })[] = []
  const storiesMapper: {
    [key: string]: number
  } = {}
  const isAlreadyAdded = (issue: IJiraIssue): boolean => results.findIndex(result => result.key === issue.key) > -1

  for (const issue of issues) {
    if (isAlreadyAdded(issue)) {
      continue
    }

    const { parent } = issue.fields
    if (parent) {
      let parentIndex: number

      if (storiesMapper[parent.key]) {
        parentIndex = storiesMapper[parent.key]
      } else {
        parentIndex = results.push(parent as IJiraIssue) - 1
        storiesMapper[parent.key] = parentIndex
      }

      if (!Array.isArray(results[parentIndex].subtasks)) {
        results[parentIndex].subtasks = []
      }

      results[parentIndex].subtasks?.push(issue)
      continue
    }

    results.push(issue)
  }

  return results
}
