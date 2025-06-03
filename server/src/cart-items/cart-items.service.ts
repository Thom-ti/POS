import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CartItemsRepository } from './cart-items.repository';
import { ProductsRepository } from 'src/products/products.repository';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
// import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(
    private readonly logger: Logger,
    private readonly cartItemsRepository: CartItemsRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async addItemToCart(dto: CreateCartItemDto) {
    try {
      // check product exists
      const product = await this.productsRepository.findById(dto.product);
      if (!product) {
        throw new NotFoundException(`Product with id ${dto.product} not found`);
      }

      // check quantity and stock
      if (product.stock === 0) {
        throw new BadRequestException('Product is out of stock');
      }

      if (dto.quantity > product.stock) {
        throw new BadRequestException(
          `Quantity exceeds available stock (${product.stock})`,
        );
      }

      // check cartItem
      const checkCartItem = await this.cartItemsRepository.findOne(dto.product);
      if (checkCartItem) {
        throw new ConflictException('This item already exists in cart');
      }

      return this.cartItemsRepository.create(dto);
    } catch (error) {
      this.logger.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  // update(id: number, updateCartItemDto: UpdateCartItemDto) {
  //   return `This action updates a #${id} cartItem`;
  // }
}
