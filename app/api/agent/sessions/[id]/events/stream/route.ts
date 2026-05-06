import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('ANTHROPIC_API_KEY ausente.', { status: 503 })
  }

  const { id } = await ctx.params
  const encoder = new TextEncoder()

  const body = new ReadableStream({
    async start(controller) {
      // Flush response headers immediately so EventSource.onopen fires in the
      // browser before we await the Anthropic SDK (which can take several
      // seconds to establish its own upstream connection).
      controller.enqueue(encoder.encode(': connected\n\n'))

      const client = new Anthropic()
      let stream
      try {
        stream = await client.beta.sessions.events.stream(id)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Falha ao abrir stream.'
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify({ message })}\n\n`,
          ),
        )
        controller.close()
        return
      }

      const onAbort = () => {
        try {
          stream?.controller.abort()
        } catch {
          // already closed
        }
      }
      request.signal.addEventListener('abort', onAbort)

      try {
        for await (const event of stream) {
          if (request.signal.aborted) break
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
          )
        }
      } catch (err) {
        if (!request.signal.aborted) {
          const message = err instanceof Error ? err.message : 'Stream interrompido.'
          controller.enqueue(
            encoder.encode(
              `event: error\ndata: ${JSON.stringify({ message })}\n\n`,
            ),
          )
        }
      } finally {
        request.signal.removeEventListener('abort', onAbort)
        try {
          controller.close()
        } catch {
          // already closed
        }
      }
    },
  })

  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
