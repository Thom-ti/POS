import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CartItemsRepository } from '../cart-items/cart-items.repository';
import { ProductsRepository } from '../products/products.repository';
import {
  CartItem,
  CartItemSchema,
} from '../cart-items/schema/cart-item.schema';
import { Product, ProductSchema } from '../products/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartItem.name, schema: CartItemSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [CheckoutController],
  providers: [Logger, CheckoutService, CartItemsRepository, ProductsRepository],
})
export class CheckoutModule {}
