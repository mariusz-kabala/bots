import { link } from '@libs/markdown'

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
  const { showAssign = false, showParent = false, prefix = '', host } = params
  let formatted = ''
  const { parent } = issue.fields
  const isDone = issue.fields.status.statusCategory.key === 'done'

  if (parent && showParent) {
    formatted += `[${link(`${host}/${parent.key}`, parent.key)}] __${[parent.fields.summary]}__\n  - `
  }

  formatted += `${prefix}${isDone ? '~' : ''}[${link(`${host}/${issue.key}`, issue.key)}]${isDone ? '~' : ''} ${
    issue.fields.summary
  }`

  if (showAssign) {
    const assigned = issue.fields.assignee
    formatted += ` ( __${assigned.displayName}__ )`
  }

  return formatted.trim()
}
