/*
  Warnings:

  - You are about to drop the `_categorias_articulos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_categorias_articulos` DROP FOREIGN KEY `_CATEGORIAS_ARTICULOS_A_fkey`;

-- DropForeignKey
ALTER TABLE `_categorias_articulos` DROP FOREIGN KEY `_CATEGORIAS_ARTICULOS_B_fkey`;

-- DropTable
DROP TABLE `_categorias_articulos`;

-- CreateTable
CREATE TABLE `Categoria_Articulo` (
    `id_categoria` INTEGER NOT NULL,
    `id_articulo` INTEGER NOT NULL,

    PRIMARY KEY (`id_categoria`, `id_articulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Categoria_Articulo` ADD CONSTRAINT `Categoria_Articulo_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `Categoria`(`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categoria_Articulo` ADD CONSTRAINT `Categoria_Articulo_id_articulo_fkey` FOREIGN KEY (`id_articulo`) REFERENCES `Articulo`(`id_articulo`) ON DELETE RESTRICT ON UPDATE CASCADE;
