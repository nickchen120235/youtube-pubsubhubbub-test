import { _Notification, Notification, isRawNotification } from "./types.ts";

class ParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}

export function parseNotification(notification: unknown): Notification {
  if (!isRawNotification(notification))
      throw new ParseError(`Invalid notification: ${JSON.stringify(notification)}`)
  const entry = Array.isArray(notification.entry) ? notification.entry[0] : notification.entry
  return {
    channelId: notification['yt:channelId'],
    channelName: notification.author.name,
    videoId: entry['yt:videoId'],
    videoUrl: entry.link['@href'],
    published: new Date(entry.published),
    updated: new Date(entry.updated),
  }
}
