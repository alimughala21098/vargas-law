import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => req.cookies.getAll(), setAll: (l: any[]) => { l.forEach(({ name, value }: any) => req.cookies.set(name, value)); res = NextResponse.next({ request: req }); l.forEach(({ name, value, options }: any) => res.cookies.set(name, value, options)); } },
  });
  const { data: { user } } = await sb.auth.getUser();
  const p = req.nextUrl.pathname;
  if (!user && p !== "/portal/login") return NextResponse.redirect(new URL("/portal/login?next=" + p, req.url));
  return res;
}
export const config = { matcher: ["/portal/:path*", "/workspace/:path*", "/admin/:path*"] };
