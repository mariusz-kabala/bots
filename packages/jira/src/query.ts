import { logger } from '@libs/logger'

import { IJQLParams } from './types.d'

export function buildQuery(params: IJQLParams): string {
  const { status, project, user, created, updated } = params

  let query = `project = "${project}"`

  if (status) {
    if (Array.isArray(status)) {
      query += ` AND status in (${status.join(',')})`
    } else {
      query += ` AND status = "${status}"`
    }
  }

  if (user) {
    query += ` AND assignee = "${user}"`
  }

  if (created) {
    switch (created) {
      case 'today':
        query += ` created >= startOfDay() and created < endOfDay()`
        break
      case 'yesterday':
        query += ' created < -1d AND created > -2d'
        break
      default:
        query += ` AND created > ${created}`
        break
    }
  }

  if (updated) {
    switch (updated) {
      case 'today':
        query += ` AND updated >= startOfDay() AND updated < endOfDay()`
        break
      case 'yesterday':
        query += ' AND updated < -1d AND updated > -2d'
        break
      default:
        query += ` AND updated > ${updated}`
        break
    }
  }

  query += ' ORDER BY issuetype ASC, createdDate DESC'

  logger.log({
    level: 'info',
    message: `JQL: ${query}`,
  })

  return query
}
