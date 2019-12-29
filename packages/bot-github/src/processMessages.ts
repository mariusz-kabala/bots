import { IRCMessage } from '@libs/types'

export function processMessages(message: IRCMessage): Promise<string> {
  // eslint-disable-next-line
  console.log(message)

  return Promise.resolve("I'm not ready yet")
}
