-- CreateTable
CREATE TABLE `MetodoPago` (
    `id_metodo` INTEGER NOT NULL AUTO_INCREMENT,
    `desc_metodo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_metodo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
