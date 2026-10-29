-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'AMOUNT');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discountType" "DiscountType" NOT NULL DEFAULT 'PERCENT';

-- AlterTable
ALTER TABLE "OrderDrinkItem" ADD COLUMN     "discountType" "DiscountType" NOT NULL DEFAULT 'PERCENT';

-- AlterTable
ALTER TABLE "OrderFoodItem" ADD COLUMN     "discountType" "DiscountType" NOT NULL DEFAULT 'PERCENT';
