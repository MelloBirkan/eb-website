import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'missing_api_key', message: 'Configure ANTHROPIC_API_KEY no servidor.' },
      { status: 503 },
    )
  }

  const { id } = await ctx.params

  let payload: { events?: unknown }
  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 })
  }

  if (!payload || !Array.isArray(payload.events) || payload.events.length === 0) {
    return Response.json({ error: 'invalid_events' }, { status: 400 })
  }

  try {
    const client = new Anthropic()
    await client.beta.sessions.events.send(id, {
      events: payload.events as Parameters<typeof client.beta.sessions.events.send>[1]['events'],
    })
    return new Response(null, { status: 204 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Falha ao enviar evento.'
    return Response.json({ error: 'send_failed', message }, { status: 500 })
  }
}
