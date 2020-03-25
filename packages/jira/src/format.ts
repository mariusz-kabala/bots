import { IJiraIssue } from './types'

export function formatIssue(
  issue: IJiraIssue,
  params: {
    showAssign?: boolean
    host: string
    showParent?: boolean
    prefix?: string
  },
) {
  const { showAssign = false, showParent = false, prefix = '' } = params
  let formatted = ''
  const { parent } = issue.fields
  const isDone = issue.fields.status.statusCategory.key === 'done'

  if (parent && showParent) {
    formatted += `[${parent.key}] __${[parent.fields.summary]}__\n  - `
  }

  formatted += `${prefix}${isDone ? '~' : ''}[${issue.key}]${isDone ? '~' : ''} ${issue.fields.summary}`

  if (showAssign) {
    const assigned = issue.fields.assignee
    formatted += ` ( __${assigned ? assigned.displayName : 'unassigned'}__ )`
  }

  return formatted.trim()
}
