/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "clientId" INTEGER NOT NULL,
    "apiKey" VARCHAR NOT NULL,

    CONSTRAINT "user_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_client_id_uindex" ON "User"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "user_api_key_uindex" ON "User"("apiKey");
