import { _Notification, Notification } from "./types.ts";

export function parseNotification(notification: _Notification): Notification {
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
