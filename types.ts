// we extract what we want only
export interface _Entry {
  'yt:videoId': string
  link: {
    '@href': string
  }
  published: string
  updated: string
}

export interface _Notification {
  'yt:channelId': string
  author: {
    name: string
  }
  entry: _Entry | _Entry[]
}

export function isRawNotification(data: unknown): data is _Notification {
  return data !== null && typeof data === 'object' &&
    'yt:channelId' in data && typeof data['yt:channelId'] ==='string' &&
    'author' in data && typeof data.author === 'object' && data.author !== null &&
    'name' in data.author && typeof data.author.name ==='string' &&
    'entry' in data && typeof data.entry === 'object'
}

export interface Notification {
  channelId: string
  channelName: string
  videoId: string
  videoUrl: string
  published: Date
  updated: Date
}
