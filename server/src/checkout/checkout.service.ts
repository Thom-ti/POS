import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from '../products/products.repository';
import { CheckoutDto } from './dto/checkout.dto';
import { CartItemsRepository } from '../cart-items/cart-items.repository';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly logger: Logger,
    private readonly productsRepository: ProductsRepository,
    private readonly cartItemsRepository: CartItemsRepository,
  ) {}

  async checkout(dto: CheckoutDto) {
    try {
      for (const item of dto.cartItems) {
        const product = await this.productsRepository.findById(item.product);
        if (!product) {
          throw new NotFoundException(`Product ${item.product} not found`);
        }

        if (item.quantity > product.stock) {
          throw new BadRequestException(
            `Quantity for ${product.name} exceeds stock (stock: ${product.stock})`,
          );
        }

        // หัก stock
        product.stock -= item.quantity;
        await product.save();

        // ลบ CartItem
        await this.cartItemsRepository.deleteById(item.cartItemId);
      }

      if (dto.paymentMethod === 'cash') {
        return { message: 'Checkout successful by cash' };
      } else if (dto.paymentMethod === 'card') {
        return { message: 'Checkout successful by card' };
      } else if (dto.paymentMethod === 'qr') {
        return { message: 'Checkout successful by QR code' };
      } else {
        throw new BadRequestException('Invalid payment method');
      }
    } catch (error) {
      this.logger.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
