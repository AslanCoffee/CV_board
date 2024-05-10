/*
  Warnings:

  - You are about to drop the `ActiveMark` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserWork` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ActiveMarkToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'DELETED';

-- DropForeignKey
ALTER TABLE "ActiveMark" DROP CONSTRAINT "ActiveMark_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskHistory" DROP CONSTRAINT "TaskHistory_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskHistory" DROP CONSTRAINT "TaskHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserWork" DROP CONSTRAINT "UserWork_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ActiveMarkToUser" DROP CONSTRAINT "_ActiveMarkToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActiveMarkToUser" DROP CONSTRAINT "_ActiveMarkToUser_B_fkey";

-- DropTable
DROP TABLE "ActiveMark";

-- DropTable
DROP TABLE "TaskHistory";

-- DropTable
DROP TABLE "UserWork";

-- DropTable
DROP TABLE "_ActiveMarkToUser";

-- CreateTable
CREATE TABLE "WorkGroup" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "doneDate" TIMESTAMP(3),
    "deleteDate" TIMESTAMP(3),
    "activeWork" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WorkGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "fieldName" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToWorkGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkGroup_taskId_key" ON "WorkGroup"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "History_groupId_key" ON "History"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToWorkGroup_AB_unique" ON "_UserToWorkGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToWorkGroup_B_index" ON "_UserToWorkGroup"("B");

-- AddForeignKey
ALTER TABLE "WorkGroup" ADD CONSTRAINT "WorkGroup_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "WorkGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWorkGroup" ADD CONSTRAINT "_UserToWorkGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWorkGroup" ADD CONSTRAINT "_UserToWorkGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
