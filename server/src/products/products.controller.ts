import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsRepository } from './products.repository';

@Controller('products')
export class ProductsController {
  constructor(private readonly productRepository: ProductsRepository) {}

  @Get()
  getAllProducts() {
    return this.productRepository.findAllProducts();
  }

  @Get('search')
  getProductsBySearching(@Query('keyword') keyword: string) {
    if (!keyword) {
      return this.productRepository.findAllProducts();
    }

    return this.productRepository.searchProducts(keyword);
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productRepository.findProductById(id);
  }
}
