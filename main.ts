import { xml, dotenv } from './core.ts'
import { parseNotification } from "./parse.ts"

await dotenv.load({ export: true })
const webhook = Deno.env.get('WEBHOOK')
if (!webhook)
    throw new Error('WEBHOOK environment variable not set')

Deno.serve(async (req) => {
    switch (req.method) {
        case 'GET': {
            console.log('Received callback challenge')
            console.log(`URL: ${req.url}`)
            const url = new URL(req.url)
            const challenge = url.searchParams.get('hub.challenge')
            if (challenge) return new Response(challenge, {
                status: 200,
                headers: {
                    'Content-Type': 'text/plain'
                },
            })
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
                console.log(`Updated: ${notification.updated}`)
                await fetch(webhook, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: `Video URL: ${notification.videoUrl}\nPublished: ${notification.published}\nUpdated: ${notification.updated}`,
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
