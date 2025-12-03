-- CreateEnum
-- Add timezone column to users table

-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "timezone" VARCHAR(100) NOT NULL DEFAULT 'Europe/Paris';
