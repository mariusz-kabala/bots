import { gh } from '../clients/github'
import { formatPRsList } from '../helpers/formatter'

export async function pullRequestCommand(msg: string): Promise<string> {
  const repo = gh.getRepo('mariusz-kabala', 'gtms-frontend')
  const params = {
    state: 'open',
    sort: 'updated',
    direction: 'desc',
  }

  if (['closed', 'finished'].some(w => msg.includes(w))) {
    params.state = 'closed'
  }

  const prs = await repo.listPullRequests(params)

  return formatPRsList(prs.data)
}
