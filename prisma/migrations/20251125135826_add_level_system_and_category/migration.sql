-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'other',
ADD COLUMN     "start_date" DATE;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "stars" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;
