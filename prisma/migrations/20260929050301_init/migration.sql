-- CreateEnum
CREATE TYPE "LinkKind" AS ENUM ('GITHUB', 'LINKEDIN', 'TELEGRAM', 'EMAIL', 'WEBSITE', 'OTHER');

-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('LANGUAGE', 'BACKEND', 'DATABASE', 'DEVOPS', 'AI', 'TOOLING');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "kind" "LinkKind" NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "location" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE,

    CONSTRAINT "experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" UUID NOT NULL,
    "experience_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "repository_url" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectTechnologies" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ProjectTechnologies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_slug_key" ON "profiles"("slug");

-- CreateIndex
CREATE INDEX "links_profile_id_idx" ON "links"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "skills_profile_id_name_key" ON "skills"("profile_id", "name");

-- CreateIndex
CREATE INDEX "experience_profile_id_idx" ON "experience"("profile_id");

-- CreateIndex
CREATE INDEX "achievements_experience_id_idx" ON "achievements"("experience_id");

-- CreateIndex
CREATE INDEX "projects_profile_id_idx" ON "projects"("profile_id");

-- CreateIndex
CREATE INDEX "_ProjectTechnologies_B_index" ON "_ProjectTechnologies"("B");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience" ADD CONSTRAINT "experience_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTechnologies" ADD CONSTRAINT "_ProjectTechnologies_A_fkey" FOREIGN KEY ("A") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTechnologies" ADD CONSTRAINT "_ProjectTechnologies_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
