import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // <--- Indispensable pour injecter le Repository
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [TypeOrmModule] // Permet d'utiliser le repository Product ailleurs si besoin
})
export class ProductsModule {}