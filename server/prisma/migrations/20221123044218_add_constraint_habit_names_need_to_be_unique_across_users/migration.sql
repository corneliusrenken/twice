/*
  Warnings:

  - A unique constraint covering the columns `[name,user_id]` on the table `habits` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "habits_name_user_id_key" ON "habits"("name", "user_id");