/*
  Warnings:

  - Added the required column `cod_provincia` to the `Localidad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `localidad` ADD COLUMN `cod_provincia` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Localidad` ADD CONSTRAINT `Localidad_cod_provincia_fkey` FOREIGN KEY (`cod_provincia`) REFERENCES `Provincia`(`cod_provincia`) ON DELETE RESTRICT ON UPDATE CASCADE;
