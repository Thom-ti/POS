import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { CartItemsRepository } from './cart-items.repository';
import { CartItem, CartItemSchema } from './schema/cart-item.schema';
import { ProductsRepository } from 'src/products/products.repository';
import { Product, ProductSchema } from 'src/products/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartItem.name, schema: CartItemSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [CartItemsController],
  providers: [
    Logger,
    CartItemsService,
    CartItemsRepository,
    ProductsRepository,
  ],
})
export class CartItemsModule {}
