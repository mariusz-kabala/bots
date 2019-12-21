import config from 'config'

const meReg = /\b(me|mine|i|my)\b/gi

export async function processMessages(message: any): Promise<string> {
  const msg = message.msg.replace(meReg, message.u.username)

  if (msg.includes('show')) {
  }
}
