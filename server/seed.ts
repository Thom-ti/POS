import { connect, disconnect, model } from 'mongoose';
import * as dotenv from 'dotenv';
import { ProductSchema } from './src/products/schema/product.schema';
import { CartItemSchema } from './src/cart-items/schema/cart-item.schema';
import { products } from './mockdata/products';

dotenv.config();

const ProductModel = model('Product', ProductSchema);
const CartItemModel = model('CartItem', CartItemSchema);

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URL;
    if (!mongoUri) {
      throw new Error('MONGODB_URL is not defined in .env');
    }
    await connect(mongoUri);
    console.log('📡 Connected to MongoDB');

    await ProductModel.deleteMany();
    await CartItemModel.deleteMany();
    await ProductModel.insertMany(products);
    console.log('✅ Seeded product data successfully');
  } catch (error) {
    console.error('❌ Seed failed', error);
  } finally {
    await disconnect();
    process.exit();
  }
}

seed();
