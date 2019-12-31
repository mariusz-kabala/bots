import { IRCMessage } from '@libs/types'

import { pullRequestCommand } from './commands/pullRequests'
import { followCommand } from './commands/follow'

export function processMessages(message: IRCMessage): Promise<string> {
  // eslint-disable-next-line
  console.log(message)

  if (['trace', 'follow'].some(w => message.msg.includes(w))) {
    return followCommand(message.msg, message.rid)
  }

  return pullRequestCommand(message.msg)
}
