-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "schoolName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'GURU',
    "quota" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "learningGoal" TEXT NOT NULL,
    "durationJP" INTEGER NOT NULL DEFAULT 1,
    "geoContext" TEXT,
    "classLevel" TEXT,
    "apersepsi" TEXT,
    "presentationData" TEXT,
    "lkpdData" TEXT,
    "ebookData" TEXT,
    "hasPresentasi" BOOLEAN NOT NULL DEFAULT false,
    "hasLkpd" BOOLEAN NOT NULL DEFAULT false,
    "hasEbook" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
