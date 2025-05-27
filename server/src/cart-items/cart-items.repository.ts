import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItem, CartItemDocument } from './schema/cart-item.schema';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

@Injectable()
export class CartItemsRepository {
  constructor(
    @InjectModel(CartItem.name) private cartItemsModel: Model<CartItemDocument>,
  ) {}

  async create(dto: CreateCartItemDto): Promise<CartItem> {
    // add item to cart
    const cartItem = new this.cartItemsModel({
      product: dto.product,
      quantity: dto.quantity,
    });

    return cartItem.save();
  }

  async findAll(): Promise<CartItem[]> {
    return this.cartItemsModel.find().populate('product').exec();
  }

  async findById(id: string): Promise<CartItem | null> {
    return this.cartItemsModel.findOne({ product: id }).lean().exec();
  }

  async deleteById(id: string): Promise<CartItem | null> {
    return this.cartItemsModel.findByIdAndDelete(id).lean().exec();
  }
}
