/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."FormStatus" AS ENUM ('NOT_STARTED', 'SUBMITTED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "public"."ApplicationType" AS ENUM ('BE_ARTISAN', 'DISABLE_PROFILE');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_fk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProfile" DROP CONSTRAINT "UserProfile_fk_user_id_fkey";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."UserProfile";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "public"."Roles"[],
    "name" TEXT NOT NULL,
    "social_name" TEXT,
    "avatar" TEXT,
    "is_disabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_used_at" TIMESTAMP(3),
    "ip_host" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_profiles" (
    "id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "cpf" TEXT,
    "phone" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."artisan_applications" (
    "id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "form_status" "public"."FormStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "type" "public"."ApplicationType" NOT NULL DEFAULT 'BE_ARTISAN',
    "raw_material" TEXT[],
    "technique" TEXT[],
    "finality_classification" TEXT[],
    "bio" TEXT,
    "sicab" TEXT,
    "sicab_registration_date" TIMESTAMP(3),
    "sicab_valid_until" TIMESTAMP(3),
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fk_user_reviewer_id" TEXT,
    "rejectionReason" TEXT,

    CONSTRAINT "artisan_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attachments" (
    "id" TEXT NOT NULL,
    "fk_user_id" TEXT,
    "fk_artisan_application_id" TEXT,
    "file_type" TEXT NOT NULL,
    "file_size" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "sessions_fk_user_id_is_revoked_idx" ON "public"."sessions"("fk_user_id", "is_revoked");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_fk_user_id_key" ON "public"."user_profiles"("fk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_cpf_key" ON "public"."user_profiles"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_phone_key" ON "public"."user_profiles"("phone");

-- CreateIndex
CREATE INDEX "artisan_applications_fk_user_id_status_idx" ON "public"."artisan_applications"("fk_user_id", "status");

-- CreateIndex
CREATE INDEX "attachments_fk_user_id_fk_artisan_application_id_idx" ON "public"."attachments"("fk_user_id", "fk_artisan_application_id");

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."artisan_applications" ADD CONSTRAINT "artisan_applications_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."artisan_applications" ADD CONSTRAINT "artisan_applications_fk_user_reviewer_id_fkey" FOREIGN KEY ("fk_user_reviewer_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_fk_artisan_application_id_fkey" FOREIGN KEY ("fk_artisan_application_id") REFERENCES "public"."artisan_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
