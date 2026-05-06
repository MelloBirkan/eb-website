import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const AGENT_ID = 'agent_011CakuDVvPHTcWjRZm7F7Wb'
const ENVIRONMENT_ID = 'env_01R64G13wUrTgVtwo7m9DWTX'

export async function POST() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'missing_api_key', message: 'Configure ANTHROPIC_API_KEY no servidor para usar o chat.' },
      { status: 503 },
    )
  }

  try {
    const client = new Anthropic()
    const session = await client.beta.sessions.create({
      agent: { type: 'agent', id: AGENT_ID },
      environment_id: ENVIRONMENT_ID,
    })
    return Response.json({ id: session.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Falha ao criar sessão.'
    return Response.json({ error: 'create_failed', message }, { status: 500 })
  }
}
