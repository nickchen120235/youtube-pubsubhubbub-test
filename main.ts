import { xml } from './core.ts'

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
                console.log(`Body: ${body}`)
                const notification = xml.parse(body)
                console.log(`Notification: ${JSON.stringify(notification)}`)
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
        default: return new Response(null, { status: 405 })
    }
})
