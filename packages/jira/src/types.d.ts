import { ISSUE_STATUS, TIME_FIELDS } from './enums'

export interface IJQLParams {
  project: string
  status?: ISSUE_STATUS | ISSUE_STATUS[]
  unresolved?: boolean
  user?: string
  [TIME_FIELDS.created]?: string
  [TIME_FIELDS.updated]?: string
}

export type sortedIssues = {
  new: IJiraIssue[]
  indeterminate: IJiraIssue[]
  done: IJiraIssue[]
}

export interface IJiraIssue {
  key: string
  fields: {
    status: {
      statusCategory: {
        key: 'new' | 'indeterminate' | 'done'
      }
    }
    summary: string
    parent?: {
      key: string
      fields: {
        summary: string
      }
    }
    assignee: {
      key: string
      displayName: string
    }
  }
}
