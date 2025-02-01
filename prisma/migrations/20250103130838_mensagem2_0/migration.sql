-- CreateTable
CREATE TABLE `UserConversation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `otherUserId` INTEGER NOT NULL,
    `lastMessage` DATETIME(3) NOT NULL,
    `unreadMessages` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `UserConversation_userId_otherUserId_key`(`userId`, `otherUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserConversation` ADD CONSTRAINT `UserConversation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserConversation` ADD CONSTRAINT `UserConversation_otherUserId_fkey` FOREIGN KEY (`otherUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
