-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "googleId" TEXT,
    "photo" TEXT,
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ressource" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duree" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "proprietaire" TEXT NOT NULL,
    "niveau_difficulte" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ressource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ressource_id" INTEGER NOT NULL,
    "date_consultation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temps_passe" INTEGER NOT NULL DEFAULT 0,
    "nombre_question_ia" INTEGER NOT NULL DEFAULT 0,
    "est_favori" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "mot_cle" TEXT NOT NULL,
    "date_recherche" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type_recherche" TEXT NOT NULL,

    CONSTRAINT "search_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_feedback" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ressource_id" INTEGER NOT NULL,
    "clique" BOOLEAN NOT NULL DEFAULT false,
    "vision_complete" BOOLEAN NOT NULL DEFAULT false,
    "aime" BOOLEAN NOT NULL DEFAULT false,
    "temps_visionnage_secondes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "recommendation_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "user_activity_user_id_idx" ON "user_activity"("user_id");

-- CreateIndex
CREATE INDEX "user_activity_ressource_id_idx" ON "user_activity"("ressource_id");

-- CreateIndex
CREATE INDEX "search_history_user_id_idx" ON "search_history"("user_id");

-- CreateIndex
CREATE INDEX "recommendation_feedback_user_id_idx" ON "recommendation_feedback"("user_id");

-- CreateIndex
CREATE INDEX "recommendation_feedback_ressource_id_idx" ON "recommendation_feedback"("ressource_id");

-- AddForeignKey
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_ressource_id_fkey" FOREIGN KEY ("ressource_id") REFERENCES "ressource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_history" ADD CONSTRAINT "search_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_feedback" ADD CONSTRAINT "recommendation_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_feedback" ADD CONSTRAINT "recommendation_feedback_ressource_id_fkey" FOREIGN KEY ("ressource_id") REFERENCES "ressource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
