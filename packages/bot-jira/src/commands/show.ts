import { ISSUE_STATUS } from '../enums'
import { IJQLParams } from '../types'

type IStatusMapper = {
  [key in ISSUE_STATUS]: string[]
}

const statusesMapper: IStatusMapper = {
  [ISSUE_STATUS.backlog]: ['backlog'],
  [ISSUE_STATUS.inProgress]: ['progress', 'work', 'working', 'doing'],
  [ISSUE_STATUS.done]: ['done', 'did', 'finished', 'closed'],
}

function getParams(msg: string): IJQLParams {
  const params: IJQLParams = {
    status: Object.keys(statusesMapper).find(status =>
      statusesMapper[status as ISSUE_STATUS].some(txt => msg.includes(txt)),
    ) as ISSUE_STATUS,
  }

  const user = Object.keys(users).find(user => msg.includes(user))

  return params
}
