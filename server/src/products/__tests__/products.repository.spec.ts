import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProductsRepository } from '../products.repository';
import { Product, ProductDocument } from '../schema/product.schema';

describe('ProductsRepository', () => {
  let repository: ProductsRepository;

  const mockProducts = [
    {
      _id: '1',
      name: 'Test Product',
      imageUrl: 'https://example.com/image.jpg',
      price: 100,
      stock: 10,
      description: 'Example product',
    },
  ];

  const execMock = jest.fn();
  const leanMock = jest.fn().mockReturnValue({ exec: execMock });

  const mockModel: Partial<Record<keyof Model<ProductDocument>, any>> = {
    find: jest.fn().mockImplementation(() => ({
      lean: leanMock,
    })),
    findById: jest.fn().mockImplementation(() => ({
      exec: execMock,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsRepository,
        {
          provide: getModelToken(Product.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    repository = module.get<ProductsRepository>(ProductsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      execMock.mockResolvedValueOnce(mockProducts);

      const result = await repository.findAll();

      expect(mockModel.find).toHaveBeenCalled();
      expect(leanMock).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findByKeyword', () => {
    it('should return products matching keyword in name or description', async () => {
      execMock.mockResolvedValueOnce(mockProducts);

      const keyword = 'test';
      const regex = new RegExp(keyword, 'i');

      const result = await repository.findByKeyword(keyword);

      expect(mockModel.find).toHaveBeenCalledWith({
        $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
      });
      expect(leanMock).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findById', () => {
    it('should return a product by ID', async () => {
      execMock.mockResolvedValueOnce(mockProducts[0]);

      const result = await repository.findById('1');

      expect(mockModel.findById).toHaveBeenCalledWith('1');
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(mockProducts[0]);
    });
  });
});
