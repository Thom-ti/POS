import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItem, CartItemDocument } from './schema/cart-item.schema';
// import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectModel(CartItem.name)
    private readonly cartItemModel: Model<CartItemDocument>,
  ) {}

  // update(id: number, updateCartItemDto: UpdateCartItemDto) {
  //   return `This action updates a #${id} cartItem`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} cartItem`;
  // }
}
