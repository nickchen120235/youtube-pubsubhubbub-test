import type { ChannelListResponse, Channel, ChannelSnippet, ThumbnailDetails } from "https://googleapis.deno.dev/v1/youtube:v3.ts";

const key = Deno.env.get('API_KEY')
if (key === undefined)
    throw new Error('API_KEY is not set')
const a = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet&forHandle=lovelive_hasu&maxResults=1&key=${key}`)
const data = await a.json() as Required<ChannelListResponse>

if (data.pageInfo.totalResults === 0) {
    console.log('channel not found')
}
else {
    const item = data.items[0]
    console.log(`Channel ID: ${item.id}`)
    console.log(`Channel Name: ${item.snippet?.title}`)
    console.log(`Channel Image: ${item.snippet?.thumbnails?.high?.url}`)
}
