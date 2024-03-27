-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'EMPLOYEE';

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "url_cv" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "src_cv" TEXT NOT NULL,
    "date_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_email_key" ON "Card"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Card_telephone_key" ON "Card"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Card_url_cv_key" ON "Card"("url_cv");

-- CreateIndex
CREATE UNIQUE INDEX "Card_src_cv_key" ON "Card"("src_cv");
