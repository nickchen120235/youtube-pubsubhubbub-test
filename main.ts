import { xml, dotenv } from './core.ts'
import { parseNotification } from "./parse.ts"

await dotenv.load({ export: true })
const webhook = Deno.env.get('WEBHOOK')
if (!webhook)
    throw new Error('WEBHOOK environment variable not set')
const callback = Deno.env.get('CALLBACK')
if (!callback)
    throw new Error('CALLBACK environment variable not set')

const kv = await Deno.openKv(Deno.env.get('KV_PATH'))

Deno.serve(async (req) => {
    switch (req.method) {
        case 'GET': {
            console.log('Received callback challenge')
            console.log(`URL: ${req.url}`)
            const url = new URL(req.url)
            const topic = url.searchParams.get('hub.topic')
            const challenge = url.searchParams.get('hub.challenge')
            const lease = url.searchParams.get('hub.lease_seconds')
            if (topic && challenge && lease) {
                await kv.set([
                    'topic',
                    new URL(decodeURI(topic)).searchParams.get('channel_id') ?? decodeURI(topic)
                ], parseInt(lease) + Math.floor(Date.now() / 1000))
                return new Response(challenge, {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                })
            }
            else return new Response(null, { status: 400 })
        }
        case 'POST': {
            console.log('Received notification')
            console.log(`URL: ${req.url}`)
            try {
                const body = await req.text()
                const notification = parseNotification(xml.parse(body)['feed'])
                console.log(`Channel Name: ${notification.channelName}`)
                console.log(`Video URL: ${notification.videoUrl}`)
                console.log(`Published: ${notification.published}`)
                await fetch(webhook, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: `\`\`\`json\n${JSON.stringify(xml.parse(body), null, 2)}\n\`\`\``,
                        username: notification.channelName
                    })
                })
                return new Response(null, { status: 200 })
            }
            catch (e) {
                if (e instanceof Error) {
                    console.log(`Error: ${e.message}`)
                }
                else {
                    console.log(`Error: ${JSON.stringify(e)}`)
                }
                return new Response(null, { status: 400 })
            }
        }
        default: {
            console.log('Received unknown request')
            console.log(`${req.method} ${req.url}`)
            return new Response(null, { status: 405 })
        }
    }
})

Deno.cron('Update subscriptions', '0 0 * * *', async () => {
    for await (const entry of kv.list<number>({ prefix: ['topic'] })) {
        try {
            const { key, value } = entry
            const [_, topic] = key as [string, string]
            if (value - Math.floor(Date.now() / 1000) < 86400) {
                console.log(`Updating subscriptions for ${topic}`)
                const form = new FormData()
                form.set('hub.callback', callback)
                form.set('hub.topic', `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${topic}`)
                form.set('hub.verify', 'async')
                form.set('hub.mode','subscribe')
                form.set('hub.verify_token', '')
                form.set('hub.secret', '')
                form.set('hub.lease_numbers', '')
                const res = await fetch('https://pubsubhubbub.appspot.com/subscribe', {
                    method: 'POST',
                    body: form
                })
                if (!res.ok)
                    throw new Error(`${res.status} ${res.statusText}`)
            }
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(`Error: ${e.message}`)
            }
            else {
                console.error(`Error: ${JSON.stringify(e)}`)
            }
        }
    }
})
