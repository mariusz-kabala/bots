import { TICKET_REGEXR } from './constants'
import { IRCMessage } from './types'
import { showCommand } from './commands/show'
import { statusCommand } from './commands/status'
import { createCommand } from './commands/create'
import { updateCommand } from './commands/update'

const meReg = /\b(me|mine|i|my)\b/gi

// eslint-disable-next-line
export function processMessages(message: IRCMessage): Promise<string> {
  const msg: string = message.msg.replace(meReg, message.u.username)

  if (TICKET_REGEXR.exec(msg)) {
    return updateCommand(msg)
  }

  if (msg.includes('status')) {
    return statusCommand(msg)
  }

  if (['create', 'add'].some(command => msg.includes(command))) {
    return createCommand(msg, message.u)
  }

  // if there is no proper query from showCOmmand but should show help
  return showCommand(msg)
}
