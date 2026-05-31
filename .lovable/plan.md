# Create Admin Account

Provision an admin user with the provided credentials so you can sign in at `/login` and access `/admin`.

## Steps

1. **Create the auth user** via Supabase Admin API (email pre-confirmed, no verification email needed):
   - Email: `yalinetworknig@gmail.com`
   - Password: `YALINig@2026`
   - `email_confirm: true` so you can sign in immediately

2. **Grant admin role** by inserting into `public.user_roles`:
   ```sql
   insert into public.user_roles (user_id, role)
   values ('<new-user-id>', 'admin');
   ```

3. **Verify** by querying `auth.users` joined with `user_roles` to confirm the row exists with role `admin`.

## How you'll use it

- Go to `/login`
- Enter `yalinetworknig@gmail.com` / `YALINig@2026`
- The login handler detects the admin role and redirects to `/admin`

## Security note

Storing this password in chat means it's now in your project history. Recommend rotating it after first login via Supabase Auth → Users, or by signing in and changing the password from the profile/settings page.

## Technical detail

Auth users cannot be created via SQL migration (the `auth.users` table has internal triggers and password hashing requirements). I'll use the Supabase Admin API through a one-off server-side call using the service role key (already configured as `SUPABASE_SERVICE_ROLE_KEY`). No code files will be added — this is a one-time provisioning action.