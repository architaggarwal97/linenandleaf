import { createMiddleware } from "@tanstack/react-start";

// Same job as the generated attachSupabaseAuth, but imports the Supabase
// client lazily so it isn't bundled into the main chunk of every page.
export const lazyAttachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
  },
);
