-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('USER', 'ARTISAN', 'MODERATOR', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_used_at" TIMESTAMP(3),
    "ip_host" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserProfile" (
    "id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "cpf" TEXT,
    "phone" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Session_fk_user_id_is_revoked_idx" ON "public"."Session"("fk_user_id", "is_revoked");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_fk_user_id_key" ON "public"."UserProfile"("fk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_cpf_key" ON "public"."UserProfile"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_phone_key" ON "public"."UserProfile"("phone");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProfile" ADD CONSTRAINT "UserProfile_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
