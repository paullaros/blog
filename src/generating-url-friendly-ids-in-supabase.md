---
type: article
title: Generating URL-friendly IDs in Supabase
image: images/generating-url-friendly-ids-in-supabase.png
description: Learn how to generate short, URL-friendly IDs in Supabase using a PostgreSQL function called Nano ID. This step-by-step guide shows you how to create unique IDs that are easy to read, without revealing any private information.
date: 2023-04-11
tag: Supabase
---

# Generating URL-friendly IDs in Supabase

This post offers a tutorial on how to generate short IDs using a Postgres function, which can be used in any Postgres database, including Supabase. Short IDs are useful because they can make URLs easier to read while keeping information private.

Although [UUIDs](https://supabase.com/docs/guides/database/extensions/uuid-ossp) can also be used for this purpose, they may not be ideal if you plan to display them to users in URLs, as they can be quite lengthy and cumbersome. Instead, it would be better to use a shorter string that is generated randomly and is also cryptographically secure.

This tutorial employs Nano ID, a popular, fast, and compact option.

## Install Nano ID

Execute the file script below in your database in order to create the `nanonid()` function. The source of this script can also be found at the Nano ID for PostgreSQL [GitHub repository](https://github.com/viascom/nanoid-postgres).

```sql
/* Source: https://github.com/viascom/nanoid-postgres/blob/main/nanoid.sql */

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION nanoid(size int DEFAULT 21, alphabet text DEFAULT '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    RETURNS text
    LANGUAGE plpgsql
    volatile
AS
$$
DECLARE
    idBuilder     text := '';
    i             int  := 0;
    bytes         bytea;
    alphabetIndex int;
    mask          int;
    step          int;
BEGIN
    mask := (2 << cast(floor(log(length(alphabet) - 1) / log(2)) as int)) - 1;
    step := cast(ceil(1.6 * mask * size / length(alphabet)) AS int);

    while true
        loop
            bytes := gen_random_bytes(size);
            while i < size
                loop
                    alphabetIndex := (get_byte(bytes, i) & mask) + 1;
                    if alphabetIndex <= length(alphabet) then
                        idBuilder := idBuilder || substr(alphabet, alphabetIndex, 1);
                        if length(idBuilder) = size then
                            return idBuilder;
                        end if;
                    end if;
                    i = i + 1;
                end loop;

            i := 0;
        end loop;
END
$$;
```

## How to use

Imagine we want to create a table named `todos` and give each new record a unique, human-readable ID as primary key that we can later use as unique URL. To accomplish this, we'll generate a unique ID using only lowercase letters, and it will be 20 characters long.

```sql
create table todos (
  id char(20) default nanoid(20, 'abcdefghijklmnopqrstuvwxyz') primary key,
  title text not null
);
```

Example output:
```txt
oqysjinzebircvklhgqt
aiaosxfkkjawlgtaqowa
phoqybagbdfdubpnylkx
zdhhilehjymwwuwgoapx
hlnsvrcjjloqxfbiljsz
```

We have short, unique IDs that are safe to use in URLs and APIs. These IDs are easy to copy, don't reveal any private information, and they're not ugly.

## Resources

* [Supabase](https://supabase.com/)
* [Nano ID](https://github.com/ai/nanoid)