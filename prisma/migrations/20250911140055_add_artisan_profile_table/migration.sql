-- CreateTable
CREATE TABLE "public"."artisan_profiles" (
    "id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "artisan_user_name" TEXT NOT NULL,
    "raw_material" TEXT[],
    "technique" TEXT[],
    "finality_classification" TEXT[],
    "sicab" TEXT NOT NULL,
    "sicab_registration_date" TIMESTAMP(3) NOT NULL,
    "sicab_valid_until" TIMESTAMP(3) NOT NULL,
    "followers_count" INTEGER NOT NULL DEFAULT 0,
    "products_count" INTEGER NOT NULL DEFAULT 0,
    "bio" TEXT,
    "is_disabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artisan_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artisan_profiles_fk_user_id_key" ON "public"."artisan_profiles"("fk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "artisan_profiles_artisan_user_name_key" ON "public"."artisan_profiles"("artisan_user_name");

-- AddForeignKey
ALTER TABLE "public"."artisan_profiles" ADD CONSTRAINT "artisan_profiles_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
