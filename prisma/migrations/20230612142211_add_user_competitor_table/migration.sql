-- CreateTable
CREATE TABLE "UserCompetitor" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT,
    "image" TEXT,
    "name" TEXT,
    "productCompetitorId" VARCHAR(36) NOT NULL,

    CONSTRAINT "user_competitor_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserCompetitor" ADD CONSTRAINT "user_competitor_product_id_fk" FOREIGN KEY ("productCompetitorId") REFERENCES "ProductCompetitor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
