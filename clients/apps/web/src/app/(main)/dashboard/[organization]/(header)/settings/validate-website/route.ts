import { getAuthenticatedUser } from '@/utils/user'
import { NextResponse } from 'next/server'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

interface ValidateURLRequest {
  url: string
}

interface ValidateURLResponse {
  reachable: boolean
  status?: number
  error?: string
}

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    return true
  }

  const [a, b] = parts
  if (a === 10 || a === 127 || a === 0) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true

  return false
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase()
  return (
    normalized === '::1' ||
    normalized === '::' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80:')
  )
}

function isPrivateOrLocalAddress(address: string): boolean {
  const kind = isIP(address)
  if (kind === 4) return isPrivateIPv4(address)
  if (kind === 6) return isPrivateIPv6(address)
  return true
}

async function validateOutboundURL(rawUrl: string): Promise<URL> {
  const parsedURL = new URL(rawUrl)

  if (!['http:', 'https:'].includes(parsedURL.protocol)) {
    throw new Error('Invalid URL protocol')
  }

  if (parsedURL.username || parsedURL.password) {
    throw new Error('URL must not contain credentials')
  }

  const records = await lookup(parsedURL.hostname, { all: true })
  if (records.length === 0 || records.some((record) => isPrivateOrLocalAddress(record.address))) {
    throw new Error('URL host is not allowed')
  }

  return parsedURL
}

export async function POST(request: Request): Promise<NextResponse> {
  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as ValidateURLRequest
    const { url } = body

    if (!url) {
      return NextResponse.json(
        {
          reachable: false,
          error: 'URL is required',
        } satisfies ValidateURLResponse,
        { status: 400 },
      )
    }

    // Validate URL format and SSRF-safe destination
    let parsedURL: URL
    try {
      parsedURL = await validateOutboundURL(url)
    } catch (validationError) {
      const message =
        validationError instanceof Error ? validationError.message : 'Invalid URL format'
      return NextResponse.json(
        {
          reachable: false,
          error: message,
        } satisfies ValidateURLResponse,
        { status: 400 },
      )
    }

    // Perform HEAD request with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(parsedURL.toString(), {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'manual',
        headers: {
          'User-Agent': 'Polar URL Validator/1.0',
        },
      })

      clearTimeout(timeoutId)

      const isReachable = response.status >= 200 && response.status < 400

      return NextResponse.json({
        reachable: isReachable,
        status: response.status,
      } satisfies ValidateURLResponse)
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json({
          reachable: false,
          error: 'Request timed out',
        } satisfies ValidateURLResponse)
      }

      return NextResponse.json({
        reachable: false,
        error: 'Unable to reach URL',
      } satisfies ValidateURLResponse)
    }
  } catch (error) {
    return NextResponse.json(
      {
        reachable: false,
        error: (error as Error).message,
      } satisfies ValidateURLResponse,
      { status: 500 },
    )
  }
}
