import { ISSUE_STATUS } from './enums'

interface IJQLParams {
  status?: ISSUE_STATUS
  createdDate?: string
  unresolved?: boolean
  user?: string
}
