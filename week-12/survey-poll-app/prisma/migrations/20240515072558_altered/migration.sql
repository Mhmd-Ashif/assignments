/*
  Warnings:

  - You are about to drop the column `option` on the `Options` table. All the data in the column will be lost.
  - Added the required column `options` to the `Options` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Options" DROP COLUMN "option",
ADD COLUMN     "options" TEXT NOT NULL;
