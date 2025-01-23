/*
  Warnings:

  - Changed the type of `year` on the `car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `car` DROP COLUMN `year`,
    ADD COLUMN `year` DATETIME(3) NOT NULL;
