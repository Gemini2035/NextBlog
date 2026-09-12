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

export async function POST(request: NextRequest, context: RouteContext) {
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
    `/api/agent/sessions/${sessionId}/messages:stream`,
    apiProxyTarget
  )
  const locale = request.headers.get('x-locale')
  const body = await request.arrayBuffer()
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

      try {
        const upstreamResponse = await fetch(upstreamUrl, {
          method: 'POST',
          headers: {
            Accept: 'text/event-stream',
            'Content-Type': request.headers.get('content-type') ?? 'application/json',
            ...(request.headers.get('x-device-key') ? { 'X-Device-Key': request.headers.get('x-device-key')! } : {}),
            ...(locale ? { 'X-Locale': locale } : {}),
          },
          body,
          cache: 'no-store',
          signal: request.signal,
        })

        if (!upstreamResponse.ok || !upstreamResponse.body) {
          const errorMessage = await readUpstreamError(upstreamResponse)
          throw new Error(errorMessage)
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

        controller.error(error)
      } finally {
        cancelUpstreamReader()
        request.signal.removeEventListener('abort', cancelUpstreamReader)
        if (!request.signal.aborted) controller.close()
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
    },
  })
}
