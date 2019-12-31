import GitHub from 'github-api'
import config from 'config'

export const gh = new GitHub({
  token: config.get<string>('gitHubToken'),
})
