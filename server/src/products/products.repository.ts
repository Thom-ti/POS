import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find().lean().exec();
    if (products.length === 0) {
      throw new NotFoundException('No products found');
    }
    return products;
  }

  async searchProducts(keyword: string): Promise<Product[]> {
    const regex = new RegExp(keyword, 'i'); // case-insensitive
    return this.productModel
      .find({
        $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
      })
      .lean()
      .exec();
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).lean().exec();
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }
}
