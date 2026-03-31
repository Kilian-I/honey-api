import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv } from 'keyv';
import KeyvRedis from '@keyv/redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { BillingModule } from './billing/billing.module';
import { OrdersModule } from './orders/orders.module';
import { StockModule } from './stock/stock.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      stores: [
        new Keyv({
          store: new KeyvRedis('redis://localhost:6379'),
        }),
      ],
    }),  TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
    }), PaymentsModule, AuthModule, BillingModule, OrdersModule, StockModule, UsersModule, ProductsModule,
  ], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}