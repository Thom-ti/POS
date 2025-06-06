/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as dotenv from 'dotenv';
import * as request from 'supertest';

import { CartItemsModule } from '../cart-items.module';
import { CartItem, CartItemSchema } from '../schema/cart-item.schema';
import { Product } from '../../products/schema/product.schema';

dotenv.config({ path: '.env.test' });
jest.setTimeout(30000);

describe('CartItems Integration (e2e) with MongoMemoryServer', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let connection: Connection;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let cartItemModel: Model<CartItem>;
  let productModel: Model<Product>;
  let createdItem: any;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CartItemsModule,
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: CartItem.name, schema: CartItemSchema },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    connection = moduleFixture.get<Connection>('DatabaseConnection');
    cartItemModel = moduleFixture.get<Model<CartItem>>(
      getModelToken(CartItem.name),
    );
    productModel = moduleFixture.get<Model<Product>>(
      getModelToken(Product.name),
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongod.stop();
    await app.close();
  });

  describe('/cart-items (POST)', () => {
    it('should add a cart item', async () => {
      const product = await productModel.create({
        name: 'Mock Product',
        price: 123,
        stock: 10,
        description: 'For cart test',
      });

      const createDto = {
        product: product._id.toString(),
        quantity: 2,
      };

      const res = await request(app.getHttpServer())
        .post('/cart-items')
        .send(createDto)
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body.product).toBe(createDto.product);
      expect(res.body.quantity).toBe(createDto.quantity);

      createdItem = res.body; // ✅ เก็บไว้ใช้ต่อ
    });

    it('should return 400 for invalid quantity', async () => {
      const product = await productModel.create({
        name: 'Invalid Quantity Test',
        price: 50,
        stock: 10,
        description: 'Test',
      });

      const res = await request(app.getHttpServer())
        .post('/cart-items')
        .send({ product: product._id.toString(), quantity: -1 });

      expect(res.status).toBe(400); // จาก ValidationPipe
    });
  });

  describe('/cart-items (GET)', () => {
    it('should return all cart items', async () => {
      const res = await request(app.getHttpServer()).get('/cart-items');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].product._id).toBe(createdItem.product); // ✅ เช็คด้วย createdItem
    });
  });

  describe('/cart-items/:id (DELETE)', () => {
    it('should delete a cart item by id', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/cart-items/${createdItem._id}`)
        .expect(200);

      expect(res.body).toHaveProperty('_id'); // ✅ รองรับ response เดิม
    });
  });
});
