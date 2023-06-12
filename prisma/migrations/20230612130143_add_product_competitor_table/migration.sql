-- CreateTable
CREATE TABLE "ProductCompetitor" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT,
    "image" TEXT,
    "title" TEXT,
    "newPrice" TEXT,
    "oldPrice" TEXT,
    "rating" DOUBLE PRECISION,
    "comments" INTEGER NOT NULL,
    "productId" VARCHAR(36) NOT NULL,

    CONSTRAINT "report_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductCompetitor" ADD CONSTRAINT "competitor_product_id_fk" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
