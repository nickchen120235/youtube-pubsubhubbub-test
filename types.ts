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

export interface Notification {
  channelId: string
  channelName: string
  videoId: string
  videoUrl: string
  published: Date
  updated: Date
}
