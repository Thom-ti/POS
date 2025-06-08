import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name) private productsModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsModel.find().lean().exec();
  }

  async findByKeyword(keyword: string): Promise<Product[]> {
    const regex = new RegExp(keyword, 'i'); // case-insensitive
    return this.productsModel
      .find({
        $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
      })
      .lean()
      .exec();
  }

  async findById(id: string): Promise<Product | null> {
    return this.productsModel.findById(id).lean().exec();
  }
}
