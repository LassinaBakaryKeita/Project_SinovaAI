/*
  Warnings:

  - You are about to drop the column `aime` on the `recommendation_feedback` table. All the data in the column will be lost.
  - You are about to drop the column `est_favori` on the `user_activity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,ressource_id]` on the table `recommendation_feedback` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_id]` on the table `ressource` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,ressource_id]` on the table `user_activity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_id` to the `ressource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recommendation_feedback" DROP COLUMN "aime";

-- AlterTable
ALTER TABLE "ressource" ADD COLUMN     "external_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_activity" DROP COLUMN "est_favori";

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_feedback_user_id_ressource_id_key" ON "recommendation_feedback"("user_id", "ressource_id");

-- CreateIndex
CREATE UNIQUE INDEX "ressource_external_id_key" ON "ressource"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_activity_user_id_ressource_id_key" ON "user_activity"("user_id", "ressource_id");
