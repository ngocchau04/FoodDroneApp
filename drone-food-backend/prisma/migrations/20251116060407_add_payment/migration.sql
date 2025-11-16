/*
  Warnings:

  - You are about to drop the column `confirmationCode` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `providerTxnId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `method` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MOMO', 'VNPAY');

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "confirmationCode",
DROP COLUMN "provider",
DROP COLUMN "providerTxnId",
ADD COLUMN     "method" "PaymentMethod" NOT NULL,
ADD COLUMN     "paymentCode" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;
