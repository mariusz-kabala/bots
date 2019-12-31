import { link } from '@libs/markdown'

import { IPullRequest } from '../types'

export function formatPRsList(prs: IPullRequest[]): string {
  if (prs.length === 0) {
    return 'I did not find any PRs'
  }

  let result = ''

  for (const pr of prs) {
    result += `[${link(pr.html_url, `#${pr.number}`)}] ${pr.title} (${pr.user.login})\n`
  }

  return result.trim()
}
