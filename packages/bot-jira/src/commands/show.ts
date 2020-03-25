import { IJQLParams, ISSUE_STATUS, TIME_FIELDS, jira, buildQuery, mergeIssues } from '@libs/jira'
import config from 'config'
import { logger } from '@libs/logger'

import { printIssues } from '../helpers/printIssues'
import { statusesMapper } from '../constants'

type IMapper = {
  [key: string]: string[]
}

const timeMapper: IMapper = {
  '-7d': ['week'],
}

const specialTimeMapper: string[] = ['today', 'yesterday']

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
  const specialTime = specialTimeMapper.find((txt: string) => msg.includes(txt))
  if (time) {
    result[timeField] = time
  } else if (specialTime) {
    result[timeField] = specialTime
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

  if (params.status === ISSUE_STATUS.done) {
    params.status = [ISSUE_STATUS.done, ISSUE_STATUS.closed]
  }

  if (params.status === ISSUE_STATUS.open) {
    params.status = [ISSUE_STATUS.open, ISSUE_STATUS.selectForDevelopment]
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

  return printIssues(mergeIssues(data.issues), typeof params.user === 'undefined', 99, true)
}
