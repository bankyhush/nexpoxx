-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('open', 'closed');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(100),
    "phoneNumber" VARCHAR(20),
    "country" VARCHAR(50),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "inviteCode" VARCHAR(8) NOT NULL,
    "accountType" VARCHAR(20) NOT NULL DEFAULT 'standard',
    "stoken" VARCHAR(6),
    "walletAddress" VARCHAR(50) NOT NULL,
    "kycStatus" VARCHAR(20) NOT NULL DEFAULT 'Pending',
    "frontImage" VARCHAR(255),
    "backImage" VARCHAR(255),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coin" (
    "id" SERIAL NOT NULL,
    "coinName" VARCHAR(50) NOT NULL,
    "coinTitle" VARCHAR(100) NOT NULL,
    "coinRate" DECIMAL(10,3) NOT NULL,
    "photo" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withMin" VARCHAR(50),
    "withMax" VARCHAR(50),
    "withInstructions" TEXT,
    "depositInstructions" TEXT,
    "depositAddress" VARCHAR(255),
    "percent" VARCHAR(10),
    "desc" TEXT,
    "coinVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Coin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'open',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "adminRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBalance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "coinId" INTEGER NOT NULL,
    "available" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    "onOrder" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    "staked" DECIMAL(18,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CopyTrader" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "photo" VARCHAR(255),
    "noTrades" VARCHAR(50) NOT NULL,
    "noCopiers" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "noWins" VARCHAR(50) NOT NULL,
    "rank" VARCHAR(50) NOT NULL,
    "strategyDesc" TEXT,
    "noLoss" VARCHAR(50) NOT NULL,
    "profit" VARCHAR(50) NOT NULL,
    "loss" VARCHAR(50) NOT NULL,
    "edate" VARCHAR(50) NOT NULL,
    "commission" VARCHAR(10) NOT NULL DEFAULT '100',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CopyTrader_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_inviteCode_key" ON "User"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_walletAddress_idx" ON "User"("walletAddress");

-- CreateIndex
CREATE INDEX "TransactionHistory_userId_idx" ON "TransactionHistory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Coin_coinName_key" ON "Coin"("coinName");

-- CreateIndex
CREATE INDEX "Coin_coinName_idx" ON "Coin"("coinName");

-- CreateIndex
CREATE INDEX "Ticket_userId_idx" ON "Ticket"("userId");

-- CreateIndex
CREATE INDEX "UserBalance_userId_coinId_idx" ON "UserBalance"("userId", "coinId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBalance_userId_coinId_key" ON "UserBalance"("userId", "coinId");

-- CreateIndex
CREATE INDEX "CopyTrader_name_idx" ON "CopyTrader"("name");

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "Coin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
