-- CreateEnum
CREATE TYPE "StatusCheckin" AS ENUM ('ASRAMA', 'RUMAH', 'RS', 'UKS');

-- CreateTable
CREATE TABLE "users" (
    "username" STRING NOT NULL,
    "password" STRING NOT NULL,
    "name" STRING NOT NULL,
    "refreshToken" STRING[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "checkIn" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "name" STRING NOT NULL,
    "address" STRING NOT NULL,
    "grade" STRING,
    "complaint" STRING NOT NULL,
    "room" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "return_at" TIMESTAMP(3),
    "status" "StatusCheckin" NOT NULL DEFAULT 'UKS',

    CONSTRAINT "checkIn_pkey" PRIMARY KEY ("id")
);
