-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "client_id" INTEGER NOT NULL,
    "api_key" VARCHAR NOT NULL,

    CONSTRAINT "user_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_client_id_uindex" ON "user"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_api_key_uindex" ON "user"("api_key");
