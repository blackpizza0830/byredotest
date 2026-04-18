# Supabase CLI Workflow

## 1) Authenticate and link once

```bash
npx supabase login
npx supabase link --project-ref geleljtkmdlpyqifssak
```

`supabase link` will ask for your database password from the Supabase project settings.

## 2) Local development (optional but recommended)

```bash
npm run supabase:start
npm run supabase:status
```

## 3) Create and edit tables via migrations

Create a new migration file:

```bash
npm run supabase:new -- add_orders_table
```

Then write SQL in `supabase/migrations/*.sql`.

Apply migrations:

```bash
npm run supabase:push
```

Reset local DB and re-run all migrations + seed data:

```bash
npm run supabase:reset
```

## 4) Pull remote schema changes into migrations

```bash
npm run supabase:pull
```

Use this when schema changes were made directly in Supabase dashboard SQL editor.
