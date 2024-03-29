/*
  Warnings:

  - You are about to drop the `_ActiveMarkToTask` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `taskId` to the `ActiveMark` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ActiveMarkToTask" DROP CONSTRAINT "_ActiveMarkToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActiveMarkToTask" DROP CONSTRAINT "_ActiveMarkToTask_B_fkey";

-- AlterTable
ALTER TABLE "ActiveMark" ADD COLUMN     "taskId" INTEGER;

-- DropTable
DROP TABLE "_ActiveMarkToTask";

-- AddForeignKey
ALTER TABLE "ActiveMark" ADD CONSTRAINT "ActiveMark_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
