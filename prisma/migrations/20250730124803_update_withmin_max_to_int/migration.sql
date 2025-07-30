/*
  Warnings:

  - The `withMin` column on the `Coin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `withMax` column on the `Coin` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Coin" DROP COLUMN "withMin",
ADD COLUMN     "withMin" INTEGER,
DROP COLUMN "withMax",
ADD COLUMN     "withMax" INTEGER;
