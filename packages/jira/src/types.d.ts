import { ISSUE_STATUS, TIME_FIELDS } from './enums'

export interface IJQLParams {
  project: string
  status?: ISSUE_STATUS
  unresolved?: boolean
  user?: string
  [TIME_FIELDS.created]?: string
  [TIME_FIELDS.updated]?: string
}
