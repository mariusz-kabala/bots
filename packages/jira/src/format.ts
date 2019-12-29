import { link } from '@libs/markdown'

import { IJiraIssue } from './types'

export function formatIssue(
  issue: IJiraIssue,
  params: {
    showAssign?: boolean
    host: string
  },
) {
  const { showAssign = false, host } = params
  let formatted = ''
  const { parent } = issue.fields

  if (parent) {
    formatted += `[${link(`${host}/${parent.key}`, parent.key)}] __${[parent.fields.summary]}__\n  - `
  }

  formatted += `[${link(`${host}/${issue.key}`, issue.key)}] ${issue.fields.summary}`

  if (showAssign) {
    const assigned = issue.fields.assignee
    formatted += ` ( __${assigned.displayName}__ )`
  }

  return formatted.trim()
}
