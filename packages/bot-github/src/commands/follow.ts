// import { redisClient } from '../clients/redis'
import { gh } from '../clients/github'

async function getReposList() {
  const ghUser = gh.getUser()

  const repos = await ghUser.listRepos({
    type: 'all',
  })

  return repos.data.map((repo: any) => repo.full_name)
}

async function start() {
  console.log(await getReposList())
  // redisClient.sadd(`channel:${channelId}`)
}

export async function followCommand(msg: string, channelId: string): Promise<string> {
  await start()
  console.log(msg, channelId)
  return 'not working yet'
}
