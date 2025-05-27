import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productsRepository: ProductsRepository,
  ) {}

  @Get()
  findAll() {
    return this.productsRepository.findAll();
  }

  @Get('search')
  search(@Query('keyword') keyword: string) {
    return this.productsService.getProductsBySearching(keyword);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }
}
