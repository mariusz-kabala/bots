import { Promise } from 'bluebird'
import * as redis from 'redis'

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

export const redisClient = redis.createClient()
