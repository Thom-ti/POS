import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly logger: Logger,
    private readonly productsRepository: ProductsRepository,
  ) {}

  getProductsBySearching(keyword: string) {
    try {
      if (!keyword || keyword.trim() === '') {
        throw new BadRequestException('Keyword is required');
      }

      return this.productsRepository.findByKeyword(keyword);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getProductById(id: string) {
    try {
      const product = await this.productsRepository.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      return product;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
