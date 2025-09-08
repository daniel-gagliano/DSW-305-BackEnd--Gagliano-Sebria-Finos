/*
  Warnings:

  - Added the required column `rol` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `rol` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Linea_Pedido` (
    `id_articulo` INTEGER NOT NULL,
    `nro_pedido` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `sub_total` DOUBLE NOT NULL,

    PRIMARY KEY (`nro_pedido`, `id_articulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estado_Pedido` (
    `descripcion` VARCHAR(191) NOT NULL,
    `fecha_desde` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nro_pedido` INTEGER NOT NULL,

    PRIMARY KEY (`nro_pedido`, `fecha_desde`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `nro_pedido` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_pedido` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `precio_total` DOUBLE NOT NULL,
    `id_metodo` INTEGER NOT NULL,
    `nro_usuario` INTEGER NOT NULL,
    `id_localidad` INTEGER NOT NULL,

    PRIMARY KEY (`nro_pedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Linea_Pedido` ADD CONSTRAINT `Linea_Pedido_nro_pedido_fkey` FOREIGN KEY (`nro_pedido`) REFERENCES `Pedido`(`nro_pedido`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Linea_Pedido` ADD CONSTRAINT `Linea_Pedido_id_articulo_fkey` FOREIGN KEY (`id_articulo`) REFERENCES `Articulo`(`id_articulo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Estado_Pedido` ADD CONSTRAINT `Estado_Pedido_nro_pedido_fkey` FOREIGN KEY (`nro_pedido`) REFERENCES `Pedido`(`nro_pedido`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_id_metodo_fkey` FOREIGN KEY (`id_metodo`) REFERENCES `MetodoPago`(`id_metodo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_nro_usuario_fkey` FOREIGN KEY (`nro_usuario`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_id_localidad_fkey` FOREIGN KEY (`id_localidad`) REFERENCES `Localidad`(`id_localidad`) ON DELETE RESTRICT ON UPDATE CASCADE;
