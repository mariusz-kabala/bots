import config from 'config'
import { driver } from '@rocket.chat/sdk'
import { logger } from '@libs/logger'
import { IRCMessage } from '@libs/types'
import { splitText } from '@libs/tools'

import { processMessages } from './processMessages'

const RECONNECT_TIMEOUT = 300000
let connectAttempts = 0
let botUserId: string

async function runBot(): Promise<void> {
  const host: string = config.get<string>('RCHost')
  const rooms: string = config.get<string>('RCRooms')

  connectAttempts++

  if (connectAttempts > 3) {
    process.exit(1)
  }

  try {
    await driver.connect({
      host,
      useSsl: !!config.get<string>('RCSSL'),
    })
    botUserId = await driver.login({
      username: config.get<string>('RCUser'),
      password: config.get<string>('RCPass'),
    })
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Can not connect to rocket chat server ${host}, next try in 5min. Error: ${err}`,
    })
    setTimeout(runBot, RECONNECT_TIMEOUT)
    return
  }

  try {
    await driver.joinRooms(rooms.split(','))
    logger.log({
      level: 'info',
      message: `Bot joined rooms: ${rooms}`,
    })
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Bot was not able to join rooms ${rooms}, next try in 5min. Error ${err}`,
    })
    await driver.disconnect()
    setTimeout(runBot, RECONNECT_TIMEOUT)
  }

  await driver.subscribeToMessages()

  try {
    // eslint-disable-next-line
    await driver.reactToMessages(async (err: Error | null, message: IRCMessage) => {
      if (err) {
        logger.log({
          level: 'error',
          message: `${err}`,
        })
        return
      }

      if (message.u._id === botUserId) {
        return
      }

      const botname = config.get<string>('RCBotname')
      const directMsgRoomId = await driver.getDirectMessageRoomId(message.u.username)

      if (!message.msg.startsWith(botname) && message.rid !== directMsgRoomId) {
        return
      }

      if (message.msg.startsWith(botname)) {
        message.msg = message.msg
          .toLowerCase()
          .substring(botname.length)
          .trim()
      }

      const response = await processMessages(message)
      const roomname = await driver.getRoomId(message.rid)

      try {
        for (const msg of splitText(response)) {
          await driver.sendToRoomId(msg, roomname)
        }
      } catch (err) {
        logger.log({
          level: 'error',
          message: `Sending message error: ${err}`,
        })
      }
    })
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Bot was not able to subscribe for messages, next try in 5min. Error ${err}`,
    })
    await driver.disconnect()
    setTimeout(runBot, RECONNECT_TIMEOUT)
  }
}

runBot()
