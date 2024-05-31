/*
  Warnings:

  - You are about to drop the column `createDate` on the `WorkGroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "WorkGroup" DROP COLUMN "createDate";
