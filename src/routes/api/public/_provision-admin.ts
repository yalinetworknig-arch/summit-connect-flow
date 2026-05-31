import { createFileRoute } from '@tanstack/react-router';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

export const Route = createFileRoute('/api/public/_provision-admin')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get('x-provision-token');
        if (token !== 'one-shot-yali-2026') {
          return new Response('forbidden', { status: 403 });
        }
        const email = 'yalinetworknig@gmail.com';
        const password = 'YALINig@2026';
        const sb: any = supabaseAdmin;
        let userId: string | null = null;
        const { data: created, error } = await sb.auth.admin.createUser({
          email, password, email_confirm: true,
        });
        if (error) {
          const { data: list } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
          const found = list?.users?.find((u: any) => u.email === email);
          if (!found) return Response.json({ ok: false, error: error.message }, { status: 500 });
          userId = found.id;
          await sb.auth.admin.updateUserById(userId, { password, email_confirm: true });
        } else {
          userId = created.user.id;
        }
        const { error: e2 } = await sb.from('user_roles').insert({ user_id: userId, role: 'admin' });
        const dup = e2?.message?.includes('duplicate');
        return Response.json({ ok: true, userId, roleInserted: !e2, duplicate: !!dup, roleError: e2 && !dup ? e2.message : null });
      },
    },
  },
});