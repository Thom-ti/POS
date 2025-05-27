import {
  IsArray,
  IsMongoId,
  IsString,
  ValidateNested,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

class CheckoutItemDto {
  @IsMongoId()
  cartItemId: string;

  @IsMongoId()
  product: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CheckoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  cartItems: CheckoutItemDto[];

  @IsString()
  paymentMethod: string;
}
