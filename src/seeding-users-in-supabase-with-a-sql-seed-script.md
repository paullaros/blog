---
type: article
title: Seeding users in Supabase with a SQL seed script
image: images/seeding-users-in-supabase-with-a-sql-seed-script.png
description: A practical guide to programmatically seeding test users into Supabase Auth using SQL and pgcrypto for faster development and automated testing.
date: 2026-01-03
tag: Supabase
---

# Seeding users in Supabase with a SQL script

Since I couldn't find any decent resources online about seeding the database (Supabase) using a seed script, I decided to put together a small guide. When developing locally, having "ready-to-go" users is essential for both team collaboration and end-to-end testing with tools like Playwright or Cypress. 

Instead of manually creating users via the dashboard or API, you can use a SQL seed script to automatically populate your authentication schema with demo accounts, giving you the flexibility to reset your database without having to manually add demo users afterward.

## The Seeding Script

The following script uses the `pgcrypto` extension to handle password hashing. It creates a user in `auth.users` and establishes the necessary link in `auth.identities` to ensure the account is functional.

```sql
-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Generate a random UUID for the user
DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
  -- The password is 'password123'
  v_encrypted_pw TEXT := crypt('password123', gen_salt('bf'));
BEGIN

  -- 1. Insert the user into auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'user@example.com',
    v_encrypted_pw,
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name": "Demo", "last_name": "User"}',
    NOW(),
    NOW()
  );

  -- 2. Link an identity so the user can actually log in
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    v_user_id,
    format('{"sub": "%s", "email": "user@example.com"}', v_user_id)::jsonb,
    'email',
    v_user_id,
    NOW(),
    NOW(),
    NOW()
  );

END $$;

```

## Key Components

### 1. Password Hashing

We use `crypt(v_password, gen_salt('bf'))` to hash the plain-text password using the Blowfish algorithm. This is required because Supabase expects the `encrypted_password` column to be hashed; otherwise, logins will fail.

### 2. User Meta Data

The `raw_user_meta_data` column is populated using JSON. This allows you to attach custom fields like `first_name` or `avatar_url` directly to the user during the seed process, which can then be accessed in your application via `supabase.auth.getUser()`.

### 3. Identities Table

In recent versions of Supabase, a user must have an entry in `auth.identities` to sign in successfully. The script ensures the `provider_id` and `user_id` are linked correctly to the email provider.

## How to use

To run this script, you can either:

1. **Supabase CLI:** Place the code in your `supabase/seed.sql` file.
2. **SQL Editor:** Paste the code directly into the Supabase Dashboard SQL Editor and run it.

## Resources

* [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
* [Supabase Local Development & CLI](https://supabase.com/docs/guides/local-development)
* [Supabase Seeding Guide](https://supabase.com/docs/guides/local-development/seeding-your-database)
