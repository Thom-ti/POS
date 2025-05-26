import { connect, disconnect, model } from 'mongoose';
import { ProductSchema } from './src/products/schema/product.schema';
import { CartItemSchema } from './src/cart-items/schema/cart-item.schema';
import { products } from './mockdata/products';

// เชื่อม schema กับ model แบบ manual เพราะไม่ผ่าน NestJS module
const ProductModel = model('Product', ProductSchema);
const CartItemModel = model('CartItem', CartItemSchema);

async function seed() {
  try {
    await connect('mongodb://localhost:27017/pos-db');

    console.log('📡 Connected to MongoDB');

    // ล้างข้อมูลเก่าก่อน
    await ProductModel.deleteMany();
    await CartItemModel.deleteMany();

    // mock data
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
