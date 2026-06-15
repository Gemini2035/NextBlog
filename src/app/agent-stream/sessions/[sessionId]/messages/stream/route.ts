import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface RouteContext {
  params: Promise<{
    sessionId: string
  }>
}

const getApiProxyTarget = () => {
  return (process.env.NEXT_API_PROXY_TARGET || '').replace(/\/$/, '')
}

const readUpstreamError = async (response: Response) => {
  const text = await response.text().catch(() => '')
  if (!text) {
    return `Agent upstream stream failed with status ${response.status}`
  }

  try {
    const payload = JSON.parse(text) as unknown
    if (payload && typeof payload === 'object') {
      const record = payload as Record<string, unknown>
      const detail = record.detail
      if (detail && typeof detail === 'object') {
        const detailRecord = detail as Record<string, unknown>
        return typeof detailRecord.message === 'string'
          ? detailRecord.message
          : `Agent upstream stream failed with status ${response.status}`
      }
      if (typeof record.message === 'string') return record.message
      if (typeof record.error === 'string') return record.error
    }
  } catch {
    return text
  }

  return `Agent upstream stream failed with status ${response.status}`
}

export async function GET(request: NextRequest, context: RouteContext) {
  const apiProxyTarget = getApiProxyTarget()
  if (!apiProxyTarget) {
    return Response.json(
      {
        code: 500,
        message: 'NEXT_API_PROXY_TARGET is not configured',
        data: null,
      },
      { status: 500 }
    )
  }

  const { sessionId } = await context.params
  const upstreamUrl = new URL(
    `/api/agent/sessions/${sessionId}/messages/stream`,
    apiProxyTarget
  )
  upstreamUrl.search = request.nextUrl.search
  const locale = request.headers.get('x-locale') ?? request.nextUrl.searchParams.get('locale')

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let upstreamReader: ReadableStreamDefaultReader<Uint8Array> | null = null
      const cancelUpstreamReader = () => {
        const reader = upstreamReader
        upstreamReader = null
        if (!reader) return
        void reader.cancel().catch(() => undefined)
      }

      request.signal.addEventListener('abort', cancelUpstreamReader, { once: true })

      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: 'proxy_stage',
            data: {
              step: 'next_proxy_connected',
              target: apiProxyTarget,
            },
          })}\n\n`
        )
      )

      try {
        const upstreamResponse = await fetch(upstreamUrl, {
          method: 'GET',
          headers: {
            Accept: 'text/event-stream',
            ...(locale ? { 'X-Locale': locale } : {}),
          },
          cache: 'no-store',
          signal: request.signal,
        })

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'proxy_stage',
              data: {
                step: 'upstream_connected',
                status: upstreamResponse.status,
              },
            })}\n\n`
          )
        )

        if (!upstreamResponse.ok || !upstreamResponse.body) {
          const errorMessage = await readUpstreamError(upstreamResponse)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error_message',
                data: {
                  error: errorMessage,
                },
              })}\n\n`
            )
          )
          return
        }

        upstreamReader = upstreamResponse.body.getReader()
        while (true) {
          const { done, value } = await upstreamReader.read()
          if (done) break
          controller.enqueue(value)
        }
      } catch (error) {
        if (request.signal.aborted) {
          return
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'error_message',
              data: {
                error: error instanceof Error ? error.message : 'Agent proxy stream failed',
              },
            })}\n\n`
          )
        )
      } finally {
        cancelUpstreamReader()
        request.signal.removeEventListener('abort', cancelUpstreamReader)
        controller.close()
      }
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
      'X-NextBlog-Agent-Stream-Proxy': '1',
    },
  })
}
