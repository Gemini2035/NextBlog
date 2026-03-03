-- CreateTable
CREATE TABLE "third_party_configs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "third_party_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "third_party_configs_name_idx" ON "third_party_configs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "third_party_configs_id_key" ON "third_party_configs"("id");
