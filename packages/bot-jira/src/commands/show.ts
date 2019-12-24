import { IJQLParams, ISSUE_STATUS, TIME_FIELDS, jira, buildQuery, formatIssue } from '@libs/jira'
import config from 'config'

type IStatusMapper = {
  [key in ISSUE_STATUS]: string[]
}

const statusesMapper: IStatusMapper = {
  [ISSUE_STATUS.backlog]: ['backlog'],
  [ISSUE_STATUS.inProgress]: ['progress', 'work', 'working', 'doing'],
  [ISSUE_STATUS.done]: ['done', 'did', 'finished', 'closed'],
}

type IMapper = {
  [key: string]: string[]
}

const timeMapper: IMapper = {
  '7d': ['week'],
  '1d': ['yesterday'],
}

const timeFieldMapper: IMapper = {
  [TIME_FIELDS.created]: ['created'],
  [TIME_FIELDS.updated]: ['updated'],
}

function getTimeFields(msg: string): Partial<IJQLParams> {
  const result: Partial<IJQLParams> = {}

  const time = Object.keys(timeMapper).find(timeValue => timeMapper[timeValue].some((txt: string) => msg.includes(txt)))

  if (time) {
    const timeField: TIME_FIELDS =
      (Object.keys(timeFieldMapper).find(timeValue =>
        timeFieldMapper[timeValue].some((txt: string) => msg.includes(txt)),
      ) as TIME_FIELDS) || TIME_FIELDS.updated

    result[timeField] = time
  }

  return result
}

export function getParams(msg: string): IJQLParams {
  const users = config.get<{ [key: string]: string }>('users')
  const params: IJQLParams = {
    project: 'GEOT',
    status: Object.keys(statusesMapper).find(status =>
      statusesMapper[status as ISSUE_STATUS].some(txt => msg.includes(txt)),
    ) as ISSUE_STATUS,
    ...getTimeFields(msg),
  }

  const user = Object.keys(users).find(user => msg.includes(user))

  if (user) {
    params.user = users[user]
  }

  return params
}

export async function showCommand(msg: string): Promise<string> {
  const data = await jira.searchJira(buildQuery(getParams(msg)))

  let response = ''

  for (const issue of data.issues) {
    response += `${formatIssue(issue, {
      host: config.get<string>('JiraHost'),
    })}\n`
  }

  return response
}
