import { IRCMessage } from '@libs/types'

import { TICKET_REGEXR } from './constants'
import { showCommand } from './commands/show'
import { statusCommand } from './commands/status'
import { createCommand } from './commands/create'
import { updateCommand } from './commands/update'
import { sprintCommand } from './commands/sprint'
import { reportCommand } from './commands/report'

const meReg = /\b(me|mine|i|my)\b/gi

export function processMessages(message: IRCMessage): Promise<string> {
  const msg: string = message.msg.replace(meReg, message.u.username)

  if (TICKET_REGEXR.exec(msg)) {
    return updateCommand(msg)
  }

  if (msg.includes('status')) {
    return statusCommand(msg)
  }

  if (msg.includes('report')) {
    return reportCommand()
  }

  if (msg.includes('sprint')) {
    return sprintCommand(msg)
  }

  if (['create', 'add'].some(command => msg.includes(command))) {
    return createCommand(msg, message.u)
  }

  // if there is no proper query from showCOmmand but should show help
  return showCommand(msg)
}
