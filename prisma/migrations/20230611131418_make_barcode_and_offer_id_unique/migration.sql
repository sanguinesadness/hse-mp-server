/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[offerId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "barcode" SET DATA TYPE VARCHAR,
ALTER COLUMN "offerId" SET DATA TYPE VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "product_barcode_uindex" ON "Product"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "product_offer_id_uindex" ON "Product"("offerId");
