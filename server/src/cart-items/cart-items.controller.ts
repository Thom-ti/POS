import { Controller, Get, Post, Body } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CartItemsRepository } from './cart-items.repository';
// import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart-items')
export class CartItemsController {
  constructor(
    private readonly cartItemsService: CartItemsService,
    private readonly cartItemsRepository: CartItemsRepository,
  ) {}

  @Post()
  addItemToCart(@Body() body: CreateCartItemDto) {
    return this.cartItemsRepository.createCartItem(body);
  }

  @Get()
  getAllCartItems() {
    return this.cartItemsRepository.findAllCartItems();
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCartItemDto: UpdateCartItemDto,
  // ) {
  //   return this.cartItemsService.update(+id, updateCartItemDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cartItemsService.remove(+id);
  // }
}
