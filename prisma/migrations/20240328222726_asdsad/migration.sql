/*
  Warnings:

  - Made the column `taskId` on table `ActiveMark` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ActiveMark" ALTER COLUMN "taskId" SET NOT NULL;
