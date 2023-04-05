---
type: article
title: Updating timestamps automatically in Supabase
image: images/updating-timestamps-automatically-in-supabase.png
description: Update timestamps automatically in Supabase whenever a row is created or updated with the MODDATETIME extension. Perfect for frequent data changes in your applications.
date: 2023-04-04
tag: Supabase
---

# Updating timestamps automatically in Supabase

Supabase makes it easy to update timestamps automatically whenever a row is created or updated in your database, using the `MODDATETIME` extension. This can especially be useful in applications where data is frequently changed.

## SQL snippet

Replace `YOUR_TABLE_NAME` with the name of your table.

```sql
-- Add new columns to table named `created_at` and `updated_at`
ALTER TABLE YOUR_TABLE_NAME
ADD COLUMN created_at timestamptz default now(),
ADD COLUMN updated_at timestamptz;

-- Enable MODDATETIME extension
create extension if not exists moddatetime schema extensions;

-- This will set the `updated_at` column on every update
create trigger handle_updated_at before update on YOUR_TABLE_NAME
  for each row execute procedure moddatetime (updated_at);
```

The property `created_at` will be set when a new row is added to the table, and `updated_at` will be updated on each update.

## Manually enable extension

1. Navigate to `Database` -> `Extensions` in your Supabase dashboard
2. Enable the `MODDATETIME` extension
3. Add a new column to your table named `created_at`, with type `timestamptz`, and default value `now()`
4. Add a new column to your table named `updated_at`, with type `timestamptz`
5. Go to the SQL editor and run the following query (replace `YOUR_TABLE_NAME` with the name of your table):

```sql
create trigger handle_updated_at before update on YOUR_TABLE_NAME
  for each row execute procedure moddatetime (updated_at);
```

## Resources

* [Supabase](https://supabase.com/)