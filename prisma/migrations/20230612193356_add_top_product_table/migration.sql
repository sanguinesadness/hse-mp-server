/*
  Warnings:

  - You are about to drop the `UserCompetitor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserCompetitor" DROP CONSTRAINT "user_competitor_product_id_fk";

-- DropTable
DROP TABLE "UserCompetitor";

-- CreateTable
CREATE TABLE "TopProduct" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT,
    "image" TEXT,
    "title" TEXT,
    "newPrice" TEXT,
    "oldPrice" TEXT,
    "rating" DOUBLE PRECISION,
    "comments" INTEGER,

    CONSTRAINT "top_product_pk" PRIMARY KEY ("id")
);
