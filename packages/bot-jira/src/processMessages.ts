import { showCommand } from './commands/show'
const meReg = /\b(me|mine|i|my)\b/gi

// eslint-disable-next-line
export function processMessages(message: any): Promise<string> {
  const msg = message.msg.replace(meReg, message.u.username)

  if (msg.includes('show')) {
    return showCommand(msg)
  }

  // @todo add something like sorry, I don't understand that, try: [help here]
  return Promise.resolve('Invalid command')
}
