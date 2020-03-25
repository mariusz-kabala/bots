import { ISSUE_STATUS } from '@libs/jira'

export const TICKET_REGEXR = /([A-Z]{3,4})-\d+/gi

export type IStatusMapper = {
  [key in ISSUE_STATUS]: string[]
}

export const statusesMapper: IStatusMapper = {
  [ISSUE_STATUS.backlog]: ['backlog'],
  [ISSUE_STATUS.inProgress]: ['progress', 'work', 'working', 'doing'],
  [ISSUE_STATUS.done]: ['done', 'did', 'finished', 'closed'],
  [ISSUE_STATUS.closed]: [],
  [ISSUE_STATUS.open]: ['open', 'new'],
  [ISSUE_STATUS.selectForDevelopment]: [],
}
