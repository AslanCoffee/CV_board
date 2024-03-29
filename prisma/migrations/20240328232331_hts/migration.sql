/*
  Warnings:

  - A unique constraint covering the columns `[taskId]` on the table `ActiveMark` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `markId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "markId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "ActiveMark_taskId_key" ON "ActiveMark"("taskId");
