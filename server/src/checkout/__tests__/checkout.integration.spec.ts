/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

import { CheckoutModule } from '../checkout.module';
import {
  CartItem,
  CartItemSchema,
} from '../../cart-items/schema/cart-item.schema';
import { Product, ProductSchema } from '../../products/schema/product.schema';

dotenv.config({ path: '.env.test' });
jest.setTimeout(30000);

describe('Checkout Integration (e2e) with MongoMemoryServer', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let connection: Connection;
  let productModel: Model<Product>;
  let cartItemModel: Model<CartItem>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CheckoutModule,
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: CartItem.name, schema: CartItemSchema },
          { name: Product.name, schema: ProductSchema },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    connection = moduleFixture.get<Connection>('DatabaseConnection');
    productModel = moduleFixture.get<Model<Product>>(
      getModelToken(Product.name),
    );
    cartItemModel = moduleFixture.get<Model<CartItem>>(
      getModelToken(CartItem.name),
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongod.stop();
    await app.close();
  });

  it('/checkout (POST) should successfully checkout items', async () => {
    const product = await productModel.create({
      name: 'Test Product',
      price: 100,
      stock: 50,
      description: 'Test product for checkout',
    });

    const cartItem = await cartItemModel.create({
      product: product._id,
      quantity: 2,
    });

    const payload = {
      cartItems: [
        {
          cartItemId: cartItem._id.toString(),
          product: product._id.toString(),
          quantity: 2,
        },
      ],
      paymentMethod: 'card',
    };

    const res = await request(app.getHttpServer())
      .post('/checkout')
      .send(payload)
      .expect(201);

    expect(res.body).toEqual({
      message: 'Checkout successful by card',
    });
  });

  it('should fail if stock is insufficient', async () => {
    const product = await productModel.create({
      name: 'Tenga',
      price: 100,
      stock: 1,
      description: 'Too little',
    });

    const cartItem = await cartItemModel.create({
      product: product._id,
      quantity: 5, // > stock
    });

    const payload = {
      cartItems: [
        {
          cartItemId: cartItem._id.toString(),
          product: product._id.toString(),
          quantity: 5,
        },
      ],
      paymentMethod: 'card',
    };

    const res = await request(app.getHttpServer())
      .post('/checkout')
      .send(payload)
      .expect(400);

    expect(res.body.message).toBe(
      `Quantity for Tenga exceeds stock (stock: 1)`,
    );
  });

  it('should return 404 if cartItemId does not exist', async () => {
    const res = await request(app.getHttpServer())
      .post('/checkout')
      .send({
        cartItems: [
          {
            cartItemId: '666666666666666666666666',
            product: '666666666666666666666666',
            quantity: 1,
          },
        ],
        paymentMethod: 'cash',
      })
      .expect(404);

    expect(res.body.message).toBe('Product 666666666666666666666666 not found');
  });
});
