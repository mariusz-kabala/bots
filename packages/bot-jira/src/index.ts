import { driver } from '@rocket.chat/sdk'
import { logger } from '@bots/logger'
import { IAsteroid } from '@rocket.chat/sdk/dist/config/asteroidInterfaces'
import { processMessages } from './processMessages'
import config from 'config'

const RECONNECT_TIMEOUT = 300000
let connect_attempts = 0
let botUserId: string

async function runBot(): Promise<void> {
  let conn: IAsteroid
  const host: string = config.get<string>('RCHost')
  const rooms: string = config.get<string>('RCRooms')

  connect_attempts++

  if (connect_attempts > 3) {
    process.exit(1)
  }

  try {
    conn = await driver.connect({
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
    await conn.disconnect()
    setTimeout(runBot, RECONNECT_TIMEOUT)
  }

  try {
    await driver.reactToMessages(async (err: Error | null, message: any) => {
      if (err) {
        logger.log({
          level: 'error',
          message: err + '',
        })
        return
      }

      if (message.u._id === botUserId) {
        return
      }

      const botname = config.get<string>('RCBotname')

      if (!message.msg.startWith(botname)) {
        return
      }

      message.msg = message.msg.toLowerCase().str.substring(botname.length)

      const response = await processMessages(message)
      const roomname = await driver.getRoomId(message.rid)

      try {
        await driver.sendToRoomId(response, roomname)
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
    await conn.disconnect()
    setTimeout(runBot, RECONNECT_TIMEOUT)
  }
}

runBot()
