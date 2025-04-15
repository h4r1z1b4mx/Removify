/*
  Warnings:

  - You are about to drop the column `createdat` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Images` DROP FOREIGN KEY `Images_userid_fkey`;

-- DropIndex
DROP INDEX `Images_userid_fkey` ON `Images`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `createdat`,
    ADD COLUMN `firstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `UserItem` (
    `id` VARCHAR(191) NOT NULL,
    `userid` VARCHAR(191) NOT NULL,
    `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserItem` ADD CONSTRAINT `UserItem_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Images` ADD CONSTRAINT `Images_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `UserItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
