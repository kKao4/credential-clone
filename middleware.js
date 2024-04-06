import {NextResponse, userAgent} from 'next/server'

export function middleware(request) {
  const url = request.nextUrl
  if (url.pathname.includes('undefined')) {
    return NextResponse.redirect(new URL('/404', request.url))
  }

  // if (url.pathname.includes('/san-pham')) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }
  // if (url.pathname.includes('/pre-order')) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }
  // if (url.pathname.includes('/tra-cuu-don-hang')) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }
  // if (url.pathname.includes('/flash-sale')) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }
  const {device} = userAgent(request)

  const viewport =
    device.type === 'mobile'
      ? 'mobile'
      : device.type === 'tablet'
      ? 'tablet'
      : 'desktop'
  url.searchParams.set('viewport', viewport)
  url.searchParams.set('pathname', url.pathname)
  return NextResponse.rewrite(url)
}
