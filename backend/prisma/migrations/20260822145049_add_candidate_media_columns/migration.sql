-- DropForeignKey
ALTER TABLE `application` DROP FOREIGN KEY `Application_candidateProfileId_fkey`;

-- DropForeignKey
ALTER TABLE `application` DROP FOREIGN KEY `Application_jobId_fkey`;

-- DropForeignKey
ALTER TABLE `candidateprofile` DROP FOREIGN KEY `CandidateProfile_userId_fkey`;

-- DropForeignKey
ALTER TABLE `company` DROP FOREIGN KEY `Company_userId_fkey`;

-- DropForeignKey
ALTER TABLE `companyimage` DROP FOREIGN KEY `CompanyImage_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `employment` DROP FOREIGN KEY `Employment_applicationId_fkey`;

-- DropForeignKey
ALTER TABLE `employment` DROP FOREIGN KEY `Employment_candidateId_fkey`;

-- DropForeignKey
ALTER TABLE `employment` DROP FOREIGN KEY `Employment_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `employment` DROP FOREIGN KEY `Employment_jobId_fkey`;

-- DropForeignKey
ALTER TABLE `job` DROP FOREIGN KEY `Job_companyId_fkey`;

-- AlterTable
ALTER TABLE `candidateprofile` ADD COLUMN `avatarUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employment` ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE `CandidateProfile` ADD CONSTRAINT `CandidateProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyImage` ADD CONSTRAINT `CompanyImage_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_candidateProfileId_fkey` FOREIGN KEY (`candidateProfileId`) REFERENCES `CandidateProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employment` ADD CONSTRAINT `Employment_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employment` ADD CONSTRAINT `Employment_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `CandidateProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employment` ADD CONSTRAINT `Employment_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employment` ADD CONSTRAINT `Employment_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
