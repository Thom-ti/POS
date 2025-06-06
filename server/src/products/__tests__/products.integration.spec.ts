/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ProductsModule } from '../products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schema/product.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });
jest.setTimeout(30000); // เพิ่ม timeout เผื่อ MongoMemory ช้า

describe('Products Integration (e2e) with MongoMemoryServer', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let productModel: Model<Product>;
  let connection: Connection;
  let createdProduct: any;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ProductsModule,
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: Product.name, schema: ProductSchema },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // ✅ ใช้ token ชื่อ 'DatabaseConnection' แทน
    connection = moduleFixture.get<Connection>('DatabaseConnection');

    productModel = moduleFixture.get<Model<Product>>(
      getModelToken(Product.name),
    );
    createdProduct = await productModel.create({
      name: 'Mock Product',
      price: 123,
      stock: 200,
      description: 'Test mock product for integration',
    });
  });

  afterAll(async () => {
    await connection.dropDatabase(); // ✅ ไม่ error แล้ว
    await connection.close();
    await mongod.stop();
    await app.close();
  });

  describe('/products (GET)', () => {
    it('should return array of products', async () => {
      const res = await request(app.getHttpServer()).get('/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Mock Product');
    });
  });

  describe('/products/search?keyword=Mock', () => {
    it('should return matching product', async () => {
      const res = await request(app.getHttpServer())
        .get('/products/search')
        .query({ keyword: 'Mock' });
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toContain('Mock');
    });
  });

  describe('/products/:id (GET)', () => {
    it('should return product by id', async () => {
      const res = await request(app.getHttpServer()).get(
        `/products/${createdProduct._id}`,
      );
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Mock Product');
    });
  });
});
