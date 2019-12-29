import { IJQLParams, ISSUE_STATUS, TIME_FIELDS, jira, buildQuery, formatIssue } from '@libs/jira'
import config from 'config'
import { logger } from '@libs/logger'

import { statusesMapper } from '../constants'

type IMapper = {
  [key: string]: string[]
}

const timeMapper: IMapper = {
  '-7d': ['week'],
  '-1d': ['today'],
  '-2d': ['yesterday'],
}

const timeFieldMapper: IMapper = {
  [TIME_FIELDS.created]: ['created'],
  [TIME_FIELDS.updated]: ['updated'],
}

function getTimeFields(msg: string): Partial<IJQLParams> {
  const result: Partial<IJQLParams> = {}

  const timeField: TIME_FIELDS =
    (Object.keys(timeFieldMapper).find(timeValue =>
      timeFieldMapper[timeValue].some((txt: string) => msg.includes(txt)),
    ) as TIME_FIELDS) || TIME_FIELDS.updated

  if (!timeField) {
    return result
  }

  const time = Object.keys(timeMapper).find(timeValue => timeMapper[timeValue].some((txt: string) => msg.includes(txt)))

  if (time) {
    result[timeField] = time
  } else {
    const reg = /([0-9]+)(.+day(s?))/.exec(msg)

    if (reg) {
      result[timeField] = `-${reg[1]}d`
    }
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
  const params = getParams(msg)

  logger.log({
    level: 'info',
    message: `JIRA query params: ${JSON.stringify(params)}`,
  })

  const data = await jira.searchJira(buildQuery(params))

  let response = ''

  for (const issue of data.issues) {
    response += `${formatIssue(issue, {
      host: config.get<string>('JiraHost'),
    })}\n`
  }

  return response
}
