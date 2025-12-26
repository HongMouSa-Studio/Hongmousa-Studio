# Supabase Database Migration - Address Book Enhancement

請去你嘅 Supabase Dashboard → SQL Editor，執行以下 SQL 指令：

```sql
-- Add new columns to address_book table
ALTER TABLE public.address_book 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS cvs_store TEXT;

-- Make address column optional (since CVS users might only fill cvs_store)
ALTER TABLE public.address_book 
ALTER COLUMN address DROP NOT NULL;
```

執行完之後，揀門市同埋儲存地址嘅功能就會正常運作喇！
