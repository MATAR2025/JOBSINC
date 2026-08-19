ALTER TABLE `User` MODIFY `role` ENUM('CANDIDATE', 'EMPLOYEE', 'RECRUITER', 'ADMIN') NOT NULL DEFAULT 'CANDIDATE';

CREATE TABLE `Employment` (
    `id` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `candidateId` VARCHAR(191) NOT NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `Employment_applicationId_key`(`applicationId`),
    INDEX `Employment_candidateId_idx`(`candidateId`),
    INDEX `Employment_companyId_idx`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Employment` ADD CONSTRAINT `Employment_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Employment` ADD CONSTRAINT `Employment_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `CandidateProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Employment` ADD CONSTRAINT `Employment_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Employment` ADD CONSTRAINT `Employment_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
