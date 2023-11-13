-- CreateEnum
CREATE TYPE "StatusCheckin" AS ENUM ('ASRAMA', 'RUMAH', 'RS', 'UKS');

-- CreateTable
CREATE TABLE "users" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "token" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "checkIn" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "grade" TEXT,
    "complaint" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "return_at" TIMESTAMP(3),
    "status" "StatusCheckin" NOT NULL DEFAULT 'UKS',

    CONSTRAINT "checkIn_pkey" PRIMARY KEY ("id")
);
