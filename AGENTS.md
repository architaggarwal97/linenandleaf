<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Supabase bearer middleware in src/start.ts is `lazyAttachSupabaseAuth` (src/lib/lazy-auth-attacher.ts), not the generated attacher — why: dynamic import keeps the Supabase client out of every page's main bundle.
