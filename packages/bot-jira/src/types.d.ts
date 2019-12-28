export interface IRCUser {
  _id: string
  username: string
  name?: string
}

export interface IRCDateField {
  $date: number
}

export interface IRCMessage {
  _id: string
  rid: string
  msg: string
  ts: IRCDateField
  u: IRCUser
  _updatedAt: IRCDateField
  mentions: IRCUser[]
  channels: string[]
  editedAt: IRCDateField
  editedBy: IRCUser
  urls: string[]
}
