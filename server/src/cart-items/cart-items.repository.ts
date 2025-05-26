import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItem, CartItemDocument } from './schema/cart-item.schema';
import { Product, ProductDocument } from 'src/products/schema/product.schema';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

@Injectable()
export class CartItemsRepository {
  constructor(
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createCartItem(dto: CreateCartItemDto): Promise<CartItem> {
    // check product
    const product = await this.productModel.findById(dto.product).lean().exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // check quantity and stock
    if (dto.quantity > product.stock) {
      throw new BadRequestException(
        `Quantity exceeds available stock (${product.stock})`,
      );
    }

    // check cartItem
    const checkCartItem = await this.cartItemModel
      .findOne({ product: dto.product })
      .lean()
      .exec();

    if (checkCartItem) {
      throw new ConflictException('This item already exists in cart');
    }

    // add item to cart
    const cartItem = new this.cartItemModel({
      product: dto.product,
      quantity: dto.quantity,
    });

    return cartItem.save();
  }

  async findAllCartItems(): Promise<CartItem[]> {
    const cartItems = await this.cartItemModel
      .find()
      .populate('product')
      .exec();
    if (cartItems.length === 0) {
      throw new NotFoundException('No cartItems found');
    }
    return cartItems;
  }
}
