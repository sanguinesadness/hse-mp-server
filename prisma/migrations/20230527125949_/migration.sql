/*
  Warnings:

  - You are about to drop the column `api_key` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clientId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[apiKey]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiKey` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_api_key_uindex";

-- DropIndex
DROP INDEX "user_client_id_uindex";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "api_key",
DROP COLUMN "client_id",
ADD COLUMN     "apiKey" VARCHAR NOT NULL,
ADD COLUMN     "clientId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_client_id_uindex" ON "user"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "user_api_key_uindex" ON "user"("apiKey");
