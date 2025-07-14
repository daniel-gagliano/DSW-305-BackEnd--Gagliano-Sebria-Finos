-- CreateTable
CREATE TABLE `Provincia` (
    `cod_provincia` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `costo_envio` DOUBLE NOT NULL,

    PRIMARY KEY (`cod_provincia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Localidad` (
    `id_localidad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `codigo_postal` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_localidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
