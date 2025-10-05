CREATE TABLE `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `phone` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NULL,
  `role` ENUM('CUSTOMER','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `passwordHash` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `User_phone_key` (`phone`)
);

CREATE TABLE `Address` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `label` VARCHAR(191) NOT NULL,
  `street` VARCHAR(191) NOT NULL,
  `city` VARCHAR(191) NOT NULL,
  `comment` VARCHAR(191) NULL,
  `lat` DOUBLE NULL,
  `lng` DOUBLE NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Address_userId_idx`(`userId`),
  CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `Category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `position` INT NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Category_position_idx`(`position`)
);

CREATE TABLE `Dish` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `priceCents` INT NOT NULL,
  `imageUrl` VARCHAR(191) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `categoryId` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Dish_categoryId_idx`(`categoryId`),
  CONSTRAINT `Dish_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `Order` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `status` ENUM('PENDING','PAID','COOKING','READY','DELIVERING','DONE','CANCELED') NOT NULL DEFAULT 'PENDING',
  `addressId` INT NULL,
  `totalCents` INT NOT NULL,
  `paymentId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Order_userId_idx`(`userId`),
  INDEX `Order_status_idx`(`status`),
  INDEX `Order_createdAt_idx`(`createdAt`),
  CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Order_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE `OrderItem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `orderId` INT NOT NULL,
  `dishId` INT NOT NULL,
  `qty` INT NOT NULL,
  `priceCents` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `OrderItem_orderId_idx`(`orderId`),
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_dishId_fkey` FOREIGN KEY (`dishId`) REFERENCES `Dish`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `RestaurantSetting` (
  `id` INT NOT NULL DEFAULT 1,
  `name` VARCHAR(191) NOT NULL DEFAULT 'Firdusi',
  `phone` VARCHAR(191) NULL,
  `address` VARCHAR(191) NULL,
  `isOpen` BOOLEAN NOT NULL DEFAULT true,
  `workingHours` JSON NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `RefreshToken` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `tokenHash` VARCHAR(191) NOT NULL,
  `userAgentHash` VARCHAR(191) NOT NULL,
  `ipHash` VARCHAR(191) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `revokedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  INDEX `RefreshToken_userId_idx`(`userId`),
  INDEX `RefreshToken_tokenHash_idx`(`tokenHash`),
  CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
