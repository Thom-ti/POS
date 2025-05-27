import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CheckoutRepository } from './checkout.repository';
import { CartItemsRepository } from 'src/cart-items/cart-items.repository';
import { ProductsRepository } from 'src/products/products.repository';
import {
  CartItem,
  CartItemSchema,
} from 'src/cart-items/schema/cart-item.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartItem.name, schema: CartItemSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [CheckoutController],
  providers: [
    Logger,
    CheckoutService,
    CheckoutRepository,
    CartItemsRepository,
    ProductsRepository,
  ],
})
export class CheckoutModule {}
