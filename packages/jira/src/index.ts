import JiraAPI from 'jira-client'
import config from 'config'

const host: string = config.get<string>('JiraHost')

export const jira = new JiraAPI({
  protocol: config.get<string>('JiraProtocol'),
  host,
  username: config.get<string>('JiraUsername'),
  password: config.get<string>('JiraPassword'),
  apiVersion: config.get<string>('JiraAPIVersion'),
  strictSSL: !!config.get<string>('JiraStrictSSL'),
})

export * from './query'
export * from './types'
export * from './enums'
export * from './format'
