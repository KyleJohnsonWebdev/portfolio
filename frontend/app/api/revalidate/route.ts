import {revalidatePath} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

/**
 * Called by a Sanity webhook whenever content is published, unpublished or deleted.
 * Marks every page for regeneration, so new content shows on the next visit even when
 * nobody had the site open at publish time (Sanity Live only refreshes open pages).
 *
 * The request must be signed with SANITY_REVALIDATE_SECRET, set to the same value in
 * Vercel and in the webhook's settings at sanity.io/manage.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({message: 'Revalidation is not configured'}, {status: 500})
  }

  try {
    // The third argument waits until the change is readable from the CDN before revalidating.
    const {isValidSignature, body} = await parseBody<{_type?: string}>(request, secret, true)
    if (!isValidSignature) {
      return NextResponse.json({message: 'Invalid signature'}, {status: 401})
    }

    // The whole site is small and every page reads shared settings, so refresh all of it.
    revalidatePath('/', 'layout')
    return NextResponse.json({revalidated: true, type: body?._type ?? null})
  } catch (error) {
    console.error(error)
    return NextResponse.json({message: 'Could not read the webhook body'}, {status: 400})
  }
}
