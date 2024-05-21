// we extract what we want only
export interface _Entry {
  'yt:videoId': string
  'yt:channelId': string
  link: {
    '@href': string
  }
  author: {
    name: string
  }
  published: string
}

export interface _Notification {
  feed: {
    entry: _Entry
  }
}

function isEntry(data: unknown): data is _Entry {
  return data !== null && typeof data === 'object' &&
  'yt:video' in data && typeof data['yt:video'] === 'string' &&
  'yt:channelId' in data && typeof data['yt:channelId'] ==='string' &&
  'link' in data && typeof data.link === 'object' && data.link !== null &&
  '@href' in data.link && typeof data.link['@href'] === 'string' &&
  'author' in data && typeof data.author === 'object' && data.author !== null &&
  'name' in data.author && typeof data.author.name ==='string' &&
  'published' in data && typeof data.published === 'string'
}

export function isRawNotification(data: unknown): data is _Notification {
  return data !== null && typeof data === 'object' &&
    'feed' in data && typeof data.feed === 'object' && data.feed !== null &&
    'entry' in data.feed && isEntry(data.feed.entry)
}

export interface Notification {
  channelId: string
  channelName: string
  videoId: string
  videoUrl: string
  published: number
}

/* 
{
  "xml": {
    "@version": "1.0",
    "@encoding": "UTF-8"
  },
  "feed": {
    "@xmlns:yt": "http://www.youtube.com/xml/schemas/2015",
    "@xmlns": "http://www.w3.org/2005/Atom",
    "link": [
      {
        "@rel": "hub",
        "@href": "https://pubsubhubbub.appspot.com",
        "#text": null
      },
      {
        "@rel": "self",
        "@href": "https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCxUgvwrVfqVpyak4cuKcevQ",
        "#text": null
      }
    ],
    "title": "YouTube video feed",
    "updated": "2024-05-21T11:31:05.52272526+00:00",
    "entry": {
      "id": "yt:video:BD_0OJRDi_I",
      "yt:videoId": "BD_0OJRDi_I",
      "yt:channelId": "UCxUgvwrVfqVpyak4cuKcevQ",
      "title": "【2024/5/13 配信 With×MEETS】 朗読を二人でします(ラブライブ！蓮ノ空女学院スクールアイドルクラブ)",
      "link": {
        "@rel": "alternate",
        "@href": "https://www.youtube.com/watch?v=BD_0OJRDi_I",
        "#text": null
      },
      "author": {
        "name": "(Love Live! hasu)蓮ノ空女学院スクールアイドルクラブ公式チャンネル",
        "uri": "https://www.youtube.com/channel/UCxUgvwrVfqVpyak4cuKcevQ"
      },
      "published": "2024-05-21T11:30:05+00:00",
      "updated": "2024-05-21T11:31:05.52272526+00:00"
    }
  }
}
*/
