import { IsMongoId, IsInt, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsMongoId()
  product: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
