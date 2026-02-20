-- public.users.id is now always equal to auth.users.id.
-- supabase_id is therefore redundant and is removed.

-- DropIndex
DROP INDEX "users_supabase_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "supabase_id";
