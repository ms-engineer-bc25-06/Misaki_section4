/*
  Warnings:

  - You are about to drop the column `note` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `note`,
    ADD COLUMN `note` VARCHAR(191) NULL,
    MODIFY `date` VARCHAR(191) NOT NULL;
