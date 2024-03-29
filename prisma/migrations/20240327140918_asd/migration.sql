/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATE', 'AGREEMENT', 'COLLECT', 'DONE', 'CANCEL', 'REWORK');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MANAGER';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "Card";

-- DropTable
DROP TABLE "File";

-- CreateTable
CREATE TABLE "ActiveMark" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "ActiveMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWork" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "taskCreate" INTEGER NOT NULL,
    "taskupdate" INTEGER NOT NULL,
    "taskDelete" INTEGER NOT NULL,
    "taskDone" INTEGER NOT NULL,
    "taskWork" INTEGER NOT NULL,

    CONSTRAINT "UserWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "statusStage" "Status" NOT NULL DEFAULT 'CREATE',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "urlCV" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "srcCV" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ActiveMarkToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ActiveMarkToTask" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_number_key" ON "Document"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Document_url_key" ON "Document"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Task_email_key" ON "Task"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Task_phone_key" ON "Task"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Task_urlCV_key" ON "Task"("urlCV");

-- CreateIndex
CREATE UNIQUE INDEX "Task_srcCV_key" ON "Task"("srcCV");

-- CreateIndex
CREATE UNIQUE INDEX "_ActiveMarkToUser_AB_unique" ON "_ActiveMarkToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ActiveMarkToUser_B_index" ON "_ActiveMarkToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActiveMarkToTask_AB_unique" ON "_ActiveMarkToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_ActiveMarkToTask_B_index" ON "_ActiveMarkToTask"("B");

-- AddForeignKey
ALTER TABLE "UserWork" ADD CONSTRAINT "UserWork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActiveMarkToUser" ADD CONSTRAINT "_ActiveMarkToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ActiveMark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActiveMarkToUser" ADD CONSTRAINT "_ActiveMarkToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActiveMarkToTask" ADD CONSTRAINT "_ActiveMarkToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "ActiveMark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActiveMarkToTask" ADD CONSTRAINT "_ActiveMarkToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
