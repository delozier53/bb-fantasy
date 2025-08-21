# 🚀 Supabase Setup Guide for BB Fantasy

## Prerequisites
- Supabase account at [supabase.com](https://supabase.com)
- Your BB Fantasy project ready

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign up/login
2. **Create a new project**:
   - Click "New Project"
   - Choose your organization
   - Enter project name: `bb-fantasy`
   - Enter database password (save this!)
   - Choose region closest to you
   - Click "Create new project"

## Step 2: Get Connection Details

Once your project is created:

1. **Go to Settings → Database**
2. **Copy these values**:
   - **Project URL** (looks like: `https://[PROJECT-REF].supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`)

## Step 3: Update Environment Variables

Update your `.env` file with these values:

```bash
# Database URLs
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

## Step 4: Run Database Migration

1. **Link your project** (replace with your project reference):
   ```bash
   supabase link --project-ref [YOUR-PROJECT-REF]
   ```

2. **Push the migration**:
   ```bash
   supabase db push
   ```

3. **Seed the database**:
   ```bash
   supabase db reset
   ```

## Step 5: Update NextAuth Configuration

Update your NextAuth configuration to use Supabase:

1. **Go to Settings → Auth → URL Configuration**
2. **Add these URLs**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/api/auth/callback/supabase`

## Step 6: Test Your Setup

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Visit your app**: `http://localhost:3000`

3. **Check Supabase Dashboard**: Go to your project dashboard and verify data is being created

## Step 7: Deploy to Production

When ready to deploy:

1. **Update environment variables** in your hosting platform
2. **Update Supabase Auth settings** with your production domain
3. **Deploy your app**

## Troubleshooting

### Common Issues:

1. **Connection refused**: Check your DATABASE_URL format
2. **Authentication errors**: Verify your Supabase keys
3. **RLS policies**: Check Row Level Security policies in Supabase dashboard

### Useful Commands:

```bash
# Check Supabase status
supabase status

# View logs
supabase logs

# Reset local database
supabase db reset

# Generate types (if using TypeScript)
supabase gen types typescript --local > src/types/supabase.ts
```

## Next Steps

1. **Customize RLS policies** in Supabase dashboard
2. **Set up email templates** for authentication
3. **Configure storage** for user avatars
4. **Set up real-time subscriptions** for live updates

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
