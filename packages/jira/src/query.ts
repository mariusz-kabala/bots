import { logger } from '@libs/logger'

import { IJQLParams } from './types.d'

export function buildQuery(params: IJQLParams): string {
  const { status, project, user, created, updated } = params

  let query = `project = "${project}"`

  if (status) {
    query += ` AND status = "${status}"`
  }

  if (user) {
    query += ` AND assignee = "${user}"`
  }

  if (created) {
    query += ` AND created > ${created}`
  }

  if (updated) {
    query += ` AND updated > ${updated}`
  }

  query += ' ORDER BY issuetype ASC, createdDate DESC'

  logger.log({
    level: 'info',
    message: `JQL: ${query}`,
  })

  return query
}
