/*
  Warnings:

  - The primary key for the `googlephonetoken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `phone` on the `googlephonetoken` table. All the data in the column will be lost.
  - The primary key for the `phonetrial` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `phone` on the `phonetrial` table. All the data in the column will be lost.
  - The primary key for the `remindersent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `phone` on the `remindersent` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `GooglePhoneToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `PhoneTrial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `ReminderSent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `googlephonetoken` DROP PRIMARY KEY,
    DROP COLUMN `phone`,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`phoneNumber`);

-- AlterTable
ALTER TABLE `phonetrial` DROP PRIMARY KEY,
    DROP COLUMN `phone`,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`phoneNumber`);

-- AlterTable
ALTER TABLE `remindersent` DROP PRIMARY KEY,
    DROP COLUMN `phone`,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`phoneNumber`, `googleEventId`);
