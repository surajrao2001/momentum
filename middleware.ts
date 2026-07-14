import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Exclude all Next internals (_next/*), including webpack HMR in dev.
  matcher: ["/((?!_next|favicon.ico|manifest.json|sw.js|icons).*)"],
};
