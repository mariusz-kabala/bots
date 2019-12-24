import { IJQLParams } from './types.d'

export function buildQuery(params: IJQLParams): string {
  const { status, project, user } = params

  let query = `project = "${project}"`

  if (status) {
    query += ` AND status = "${status}"`
  }

  if (user) {
    query += ` AND assignee = "${user}"`
  }

  query += ' ORDER BY issuetype ASC, createdDate DESC'

  return query
}
